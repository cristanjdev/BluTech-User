import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

const UPDATED = "November 7, 2026";
const CONTACT_EMAIL = "blutech18@gmail.com";

export const Route = createFileRoute("/privacy")({
  component: Privacy,
  head: () => ({
    meta: [
      { title: "Privacy Policy | BluTech" },
      {
        name: "description",
        content:
          "How BluTech collects, uses and protects the information you share through blutechnology.org.",
      },
    ],
    links: [{ rel: "canonical", href: "https://www.blutechnology.org/privacy" }],
  }),
});

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-xl uppercase text-slate-900 dark:text-white sm:text-2xl">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
        {children}
      </div>
    </section>
  );
}

const strong = "font-semibold text-slate-900 dark:text-white";
const link =
  "text-slate-900 underline underline-offset-4 hover:text-sky-600 dark:text-white dark:hover:text-sky-400";

/** Privacy policy, written for the Philippine Data Privacy Act of 2012 (RA 10173). */
function Privacy() {
  return (
    <main className="min-h-screen bg-white px-6 py-16 dark:bg-slate-950 sm:py-24">
      <article className="mx-auto max-w-3xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to BluTech
        </Link>

        <span className="mt-10 block text-xs font-medium uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
          / Legal
        </span>
        <h1 className="mt-3 font-display text-[clamp(2.25rem,7vw,4rem)] uppercase leading-[0.9] text-slate-900 dark:text-white">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Last updated: {UPDATED}</p>

        <p className="mt-8 text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
          BluTech (<strong className={strong}>blutechnology.org</strong>) offers freelance web, app
          and software development, run by Cristan Jade Jumawan in the Philippines. This page
          explains what information the site collects, why, how it is protected, and the rights you
          have under the Data Privacy Act of 2012 (Republic Act No. 10173).
        </p>

        <Section title="1. What is collected">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className={strong}>Commission requests:</strong> your name, email address,
              project type, budget (optional) and message, only when you send the request form.
            </li>
            <li>
              <strong className={strong}>Abuse protection:</strong> your IP address is checked
              briefly when you send a request, to stop spam and repeated submissions. It is kept
              only in temporary memory and never saved to a database.
            </li>
            <li>
              <strong className={strong}>Settings on your device:</strong> your light/dark theme is
              saved in your browser&apos;s local storage. It stays on your device.
            </li>
          </ul>
          <p>
            The site does not use advertising, tracking cookies or analytics, and never sells your
            information.
          </p>
        </Section>

        <Section title="2. Why it is used">
          <p>
            Your request is used to reply to you, discuss your project and prepare a quote. It is
            processed with your consent, which you give by sending the form. If you become a client,
            the details are also kept as part of the project records.
          </p>
        </Section>

        <Section title="3. Where it is stored">
          <p>The site relies on a few service providers, who handle data only to run it:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className={strong}>Neon</strong> stores commission requests in a secure cloud
              database.
            </li>
            <li>
              <strong className={strong}>Resend</strong> delivers a copy of each request to
              BluTech&apos;s inbox by email.
            </li>
            <li>
              <strong className={strong}>Vercel</strong> hosts the website.
            </li>
            <li>
              <strong className={strong}>Google Fonts, jsDelivr, Simple Icons and Wikimedia</strong>{" "}
              deliver fonts and icons. Like any website, they receive your IP address when your
              browser downloads these files.
            </li>
          </ul>
        </Section>

        <Section title="4. How long it is kept">
          <p>
            Requests that don&apos;t become projects are kept no longer than two years. Client
            project records are kept as long as needed for the project, support and legal or tax
            obligations. You can ask for your data to be deleted at any time, unless the law
            requires it to be kept.
          </p>
        </Section>

        <Section title="5. How it is protected">
          <p>
            All connections to the site are encrypted (HTTPS). Requests can be read only by BluTech,
            the database requires a password, and the request form is protected against spam and
            abuse.
          </p>
        </Section>

        <Section title="6. Your rights">
          <p>
            Under the Data Privacy Act you have the right to be informed, to access your data, to
            object to its processing, to have it corrected, erased or blocked, to data portability,
            and to claim damages. To use any of these rights, email{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className={link}>
              {CONTACT_EMAIL}
            </a>
            . You will get a reply within 30 days.
          </p>
          <p>
            If you believe your data was mishandled, you may also file a complaint with the{" "}
            <a
              href="https://privacy.gov.ph"
              target="_blank"
              rel="noopener noreferrer"
              className={link}
            >
              National Privacy Commission
            </a>
            .
          </p>
        </Section>

        <Section title="7. Changes">
          <p>
            If this policy changes, the new version will be posted on this page with a new date.
          </p>
        </Section>
      </article>
    </main>
  );
}
