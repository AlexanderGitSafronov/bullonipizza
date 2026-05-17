import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { addressUpdateSchema } from "@/lib/validation";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ID_RE = /^[A-Za-z0-9_-]{1,40}$/;

async function loadOwnedAddress(id: string, userId: string) {
  const { prisma } = await import("@/lib/prisma");
  const addr = await prisma.address.findUnique({ where: { id } });
  if (!addr || addr.userId !== userId) return null;
  return addr;
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 }
    );
  }
  const ip = clientIp(req);
  const rl = rateLimit(`address-w:${ip}`, { limit: 30, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429 }
    );
  }
  if (!ID_RE.test(params.id)) {
    return NextResponse.json(
      { ok: false, error: "bad_id" },
      { status: 400 }
    );
  }
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 }
    );
  }
  const parsed = addressUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "invalid_payload" },
      { status: 400 }
    );
  }
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { ok: false, error: "db_unavailable" },
      { status: 503 }
    );
  }
  try {
    const { prisma } = await import("@/lib/prisma");
    const existing = await loadOwnedAddress(params.id, session.sub);
    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "not_found" },
        { status: 404 }
      );
    }
    const address = await prisma.$transaction(async (tx) => {
      if (parsed.data.isDefault === true) {
        await tx.address.updateMany({
          where: {
            userId: session.sub,
            isDefault: true,
            id: { not: params.id },
          },
          data: { isDefault: false },
        });
      }
      return tx.address.update({
        where: { id: params.id },
        data: {
          ...(parsed.data.address !== undefined && {
            address: parsed.data.address,
          }),
          ...(parsed.data.label !== undefined && {
            label: parsed.data.label || null,
          }),
          ...(parsed.data.isDefault !== undefined && {
            isDefault: parsed.data.isDefault,
          }),
        },
      });
    });
    return NextResponse.json({ ok: true, address });
  } catch (err) {
    console.error("[addresses PATCH]", (err as Error).message);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 }
    );
  }
  if (!ID_RE.test(params.id)) {
    return NextResponse.json(
      { ok: false, error: "bad_id" },
      { status: 400 }
    );
  }
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { ok: false, error: "db_unavailable" },
      { status: 503 }
    );
  }
  try {
    const { prisma } = await import("@/lib/prisma");
    const existing = await loadOwnedAddress(params.id, session.sub);
    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "not_found" },
        { status: 404 }
      );
    }
    await prisma.$transaction(async (tx) => {
      await tx.address.delete({ where: { id: params.id } });
      // If the deleted address was the default, promote another one.
      if (existing.isDefault) {
        const next = await tx.address.findFirst({
          where: { userId: session.sub },
          orderBy: { createdAt: "desc" },
        });
        if (next) {
          await tx.address.update({
            where: { id: next.id },
            data: { isDefault: true },
          });
        }
      }
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[addresses DELETE]", (err as Error).message);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}
