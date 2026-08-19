"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const smoothstep = (t: number) => t * t * (3 - 2 * t);

/**
 * Full-width video that reveals on scroll via a soft bottom-to-top wipe (with a
 * slight scale settle). It plays at full quality while on screen — no frame
 * scrubbing, which was degrading the image.
 */
export default function VideoReveal() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const clip = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    const sec = section.current;
    const stg = stage.current;
    const cl = clip.current;
    const v = video.current;
    if (!sec || !stg || !cl) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const audit = new URLSearchParams(window.location.search).has("audit");

    if (v) v.muted = true;

    // --r runs -18% (fully hidden, off-screen stops) → 100% (fully shown)
    const setReveal = (e: number) => {
      cl.style.setProperty("--r", (e * 118 - 18).toFixed(2) + "%");
      cl.style.transform = `scale(${(1.08 - 0.08 * e).toFixed(3)})`;
    };

    if (audit || reduce) {
      setReveal(1);
      v?.play?.().catch(() => {});
      return;
    }

    setReveal(0);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sec,
        start: "top top",
        end: "+=150%",
        pin: stg,
        pinType: "fixed",
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          // stays fully hidden for the first third, then wipes open — so it doesn't
          // pop in the instant the section arrives
          const rev = gsap.utils.clamp(0, 1, (p - 0.14) / 0.5);
          setReveal(smoothstep(rev));
          // fade back out before the hand-off so it doesn't overlap the next section
          const out = gsap.utils.clamp(0, 1, (p - 0.86) / 0.14);
          cl.style.opacity = (1 - smoothstep(out)).toFixed(3);
        },
      });
      // play at full quality only while the section is on screen
      ScrollTrigger.create({
        trigger: sec,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          if (!v) return;
          if (self.isActive) v.play().catch(() => {});
          else v.pause();
        },
      });
    }, sec);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={section} className="relative">
      <div ref={stage} className="relative h-screen w-full overflow-hidden">
        <div
          ref={clip}
          className="absolute inset-0 will-change-transform"
          style={
            {
              "--r": "-18%",
              WebkitMaskImage:
                "linear-gradient(to top, #000 var(--r), rgba(0,0,0,0) calc(var(--r) + 15%))",
              maskImage:
                "linear-gradient(to top, #000 var(--r), rgba(0,0,0,0) calc(var(--r) + 15%))",
            } as React.CSSProperties
          }
        >
          <video
            ref={video}
            className="h-full w-full object-cover"
            src="/media/video/aerial-hd.mp4"
            poster="/media/poster/aerial.jpg"
            muted
            loop
            playsInline
            preload="auto"
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "rgba(10,8,6,0.12)" }}
          />
        </div>
      </div>
    </section>
  );
}
