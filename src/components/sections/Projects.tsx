import { useRef, useState, useEffect, useMemo } from "react";
import { motion, useScroll, AnimatePresence, useInView } from "framer-motion";
import { ArrowUpRight, X, ChevronDown, ChevronUp, Search } from "lucide-react";
import type { ProjectRow } from "@/server/public-data";
import { getLenis } from "@/components/SmoothScroll";
import { useFitTitle } from "@/hooks/use-fit-title";
import {
  ProjectDetailModal,
  TechChips,
  TechIconRow,
  type ProjectDetail,
} from "@/components/ProjectDetails";

/** Format a date string (YYYY-MM-DD or any parseable format) into M/D/YY */
function formatDate(raw: string): string {
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw; // fallback to raw if unparseable
  return `${d.getMonth() + 1}/${d.getDate()}/${String(d.getFullYear()).slice(-2)}`;
}

interface Project {
  id?: string;
  title: string;
  category: string;
  year: string;
  description: string;
  stack: string[];
  gradient: string;
  image_url?: string | null;
  about: string;
  proof_image_url?: string | null;
  client_number?: string;
  service_type?: string;
  transaction_date?: string;
}

const FALLBACK_PROJECTS: Project[] = [
  {
    title: "Atlas Dashboard",
    category: "Web Application",
    year: "2024",
    description: "Realtime analytics dashboard for ops teams handling 12M+ events per day.",
    stack: ["React 19", "TanStack Query", "Postgres", "Edge Functions"],
    gradient: "from-sky-400 to-blue-600",
    about:
      "A realtime ops dashboard handling 12M+ events per day. Custom websocket layer, virtualized tables, and a design system shipped in 6 weeks.",
  },
  {
    title: "Hover Finance",
    category: "Mobile App",
    year: "2024",
    description: "Cross-platform fintech with spend insights and smart alerts.",
    stack: ["React Native", "Expo", "tRPC", "Postgres"],
    gradient: "from-blue-600 to-indigo-700",
    about:
      "Cross-platform mobile fintech with on-device categorization, push insights, and Plaid integration. 4.8★ launch rating.",
  },
  {
    title: "Lume Design",
    category: "Web Tool",
    year: "2023",
    description: "Browser-native collaborative vector editor with real-time multiplayer.",
    stack: ["WebGL", "Canvas", "Yjs CRDT", "Rust + WASM"],
    gradient: "from-cyan-400 to-sky-600",
    about:
      "A collaborative vector editor running entirely in the browser. Real-time multiplayer via CRDTs and a Rust render core for 120fps panning.",
  },
  {
    title: "North Landing",
    category: "Brand System",
    year: "2023",
    description: "Modular landing page system used by 14 startups.",
    stack: ["Next.js", "MDX", "Sanity", "Framer Motion"],
    gradient: "from-indigo-400 to-blue-600",
    about:
      "A modular landing page system used by 14 startups. CMS-driven blocks, design tokens, and a launch in under a day.",
  },
  {
    title: "Pulse API",
    category: "Backend",
    year: "2023",
    description: "High-performance API gateway with rate limiting and analytics.",
    stack: ["Node.js", "Redis", "PostgreSQL", "Docker"],
    gradient: "from-emerald-400 to-cyan-600",
    about:
      "High-performance API gateway handling 50k requests/second with intelligent rate limiting, caching, and real-time analytics dashboard.",
  },
  {
    title: "Nexus CRM",
    category: "SaaS Platform",
    year: "2022",
    description: "Enterprise CRM with AI-powered lead scoring and automation.",
    stack: ["React", "Python", "TensorFlow", "AWS"],
    gradient: "from-violet-400 to-purple-600",
    about:
      "Enterprise CRM platform with ML-powered lead scoring, email automation, and custom workflow builder. Serving 200+ enterprise clients.",
  },
  {
    title: "Quantum UI Kit",
    category: "Design System",
    year: "2022",
    description: "Component library with 200+ accessible, themeable components.",
    stack: ["TypeScript", "Tailwind", "Radix UI", "Storybook"],
    gradient: "from-rose-400 to-pink-600",
    about:
      "A comprehensive design system with 200+ components, full accessibility support, theming, and extensive documentation. Used by 50+ teams.",
  },
  {
    title: "StreamFlow",
    category: "Media Platform",
    year: "2022",
    description: "Video streaming platform with adaptive bitrate and live features.",
    stack: ["Next.js", "HLS", "WebRTC", "CloudFlare"],
    gradient: "from-amber-400 to-orange-600",
    about:
      "Video streaming platform with adaptive bitrate streaming, live broadcasting, and real-time chat. Processing 10TB of video monthly.",
  },
];

