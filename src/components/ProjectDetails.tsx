import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ImageOff } from "lucide-react";
import { isDarkLogo, techIcon } from "@/lib/tech-icons";
import { getLenis } from "@/components/SmoothScroll";
import { useFitTitle } from "@/hooks/use-fit-title";

/** What the detail window needs to know about a project; both project sections pass this shape */
export interface ProjectDetail {
  title: string;
  /** e.g. "Web App · 2025" */
  label: string;
  description: string;
  about: string;
  stack: string[];
  gradient: string;
  image_url?: string | null;
  proof_image_url?: string | null;
}

/** A project's technologies as a row of plain logos (names on hover), for small cards with no room for labels */
export function TechIconRow({
  items,
  limit = 6,
  className = "",
}: Readonly<{ items: string[]; limit?: number; className?: string }>) {
  // Variants share a logo (React Native uses React's): show each logo once
  const seen = new Set<string>();
  const withIcons = items.flatMap((tech) => {
    const icon = techIcon(tech);
    if (!icon || seen.has(icon)) return [];
    seen.add(icon);
    return [{ tech, icon }];
  });
  const shown = withIcons.slice(0, limit);
  const hidden = withIcons.length - shown.length;
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {shown.map(({ tech, icon }) => (
        <img
          key={tech}
          src={icon}
          alt={tech}
          title={tech}
          loading="lazy"
          decoding="async"
          draggable={false}
          className={`h-4 w-4 shrink-0 object-contain sm:h-[18px] sm:w-[18px] ${isDarkLogo(tech) ? "dark:invert" : ""}`}
        />
      ))}
      {hidden > 0 && (
        <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 sm:text-xs">
          +{hidden}
        </span>
      )}
    </div>
  );
}

/**
 * A project's technologies as small pills, each with its logo when one is known.
 * `tone="light"` is for pills placed on a dark picture or gradient.
 */
export function TechChips({
  items,
  limit,
  tone = "default",
  size = "md",
  className = "",
}: Readonly<{
  items: string[];
  limit?: number;
  tone?: "default" | "light";
  size?: "sm" | "md";
  className?: string;
}>) {
  const shown = limit ? items.slice(0, limit) : items;
  const hidden = items.length - shown.length;

  const pill =
    tone === "light"
      ? "border-white/25 bg-white/10 text-white backdrop-blur"
      : "border-slate-200 bg-slate-100 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300";
  const sizing =
    size === "sm"
      ? "gap-1 px-2 py-0.5 text-[10px] sm:px-2.5 sm:py-1 sm:text-xs"
      : "gap-1.5 px-3 py-1 text-xs sm:text-sm";
  const iconSize = size === "sm" ? "h-3 w-3 sm:h-3.5 sm:w-3.5" : "h-3.5 w-3.5 sm:h-4 sm:w-4";

  return (
    <div className={`flex flex-wrap gap-1.5 sm:gap-2 ${className}`}>
      {shown.map((tech) => {
        const icon = techIcon(tech);
        return (
          <span
            key={tech}
            className={`inline-flex items-center whitespace-nowrap rounded-full border font-medium ${pill} ${sizing}`}
          >
            {icon && (
              <img
                src={icon}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                draggable={false}
                // Black logos (Express, Vercel, Prisma) turn white on a dark background so they stay visible
                className={`shrink-0 object-contain ${
                  isDarkLogo(tech) ? (tone === "light" ? "invert" : "dark:invert") : ""
                } ${iconSize}`}
              />
            )}
            {tech}
          </span>
        );
      })}
      {hidden > 0 && (
        <span
          className={`inline-flex items-center whitespace-nowrap rounded-full border font-medium opacity-70 ${pill} ${sizing}`}
        >
          +{hidden}
        </span>
      )}
    </div>
  );
}

