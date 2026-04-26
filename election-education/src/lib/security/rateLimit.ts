/**
 * @module Rate Limiting
 * @description Rate limiting middleware using Upstash Redis.
 * Falls back to in-memory store if Redis is unavailable.
 */

import { NextRequest } from 'next/server';

/** Rate limit configuration */
interface RateLimitConfig {
  limit: number;
  window: string;
}

/** Rate limit result */
interface RateLimitResult {
  success: boolean;
  remaining: number;
  retryAfter?: number;
}

/** In-memory store for rate limiting (fallback when Redis is unavailable) */
const inMemoryStore = new Map<string, { count: number; resetAt: number }>();

/**
 * Parse window string to milliseconds
 * @param window - Window string (e.g., '1h', '15m', '1d')
 * @returns Duration in milliseconds
 */
const parseWindow = (window: string): number => {
  const match = window.match(/^(\d+)(s|m|h|d)$/);
  if (!match) return 3600000; // default 1 hour

  const value = parseInt(match[1], 10);
  const unit = match[2];

  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60000,
    h: 3600000,
    d: 86400000,
  };

  return value * (multipliers[unit] || 3600000);
};

/**
 * Get client identifier from request
 * @param request - Next.js request
 * @returns Client identifier string
 */
const getClientId = (request: NextRequest): string => {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
  const path = request.nextUrl.pathname;
  return `${ip}:${path}`;
};

/**
 * Apply rate limiting to an API request
 * @param request - The incoming Next.js request
 * @param config - Rate limit configuration
 * @returns Rate limit result
 */
export const rateLimit = async (
  request: NextRequest,
  config: RateLimitConfig
): Promise<RateLimitResult> => {
  const clientId = getClientId(request);
  const windowMs = parseWindow(config.window);

  try {
    // Try Upstash Redis first
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (redisUrl && redisToken) {
      return await redisRateLimit(clientId, config.limit, windowMs, redisUrl, redisToken);
    }
  } catch {
    // Fall through to in-memory
  }

  // Fallback: in-memory rate limiting
  return inMemoryRateLimit(clientId, config.limit, windowMs);
};

/**
 * Redis-based rate limiting via Upstash REST API
 */
const redisRateLimit = async (
  clientId: string,
  limit: number,
  windowMs: number,
  redisUrl: string,
  redisToken: string
): Promise<RateLimitResult> => {
  const key = `rl:${clientId}`;

  const response = await fetch(`${redisUrl}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${redisToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([
      ['INCR', key],
      ['PTTL', key],
    ]),
  });

  if (!response.ok) {
    throw new Error('Redis request failed');
  }

  const results = await response.json();
  const count = results[0]?.result || 0;
  const ttl = results[1]?.result || -1;

  // Set expiry on first request in window
  if (count === 1 || ttl === -1) {
    await fetch(`${redisUrl}/PEXPIRE/${key}/${windowMs}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${redisToken}` },
    });
  }

  if (count > limit) {
    const retryAfter = ttl > 0 ? Math.ceil(ttl / 1000) : Math.ceil(windowMs / 1000);
    return { success: false, remaining: 0, retryAfter };
  }

  return { success: true, remaining: limit - count };
};

/**
 * In-memory rate limiting (development/fallback)
 */
const inMemoryRateLimit = (
  clientId: string,
  limit: number,
  windowMs: number
): RateLimitResult => {
  const now = Date.now();
  const entry = inMemoryStore.get(clientId);

  if (!entry || now > entry.resetAt) {
    inMemoryStore.set(clientId, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  entry.count += 1;

  if (entry.count > limit) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { success: false, remaining: 0, retryAfter };
  }

  return { success: true, remaining: limit - entry.count };
};

// Clean up stale in-memory entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    inMemoryStore.forEach((value, key) => {
      if (now > value.resetAt) {
        inMemoryStore.delete(key);
      }
    });
  }, 300000);
}
