import { useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";

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

/**
 * "Meet BluTech": the section stays pinned while its cards slide in sideways, right to left, as the
 * page scrolls down. (The Process section above stacks its cards instead, so the two read differently.)
 */
export function AboutBluTech() {
  const ref = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const distance = useMotionValue(0);
  const [active, setActive] = useState(0);
  const total = ABOUT_CARDS.length;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // How far the row has to travel so its last card ends at the right edge of the card area
  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    const measure = () => distance.set(Math.max(0, track.scrollWidth - viewport.clientWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(track);
    return () => observer.disconnect();
  }, [distance]);

  // A short hold at both ends, so the first card is read before the row starts moving and the last one settles
  const x = useTransform(() => {
    const t = Math.min(1, Math.max(0, (scrollYProgress.get() - 0.08) / 0.84));
    return -t * distance.get();
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const step = Math.min(total - 1, Math.max(0, Math.round(((p - 0.08) / 0.84) * (total - 1))));
    setActive(step);
  });

  return (
    <section
      ref={ref}
      className="relative bg-white dark:bg-slate-950"
      style={{ height: `${100 + total * 50}svh` }}
    >
      <div className="sticky top-[76px] flex h-[calc(100svh-76px)] items-center overflow-hidden py-6 md:py-8">
        <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-8 px-6 md:grid-cols-12 md:items-center md:gap-12 lg:gap-16">
          {/* Heading, on the left (Process has its heading on the right) */}
          <div className="w-full md:col-span-4">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
              / About Us
            </span>
            <div className="mt-4 flex items-center gap-5 md:mt-5 md:flex-col md:items-start">
              <img
                src="/blutech-logo.png"
                alt="BluTech"
                className="h-20 w-20 object-contain md:h-24 md:w-24 lg:h-28 lg:w-28"
              />
              <h2 className="font-display text-[clamp(2rem,8vw,4.2rem)] uppercase leading-[0.9] text-slate-900 dark:text-white md:text-[clamp(2rem,4.5vw,4.2rem)]">
                Meet
                <br />
                BluTech.
              </h2>
            </div>

            {/* Which card is in front, and how far along the row is */}
            <div className="mt-5 flex items-center gap-4 md:mt-8">
              <span className="font-display text-sm tabular-nums text-slate-900 dark:text-white">
                {String(active + 1).padStart(2, "0")}
                <span className="text-slate-400 dark:text-slate-500">
                  {" "}
                  / {String(total).padStart(2, "0")}
                </span>
              </span>
              <div className="relative h-[2px] w-32 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <motion.div
                  style={{ scaleX: scrollYProgress, transformOrigin: "0% 50%" }}
                  className="absolute inset-0 bg-gradient-to-r from-sky-400 to-blue-700"
                />
              </div>
              <span className="hidden text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 sm:inline">
                Scroll →
              </span>
            </div>
          </div>

          {/* The card row. On wide screens it is clipped on its left only, a little into the gap, so cards fade out there but can
              still come in from the far right of the screen. */}
          <div
            ref={viewportRef}
            className="relative w-full min-w-0 md:[clip-path:inset(-100vh_-100vw_-100vh_-3rem)] lg:[clip-path:inset(-100vh_-100vw_-100vh_-4rem)] md:col-span-8"
          >
            {/* In the gap beside the heading, cards fade into the background as they leave instead of being cut */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-y-24 -left-[calc(3rem+2px)] z-10 hidden w-[calc(3rem+2px)] bg-gradient-to-r from-white from-10% via-white/60 via-50% to-transparent dark:from-slate-950 dark:via-slate-950/60 md:block lg:-left-[calc(4rem+2px)] lg:w-[calc(4rem+2px)]"
            />
            <motion.div ref={trackRef} style={{ x }} className="flex w-max gap-4 md:gap-6">
              {ABOUT_CARDS.map((card, i) => (
                <article
                  key={card.title}
                  className={`relative flex h-[min(22rem,50svh)] w-[min(80vw,24rem)] shrink-0 flex-col overflow-hidden rounded-3xl border p-6 transition-[border-color,box-shadow,opacity] duration-500 md:h-[min(26rem,60svh)] md:w-[26rem] md:p-8 ${
                    i === active
                      ? "border-sky-300 bg-gradient-to-br from-white to-sky-50 opacity-100 shadow-[0_30px_80px_-40px_rgba(56,189,248,0.45)] dark:border-sky-500/40 dark:from-slate-800 dark:to-slate-900"
                      : "border-slate-200 bg-white opacity-60 dark:border-slate-800 dark:bg-slate-900"
                  }`}
                >
                  {/* Large outlined number in the corner */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-2 -top-6 select-none font-display text-[7rem] leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(56,189,248,0.35)] md:text-[9rem]"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
                    {String(i + 1).padStart(2, "0")} — BluTech
                  </span>
                  <h3 className="mt-auto font-display text-[clamp(1.6rem,6vw,2.25rem)] uppercase leading-[0.95] text-slate-900 dark:text-white md:text-[2.5rem]">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 md:mt-4 md:text-base">
                    {card.desc}
                  </p>
                </article>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
