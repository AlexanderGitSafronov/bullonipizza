import { NextResponse } from "next/server";
import { orderApiSchema } from "@/lib/validation";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const ip = clientIp(req);
  const rl = rateLimit(`order:${ip}`, { limit: 8, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil((rl.resetAt - Date.now()) / 1000).toString(),
        },
      }
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

  const parsed = orderApiSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "invalid_payload" },
      { status: 400 }
    );
  }
  const data = parsed.data;

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ ok: true, mode: "client-only" });
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    const order = await prisma.order.create({
      data: {
        orderNumber: data.orderNumber,
        customerName: data.name,
        phone: data.phone,
        address: data.address,
        comment: data.comment || null,
        subtotal: data.subtotal,
        deliveryFee: data.deliveryFee,
        total: data.total,
        items: {
          create: data.items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            size: i.size ?? null,
            crust: i.crust ?? null,
            extras: i.extras ?? [],
            price: i.price,
          })),
        },
      },
    });
    return NextResponse.json({ ok: true, id: order.id });
  } catch (err) {
    // Don't leak internals.
    console.error("[orders POST] failed:", (err as Error).message);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}

// GET intentionally removed — listing orders should require auth.
// Use the admin dashboard with a future authenticated session.
