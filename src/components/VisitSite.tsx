"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Smart sticky "visit website" badge — a circular rotating-text button (award-site
 * style): the label spins slowly around a bronze ↗, speeds up on hover, and the whole
 * badge is magnetic — it leans toward the cursor. Hidden during the hero intro.
 */
export default function VisitSite() {
  const pathname = usePathname();
  const isF1rst = pathname === "/businesses/f1rst-motors";
  const isDesignBuild = pathname === "/businesses/alpago-design-build";
  const href = isF1rst
    ? "https://f1rstmotors.com/"
    : isDesignBuild
      ? "https://alpagodesignandbuild.com/"
      : "https://www.alpagoproperties.com/";
  const label = isF1rst ? "F1rst Motors" : isDesignBuild ? "Alpago Design & Build" : "Alpago Properties";
  const [on, setOn] = useState(false);
  const wrap = useRef<HTMLAnchorElement>(null);
  const raf = useRef(0);

  useEffect(() => {
    const footer = document.querySelector("footer");
    let footerNear = false;
    const update = () => {
      raf.current = 0;
      setOn(window.scrollY > window.innerHeight * 0.7 && !footerNear);
      // lift above the milestones ruler while that section is on screen
      const usps = document.getElementById("usps");
      const el2 = wrap.current;
      if (usps && el2) {
        const r = usps.getBoundingClientRect();
        const over = r.top < window.innerHeight * 0.6 && r.bottom > window.innerHeight * 0.6;
        el2.style.setProperty("--lift", over ? "-96px" : "0px");
      }
    };
    const io = footer
      ? new IntersectionObserver(
          (entries) => {
            footerNear = entries[0].isIntersecting;
            update();
          },
          { rootMargin: "0px 0px 10% 0px" }
        )
      : null;
    if (footer && io) io.observe(footer);
    const onScroll = () => {
      if (!raf.current) raf.current = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    // magnetic pull — the badge leans toward the cursor when it comes near
    const el = wrap.current;
    const onMove = (e: MouseEvent) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const reach = 140;
      if (dist < reach) {
        const pull = (1 - dist / reach) * 0.35;
        el.style.setProperty("--mx", (dx * pull).toFixed(1) + "px");
        el.style.setProperty("--my", (dy * pull).toFixed(1) + "px");
      } else {
        el.style.setProperty("--mx", "0px");
        el.style.setProperty("--my", "0px");
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
      io?.disconnect();
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <a
      ref={wrap}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit the ${label} website`}
      className="vs-badge fixed bottom-7 right-7 z-50 grid place-items-center"
      style={{
        width: "108px",
        height: "108px",
        transform: on
          ? "translate(var(--mx, 0px), var(--my, 0px)) translateY(var(--lift, 0px)) scale(1)"
          : "translateY(140%) scale(0.6)",
        opacity: on ? 1 : 0,
        transition: "opacity 0.5s ease, transform 0.35s cubic-bezier(0.22,1,0.36,1)",
        pointerEvents: on ? "auto" : "none",
      }}
    >
      {/* rotating circular label */}
      <svg viewBox="0 0 100 100" className="vs-spin absolute inset-0 h-full w-full">
        <defs>
          <path id="vs-circle" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
        </defs>
        <text
          style={{
            fontSize: "8.4px",
            letterSpacing: "0.22em",
            fill: "var(--ink)",
            textTransform: "uppercase",
            fontFamily: "var(--font-social), sans-serif",
          }}
        >
          <textPath href="#vs-circle" textLength="239" lengthAdjust="spacing">visit website · {label.toLowerCase()} ·</textPath>
        </text>
      </svg>
      {/* centre disc + arrow */}
      <span
        className="vs-core grid place-items-center rounded-full"
        style={{
          width: "44px",
          height: "44px",
          border: "1px solid var(--ink-faint)",
          background: "rgba(16, 13, 9, 0.55)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          color: "var(--bronze-hi)",
          fontSize: "18px",
        }}
      >
        <span className="vs-arrow" aria-hidden>
          ↗
        </span>
      </span>
    </a>
  );
}
