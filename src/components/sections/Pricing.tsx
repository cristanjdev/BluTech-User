import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Plus,
  Minus,
  Info,
  Calculator,
  Laptop,
  Zap,
  Shield,
  Globe,
  Database,
  Cpu,
  Layers,
  Server,
  type LucideIcon,
} from "lucide-react";

interface Package {
  id: string;
  name: string;
  price: number;
  priceRange: string;
  description: string;
  features: string[];
  gradient: string;
}

const PACKAGES: Package[] = [
  {
    id: "basic",
    name: "Basic Website",
    price: 11500, // Midpoint for calculation
    priceRange: "₱8,000 – ₱15,000",
    description:
      "Ideal for student projects, personal brands, or small businesses needing a professional, high-performance presence.",
    features: [
      "Essential Brand Modules",
      "Responsive Design Framework",
      "Light Dynamic Content (Basic CMS)",
      "Secure Contact Form Integration",
    ],
    gradient: "from-sky-400 to-blue-500",
  },
  {
    id: "standard",
    name: "Standard Website",
    price: 26500, // Midpoint
    priceRange: "₱18,000 – ₱35,000",
    description:
      "Best for academic capstones, theses, or growing businesses that require integrated CMS and advanced interaction.",
    features: [
      "Advanced Dynamic Content Architecture",
      "Integrated CMS / Custom Admin Panel",
      "Professional SEO Structure",
      "Third-party API Integration",
      "Advanced User Interaction Modules",
    ],
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    id: "advanced",
    name: "Advanced System",
    price: 60000, // Starting point
    priceRange: "₱40,000 – ₱80,000+",
    description:
      "Complex full-stack systems for enterprise-grade business applications or advanced research-heavy academic projects.",
    features: [
      "Enterprise-grade Custom Systems",
      "Secure Authentication & Identity Management",
      "Multi-role Administrative Dashboard",
      "High-performance Database Integration",
      "Scalable Backend Architecture",
    ],
    gradient: "from-indigo-600 to-violet-700",
  },
];

interface AddOn {
  id: string;
  name: string;
  price: number;
  priceRange: string;
  icon: LucideIcon;
}

const ADD_ONS: AddOn[] = [
  {
    id: "extra-page",
    name: "Additional Module",
    price: 1500,
    priceRange: "₱1,000 – ₱2,000",
    icon: Layers,
  },
  {
    id: "admin-dash",
    name: "Admin Dashboard",
    price: 7500,
    priceRange: "₱5,000 – ₱10,000",
    icon: Laptop,
  },
  { id: "auth", name: "Authentication", price: 5000, priceRange: "₱3,000 – ₱7,000", icon: Shield },
  {
    id: "payment",
    name: "Payment (GCash/Stripe)",
    price: 8500,
    priceRange: "₱5,000 – ₱12,000",
    icon: Zap,
  },
  { id: "ai", name: "AI Integration", price: 14000, priceRange: "₱8,000 – ₱20,000", icon: Cpu },
  { id: "file", name: "File Handling", price: 3500, priceRange: "₱2,000 – ₱5,000", icon: Server },
  {
    id: "realtime",
    name: "Real-time Features",
    price: 10000,
    priceRange: "₱5,000 – ₱15,000",
    icon: Zap,
  },
  { id: "seo", name: "SEO Optimization", price: 5500, priceRange: "₱3,000 – ₱8,000", icon: Globe },
  {
    id: "design",
    name: "UI/UX Premium Design",
    price: 8500,
    priceRange: "₱5,000 – ₱12,000",
    icon: Layers,
  },
];

const TECH_STACK = {
  Frontend: ["React", "Next.js", "TypeScript", "TanStack", "Vue.js", "JavaScript"],
  Backend: ["Node.js", "Hono", "Express", "Python", "Django", "PHP / Laravel"],
  Database: ["PostgreSQL", "MySQL", "MongoDB", "Supabase", "Prisma", "Drizzle"],
  "UI & Styling": ["Tailwind CSS", "Framer Motion", "Radix UI", "Lucide", "CSS3"],
  "DevOps & Tools": ["Docker", "Git", "GitHub Actions", "Vercel", "Cloudflare", "AWS"],
  "AI & Innovation": ["OpenAI", "LangChain", "Vector DBs", "RAG Pipelines", "Automation"],
  "State Management": ["Zustand", "Redux", "Context API", "React Query"],
};

