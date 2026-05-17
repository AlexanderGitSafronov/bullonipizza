import { NextResponse } from "next/server";
import { z } from "zod";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

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

// Admin-only in real life — wire to your auth before exposing.
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

  if (!/^[A-Za-z0-9_-]{1,40}$/.test(params.id)) {
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
      where: { id: params.id },
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
