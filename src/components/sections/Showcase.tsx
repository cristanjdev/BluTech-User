import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RevealLines, FadeUp } from "@/components/RevealText";
import { ArrowUpRight, X } from "lucide-react";
import type { ProjectRow } from "@/server/public-data";
import { ProjectDetailModal, TechChips } from "@/components/ProjectDetails";
import { useFitTitle } from "@/hooks/use-fit-title";

/** Format a date string (YYYY-MM-DD or any parseable format) into M/D/YY */
function formatDate(raw: string): string {
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return `${d.getMonth() + 1}/${d.getDate()}/${String(d.getFullYear()).slice(-2)}`;
}

interface ProjectCell {
  id?: string;
  title: string;
  meta: string;
  description: string;
  className: string;
  gradient: string;
  image_url?: string | null;
  stack: string[];
  about: string;
  proof_image_url?: string | null;
  client_number?: string;
  service_type?: string;
  transaction_date?: string;
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.41-4.04-1.41a3.18 3.18 0 0 0-1.34-1.75c-1.09-.75.08-.74.08-.74a2.52 2.52 0 0 1 1.84 1.23 2.58 2.58 0 0 0 3.52 1 2.58 2.58 0 0 1 .77-1.62c-2.67-.31-5.47-1.34-5.47-5.95a4.64 4.64 0 0 1 1.24-3.23 4.31 4.31 0 0 1 .12-3.18s1.01-.32 3.3 1.23a11.36 11.36 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.46 1.03.5 2.2.12 3.26a4.64 4.64 0 0 1 1.23 3.23c0 4.62-2.8 5.64-5.48 5.94a2.89 2.89 0 0 1 .82 2.24v3.32c0 .32.21.7.83.58A12 12 0 0 0 12 .5z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.86-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.33V9h3.42v1.56h.05c.48-.9 1.64-1.86 3.37-1.86 3.6 0 4.27 2.37 4.27 5.46v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0z" />
    </svg>
  );
}

// The featured projects as they were last synced, with their screenshots stored in public/projects, so the
// section still shows the real work (pictures included) if the database cannot be reached
const FALLBACK_CELLS: ProjectCell[] = [
  {
    title: "Hopelink v2",
    meta: "Web App · 2026",
    description:
      "A community platform that connects people who want to give with people who need help.",
    about:
      "HopeLink was built for the CFC-GK mission in Misamis Oriental. It brings together three groups: donors who give, people who need support, and volunteers who deliver.\n\nDonors can offer items or answer requests for help, and people in need can look for available donations or ask for what they need. Volunteers take on deliveries and follow their schedule, while administrators check identities and keep everything fair, so help reaches the right people. The community can also see upcoming events.",
    stack: ["React", "Vite", "Tailwind CSS", "Supabase", "Express.js", "Zustand", "Framer Motion"],
    gradient: "from-sky-400 to-blue-600",
    image_url: "/projects/hopelink-v2.webp",
    className: "md:col-span-12",
  },
  {
    title: "LDCU Clinic",
    meta: "Web App · 2026",
    description: "Lets students and staff book medical and dental clinic visits online.",
    about:
      "Made for the clinics of Liceo de Cagayan University. Students and staff pick an available day, book a medical or dental visit from their phone or computer, and get an email confirmation.\n\nClinic teams see who is coming, set which days are open and how many people each day can take, and can move an appointment when needed, with the reason on record. Each campus has its own schedule, and sensitive actions are logged so nothing happens unnoticed.",
    stack: [
      "React",
      "TypeScript",
      "Vite",
      "Supabase",
      "PostgreSQL",
      "Tailwind CSS",
      "Zustand",
      "Zod",
    ],
    gradient: "from-emerald-400 to-cyan-600",
    image_url: "/projects/ldcu-clinic.webp",
    className: "md:col-span-12",
  },
  {
    title: "MSEUF Library Portal",
    meta: "Web App · 2026",
    description:
      "The online home of a university library, with a friendly AI librarian that answers student questions.",
    about:
      "The library of Manuel S. Enverga University Foundation in Lucena City, available online. Students and the public can browse the library's pages, search for books, read e-books and fill in forms such as appointments, registration and book renewal.\n\nA chat assistant named ROSe is on every page. It knows who the student is, looks up books on the spot and answers with details specific to the university. Librarians use a private area to manage books, reservations, students and forms, and to see how the library is being used.",
    stack: ["Next.js", "TypeScript", "Convex", "Google Gemini AI", "Tailwind CSS", "Zustand"],
    gradient: "from-violet-400 to-purple-600",
    image_url: "/projects/mseuf-library-portal.webp",
    className: "md:col-span-12",
  },
  {
    title: "Smart Cemetery Navigation",
    meta: "Web App · 2026",
    description: "An interactive map of a cemetery that makes finding plots and records easy.",
    about:
      "Made for the Bolonsori Cemetery. Instead of paper records, every plot can be found on a map and searched by name or location.\n\nUsers can explore the cemetery and look up records, while administrators keep the plots and records up to date.",
    stack: ["React", "TypeScript", "Vite", "Tailwind CSS", "Supabase", "Leaflet"],
    gradient: "from-cyan-400 to-sky-600",
    image_url: "/projects/smart-cemetery-navigation.webp",
    className: "md:col-span-12",
  },
  {
    title: "Dizkarte",
    meta: "Mobile App · 2026",
    description:
      "Philippines-focused mobile marketplace where people post everyday tasks and verified Taskers make offers.",
    about:
      "Clients post tasks like cleaning, repairs, assembly and gardening, and verified Taskers send offers to do them.\n\nEveryone is identity-checked, payments are protected, and ratings help people choose who to trust.",
    stack: ["Expo", "React Native", "Next.js", "TypeScript", "Supabase", "PostgreSQL", "Zod"],
    gradient: "from-violet-400 to-purple-700",
    image_url: "/projects/dizkarte.webp",
    className: "md:col-span-12",
  },
  {
    title: "Uy-Laurio Legal & Notarial Portal",
    meta: "Web App · 2026",
    description:
      "A portal where clients of a law and notarial office submit documents and follow their case.",
    about:
      "Clients send their legal documents online, see where their case stands, get notifications and book appointments.\n\nThe office manages everything from its own side. Each client sees only their own information, and sign-in works with email or Google.",
    stack: ["React", "TypeScript", "Vite", "Tailwind CSS", "Supabase", "Recharts"],
    gradient: "from-red-400 to-rose-700",
    image_url: "/projects/uy-laurio-legal-notarial-portal.webp",
    className: "md:col-span-12",
  },
];

