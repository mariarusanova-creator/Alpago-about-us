"use client";

import { useLayoutEffect, useRef } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { clamp, smoothstep } from "./kit";

const REVEAL_HIDDEN = -22;
const REVEAL_SHOWN = 100;

export default function TheAlpagoV2Closing() {
  const section = useRef<HTMLElement>(null);
  const composition = useRef<HTMLDivElement>(null);
  const photoLayer = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = section.current;
    const content = composition.current;
    const photo = photoLayer.current;
    const ambientBackground = document.querySelector<HTMLElement>("[data-v2-sticky-background]");
    if (!root || !content) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const audit = new URLSearchParams(window.location.search).has("audit");

    const apply = (rawProgress: number) => {
      const progress = smoothstep(clamp(rawProgress));
      const reveal = REVEAL_HIDDEN + (REVEAL_SHOWN - REVEAL_HIDDEN) * progress;
      const opacity = smoothstep(clamp(progress / 0.55));
      const backgroundFade = smoothstep(clamp(rawProgress / 0.85));
      const topMaskClear = smoothstep(clamp((rawProgress - 0.58) / 0.32));
      const topFeather = 26 * (1 - topMaskClear);

      content.style.setProperty("--closing-reveal", `${reveal.toFixed(2)}%`);
      content.style.opacity = opacity.toFixed(3);
      content.style.filter = `blur(${((1 - opacity) * 8).toFixed(2)}px)`;
      content.style.transform = `scale(${(1.035 - progress * 0.035).toFixed(4)})`;
      if (photo) {
        // Keep the soft cream-to-image transition during the reveal, then make
        // the mask fully opaque so no gradient remains over the finished photo.
        photo.style.setProperty("--closing-top-alpha", topMaskClear.toFixed(3));
        photo.style.setProperty("--closing-top-feather", `${topFeather.toFixed(2)}%`);
      }
      if (ambientBackground) {
        ambientBackground.style.opacity = (1 - backgroundFade).toFixed(3);
      }
    };

    if (reduce || audit) {
      apply(1);
      return;
    }

    apply(0);
    const trigger = ScrollTrigger.create({
      trigger: root,
      start: "top bottom",
      end: "top top",
      scrub: 0.7,
      invalidateOnRefresh: true,
      onRefresh: (self) => apply(self.progress),
      onUpdate: (self) => apply(self.progress),
    });

    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => trigger.kill();
  }, []);

  return (
    <section
      ref={section}
      id="v2-closing"
      aria-labelledby="v2-closing-title"
      className="relative z-20 h-[190vh] w-full"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div
          ref={composition}
          className="nav-dark absolute inset-0 origin-center overflow-hidden will-change-[opacity,filter,transform,mask]"
          style={
            {
              "--closing-reveal": `${REVEAL_HIDDEN}%`,
              opacity: 0,
              WebkitMaskImage:
                "linear-gradient(to top, #000 var(--closing-reveal), rgba(0,0,0,0) calc(var(--closing-reveal) + 22%))",
              maskImage:
                "linear-gradient(to top, #000 var(--closing-reveal), rgba(0,0,0,0) calc(var(--closing-reveal) + 22%))",
            } as React.CSSProperties
          }
        >
          <div
            ref={photoLayer}
            className="absolute inset-0"
            style={
              {
              "--closing-top-alpha": "0",
              "--closing-top-feather": "26%",
              WebkitMaskImage:
                "linear-gradient(to bottom, rgba(0,0,0,var(--closing-top-alpha)) 0%, #000 var(--closing-top-feather), #000 100%)",
              maskImage:
                "linear-gradient(to bottom, rgba(0,0,0,var(--closing-top-alpha)) 0%, #000 var(--closing-top-feather), #000 100%)",
              } as React.CSSProperties
            }
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/alp/gallery-layerfw.png"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(rgba(10,8,6,0.32), rgba(10,8,6,0.32)), " +
                  "radial-gradient(72% 58% at 50% 50%, rgba(10,8,6,0.58) 0%, rgba(10,8,6,0.4) 55%, rgba(10,8,6,0.28) 100%)",
              }}
            />

            <div className="over-img absolute inset-0 mx-auto flex max-w-[1100px] flex-col items-center justify-center px-6 text-center">
              <h2
                id="v2-closing-title"
                className="display"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg, var(--gold-1) 0%, var(--gold-2) 48%, var(--gold-3) 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                  fontSize: "clamp(1.35rem, 3.1vw, 42px)",
                  lineHeight: 1.16,
                  letterSpacing: "-0.01em",
                  paddingBottom: "0.06em",
                }}
              >
                Dive into the full Alpago experience.
              </h2>
              <p
                className="mx-auto mt-[27px]"
                style={{
                  color: "var(--ink-strong)",
                  maxWidth: "56ch",
                  fontFamily: "var(--font-social), sans-serif",
                  fontSize: "16.5px",
                  lineHeight: 1.75,
                  textShadow: "0 1px 18px rgba(10,8,6,0.55)",
                }}
              >
                From the first sketch to the final handover, every project is a study in
                restraint and rarity. Step inside the world we build.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
