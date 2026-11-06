import { useEffect, useMemo, useRef, useState } from "react";
import type { ServiceRow } from "@/server/public-data";

const FALLBACK_ITEMS = [
  "Web Development",
  "App Development",
  "UI / UX Design",
  "Backend & APIs",
  "Automation & AI",
  "BluTech Studio",
];

const GAP = 48;

export function Marquee({ services }: Readonly<{ services?: ServiceRow[] }>) {
  const stripRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  // Service titles + "BluTech Studio" as the marquee items
  const items = useMemo(
    () =>
      services && services.length > 0
        ? [...services.map((r) => r.title), "BluTech Studio"]
        : FALLBACK_ITEMS,
    [services],
  );

  useEffect(() => {
    if (!stripRef.current) return;
    const w = stripRef.current.scrollWidth + GAP;
    setOffset(w);
  }, [items]);

  return (
    <section
      aria-hidden
      className="relative overflow-hidden border-y border-slate-200 bg-white py-6 dark:border-slate-700 dark:bg-slate-900"
    >
      <div
        className="flex whitespace-nowrap will-change-transform"
        style={
          offset
            ? ({
                gap: `${GAP}px`,
                animation: `marquee ${offset / 100}s linear infinite`,
                "--marquee-offset": `-${offset}px`,
              } as React.CSSProperties)
            : { gap: `${GAP}px` }
        }
      >
        <Strip ref={stripRef} items={items} />
        <Strip items={items} />
        <Strip items={items} />
      </div>
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(var(--marquee-offset)); }
        }
      `}</style>
    </section>
  );
}

import { forwardRef } from "react";

const Strip = forwardRef<HTMLDivElement, { items: string[] }>(function Strip({ items }, ref) {
  return (
    <div ref={ref} className="flex shrink-0 items-center" style={{ gap: `${GAP}px` }}>
      {items.map((t) => (
        <span
          key={t}
          className="flex shrink-0 items-center text-2xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-4xl"
          style={{ gap: `${GAP}px` }}
        >
          {t}
          <span className="h-2 w-2 shrink-0 rounded-full bg-gradient-to-br from-sky-400 to-blue-700" />
        </span>
      ))}
    </div>
  );
});