export function Showcase({ projects }: Readonly<{ projects?: ProjectRow[] }>) {
  const [active, setActive] = useState<ProjectCell | null>(null);
  const [proofProject, setProofProject] = useState<ProjectCell | null>(null);
  // Featured projects arrive with the page (route loader); the built-in cards only show if the database is unreachable
  const cells = useMemo<ProjectCell[]>(
    () =>
      projects && projects.length > 0
        ? projects.map((r) => ({
            id: r.id,
            title: r.title,
            meta: r.meta || `${r.category} · ${r.year}`,
            description: r.description,
            className: "md:col-span-12",
            gradient: r.gradient,
            image_url: r.image_url,
            stack: r.stack,
            about: r.about,
            proof_image_url: r.proof_image_url,
            client_number: r.client_number,
            service_type: r.service_type,
            transaction_date: r.transaction_date,
          }))
        : FALLBACK_CELLS,
    [projects],
  );

  const handleScrollToProjects = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById("projects");
    if (element) {
      import("@/components/SmoothScroll").then(({ getLenis }) => {
        const lenis = getLenis();
        if (lenis) {
          lenis.scrollTo(element, {
            offset: -76,
            duration: 1.5,
            force: true,
            lock: true,
          });
        } else {
          const headerOffset = 76;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + globalThis.scrollY - headerOffset;

          globalThis.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      });
    }
  };

  return (
    <section
      id="work"
      className="relative bg-white dark:bg-slate-950"
      style={{ overflowX: "clip" }}
    >
      <div className="mx-auto max-w-7xl px-6 py-24 md:py-40">
        <div className="md:grid md:grid-cols-12 md:gap-16">
          {/* Sticky left rail */}
          <div className="md:col-span-5">
            <div className="md:sticky md:top-[108px]">
              <FadeUp>
                <span className="text-xs font-medium uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
                  / Selected Work
                </span>
              </FadeUp>
              <h2 className="mt-6 font-display text-[clamp(1.92rem,5.6vw,4.96rem)] uppercase leading-[0.92] text-slate-900 dark:text-white">
                <RevealLines lines={[<>Recent</>, <>Projects.</>]} />
              </h2>
              <FadeUp delay={0.3}>
                <p className="mt-8 max-w-md text-base text-slate-600 dark:text-slate-300 md:text-lg">
                  A taste of what's been built lately — and the tools used to build it. Click any
                  project to see the stack and story.
                </p>
              </FadeUp>
              <FadeUp delay={0.45}>
                <div className="mt-8 hidden items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 md:flex">
                  <span className="h-px w-10 bg-slate-300 dark:bg-slate-600" />
                  <span>{cells.length} case studies</span>
                </div>
              </FadeUp>
            </div>
          </div>

          {/* Right scrolling stack of cards */}
          <div className="mt-16 space-y-6 md:col-span-7 md:mt-0">
            {cells.map((c, i) => (
              <BentoCard key={c.id ?? c.title} cell={c} index={i} onOpen={() => setActive(c)} />
            ))}

            {/* View all projects + external profile buttons */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              className="flex w-full flex-row flex-wrap items-center justify-between gap-3 pt-4"
            >
              <a
                href="#projects"
                onClick={handleScrollToProjects}
                className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-400 to-blue-700 px-4 py-2.5 text-sm font-medium text-white shadow-[0_10px_40px_-10px_rgba(29,78,216,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_60px_-10px_rgba(29,78,216,0.7)] sm:px-6 sm:py-3 sm:text-base dark:shadow-[0_10px_40px_-10px_rgba(56,189,248,0.4)] dark:hover:shadow-[0_18px_60px_-10px_rgba(56,189,248,0.5)]"
              >
                <span className="relative z-10">View All Projects</span>
                <ArrowUpRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-300 to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </a>
              <div className="flex items-center gap-2 sm:gap-3">
                <a
                  href="https://github.com/blutech18"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center justify-center gap-1.5 rounded-full border border-slate-300/80 bg-white/70 px-4 py-2.5 text-sm font-medium text-slate-700 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-black/25 hover:bg-black/5 hover:text-black sm:gap-2 sm:px-5 sm:py-3 sm:text-base dark:border-slate-600 dark:bg-slate-800/40 dark:text-slate-200 dark:hover:border-white/30 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  <GitHubIcon />
                  <span className="relative z-10">Github</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/cjjumawan/"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center justify-center gap-1.5 rounded-full border border-slate-300/80 bg-white/70 px-4 py-2.5 text-sm font-medium text-[#0A66C2] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0A66C2]/55 hover:bg-[#0A66C2]/12 hover:text-[#004182] sm:gap-2 sm:px-5 sm:py-3 sm:text-base dark:border-slate-600 dark:bg-slate-800/40 dark:text-[#8ec6ff] dark:hover:border-[#0A66C2]/70 dark:hover:bg-[#0A66C2]/25 dark:hover:text-white"
                >
                  <LinkedInIcon />
                  <span className="relative z-10">Linkedin</span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <ProjectDetailModal
        project={active && { ...active, label: active.meta }}
        onClose={() => setActive(null)}
        onViewProof={() => {
          setProofProject(active);
          setActive(null);
        }}
        zIndex="z-50"
      />
      <ShowcaseProofModal project={proofProject} onClose={() => setProofProject(null)} />
    </section>
  );
}

function BentoCard({
  cell,
  index,
  onOpen,
}: Readonly<{
  cell: ProjectCell;
  index: number;
  onOpen: () => void;
}>) {
  const backTitleRef = useFitTitle<HTMLDivElement>(cell.title);
  // A screenshot that fails to load gives way to the project colour instead of a broken image
  const [imageFailed, setImageFailed] = useState(false);
  // The about text without the summary line it often starts with
  const story = (cell.about ?? "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p && p !== cell.description)
    .join(" ");
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: (index % 4) * 0.05 }}
      onClick={onOpen}
      className="group relative cursor-pointer"
    >
      <div className="relative h-64 [perspective:1200px] md:h-80">
        <div className="relative h-full w-full rounded-3xl transition-transform duration-700 [transform-style:preserve-3d] [will-change:transform] group-hover:[transform:rotateX(180deg)]">
          {/* Front */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl bg-slate-900 [backface-visibility:hidden] [transform:translateZ(0)]">
            {cell.image_url && !imageFailed ? (
              <img
                src={cell.image_url}
                loading="lazy"
                decoding="async"
                onError={() => setImageFailed(true)}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt={cell.title}
              />
            ) : (
              <div
                className={`absolute inset-0 bg-gradient-to-br ${cell.gradient} transition-transform duration-700 group-hover:scale-[1.04]`}
              />
            )}
            <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay [background-image:radial-gradient(circle_at_1px_1px,_white_1px,_transparent_0)] [background-size:24px_24px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-950/25 to-transparent" />
            {/* Keeps the label at the top readable on bright screenshots */}
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-blue-950/60 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-between p-7 md:p-9">
              <div className="flex items-start justify-between gap-3 text-white">
                <span className="rounded-full bg-black/40 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] backdrop-blur-sm md:text-xs">
                  {cell.meta}
                </span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
              <div className="line-clamp-2 break-words text-xs font-medium uppercase leading-relaxed tracking-[0.2em] text-white md:text-sm">
                {cell.title}
              </div>
            </div>
          </div>

          {/* Back */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl bg-slate-900 [backface-visibility:hidden] [transform:rotateX(180deg)_translateZ(0)]">
            <div className={`absolute inset-0 bg-gradient-to-br ${cell.gradient}`} />
            <div className="absolute inset-0 bg-blue-950/80" />
            <div className="absolute inset-0 flex flex-col p-5 sm:p-7 md:p-9">
              <div
                ref={backTitleRef}
                className="shrink-0 font-display uppercase leading-[0.95] text-white text-[length:min(var(--fit,100rem),1.5rem)] md:text-[length:min(var(--fit,100rem),1.875rem)]"
              >
                {cell.title}
              </div>
              <p className="mt-3 line-clamp-2 shrink-0 text-xs font-medium max-[359px]:line-clamp-1 leading-relaxed text-white/90 md:text-sm">
                {cell.description}
              </p>
              {/* The start of the full story fills the room above the stack on wide screens; the window has all of it */}
              {story && (
                <p className="mt-2 hidden shrink-0 text-sm leading-relaxed text-white/60 lg:line-clamp-2 xl:line-clamp-3">
                  {story}
                </p>
              )}
              {/* Every technology is listed; the text above gives way when the stack needs more rows */}
              <TechChips
                items={cell.stack}
                size="sm"
                tone="light"
                className="mt-auto shrink-0 pt-3 sm:pt-4"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Proof of Transaction Modal for Showcase ─── */
function ShowcaseProofModal({
  project,
  onClose,
}: Readonly<{ project: ProjectCell | null; onClose: () => void }>) {
  return (
    <AnimatePresence>
      {project && project.proof_image_url && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-md dark:bg-slate-950/90"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-[420px] overflow-hidden rounded-3xl shadow-2xl shadow-slate-300/50 dark:shadow-sky-500/10 md:max-w-[740px]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal background */}
            <div className="relative bg-white dark:bg-[#070b1a]">
              {/* Subtle gradient overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-sky-500/5 via-transparent to-blue-500/5 dark:to-blue-900/10" />

              {/* Close button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-500 transition-colors hover:bg-slate-300 hover:text-slate-700 dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/20 dark:hover:text-white sm:right-4 sm:top-4"
              >
                <X className="h-4 w-4" />
              </button>

              {/* ── Mobile: stacked / Desktop: side-by-side ── */}
              <div className="relative z-10 flex flex-col md:flex-row">
                {/* Left — Image */}
                <div className="flex flex-col items-center px-5 pt-6 md:w-1/2 md:px-8 md:py-8">
                  {/* Logo — mobile only */}
                  <div className="mb-5 flex justify-center md:hidden">
                    <img
                      src="/text-logo.png"
                      alt="BluTech"
                      className="h-10 w-auto object-contain"
                    />
                  </div>
                  {/* Proof Screenshot */}
                  <div className="relative h-[280px] w-[240px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-xl shadow-black/10 dark:border-white/10 dark:bg-[#0c1225] dark:shadow-black/30 sm:h-[340px] sm:w-[280px] md:h-[380px] md:w-full">
                    <img
                      src={project.proof_image_url}
                      alt="Proof of transaction"
                      className="h-full w-full object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <img
                        src="/blutech-logo.png"
                        alt=""
                        className="h-32 w-32 object-contain opacity-15 sm:h-40 sm:w-40 md:h-48 md:w-48"
                      />
                    </div>
                  </div>
                </div>

                {/* Right — Details */}
                <div className="flex flex-col justify-center px-5 pb-8 pt-6 md:w-1/2 md:px-8 md:py-8">
                  {/* Logo — desktop only */}
                  <div className="mb-6 hidden justify-center md:flex">
                    <img
                      src="/text-logo.png"
                      alt="BluTech"
                      className="h-12 w-auto object-contain"
                    />
                  </div>

                  {/* Divider — mobile only */}
                  <div className="mx-auto mb-5 h-px w-3/4 bg-gradient-to-r from-transparent via-sky-500/30 to-transparent dark:via-sky-500/40 md:hidden" />

                  {/* Client # and Date */}
                  <div className="flex items-start justify-center gap-8 text-center md:gap-10">
                    {project.client_number && (
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-white/50 sm:text-xs">
                          Client#
                        </p>
                        <p className="mt-1 text-lg font-black text-sky-600 dark:text-sky-400 sm:text-xl md:text-2xl">
                          {project.client_number}
                        </p>
                      </div>
                    )}
                    {project.transaction_date && (
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-white/50 sm:text-xs">
                          Date
                        </p>
                        <p className="mt-1 text-lg font-black text-sky-600 dark:text-sky-400 sm:text-xl md:text-2xl">
                          {formatDate(project.transaction_date)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Divider — desktop only */}
                  <div className="mx-auto my-5 hidden h-px w-3/4 bg-gradient-to-r from-transparent via-sky-500/30 to-transparent dark:via-sky-500/40 md:block" />

                  {/* Service Type */}
                  {project.service_type && (
                    <div className="mt-4 text-center md:mt-0">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-white/50 sm:text-xs">
                        Service Type
                      </p>
                      <p className="mt-1 bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-lg font-black uppercase text-transparent dark:from-sky-400 dark:to-blue-400 sm:text-xl md:text-2xl">
                        {project.service_type}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
