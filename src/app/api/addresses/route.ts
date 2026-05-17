import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { addressSchema } from "@/lib/validation";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_ADDRESSES_PER_USER = 10;

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 }
    );
  }
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ ok: true, addresses: [] });
  }
  try {
    const { prisma } = await import("@/lib/prisma");
    const addresses = await prisma.address.findMany({
      where: { userId: session.sub },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ ok: true, addresses });
  } catch (err) {
    console.error("[addresses GET]", (err as Error).message);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 }
    );
  }
  const ip = clientIp(req);
  const rl = rateLimit(`address:${ip}`, { limit: 20, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429 }
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
  const parsed = addressSchema.safeParse(raw);
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
    const count = await prisma.address.count({
      where: { userId: session.sub },
    });
    if (count >= MAX_ADDRESSES_PER_USER) {
      return NextResponse.json(
        { ok: false, error: "too_many_addresses" },
        { status: 409 }
      );
    }
    // The first address is implicitly default; otherwise honor the flag.
    const shouldBeDefault = count === 0 || !!parsed.data.isDefault;
    const address = await prisma.$transaction(async (tx) => {
      if (shouldBeDefault) {
        await tx.address.updateMany({
          where: { userId: session.sub, isDefault: true },
          data: { isDefault: false },
        });
      }
      return tx.address.create({
        data: {
          userId: session.sub,
          label: parsed.data.label || null,
          address: parsed.data.address,
          isDefault: shouldBeDefault,
        },
      });
    });
    return NextResponse.json({ ok: true, address });
  } catch (err) {
    console.error("[addresses POST]", (err as Error).message);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}
