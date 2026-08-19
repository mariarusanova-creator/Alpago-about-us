"use client";

import Reveal from "@/components/Reveal";

/** Transition teaser to the next business in the group. */
export default function NextIndustry() {
  return (
    <section className="relative flex min-h-[60vh] flex-col items-center justify-center gap-6 py-[14vh] text-center">
      <Reveal>
        <span className="caption" style={{ letterSpacing: "0.4em" }}>
          Next Industry
        </span>
      </Reveal>
      <Reveal delay={0.05}>
        <a
          href="#"
          className="display block transition-opacity duration-500 hover:opacity-70"
          style={{ fontSize: "clamp(3rem, 9vw, 7rem)" }}
        >
          F1rst Motors
        </a>
      </Reveal>
      <Reveal delay={0.1}>
        <span
          className="text-[12px] tracking-[0.18em] uppercase"
          style={{ color: "var(--ink-faint)" }}
        >
          Alpago Group
        </span>
      </Reveal>
    </section>
  );
}
