"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * ALT of ExpandingType (?conviction=alt).
 *
 * Same statement + description blur-reveal, but instead of a circular hole that
 * grows out of the sentence, the full-bleed video is revealed with a soft
 * bottom-to-top WIPE: an opaque mask edge climbs from below the fold to the top,
 * and its leading (top) edge is a feathered gradient so the footage softly merges
 * into the page background as it takes over — the same soft-mask language used in
 * VideoReveal. The text fades out as the video climbs past it.
 */
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

const LINE: React.CSSProperties = {
  fontSize: "clamp(1.3rem, 3vw, 40px)",
  lineHeight: 1.16,
  letterSpacing: "-0.01em",
  whiteSpace: "nowrap",
};

const smoothstep = (t: number) => t * t * (3 - 2 * t);
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

const Chars = ({ text }: { text: string }) => (
  <>
    {Array.from(text).map((ch, i) => (
      <span key={i} className="cv-char" style={GOLD}>
        {ch}
      </span>
    ))}
  </>
);

export default function ExpandingTypeAlt() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const clip = useRef<HTMLDivElement>(null);
  const textWrap = useRef<HTMLDivElement>(null);
  const para = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const sec = section.current;
    const stg = stage.current;
    const v = video.current;
    const cl = clip.current;
    if (!sec || !stg || !v || !cl) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const audit = new URLSearchParams(window.location.search).has("audit");
    const chars = Array.from(stg.querySelectorAll<HTMLElement>(".cv-char"));
    const words = Array.from(stg.querySelectorAll<HTMLElement>(".cv-word"));
    const navScrim = stg.querySelector<HTMLElement>(".nav-scrim");

    // playback is scroll-driven; a muted play() kicks the decode so seeking shows frames
    v.muted = true;
    v.play().then(() => v.pause()).catch(() => {});

    gsap.set(chars, { filter: "blur(12px)", opacity: 0 });
    gsap.set(words, { filter: "blur(8px)", opacity: 0, y: 10 });

    // --r is the position of the opaque mask edge: -18% = fully hidden (feather sits
    // off-screen below), 100% = fully covering (feather off the top). The 18% gap above
    // --r is the soft transparent falloff so the top edge merges into the background.
    const setReveal = (e: number) => {
      cl.style.setProperty("--r", (e * 118 - 18).toFixed(2) + "%");
      cl.style.transform = `scale(${(1.06 - 0.06 * e).toFixed(3)})`;
    };

    const apply = (p: number) => {
      // video wipe expansion — drives the text fade too
      const e = gsap.parseEase("power2.inOut")(clamp((p - 0.26) / 0.62));
      // text fades as the rising video passes over it (centred, so gone by mid-climb)
      const fade = 1 - smoothstep(clamp((e - 0.1) / 0.4));

      // 1 — statement + description blur-reveal first
      const r = clamp(p / 0.2);
      const n = chars.length;
      chars.forEach((c, i) => {
        const start = (i / Math.max(n - 1, 1)) * 0.6;
        const ci = smoothstep(clamp((r - start) / 0.4));
        c.style.filter = `blur(${((1 - ci) * 12).toFixed(2)}px)`;
        c.style.opacity = (ci * fade).toFixed(3);
      });
      const wr = clamp((p - 0.12) / 0.12);
      const m = words.length;
      words.forEach((w, i) => {
        const start = (i / Math.max(m - 1, 1)) * 0.6;
        const wi = smoothstep(clamp((wr - start) / 0.4));
        w.style.filter = `blur(${((1 - wi) * 8).toFixed(2)}px)`;
        w.style.opacity = (wi * fade).toFixed(3);
        w.style.transform = `translateY(${((1 - wi) * 10).toFixed(1)}px)`;
      });

      // 2 — soft bottom-to-top wipe of the full-bleed video
      setReveal(e);
      // top scrim so the nav stays readable once the video takes over
      if (navScrim) navScrim.style.opacity = e.toFixed(3);

      // scroll-scrubbed playback — frame 0 exactly when the reveal begins
      if (Number.isFinite(v.duration) && v.duration > 0)
        v.currentTime = clamp((p - 0.26) / 0.74) * (v.duration - 0.05);
    };

    if (audit || reduce) {
      gsap.set(chars, { filter: "blur(0px)", opacity: 1 });
      gsap.set(words, { filter: "blur(0px)", opacity: 1, y: 0 });
      setReveal(1);
      if (navScrim) navScrim.style.opacity = "1";
      v.play?.().catch(() => {});
      return;
    }
    apply(0);
    stg.style.opacity = "0"; // hidden until it pins (sits pulled-up behind the prev section)

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sec,
        start: "top top",
        end: "+=200%",
        pin: stg,
        pinType: "fixed",
        scrub: 0.6,
        invalidateOnRefresh: true,
        // re-apply the CURRENT progress, not 0 (see ExpandingType — a mid-page refresh
        // would otherwise reset the visuals while the stage stays visible)
        onRefresh: (self) => apply(clamp(self.progress / 0.88)),
        onUpdate: (self) => {
          // content completes over the first 88% so it holds full-bleed before the fade
          apply(clamp(self.progress / 0.88));
          const inA = clamp(self.progress / 0.05);
          const outA = clamp((self.progress - 0.95) / 0.05);
          stg.style.opacity = (smoothstep(inA) * (1 - smoothstep(outA))).toFixed(3);
        },
      });
    }, sec);

    return () => ctx.revert();
  }, []);

  return (
    <section id="conviction" ref={section} className="relative" style={{ marginTop: "-100vh" }}>
      {/* section-bg = opaque page-matched gradient. Without it the stage is
          transparent and the NEXT section (pulled up -100vh behind this one)
          shows straight through — the "jumps to the next section" bug. */}
      <div ref={stage} className="section-bg relative h-screen w-full overflow-hidden">
        {/* full-bleed video, revealed by a soft bottom-to-top gradient mask */}
        <div
          ref={clip}
          className="absolute inset-0 will-change-transform"
          style={
            {
              "--r": "-18%",
              WebkitMaskImage:
                "linear-gradient(to top, #000 var(--r), rgba(0,0,0,0) calc(var(--r) + 18%))",
              maskImage:
                "linear-gradient(to top, #000 var(--r), rgba(0,0,0,0) calc(var(--r) + 18%))",
            } as React.CSSProperties
          }
        >
          <video
            ref={video}
            src="/media/video/facade2-hd.mp4"
            poster="/media/poster/facade2.jpg"
            muted
            loop={false}
            playsInline
            preload="auto"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "rgba(10,8,6,0.12)" }}
          />
        </div>

        {/* top scrim — keeps the nav legible over the bright full-bleed video */}
        <div
          className="nav-scrim pointer-events-none absolute inset-x-0 top-0 h-[16vh]"
          style={{ background: "linear-gradient(to bottom, rgba(10,8,6,0.4), transparent)", opacity: 0 }}
        />

        <div ref={textWrap} className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <div className="display" style={LINE}>
            <Chars text="Markets evolve when someone is" />
          </div>
          <div className="display" style={LINE}>
            <Chars text="willing to challenge the conventions." />
          </div>

          {/* description — word-by-word blur reveal, same as the other sections */}
          <p
            ref={para}
            className="mt-[30px]"
            style={{
              color: "var(--ink-dim)",
              maxWidth: "52ch",
              fontFamily: "var(--font-social), sans-serif",
              fontSize: "16.5px",
              lineHeight: 1.7,
            }}
          >
            {PARAGRAPH.replace(/ (\S+)$/, String.fromCharCode(160) + "$1").split(" ").map((word, wi, arr) => (
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
