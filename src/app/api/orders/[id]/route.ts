import { NextResponse } from "next/server";
import { z } from "zod";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { getSessionFromCookies } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ID_RE = /^[A-Za-z0-9_-]{1,40}$/;
const ORDER_NUMBER_RE = /^BP-[A-Z0-9]{4,20}$/i;

const patchSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "PREPARING",
    "DELIVERING",
    "COMPLETED",
    "CANCELLED",
  ]),
});

// GET /api/orders/[id]
// `id` is either the order's primary id OR the human-readable orderNumber.
// Returns the order only if the requester owns it (or is admin).
// Used by /orders/[orderNumber] for live tracking.
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const ip = clientIp(req);
  const rl = rateLimit(`order-get:${ip}`, { limit: 120, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429 }
    );
  }

  if (!ID_RE.test(params.id) && !ORDER_NUMBER_RE.test(params.id)) {
    return NextResponse.json(
      { ok: false, error: "bad_id" },
      { status: 400 }
    );
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ ok: false, error: "db_unavailable" }, { status: 503 });
  }

  try {
    const session = await getSessionFromCookies();
    const { prisma } = await import("@/lib/prisma");
    const order = await prisma.order.findFirst({
      where: ORDER_NUMBER_RE.test(params.id)
        ? { orderNumber: params.id }
        : { id: params.id },
      include: {
        items: {
          select: {
            id: true,
            productId: true,
            quantity: true,
            size: true,
            crust: true,
            extras: true,
            price: true,
          },
        },
      },
    });
    if (!order) {
      return NextResponse.json(
        { ok: false, error: "not_found" },
        { status: 404 }
      );
    }
    // Allow when: caller is the owner, caller is admin, or order has no
    // owner (guest checkout — anyone with the order number can track it).
    const allowed =
      !order.userId ||
      (session && (session.sub === order.userId || session.role === "ADMIN"));
    if (!allowed) {
      return NextResponse.json(
        { ok: false, error: "forbidden" },
        { status: 403 }
      );
    }
    return NextResponse.json({ ok: true, order });
  } catch (err) {
    console.error("[orders GET] failed:", (err as Error).message);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const ip = clientIp(req);
  const rl = rateLimit(`patch:${ip}`, { limit: 30, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429 }
    );
  }

  const session = await getSessionFromCookies();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json(
      { ok: false, error: "forbidden" },
      { status: 403 }
    );
  }

  if (!ID_RE.test(params.id) && !ORDER_NUMBER_RE.test(params.id)) {
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
  const parsed = patchSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "invalid_payload" },
      { status: 400 }
    );
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ ok: true, mode: "client-only" });
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.order.update({
      where: ORDER_NUMBER_RE.test(params.id)
        ? { orderNumber: params.id }
        : { id: params.id },
      data: { status: parsed.data.status },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[orders PATCH] failed:", (err as Error).message);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}
