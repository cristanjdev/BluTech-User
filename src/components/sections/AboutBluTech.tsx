import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

const ABOUT_CARDS = [
  {
    title: "Who We Are",
    desc: "Freelance commissions by BluTech — buttery-smooth interfaces, modern stacks, and product engineering that ships. We transform ideas into polished, production-ready digital products.",
  },
  {
    title: "Our Mission",
    desc: "To deliver exceptional digital experiences with meticulous attention to detail and a passion for innovation. Every project is an opportunity to push boundaries and exceed expectations.",
  },
  {
    title: "How We Work",
    desc: "Async-first, worldwide collaboration. Clear communication, transparent timelines, and weekly updates keep you in the loop. We treat your project like our own.",
  },
  {
    title: "Why BluTech",
    desc: "Years of experience across web, mobile, and backend development. From startups to established brands, we bring the same dedication and expertise to every engagement.",
  },
];

export function AboutBluTech() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={ref}
      className="relative bg-white dark:bg-slate-950"
      style={{ height: `${100 + ABOUT_CARDS.length * 50}svh` }}
    >
      <div className="sticky top-[76px] flex h-[calc(100svh-76px)] items-center overflow-hidden py-6 md:py-8">
        <div className="mx-auto grid h-full w-full max-w-[1400px] grid-rows-[auto_minmax(0,1fr)] gap-6 px-6 md:grid-cols-12 md:grid-rows-1 md:items-center md:gap-16">
          {/* Heading + progress — shows first on mobile */}
          <div className="w-full md:order-2 md:col-span-5">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
              / About Us
            </span>
            <div className="mt-4 flex items-center gap-5 md:mt-5">
              <img
                src="/blutech-logo.png"
                alt="BluTech"
                className="h-24 w-24 object-contain md:h-28 md:w-28 lg:h-32 lg:w-32"
              />
              <h2 className="font-display text-[clamp(2rem,8vw,4.2rem)] uppercase leading-[0.9] text-slate-900 dark:text-white md:text-[clamp(2rem,5vw,4.2rem)]">
                Meet
                <br />
                BluTech.
              </h2>
            </div>

            {/* Horizontal progress bar — compact */}
            <div className="mt-4 flex items-center gap-3 md:mt-6">
              <div className="relative h-[2px] w-40 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <motion.div
                  style={{ scaleX: scrollYProgress, transformOrigin: "0% 50%" }}
                  className="absolute inset-0 bg-gradient-to-r from-sky-400 to-blue-700"
                />
              </div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Scroll to advance
              </span>
            </div>
          </div>

          {/* Cards stack — shows second on mobile */}
          <div className="relative min-h-0 w-full md:order-1 md:col-span-7 flex items-center justify-center">
            <div className="grid w-full">
              {ABOUT_CARDS.map((card, i) => (
                <AboutCard
                  key={card.title}
                  card={card}
                  index={i}
                  total={ABOUT_CARDS.length}
                  progress={scrollYProgress}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutCard({
  card,
  index,
  total,
  progress,
}: Readonly<{
  card: (typeof ABOUT_CARDS)[number];
  index: number;
  total: number;
  progress: MotionValue<number>;
}>) {
  const enterStart = Math.max(0, (index - 1) / (total - 1));
  const enterEnd = index / (total - 1);

  const yInput = index === 0 ? [0, 1] : [enterStart, enterEnd, 1];
  const yOutput =
    index === 0
      ? ["0svh", `-${(total - 1 - index) * 6}svh`]
      : ["80svh", "0svh", `-${(total - 1 - index) * 6}svh`];

  const y = useTransform(progress, yInput, yOutput);

  return (
    <div className="col-start-1 row-start-1 grid w-full">
      <motion.div
        style={{ y, zIndex: index }}
        className="flex w-full flex-col origin-top overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-sky-50 px-5 pb-5 pt-3 shadow-[0_30px_80px_-40px_rgba(56,189,248,0.25)] dark:border-slate-700 dark:from-slate-800 dark:to-slate-900 dark:shadow-[0_30px_80px_-40px_rgba(56,189,248,0.15)] sm:px-6 sm:pb-6 sm:pt-4 md:px-9 md:pb-9 md:pt-5"
      >
        <div className="flex items-center justify-between">
          <span className="font-display text-sm tabular-nums text-sky-600 dark:text-sky-400">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
            {index + 1} of {total}
          </span>
        </div>
        <h3 className="mt-6 font-display text-[clamp(1.65rem,8vw,3rem)] uppercase leading-[0.95] text-slate-900 dark:text-white md:mt-8 md:text-[clamp(2rem,4vw,3.25rem)]">
          {card.title}
        </h3>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-600 dark:text-slate-300 md:mt-4 md:text-base">
          {card.desc}
        </p>
      </motion.div>
    </div>
  );
}
