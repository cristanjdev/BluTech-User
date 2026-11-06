import { afterEach, describe, expect, it, vi } from "vitest";

const send = vi.fn();
vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

afterEach(() => {
  send.mockReset();
  vi.unstubAllEnvs();
});

describe("notifyNewCommission", () => {
  it("escapes client input in the HTML and keeps the subject readable", async () => {
    vi.stubEnv("RESEND_API_KEY", "test-key");
    send.mockResolvedValue({ data: { id: "1" }, error: null });
    const { notifyNewCommission } = await import("../email");

    const result = await notifyNewCommission({
      name: "O'Brien <script>",
      email: "client@example.com",
      projectType: "web",
      budget: "<b>5k</b>",
      message: "Hello & welcome",
    });

    expect(result.ok).toBe(true);
    const payload = send.mock.calls[0][0];
    expect(payload.subject).toBe("New Commission: Web Development — O'Brien <script>");
    expect(payload.replyTo).toBe("client@example.com");
    expect(payload.html).toContain("O&#39;Brien &lt;script&gt;");
    expect(payload.html).toContain("&lt;b&gt;5k&lt;/b&gt;");
    expect(payload.html).toContain("Hello &amp; welcome");
    expect(payload.html).not.toContain("<script>");
  });

  it("skips sending when no API key is configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const { notifyNewCommission } = await import("../email");
    const result = await notifyNewCommission({
      name: "A",
      email: "a@b.co",
      projectType: "web",
      budget: null,
      message: "Hello there",
    });
    expect(result).toEqual({ ok: false, reason: "RESEND_API_KEY not set" });
    expect(send).not.toHaveBeenCalled();
  });
});
