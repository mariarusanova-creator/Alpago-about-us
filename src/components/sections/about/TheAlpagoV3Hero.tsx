"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function TheAlpagoV3Hero() {
  const section = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = section.current;
    if (!root) return;
    const items = root.querySelectorAll<HTMLElement>("[data-v3-reveal]");
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
    <section
      ref={section}
      id="top"
      data-v2-hero
      data-v3-hero
      className="sticky top-0 z-10 h-screen min-h-[680px] w-full"
    >
      <div className="absolute inset-0 flex items-center justify-center px-6 md:px-14">
        <div className="flex flex-col items-center text-center">
          <h1
            data-v3-reveal
            className="display text-center text-[clamp(1.9rem,6.2vw,92px)] leading-[1.02] tracking-[-0.02em]"
            style={{ color: "var(--bronze-hi)" }}
          >
            <span className="block whitespace-nowrap">Alpago Group</span>
          </h1>

          <p
            data-v3-reveal
            className="mt-8 max-w-[46ch] text-center text-[15.5px] leading-[1.625]"
            style={{ color: "#5b432d", fontFamily: "var(--font-basel), system-ui, sans-serif" }}
          >
            {"Alpago Group did not emerge as\u00a0an extension of an industry. It emerged as\u00a0a response to its limitations, to redefine the ceiling."}
          </p>
        </div>
      </div>

      <div
        data-v3-reveal
        className="absolute inset-x-6 bottom-6 flex justify-end border-t border-[color:var(--line)] pt-5 md:inset-x-14"
      >
        <button
          type="button"
          disabled
          aria-label="Explore is unavailable in this standalone presentation"
          className="caption link-underline cursor-default"
          style={{ color: "var(--bronze-hi)", letterSpacing: "0.16em" }}
        >
          Explore ↓
        </button>
      </div>
    </section>
  );
}
