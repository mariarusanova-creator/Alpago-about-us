"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Breadcrumb — centred under the logo, tracks the section you're in.
 * "Home" always leads; the current section follows and can be clicked to re-centre.
 */
const ITEMS: [string, string][] = [
  ["top", "Home"],
  ["overview", "Overview"],
  ["conviction", "Conviction"],
  ["usps", "Milestones"],
  ["row", "Billionaire’s Row"],
  ["contact", "Contact"],
];

export default function Breadcrumb() {
  const [on, setOn] = useState(false);
  const raf = useRef(0);
  const pathname = usePathname();
  const BUSINESS_DETAILS: Record<string, string> = {
    "/businesses/alpago-properties": "Alpago Properties",
    "/businesses/alpago-design-build": "Alpago Design & Build",
    "/businesses/f1rst-motors": "F1rst Motors",
  };
  const detailName = BUSINESS_DETAILS[pathname] ?? "Alpago Properties";
  const isBusinessDetail = pathname in BUSINESS_DETAILS;
  const isF1rstMotors = pathname === "/businesses/f1rst-motors";
  const trailColor = isF1rstMotors ? "rgba(255,255,255,0.62)" : "var(--ink-faint)";
  const dividerColor = isF1rstMotors ? "rgba(255,255,255,0.42)" : "var(--ink-faint)";

  useEffect(() => {
    const update = () => {
      raf.current = 0;
      // visible only during the hero — hides once the Overview takes over
      const ov = document.getElementById("overview");
      setOn(!ov || ov.getBoundingClientRect().top > window.innerHeight * 0.5);
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
  }, []);

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: Element, o?: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(el, { duration: 1.6 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: "smooth" });
  };


  return (
    <div
      className="bc-bar fixed left-1/2 z-40 hidden -translate-x-1/2 items-center gap-2 md:flex"
      style={{
        top: "104px",
        opacity: on ? 1 : 0,
        transition: "opacity 0.5s ease",
        pointerEvents: on ? "auto" : "none",
      }}
    >
      {isBusinessDetail ? (
        <a
          href="/"
          className="caption cursor-pointer transition-colors duration-300 hover:text-[--ink]"
          style={{ fontSize: "10px", color: trailColor, letterSpacing: "0.24em" }}
        >
          Home
        </a>
      ) : (
        <button
          onClick={() => jump("top")}
          className="caption cursor-pointer transition-colors duration-300 hover:text-[--ink]"
          style={{ fontSize: "10px", color: trailColor, letterSpacing: "0.24em" }}
        >
          Home
        </button>
      )}
      <span aria-hidden style={{ color: dividerColor, fontSize: "10px" }}>
        /
      </span>
      {isBusinessDetail && (
        <>
          <a
            href="/businesses"
            className="caption cursor-pointer transition-colors duration-300 hover:text-[--ink]"
            style={{ fontSize: "10px", color: trailColor, letterSpacing: "0.24em" }}
          >
            Businesses
          </a>
          <span aria-hidden style={{ color: dividerColor, fontSize: "10px" }}>
            /
          </span>
        </>
      )}
      <span
        className="caption"
        style={{ fontSize: "10px", color: isF1rstMotors ? "#fff" : "var(--bronze-hi)", letterSpacing: "0.24em" }}
      >
        {detailName}
      </span>
    </div>
  );
}
