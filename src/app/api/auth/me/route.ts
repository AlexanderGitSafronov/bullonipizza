import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ user: null });
  }
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({
      user: { id: session.sub, email: session.email, role: session.role },
    });
  }
  try {
    const { prisma } = await import("@/lib/prisma");
    const user = await prisma.user.findUnique({
      where: { id: session.sub },
      select: { id: true, email: true, name: true, phone: true, role: true },
    });
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({
      user: { id: session.sub, email: session.email, role: session.role },
    });
  }
}
