import { NextResponse } from "next/server";
import { promoApplySchema, calculateDiscount } from "@/lib/promo";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Public endpoint: validate a promo code against a cart subtotal.
// Used on the checkout page when the user types a code.
export async function POST(req: Request) {
  const ip = clientIp(req);
  const rl = rateLimit(`promo:${ip}`, { limit: 30, windowMs: 60_000 });
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
  const parsed = promoApplySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "invalid_code" },
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
    const promo = await prisma.promoCode.findUnique({
      where: { code: parsed.data.code },
    });
    if (!promo || !promo.isActive) {
      return NextResponse.json(
        { ok: false, error: "not_found" },
        { status: 404 }
      );
    }
    if (promo.expiresAt && promo.expiresAt < new Date()) {
      return NextResponse.json(
        { ok: false, error: "expired" },
        { status: 410 }
      );
    }
    if (promo.maxUses && promo.uses >= promo.maxUses) {
      return NextResponse.json(
        { ok: false, error: "exhausted" },
        { status: 410 }
      );
    }
    const minOrder = Number(promo.minOrder);
    if (parsed.data.subtotal < minOrder) {
      return NextResponse.json(
        { ok: false, error: "min_order_not_met", minOrder },
        { status: 422 }
      );
    }
    const amount = Number(promo.amount);
    const discount = calculateDiscount(
      promo.kind,
      amount,
      parsed.data.subtotal
    );
    return NextResponse.json({
      ok: true,
      promo: {
        code: promo.code,
        kind: promo.kind,
        amount,
        discount,
      },
    });
  } catch (err) {
    console.error("[promo apply]", (err as Error).message);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}
