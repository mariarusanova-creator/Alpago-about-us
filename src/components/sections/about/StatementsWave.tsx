"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { clamp, smoothstep } from "./kit";

/**
 * ONE wave image shared across the two statement acts (#experience + #priority).
 * A single fixed element — not one-per-section — so it can never read as two.
 * Its parallax is divided across BOTH texts: a single ScrollTrigger spans from the
 * first statement's start to the last statement's end, and the wave drifts up
 * slowly over that whole range. It sits low at the foot (well below the centred
 * text) and fades in/out at the ends so it only shows during the statements.
 */
export default function StatementsWave({
  src = "/media/alp/manifesto-wave.png",
  opacity = 0.6,
  firstId = "experience",
  endId = "transparency",
}: {
  src?: string;
  opacity?: number;
  firstId?: string;
  /** section that begins right AFTER the statements — the wave ends (and is fully
      faded) by the time this section's pin starts, so it never bleeds into it */
  endId?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = wrap.current;
    if (!el) return;
    if (new URLSearchParams(window.location.search).has("audit")) {
      el.style.opacity = String(opacity);
      el.style.transform = "translateY(64%)";
      return;
    }
    const first = document.getElementById(firstId);
    const end = document.getElementById(endId);
    if (!first || !end) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: first,
        start: "top top",
        // end exactly when the next section (transparency) begins its pin, so the
        // wave is gone before that act reveals over the priority statement
        endTrigger: end,
        end: "top top",
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          // fade in over the first slice, hold, then fully fade out by ~0.94 —
          // well before the next section reveals
          const fade = smoothstep(clamp(p / 0.06)) * (1 - smoothstep(clamp((p - 0.78) / 0.16)));
          el.style.opacity = (opacity * fade).toFixed(3);
          // one continuous parallax over BOTH texts — stays low so it never
          // overlaps the centred statement text
          el.style.transform = `translateY(${(80 - p * 22).toFixed(1)}%)`;
        },
      });
    });

    return () => ctx.revert();
  }, [opacity, src, firstId, endId]);

  return (
    <div
      ref={wrap}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[15]"
      style={{ opacity: 0, transform: "translateY(80%)" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" aria-hidden className="block h-auto w-full" />
    </div>
  );
}
