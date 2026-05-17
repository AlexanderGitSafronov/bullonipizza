import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { promoCreateSchema } from "@/lib/promo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireAdmin() {
  const s = await getSessionFromCookies();
  return s?.role === "ADMIN" ? s : null;
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json(
      { ok: false, error: "forbidden" },
      { status: 403 }
    );
  }
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ ok: true, codes: [] });
  }
  const { prisma } = await import("@/lib/prisma");
  const codes = await prisma.promoCode.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ ok: true, codes });
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json(
      { ok: false, error: "forbidden" },
      { status: 403 }
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
  const parsed = promoCreateSchema.safeParse(raw);
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
    const exists = await prisma.promoCode.findUnique({
      where: { code: parsed.data.code },
      select: { id: true },
    });
    if (exists) {
      return NextResponse.json(
        { ok: false, error: "code_taken" },
        { status: 409 }
      );
    }
    const code = await prisma.promoCode.create({
      data: {
        code: parsed.data.code,
        kind: parsed.data.kind,
        amount: parsed.data.amount,
        minOrder: parsed.data.minOrder,
        maxUses: parsed.data.maxUses ?? null,
        expiresAt: parsed.data.expiresAt
          ? new Date(parsed.data.expiresAt)
          : null,
        isActive: parsed.data.isActive,
      },
    });
    return NextResponse.json({ ok: true, code });
  } catch (err) {
    console.error("[admin promo POST]", (err as Error).message);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}
