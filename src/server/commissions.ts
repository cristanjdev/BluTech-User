import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";
import { neon } from "@neondatabase/serverless";
import { z } from "zod";
import {
  checkRateLimit,
  isIpBlocked,
  recordStrike,
  normalizeText,
  isSpam,
  LIMITS,
} from "./security";
import { notifyNewCommission } from "./email";

// Zod checks whether it may compile validators with `new Function`. The site's Content-Security-Policy
// forbids that, so the check shows up as a blocked-eval error in the console; skip it and use the normal path.
z.config({ jitless: true });

const PROJECT_TYPES = ["web", "app", "uiux", "backend", "automation", "other"] as const;

export const commissionSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  projectType: z.enum(PROJECT_TYPES),
  budget: z.string().trim().max(50).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Tell me a bit more").max(2000),
});

export type CommissionInput = z.infer<typeof commissionSchema>;

/** Most requests one email address may send per rate-limit window (shared across all server instances). */
const MAX_PER_EMAIL = LIMITS.commission.maxRequests;
/** Most requests the whole site accepts per window, so a bot rotating IPs and emails can't flood the inbox. */
const MAX_SITE_WIDE = 30;
const WINDOW_SECONDS = LIMITS.commission.windowMs / 1000;

const TOO_MANY = { ok: false as const, error: "Too many requests. Try again later." };

export const submitCommission = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => commissionSchema.parse(input))
  .handler(async ({ data }) => {
    const url = process.env.DATABASE_URL;
    if (!url) {
      console.error("DATABASE_URL not configured");
      return { ok: false as const, error: "Server is not configured" };
    }

    const ip = getRequestIP({ xForwardedFor: true }) ?? "unknown";

    // 1. IP block check (per instance)
    if (isIpBlocked(ip)) return TOO_MANY;

    // 2. Rate limit by IP (per instance)
    if (!checkRateLimit(ip, "commission").allowed) {
      recordStrike(ip);
      return TOO_MANY;
    }

    // 3. Spam detection
    if (isSpam(data.message) || isSpam(data.name)) {
      recordStrike(ip);
      return { ok: false as const, error: "Your message was flagged as spam." };
    }

    // 4. Store the text as typed (minus control characters). Queries are parameterized, and the
    //    email template escapes everything it inserts, so no HTML-escaping happens here.
    const name = normalizeText(data.name);
    const email = data.email.toLowerCase().trim();
    const message = normalizeText(data.message);
    const budget = data.budget ? normalizeText(data.budget) : null;

    try {
      const sql = neon(url);

      // 5. Rate limits that hold across server instances, checked against stored commissions.
      //    The commissions table is created and migrated by the admin app.
      const [counts] = await sql`
        SELECT
          count(*) FILTER (WHERE email = ${email})::int AS by_email,
          count(*)::int AS site_wide
        FROM commissions
        WHERE created_at > now() - make_interval(secs => ${WINDOW_SECONDS})
      `;
      if (counts && (counts.by_email >= MAX_PER_EMAIL || counts.site_wide >= MAX_SITE_WIDE)) {
        recordStrike(ip);
        return TOO_MANY;
      }

      await sql`INSERT INTO commissions (name, email, project_type, budget, message)
        VALUES (${name}, ${email}, ${data.projectType}, ${budget}, ${message})`;

      // Send email notification, but do not fail the commission submission if email fails.
      const emailResult = await notifyNewCommission({
        name,
        email,
        projectType: data.projectType,
        budget,
        message,
      });
      if (!emailResult.ok) {
        console.warn("Commission saved but email notification failed:", emailResult.reason);
      }

      return { ok: true as const, emailNotified: emailResult.ok };
    } catch (err) {
      console.error("submitCommission failed:", err);
      return { ok: false as const, error: "Could not save your request" };
    }
  });
