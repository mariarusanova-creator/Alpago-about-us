"use client";

import { useLayoutEffect } from "react";

/**
 * Per-page theme controller for /the-alpago.
 *   ?theme=light  → Alpago Cream palette (body.light)
 * Also flips the header to cream (body.nav-light) whenever a full-bleed dark
 * media section sits under the nav — any element tagged `.nav-dark`. Pinned
 * media stages report their viewport rect while fixed, so this tracks the
 * currently-active act automatically.
 */
export default function AboutTheme() {
  useLayoutEffect(() => {
    // /the-alpago is light-only — the dark variant is hidden entirely here
    document.body.classList.add("light");

    const navY = 56;
    let raf = 0;
    const update = () => {
      raf = 0;
      let dark = false;
      document.querySelectorAll<HTMLElement>(".nav-dark").forEach((m) => {
        if (m.dataset.navoff === "1") return;
        // a faded-out dark scrim (e.g. Transparency merging into cream) no longer
        // darkens what's under the nav, so it must not keep the nav light
        const computed = getComputedStyle(m);
        if (computed.visibility === "hidden" || computed.display === "none") return;
        if (parseFloat(computed.opacity) < 0.05) return;
        const r = m.getBoundingClientRect();
        if (r.top <= navY && r.bottom >= navY && r.height > 4) dark = true;
      });
      document.body.classList.toggle("nav-light", dark);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    // Lenis drives scroll via transform; a light poll keeps the flag correct
    const id = window.setInterval(update, 180);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
      window.clearInterval(id);
      document.body.classList.remove("nav-light");
    };
  }, []);

  return null;
}
