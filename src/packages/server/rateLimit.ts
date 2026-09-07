type Hits = number[];

const hitsByKey = new Map<string, Hits>();

export interface IRateLimitOptions {
  key: string;
  limit: number;
  windowMs: number;
}

export interface IRateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

/**
 * Sliding-window counter held in process memory. That means it is per-instance: a
 * serverless host running several instances allows `limit` per instance, and a cold
 * start forgets everything. It is here to stop casual form spam, not a determined
 * attacker - point it at a shared store (Redis, Upstash) if that ever becomes the goal.
 */
export const rateLimit = ({
  key,
  limit,
  windowMs,
}: IRateLimitOptions): IRateLimitResult => {
  const now = Date.now();
  const windowStart = now - windowMs;

  const recentHits = (hitsByKey.get(key) ?? []).filter(
    (timestamp) => timestamp > windowStart,
  );

  if (recentHits.length >= limit) {
    hitsByKey.set(key, recentHits);

    const oldestHit = recentHits[0];
    return {
      allowed: false,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((oldestHit + windowMs - now) / 1000),
      ),
    };
  }

  recentHits.push(now);
  hitsByKey.set(key, recentHits);

  // Drop keys whose window has fully expired, otherwise the map grows with every
  // unique visitor for the lifetime of the process.
  for (const [existingKey, timestamps] of hitsByKey) {
    if (timestamps.every((timestamp) => timestamp <= windowStart)) {
      hitsByKey.delete(existingKey);
    }
  }

  return { allowed: true, retryAfterSeconds: 0 };
};
