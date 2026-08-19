"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function TheAlpagoV2Hero() {
  const section = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = section.current;
    if (!root) return;
    const items = root.querySelectorAll<HTMLElement>("[data-v2-reveal]");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const audit = new URLSearchParams(window.location.search).has("audit");

    if (reduce || audit) {
      gsap.set(items, { y: 0, opacity: 1, filter: "blur(0px)" });
      return;
    }

    gsap.set(items, { y: 34, opacity: 0, filter: "blur(10px)" });
    let played = false;
    const reveal = () => {
      if (played) return;
      played = true;
      gsap.to(items, {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.15,
        ease: "power3.out",
        stagger: 0.12,
      });
    };

    window.addEventListener("alpago:intro-done", reveal);
    const timeout = window.setTimeout(reveal, 2600);
    return () => {
      window.removeEventListener("alpago:intro-done", reveal);
      window.clearTimeout(timeout);
    };
  }, []);

  return (
    <section ref={section} id="top" data-v2-hero className="sticky top-0 z-10 h-screen min-h-[680px] w-full">
      <div className="absolute inset-x-0 bottom-6 px-6 md:px-14">
        <div className="mx-auto w-full max-w-[1560px]">
          <div className="grid items-end gap-10 md:grid-cols-[minmax(400px,0.8fr)_minmax(0,1.2fr)] md:gap-[4vw]">
            <h1
              data-v2-reveal
              className="display text-left text-[clamp(1.9rem,6.2vw,92px)] leading-[1.02] tracking-[-0.02em]"
              style={{ color: "var(--bronze-hi)" }}
            >
              <span className="block">The</span>
              <span className="block whitespace-nowrap">Alpago Group</span>
            </h1>

            <p
              data-v2-reveal
              className="max-w-[46ch] text-[19px] leading-[1.75] md:translate-x-[110px]"
              style={{ color: "var(--ink-dim)", fontFamily: "var(--font-social), sans-serif" }}
            >
              {"Alpago Group did not emerge as\u00a0an extension of an industry. It emerged as\u00a0a response to its limitations, to redefine the ceiling."}
            </p>
          </div>

          <div data-v2-reveal className="mt-12 flex items-center justify-end border-t border-[color:var(--line)] pt-5">
            <a href="#next" className="caption link-underline" style={{ color: "var(--bronze-hi)", letterSpacing: "0.16em" }}>
              Explore ↓
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
