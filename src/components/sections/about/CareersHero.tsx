"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { clamp } from "./kit";

/**
 * Careers hero — the ActHero treatment from /the-alpago: a full-bleed video bed with
 * the gold wordmark rising per-letter, then a two-phase pin where the whole frame
 * (video + wordmark) WIPES away bottom-up as you scroll, revealing the statement act
 * beneath (which is `underWipe`). Dark footage → nav flips cream.
 */

const WORD = "Culture & Careers";

const HERO_GOLD: React.CSSProperties = {
  backgroundImage: "linear-gradient(180deg, #f0d9ad 0%, #dcbb85 46%, #c69a56 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
};

export default function CareersHero() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const clip = useRef<HTMLDivElement>(null);
  const intro = useRef<HTMLParagraphElement>(null);
  const vid = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    const sec = section.current;
    const stg = stage.current;
    if (!sec || !stg) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const audit = new URLSearchParams(window.location.search).has("audit");
    const chars = Array.from(stg.querySelectorAll<HTMLElement>(".hero-char"));
    const v = vid.current;
    if (v) {
      v.muted = true;
      v.play().catch(() => {});
    }

    const setWipe = (r: number) => {
      if (clip.current) clip.current.style.setProperty("--r", r.toFixed(2) + "%");
    };

    if (audit || reduce) {
      gsap.set(chars, { yPercent: 0 });
      if (intro.current) intro.current.style.opacity = "1";
      setWipe(130);
      return;
    }

    // intro reveal — wordmark rises per-letter, intro fades in
    gsap.set(chars, { yPercent: 115 });
    if (intro.current) gsap.set(intro.current, { opacity: 0, y: 24 });
    setWipe(130);
    const tl = gsap.timeline({ delay: 0.2 });
    tl.to(chars, { yPercent: 0, duration: 1.15, ease: "power3.out", stagger: { amount: 0.4 } }, 0);
    if (intro.current) tl.to(intro.current, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }, 0.55);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sec,
        start: "top top",
        end: "+=170%",
        pin: stg,
        pinType: "fixed",
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // the frame wipes away bottom-up over the pin (soft feathered edge)
          const r = 130 - self.progress * 170; // 130% → -40%
          setWipe(r);
          stg.dataset.navoff = r < 8 ? "1" : "0";
        },
        onLeave: () => {
          stg.style.visibility = "hidden";
          stg.dataset.navoff = "1";
          sec.style.zIndex = "0";
        },
        onEnterBack: () => {
          stg.style.visibility = "visible";
          stg.dataset.navoff = "0";
          sec.style.zIndex = "20";
        },
      });
    }, sec);

    return () => {
      tl.kill();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={section} className="relative z-20">
      <div ref={stage} data-navoff="0" className="nav-dark relative h-screen w-full overflow-hidden">
        <div
          ref={clip}
          className="absolute inset-0 will-change-[mask]"
          style={
            {
              "--r": "130%",
              WebkitMaskImage: "linear-gradient(to bottom, #000 var(--r), rgba(0,0,0,0) calc(var(--r) + 70%))",
              maskImage: "linear-gradient(to bottom, #000 var(--r), rgba(0,0,0,0) calc(var(--r) + 70%))",
            } as React.CSSProperties
          }
        >
          <video
            ref={vid}
            src="/media/video/careers-hero-20260811-111648.mp4"
            poster="/media/poster/careers-hero.jpg"
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-x-0 top-[-4%] h-[108%] w-full object-cover object-center"
            style={{ filter: "brightness(0.64) sepia(0.24) saturate(0.78) hue-rotate(-7deg)" }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: "linear-gradient(to top, rgba(10,8,6,0.68) 0%, rgba(10,8,6,0.52) 56%, rgba(10,8,6,0) 82%)",
            }}
          />

          {/* wordmark + intro (inside the clip, so they wipe away with the video) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <h1 className="display" style={{ lineHeight: 1.02, letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>
              {Array.from(WORD).map((ch, i) => (
                <span
                  key={i}
                  className="inline-block overflow-hidden"
                  style={{ verticalAlign: "bottom", paddingBottom: "0.16em", marginBottom: "-0.16em" }}
                >
                  <span className="hero-char inline-block" style={{ ...HERO_GOLD, fontSize: "clamp(1.9rem, 6.2vw, 92px)" }}>
                    {ch === " " ? " " : ch}
                  </span>
                </span>
              ))}
            </h1>

            <p
              ref={intro}
              className="mt-8"
              style={{
                opacity: 0,
                color: "#ffffff",
                textShadow: "0 1px 3px rgba(0,0,0,1), 0 6px 26px rgba(0,0,0,0.98)",
                maxWidth: "52ch",
                fontFamily: "var(--font-social), sans-serif",
                fontSize: "17px",
                fontWeight: 600,
                lineHeight: 1.75,
              }}
            >
              A career at Alpago is an opportunity to contribute to work that raises expectations,
              challenges convention, and leaves a lasting impact.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
