/**
 * Security utilities for the user-facing site.
 * Covers: rate limiting, IP blocking, input normalization, HTML escaping, spam detection.
 *
 * The rate limiter and IP blocklist below live in memory, so on serverless hosting each
 * instance keeps its own counters and they reset when an instance is recycled. They are a
 * cheap first line of defense; the commission handler also enforces database-backed limits
 * that hold across instances.
 */

// ── Sliding window rate limiter ──

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export const LIMITS = {
  commission: { maxRequests: 3, windowMs: 10 * 60_000 }, // 3 submissions per 10 min
  api: { maxRequests: 30, windowMs: 60_000 }, // 30 reads per minute
} satisfies Record<string, RateLimitConfig>;

type Endpoint = keyof typeof LIMITS;

/** Each key remembers its own window, so pruning never drops entries that are still inside it. */
const windows = new Map<string, { timestamps: number[]; windowMs: number }>();

const SWEEP_EVERY_MS = 5 * 60_000;
let lastSweep = 0;

/** Drop expired entries. Runs lazily from the limiter instead of on a timer, which serverless runtimes may freeze. */
function sweep(now: number) {
  if (now - lastSweep < SWEEP_EVERY_MS) return;
  lastSweep = now;
  for (const [key, entry] of windows) {
    const live = entry.timestamps.filter((t) => t > now - entry.windowMs);
    if (live.length === 0) windows.delete(key);
    else entry.timestamps = live;
  }
  for (const [ip, until] of blockedUntil) {
    if (until <= now) blockedUntil.delete(ip);
  }
  for (const [ip, entry] of strikes) {
    if (now - entry.first > BLOCK_DURATION) strikes.delete(ip);
  }
}

export function checkRateLimit(
  ip: string,
  endpoint: Endpoint = "api",
  now: number = Date.now(),
): { allowed: boolean; remaining: number } {
  sweep(now);
  const config = LIMITS[endpoint];
  const key = `${ip}:${endpoint}`;
  const cutoff = now - config.windowMs;

  const entry = windows.get(key) ?? { timestamps: [], windowMs: config.windowMs };
  entry.timestamps = entry.timestamps.filter((t) => t > cutoff);

  if (entry.timestamps.length >= config.maxRequests) {
    windows.set(key, entry);
    return { allowed: false, remaining: 0 };
  }

  entry.timestamps.push(now);
  windows.set(key, entry);
  return { allowed: true, remaining: config.maxRequests - entry.timestamps.length };
}

// ── IP blocking for repeat offenders ──

const blockedUntil = new Map<string, number>();
const strikes = new Map<string, { count: number; first: number }>();

export const MAX_STRIKES = 15;
const BLOCK_DURATION = 60 * 60_000; // 1 hour

/** Count a violation against an IP. Returns true when this strike gets the IP blocked. */
export function recordStrike(ip: string, now: number = Date.now()): boolean {
  const entry = strikes.get(ip);

  if (!entry || now - entry.first > BLOCK_DURATION) {
    strikes.set(ip, { count: 1, first: now });
    return false;
  }

  entry.count += 1;
  if (entry.count >= MAX_STRIKES) {
    blockedUntil.set(ip, now + BLOCK_DURATION);
    strikes.delete(ip);
    return true;
  }
  return false;
}

export function isIpBlocked(ip: string, now: number = Date.now()): boolean {
  const until = blockedUntil.get(ip);
  if (until === undefined) return false;
  if (until <= now) {
    blockedUntil.delete(ip);
    return false;
  }
  return true;
}

/** Test helper: forget all counters. */
export function resetSecurityState() {
  windows.clear();
  blockedUntil.clear();
  strikes.clear();
  lastSweep = 0;
}

// ── Input normalization ──

/**
 * Clean user text before it is stored: trims it and removes invisible control characters
 * (keeping tabs and line breaks). Text is stored as typed — it is NOT HTML-escaped here.
 * Escape it with `escapeHtml` at the point it is placed into HTML (React escapes on its own).
 */
export function normalizeText(str: string): string {
  return (
    str
      // eslint-disable-next-line no-control-regex
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
      .replace(/\r\n?/g, "\n")
      .trim()
  );
}

/** Escape text for safe use inside HTML element content or a quoted attribute. */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ── Bot / spam detection ──

const SPAM_PATTERNS = [
  /\b(viagra|casino|lottery|crypto.*invest|click here|buy now|free money)\b/i,
  /(.)\1{10,}/i, // the same character repeated 11+ times
];

/** Clients often paste a few reference sites, so only a pile of links counts as spam. */
const MAX_LINKS = 5;

export function isSpam(text: string): boolean {
  const links = text.match(/https?:\/\//gi)?.length ?? 0;
  return links > MAX_LINKS || SPAM_PATTERNS.some((p) => p.test(text));
}
