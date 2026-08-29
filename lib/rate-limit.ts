/**
 * Simple in-memory rate limiter.
 *
 * Why we need this: without it, someone could hammer the login form,
 * checkout, or contact form thousands of times per minute — either to
 * brute-force a password or to spam us. This tracks how many requests
 * an IP address has made in a time window and blocks it once it goes
 * over the limit.
 *
 * Note: this resets if the server restarts, and doesn't share state
 * across multiple server instances. That's fine for a single-server
 * Vercel/Node deployment at this scale. If the site grows large enough
 * to run many server instances at once, swap this for a Redis-backed
 * limiter (e.g. Upstash) later — the function signature below won't
 * need to change.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): { success: boolean; remaining: number } {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (existing.count >= limit) {
    return { success: false, remaining: 0 };
  }

  existing.count += 1;
  return { success: true, remaining: limit - existing.count };
}

// Periodically clear out expired buckets so the Map doesn't grow forever.
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt < now) buckets.delete(key);
  }
}, 5 * 60 * 1000).unref?.();

export function getClientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}
