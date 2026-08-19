"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";

/**
 * Intro wordmark reveal (from the Alpago homepage direction): the wordmark
 * emerges from black, blurs into focus, then the curtain lifts to the hero.
 * The line at the foot is the PAGE NAME (not the brand suffix), so both the
 * initial load and every page-to-page transition announce where you are.
 */
const PAGE_NAME: Record<string, string> = {
  "/the-alpago": "The Alpago",
  "/the-alpago/manifesto": "The Manifesto",
  "/the-alpago/people": "People Behind Alpago",
  "/investors": "Investors",
  "/insights": "Insights",
  "/careers": "Careers",
  "/careers/open-roles": "Open Roles",
  "/careers/open-application": "Open Application",
  "/businesses": "Businesses",
  "/businesses/alpago-properties": "Alpago Properties",
  "/businesses/alpago-design-build": "Alpago Design & Build",
  "/businesses/f1rst-motors": "F1rst Motors",
  // the businesses page is the root `/` (and its `/new` alias)
  "/new": "Businesses",
  "/": "The Alpago",
};

export default function Preloader() {
  const pathname = usePathname();
  const pageName =
    PAGE_NAME[pathname ?? "/"] ??
    (pathname?.startsWith("/careers/open-roles/")
      ? "Open Roles"
      : pathname?.startsWith("/insights/")
        ? "Insights"
        : "Properties");
  const root = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useLayoutEffect(() => {
    if (new URLSearchParams(window.location.search).has("audit")) {
      setGone(true);
      document.body.classList.remove("loading");
      window.dispatchEvent(new Event("alpago:intro-done"));
      return;
    }
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } })
      .__lenis;
    lenis?.stop();

    const tl = gsap.timeline({
      onComplete: () => {
        lenis?.start();
        setGone(true);
        window.dispatchEvent(new Event("alpago:intro-done"));
      },
    });

    tl.set(document.body, { overflow: "hidden" })
      .fromTo(
        mark.current,
        { filter: "blur(22px)", opacity: 0, letterSpacing: "0.34em", scale: 1.04 },
        {
          filter: "blur(0px)",
          opacity: 1,
          letterSpacing: "0.05em",
          scale: 1,
          duration: 1.8,
          ease: "expo.out",
        }
      )
      .to(mark.current, { opacity: 0, filter: "blur(10px)", duration: 0.8, ease: "power2.in" }, "+=0.5")
      .to(
        root.current,
        { yPercent: -100, duration: 1.1, ease: "expo.inOut" },
        "-=0.2"
      )
      .set(document.body, { overflow: "" });

    return () => {
      tl.kill();
    };
  }, []);

  if (gone) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "var(--bg)" }}
    >
      <div
        ref={mark}
        className="display text-ink"
        style={{ fontSize: "clamp(1.9rem, 5.5vw, 4.5rem)", fontWeight: 300 }}
      >
        Alpago
      </div>
      <span
        className="caption absolute bottom-10"
        style={{ opacity: 0.5 }}
      >
        {pageName}
      </span>
    </div>
  );
}
