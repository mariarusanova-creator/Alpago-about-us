"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// fixed line breaks — identical whether centered or left-aligned
const DEFAULT_HEADLINE = [
  "We develop selectively,",
  "without compromise.",
  "Defined through craft, not claim.",
];
const DEFAULT_PARAGRAPH =
  "Operating at the intersection of architecture, creativity, rarity and enduring value, we are relentless in the details most people never see — because that is where quality begins. Ensuring that architecture is never diminished by practicality, craftsmanship never sacrificed for convenience, and excellence never measured by what the industry considers enough.";

const GOLD: React.CSSProperties = {
  display: "inline-block",
  whiteSpace: "pre",
  backgroundImage: "linear-gradient(180deg, var(--gold-1) 0%, var(--gold-2) 48%, var(--gold-3) 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
};

// soft mask so the image melts into the background on its visible edges
const IMG_MASK: React.CSSProperties = {
  WebkitMaskImage:
    "linear-gradient(to right, transparent 0%, #000 25%), linear-gradient(to bottom, transparent 0%, #000 13%, #000 87%, transparent 100%)",
  maskImage:
    "linear-gradient(to right, transparent 0%, #000 25%), linear-gradient(to bottom, transparent 0%, #000 13%, #000 87%, transparent 100%)",
  WebkitMaskComposite: "source-in",
  maskComposite: "intersect",
};

