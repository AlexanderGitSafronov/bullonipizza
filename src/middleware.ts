import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Security headers applied to every response. Edge middleware runs on
// the request before it reaches the route handler, so CSP, frame-options,
// referrer-policy etc. are guaranteed even for static assets.
const SECURITY_HEADERS: Record<string, string> = {
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy":
    "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  "X-DNS-Prefetch-Control": "on",
};

// CSP that lets the app boot but blocks obvious injection vectors.
// `unsafe-inline` is required for Next's inline boot script; `unsafe-eval`
// is required for Framer Motion in dev mode only.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.unsplash.com https://res.cloudinary.com",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
    res.headers.set(k, v);
  }
  res.headers.set("Content-Security-Policy", CSP);
  return res;
}

export const config = {
  matcher: [
    // Run on everything except _next assets and known static files.
    "/((?!_next/static|_next/image|favicon.ico|icons/|manifest.json|sw.js|workbox-).*)",
  ],
};
