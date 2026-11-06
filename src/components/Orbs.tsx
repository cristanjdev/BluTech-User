import { useEffect, useRef, useState } from "react";

interface Orb {
  x: string;
  y: string;
  size: number;
  color: string;
  depth: number;
}

const ORBS: Orb[] = [
  { x: "12%", y: "18%", size: 460, color: "rgba(56,189,248,0.55)", depth: 30 },
  { x: "78%", y: "22%", size: 380, color: "rgba(29,78,216,0.45)", depth: 50 },
  { x: "62%", y: "72%", size: 520, color: "rgba(125,211,252,0.5)", depth: 20 },
  { x: "8%", y: "78%", size: 320, color: "rgba(59,130,246,0.4)", depth: 40 },
];

// Fewer, smaller orbs for mobile
const MOBILE_ORBS: Orb[] = [
  { x: "20%", y: "25%", size: 180, color: "rgba(56,189,248,0.4)", depth: 0 },
  { x: "70%", y: "65%", size: 200, color: "rgba(29,78,216,0.35)", depth: 0 },
];

export function Orbs() {
  const ref = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || isMobile) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const tick = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      const orbs = el.querySelectorAll<HTMLElement>("[data-orb]");
      orbs.forEach((o) => {
        const d = Number(o.dataset.depth ?? 30);
        if (d > 0) {
          o.style.transform = `translate3d(${cx * d}px, ${cy * d}px, 0)`;
        }
      });
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [isMobile]);

  const orbs = isMobile ? MOBILE_ORBS : ORBS;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-20 overflow-hidden"
    >
      {orbs.map((o, i) => (
        <div
          key={i}
          data-orb
          data-depth={o.depth}
          className="absolute rounded-full will-change-transform"
          style={{
            left: o.x,
            top: o.y,
            width: o.size,
            height: o.size,
            background: `radial-gradient(circle at 30% 30%, ${o.color}, transparent 65%)`,
            filter: isMobile ? "blur(30px)" : "blur(60px)",
            transform: "translate3d(0,0,0)",
          }}
        />
      ))}
    </div>
  );
}