/** The window that opens when a project card is clicked: screenshot, a short summary, the full story and the stack */
export function ProjectDetailModal({
  project,
  onClose,
  onViewProof,
  zIndex = "z-[80]",
}: Readonly<{
  project: ProjectDetail | null;
  onClose: () => void;
  onViewProof?: () => void;
  zIndex?: string;
}>) {
  const [expanded, setExpanded] = useState(false);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const isOpen = !!project;
  const titleRef = useFitTitle<HTMLHeadingElement>(project?.title ?? "");

  // Each project opens with its story collapsed (on a phone); Escape closes; the page behind stays still
  useEffect(() => {
    setExpanded(false);
  }, [project?.title]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeRef.current();
    globalThis.addEventListener("keydown", onKey);
    const lenis = getLenis();
    lenis?.stop();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      globalThis.removeEventListener("keydown", onKey);
      lenis?.start();
      document.body.style.overflow = overflow;
    };
  }, [isOpen]);

  const paragraphs = (project?.about ?? "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    // The summary line is already shown above the story; don't print it twice
    .filter((p) => p !== project?.description);
  const longStory = paragraphs.join(" ").length > 220;

  const stack = project && project.stack.length > 0 && (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
        Tech stack
      </div>
      <TechChips items={project.stack} className="mt-3" />
    </div>
  );

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 ${zIndex} flex items-end justify-center bg-slate-950/70 backdrop-blur-sm sm:items-center sm:p-6`}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex max-h-[92svh] w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-900 sm:max-h-[88vh] sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/60 text-white backdrop-blur transition-colors hover:bg-slate-900/80 md:right-4 md:top-4 md:bg-slate-100 md:text-slate-600 md:hover:bg-slate-200 dark:md:bg-white/10 dark:md:text-slate-300 dark:md:hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="overflow-y-auto overscroll-contain" data-lenis-prevent>
              <div className="grid gap-6 p-4 sm:p-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:gap-8 md:p-8">
                {/* Screenshot, with the stack under it on wide screens so both columns end together */}
                <div className="flex flex-col gap-6">
                  <div
                    className={`relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-gradient-to-br ${project.gradient}`}
                  >
                    {project.image_url ? (
                      <>
                        {/* The same picture, blurred, fills any space the screenshot leaves at its sides */}
                        <img
                          src={project.image_url}
                          alt=""
                          aria-hidden="true"
                          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-xl"
                        />
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="relative h-full w-full object-contain"
                        />
                      </>
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-2 text-white/70">
                        <ImageOff className="h-10 w-10" strokeWidth={1.5} />
                        <span className="text-[10px] font-medium uppercase tracking-widest">
                          No preview
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="mt-auto hidden md:block">{stack}</div>
                </div>

                <div className="flex min-w-0 flex-col md:pr-8">
                  <span className="self-start rounded-full bg-sky-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-600 dark:text-sky-400">
                    {project.label}
                  </span>
                  <h3
                    ref={titleRef}
                    className="mt-3 break-words font-display uppercase leading-[0.95] text-slate-900 dark:text-white text-[length:min(var(--fit,100rem),1.5rem)] sm:text-[length:min(var(--fit,100rem),1.875rem)] md:text-[length:min(var(--fit,100rem),2.25rem)]"
                  >
                    {project.title}
                  </h3>
                  <p className="mt-4 text-sm font-medium leading-relaxed text-slate-800 dark:text-slate-200 sm:text-base">
                    {project.description}
                  </p>

                  {paragraphs.length > 0 && (
                    <div className="mt-4">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                        About this project
                      </div>
                      {/* On a phone a long story starts folded to four lines; wide screens have room for all of it */}
                      <div
                        className={`mt-2 space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400 ${
                          longStory && !expanded ? "line-clamp-4 md:line-clamp-none" : ""
                        }`}
                      >
                        {paragraphs.map((p, i) => (
                          <p
                            key={i}
                            className={
                              longStory && !expanded
                                ? "max-md:inline max-md:after:content-['_']"
                                : ""
                            }
                          >
                            {p}
                          </p>
                        ))}
                      </div>
                      {longStory && (
                        <button
                          type="button"
                          onClick={() => setExpanded((v) => !v)}
                          className="mt-2 text-xs font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 md:hidden"
                        >
                          {expanded ? "Show less" : "Read more"}
                        </button>
                      )}
                    </div>
                  )}

                  <div className="mt-6 md:hidden">{stack}</div>

                  {project.proof_image_url && onViewProof && (
                    <button
                      type="button"
                      onClick={onViewProof}
                      className="mt-6 inline-flex items-center gap-2 self-start rounded-full border border-sky-500/30 bg-sky-500/10 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-sky-600 transition-all hover:border-sky-500/50 hover:bg-sky-500/20 dark:text-sky-400 dark:hover:text-sky-300"
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
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
