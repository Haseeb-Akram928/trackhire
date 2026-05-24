/**
 * Simple in-memory rate limiter for API routes.
 *
 * NOTE: On serverless platforms (Vercel), each function instance maintains
 * its own memory. This protects against rapid successive calls within the
 * same instance but does NOT persist across cold starts. For production-
 * grade rate limiting, swap with a Redis-backed store or Vercel Edge
 * Middleware rate limiting.
 */
const buckets = new Map();

/**
 * Checks whether a request from `identifier` is within the rate limit.
 * @param {string} identifier - Unique key (e.g. user ID + route name)
 * @param {object} options
 * @param {number} options.limit - Max requests allowed within the window (default: 10)
 * @param {number} options.windowMs - Window size in milliseconds (default: 60000)
 * @returns {{ allowed: boolean, retryAfter?: number }}
 */
export function checkRateLimit(identifier, { limit = 10, windowMs = 60000 } = {}) {
  const now = Date.now();
  const windowStart = now - windowMs;

  if (!buckets.has(identifier)) {
    buckets.set(identifier, []);
  }

  // Filter to keep only timestamps within the current window
  const timestamps = buckets.get(identifier).filter((t) => t > windowStart);
  buckets.set(identifier, timestamps);

  if (timestamps.length >= limit) {
    const retryAfter = Math.ceil((timestamps[0] + windowMs - now) / 1000);
    return { allowed: false, retryAfter };
  }

  timestamps.push(now);
  return { allowed: true };
}