const INITIAL_COUNT = 4;

const toDetail = (p: Project): ProjectDetail => ({ ...p, label: `${p.category} · ${p.year}` });

export function Projects({ projects }: Readonly<{ projects?: ProjectRow[] }>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [proofProject, setProofProject] = useState<Project | null>(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [isAllProjectsModalOpen, setIsAllProjectsModalOpen] = useState(false);
  // Projects arrive with the page (route loader); the built-in list only shows if the database is unreachable
  const allProjects = useMemo<Project[]>(
    () =>
      projects && projects.length > 0
        ? projects.map((r) => ({
            id: r.id,
            title: r.title,
            category: r.category,
            year: r.year,
            description: r.description,
            stack: r.stack,
            gradient: r.gradient,
            image_url: r.image_url,
            about: r.about,
            proof_image_url: r.proof_image_url,
            client_number: r.client_number,
            service_type: r.service_type,
            transaction_date: r.transaction_date,
          }))
        : FALLBACK_PROJECTS,
    [projects],
  );

  useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const hasMore = visibleCount < allProjects.length;
  const visibleProjects = allProjects.slice(0, visibleCount);

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative overflow-x-hidden bg-[#F8FAFC] py-24 md:py-40 dark:bg-slate-900"
    >
      {/* Animated background gradient */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(56, 189, 248, 0.15), transparent)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-16 md:mb-24">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-medium uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400"
          >
            / All Projects
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 font-display text-[clamp(2.5rem,8vw,6rem)] uppercase leading-[0.9] text-slate-900 dark:text-white"
          >
            Complete
            <br />
            <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              Portfolio.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 max-w-lg text-lg text-slate-600 dark:text-slate-400"
          >
            A comprehensive archive of shipped work across web, mobile, backend, and design systems.
          </motion.p>
        </div>

        {/* Projects Grid with staggered reveal */}
        <motion.div id="projects-grid" layout className="grid gap-6 md:grid-cols-2 lg:gap-8">
          <AnimatePresence mode="popLayout">
            {visibleProjects.map((project, index) => (
              <ProjectCard
                key={project.id ?? project.title}
                id={`project-card-${index}`}
                project={project}
                index={index}
                onOpen={() => setActiveProject(project)}
                onViewProof={() => setProofProject(project)}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Load More & Search */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 flex flex-col items-center gap-6 text-center md:mt-14 w-full"
        >
          <div
            id="projects-action-bar"
            className="flex w-full flex-col sm:flex-row flex-wrap items-center justify-between gap-4"
          >
            <div className="flex flex-wrap justify-center gap-3">
              {hasMore && (
                <button
                  onClick={() => setVisibleCount((prev) => Math.min(prev + 4, allProjects.length))}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  View More
                  <ChevronDown className="h-4 w-4" />
                </button>
              )}
              {visibleCount > 4 && (
                <button
                  onClick={() => {
                    const newCount = Math.max(visibleCount - 4, 4);
                    setVisibleCount(newCount);
                    setTimeout(() => {
                      const lastCardId = `project-card-${newCount - 1}`;
                      const el = document.getElementById(lastCardId);
                      if (el) {
                        const lenis = getLenis();
                        if (lenis) {
                          lenis.scrollTo(el, { offset: -120, duration: 0.8 });
                        } else {
                          el.scrollIntoView({ behavior: "smooth", block: "center" });
                        }
                      }
                    }, 150);
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  View Less
                  <ChevronUp className="h-4 w-4" />
                </button>
              )}
            </div>

            <button
              onClick={() => setIsAllProjectsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-6 py-3 text-sm font-medium text-sky-600 transition-colors hover:bg-sky-500/20 dark:text-sky-400"
            >
              Search All Projects
              <Search className="h-4 w-4" />
            </button>
          </div>

          {hasMore && (
            <span className="text-xs text-slate-500 dark:text-slate-500">
              Showing {visibleCount} of {allProjects.length} projects
            </span>
          )}
        </motion.div>
      </div>

      {/* Project Modal */}
      <ProjectDetailModal
        project={activeProject && toDetail(activeProject)}
        onClose={() => setActiveProject(null)}
        onViewProof={() => {
          setProofProject(activeProject);
          setActiveProject(null);
        }}
      />

      {/* Proof of Transaction Modal */}
      <ProofModal project={proofProject} onClose={() => setProofProject(null)} />

      {/* All Projects Modal with Search */}
      <AllProjectsModal
        isOpen={isAllProjectsModalOpen}
        onClose={() => setIsAllProjectsModalOpen(false)}
        projects={allProjects}
        onOpenProject={(p) => setActiveProject(p)}
        onViewProof={(p) => setProofProject(p)}
      />
    </section>
  );
}

function ProjectCard({
  id,
  project,
  index,
  onOpen,
  onViewProof,
  isCompact = false,
}: Readonly<{
  id?: string;
  project: Project;
  index: number;
  onOpen: () => void;
  onViewProof: () => void;
  isCompact?: boolean;
}>) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });
  const titleRef = useFitTitle<HTMLHeadingElement>(project.title);

  // Unique staggered animation based on index
  const delay = (index % 4) * 0.1;
  const isEven = index % 2 === 0;

  return (
    <motion.div
      id={id}
      layout
      ref={cardRef}
      initial={{ opacity: 0, x: isEven ? -20 : 20, y: 20 }}
      animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      onClick={onOpen}
      // On a phone a small card becomes a row (picture left, text right) so its title has room to breathe
      className={`group relative cursor-pointer overflow-hidden ${isCompact ? "max-sm:flex max-sm:rounded-xl" : ""} rounded-2xl border border-slate-200 bg-white backdrop-blur-sm transition-colors hover:border-sky-500/30 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:hover:border-sky-500/30 dark:hover:bg-white/10`}
    >
      {/* Image placeholder with gradient */}
      <div
        className={`relative overflow-hidden bg-gradient-to-br ${project.gradient} ${isCompact ? "h-28 max-sm:h-auto max-sm:min-h-[5.5rem] max-sm:w-28 max-sm:shrink-0 sm:h-32 md:h-40" : "h-40 md:h-48"}`}
      >
        {project.image_url ? (
          <img
            src={project.image_url}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            alt={project.title}
          />
        ) : (
          <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay [background-image:radial-gradient(circle_at_1px_1px,_white_1px,_transparent_0)] [background-size:24px_24px]" />
        )}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-white via-white/70 to-transparent dark:from-[#080d19] dark:via-[#080d19]/70 dark:to-transparent ${isCompact ? "max-sm:hidden" : ""}`}
        />

        {/* Category and year badges on the image; a small card keeps them short so they never overlap */}
        <div
          className={`absolute flex items-center gap-2 ${isCompact ? "max-sm:hidden left-4 right-4 top-4 justify-between" : "left-5 right-5 top-5 justify-between md:left-6 md:right-6 md:top-6"}`}
        >
          <span
            className={`min-w-0 truncate rounded-full bg-black/40 font-medium uppercase tracking-wider text-white backdrop-blur-sm ${isCompact ? "px-2 py-0.5 text-[10px] md:px-3 md:py-1 md:text-xs" : "px-3 py-1 text-xs"}`}
          >
            {project.category}
          </span>
          <span
            className={`shrink-0 rounded-full bg-black/40 text-white backdrop-blur-sm ${isCompact ? "px-2 py-0.5 text-[10px] md:px-3 md:py-1 md:text-xs" : "px-3 py-1 text-xs"}`}
          >
            {project.year}
          </span>
        </div>

        {/* Hover arrow on image */}
        <div
          className={`absolute bottom-4 right-5 ${isCompact ? "max-sm:hidden" : ""} flex h-10 w-10 translate-y-2 items-center justify-center rounded-full border border-white/20 bg-white/10 opacity-0 backdrop-blur-sm transition-all group-hover:translate-y-0 group-hover:opacity-100 md:right-6`}
        >
          <ArrowUpRight className="h-4 w-4 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className={isCompact ? "min-w-0 flex-1 p-3 sm:p-4 md:p-5" : "p-4 md:p-6"}>
        {/* The title shrinks until its longest word fits on one line, so no word is cut in the middle.
            Small cards allow a third line so long titles aren't cut off. */}
        <h3
          ref={titleRef}
          className={`font-display uppercase leading-[1.1] text-slate-900 dark:text-white break-words ${isCompact ? "line-clamp-3 text-[length:max(0.75rem,min(var(--fit,100rem),1rem))] sm:text-[length:max(0.75rem,min(var(--fit,100rem),1.25rem))]" : "line-clamp-2 text-[length:max(0.875rem,min(var(--fit,100rem),1.25rem))] md:text-[length:max(0.875rem,min(var(--fit,100rem),1.5rem))]"}`}
        >
          {project.title}
        </h3>
        {isCompact && (
          <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-sky-600 dark:text-sky-400 sm:hidden">
            {project.category} · {project.year}
          </p>
        )}

        {/* Description */}
        <p
          className={`mt-2 leading-relaxed text-slate-600 dark:text-slate-400 ${isCompact ? "line-clamp-2 text-xs sm:text-sm" : "text-sm"}`}
        >
          {project.description}
        </p>

        {/* Stack tags */}
        {isCompact ? (
          <TechIconRow items={project.stack} className="mt-2 sm:mt-3" />
        ) : (
          <TechChips items={project.stack} limit={4} size="sm" className="mt-3" />
        )}

        {/* Proof of Transaction Button */}
        {project.proof_image_url && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewProof();
            }}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-sky-600 transition-all hover:bg-sky-500/20 hover:border-sky-500/50 dark:text-sky-400 dark:hover:text-sky-300"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            View Proof of Transaction
          </button>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Proof of Transaction Modal — matches the BluTech branded design ─── */
function ProofModal({
  project,
  onClose,
}: Readonly<{ project: Project | null; onClose: () => void }>) {
  return (
    <AnimatePresence>
      {project && project.proof_image_url && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-md dark:bg-slate-950/90"
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

/* ─── All Projects Search Modal ─── */
function AllProjectsModal({
  isOpen,
  onClose,
  projects,
  onOpenProject,
  onViewProof,
}: Readonly<{
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onOpenProject: (p: Project) => void;
  onViewProof: (p: Project) => void;
}>) {
  const [query, setQuery] = useState("");

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const filtered = projects.filter((p) => {
    const q = query.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.about && p.about.toLowerCase().includes(q)) ||
      p.stack.some((s) => s.toLowerCase().includes(q)) ||
      (p.service_type && p.service_type.toLowerCase().includes(q))
    );
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm md:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex h-[90vh] w-full max-w-7xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-2xl dark:border-slate-800 dark:bg-slate-950"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header / Search Area */}
            <div className="flex flex-col gap-4 border-b border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center md:p-6">
              <div className="flex items-center justify-between sm:hidden">
                <h3 className="font-display text-lg uppercase text-slate-900 dark:text-white">
                  All Projects
                </h3>
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by title, description, or tech stack (e.g., Packet Tracer, React)..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  autoFocus
                />
              </div>
              <button
                onClick={onClose}
                className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 sm:flex"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="custom-scrollbar flex-1 overflow-y-auto p-4 md:p-6" data-lenis-prevent>
              {filtered.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                  {filtered.map((project, index) => (
                    <ProjectCard
                      key={project.id ?? project.title}
                      project={project}
                      index={index}
                      isCompact={true}
                      onOpen={() => {
                        onOpenProject(project);
                      }}
                      onViewProof={() => {
                        onViewProof(project);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="rounded-full bg-slate-100 p-4 dark:bg-slate-800">
                    <Search className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-white">
                    No projects found
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Try adjusting your search query to find what you're looking for.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
