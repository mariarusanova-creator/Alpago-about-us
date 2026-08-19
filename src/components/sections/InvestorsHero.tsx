"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { clamp, smoothstep } from "@/components/sections/about/kit";

const TITLE_LINES = ["Investing in what", "endures"];

const HERO_GOLD: React.CSSProperties = {
  backgroundImage: "linear-gradient(180deg, #f0d9ad 0%, #dcbb85 46%, #c69a56 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
  filter: "drop-shadow(0 2px 22px rgba(0,0,0,0.55))",
};

export default function InvestorsHero() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const clip = useRef<HTMLDivElement>(null);
  const crumb = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    const sec = section.current;
    const stg = stage.current;
    const v = video.current;
    if (!sec || !stg || !v) return;

    const audit = new URLSearchParams(window.location.search).has("audit");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const chars = Array.from(stg.querySelectorAll<HTMLElement>(".investor-hero-char"));

    v.muted = true;
    v.play().catch(() => {});

    const setWipe = (value: number) => {
      clip.current?.style.setProperty("--investor-wipe", `${value.toFixed(2)}%`);
    };

    if (audit || reduce) {
      gsap.set(chars, { yPercent: 0, opacity: 1 });
      gsap.set(v, { scale: 1, autoAlpha: 1 });
      if (crumb.current) crumb.current.style.opacity = "1";
      if (title.current) title.current.style.opacity = "1";
      setWipe(130);
      return;
    }

    gsap.set(chars, { yPercent: 115, opacity: 1 });
    gsap.set(v, { scale: 1.055, autoAlpha: 0 });
    if (crumb.current) crumb.current.style.opacity = "0";
    if (title.current) title.current.style.opacity = "1";
    setWipe(130);

    const reveal = gsap.timeline({ paused: true });
    reveal.to(v, { scale: 1, autoAlpha: 1, duration: 1.55, ease: "power2.out" }, 0.15);
    reveal.to(chars, { yPercent: 0, duration: 1.05, ease: "power3.out", stagger: { amount: 0.38 } }, 0.3);
    if (crumb.current) reveal.to(crumb.current, { opacity: 1, duration: 0.65, ease: "power2.out" }, 0.2);

    let played = false;
    const begin = () => {
      if (played) return;
      played = true;
      reveal.play();
    };
    window.addEventListener("alpago:intro-done", begin);
    const fallback = window.setTimeout(begin, 2600);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sec,
        start: "top top",
        end: "+=190%",
        pin: stg,
        pinType: "fixed",
        scrub: 0.65,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Match the Business hero: a restrained 6% push-in across the pinned
          // journey, moving continuously with the user's scroll.
          v.style.transform = `scale(${(1 + self.progress * 0.06).toFixed(4)})`;
          const wipeProgress = clamp((self.progress - 0.44) / 0.54);
          const eased = smoothstep(wipeProgress);
          const wipe = 130 - eased * 170;
          setWipe(wipe);
          stg.dataset.navoff = wipe < 8 ? "1" : "0";
          if (title.current) {
            title.current.style.opacity = (1 - smoothstep(clamp(wipeProgress / 0.42))).toFixed(3);
            title.current.style.transform = `translateY(${(-20 * smoothstep(clamp(wipeProgress / 0.5))).toFixed(1)}px)`;
          }
          if (crumb.current) crumb.current.style.opacity = (1 - smoothstep(clamp(wipeProgress / 0.34))).toFixed(3);
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
      window.removeEventListener("alpago:intro-done", begin);
      window.clearTimeout(fallback);
      reveal.kill();
      ctx.revert();
      v.pause();
    };
  }, []);

  return (
    <section ref={section} id="top" className="relative z-20">
      <div
        ref={crumb}
        className="caption fixed left-1/2 z-40 hidden items-center gap-2 md:flex"
        style={{ top: "104px", opacity: 0, transform: "translateX(-50%)" }}
      >
        <a href="/" style={{ fontSize: "10px", color: "rgba(246,240,230,0.84)", letterSpacing: "0.24em", textShadow: "0 1px 12px rgba(0,0,0,0.7)" }}>Home</a>
        <span aria-hidden style={{ color: "rgba(246,240,230,0.66)", fontSize: "10px", textShadow: "0 1px 12px rgba(0,0,0,0.7)" }}>/</span>
        <span style={{ fontSize: "10px", color: "rgba(240,217,173,1)", letterSpacing: "0.24em", textShadow: "0 1px 12px rgba(0,0,0,0.75)" }}>Investors</span>
      </div>

      <div ref={stage} data-navoff="0" className="nav-dark relative h-screen w-full overflow-hidden">
        <div
          ref={clip}
          className="absolute inset-0 will-change-[mask]"
          style={
            {
              "--investor-wipe": "130%",
              WebkitMaskImage: "linear-gradient(to bottom, #000 var(--investor-wipe), rgba(0,0,0,0) calc(var(--investor-wipe) + 40%))",
              maskImage: "linear-gradient(to bottom, #000 var(--investor-wipe), rgba(0,0,0,0) calc(var(--investor-wipe) + 40%))",
            } as React.CSSProperties
          }
        >
          <video
            ref={video}
            src="/media/video/investors-hero.mp4"
            poster="/media/poster/investors-hero.jpg"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover object-center will-change-transform"
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(10,8,6,0.42) 0%, rgba(10,8,6,0.08) 22%, transparent 44%)," +
                "linear-gradient(to top, rgba(10,8,6,0.66) 0%, rgba(10,8,6,0.16) 32%, transparent 58%)," +
                "radial-gradient(120% 115% at 50% 48%, transparent 52%, rgba(8,6,5,0.32) 100%)",
            }}
          />

          <div ref={title} className="absolute inset-x-0 bottom-[8vh] flex justify-center px-6 text-center md:bottom-[9vh]">
            <h1 className="display" style={{ lineHeight: 1.08, letterSpacing: "-0.02em" }}>
              {TITLE_LINES.map((line, lineIndex) => (
                <span key={line} className="block overflow-hidden" style={{ paddingBottom: "0.1em", marginBottom: "-0.1em" }}>
                  {Array.from(line).map((char, index) => (
                    <span
                      key={`${lineIndex}-${index}`}
                      className="investor-hero-char inline-block"
                      style={{ ...HERO_GOLD, whiteSpace: "pre", fontSize: "clamp(1.9rem, 4.2vw, 58px)" }}
                    >
                      {char}
                    </span>
                  ))}
                </span>
              ))}
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
