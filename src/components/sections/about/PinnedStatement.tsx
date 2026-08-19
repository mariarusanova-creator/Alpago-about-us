"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { GoldLines, Words, smoothstep, clamp } from "./kit";

type Media = { video?: string; image?: string };

type Props = {
  id?: string;
  eyebrow?: string;
  lines: string[];
  paragraph?: string;
  media?: Media;
  /** none = plain bg; bed = full-bleed media behind text; wipe = media soft-reveals bottom-up */
  mode?: "none" | "bed" | "wipe";
  align?: "center" | "left";
  /** first act: no -100vh pull-up, fades in on its own */
  first?: boolean;
  /** revealed by the preceding act's mask wipe: stay visible from the start (its
      opaque cream stage scrolls up under the wipe) instead of fading in on its
      own pin — otherwise the wipe reveals an invisible (transparent) stage */
  underWipe?: boolean;
  /** extend this solid stage upward with a cream feather over the preceding act */
  underGradient?: boolean;
  /** last act before footer: fade-in only, no exit fade */
  last?: boolean;
  /** scroll length of the pin, in % of viewport */
  length?: number;
  /** optional decorative image anchored to the foot of the stage (behind the text)
      — used for the wave motif; drifts a little on scroll */
  footImage?: string;
  /** opacity of the foot image (default 0.6) */
  footOpacity?: number;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  /** keep the stage opaque and fade the bed in separately, avoiding a tinted seam */
  bedReveal?: boolean;
  solidBg?: boolean;
};

