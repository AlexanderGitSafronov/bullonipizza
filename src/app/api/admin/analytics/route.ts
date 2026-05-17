import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface DayPoint {
  date: string;
  orders: number;
  revenue: number;
}

async function requireAdmin() {
  const s = await getSessionFromCookies();
  return s?.role === "ADMIN" ? s : null;
}

export async function GET(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json(
      { ok: false, error: "forbidden" },
      { status: 403 }
    );
  }
  const url = new URL(req.url);
  const days = Math.max(7, Math.min(90, Number(url.searchParams.get("days")) || 14));

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({
      ok: true,
      timeline: [],
      topProducts: [],
      totals: { revenue: 0, orders: 0, avgOrder: 0 },
    });
  }
  try {
    const { prisma } = await import("@/lib/prisma");
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - (days - 1));

    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: start },
        status: { not: "CANCELLED" },
      },
      select: { createdAt: true, total: true, items: { select: { productId: true, quantity: true } } },
    });

    // Bucket by ISO day key.
    const buckets = new Map<string, DayPoint>();
    for (let d = 0; d < days; d += 1) {
      const day = new Date(start);
      day.setDate(start.getDate() + d);
      const key = day.toISOString().slice(0, 10);
      buckets.set(key, { date: key, orders: 0, revenue: 0 });
    }
    let totalRevenue = 0;
    for (const o of orders) {
      const key = o.createdAt.toISOString().slice(0, 10);
      const b = buckets.get(key);
      if (b) {
        b.orders += 1;
        b.revenue += Number(o.total);
      }
      totalRevenue += Number(o.total);
    }

    // Top products by quantity sold in the window.
    const counts = new Map<string, number>();
    for (const o of orders) {
      for (const it of o.items) {
        counts.set(it.productId, (counts.get(it.productId) ?? 0) + it.quantity);
      }
    }
    const topIds = [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    const products = topIds.length
      ? await prisma.product.findMany({
          where: { id: { in: topIds.map(([id]) => id) } },
          select: { id: true, nameUk: true, nameEn: true, nameRu: true, image: true },
        })
      : [];
    const topProducts = topIds.map(([id, qty]) => {
      const p = products.find((pp) => pp.id === id);
      return p
        ? {
            id,
            qty,
            nameUk: p.nameUk,
            nameEn: p.nameEn,
            nameRu: p.nameRu,
            image: p.image,
          }
        : null;
    }).filter(Boolean);

    return NextResponse.json({
      ok: true,
      timeline: [...buckets.values()],
      topProducts,
      totals: {
        revenue: totalRevenue,
        orders: orders.length,
        avgOrder: orders.length ? Math.round(totalRevenue / orders.length) : 0,
      },
    });
  } catch (err) {
    console.error("[admin analytics]", (err as Error).message);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}
