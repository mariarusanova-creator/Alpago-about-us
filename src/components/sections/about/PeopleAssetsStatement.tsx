"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const HEADLINE = [
  "Alpago’s greatest asset isn’t its developments,",
  "its projects, or its cars. It’s a team of people",
  "who simply refuses to accept average.",
];

const PARAGRAPH =
  "Across every company within the Group, there is a shared belief that quality is never accidental. It is the result of people who care enough to question accepted norms, challenge limitations, and pursue better outcomes long after others would consider them complete.";

type Props = {
  id?: string;
  lines?: string[];
  body?: string;
  overlapPinned?: boolean;
  preserveContentOnExit?: boolean;
};

const GOLD: React.CSSProperties = {
  display: "inline-block",
  whiteSpace: "pre",
  backgroundImage: "linear-gradient(180deg, var(--gold-1) 0%, var(--gold-2) 48%, var(--gold-3) 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
};

export default function PeopleAssetsStatement({
  id,
  lines = HEADLINE,
  body = PARAGRAPH,
  overlapPinned = false,
  preserveContentOnExit = false,
}: Props) {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const sec = section.current;
    const stg = stage.current;
    if (!sec || !stg) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const audit = new URLSearchParams(window.location.search).has("audit");
    const chars = stg.querySelectorAll<HTMLElement>(".pa-char");
    const words = paragraphRef.current?.querySelectorAll<HTMLElement>(".pa-word") ?? [];

    gsap.set(chars, { filter: "blur(12px)", opacity: 0 });
    gsap.set(words, { filter: "blur(8px)", opacity: 0, y: 10 });

    if (audit || reduce) {
      gsap.set(stg, { opacity: 1 });
      gsap.set(chars, { filter: "blur(0px)", opacity: 1 });
      gsap.set(words, { filter: "blur(0px)", opacity: 1, y: 0 });
      return;
    }

    gsap.set(stg, { opacity: 0 });
    const content = stg.querySelector<HTMLElement>("[data-content]");

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sec,
          start: "top top",
          end: "+=135%",
          pin: stg,
          pinType: "fixed",
          scrub: 0.6,
        },
      });

      tl.to(stg, { opacity: 1, ease: "none", duration: 0.16 }, 0);
      tl.to(
        chars,
        { filter: "blur(0px)", opacity: 1, ease: "none", stagger: { amount: 0.5 }, duration: 0.6 },
        0.18,
      );
      tl.to(
        words,
        { filter: "blur(0px)", opacity: 1, y: 0, ease: "none", stagger: { amount: 0.5 }, duration: 0.7 },
        0.9,
      );
      tl.to({}, { duration: 0.28 });
      if (content && !preserveContentOnExit) {
        tl.to(content, { autoAlpha: 0, ease: "power1.in", duration: 0.55 });
      }
    }, sec);

    return () => ctx.revert();
  }, [preserveContentOnExit]);

  return (
    <section
      ref={section}
      id={id}
      className={`relative w-screen ${overlapPinned ? "z-30" : ""}`}
      style={{ marginLeft: "calc((100% - 100vw) / 2)", marginTop: overlapPinned ? "-200vh" : "-100vh" }}
    >
      <div ref={stage} className="relative flex h-screen w-full items-center justify-center overflow-hidden">
        <div data-content className="mx-auto max-w-[1120px] px-6 text-center md:px-12">
          <div className="display" style={{ lineHeight: 1.18, letterSpacing: "-0.01em" }}>
            {lines.map((line) => (
              <div key={line} style={{ fontSize: "clamp(1.25rem, 2.8vw, 40px)", paddingBottom: "0.08em" }}>
                {line.split(" ").map((word, wordIndex, words) => (
                  <span key={wordIndex} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
                    {Array.from(word).map((character, characterIndex) => (
                      <span key={characterIndex} className="pa-char" style={GOLD}>{character}</span>
                    ))}
                    {wordIndex < words.length - 1 ? <span className="pa-char" style={GOLD}> </span> : null}
                  </span>
                ))}
              </div>
            ))}
          </div>

          <p
            ref={paragraphRef}
            className="mx-auto mt-10"
            style={{ color: "var(--ink-dim)", maxWidth: "58ch", fontFamily: "var(--font-social), sans-serif", fontSize: "15px", lineHeight: 1.75, letterSpacing: "0.01em" }}
          >
            {body.split(" ").map((word, wordIndex, words) => (
              <span key={wordIndex} className="pa-word" style={{ display: "inline-block", whiteSpace: "pre" }}>
                {word}{wordIndex < words.length - 1 ? " " : ""}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
