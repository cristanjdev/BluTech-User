# BluTech — Portfolio & Commission Platform

BluTech is a freelance portfolio and commission platform built for showcasing services, projects, and accepting client project requests. The site features buttery-smooth animations, a modern dark/light theme, and a fully dynamic content system powered by a shared Neon PostgreSQL database.

## What It Does

- **Services (What I Do)** — A horizontally scrolling card section displaying offered services like Web Development, App Development, UI/UX Design, Backend & APIs, and Automation & AI. Content is dynamically managed from the admin panel.
- **Marquee Carousel** — A continuously scrolling ticker that mirrors the service titles, keeping the brand presence consistent across the page.
- **Recent Projects (Showcase)** — Featured projects displayed as flip cards with gradient backgrounds, tech stacks, and detailed modals. Admin-managed with a "featured" flag.
- **Complete Portfolio** — A full archive of all active projects with staggered reveal animations, category filters, and expandable detail modals.
- **Commission Form** — A contact modal where potential clients submit project requests with name, email, project type, budget, and message. Submissions are stored in the database and trigger an email notification via Resend.

## Tech Stack

- **Framework** — TanStack Start (React 19 + TanStack Router)
- **Hosting** — Vercel (Nitro `vercel` preset)
- **Database** — Neon PostgreSQL (serverless)
- **Styling** — Tailwind CSS v4, Framer Motion
- **Validation** — Zod
- **Email** — Resend
- **UI Components** — Radix UI, Lucide Icons, shadcn/ui

## Security

- Rate limiting on commission submissions: 3 per 10 min per IP (per server instance), plus database-backed limits of 3 per 10 min per email address and 30 per 10 min site-wide, which hold across instances
- Automatic IP blocking after repeated violations (per server instance)
- User text is stored as typed; it is escaped when placed into the notification email, and React escapes it on the page
- All queries are parameterized
- Spam and bot detection on form submissions
- Security headers (in `vercel.json`): CSP, HSTS, X-Frame-Options DENY, X-Content-Type-Options nosniff

## Content & images

The home page loads services and projects on the server (route loader), so the first HTML already contains the real content. If the database is unreachable, built-in placeholder content is shown instead.

Project screenshots are stored in the database as base64 data URLs by the admin app. They are not sent with the project list; each one is served by `/api/project-image/<id>?v=<updated_at>` and cached by the browser and the Vercel CDN.

The database schema is owned by the admin app (`blutech-admin`); this site only reads `services` and `projects` and inserts into `commissions`.

## Environment variables

| Name             | Purpose                                                                                                                |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`   | Neon connection string (required)                                                                                      |
| `RESEND_API_KEY` | Resend API key; without it, emails are skipped                                                                         |
| `RESEND_FROM`    | Sender, e.g. `BluTech <hello@blutechnology.org>` (needs a verified domain in Resend; defaults to Resend's test sender) |
| `NOTIFY_EMAIL`   | Where commission notifications go (defaults to the owner's address)                                                    |
| `ADMIN_URL`      | Link used in the email's "View in Admin Panel" button                                                                  |

## Scripts

`npm run dev` · `npm run build` · `npm run typecheck` · `npm run lint` · `npm test` · `npm run format`
