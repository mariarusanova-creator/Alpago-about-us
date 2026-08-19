"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { clamp, GOLD, smoothstep } from "./kit";

const FIRST_STATEMENT = ["Alpago was created from a simple", "but uncomfortable truth:"] as const;
const SECOND_STATEMENT = [
  "What is widely accepted as the highest standard",
  "in luxury is not the highest standard at all",
] as const;

const STORY_PARAGRAPH =
  "Across real estate, design, construction, and automotive curation, the term ‘excellence’ has been stretched into something relative rather than absolute. Alpago exists to challenge that assumption. Not to improve what already exists. But to redefine what should exist.";

const smootherstep = (value: number) => {
  const t = clamp(value);
  return t * t * t * (t * (t * 6 - 15) + 10);
};

function StatementRows({ rows }: { rows: readonly string[] }) {
  return (
    <>
      {rows.map((row) => (
        <span
          key={row}
          aria-hidden
          className="display block whitespace-normal md:whitespace-nowrap"
          style={{
            fontSize: "clamp(1.15rem, 3.4vw, 40px)",
            lineHeight: 1.08,
            paddingBottom: "0.06em",
          }}
        >
          {Array.from(row).map((character, index) => (
            <span key={`${character}-${index}`} style={GOLD}>
              {character}
            </span>
          ))}
        </span>
      ))}
    </>
  );
}

export default function TheAlpagoV2Story() {
  const section = useRef<HTMLElement>(null);
  const first = useRef<HTMLHeadingElement>(null);
  const second = useRef<HTMLHeadingElement>(null);
  const body = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const sec = section.current;
    const firstEl = first.current;
    const secondEl = second.current;
    const bodyEl = body.current;
    const hero = document.querySelector<HTMLElement>("[data-v2-hero]");
    if (!sec || !firstEl || !secondEl || !bodyEl || !hero) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const audit = new URLSearchParams(window.location.search).has("audit");

    const apply = (progress: number) => {
      const p = clamp(progress);

      const heroExit = smoothstep(clamp(p / 0.1));
      hero.style.opacity = (1 - heroExit).toFixed(3);

      const firstEnter = smootherstep((p - 0.045) / 0.16);
      const firstLeave = smoothstep(clamp((p - 0.28) / 0.06));
      const firstOpacity = firstEnter * (1 - firstLeave);
      firstEl.style.opacity = firstOpacity.toFixed(3);
      firstEl.style.filter = `blur(${((1 - firstEnter) * 12 + firstLeave * 3).toFixed(2)}px)`;
      firstEl.style.transform = `translateY(${((1 - firstEnter) * 30).toFixed(2)}px)`;

      const secondEnter = smootherstep((p - 0.34) / 0.15);
      const secondLeave = smoothstep(clamp((p - 0.57) / 0.07));
      const secondOpacity = secondEnter * (1 - secondLeave);
      secondEl.style.opacity = secondOpacity.toFixed(3);
      secondEl.style.filter = `blur(${((1 - secondEnter) * 12 + secondLeave * 3).toFixed(2)}px)`;
      secondEl.style.transform = `translateY(${((1 - secondEnter) * 30).toFixed(2)}px)`;

      const bodyReveal = smoothstep(clamp((p - 0.63) / 0.2));
      const bodyLeave = smoothstep(clamp((p - 0.91) / 0.07));
      const bodyOpacity = bodyReveal * (1 - bodyLeave);
      bodyEl.style.opacity = bodyOpacity.toFixed(3);
      bodyEl.style.filter = `blur(${((1 - bodyOpacity) * 9).toFixed(2)}px)`;
      bodyEl.style.transform = `translateY(${((1 - bodyReveal) * 150).toFixed(1)}px)`;
    };

    if (reduce || audit) {
      sec.style.height = "100vh";
      hero.style.opacity = "0";
      gsap.set([firstEl, secondEl], { opacity: 0 });
      gsap.set(bodyEl, { opacity: 1, y: 0, filter: "blur(0px)" });
      return () => {
        hero.style.opacity = "";
      };
    }

    apply(0);
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sec,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.65,
        invalidateOnRefresh: true,
        onRefresh: (self) => apply(self.progress),
        onUpdate: (self) => apply(self.progress),
      });
    }, sec);

    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      ctx.revert();
      hero.style.opacity = "";
    };
  }, []);

  const statementClass =
    "absolute inset-x-6 top-1/2 mx-auto flex max-w-[1500px] -translate-y-1/2 flex-col items-center text-center will-change-[opacity,filter,transform] md:inset-x-14";

  return (
    <section
      ref={section}
      id="v2-story"
      aria-label="The Alpago standard"
      className="relative z-20"
      style={{ height: "520vh", marginTop: "-100vh" }}
    >
      <span id="next" aria-hidden className="pointer-events-none absolute left-0 top-[70vh] h-px w-px" />
      <div className="pointer-events-none sticky top-0 h-screen w-full overflow-hidden">
        <h2
          ref={first}
          aria-label="Alpago was created from a simple but uncomfortable truth:"
          className={statementClass}
          style={{ color: "var(--bronze-hi)", opacity: 0 }}
        >
          <StatementRows rows={FIRST_STATEMENT} />
        </h2>

        <h2
          ref={second}
          aria-label="What is widely accepted as the highest standard in luxury is not the highest standard at all"
          className={statementClass}
          style={{ color: "var(--bronze-hi)", opacity: 0 }}
        >
          <StatementRows rows={SECOND_STATEMENT} />
        </h2>

        <div
          ref={body}
          className="absolute inset-x-6 top-1/2 mx-auto max-w-[56ch] -translate-y-1/2 text-center md:inset-x-14"
          style={{
            color: "#5b432d",
            fontFamily: "var(--font-basel), system-ui, sans-serif",
            fontSize: "15.5px",
            lineHeight: 1.625,
            opacity: 0,
          }}
        >
          <p>{STORY_PARAGRAPH}</p>
        </div>
      </div>
    </section>
  );
}
