import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { promoUpdateSchema } from "@/lib/promo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ID_RE = /^[A-Za-z0-9_-]{1,40}$/;

async function requireAdmin() {
  const s = await getSessionFromCookies();
  return s?.role === "ADMIN" ? s : null;
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json(
      { ok: false, error: "forbidden" },
      { status: 403 }
    );
  }
  if (!ID_RE.test(params.id)) {
    return NextResponse.json({ ok: false, error: "bad_id" }, { status: 400 });
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
  const parsed = promoUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "invalid_payload" },
      { status: 400 }
    );
  }
  try {
    const { prisma } = await import("@/lib/prisma");
    const code = await prisma.promoCode.update({
      where: { id: params.id },
      data: {
        ...(parsed.data.kind !== undefined && { kind: parsed.data.kind }),
        ...(parsed.data.amount !== undefined && {
          amount: parsed.data.amount,
        }),
        ...(parsed.data.minOrder !== undefined && {
          minOrder: parsed.data.minOrder,
        }),
        ...(parsed.data.maxUses !== undefined && {
          maxUses: parsed.data.maxUses,
        }),
        ...(parsed.data.expiresAt !== undefined && {
          expiresAt: parsed.data.expiresAt
            ? new Date(parsed.data.expiresAt)
            : null,
        }),
        ...(parsed.data.isActive !== undefined && {
          isActive: parsed.data.isActive,
        }),
      },
    });
    return NextResponse.json({ ok: true, code });
  } catch (err) {
    console.error("[admin promo PATCH]", (err as Error).message);
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
  if (!(await requireAdmin())) {
    return NextResponse.json(
      { ok: false, error: "forbidden" },
      { status: 403 }
    );
  }
  if (!ID_RE.test(params.id)) {
    return NextResponse.json({ ok: false, error: "bad_id" }, { status: 400 });
  }
  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.promoCode.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin promo DELETE]", (err as Error).message);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}
