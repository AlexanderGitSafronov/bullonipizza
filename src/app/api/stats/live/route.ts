import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Public anonymous endpoint — only aggregate counters, no PII.
export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({
      ok: true,
      ordersToday: 0,
      inOven: 0,
    });
  }
  try {
    const { prisma } = await import("@/lib/prisma");
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const [ordersToday, inOven] = await Promise.all([
      prisma.order.count({
        where: { createdAt: { gte: startOfDay } },
      }),
      prisma.order.count({
        where: { status: { in: ["PREPARING", "CONFIRMED"] } },
      }),
    ]);
    return NextResponse.json({ ok: true, ordersToday, inOven });
  } catch {
    return NextResponse.json({ ok: true, ordersToday: 0, inOven: 0 });
  }
}
