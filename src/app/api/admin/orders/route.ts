import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json(
      { ok: false, error: "forbidden" },
      { status: 403 }
    );
  }
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ ok: true, orders: [] });
  }
  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  try {
    const { prisma } = await import("@/lib/prisma");
    const orders = await prisma.order.findMany({
      where: status
        ? { status: status as any }
        : {
            status: {
              in: ["PENDING", "CONFIRMED", "PREPARING", "DELIVERING"],
            },
          },
      orderBy: { createdAt: "desc" },
      take: 100,
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
    return NextResponse.json({ ok: true, orders });
  } catch (err) {
    console.error("[admin orders GET]", (err as Error).message);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}
