"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// centered blur-reveal — same reveal language as the Overview section, minus the left shift
const HEADLINE = [
  "Markets evolve when someone is",
  "willing to challenge the conventions.",
];
const PARAGRAPH =
  "Alpago has helped shape Dubai’s ultra-prime residential landscape, consistently redefining the meaning of luxury living. Guided by the belief that exceptional residences should reflect individuality, architectural distinction and enduring value, we create homes that set new benchmarks for the market.";

const GOLD: React.CSSProperties = {
  display: "inline-block",
  whiteSpace: "pre",
  backgroundImage: "linear-gradient(180deg, var(--gold-1) 0%, var(--gold-2) 48%, var(--gold-3) 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
};

export default function Conviction() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const para = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const sec = section.current;
    const stg = stage.current;
    if (!sec || !stg) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const audit = new URLSearchParams(window.location.search).has("audit");
    const chars = stg.querySelectorAll<HTMLElement>(".cv-char");
    const words = para.current?.querySelectorAll<HTMLElement>(".cv-word") ?? [];

    gsap.set(chars, { filter: "blur(12px)", opacity: 0 });
    gsap.set(words, { filter: "blur(8px)", opacity: 0, y: 10 });

    const showFinal = () => {
      gsap.set(chars, { filter: "blur(0px)", opacity: 1 });
      gsap.set(words, { filter: "blur(0px)", opacity: 1, y: 0 });
    };

    if (audit || reduce) {
      showFinal();
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sec,
          start: "top top",
          end: "+=115%",
          pin: stg,
          pinType: "fixed",
          scrub: 0.6,
        },
      });
      tl.to(
        chars,
        { filter: "blur(0px)", opacity: 1, ease: "none", stagger: { amount: 0.5 }, duration: 0.6 },
        0.2
      );
      tl.to(
        words,
        { filter: "blur(0px)", opacity: 1, y: 0, ease: "none", stagger: { amount: 0.5 }, duration: 0.7 },
        0.95
      );
      // brief hold, then fade content out before the hand-off
      tl.to({}, { duration: 0.3 });
      tl.to(stg.querySelector(":scope > div"), { autoAlpha: 0, ease: "power1.in", duration: 0.6 });
    }, sec);

    return () => ctx.revert();
  }, []);

  return (
    <section id="conviction" ref={section} className="relative" style={{ marginTop: "-100vh" }}>
      <div
        ref={stage}
        className="relative flex h-screen w-full items-center justify-center overflow-hidden"
      >
        <div className="mx-auto max-w-[1100px] px-6 text-center md:px-12">
          <div
            className="display"
            style={{ lineHeight: 1.18, letterSpacing: "-0.01em" }}
          >
            {HEADLINE.map((line, i) => (
              <div
                key={i}
                style={{ fontSize: "clamp(1.4rem, 3.3vw, 44px)", paddingBottom: "0.08em" }}
              >
                {line.split(" ").map((word, wi, arr) => (
                  <span key={wi} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
                    {Array.from(word).map((ch, ci) => (
                      <span key={ci} className="cv-char" style={GOLD}>
                        {ch}
                      </span>
                    ))}
                    {wi < arr.length - 1 ? (
                      <span className="cv-char" style={GOLD}>
                        {" "}
                      </span>
                    ) : null}
                  </span>
                ))}
              </div>
            ))}
          </div>

          <p
            ref={para}
            className="mx-auto mt-10"
            style={{
              color: "var(--ink-dim)",
              maxWidth: "58ch",
              fontFamily: "var(--font-social), sans-serif",
              fontSize: "15px",
              lineHeight: 1.75,
              letterSpacing: "0.01em",
            }}
          >
            {PARAGRAPH.split(" ").map((word, wi, arr) => (
              <span key={wi} className="cv-word" style={{ display: "inline-block", whiteSpace: "pre" }}>
                {word}
                {wi < arr.length - 1 ? " " : ""}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
