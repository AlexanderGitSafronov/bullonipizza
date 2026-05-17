import { NextResponse } from "next/server";
import { sampleProducts } from "@/lib/sample-data";

export const runtime = "nodejs";
// Public catalog can be cached.
export const revalidate = 60;

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ products: sampleProducts });
  }
  try {
    const { prisma } = await import("@/lib/prisma");
    const products = await prisma.product.findMany({
      where: { isAvailable: true },
      include: { category: true },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ products });
  } catch (err) {
    console.error("[products GET] failed:", (err as Error).message);
    return NextResponse.json({ products: sampleProducts });
  }
}
