import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import {
  buildUploadSignature,
  cloudinaryConfigured,
} from "@/lib/cloudinary";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Returns a one-shot Cloudinary signature so the admin's browser can upload
// directly to Cloudinary without the API secret ever reaching the client.
export async function POST(req: Request) {
  const ip = clientIp(req);
  const rl = rateLimit(`upload:${ip}`, { limit: 30, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429 }
    );
  }

  const session = await getSessionFromCookies();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json(
      { ok: false, error: "forbidden" },
      { status: 403 }
    );
  }

  if (!cloudinaryConfigured()) {
    return NextResponse.json(
      { ok: false, error: "cloudinary_not_configured" },
      { status: 503 }
    );
  }

  try {
    const sig = buildUploadSignature({ folder: "bullonipizza/products" });
    return NextResponse.json({ ok: true, ...sig });
  } catch (err) {
    console.error("[upload-signature] failed:", (err as Error).message);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}
