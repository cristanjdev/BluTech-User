import { useRef } from "react";
import { Code2, Smartphone, Palette, Server, Sparkles, Globe, Zap, Layers } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { ServiceRow } from "@/server/public-data";

const ICON_MAP: Record<string, typeof Code2> = {
  Code2,
  Smartphone,
  Palette,
  Server,
  Sparkles,
  Globe,
  Zap,
  Layers,
};

const FALLBACK_SERVICES = [
  {
    icon: "Code2",
    title: "Web Development",
    description:
      "High-performance React, Next.js & TanStack apps with smooth-as-silk interactions and pixel-perfect responsive layouts.",
    tags: ["React", "Next.js", "TanStack", "TypeScript", "Tailwind CSS"],
  },
  {
    icon: "Smartphone",
    title: "App Development",
    description:
      "Cross-platform mobile experiences in React Native and Expo — one codebase, native performance, ready for the App Store and Play Store.",
    tags: ["React Native", "Expo", "iOS", "Android"],
  },
  {
    icon: "Palette",
    title: "UI / UX Design",
    description:
      "Identity, interface, and motion design from the first wireframe to the final pixel. Design systems that scale with your brand.",
    tags: ["Figma", "Motion Design", "Design Systems", "Prototyping"],
  },
  {
    icon: "Server",
    title: "Backend & APIs",
    description:
      "Type-safe APIs, edge functions, and robust data models. From REST to tRPC, built to handle real-world traffic at scale.",
    tags: ["Node.js", "PostgreSQL", "tRPC", "Edge Functions", "Redis"],
  },
  {
    icon: "Globe",
    title: "Full-Stack Solutions",
    description:
      "End-to-end product engineering — from database schema to deployed frontend. One partner for your entire stack.",
    tags: ["React", "Node.js", "PostgreSQL", "Vercel", "Cloudflare"],
  },
  {
    icon: "Layers",
    title: "Database & Architecture",
    description:
      "Schema design, migrations, query optimization, and data modeling. Relational and NoSQL — whatever fits your product.",
    tags: ["PostgreSQL", "Drizzle", "Prisma", "MongoDB", "Neon"],
  },
  {
    icon: "Zap",
    title: "DevOps & Deployment",
    description:
      "CI/CD pipelines, containerization, edge deployments, and infrastructure as code. Ship fast, stay stable.",
    tags: ["Docker", "GitHub Actions", "Vercel", "Cloudflare Workers", "AWS"],
  },
  {
    icon: "Sparkles",
    title: "AI & Automation",
    description:
      "LLM integrations, agentic workflows, RAG pipelines, and smart automations that put your operations on autopilot.",
    tags: ["OpenAI", "LangChain", "RAG", "Workflows", "MCP"],
  },
];

export function Services({ services: rows }: Readonly<{ services?: ServiceRow[] }>) {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef });

  const services = rows && rows.length > 0 ? rows : FALLBACK_SERVICES;

  const totalServices = services.length;
  const scrollEnd = totalServices <= 5 ? "-74%" : `-${Math.min(85, 50 + totalServices * 5)}%`;
  const x = useTransform(scrollYProgress, [0, 1], ["0%", scrollEnd]);

  return (
    <section
      id="services"
      ref={targetRef}
      className="relative bg-white dark:bg-slate-950"
      style={{ height: `${Math.max(300, totalServices * 70)}svh` }}
    >
      <div className="sticky top-[76px] flex h-[calc(100svh-76px)] flex-col overflow-hidden py-6 md:py-8">
        {/* Header */}
        <div className="mx-auto w-full max-w-[1500px] px-6 md:px-12">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-end md:gap-6">
            <div className="md:col-span-8">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
                / Services
              </span>
              <h2 className="mt-3 font-display text-[clamp(2.5rem,10vw,8rem)] uppercase leading-[0.9] text-slate-900 dark:text-white md:mt-4 md:text-[clamp(3rem,8.2vw,8rem)]">
                What I Do.
              </h2>
              <div className="mt-4 flex flex-col gap-4 md:mt-6 md:flex-row md:items-center md:gap-6">
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 md:max-w-none md:text-base">
                  {totalServices} focused practices, one partner. Scroll horizontally to explore.
                </p>
                <div className="flex shrink-0 items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  <span className="h-px w-10 bg-slate-300 dark:bg-slate-600" />
                  <span>Scroll →</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block md:col-span-4" aria-hidden />
          </div>
        </div>

        {/* Horizontal track */}
        <div className="relative mt-4 flex min-h-0 flex-1 items-center md:mt-6">
          <motion.div style={{ x }} className="flex items-stretch gap-4 px-6 md:gap-8 md:px-12">
            {services.map((s) => (
              <ServiceCard
                key={s.title}
                icon={ICON_MAP[s.icon] ?? Code2}
                title={s.title}
                desc={s.description}
                tags={s.tags}
              />
            ))}
            <div className="w-[20vw] shrink-0" aria-hidden />
          </motion.div>
        </div>
        {/* Progress bar */}
        <div className="mx-auto mt-4 h-[2px] w-48 shrink-0 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700 md:mt-6 md:w-64">
          <motion.div
            style={{ scaleX: scrollYProgress, transformOrigin: "0% 50%" }}
            className="h-full w-full bg-gradient-to-r from-sky-400 to-blue-700"
          />
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  icon: Icon,
  title,
  desc,
  tags,
}: Readonly<{
  icon: typeof Code2;
  title: string;
  desc: string;
  tags: string[];
}>) {
  return (
    <div className="group relative flex h-auto w-[85vw] shrink-0 flex-col rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 transition-colors hover:border-sky-300 dark:border-slate-700 dark:from-slate-800 dark:to-slate-900 dark:hover:border-sky-500 sm:w-[82vw] sm:p-6 md:w-[38vw] md:p-9 lg:w-[34vw] lg:p-10">
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sky-200/50 blur-3xl dark:bg-sky-600/30" />
      </div>
      {/* Title + Icon row */}
      <div className="flex items-start gap-3 md:gap-4">
        <h3 className="min-w-0 flex-1 font-display text-[clamp(1.5rem,5.5vw,2.2rem)] uppercase leading-[0.95] text-slate-900 dark:text-white md:text-[clamp(1.8rem,3vw,2.6rem)]">
          {title}
        </h3>
        <div className="flex shrink-0 items-center justify-center text-blue-700 dark:text-sky-400">
          <Icon className="h-6 w-6 md:h-8 md:w-8" />
        </div>
      </div>
      {/* Description */}
      <p className="mt-3 line-clamp-3 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-300 md:mt-4 md:text-base">
        {desc}
      </p>
      {/* Tags pinned to bottom */}
      <div className="mt-auto flex flex-wrap gap-2 pt-4 md:pt-5">
        {tags.map((t) => (
          <span
            key={t}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