export default function PinnedStatement({
  id,
  eyebrow,
  lines,
  paragraph,
  media,
  mode = "none",
  align = "center",
  first = false,
  underWipe = false,
  underGradient = false,
  last = false,
  length = 120,
  footImage,
  footOpacity = 0.6,
  ctaLabel,
  ctaHref = "#",
  secondaryCtaLabel,
  secondaryCtaHref = "#",
  bedReveal = false,
  solidBg = false,
}: Props) {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const clip = useRef<HTMLDivElement>(null);
  const bed = useRef<HTMLDivElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const foot = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const sec = section.current;
    const stg = stage.current;
    if (!sec || !stg) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const audit = new URLSearchParams(window.location.search).has("audit");
    const chars = Array.from(stg.querySelectorAll<HTMLElement>(".ps-char"));
    const words = Array.from(stg.querySelectorAll<HTMLElement>(".ps-word"));
    const eyebrowEl = stg.querySelector<HTMLElement>(".ps-eyebrow");
    const ctaEl = stg.querySelector<HTMLElement>(".ps-cta");
    const v = vid.current;

    if (v) {
      v.muted = true;
      v.play().then(() => (mode === "wipe" ? v.pause() : undefined)).catch(() => {});
    }

    const setReveal = (e: number) => {
      if (mode === "wipe" && clip.current) {
        clip.current.style.setProperty("--r", (e * 118 - 18).toFixed(2) + "%");
        clip.current.style.transform = `scale(${(1.06 - 0.06 * e).toFixed(3)})`;
      }
      if (mode === "bed" && bed.current) {
        bed.current.style.transform = `scale(${(1.14 - 0.12 * e).toFixed(3)}) translateY(${(-4 * e).toFixed(2)}%)`;
        if (bedReveal)
          bed.current.style.opacity = smoothstep(clamp((e - 0.04) / 0.18)).toFixed(3);
      }
    };

    // an underWipe statement is revealed by the PRECEDING act's mask wipe, so its
    // words must already be formed as they scroll up into view — the blur-reveal
    // (gated to this act's own pin) would otherwise leave a blank stage during the
    // wipe, then flash the text in late.
    const setFormed = () => {
      chars.forEach((c) => {
        c.style.filter = "blur(0px)";
        c.style.opacity = "1";
      });
      words.forEach((w) => {
        w.style.filter = "blur(0px)";
        w.style.opacity = "1";
        w.style.transform = "translateY(0px)";
      });
      if (eyebrowEl) eyebrowEl.style.opacity = "1";
      if (ctaEl) {
        ctaEl.style.opacity = "1";
        ctaEl.style.transform = "translateY(0px)";
      }
    };

    const apply = (p: number) => {
      if (underWipe) {
        setFormed();
      } else {
        // 1 — headline chars blur-reveal
        const r = clamp(p / 0.24);
        const n = chars.length;
        chars.forEach((c, i) => {
          const start = (i / Math.max(n - 1, 1)) * 0.6;
          const ci = smoothstep(clamp((r - start) / 0.4));
          c.style.filter = `blur(${((1 - ci) * 12).toFixed(2)}px)`;
          c.style.opacity = ci.toFixed(3);
        });
        // 2 — paragraph words
        const wr = clamp((p - 0.14) / 0.16);
        const m = words.length;
        words.forEach((w, i) => {
          const start = (i / Math.max(m - 1, 1)) * 0.6;
          const wi = smoothstep(clamp((wr - start) / 0.4));
          w.style.filter = `blur(${((1 - wi) * 8).toFixed(2)}px)`;
          w.style.opacity = wi.toFixed(3);
          w.style.transform = `translateY(${((1 - wi) * 10).toFixed(1)}px)`;
        });
        if (eyebrowEl) eyebrowEl.style.opacity = smoothstep(clamp(p / 0.1)).toFixed(3);
        if (ctaEl) {
          const ce = smoothstep(clamp((p - 0.24) / 0.14));
          ctaEl.style.opacity = ce.toFixed(3);
          ctaEl.style.transform = `translateY(${((1 - ce) * 12).toFixed(1)}px)`;
        }
      }

      // 3 — media: bed parallaxes; wipe reveals bottom-up after the text lands
      const e = mode === "wipe" ? smoothstep(clamp((p - 0.32) / 0.42)) : p;
      setReveal(e);
      // in wipe mode the statement dissolves as the film takes over (clean hand-off)
      if (mode === "wipe" && content.current) {
        content.current.style.opacity = (1 - smoothstep(clamp((p - 0.46) / 0.22))).toFixed(3);
        // nav flips to cream only once the dark film covers the frame
        stg.dataset.navoff = e > 0.45 ? "0" : "1";
      } else if (content.current) {
        // continuous slow rise so the pin never feels like dead scroll; underWipe
        // keeps it steady (it's already gliding up on the page scroll under the wipe)
        content.current.style.transform = underWipe
          ? "translateY(0px)"
          : `translateY(${((0.5 - clamp(p)) * 60).toFixed(1)}px)`;
      }

      // scroll-scrubbed playback for the wipe video
      if (mode === "wipe" && v && Number.isFinite(v.duration) && v.duration > 0) {
        v.currentTime = clamp((p - 0.32) / 0.6) * (v.duration - 0.05);
      }
    };

    if (audit || reduce) {
      gsap.set(chars, { filter: "blur(0px)", opacity: 1 });
      gsap.set(words, { filter: "blur(0px)", opacity: 1, y: 0 });
      if (eyebrowEl) eyebrowEl.style.opacity = "1";
      if (ctaEl) {
        ctaEl.style.opacity = "1";
        ctaEl.style.transform = "translateY(0px)";
      }
      setReveal(1);
      v?.play?.().catch(() => {});
      return;
    }

    apply(0);
    setReveal(mode === "wipe" || bedReveal ? 0 : 1);
    // underWipe stages must be visible as they scroll up under the hero's mask
    // wipe; everyone else fades in on their own pin (avoids a bg flash on the way in)
    stg.style.opacity = underWipe || bedReveal ? "1" : "0";

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sec,
        start: "top top",
        end: `+=${length}%`,
        pin: stg,
        pinType: "fixed",
        scrub: 0.6,
        invalidateOnRefresh: true,
        onRefresh: (self) => apply(clamp(self.progress / 0.8)),
        onUpdate: (self) => {
          // content completes early, then the media keeps moving — no hold/dead scroll
          apply(clamp(self.progress / 0.8));
          // fade-IN only; the next act's opaque background covers this one on the way
          // out, so there is no dip-to-background flash between sections. underWipe
          // stages are already visible (revealed by the wipe) — leave them alone.
          if (!underWipe && !bedReveal)
            stg.style.opacity = smoothstep(clamp(self.progress / 0.06)).toFixed(3);
          // driven by GLOBAL scroll (not per-section progress) so #experience and
          // #priority compute the exact same offset and the wave reads as ONE
          // continuous image, not two. Sits low at the foot, drifts up slowly.
          if (foot.current)
            foot.current.style.transform = `translateY(calc(54% - ${(self.scroll() * 0.03).toFixed(1)}px))`;
        },
      });

      // keep the bed video playing only while on screen
      if (mode === "bed" && v) {
        ScrollTrigger.create({
          trigger: sec,
          start: "top bottom",
          end: "bottom top",
          onToggle: (s) => (s.isActive ? v.play().catch(() => {}) : v.pause()),
        });
      }
    }, sec);

    return () => ctx.revert();
  }, [mode, last, length, underWipe, bedReveal]);

  // only the bed mode keeps text permanently over dark film; wipe text sits on the
  // page background until the film covers it (then it has already faded out)
  const overImg = mode === "bed";
  const wrapClass = align === "left" ? "items-start text-left" : "items-center text-center";

  return (
    <section
      id={id}
      ref={section}
      className={underGradient ? "relative z-10" : "relative"}
      // The Careers culture hand-off must let its third card clear the viewport
      // before this cream stage begins. Other statement acts retain the stacked
      // -100vh overlap used for their own wipe choreography.
      style={first || underGradient ? undefined : { marginTop: "-100vh" }}
    >
      {underGradient && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 z-10"
          style={{
            top: "-58vh",
            height: "58vh",
            background: "linear-gradient(to bottom, rgba(239,235,226,0) 0%, var(--bg) 100%)",
          }}
        />
      )}
      <div
        ref={stage}
        data-navoff={mode === "wipe" ? "1" : undefined}
        className={`section-bg relative h-screen w-full overflow-hidden ${mode !== "none" ? "nav-dark" : ""}`}
        style={solidBg ? { background: "var(--bg)" } : undefined}
      >
        {/* decorative foot image (e.g. the wave motif) — anchored to the bottom,
            behind the text, drifting a little on scroll */}
        {footImage && (
          <div
            ref={foot}
            className="pointer-events-none absolute inset-x-0 bottom-0 will-change-transform"
            style={{ opacity: footOpacity, transform: "translateY(54%)" }}
          >
            {/* edge-to-edge (full width, natural aspect), anchored to the very foot */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={footImage} alt="" aria-hidden className="block h-auto w-full" />
          </div>
        )}

        {/* media bed */}
        {mode === "bed" && media && (
          <div className="absolute inset-0 overflow-hidden">
            <div ref={bed} className="absolute inset-[-4%] will-change-transform">
              {media.video ? (
                <video
                  ref={vid}
                  className="h-full w-full object-cover"
                  src={`/media/video/${media.video}.mp4`}
                  poster={`/media/poster/${media.video}.jpg`}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={media.image} alt="" className="h-full w-full object-cover" />
              )}
              <div className="absolute inset-0" style={{ background: "rgba(10,8,6,0.5)" }} />
            </div>
          </div>
        )}

        {/* media wipe (soft bottom-to-top) */}
        {mode === "wipe" && media && (
          <div
            ref={clip}
            className="absolute inset-0 will-change-transform"
            style={
              {
                "--r": "-18%",
                WebkitMaskImage: "linear-gradient(to top, #000 var(--r), rgba(0,0,0,0) calc(var(--r) + 18%))",
                maskImage: "linear-gradient(to top, #000 var(--r), rgba(0,0,0,0) calc(var(--r) + 18%))",
              } as React.CSSProperties
            }
          >
            {media.video ? (
              <video
                ref={vid}
                className="h-full w-full object-cover"
                src={`/media/video/${media.video}.mp4`}
                poster={`/media/poster/${media.video}.jpg`}
                muted
                loop={false}
                playsInline
                preload="auto"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={media.image} alt="" className="h-full w-full object-cover" />
            )}
            <div className="absolute inset-0" style={{ background: "rgba(10,8,6,0.14)" }} />
          </div>
        )}

        {/* text */}
        <div className={`absolute inset-0 flex flex-col justify-center px-6 md:px-14 ${wrapClass}`}>
          <div ref={content} className={`${overImg ? "over-img " : ""}mx-auto flex w-full max-w-[1100px] flex-col ${align === "left" ? "items-start" : "items-center"}`}>
            {eyebrow && (
              <span className="ps-eyebrow caption mb-7" style={{ opacity: 0 }}>
                {eyebrow}
              </span>
            )}
            <GoldLines lines={lines} charClass="ps-char" />
            {/* 40px (mt-10) between the statement and its description — site-wide rule.
                Type size, measure and leading are the section's own. */}
            {paragraph && (
              <p
                className={`mt-[27px] ${align === "left" ? "" : "mx-auto"}`}
                style={{
                  color: "var(--ink-dim)",
                  maxWidth: "56ch",
                  fontFamily: "var(--font-social), sans-serif",
                  fontSize: "16.5px",
                  lineHeight: 1.75,
                }}
              >
                <Words text={paragraph} wordClass="ps-word" />
              </p>
            )}
            {ctaLabel && (
              <div className="ps-cta mt-10 flex flex-wrap items-center justify-center gap-4" style={{ opacity: 0 }}>
                <a
                href={ctaHref}
                className={`caption inline-flex items-center justify-center py-4 transition-colors duration-300 ${secondaryCtaLabel ? "w-[184px] px-6" : "px-12"}`}
                onMouseEnter={(event) => {
                  event.currentTarget.style.background = "#876540";
                  event.currentTarget.style.color = "#f1eadf";
                  event.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.background = "rgba(236,231,219,0.94)";
                  event.currentTarget.style.color = "#30261c";
                  event.currentTarget.style.transform = "translateY(0)";
                }}
                style={{
                  background: "rgba(236,231,219,0.94)",
                  color: "#30261c",
                  letterSpacing: "0.15em",
                  transition: "background-color 420ms ease, color 420ms ease, transform 420ms ease, opacity 300ms ease",
                }}
              >
                {ctaLabel}
                </a>
                {secondaryCtaLabel && (
                  <a
                    href={secondaryCtaHref}
                    className="caption inline-flex w-[184px] items-center justify-center border px-6 py-4 transition-[background-color,color,transform] duration-300"
                    style={{ borderColor: "rgba(236,231,219,0.72)", color: "#f1eadf", letterSpacing: "0.15em" }}
                    onMouseEnter={(event) => { event.currentTarget.style.background = "rgba(236,231,219,0.94)"; event.currentTarget.style.color = "#30261c"; event.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={(event) => { event.currentTarget.style.background = "transparent"; event.currentTarget.style.color = "#f1eadf"; event.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    {secondaryCtaLabel}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
