import { motion } from "framer-motion";
import { Check, Laptop } from "lucide-react";

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
            Transparent packages tailored to your product&apos;s specific needs.
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
      </div>
    </section>
  );
}
