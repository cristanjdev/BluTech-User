import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Orbs } from "@/components/Orbs";
import { GradientButton } from "@/components/GradientButton";
import { FadeUp } from "@/components/RevealText";
import { ArrowDown } from "lucide-react";

interface Props {
  onCtaClick: () => void;
}

export function Hero({ onCtaClick }: Readonly<Props>) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // Check if desktop for scroll animations and floating logos
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Scroll transforms — always defined, values conditional
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  // Scroll-to-right animation
  const xLine1 = useTransform(scrollYProgress, [0, 0.8], [0, 400]);
  const xLine2 = useTransform(scrollYProgress, [0.05, 0.85], [0, 600]);
  const xLine3 = useTransform(scrollYProgress, [0.1, 0.9], [0, 800]);

  // Mouse parallax for floating logos — always defined
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const sx = useSpring(mouse.x, { stiffness: 60, damping: 20 });
  const sy = useSpring(mouse.y, { stiffness: 60, damping: 20 });

  // Derived transforms for floating logos — always called
  const logo1X = useTransform(sx, (v) => v * -22);
  const logo1Y = useTransform(sy, (v) => v * -22);
  const logo2X = useTransform(sx, (v) => v * 30);
  const logo2Y = useTransform(sy, (v) => v * 18);
  const logo3X = useTransform(sx, (v) => v * 14);
  const logo3Y = useTransform(sy, (v) => v * -28);

  useEffect(() => {
    if (!isDesktop) return;
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMouse({ x, y });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [isDesktop]);

  const handleScrollToWork = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById("work");
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
          globalThis.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
      });
    }
  };

  return (
    <section
      ref={ref}
      id="top"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-24 dark:bg-slate-950"
    >
      <Orbs />

      {/* Floating logos with mouse parallax — desktop only */}
      {isDesktop && (
        <>
          <motion.div
            aria-hidden
            style={{ x: logo1X, y: logo1Y }}
            className="pointer-events-none absolute right-[5%] top-[26%] -z-10 h-36 w-36 rotate-6"
          >
            <img
              src="/blutech-logo.png"
              alt=""
              className="h-full w-full object-contain opacity-90"
            />
          </motion.div>
          <motion.div
            aria-hidden
            style={{ x: logo2X, y: logo2Y }}
            className="pointer-events-none absolute left-[4%] top-[56%] -z-10 h-40 w-40 -rotate-6"
          >
            <img
              src="/blutech-logo.png"
              alt=""
              className="h-full w-full object-contain opacity-90"
            />
          </motion.div>
          <motion.div
            aria-hidden
            style={{ x: logo3X, y: logo3Y }}
            className="pointer-events-none absolute right-[12%] bottom-[14%] -z-10 h-28 w-28 rotate-12"
          >
            <img
              src="/blutech-logo.png"
              alt=""
              className="h-full w-full object-contain opacity-90"
            />
          </motion.div>
        </>
      )}

      {/* Grid background */}
      <div
        aria-hidden
        className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />

      <motion.div
        style={isDesktop ? { opacity, y, scale } : { opacity }}
        className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col px-6"
      >
        {/* Main content wrapper for vertical centering */}
        <div className="flex flex-1 flex-col justify-center pb-12 pt-6 md:pb-20 md:pt-10">
          {/* Top meta row */}
          <FadeUp>
            <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-between">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sky-500" />
                </span>
                Available for Commissions
              </div>
              <div className="hidden items-center gap-6 text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 lg:flex">
                <span>EST. 2022</span>
                <span className="h-px w-12 bg-slate-300 dark:bg-slate-600" />
                <span>Worldwide · Async</span>
              </div>
            </div>
          </FadeUp>

          {/* Massive type — centered on mobile/tablet, pyramid on desktop */}
          <h1 className="mt-10 text-center font-display text-[clamp(2.8rem,11vw,15rem)] uppercase leading-[0.86] text-slate-900 dark:text-white md:mt-16 lg:text-left">
            <motion.span style={isDesktop ? { x: xLine1 } : undefined} className="block">
              Build
            </motion.span>
            <motion.span
              style={isDesktop ? { x: xLine2 } : undefined}
              className="block lg:pl-[10vw]"
            >
              <span className="relative inline-block">
                <span className="bg-gradient-to-br from-sky-400 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
                  Beyond
                </span>
                <span className="absolute -right-4 -top-2 hidden h-3 w-3 rounded-full bg-sky-400 lg:block" />
              </span>
            </motion.span>
            <motion.span
              style={isDesktop ? { x: xLine3 } : undefined}
              className="block lg:pl-[20vw]"
            >
              <span className="italic text-blue-800 dark:text-sky-400">Limits.</span>
            </motion.span>
          </h1>

          {/* EST. 2022 info — below heading on mobile/tablet, hidden on desktop (shown in top row) */}
          <div className="mt-6 flex items-center justify-center gap-4 text-[10px] uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400 sm:text-xs sm:tracking-[0.2em] lg:hidden">
            <span>EST. 2022</span>
            <span className="h-px w-8 bg-slate-300 dark:bg-slate-600" />
            <span>Worldwide · Async</span>
          </div>

          {/* CTA buttons */}
          <div className="mt-10 md:mt-16">
            <FadeUp delay={0.5}>
              <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                <GradientButton onClick={onCtaClick}>Start a Project</GradientButton>
                <a
                  href="#work"
                  onClick={handleScrollToWork}
                  className="text-xs font-medium text-slate-700 underline-offset-4 transition-colors hover:text-slate-900 hover:underline sm:text-sm dark:text-slate-300 dark:hover:text-white"
                >
                  See recent work →
                </a>
              </div>
            </FadeUp>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="flex items-center justify-center pb-8 text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 md:pb-12">
          <div className="flex items-center gap-2">
            <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
            Scroll
          </div>
        </div>
      </motion.div>
    </section>
  );
}
