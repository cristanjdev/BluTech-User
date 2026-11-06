import { Resend } from "resend";
import { escapeHtml } from "./security";

const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || "blutech18@gmail.com";
const ADMIN_URL = process.env.ADMIN_URL || "https://blutechnology.org/admin";
/**
 * Resend's shared test sender only delivers to the Resend account's own address.
 * After verifying your domain in Resend, set RESEND_FROM (e.g. "BluTech <hello@blutechnology.org>").
 */
const FROM = process.env.RESEND_FROM || "BluTech <onboarding@resend.dev>";

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

interface CommissionData {
  name: string;
  email: string;
  projectType: string;
  budget: string | null;
  message: string;
}

const TYPE_LABELS: Record<string, string> = {
  web: "Web Development",
  app: "App Development",
  uiux: "UI / UX Design",
  backend: "Backend & APIs",
  automation: "Automation & AI",
  other: "Other",
};

export async function notifyNewCommission(data: CommissionData) {
  const resend = getResend();
  if (!resend) {
    const reason = "RESEND_API_KEY not set";
    console.warn(`${reason} — skipping email notification`);
    return { ok: false as const, reason };
  }

  const typeLabel = TYPE_LABELS[data.projectType] || data.projectType;
  // Everything placed into the HTML body is escaped; the subject is plain text.
  const h = {
    name: escapeHtml(data.name),
    email: escapeHtml(data.email),
    mailto: escapeHtml(encodeURIComponent(data.email).replace(/%40/g, "@")),
    typeLabel: escapeHtml(typeLabel),
    budget: data.budget ? escapeHtml(data.budget) : null,
    message: escapeHtml(data.message),
    adminUrl: escapeHtml(ADMIN_URL),
  };
  // Line breaks would end the subject header early; flatten them.
  const subjectName = data.name.replace(/[\r\n]+/g, " ");

  try {
    const result = await resend.emails.send({
      from: FROM,
      to: NOTIFY_EMAIL,
      replyTo: data.email,
      subject: `New Commission: ${typeLabel} — ${subjectName}`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:Arial,Helvetica,sans-serif">
  <div style="max-width:520px;margin:0 auto;padding:32px 20px">

    <!-- Header -->
    <div style="text-align:center;padding-bottom:24px;border-bottom:1px solid #1e293b">
      <h1 style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.5px">BLUTECH</h1>
      <p style="margin:6px 0 0;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:2px">New Commission</p>
    </div>

    <!-- Alert -->
    <div style="margin-top:24px;padding:16px 20px;background:linear-gradient(135deg,#0c4a6e,#0e7490);border-radius:12px">
      <p style="margin:0;font-size:14px;color:#e0f2fe">You have a new project request from <strong style="color:#ffffff">${h.name}</strong></p>
    </div>

    <!-- Details -->
    <div style="margin-top:24px;background:#1e293b;border-radius:12px;overflow:hidden">
      <div style="padding:14px 20px;border-bottom:1px solid #334155">
        <p style="margin:0 0 2px;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:1.5px">Client</p>
        <p style="margin:0;font-size:15px;color:#f1f5f9;font-weight:600">${h.name}</p>
      </div>
      <div style="padding:14px 20px;border-bottom:1px solid #334155">
        <p style="margin:0 0 2px;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:1.5px">Email</p>
        <a href="mailto:${h.mailto}" style="font-size:15px;color:#38bdf8;text-decoration:none">${h.email}</a>
      </div>
      <div style="padding:14px 20px;border-bottom:1px solid #334155">
        <p style="margin:0 0 2px;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:1.5px">Project Type</p>
        <p style="margin:0;font-size:15px;color:#f1f5f9">${h.typeLabel}</p>
      </div>
      ${
        h.budget
          ? `
      <div style="padding:14px 20px;border-bottom:1px solid #334155">
        <p style="margin:0 0 2px;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:1.5px">Budget</p>
        <p style="margin:0;font-size:15px;color:#f1f5f9">${h.budget}</p>
      </div>`
          : ""
      }
      <div style="padding:14px 20px">
        <p style="margin:0 0 6px;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:1.5px">Message</p>
        <p style="margin:0;font-size:14px;color:#cbd5e1;line-height:1.6;white-space:pre-wrap">${h.message}</p>
      </div>
    </div>

    <!-- CTA Button -->
    <div style="margin-top:28px;text-align:center">
      <a href="${h.adminUrl}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#0ea5e9,#2563eb);color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;border-radius:10px;letter-spacing:0.3px">
        View in Admin Panel
      </a>
    </div>

    <!-- Footer -->
    <div style="margin-top:32px;padding-top:20px;border-top:1px solid #1e293b;text-align:center">
      <p style="margin:0;font-size:11px;color:#475569">This is an automated notification from your BluTech commission form.</p>
      <p style="margin:6px 0 0;font-size:11px;color:#334155">Reply to this email to answer the client directly.</p>
    </div>

  </div>
</body>
</html>`,
    });
    if (result.error) {
      const reason = result.error.message || "Unknown Resend error";
      console.error("Email notification failed:", reason);
      return { ok: false as const, reason };
    }
    return { ok: true as const };
  } catch (err) {
    console.error("Email notification failed:", err);
    return { ok: false as const, reason: err instanceof Error ? err.message : "Unknown error" };
  }
}
