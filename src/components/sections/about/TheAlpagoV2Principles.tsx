"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const PRINCIPLES = [
  {
    title: "Transparency is structural, not selective",
    body: "Clarity is maintained across all processes, ensuring accountability is never dependent on interpretation.",
  },
  {
    title: "Quality is the baseline condition",
    body: "Nothing enters execution unless it meets a predefined standard that already exceeds market expectation.",
  },
  {
    title: "Intent is protected at all costs",
    body: "The original vision is preserved from inception to delivery without compromise through intermediaries or process fragmentation.",
  },
  {
    title: "Control replaces dependency",
    body: "External fragmentation is minimised to ensure decisions remain within a unified system of accountability.",
  },
  {
    title: "Doing the right thing overrides convenience",
    body: "Efficiency is never prioritised over correctness in execution, quality, or outcome.",
  },
] as const;

export default function TheAlpagoV2Principles() {
  const section = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const root = section.current;
    const headingElement = heading.current;
    if (!root || !headingElement) return;

    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-principle]"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const audit = new URLSearchParams(window.location.search).has("audit");

    if (reduce || audit) {
      gsap.set(headingElement, { opacity: 1, y: 0, filter: "blur(0px)" });
      gsap.set(items, { opacity: 1, y: 0, filter: "blur(0px)" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingElement,
        { opacity: 0, y: 70, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top 35%",
            end: "top 10%",
            scrub: 0.65,
          },
        },
      );

      items.forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 80, filter: "blur(7px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            ease: "none",
            scrollTrigger: {
              trigger: item,
              start: "top 94%",
              end: "top 52%",
              scrub: 0.65,
            },
          },
        );
      });
    }, root);

    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={section}
      id="v2-principles"
      aria-labelledby="v2-principles-title"
      className="relative z-20 px-6 md:px-14"
    >
      <div className="mx-auto grid w-full max-w-[1560px] gap-16 md:grid-cols-[minmax(0,0.92fr)_minmax(460px,0.8fr)] md:gap-[7vw]">
        <h2
          ref={heading}
          id="v2-principles-title"
          className="display h-fit max-w-[calc(15ch+80px)] text-[clamp(1.3rem,3.8vw,46px)] leading-[1.08] tracking-[-0.015em] md:sticky md:top-[calc(14vh+50px)]"
          style={{ color: "var(--gold-2)" }}
        >
          Where standards drive decisions, not profit.
        </h2>

        <div className="pt-[10vh] md:pt-[14vh]">
          {PRINCIPLES.map((principle, index) => (
            <article
              key={principle.title}
              id={index === PRINCIPLES.length - 1 ? "v2-principle-05" : undefined}
              data-principle
              className={
                index === PRINCIPLES.length - 1
                  ? "pb-0"
                  : "min-h-[44vh] md:min-h-[56vh]"
              }
            >
              <span
                className="caption mb-5 block"
                style={{ color: "var(--bronze-hi)", fontSize: "0.68rem", letterSpacing: "0.26em" }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3
                className="display max-w-[19ch]"
                style={{
                  color: "var(--gold-2)",
                  fontSize: "clamp(1.5rem, 3vw, 34px)",
                  lineHeight: 1.2,
                  letterSpacing: "-0.01em",
                }}
              >
                {principle.title}
              </h3>
              <p
                className="mt-5 max-w-[46ch]"
                style={{
                  color: "var(--ink-dim)",
                  fontFamily: "var(--font-basel), system-ui, sans-serif",
                  fontSize: "15.5px",
                  lineHeight: 1.625,
                }}
              >
                {principle.body}
              </p>
            </article>
          ))}
        </div>
      </div>
      <div aria-hidden className="h-[42vh] md:h-[50vh]" />
    </section>
  );
}
