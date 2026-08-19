"use client";

import { useLayoutEffect } from "react";

/** Light-only: always applies the Alpago Cream (#E0DCD1) palette + keeps the nav
 *  cream while the header sits over imagery. The dark variant is hidden site-wide. */
export default function ThemeSwitch() {
  useLayoutEffect(() => {
    // light-only site — the dark variant is hidden everywhere
    document.body.classList.add("light");

    // while the header is over imagery (hero, conviction video) keep the nav cream
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const ov = document.getElementById("overview");
      const cv = document.getElementById("conviction");
      const inHero = !ov || ov.getBoundingClientRect().top > vh * 0.5;
      let inConv = false;
      if (cv) {
        const r = cv.getBoundingClientRect();
        // only once the video has actually expanded behind the nav — the section's
        // scrim opacity tracks the expansion, so read it as the signal
        const scrim = cv.querySelector<HTMLElement>(".nav-scrim");
        const grown = scrim ? parseFloat(scrim.style.opacity || "0") > 0.35 : false;
        inConv = r.top < vh * 0.4 && r.bottom > vh * 0.6 && grown;
      }
      // Billionaire's Row: once its full-bleed image has grown behind the nav
      let inRow = false;
      const row = document.getElementById("row");
      if (row && row.dataset.covered === "1") {
        const r = row.getBoundingClientRect();
        inRow = r.top < vh * 0.4 && r.bottom > vh * 0.6;
      }
      document.body.classList.toggle("nav-light", inHero || inConv || inRow);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
