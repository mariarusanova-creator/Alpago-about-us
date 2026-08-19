"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const HEADLINE = [
  "For property owners,",
  "this translates into homes",
  "that consistently achieve",
  "exceptional market recognition.",
];

const PARAGRAPH =
  "For collectors, it means acquiring automobiles whose significance extends far beyond ownership.";

// The exact Vector 2440 silhouette used by the Business conviction transition.
const SHAPE_D =
  "M66.1776 40.358L57.066 0.000110423L17.683 20.3294C4.06781 27.3575 -2.83138 42.9055 1.09311 57.7166C6.621 78.5788 30.5038 88.4385 49.1389 77.5517L50.3086 76.8684C62.9916 69.4588 69.4125 54.6862 66.1776 40.358Z";
const SHAPE_CX = 33.3;
const SHAPE_CY = 44.2;
const SHAPE_H = 88.4;

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

function Chars({ text }: { text: string }) {
  return (
    <>
      {Array.from(text).map((char, index) => (
        <span key={index} className="terrace-char" style={GOLD}>{char}</span>
      ))}
    </>
  );
}

export default function InvestorsTerraceReveal() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    const sec = section.current;
    const stg = stage.current;
    const v = video.current;
    if (!sec || !stg || !v) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const audit = new URLSearchParams(window.location.search).has("audit");
    const chars = Array.from(stg.querySelectorAll<HTMLElement>(".terrace-char"));
    const words = Array.from(stg.querySelectorAll<HTMLElement>(".terrace-word"));
    const maskShape = stg.querySelector<SVGElement>("#investorTerraceMaskShape");
    const navScrim = stg.querySelector<HTMLElement>(".terrace-nav-scrim");

    v.muted = true;
    v.play().then(() => v.pause()).catch(() => {});

    gsap.set(chars, { filter: "blur(12px)", opacity: 0 });
    gsap.set(words, { filter: "blur(8px)", opacity: 0, y: 10 });

    const apply = (progress: number) => {
      // Copied timing from the Business conviction act.
      const reveal = clamp(progress / 0.22);
      const fade = 1 - smoothstep(clamp((progress - 0.24) / 0.2));
      chars.forEach((char, index) => {
        const start = (index / Math.max(chars.length - 1, 1)) * 0.6;
        const amount = smoothstep(clamp((reveal - start) / 0.4));
        char.style.filter = `blur(${((1 - amount) * 12).toFixed(2)}px)`;
        char.style.opacity = (amount * fade).toFixed(3);
      });

      const wordReveal = clamp((progress - 0.12) / 0.12);
      words.forEach((word, index) => {
        const start = (index / Math.max(words.length - 1, 1)) * 0.6;
        const amount = smoothstep(clamp((wordReveal - start) / 0.4));
        word.style.filter = `blur(${((1 - amount) * 8).toFixed(2)}px)`;
        word.style.opacity = (amount * fade).toFixed(3);
        word.style.transform = `translateY(${((1 - amount) * 10).toFixed(1)}px)`;
      });

      const rect = stg.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const open = smoothstep(clamp((progress - 0.24) / 0.3));
      const grow = smoothstep(clamp((progress - 0.58) / 0.34));
      const initialScale = (rect.height * 0.46) / SHAPE_H;
      const coverScale = Math.hypot(rect.width, rect.height) / 46;
      const scale = initialScale * open + (coverScale - initialScale) * grow;

      maskShape?.setAttribute(
        "transform",
        `translate(${(rect.width / 2).toFixed(1)} ${(rect.height / 2).toFixed(1)}) scale(${scale.toFixed(4)}) translate(${-SHAPE_CX} ${-SHAPE_CY})`
      );

      // The requested extra movement: the film gently pushes in while the same
      // Business shape expands to full bleed.
      const videoProgress = clamp((progress - 0.24) / 0.76);
      v.style.transform = `scale(${(1 + videoProgress * 0.06).toFixed(4)})`;
      if (navScrim) navScrim.style.opacity = grow.toFixed(3);
      stg.dataset.navoff = grow > 0.42 ? "0" : "1";

      if (Number.isFinite(v.duration) && v.duration > 0) {
        v.currentTime = videoProgress * (v.duration - 0.05);
      }
    };

    if (audit || reduce) {
      gsap.set(chars, { filter: "blur(0px)", opacity: 1 });
      gsap.set(words, { filter: "blur(0px)", opacity: 1, y: 0 });
      apply(0.5);
      const settle = window.setTimeout(() => apply(0.5), 100);
      return () => window.clearTimeout(settle);
    }

    apply(0);
    stg.style.opacity = "0";

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sec,
        start: "top top",
        end: "+=200%",
        pin: stg,
        pinType: "fixed",
        scrub: 0.6,
        invalidateOnRefresh: true,
        onRefresh: (self) => apply(clamp(self.progress / 0.88)),
        onUpdate: (self) => {
          apply(clamp(self.progress / 0.88));
          const enter = clamp(self.progress / 0.05);
          const leave = clamp((self.progress - 0.95) / 0.05);
          stg.style.opacity = (smoothstep(enter) * (1 - smoothstep(leave))).toFixed(3);
        },
      });
    }, sec);

    return () => {
      ctx.revert();
      v.pause();
    };
  }, []);

  return (
    <section id="terrace-reveal" ref={section} className="relative" style={{ marginTop: "-100vh" }}>
      <div ref={stage} data-navoff="1" className="nav-dark relative h-screen w-full overflow-hidden">
        <video
          ref={video}
          src="/media/video/investors-terrace.mp4"
          poster="/media/poster/investors-terrace.jpg"
          muted
          loop={false}
          playsInline
          preload="auto"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover will-change-transform"
        />

        <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full">
          <defs>
            <radialGradient id="investorTerraceBg" cx="0.5" cy="0" r="0.95" gradientTransform="matrix(1 0 0 0.73 0 0)">
              <stop offset="0" stopColor="#ebe7dd" />
              <stop offset="0.26" stopColor="#e6e2d6" />
              <stop offset="0.58" stopColor="#e0dcd1" />
              <stop offset="0.82" stopColor="#d7d2c5" />
              <stop offset="1" stopColor="#cfc9bb" />
            </radialGradient>
            <mask id="investorTerraceMask" maskUnits="userSpaceOnUse">
              <rect width="100%" height="100%" fill="white" />
              <path id="investorTerraceMaskShape" d={SHAPE_D} fill="black" transform="translate(-9999 -9999)" />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="url(#investorTerraceBg)" mask="url(#investorTerraceMask)" />
        </svg>

        <div
          className="terrace-nav-scrim pointer-events-none absolute inset-x-0 top-0 h-[16vh]"
          style={{ background: "linear-gradient(to bottom, rgba(10,8,6,0.4), transparent)", opacity: 0 }}
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          {HEADLINE.map((line) => (
            <div key={line} className="display" style={LINE}>
              <Chars text={line} />
            </div>
          ))}
          <p
            className="mt-[27px]"
            style={{
              color: "var(--ink-dim)",
              maxWidth: "56ch",
              fontFamily: "var(--font-social), sans-serif",
              fontSize: "16.5px",
              lineHeight: 1.75,
            }}
          >
            {PARAGRAPH.replace(/ (\S+)$/, String.fromCharCode(160) + "$1").split(" ").map((word, index, words) => (
              <span key={index} className="terrace-word" style={{ display: "inline-block", whiteSpace: "pre" }}>
                {word}{index < words.length - 1 ? " " : ""}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
