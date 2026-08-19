"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { clamp, smoothstep } from "./kit";

const WORD = "The Alpago";

// warm, light gold for the wordmark so it reads on the dark dusk footage
const HERO_GOLD: React.CSSProperties = {
  backgroundImage: "linear-gradient(180deg, #f0d9ad 0%, #dcbb85 46%, #c69a56 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
  filter: "drop-shadow(0 2px 22px rgba(0,0,0,0.55))",
};

/**
 * Hero — a cinematic dusk aerial video of the villa, SCROLL-SCRUBBED (its playhead
 * follows scroll) with the gold "The Alpago" wordmark, the Home — The Alpago
 * breadcrumb and the intro over it. Being dark footage, the stage is `nav-dark`
 * (cream nav) and the type is light. On scroll the frame both scrubs and is masked
 * away from the BOTTOM upward (soft feather) so the first statement rises into it.
 */
export default function ActHero() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const clip = useRef<HTMLDivElement>(null);
  const crumb = useRef<HTMLDivElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const durRef = useRef(7);

  useLayoutEffect(() => {
    const sec = section.current;
    const stg = stage.current;
    if (!sec || !stg) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const audit = new URLSearchParams(window.location.search).has("audit");
    const chars = Array.from(stg.querySelectorAll<HTMLElement>(".hero-char"));
    const v = vid.current;

    const onMeta = () => {
      if (v && Number.isFinite(v.duration) && v.duration > 0) durRef.current = v.duration;
    };
    if (v) {
      v.muted = true;
      v.playsInline = true;
      v.loop = true;
      v.addEventListener("loadedmetadata", onMeta);
      if (v.readyState >= 1) onMeta();
      // autoplay + loop — the film plays on its own (NOT scroll-scrubbed)
      v.play().catch(() => {});
    }

    const setWipe = (r: number) => {
      if (clip.current) clip.current.style.setProperty("--r", r.toFixed(2) + "%");
    };

    let played = false;

    if (audit || reduce) {
      gsap.set(chars, { yPercent: 0, opacity: 1 });
      if (crumb.current) crumb.current.style.opacity = "1";
      if (v) gsap.set(v, { scale: 1, autoAlpha: 1 });
      setWipe(130);
      played = true;
    } else {
      gsap.set(chars, { yPercent: 115, opacity: 1 });
      if (v) gsap.set(v, { scale: 1.06, autoAlpha: 0 });
      if (crumb.current) crumb.current.style.opacity = "0";
      setWipe(130);

      const reveal = gsap.timeline({ paused: true });
      reveal.to(chars, { yPercent: 0, duration: 1.15, ease: "power3.out", stagger: { amount: 0.45 } }, 0.35);
      if (v) reveal.to(v, { scale: 1, autoAlpha: 1, duration: 1.6, ease: "power2.out" }, 0.2);
      if (crumb.current) reveal.to(crumb.current, { opacity: 1, duration: 0.7, ease: "power2.out" }, 0.15);

      const kick = () => {
        if (played) return;
        played = true;
        reveal.play();
      };
      window.addEventListener("alpago:intro-done", kick);
      const t = window.setTimeout(kick, 2600);

      const ctx = gsap.context(() => {
        // the film autoplays on its own; the pin HOLDS it for the first part, then
        // the frame wipes away over the rest — the video is never scrubbed by scroll
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
            const prog = self.progress;
            // the hero holds (film playing) for the first HOLD_END of the pin, then
            // the frame wipes away bottom-up to reveal the next act
            const wp = clamp((prog - HOLD_END) / (0.98 - HOLD_END));
            const r = 130 - wp * 170; // 130% → -40% (wide, soft feather)
            setWipe(r);
            // nav flips from cream → dark once the wipe has cleared the nav band
            stg.dataset.navoff = r < 8 ? "1" : "0";
            if (crumb.current)
              crumb.current.style.opacity = (played ? 1 - smoothstep(clamp(wp / 0.35)) : 0).toFixed(3);
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
        window.removeEventListener("alpago:intro-done", kick);
        window.clearTimeout(t);
        reveal.kill();
        ctx.revert();
        if (v) v.removeEventListener("loadedmetadata", onMeta);
      };
    }
  }, []);

  return (
    <section ref={section} id="top" className="relative z-20">
      {/* breadcrumb — same position as the other page; light over the dark footage */}
      <div
        ref={crumb}
        className="caption fixed left-1/2 z-40 hidden items-center gap-2 md:flex"
        style={{ top: "104px", opacity: 0, transform: "translateX(-50%)" }}
      >
        <span style={{ fontSize: "10px", color: "rgba(236,227,213,0.6)", letterSpacing: "0.24em" }}>Home</span>
        <span aria-hidden style={{ color: "rgba(236,227,213,0.45)", fontSize: "10px" }}>
          /
        </span>
        <span style={{ fontSize: "10px", color: "rgba(240,217,173,0.95)", letterSpacing: "0.24em" }}>
          The Alpago
        </span>
      </div>

      {/* nav-dark → cream header while this dark video sits under the nav */}
      <div ref={stage} data-navoff="0" className="nav-dark relative h-screen w-full overflow-hidden">
        <div
          ref={clip}
          className="absolute inset-0 will-change-[mask]"
          style={
            {
              "--r": "130%",
              WebkitMaskImage: "linear-gradient(to bottom, #000 var(--r), rgba(0,0,0,0) calc(var(--r) + 40%))",
              maskImage: "linear-gradient(to bottom, #000 var(--r), rgba(0,0,0,0) calc(var(--r) + 40%))",
            } as React.CSSProperties
          }
        >
          <video
            ref={vid}
            src="/media/alp/alpago-hero.mp4"
            poster="/media/alp/alpago-hero-poster.jpg"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover object-center will-change-transform"
          />
          {/* cinematic overlay — a soft vignette, top + bottom grounding gradients, a
              gentle glow behind the wordmark, and a whisper of warm bronze for depth */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                // vignette — darkened corners, cinematic frame
                "radial-gradient(125% 130% at 50% 44%, transparent 46%, rgba(8,6,5,0.5) 100%)," +
                // top scrim — keeps the nav + wordmark legible over bright footage
                "linear-gradient(to bottom, rgba(10,8,6,0.5) 0%, rgba(10,8,6,0.12) 22%, transparent 44%)," +
                // bottom gradient — grounds the footage, adds depth
                "linear-gradient(to top, rgba(10,8,6,0.6) 0%, rgba(10,8,6,0.16) 24%, transparent 50%)," +
                // soft glow directly behind the wordmark
                "radial-gradient(62% 44% at 50% 44%, rgba(8,6,5,0.44) 0%, rgba(8,6,5,0.2) 58%, transparent 82%)," +
                // faint warm bronze wash — ties the frame to the brand palette
                "linear-gradient(180deg, rgba(74,48,24,0.10) 0%, rgba(38,24,13,0.14) 100%)",
            }}
          />

          {/* wordmark only over the sky — no supporting line, per the client */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <h1 className="display" style={{ lineHeight: 1.02, letterSpacing: "-0.02em" }}>
              {Array.from(WORD).map((ch, i) =>
                ch === " " ? (
                  // a normal word space between "The" and "Alpago" (the collapsed
                  // whitespace inside the clip spans was rendering too tight)
                  <span key={i} aria-hidden style={{ display: "inline-block", width: "0.26em", fontSize: "clamp(2.6rem, 7vw, 104px)" }} />
                ) : (
                  <span
                    key={i}
                    className="inline-block overflow-hidden"
                    style={{ verticalAlign: "bottom", paddingBottom: "0.16em", marginBottom: "-0.16em" }}
                  >
                    <span className="hero-char" style={{ ...HERO_GOLD, fontSize: "clamp(2.6rem, 7vw, 104px)" }}>
                      {ch}
                    </span>
                  </span>
                )
              )}
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
