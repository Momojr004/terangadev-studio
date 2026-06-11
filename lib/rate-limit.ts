/**
 * Minimal in-memory rate limiting for API routes.
 *
 * Per-process fixed window — adequate for the single-instance PM2 deploy
 * described in DEPLOYMENT.md. If the app is ever scaled horizontally, swap
 * this for a shared store (Redis / Upstash) since the bucket map lives in
 * process memory and is not shared across instances.
 */

const buckets = new Map<string, number[]>();

/** Best-effort client IP from the reverse-proxy headers. */
export function clientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

/**
 * Fixed-window limiter. Returns true when `key` has exceeded `max` hits
 * within `windowMs`. Namespace the key per endpoint (e.g. `contact:1.2.3.4`)
 * so different forms keep independent counters.
 */
export function isRateLimited(
  key: string,
  max: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  buckets.set(key, recent);

  // Opportunistic cleanup so the map can't grow unbounded.
  if (buckets.size > 5000) {
    for (const [k, times] of buckets) {
      if (times.every((t) => now - t >= windowMs)) buckets.delete(k);
    }
  }

  return recent.length > max;
}
