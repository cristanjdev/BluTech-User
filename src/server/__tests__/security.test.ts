import { beforeEach, describe, expect, it } from "vitest";
import {
  checkRateLimit,
  escapeHtml,
  isIpBlocked,
  isSpam,
  LIMITS,
  MAX_STRIKES,
  normalizeText,
  recordStrike,
  resetSecurityState,
} from "../security";

beforeEach(() => resetSecurityState());

describe("checkRateLimit", () => {
  it("allows the configured number of commissions, then blocks", () => {
    const t = 1_000_000;
    for (let i = 0; i < LIMITS.commission.maxRequests; i++) {
      expect(checkRateLimit("1.1.1.1", "commission", t + i).allowed).toBe(true);
    }
    expect(checkRateLimit("1.1.1.1", "commission", t + 10).allowed).toBe(false);
  });

  it("keeps commission timestamps for the full 10-minute window, even across a cleanup sweep", () => {
    const t = 1_000_000;
    for (let i = 0; i < 3; i++) checkRateLimit("2.2.2.2", "commission", t);
    // 6 minutes later: past the cleanup interval, still inside the window
    expect(checkRateLimit("2.2.2.2", "commission", t + 6 * 60_000).allowed).toBe(false);
    // Just past the window: allowed again
    expect(
      checkRateLimit("2.2.2.2", "commission", t + LIMITS.commission.windowMs + 1).allowed,
    ).toBe(true);
  });

  it("counts each IP separately", () => {
    for (let i = 0; i < 3; i++) checkRateLimit("3.3.3.3", "commission", 0);
    expect(checkRateLimit("4.4.4.4", "commission", 0).allowed).toBe(true);
  });
});

describe("recordStrike / isIpBlocked", () => {
  it("blocks an IP after repeated strikes, and unblocks it after an hour", () => {
    const t = 5_000_000;
    for (let i = 1; i < MAX_STRIKES; i++) expect(recordStrike("5.5.5.5", t)).toBe(false);
    expect(recordStrike("5.5.5.5", t)).toBe(true);
    expect(isIpBlocked("5.5.5.5", t + 1)).toBe(true);
    expect(isIpBlocked("5.5.5.5", t + 60 * 60_000 + 1)).toBe(false);
  });
});

describe("normalizeText", () => {
  it("keeps ordinary punctuation that the old filter rejected or mangled", () => {
    const msg =
      "I'd like to select a template from your list; budget is <flexible> -- O'Brien & Co.";
    expect(normalizeText(msg)).toBe(msg);
  });

  it("strips control characters and normalizes line breaks", () => {
    expect(normalizeText("  hi\u0000 there\r\nline 2\t ")).toBe("hi there\nline 2");
  });
});

describe("escapeHtml", () => {
  it("escapes characters that are special in HTML", () => {
    expect(escapeHtml(`<img src=x onerror="alert('x')">&`)).toBe(
      "&lt;img src=x onerror=&quot;alert(&#39;x&#39;)&quot;&gt;&amp;",
    );
  });
});

describe("isSpam", () => {
  it("allows a normal brief with a few reference links", () => {
    expect(
      isSpam("Something like https://a.com, https://b.com and https://c.com but in blue, please."),
    ).toBe(false);
  });

  it("flags spam keywords, link dumps and repeated characters", () => {
    expect(isSpam("Free money, click here now")).toBe(true);
    expect(isSpam(Array.from({ length: 6 }, (_, i) => `https://x${i}.com`).join(" "))).toBe(true);
    expect(isSpam("aaaaaaaaaaaaaaaa")).toBe(true);
  });
});
