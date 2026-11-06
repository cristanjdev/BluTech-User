import { useLayoutEffect, useRef } from "react";

/**
 * Keeps every word of a heading on one line. Sets `--fit` on the element to the largest font size at which
 * its widest word still fits the element's width; the heading's classes cap their own size with it, e.g.
 * `text-[length:min(var(--fit,100rem),2.25rem)]`. Short titles keep their normal size; a long single word
 * ("APPOMODOROTIMER") shrinks instead of being cut in the middle.
 */
export function useFitTitle<T extends HTMLElement>(title: string) {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = title.split(/\s+/).filter(Boolean);

    // Measure the word as the browser really draws it (a canvas can differ from the page's font rendering)
    const probe = document.createElement("span");
    probe.setAttribute("aria-hidden", "true");
    probe.style.cssText =
      "position:absolute;visibility:hidden;white-space:nowrap;left:-9999px;top:0;";

    const fit = () => {
      if (words.length === 0 || el.clientWidth === 0) return;
      const style = getComputedStyle(el);
      const size = parseFloat(style.fontSize) || 16;
      probe.style.fontFamily = style.fontFamily;
      probe.style.fontWeight = style.fontWeight;
      probe.style.fontStyle = style.fontStyle;
      probe.style.textTransform = style.textTransform;
      // Letter spacing is set in em, so it scales along with the probe's size
      probe.style.letterSpacing = `${(parseFloat(style.letterSpacing) || 0) / size}em`;
      probe.style.fontSize = "100px";
      document.body.appendChild(probe);
      // The widest word decides (not always the one with the most letters)
      let widthAt100 = 0;
      for (const word of words) {
        probe.textContent = word;
        widthAt100 = Math.max(widthAt100, probe.getBoundingClientRect().width);
      }
      probe.remove();
      if (widthAt100 <= 0) return;
      // A little room to spare so rounding never pushes the last letter onto its own line
      el.style.setProperty(
        "--fit",
        `${Math.floor(((el.clientWidth * 100) / widthAt100) * 0.96 * 4) / 4}px`,
      );
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(el);
    // The heading font may still be loading on first paint; measure again once it has arrived
    document.fonts?.ready.then(fit).catch(() => {});
    return () => observer.disconnect();
  }, [title]);

  return ref;
}
