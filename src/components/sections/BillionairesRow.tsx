"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Billionaire's Row — a centred statement with the dusk villa revealing as a
 * full-width straight edge rising from the bottom, its top edge feathered so it
 * merges softly into the page (client note: no circle/"sun" shape — plain
 * full-section overlap). Same storytelling approach as the rest of the page:
 * pinned, scroll-scrubbed, blur-reveal typography, content completes and holds
 * before the section fades out.
 */
const DEFAULT_HEADLINE = ["Our work catalysed the", "creation of Billionaire’s Row."];
const DEFAULT_PARAGRAPH =
  "Through a collection of exceptional residences on Palm Jumeirah, Alpago contributed to the emergence of what is now widely recognised as Dubai’s Billionaire’s Row. The enclave has become one of the city’s most coveted residential addresses, attracting global business leaders, investors, and ultra-high-net-worth individuals seeking architectural distinction and enduring value.";

// phase 2 — masked in from the bottom over the full-screen image
const DEFAULT_HEADLINE2 = ["Your residence should be", "the finest expression of", "your standards. Nothing less."];
const DEFAULT_PARAGRAPH2 =
  "The finest homes are defined by the conviction behind every decision. At Alpago, every residence begins with a single question: what becomes possible when every decision is made without compromise? The answer is more than a home. It is an enduring asset, a lasting expression of personal identity, and a benchmark for exceptional living.";

// bind the last two words with a non-breaking space so no lone word wraps alone
const noOrphan = (s: string) => s.replace(/ (\S+)$/, " $1");

const GOLD: React.CSSProperties = {
  display: "inline-block",
  whiteSpace: "pre",
  backgroundImage: "linear-gradient(180deg, var(--gold-1) 0%, var(--gold-2) 48%, var(--gold-3) 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
};

