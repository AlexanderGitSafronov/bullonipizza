import { NextResponse } from "next/server";
import { orderApiSchema } from "@/lib/validation";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { getSessionFromCookies } from "@/lib/auth";

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
    const session = await getSessionFromCookies();
    const { prisma } = await import("@/lib/prisma");

    // Resolve product IDs by slug — cart items come from the public catalog
    // which uses slugs that are stable across sample data and DB seeding,
    // while productId may differ. This also prevents FK injection.
    const slugs = Array.from(new Set(data.items.map((i) => i.slug)));
    const products = await prisma.product.findMany({
      where: { slug: { in: slugs } },
      select: { id: true, slug: true },
    });
    const slugToId = new Map(products.map((p) => [p.slug, p.id]));
    const itemsToCreate = data.items
      .map((i) => {
        const id = slugToId.get(i.slug);
        if (!id) return null;
        return {
          productId: id,
          quantity: i.quantity,
          size: i.size ?? null,
          crust: i.crust ?? null,
          extras: i.extras ?? [],
          price: i.price,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    if (itemsToCreate.length === 0) {
      return NextResponse.json(
        { ok: false, error: "no_valid_items" },
        { status: 400 }
      );
    }

    const order = await prisma.order.create({
      data: {
        orderNumber: data.orderNumber,
        userId: session?.sub ?? null,
        customerName: data.name,
        phone: data.phone,
        address: data.address,
        comment: data.comment || null,
        subtotal: data.subtotal,
        deliveryFee: data.deliveryFee,
        total: data.total,
        items: { create: itemsToCreate },
      },
    });
    return NextResponse.json({
      ok: true,
      id: order.id,
      orderNumber: order.orderNumber,
    });
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
