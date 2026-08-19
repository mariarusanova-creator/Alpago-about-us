"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Billionaire's Row — ALT version for A/B testing (?row=alt):
 * the first image starts full-bleed, then scales down and TRAVELS LEFT with scroll,
 * settling as a tall card on the left while the statement blur-reveals on the right;
 * keep scrolling and the second image MASKS IN (bottom→up) inside the card while the
 * right text swaps to the "finest expression" statement. Merges into the footer.
 */
const HEADLINE = ["Our work catalysed the", "creation of Billionaire’s Row."];
const PARAGRAPH =
  "Through a collection of exceptional residences on Palm Jumeirah, Alpago contributed to the emergence of what is now widely recognised as Dubai’s Billionaire’s Row. The enclave has become one of the city’s most coveted residential addresses, attracting global business leaders, investors, and ultra-high-net-worth individuals seeking architectural distinction and enduring value.";
const HEADLINE2 = ["Your residence should be", "the finest expression of", "your standards. Nothing less."];
const PARAGRAPH2 =
  "The finest homes are defined by the conviction behind every decision. At Alpago, every residence begins with a single question: what becomes possible when every decision is made without compromise? The answer is more than a home. It is an enduring asset, a lasting expression of personal identity, and a benchmark for exceptional living.";

const noOrphan = (s: string) => s.replace(/ (\S+)$/, String.fromCharCode(160) + "$1");

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
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function TextBlock({
  headline,
  paragraph,
  charClass,
  wordClass,
  refFn,
}: {
  headline: string[];
  paragraph: string;
  charClass: string;
  wordClass: string;
  refFn: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div ref={refFn} className="absolute inset-0">
      {headline.map((line, i) => (
        <div
          key={i}
          className="display"
          style={{ fontSize: "clamp(1.2rem, 2.6vw, 36px)", lineHeight: 1.18, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}
        >
          {Array.from(line).map((ch, ci) => (
            <span key={ci} className={charClass} style={GOLD}>
              {ch}
            </span>
          ))}
        </div>
      ))}
      <p
        className="mt-[30px]"
        style={{
          color: "var(--ink-strong)",
          maxWidth: "44ch",
          fontFamily: "var(--font-social), sans-serif",
          fontSize: "16.5px",
          lineHeight: 1.7,
        }}
      >
        {noOrphan(paragraph).split(" ").map((word, wi, arr) => (
          <span key={wi} className={wordClass} style={{ display: "inline-block", whiteSpace: "pre" }}>
            {word}
            {wi < arr.length - 1 ? " " : ""}
          </span>
        ))}
      </p>
    </div>
  );
}

export default function BillionairesRowAlt() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const img2 = useRef<HTMLDivElement>(null);
  const block1 = useRef<HTMLDivElement | null>(null);
  const block2 = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const sec = section.current;
    const stg = stage.current;
    const fr = frame.current;
    const i2 = img2.current;
    if (!sec || !stg || !fr || !i2) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const audit = new URLSearchParams(window.location.search).has("audit");
    const chars1 = Array.from(stg.querySelectorAll<HTMLElement>(".cv-char"));
    const words1 = Array.from(stg.querySelectorAll<HTMLElement>(".cv-word"));
    const chars2 = Array.from(stg.querySelectorAll<HTMLElement>(".b2-char"));
    const words2 = Array.from(stg.querySelectorAll<HTMLElement>(".b2-word"));

    gsap.set([...chars1, ...chars2], { filter: "blur(12px)", opacity: 0 });
    gsap.set([...words1, ...words2], { filter: "blur(8px)", opacity: 0, y: 10 });

    const reveal = (els: HTMLElement[], r: number, fadeOut: number, blur: number) => {
      const n = els.length;
      els.forEach((el, i) => {
        const start = (i / Math.max(n - 1, 1)) * 0.6;
        const v = smoothstep(clamp((r - start) / 0.4)) * fadeOut;
        el.style.filter = `blur(${((1 - v) * blur).toFixed(2)}px)`;
        el.style.opacity = v.toFixed(3);
      });
    };

    const apply = (p: number) => {
      const st = stg.getBoundingClientRect();

      // 0 — ENTER like the main version: the image rises as a sun, then expands
      const R0 = Math.min(st.width * 0.29, 410);
      const coverR = (Math.hypot(st.width, st.height) / 2) * 1.08;
      const rise = smoothstep(clamp(p / 0.2));
      const grow = smoothstep(clamp((p - 0.22) / 0.12));
      const R = lerp(R0, coverR, grow);
      const cyR = lerp(st.height + R0, st.height + R0 * 0.2, rise);
      const cy = lerp(cyR, st.height / 2, grow);
      const clip = `circle(${R.toFixed(1)}px at 50% ${cy.toFixed(1)}px)`;
      fr.style.clipPath = clip;
      (fr.style as CSSStyleDeclaration & { webkitClipPath?: string }).webkitClipPath = clip;

      // 1 — then the right edge travels LEFT: the image becomes a full-height panel
      // bleeding off the left edge with a soft melt, like the Overview section
      const t = gsap.parseEase("power2.inOut")(clamp((p - 0.4) / 0.2));
      fr.style.left = "0px";
      fr.style.top = "0px";
      fr.style.height = st.height.toFixed(1) + "px";
      fr.style.width = lerp(st.width, st.width * 0.46, t).toFixed(1) + "px";
      const fadeR = lerp(0.01, 34, t);
      const fadeV = lerp(0.01, 13, t);
      const m = `linear-gradient(to left, transparent 0%, #000 ${fadeR.toFixed(1)}%), linear-gradient(to bottom, transparent 0%, #000 ${fadeV.toFixed(1)}%, #000 ${(100 - fadeV).toFixed(1)}%, transparent 100%)`;
      fr.style.webkitMaskImage = m;
      fr.style.maskImage = m;

      // 2 — first statement reveals on the right as the panel settles
      const out1 = 1 - smoothstep(clamp((p - 0.72) / 0.08));
      reveal(chars1, clamp((p - 0.6) / 0.12), out1, 12);
      reveal(words1, clamp((p - 0.66) / 0.1), out1, 8);
      words1.forEach((w) => (w.style.transform = `translateY(${((1 - parseFloat(w.style.opacity || "0")) * 8).toFixed(1)}px)`));

      // 3 — the second image MASKS IN (bottom→up) inside the panel…
      const wf = smoothstep(clamp((p - 0.68) / 0.14));
      const wclip = `inset(${(100 - wf * 100).toFixed(2)}% 0 0 0)`;
      i2.style.clipPath = wclip;
      (i2.style as CSSStyleDeclaration & { webkitClipPath?: string }).webkitClipPath = wclip;

      // …while the right text swaps to the second statement (sequential, no overlap)
      reveal(chars2, clamp((p - 0.8) / 0.1), 1, 12);
      reveal(words2, clamp((p - 0.86) / 0.09), 1, 8);
      words2.forEach((w) => (w.style.transform = `translateY(${((1 - parseFloat(w.style.opacity || "0")) * 8).toFixed(1)}px)`));
    };

    if (audit || reduce) {
      gsap.set([...chars1, ...chars2], { filter: "blur(0px)", opacity: 1 });
      gsap.set([...words1, ...words2], { filter: "blur(0px)", opacity: 1, y: 0 });
      apply(0.6);
      return;
    }
    apply(0);
    stg.style.opacity = "0"; // hidden until it pins

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sec,
        start: "top top",
        end: "+=280%",
        pin: stg,
        pinType: "fixed",
        scrub: 0.6,
        invalidateOnRefresh: true,
        onRefresh: (self) => apply(clamp(self.progress / 0.9)),
        onUpdate: (self) => {
          apply(clamp(self.progress / 0.9));
          // fade in only — merges straight into the footer below
          stg.style.opacity = smoothstep(clamp(self.progress / 0.05)).toFixed(3);
        },
      });
    }, sec);

    return () => ctx.revert();
  }, []);

  return (
    <section id="row" ref={section} className="relative" style={{ marginTop: "-100vh" }}>
      <div ref={stage} className="relative h-screen w-full overflow-hidden">
        {/* the travelling image frame — full-bleed → card on the left */}
        <div ref={frame} className="absolute overflow-hidden" style={{ left: 0, top: 0, clipPath: "circle(0px at 50% 120%)", willChange: "width, clip-path" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/img/DJI_0796.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "50% 62%" }}
          />
          {/* second image masks in from the bottom inside the same frame */}
          <div ref={img2} className="absolute inset-0" style={{ clipPath: "inset(100% 0 0 0)", willChange: "clip-path" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/alp/r-08572.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
          </div>
        </div>

        {/* soft scrim behind the right column for legibility over imagery */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-[56%]"
          style={{ background: "linear-gradient(to left, rgba(10,8,6,0.38) 55%, transparent 100%)" }}
        />
        {/* right column — the two statements, swapped in sequence */}
        <div className="over-img absolute top-[24%] right-[6%] left-[52%]">
          <TextBlock
            headline={HEADLINE}
            paragraph={PARAGRAPH}
            charClass="cv-char"
            wordClass="cv-word"
            refFn={(el) => (block1.current = el)}
          />
          <TextBlock
            headline={HEADLINE2}
            paragraph={PARAGRAPH2}
            charClass="b2-char"
            wordClass="b2-word"
            refFn={(el) => (block2.current = el)}
          />
        </div>
      </div>
    </section>
  );
}
