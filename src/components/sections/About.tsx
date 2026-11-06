import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

const STEPS = [
  {
    n: "01",
    title: "Discovery",
    desc: "We align on goals, scope, timelines and success metrics in a focused kickoff.",
  },
  {
    n: "02",
    title: "Design & Prototype",
    desc: "Rapid prototyping in Figma — clickable, testable, ready for stakeholder feedback.",
  },
  {
    n: "03",
    title: "Build",
    desc: "Weekly demos, async updates, production-grade code from day one.",
  },
  {
    n: "04",
    title: "Ship & Iterate",
    desc: "We launch, measure, and tune. Most projects keep shipping after handoff.",
  },
];

export function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <section
      id="about"
      ref={ref}
      className="relative bg-[#F8FAFC] dark:bg-slate-900"
      style={{ height: `${100 + STEPS.length * 50}svh` }}
    >
      <div className="sticky top-[76px] flex h-[calc(100svh-76px)] items-center overflow-hidden py-6 md:py-8">
        <div className="mx-auto grid h-full w-full max-w-[1400px] grid-rows-[auto_minmax(0,1fr)] gap-6 px-6 md:grid-cols-12 md:grid-rows-1 md:items-center md:gap-16">
          {/* Heading + progress — shows first on mobile */}
          <div className="w-full md:order-2 md:col-span-5">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
              / Process
            </span>
            <h2 className="mt-3 font-display text-[clamp(2rem,8vw,4.2rem)] uppercase leading-[0.9] text-slate-900 dark:text-white md:mt-4 md:text-[clamp(2rem,5vw,4.2rem)]">
              From idea
              <br />
              to launch.
            </h2>

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
              {STEPS.map((s, i) => (
                <Step
                  key={s.n}
                  step={s}
                  index={i}
                  total={STEPS.length}
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

function Step({
  step,
  index,
  total,
  progress,
}: Readonly<{
  step: (typeof STEPS)[number];
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
        className="flex w-full flex-col origin-top overflow-hidden rounded-3xl border border-slate-200 bg-white px-5 pb-5 pt-3 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.25)] dark:border-slate-700 dark:bg-slate-800 dark:shadow-[0_30px_80px_-40px_rgba(0,0,0,0.5)] sm:px-6 sm:pb-6 sm:pt-4 md:px-9 md:pb-9 md:pt-5"
      >
        <div className="flex items-center justify-between">
          <span className="font-display text-sm tabular-nums text-sky-600 dark:text-sky-400">
            {step.n}
          </span>
          <span className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
            Step {index + 1} of {total}
          </span>
        </div>
        <h3 className="mt-6 font-display text-[clamp(1.65rem,8vw,3rem)] uppercase leading-[0.95] text-slate-900 dark:text-white md:mt-8 md:text-[clamp(2rem,4vw,3.25rem)]">
          {step.title}
        </h3>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-600 dark:text-slate-300 md:mt-4 md:text-base">
          {step.desc}
        </p>
      </motion.div>
    </div>
  );
}
