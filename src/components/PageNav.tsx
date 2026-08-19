"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Side page navigation — a quiet rail of lines on the right edge. The active
 * section's line stretches and turns bronze; hovering reveals the label; clicking
 * glides to the section via Lenis.
 */
const DEFAULT_ITEMS: [string, string][] = [
  ["top", "Home"],
  ["overview", "Overview"],
  ["conviction", "Conviction"],
  ["usps", "Milestones"],
  ["row", "Billionaire’s Row"],
  ["contact", "Contact"],
];

export default function PageNav({ items = DEFAULT_ITEMS }: { items?: [string, string][] }) {
  const [active, setActive] = useState(0);
  const [on, setOn] = useState(false);
  const raf = useRef(0);

  useEffect(() => {
    const footer = document.querySelector("footer");
    const update = () => {
      raf.current = 0;
      const y = window.scrollY;
      const fTop = footer ? footer.getBoundingClientRect().top : Infinity;
      setOn(y > 40 && fTop > window.innerHeight * 0.55);
      let a = 0;
      items.forEach(([id], i) => {
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.getBoundingClientRect().top + y;
        if (y >= top - window.innerHeight * 0.5) a = i;
      });
      setActive(a);
    };
    const onScroll = () => {
      if (!raf.current) raf.current = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [items]);

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: Element, o?: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(el, { duration: 1.6 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: "smooth" });
  };

  return (
    <nav
      aria-label="Page sections"
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-1 md:right-14 md:flex"
      style={{ opacity: on ? 1 : 0, transition: "opacity 0.5s ease", pointerEvents: on ? "auto" : "none" }}
    >
      {items.map(([id, label], i) => (
        <button
          key={id}
          onClick={() => jump(id)}
          className="pn-item flex cursor-pointer items-center gap-3 py-2 pl-2"
          aria-label={label}
        >
          {/* label — small glass pill, shown on hover and for the active section */}
          <span
            className="caption pointer-events-none whitespace-nowrap rounded-full px-3.5 py-1.5 transition-opacity duration-300"
            style={{
              fontSize: "10px",
              color: i === active ? "var(--bronze-hi)" : "var(--ink)",
              background: "rgba(16, 13, 9, 0.6)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid var(--line)",
              opacity: i === active ? 1 : 0,
            }}
          >
            {label}
          </span>
          {/* line — stretches and turns bronze when active */}
          <span
            className="block rounded-full transition-all duration-500"
            style={{
              height: "2px",
              width: i === active ? "34px" : "16px",
              background: i === active ? "var(--bronze-hi)" : "var(--ink-faint)",
            }}
          />
        </button>
      ))}
    </nav>
  );
}
