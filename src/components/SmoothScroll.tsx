"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Global smooth-scroll provider. Drives Lenis from GSAP's ticker and keeps
 * ScrollTrigger in sync, and exposes the live scroll velocity as a CSS var
 * (--scroll-v) so components can react to scroll speed for filter effects.
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // audit mode: native scroll + jump to ?start=<px> before first paint so the
    // initial (only reliable) capture lands on the target section.
    const qp = new URLSearchParams(window.location.search);
    if (qp.has("audit")) {
      document.body.classList.add("audit");
      return;
    }

    // dev QA: native scroll (no Lenis smoothing) but real animations — lets
    // programmatic scroll actually paint mid-page states for screenshots.
    if (qp.has("nolenis")) {
      requestAnimationFrame(() =>
        requestAnimationFrame(() => document.body.classList.remove("loading"))
      );
      return;
    }

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const lenis = new Lenis({
      duration: 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !reduce,
      wheelMultiplier: 0.62,
      touchMultiplier: 0.9,
    });

    // expose lenis for the hero scrub component
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    lenis.on("scroll", (e: { velocity: number }) => {
      ScrollTrigger.update();
      const v = Math.min(Math.abs(e.velocity) / 40, 1);
      document.documentElement.style.setProperty("--scroll-v", v.toFixed(3));
    });

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // reveal the hero once everything is mounted
    requestAnimationFrame(() =>
      requestAnimationFrame(() => document.body.classList.remove("loading"))
    );

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      (window as unknown as { __lenis?: Lenis }).__lenis = undefined;
    };
  }, []);

  return <>{children}</>;
}
