"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type Props = {
  /** video source in /public/media/video (without extension) OR image path */
  video?: string;
  image?: string;
  poster?: string;
  /** parallax travel in vh over the scroll range */
  parallax?: number;
  /** darkening overlay 0..1 */
  overlay?: number;
  /** starting scale, eases to 1 as it enters (adds fluidity) */
  scaleIn?: boolean;
  className?: string;
  /** reacts to scroll velocity with a soft blur/desat (OnScrollFilter feel) */
  reactive?: boolean;
};

/**
 * Full-bleed cinematic media. Never a bordered "image block" — it fills the
 * section, parallaxes, scales, and (optionally) softens with scroll velocity.
 */
export default function MediaLayer({
  video,
  image,
  poster,
  parallax = 14,
  overlay = 0.24,
  scaleIn = true,
  reactive = true,
  className = "",
}: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const vid = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    const el = wrap.current;
    const el2 = inner.current;
    if (!el || !el2) return;

    const ctx = gsap.context(() => {
      // parallax + scale
      gsap.fromTo(
        el2,
        { yPercent: -parallax / 2, scale: scaleIn ? 1.18 : 1.08 },
        {
          yPercent: parallax / 2,
          scale: 1.02,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, el);

    // play/pause looping video only while on-screen
    const v = vid.current;
    let st: ScrollTrigger | undefined;
    if (v) {
      v.muted = true;
      st = ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          if (self.isActive) v.play().catch(() => {});
          else v.pause();
        },
      });
    }

    return () => {
      ctx.revert();
      st?.kill();
    };
  }, [parallax, scaleIn]);

  return (
    <div
      ref={wrap}
      className={`absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      <div
        ref={inner}
        className="absolute inset-[-2%] will-change-transform"
        style={
          reactive
            ? {
                filter:
                  "blur(calc(var(--scroll-v,0) * 3px)) saturate(calc(1 - var(--scroll-v,0) * 0.25))",
              }
            : undefined
        }
      >
        {video ? (
          <video
            ref={vid}
            className="h-full w-full object-cover"
            src={`/media/video/${video}.mp4`}
            poster={poster ?? `/media/poster/${video}.jpg`}
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : null}
      </div>
      {/* cinematic vignette + darkening for legibility */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 100% at 50% 40%, transparent 45%, rgba(10,8,6,0.32) 100%), rgba(10,8,6,${overlay})`,
        }}
      />
    </div>
  );
}
