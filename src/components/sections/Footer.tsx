import { Github, Linkedin, Mail, Phone } from "lucide-react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.019 4.388 10.99 10.125 11.854v-8.44H7.078v-3.414h3.047V9.47c0-3.022 1.793-4.69 4.533-4.69 1.312 0 2.686.235 2.686.235v2.966h-1.513c-1.49 0-1.956.928-1.956 1.88v2.26h3.328l-.532 3.414h-2.796v8.44C19.612 23.063 24 18.092 24 12.073z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.33v13.17a2.87 2.87 0 1 1-2.87-2.87c.22 0 .44.03.65.08V9c-.21-.03-.43-.05-.65-.05A6.2 6.2 0 1 0 15.82 15V8.36a8.16 8.16 0 0 0 4.78 1.54V6.69h-1.01z" />
    </svg>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <footer className="relative overflow-hidden bg-slate-950 pt-24 pb-10 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="text-center md:text-left md:col-span-6">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <img src="/blutech-logo.png" alt="BluTech" className="h-10 w-10 object-contain" />
              <span className="text-sm uppercase tracking-[0.2em] text-sky-400">BluTech</span>
            </div>
            <p className="mt-6 max-w-md mx-auto md:mx-0 text-lg text-slate-300">
              Crafting polished digital experiences — from pixel-perfect interfaces to robust
              backend systems. Available for commissions worldwide.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:gap-16 md:col-span-6">
            <div className="flex flex-col items-center text-center md:col-span-1 md:items-start md:text-left">
              <div className="text-xs uppercase tracking-wider text-slate-500">Connect</div>
              <ul className="mt-4 space-y-2 text-slate-200">
                <li>
                  <a
                    href="https://github.com/blutech18"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center md:justify-start gap-2 hover:text-sky-400"
                  >
                    <Github className="h-4 w-4" /> GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/cjjumawan/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center md:justify-start gap-2 hover:text-sky-400"
                  >
                    <Linkedin className="h-4 w-4" /> LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.facebook.com/profile.php?id=61576743929523"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center md:justify-start gap-2 hover:text-sky-400"
                  >
                    <FacebookIcon /> Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="https://tiktok.com/@blutech18"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center md:justify-start gap-2 hover:text-sky-400"
                  >
                    <TikTokIcon /> TikTok
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+639617110582"
                    className="inline-flex items-center justify-center md:justify-start gap-2 hover:text-sky-400"
                  >
                    <Phone className="h-4 w-4" />{" "}
                    <span className="hidden sm:inline">+63 961 711 0582</span>
                    <span className="sm:hidden">Call</span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:blutech18@gmail.com"
                    className="inline-flex w-full items-center justify-center md:justify-start gap-2 hover:text-sky-400 truncate"
                  >
                    <Mail className="h-4 w-4 shrink-0" /> <span className="truncate">Email</span>
                  </a>
                </li>
              </ul>
            </div>
            <div className="flex flex-col items-center text-center md:col-span-1 md:items-start md:text-left">
              <div className="text-xs uppercase tracking-wider text-slate-500">Sitemap</div>
              <ul className="mt-4 space-y-2 text-slate-200">
                <li>
                  <a href="#top" className="hover:text-sky-400">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-sky-400">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#work" className="hover:text-sky-400">
                    Work
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-sky-400">
                    About
                  </a>
                </li>
                <li>
                  <a href="#projects" className="hover:text-sky-400">
                    Projects
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div
        className="group relative mt-20 flex w-full select-none justify-center px-4 py-4 md:px-6"
        onMouseMove={handleMouseMove}
      >
        <h2
          aria-hidden
          className="font-display w-full bg-gradient-to-b from-white to-slate-700 bg-clip-text text-center font-bold leading-[0.85] tracking-[-0.02em] text-transparent"
          style={{ fontSize: "clamp(4rem, 16.5vw, 24rem)" }}
        >
          BLUTECH
        </h2>

        <motion.div
          className="pointer-events-none absolute inset-0 px-4 py-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:px-6"
          style={{
            maskImage: useMotionTemplate`radial-gradient(min(30vw, 350px) circle at ${mouseX}px ${mouseY}px, black 0%, transparent 100%)`,
            WebkitMaskImage: useMotionTemplate`radial-gradient(min(30vw, 350px) circle at ${mouseX}px ${mouseY}px, black 0%, transparent 100%)`,
          }}
        >
          <h2
            aria-hidden
            className="font-display w-full bg-gradient-to-b from-sky-400 to-blue-700 bg-clip-text text-center font-bold leading-[0.85] tracking-[-0.02em] text-transparent"
            style={{ fontSize: "clamp(4rem, 16.5vw, 24rem)" }}
          >
            BLUTECH
          </h2>
        </motion.div>
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-slate-500 md:flex-row">
          <div>© {year} BluTech. All rights reserved.</div>
          <div>Built with care · TanStack Start · Lenis · Framer Motion</div>
        </div>
      </div>
    </footer>
  );
}
