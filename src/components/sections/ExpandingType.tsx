"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Conviction act: the statement blur-reveals first, then a custom SHAPE mask
 * (Vector 2440 — an organic petal/blob from the brand kit) SCALES UP IN PLACE from
 * the centre of the frame until the video behind it is full-bleed. It never travels.
 * The sentence stays intact on one line — nothing pushes the words apart.
 * Playback is scroll-scrubbed and starts from 0.
 */
const DEFAULT_PARAGRAPH =
  "Alpago has helped shape Dubai’s ultra-prime residential landscape, consistently redefining the meaning of luxury living. Guided by the belief that exceptional residences should reflect individuality, architectural distinction and enduring value, we create homes that set new benchmarks for the market.";

// Vector 2440 — the mask silhouette. Natural bbox ≈ x[-2.8, 69.4] y[0, 88.4].
const SHAPE_D =
  "M66.1776 40.358L57.066 0.000110423L17.683 20.3294C4.06781 27.3575 -2.83138 42.9055 1.09311 57.7166C6.621 78.5788 30.5038 88.4385 49.1389 77.5517L50.3086 76.8684C62.9916 69.4588 69.4125 54.6862 66.1776 40.358Z";
const SHAPE_CX = 33.3; // bbox centre, used as the transform origin
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

const Chars = ({ text }: { text: string }) => (
  <>
    {Array.from(text).map((ch, i) => (
      <span key={i} className="cv-char" style={GOLD}>
        {ch}
      </span>
    ))}
  </>
);

