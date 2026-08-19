"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Telescope zoom (adapted from joffreysp/telescope-zoom): the video emerges from a
 * point and zooms to full while a stack of masked, nested-scale copies form a depth
 * "tunnel" that converges + de-blurs, then dissolves to reveal the clean video.
 * The demo's surrounding fly-past images are intentionally omitted.
 */
const FRONT = [0.82, 0.62, 0.46, 0.32, 0.18]; // nested layer scales (tunnel depth)
const MASK = "radial-gradient(circle at 50% 48%, #000 46%, rgba(0,0,0,0) 74%)";
const smoothstep = (t: number) => t * t * (3 - 2 * t);

export default function VideoTelescope() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const frontsRef = useRef<HTMLDivElement[]>([]);

  useLayoutEffect(() => {
    const sec = section.current;
    const stg = stage.current;
    const md = media.current;
    if (!sec || !stg || !md) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const audit = new URLSearchParams(window.location.search).has("audit");
    const fronts = frontsRef.current.filter(Boolean);
    const v = video.current;
    if (v) {
      v.muted = true;
      // playback is scroll-driven. A muted play() kicks the load/decode even while the
      // element is hidden (preload alone leaves Chrome idle); pausing right after leaves
      // it primed so scroll-seeking actually updates frames.
      v.play().then(() => v.pause()).catch(() => {});
    }

    const setFinal = () => {
      md.style.transform = "scale(1)";
      fronts.forEach((f) => {
        f.style.transform = "scale(1)";
        f.style.filter = "blur(0px)";
        f.style.opacity = "0";
      });
    };

    if (audit || reduce) {
      setFinal();
      v?.play?.().catch(() => {});
      return;
    }

    // start: media already sizeable (avoids a long empty stretch), then zooms to full
    md.style.transform = "scale(0.5)";
    fronts.forEach((f, i) => {
      f.style.transform = `scale(${FRONT[i]})`;
      f.style.filter = "blur(7px)";
      f.style.opacity = "1";
    });
    // hidden until this section actually pins (it sits pulled-up behind the previous
    // pinned section, so it must not show through until it takes over)
    stg.style.opacity = "0";

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sec,
        start: "top top",
        end: "+=135%",
        pin: stg,
        pinType: "fixed",
        scrub: 0.6,
        onUpdate: (self) => {
          const sp = self.progress;
          // content runs over the first 90% of the pin, then holds fully-revealed before
          // the section fades out — so the reveal is never cut off mid-way
          const p = gsap.utils.clamp(0, 1, sp / 0.9);
          // media zooms from its starting size out to full, finishing well before the
          // end so it isn't scaling the whole way through — starts larger, less zoom
          const zoom = gsap.parseEase("power1.inOut")(gsap.utils.clamp(0, 1, p / 0.68));
          md.style.transform = `scale(${(0.5 + 0.5 * zoom).toFixed(4)})`;

          // playback is driven by scroll — scrub the video's time with progress
          if (v && Number.isFinite(v.duration) && v.duration > 0)
            v.currentTime = Math.min(v.duration - 0.05, p * v.duration);

          fronts.forEach((f, i) => {
            // each layer converges to scale 1, de-blurs, then dissolves — staggered,
            // all shifted earlier so the reveal resolves sooner
            const conv = smoothstep(gsap.utils.clamp(0, 1, (p - 0.14 - i * 0.02) / 0.32));
            const clear = smoothstep(gsap.utils.clamp(0, 1, (p - 0.2 - i * 0.05) / 0.24));
            const fade = smoothstep(gsap.utils.clamp(0, 1, (p - 0.32 - i * 0.06) / 0.24));
            const s = FRONT[i] + (1 - FRONT[i]) * conv;
            f.style.transform = `scale(${s.toFixed(4)})`;
            f.style.filter = `blur(${(7 * (1 - clear)).toFixed(2)}px)`;
            f.style.opacity = (1 - fade).toFixed(3);
          });

          // fade in as it takes over, out before the next hand-off
          const inA = gsap.utils.clamp(0, 1, sp / 0.05);
          const outA = gsap.utils.clamp(0, 1, (sp - 0.95) / 0.05);
          stg.style.opacity = (smoothstep(inA) * (1 - smoothstep(outA))).toFixed(3);
        },
      });
    }, sec);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={section} className="relative" style={{ marginTop: "-100vh" }}>
      <div ref={stage} className="relative h-screen w-full overflow-hidden">
        <div
          ref={media}
          className="absolute inset-0 will-change-transform"
          style={{ transform: "scale(0.5)" }}
        >
          {/* back — the actual video */}
          <video
            className="absolute inset-0 h-full w-full object-cover"
            ref={video}
            src="/media/video/aerial-hd.mp4"
            poster="/media/poster/aerial.jpg"
            muted
            loop
            playsInline
            preload="auto"
          />

          {/* nested masked layers forming the telescope tunnel */}
          {FRONT.map((s, i) => (
            <div
              key={i}
              ref={(el) => {
                if (el) frontsRef.current[i] = el;
              }}
              className="absolute inset-0 will-change-transform"
              style={{ transform: `scale(${s})`, filter: "blur(7px)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/media/poster/aerial.jpg"
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                style={{ WebkitMaskImage: MASK, maskImage: MASK }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
