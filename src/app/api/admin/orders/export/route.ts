import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function csvEscape(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json(
      { ok: false, error: "forbidden" },
      { status: 403 }
    );
  }
  if (!process.env.DATABASE_URL) {
    return new NextResponse("date,order,status,name,phone,total\n", {
      headers: { "Content-Type": "text/csv; charset=utf-8" },
    });
  }
  try {
    const { prisma } = await import("@/lib/prisma");
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 1000,
      select: {
        createdAt: true,
        orderNumber: true,
        status: true,
        customerName: true,
        phone: true,
        address: true,
        subtotal: true,
        deliveryFee: true,
        discount: true,
        promoCode: true,
        total: true,
        comment: true,
      },
    });

    const header = [
      "Date",
      "Order",
      "Status",
      "Name",
      "Phone",
      "Address",
      "Subtotal",
      "Delivery",
      "Discount",
      "Promo",
      "Total",
      "Comment",
    ];
    const lines = [header.join(",")];
    for (const o of orders) {
      lines.push(
        [
          o.createdAt.toISOString(),
          o.orderNumber,
          o.status,
          o.customerName,
          o.phone,
          o.address,
          Number(o.subtotal),
          Number(o.deliveryFee),
          Number(o.discount),
          o.promoCode ?? "",
          Number(o.total),
          o.comment ?? "",
        ]
          .map(csvEscape)
          .join(",")
      );
    }
    const csv = lines.join("\n") + "\n";
    const stamp = new Date().toISOString().slice(0, 10);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="bullonipizza-orders-${stamp}.csv"`,
      },
    });
  } catch (err) {
    console.error("[orders export]", (err as Error).message);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}
