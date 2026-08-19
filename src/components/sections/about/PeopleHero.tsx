"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { clamp, smoothstep } from "./kit";

const WORDS = "The Alpago Family";

const HERO_GOLD: React.CSSProperties = {
  backgroundImage: "linear-gradient(180deg, #f0d9ad 0%, #dcbb85 46%, #c69a56 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
};

/** The same pinned hold + bottom-up feather wipe used by ActHero. */
export default function PeopleHero() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const clip = useRef<HTMLDivElement>(null);
  const crumb = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    const sec = section.current;
    const stg = stage.current;
    if (!sec || !stg) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const audit = new URLSearchParams(window.location.search).has("audit");
    const chars = Array.from(stg.querySelectorAll<HTMLElement>(".hero-char"));
    const img = video.current;

    const setWipe = (r: number) => {
      if (clip.current) clip.current.style.setProperty("--r", r.toFixed(2) + "%");
    };

    if (audit || reduce) {
      gsap.set(chars, { yPercent: 0, opacity: 1 });
      if (crumb.current) crumb.current.style.opacity = "1";
      if (img) gsap.set(img, { scale: 1, autoAlpha: 1 });
      setWipe(130);
      return;
    }

    gsap.set(chars, { yPercent: 115, opacity: 1 });
    if (img) gsap.set(img, { scale: 1.06, autoAlpha: 0 });
    if (crumb.current) crumb.current.style.opacity = "0";
    setWipe(130);

    const reveal = gsap.timeline();
    reveal.to(chars, { yPercent: 0, duration: 1.15, ease: "power3.out", stagger: { amount: 0.45 } }, 0.35);
    if (img) reveal.to(img, { scale: 1, autoAlpha: 1, duration: 1.6, ease: "power2.out" }, 0.2);
    if (crumb.current) reveal.to(crumb.current, { opacity: 1, duration: 0.7, ease: "power2.out" }, 0.15);

    const ctx = gsap.context(() => {
      const HOLD_END = 0.5;
      ScrollTrigger.create({
        trigger: sec,
        start: "top top",
        end: "+=200%",
        pin: stg,
        pinType: "fixed",
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const wp = clamp((self.progress - HOLD_END) / (0.98 - HOLD_END));
          const r = 130 - wp * 170;
          setWipe(r);
          stg.dataset.navoff = r < 8 ? "1" : "0";
          if (crumb.current) crumb.current.style.opacity = (1 - smoothstep(clamp(wp / 0.35))).toFixed(3);
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
      reveal.kill();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={section} id="top" className="relative z-20 w-screen" style={{ marginLeft: "calc((100% - 100vw) / 2)" }}>
      <div ref={crumb} className="caption fixed left-1/2 z-40 hidden items-center gap-2 md:flex" style={{ top: "104px", opacity: 0, transform: "translateX(-50%)" }}>
        <a href="/" style={{ fontSize: "10px", color: "rgba(236,227,213,0.6)", letterSpacing: "0.24em" }}>Home</a>
        <span aria-hidden style={{ color: "rgba(236,227,213,0.45)", fontSize: "10px" }}>/</span>
        <a href="/the-alpago" style={{ fontSize: "10px", color: "rgba(236,227,213,0.6)", letterSpacing: "0.24em" }}>The Alpago</a>
        <span aria-hidden style={{ color: "rgba(236,227,213,0.45)", fontSize: "10px" }}>/</span>
        <span style={{ fontSize: "10px", color: "rgba(240,217,173,0.95)", letterSpacing: "0.24em" }}>People Behind Alpago</span>
      </div>

      <div ref={stage} data-navoff="0" className="nav-dark relative h-screen w-full overflow-hidden">
        <div
          ref={clip}
          className="absolute inset-0 will-change-[mask]"
          style={{
            "--r": "130%",
            WebkitMaskImage: "linear-gradient(to bottom, #000 var(--r), rgba(0,0,0,0) calc(var(--r) + 40%))",
            maskImage: "linear-gradient(to bottom, #000 var(--r), rgba(0,0,0,0) calc(var(--r) + 40%))",
          } as React.CSSProperties}
        >
          <video
            ref={video}
            src="/media/video/transparency-nationalities.mp4"
            muted
            autoPlay
            loop
            playsInline
            preload="auto"
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover object-center will-change-transform"
          />
          <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
            <h1 className="display" style={{ lineHeight: 1.02, letterSpacing: "-0.02em" }}>
              {Array.from(WORDS).map((ch, i) => ch === " " ? (
                <span key={i} aria-hidden style={{ display: "inline-block", width: "0.26em", fontSize: "clamp(2.6rem, 7vw, 104px)" }} />
              ) : (
                <span key={i} className="inline-block overflow-hidden" style={{ verticalAlign: "bottom", paddingBottom: "0.16em", marginBottom: "-0.16em" }}>
                  <span className="hero-char" style={{ ...HERO_GOLD, fontSize: "clamp(2.6rem, 7vw, 104px)" }}>{ch}</span>
                </span>
              ))}
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
