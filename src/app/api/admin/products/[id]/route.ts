import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { productUpdateSchema } from "@/lib/admin-validation";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ID_RE = /^[A-Za-z0-9_-]{1,40}$/;

async function requireAdmin() {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "ADMIN") return null;
  return session;
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "forbidden" },
      { status: 403 }
    );
  }
  const ip = clientIp(req);
  const rl = rateLimit(`admin-write:${ip}`, { limit: 60, windowMs: 60_000 });
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
  const parsed = productUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "invalid_payload" },
      { status: 400 }
    );
  }
  try {
    const { prisma } = await import("@/lib/prisma");
    const product = await prisma.product.update({
      where: { id: params.id },
      data: parsed.data,
    });
    return NextResponse.json({ ok: true, product });
  } catch (err) {
    console.error("[admin product PATCH]", (err as Error).message);
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
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "forbidden" },
      { status: 403 }
    );
  }
  if (!ID_RE.test(params.id)) {
    return NextResponse.json(
      { ok: false, error: "bad_id" },
      { status: 400 }
    );
  }
  try {
    const { prisma } = await import("@/lib/prisma");
    // Soft delete — flip isAvailable. Hard delete would break the FK from
    // OrderItem and lose order history.
    await prisma.product.update({
      where: { id: params.id },
      data: { isAvailable: false },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin product DELETE]", (err as Error).message);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}
