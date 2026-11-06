import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { getLenis } from "@/components/SmoothScroll";

interface NavProps {
  onCtaClick: () => void;
}

export function Nav({ onCtaClick }: Readonly<NavProps>) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("top");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const clickedSectionRef = useRef<string | null>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { theme, toggleTheme } = useTheme();

  const handleScrollTo = useCallback((e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMobileMenuOpen(false);

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = null;
    }

    setActiveSection(targetId);
    clickedSectionRef.current = targetId;

    const element = document.getElementById(targetId);
    if (element) {
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(element, {
          offset: -76,
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          onComplete: () => {
            clickedSectionRef.current = null;
          },
        });
      } else {
        const headerOffset = 76;
        const rect = element.getBoundingClientRect();
        const top = rect.top + globalThis.scrollY - headerOffset;
        globalThis.scrollTo({ top, behavior: "smooth" });

        // Safety for fallback
        setTimeout(() => {
          clickedSectionRef.current = null;
        }, 1000);
      }

      // Secondary safety timeout
      scrollTimeoutRef.current = globalThis.setTimeout(() => {
        clickedSectionRef.current = null;
      }, 2000);
    }
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(globalThis.scrollY > 30);

      // If we clicked a nav link, keep it active until scroll settles
      if (clickedSectionRef.current) {
        return;
      }

      // Determine active section based on scroll position
      const sections = ["top", "services", "pricing", "work", "about", "projects"];
      const headerOffset = 100;

      for (const sectionId of [...sections].reverse()) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= headerOffset) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    onScroll();
    globalThis.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      globalThis.removeEventListener("scroll", onScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const navLinks = [
    { id: "top", label: "Home" },
    { id: "services", label: "Services" },
    { id: "pricing", label: "Pricing" },
    { id: "work", label: "Work" },
    { id: "about", label: "About" },
    { id: "projects", label: "Projects" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <AnimatePresence>
        {scrolled && (
          <motion.div
            key="bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/70"
          />
        )}
      </AnimatePresence>
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between py-4 px-4 sm:px-6 md:px-12">
        <div className="flex items-center gap-1.5 sm:gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <a
            href="#top"
            onClick={(e) => handleScrollTo(e, "top")}
            className="flex items-center gap-2"
          >
            <img
              src="/blutech-logo.png"
              alt="BluTech"
              className="h-9 w-9 object-contain sm:h-10 sm:w-10"
            />
            <span className="hidden sm:inline-block text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
              BluTech
            </span>
          </a>
        </div>
        <div className="relative hidden items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleScrollTo(e, link.id)}
              className={`relative transition-colors hover:text-slate-900 dark:hover:text-white ${
                activeSection === link.id ? "text-slate-900 dark:text-white" : ""
              }`}
            >
              {link.label}
              {activeSection === link.id && (
                <motion.span
                  layoutId="activeNav"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-sky-500"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleTheme}
            className="relative flex h-6 w-6 items-center justify-center overflow-hidden"
            aria-label="Toggle theme"
          >
            <motion.div
              initial={false}
              animate={{ y: theme === "dark" ? 0 : -24 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute text-sky-400"
            >
              <Sun className="h-5 w-5" />
            </motion.div>
            <motion.div
              initial={false}
              animate={{ y: theme === "dark" ? 24 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute text-slate-600 dark:text-slate-300"
            >
              <Moon className="h-5 w-5" />
            </motion.div>
          </button>
          <button
            onClick={onCtaClick}
            className="rounded-full bg-slate-900 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 sm:px-5 sm:text-sm"
          >
            Get in touch
          </button>
        </div>
      </nav>

      {/* Mobile Menu Slide-down Row */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 right-0 top-full z-40 overflow-hidden border-b border-slate-200/60 bg-white/95 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/95 md:hidden"
          >
            <div className="grid grid-cols-3 gap-2 p-4 sm:flex sm:flex-row sm:gap-3 sm:px-8">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => handleScrollTo(e, link.id)}
                  className={`flex items-center justify-center whitespace-nowrap rounded-full py-2.5 text-[11px] font-medium transition-colors sm:flex-1 sm:px-2 sm:text-sm ${
                    activeSection === link.id
                      ? "bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
