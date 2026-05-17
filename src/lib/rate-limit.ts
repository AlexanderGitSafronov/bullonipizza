// Lightweight in-memory rate limiter — fine for a single Vercel region.
// Use Upstash/Redis if you scale to multi-region.

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

const MAX_KEYS = 5_000;

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt < now) {
    if (buckets.size >= MAX_KEYS) {
      // Drop oldest-ish entries to cap memory.
      for (const [k, v] of buckets) {
        if (v.resetAt < now) buckets.delete(k);
        if (buckets.size < MAX_KEYS) break;
      }
    }
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: limit - existing.count,
    resetAt: existing.resetAt,
  };
}

export function clientIp(req: Request): string {
  const h = req.headers;
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return (
    h.get("x-real-ip") ??
    h.get("cf-connecting-ip") ??
    h.get("x-vercel-forwarded-for") ??
    "unknown"
  );
}