export default function Overview({
  headline = DEFAULT_HEADLINE,
  paragraph = DEFAULT_PARAGRAPH,
  contentWidth,
  imageSrc = "/media/alp/dsc07985.jpg",
  imageFadeExtra = 0,
  paragraphFontSize = "17.5px",
  imageOffsetX = 0,
}: {
  headline?: string[];
  paragraph?: string;
  contentWidth?: string;
  imageSrc?: string;
  imageFadeExtra?: number;
  paragraphFontSize?: string;
  imageOffsetX?: number;
}) {
  const HEADLINE = headline;
  const PARAGRAPH = paragraph;
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const para = useRef<HTMLParagraphElement>(null);
  const img = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    const sec = section.current;
    const stg = stage.current;
    if (!sec || !stg) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const audit = new URLSearchParams(window.location.search).has("audit");
    const chars = stg.querySelectorAll<HTMLElement>(".ov-char");
    const words = para.current?.querySelectorAll<HTMLElement>(".ov-word") ?? [];

    // each line starts centered under the widest, then glides to flush-left
    const lineEls = () => Array.from(head.current?.children ?? []) as HTMLElement[];
    const centerLines = () => {
      const els = lineEls();
      const widest = contentWidth ? (head.current?.offsetWidth ?? 0) : Math.max(...els.map((e) => e.offsetWidth), 0);
      els.forEach((el) => gsap.set(el, { x: (widest - el.offsetWidth) / 2 }));
    };

    gsap.set(head.current, { left: "50%", xPercent: -50, top: "50%", yPercent: -50 });
    centerLines();
    gsap.set(chars, { filter: "blur(12px)", opacity: 0 });
    gsap.set(words, { filter: "blur(8px)", opacity: 0, y: 10 });
    // image: subtle reveal — starts a touch scaled-up, brighter, fully transparent
    gsap.set(img.current, { x: imageOffsetX });
    gsap.set(img.current, { scale: 1.12, autoAlpha: 0, filter: "brightness(112%)", transformOrigin: "58% 50%" });

    const showFinal = () => {
      gsap.set(head.current, { left: "7%", xPercent: 0, top: "21%", yPercent: 0 });
      gsap.set(lineEls(), { x: 0 });
      gsap.set(chars, { filter: "blur(0px)", opacity: 1 });
      gsap.set(words, { filter: "blur(0px)", opacity: 1, y: 0 });
      gsap.set(img.current, { scale: 1, autoAlpha: 1, filter: "brightness(100%)" });
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
          end: "+=155%",
          pin: stg,
          pinType: "fixed",
          scrub: 0.6,
          invalidateOnRefresh: true,
          onRefresh: centerLines,
        },
      });

      // 1 — headline blur-reveals, centered (in the middle) while pinned
      tl.to(
        chars,
        { filter: "blur(0px)", opacity: 1, ease: "none", stagger: { amount: 0.4 }, duration: 0.5 },
        0.05
      );
      // 2 — whole block glides to the left …
      tl.to(
        head.current,
        { left: "56px", xPercent: 0, top: "21%", yPercent: 0, ease: "power2.inOut", duration: 1.1 },
        1.0
      );
      // … and each line eases from centered to flush-left (staggered → smoother)
      tl.to(lineEls(), { x: 0, ease: "power2.inOut", duration: 1.1, stagger: 0.08 }, 1.1);
      // 3 — THEN the image reveals softly (slow scale + fade + brightness settle)
      tl.fromTo(
        img.current,
        { scale: 1.12, autoAlpha: 0, filter: "brightness(112%)" },
        { scale: 1, autoAlpha: 1, filter: "brightness(100%)", ease: "power2.out", duration: 1.7 },
        2.2
      );
      // paragraph blur-reveals alongside
      tl.to(
        words,
        { filter: "blur(0px)", opacity: 1, y: 0, ease: "none", stagger: { amount: 0.5 }, duration: 0.7 },
        2.4
      );
      // brief hold, then fade the whole section out before it hands off
      tl.to({}, { duration: 0.3 });
      tl.to([head.current, para.current, img.current], { autoAlpha: 0, ease: "power1.in", duration: 0.6 });
    }, sec);

    return () => ctx.revert();
  }, []);

  return (
    <section id="overview" ref={section} className="relative" style={{ marginTop: "-100vh" }}>
      <div ref={stage} className="relative h-screen w-full overflow-hidden">
        {/* image bleeds off the right; subtle scale + fade reveal */}
        <div
          className="absolute inset-y-0 right-0 w-[calc(44%_+_400px)]"
          style={
            imageFadeExtra
              ? {
                  ...IMG_MASK,
                  WebkitMaskImage: `linear-gradient(to right, transparent 0%, #000 calc(25% + ${imageFadeExtra}px)), linear-gradient(to bottom, transparent 0%, #000 13%, #000 87%, transparent 100%)`,
                  maskImage: `linear-gradient(to right, transparent 0%, #000 calc(25% + ${imageFadeExtra}px)), linear-gradient(to bottom, transparent 0%, #000 13%, #000 87%, transparent 100%)`,
                }
              : IMG_MASK
          }
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={img}
            src={imageSrc}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>

        {/* headline — starts centered, each line glides to flush-left */}
        <div
          ref={head}
          className="display absolute"
          style={{
            lineHeight: 1.16,
            letterSpacing: "-0.01em",
            textAlign: "left",
            width: contentWidth ?? "max-content",
          }}
        >
          {HEADLINE.map((line, i) => (
            <div
              key={i}
              style={{
                fontSize: "clamp(1.3rem, 3vw, 40px)",
                paddingBottom: "0.1em",
                whiteSpace: "nowrap",
                width: "max-content",
              }}
            >
              {line.split(" ").map((word, wi, arr) => (
                <span key={wi} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
                  {Array.from(word).map((ch, ci) => (
                    <span key={ci} className="ov-char" style={GOLD}>
                      {ch}
                    </span>
                  ))}
                  {wi < arr.length - 1 ? (
                    <span className="ov-char" style={GOLD}>
                      {" "}
                    </span>
                  ) : null}
                </span>
              ))}
            </div>
          ))}
        </div>

        {/* paragraph — ABC Social Hairline, word-by-word blur reveal */}
        <p
          ref={para}
          className="absolute left-6 top-[63%] md:left-14"
          style={{
            color: "var(--ink-dim)",
            maxWidth: contentWidth ?? "54ch",
            fontFamily: "var(--font-social), sans-serif",
            fontSize: paragraphFontSize,
            lineHeight: 1.7,
          }}
        >
          {PARAGRAPH.replace(/ (\S+)$/, String.fromCharCode(160) + "$1").split(" ").map((word, wi, arr) => (
            <span key={wi} className="ov-word" style={{ display: "inline-block", whiteSpace: "pre" }}>
              {word}
              {wi < arr.length - 1 ? " " : ""}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
