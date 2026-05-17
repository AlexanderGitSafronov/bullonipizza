import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 }
    );
  }
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ ok: true, orders: [] });
  }
  try {
    const { prisma } = await import("@/lib/prisma");
    const orders = await prisma.order.findMany({
      where: { userId: session.sub },
      orderBy: { createdAt: "desc" },
      take: 50,
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
    console.error("[orders mine] failed:", (err as Error).message);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}