export default function ExpandingType({
  headline = ["Markets evolve when someone is", "willing to challenge the conventions."],
  paragraph = DEFAULT_PARAGRAPH,
  videoSrc = "/media/video/facade2-hd.mp4",
  posterSrc = "/media/poster/facade2.jpg",
  imageSrc,
  zoomVideo = false,
  zoomAmount = 0.08,
}: {
  headline?: [string, string];
  paragraph?: string;
  videoSrc?: string;
  posterSrc?: string;
  imageSrc?: string;
  zoomVideo?: boolean;
  zoomAmount?: number;
}) {
  const PARAGRAPH = paragraph;
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const textWrap = useRef<HTMLDivElement>(null);
  const para = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const sec = section.current;
    const stg = stage.current;
    const v = video.current;
    const picture = image.current;
    const mediaEl = picture ?? v;
    const tx = textWrap.current;
    if (!sec || !stg || !mediaEl || !tx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const audit = new URLSearchParams(window.location.search).has("audit");
    const chars = Array.from(stg.querySelectorAll<HTMLElement>(".cv-char"));
    const words = Array.from(stg.querySelectorAll<HTMLElement>(".cv-word"));

    const maskShape = stg.querySelector<SVGElement>("#vmaskShape");
    const navScrim = stg.querySelector<HTMLElement>(".nav-scrim");

    // playback is scroll-driven; a muted play() kicks the decode so seeking shows frames
    if (v) {
      v.muted = true;
      v.play().then(() => v.pause()).catch(() => {});
    }

    gsap.set(chars, { filter: "blur(12px)", opacity: 0 });
    gsap.set(words, { filter: "blur(8px)", opacity: 0, y: 10 });

    const apply = (p: number) => {
      // 1 — statement + description blur-reveal first
      const r = clamp(p / 0.22);
      const n = chars.length;
      // the text dissolves exactly as the shape opens, so the shape never appears to
      // sit "inside" the sentence — it's a clean hand-off from words to image
      const fade = 1 - smoothstep(clamp((p - 0.24) / 0.2));
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

      // 2 — the SHAPE mask SCALES UP IN PLACE from the centre of the frame until the
      // video behind it is full-bleed. It never travels — only the scale changes, and
      // the video never moves or zooms either.
      const st = stg.getBoundingClientRect();
      if (!st.width || !st.height) return; // not laid out yet — a later call will size it
      // Two beats, both pure scale about the SAME fixed centre (no travel):
      //   open → from nothing up to a size where the silhouette actually reads
      //   grow → from there out to full-bleed
      const open = smoothstep(clamp((p - 0.24) / 0.3));
      const grow = smoothstep(clamp((p - 0.58) / 0.34));

      const s0 = (st.height * 0.46) / SHAPE_H; // readable "hero" size for the shape
      const sCover = Math.hypot(st.width, st.height) / 46; // safely covers the frame
      const s = s0 * open + (sCover - s0) * grow;

      const cx = st.width / 2;
      const cy = st.height / 2;

      if (maskShape) {
        maskShape.setAttribute(
          "transform",
          `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${s.toFixed(
            4
          )}) translate(${-SHAPE_CX} ${-SHAPE_CY})`
        );
      }
      // top scrim so the nav stays readable once the video takes over
      if (navScrim) navScrim.style.opacity = grow.toFixed(3);

      // Optional page-specific cinematic push-in. The default Properties act is
      // unchanged; Design & Build opts into this subtle zoom for its own video.
      if (zoomVideo) mediaEl.style.transform = `scale(${(1 + grow * zoomAmount).toFixed(4)})`;

      // scroll-scrubbed playback — frame 0 exactly when the shape appears
      if (v && Number.isFinite(v.duration) && v.duration > 0)
        v.currentTime = clamp((p - 0.24) / 0.76) * (v.duration - 0.05);
    };

    if (audit || reduce) {
      gsap.set(chars, { filter: "blur(0px)", opacity: 1 });
      gsap.set(words, { filter: "blur(0px)", opacity: 1, y: 0 });
      // static preview of the risen shape; re-run once the audit layout has settled
      apply(0.5);
      const t1 = window.setTimeout(() => apply(0.5), 60);
      const t2 = window.setTimeout(() => apply(0.5), 400);
      return () => {
        window.clearTimeout(t1);
        window.clearTimeout(t2);
      };
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
        // re-apply the CURRENT progress, not 0 — a mid-page refresh (e.g. the reveal
        // switcher) would otherwise reset the visuals to their un-started pose while
        // the stage stays visible, leaving the section looking broken
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
      <div ref={stage} className="relative h-screen w-full overflow-hidden">
        {/* full-bleed video at its actual size; the SVG overlay above it repaints the
            page gradient with the Vector 2440 silhouette cut out as a growing hole */}
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            ref={image}
            src={imageSrc}
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover will-change-transform"
          />
        ) : (
          <video
            ref={video}
            src={videoSrc}
            poster={posterSrc}
            muted
            loop={false}
            playsInline
            preload="auto"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover will-change-transform"
          />
        )}
        <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full">
          <defs>
            {/* replica of the page's radial background gradient */}
            <radialGradient id="vbg" cx="0.5" cy="0" r="0.95" gradientTransform="matrix(1 0 0 0.73 0 0)">
              <stop offset="0" stopColor="#5e3f27" />
              <stop offset="0.26" stopColor="#4a3320" />
              <stop offset="0.58" stopColor="#381e10" />
              <stop offset="0.82" stopColor="#1d130b" />
              <stop offset="1" stopColor="#150d07" />
            </radialGradient>
            <mask id="vmask" maskUnits="userSpaceOnUse">
              <rect width="100%" height="100%" fill="white" />
              <path id="vmaskShape" d={SHAPE_D} fill="black" transform="translate(-9999 -9999)" />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="url(#vbg)" mask="url(#vmask)" />
        </svg>
        {/* top scrim — keeps the nav legible over the bright full-bleed video */}
        <div
          className="nav-scrim pointer-events-none absolute inset-x-0 top-0 h-[16vh]"
          style={{ background: "linear-gradient(to bottom, rgba(10,8,6,0.4), transparent)", opacity: 0 }}
        />

        <div ref={textWrap} className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <div className="display" style={LINE}>
            <Chars text={headline[0]} />
          </div>
          {/* one intact line — the shape opens out behind it instead of splitting the words */}
          <div className="display" style={LINE}>
            <Chars text={headline[1]} />
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
