import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { productCreateSchema } from "@/lib/admin-validation";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireAdmin() {
  const session = await getSessionFromCookies();
  if (!session || session.role !== "ADMIN") return null;
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "forbidden" },
      { status: 403 }
    );
  }
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ ok: true, products: [], categories: [] });
  }
  try {
    const { prisma } = await import("@/lib/prisma");
    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        include: { category: { select: { slug: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.category.findMany({ orderBy: { order: "asc" } }),
    ]);
    return NextResponse.json({ ok: true, products, categories });
  } catch (err) {
    console.error("[admin products GET]", (err as Error).message);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "forbidden" },
      { status: 403 }
    );
  }
  const ip = clientIp(req);
  const rl = rateLimit(`admin-write:${ip}`, { limit: 60, windowMs: 60_000 });
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
  const parsed = productCreateSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "invalid_payload" },
      { status: 400 }
    );
  }
  try {
    const { prisma } = await import("@/lib/prisma");
    const exists = await prisma.product.findUnique({
      where: { slug: parsed.data.slug },
      select: { id: true },
    });
    if (exists) {
      return NextResponse.json(
        { ok: false, error: "slug_taken" },
        { status: 409 }
      );
    }
    const product = await prisma.product.create({ data: parsed.data });
    return NextResponse.json({ ok: true, product });
  } catch (err) {
    console.error("[admin products POST]", (err as Error).message);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}