const smoothstep = (t: number) => t * t * (3 - 2 * t);
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default function BillionairesRow({
  headline = DEFAULT_HEADLINE,
  paragraph = DEFAULT_PARAGRAPH,
  headline2 = DEFAULT_HEADLINE2,
  paragraph2 = DEFAULT_PARAGRAPH2,
  seamlessReverse = false,
  firstImageSrc = "/media/img/DJI_0796.jpg",
  firstVideoSrc,
  secondImageSrc = "/media/alp/r-08572.jpg",
  flipSecondImage = false,
  darkenSecondImageLeft = false,
  lightSecondText = false,
}: {
  headline?: string[];
  paragraph?: string;
  headline2?: string[];
  paragraph2?: string;
  seamlessReverse?: boolean;
  firstImageSrc?: string;
  firstVideoSrc?: string;
  secondImageSrc?: string;
  flipSecondImage?: boolean;
  darkenSecondImageLeft?: boolean;
  lightSecondText?: boolean;
}) {
  const HEADLINE = headline;
  const PARAGRAPH = paragraph;
  const HEADLINE2 = headline2;
  const PARAGRAPH2 = paragraph2;
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const circle = useRef<HTMLDivElement>(null);
  const wipe = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const sec = section.current;
    const stg = stage.current;
    const circ = circle.current;
    const wp = wipe.current;
    if (!sec || !stg || !circ || !wp) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const audit = new URLSearchParams(window.location.search).has("audit");
    const chars = Array.from(stg.querySelectorAll<HTMLElement>(".cv-char"));
    const words = Array.from(stg.querySelectorAll<HTMLElement>(".cv-word"));
    const chars2 = Array.from(stg.querySelectorAll<HTMLElement>(".b2-char"));
    const words2 = Array.from(stg.querySelectorAll<HTMLElement>(".b2-word"));

    gsap.set(chars, { filter: "blur(12px)", opacity: 0 });
    gsap.set(words, { filter: "blur(8px)", opacity: 0, y: 10 });
    gsap.set(chars2, { filter: "blur(12px)", opacity: 0 });
    gsap.set(words2, { filter: "blur(8px)", opacity: 0, y: 10 });

    const apply = (p: number) => {
      // statement + description blur-reveal
      const r = clamp(p / 0.26);
      const n = chars.length;
      chars.forEach((c, i) => {
        const start = (i / Math.max(n - 1, 1)) * 0.6;
        const ci = smoothstep(clamp((r - start) / 0.4));
        c.style.filter = `blur(${((1 - ci) * 12).toFixed(2)}px)`;
        c.style.opacity = ci.toFixed(3);
      });
      const wr = clamp((p - 0.16) / 0.16);
      const m = words.length;
      words.forEach((w, i) => {
        const start = (i / Math.max(m - 1, 1)) * 0.6;
        const wi = smoothstep(clamp((wr - start) / 0.4));
        w.style.filter = `blur(${((1 - wi) * 8).toFixed(2)}px)`;
        w.style.opacity = wi.toFixed(3);
        w.style.transform = `translateY(${((1 - wi) * 10).toFixed(1)}px)`;
      });

      // client note: no circle/"sun" shape — the dusk villa reveals as a FULL-WIDTH
      // straight edge rising from the bottom (plain full-section overlap). Its top
      // edge is feathered so it merges softly into the page, matching the site's
      // other soft-wipe reveals; a subtle scale settles out as it covers.
      // The reveal waits until the statement has fully blur-revealed (text done by
      // p≈0.32 — "show the text first, then start the mask reveal").
      const e = smoothstep(clamp((p - 0.34) / 0.26));
      circ.style.setProperty("--r", (e * 115 - 15).toFixed(2) + "%");
      circ.style.transform = `scale(${(1.06 - 0.06 * e).toFixed(3)})`;
      // flag for the light theme: once the image covers the view the nav flips cream
      sec.dataset.covered = e > 0.75 ? "1" : "0";

      // phase 2 — a second image MASKS IN from the bottom up over the full view,
      // then its statement blur-reveals on top
      const wf = smoothstep(clamp((p - 0.64) / 0.18));
      const wclip = `inset(${(100 - wf * 100).toFixed(2)}% 0 0 0)`;
      wp.style.clipPath = wclip;
      (wp.style as CSSStyleDeclaration & { webkitClipPath?: string }).webkitClipPath = wclip;

      const r2 = clamp((p - 0.78) / 0.12);
      const n2 = chars2.length;
      chars2.forEach((c, i) => {
        const start = (i / Math.max(n2 - 1, 1)) * 0.6;
        const ci = smoothstep(clamp((r2 - start) / 0.4));
        c.style.filter = `blur(${((1 - ci) * 12).toFixed(2)}px)`;
        c.style.opacity = ci.toFixed(3);
      });
      const wr2 = clamp((p - 0.85) / 0.1);
      const m2 = words2.length;
      words2.forEach((w, i) => {
        const start = (i / Math.max(m2 - 1, 1)) * 0.6;
        const wi = smoothstep(clamp((wr2 - start) / 0.4));
        w.style.filter = `blur(${((1 - wi) * 8).toFixed(2)}px)`;
        w.style.opacity = wi.toFixed(3);
        w.style.transform = `translateY(${((1 - wi) * 10).toFixed(1)}px)`;
      });
    };

    if (audit || reduce) {
      gsap.set([...chars, ...chars2], { filter: "blur(0px)", opacity: 1 });
      gsap.set([...words, ...words2], { filter: "blur(0px)", opacity: 1, y: 0 });
      apply(0.55); // image nearly covering — representative mid-act state
      return;
    }
    apply(0);
    stg.style.opacity = "0"; // hidden until it pins (sits pulled-up behind the prev section)

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sec,
        start: "top top",
        end: "+=260%",
        pin: stg,
        pinType: "fixed",
        scrub: 0.6,
        invalidateOnRefresh: true,
        onRefresh: (self) => apply(clamp(self.progress / 0.88)),
        onEnterBack: (self) => {
          if (!seamlessReverse) return;
          // Restore the outgoing frame before GSAP reattaches the fixed pin.
          // Without this, the stage can expose the plain page background for one
          // frame when reversing from the footer.
          apply(clamp(self.progress / 0.88));
          stg.style.opacity = "1";
        },
        onLeave: () => {
          if (!seamlessReverse) return;
          apply(1);
          stg.style.opacity = "1";
        },
        onUpdate: (self) => {
          // content completes over the first 88%, holds, then the section fades out
          apply(clamp(self.progress / 0.88));
          // fade in only — no exit fade, so the section unpins and merges straight
          // into the footer below it
          const inA = clamp(self.progress / 0.05);
          stg.style.opacity = seamlessReverse && self.direction < 0 && self.progress > 0
            ? "1"
            : smoothstep(inA).toFixed(3);
        },
      });
    }, sec);

    return () => ctx.revert();
  }, []);

  return (
    <section id="row" ref={section} className="relative" style={{ marginTop: "-100vh" }}>
      <div ref={stage} className="relative h-screen w-full overflow-hidden">
        {/* centred statement */}
        <div className="absolute inset-x-0 top-[16vh] flex flex-col items-center px-6 text-center">
          {HEADLINE.map((line, i) => (
            <div
              key={i}
              className="display"
              style={{ fontSize: "clamp(1.3rem, 3vw, 40px)", lineHeight: 1.16, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}
            >
              {Array.from(line).map((ch, ci) => (
                <span key={ci} className="cv-char" style={GOLD}>
                  {ch}
                </span>
              ))}
            </div>
          ))}
          <p
            className="mt-[30px]"
            style={{
              color: "var(--ink-dim)",
              maxWidth: "56ch",
              fontFamily: "var(--font-social), sans-serif",
              fontSize: "16.5px",
              lineHeight: 1.7,
            }}
          >
            {noOrphan(PARAGRAPH).split(" ").map((word, wi, arr) => (
              <span key={wi} className="cv-word" style={{ display: "inline-block", whiteSpace: "pre" }}>
                {word}
                {wi < arr.length - 1 ? " " : ""}
              </span>
            ))}
          </p>
        </div>

        {/* full-width straight-edge reveal — the dusk villa rises from the bottom
            behind a soft feathered mask (no shape; plain full-section overlap) */}
        <div
          ref={circle}
          className="absolute inset-0 will-change-transform"
          style={
            {
              "--r": "-15%",
              WebkitMaskImage:
                "linear-gradient(to top, #000 var(--r), rgba(0,0,0,0) calc(var(--r) + 15%))",
              maskImage:
                "linear-gradient(to top, #000 var(--r), rgba(0,0,0,0) calc(var(--r) + 15%))",
            } as React.CSSProperties
          }
        >
          {firstVideoSrc ? (
            <video
              src={firstVideoSrc}
              muted
              autoPlay
              loop
              playsInline
              preload="auto"
              className="h-full w-full object-cover"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={firstImageSrc}
              alt=""
              className="h-full w-full object-cover"
              style={{ objectPosition: "50% 62%" }}
            />
          )}
        </div>

        {/* phase 2 — second image masks in from the BOTTOM UP, statement on top */}
        <div
          ref={wipe}
          className="absolute inset-0"
          style={{ clipPath: "inset(100% 0 0 0)", willChange: "clip-path" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={secondImageSrc}
            alt=""
            className="h-full w-full object-cover"
            style={{ transform: flipSecondImage ? "scaleX(-1)" : undefined }}
          />
          {/* scrim for text legibility */}
          <div
            className="absolute inset-0"
            style={{
              background:
                darkenSecondImageLeft
                  ? "linear-gradient(to right, rgba(6,5,4,0.88) 0%, rgba(6,5,4,0.72) 34%, rgba(6,5,4,0.34) 62%, rgba(6,5,4,0.10) 100%)"
                  : "linear-gradient(to right, rgba(10,8,6,0.42) 0%, rgba(10,8,6,0.24) 46%, rgba(10,8,6,0.08) 100%)",
            }}
          />
          <div className="over-img absolute left-6 right-6 top-[28%] md:left-14 md:right-auto">
            <div>
              {HEADLINE2.map((line, i) => (
                <div
                  key={i}
                  className="display"
                  style={{ fontSize: "clamp(1.3rem, 3vw, 40px)", lineHeight: 1.16, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}
                >
                  {Array.from(line).map((ch, ci) => (
                    <span
                      key={ci}
                      className="b2-char"
                      style={lightSecondText ? { color: "#fff", display: "inline-block", whiteSpace: "pre" } : GOLD}
                    >
                      {ch}
                    </span>
                  ))}
                </div>
              ))}
            </div>
            <p
              className="m-0 mt-[30px]"
              style={{
                color: lightSecondText ? "rgba(255,255,255,0.92)" : "var(--ink-dim)",
                maxWidth: "46ch",
                fontFamily: "var(--font-social), sans-serif",
                fontSize: "16.5px",
                lineHeight: 1.7,
              }}
            >
              {noOrphan(PARAGRAPH2).split(" ").map((word, wi, arr) => (
                <span key={wi} className="b2-word" style={{ display: "inline-block", whiteSpace: "pre" }}>
                  {word}
                  {wi < arr.length - 1 ? " " : ""}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