export function Pricing() {
  return (
    <section id="pricing" className="relative bg-[#F8FAFC] py-24 dark:bg-slate-900 md:py-40">
      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-16 md:mb-24">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-medium uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400"
          >
            / Investment
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 font-display text-[clamp(2.5rem,8vw,6rem)] uppercase leading-[0.9] text-slate-900 dark:text-white"
          >
            Pricing &<br />
            <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              Packages.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 max-w-lg text-lg text-slate-600 dark:text-slate-400"
          >
            Transparent packages and flexible add-ons tailored to your product&apos;s specific
            needs.
          </motion.p>
        </div>

        {/* Base Packages Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {PACKAGES.map((pkg, idx) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{
                scale: 1.05,
                zIndex: 10,
                transition: { type: "spring", stiffness: 400, damping: 17 },
              }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 transition-shadow duration-300 hover:border-sky-300 hover:shadow-2xl hover:shadow-sky-500/10 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20"
            >
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`inline-flex rounded-2xl bg-gradient-to-br ${pkg.gradient} p-3 text-white`}
                >
                  <Laptop className="h-6 w-6" />
                </div>
                <h3 className="font-display text-2xl uppercase text-slate-900 dark:text-white">
                  {pkg.name}
                </h3>
              </div>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{pkg.description}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="whitespace-nowrap text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                  {pkg.priceRange}
                </span>
              </div>

              <ul className="mt-8 space-y-4">
                {pkg.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Add-ons Section */}
        <div className="mt-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center md:text-left"
          >
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
              / Enhancements
            </span>
            <h3 className="mt-4 font-display text-3xl uppercase text-slate-900 dark:text-white md:text-4xl">
              Add-on Features
            </h3>
            <p className="mt-4 max-w-xl text-slate-600 dark:text-slate-400">
              Extend your project with specialized modules and advanced integrations.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {ADD_ONS.map((addon, idx) => {
              const Icon = addon.icon;
              return (
                <motion.div
                  key={addon.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="group flex flex-col items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 text-center transition-all duration-300 hover:border-sky-300 hover:shadow-xl hover:shadow-sky-500/5 dark:border-white/5 dark:bg-white/5 dark:hover:border-sky-500/30 sm:flex-row sm:p-5 sm:text-left"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition-colors group-hover:bg-sky-50 group-hover:text-sky-600 dark:bg-white/5 dark:text-slate-400 dark:group-hover:bg-sky-500/10 dark:group-hover:text-sky-400 sm:h-12 sm:w-12">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-xs font-semibold text-slate-900 dark:text-white sm:text-base">
                      {addon.name}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 sm:text-xs">
                      {addon.priceRange}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Tech Stack & Notes Section */}
        <div className="mt-32">
          <div className="grid gap-20 lg:grid-cols-12">
            {/* Tech Stack */}
            <div className="lg:col-span-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <span className="text-xs font-medium uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
                  / Expertise
                </span>
                <h3 className="mt-4 font-display text-3xl uppercase text-slate-900 dark:text-white md:text-4xl">
                  Technology Stack
                </h3>
              </motion.div>

              <div className="grid gap-6 sm:grid-cols-2">
                {Object.entries(TECH_STACK).map(([category, techs], idx) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="group rounded-3xl border border-slate-100 bg-slate-50/50 p-8 transition-all duration-300 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 dark:border-white/5 dark:bg-white/2 dark:hover:bg-white/5 dark:hover:shadow-none"
                  >
                    <div className="mb-6 flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]" />
                      <div className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white">
                        {category}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {techs.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:border-sky-500 hover:text-sky-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:hover:border-sky-400 dark:hover:text-sky-400"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Service Notes */}
            <div className="lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <span className="text-xs font-medium uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
                  / Terms
                </span>
                <h3 className="mt-4 font-display text-3xl uppercase text-slate-900 dark:text-white md:text-4xl">
                  Service Notes
                </h3>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                {[
                  {
                    title: "Pricing",
                    content: "Final price depends on complexity and revisions.",
                    icon: Info,
                  },
                  {
                    title: "Terms",
                    content: "30% down payment required before development.",
                    icon: Shield,
                  },
                  {
                    title: "Timeline",
                    content: "2–6 weeks depending on scope. Free minor revisions included.",
                    icon: Zap,
                  },
                ].map((note, idx) => (
                  <motion.div
                    key={note.title}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-white/5 dark:bg-white/2"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
                      <note.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {note.title}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                        {note.content}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
