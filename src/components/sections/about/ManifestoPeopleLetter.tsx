"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { ScrollTrigger } from "@/lib/gsap";
import { smoothstep } from "./kit";

const DEFAULT_VIDEO = "/media/alp/alpago-hero.mp4";
const PEOPLE_IMAGE = "/media/alp/about-people-blueprints.png";

const W = 1000;
const H = 620;
const DIV = 310;
const LETTER_Y = 330;
const R_HIDDEN = -22;
const R_SHOWN = 122;

const GOLD: React.CSSProperties = {
  backgroundImage: "linear-gradient(180deg, var(--gold-1) 0%, var(--gold-2) 48%, var(--gold-3) 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
};
const TITLE: React.CSSProperties = {
  ...GOLD,
  fontSize: "clamp(1.35rem, 3.1vw, 42px)",
  lineHeight: 1.16,
  letterSpacing: "-0.01em",
};
const CTA: React.CSSProperties = {
  background: "#2a221c",
  color: "#efe7d8",
  letterSpacing: "0.14em",
};
const LETTER_FONT = {
  fontFamily: "var(--font-basel), serif",
  fontWeight: 400,
  fontSize: "540px",
  letterSpacing: "-0.02em",
} as const;

type Hover = null | "manifesto" | "people";
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function ManifestoPeopleLetter() {
  const [hover, setHover] = useState<Hover>(null);
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const baseVideo = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    const video = baseVideo.current;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    const play = () => video.play().catch(() => {});
    play();
    video.addEventListener("loadeddata", play);
    video.addEventListener("canplay", play);
    return () => {
      video.removeEventListener("loadeddata", play);
      video.removeEventListener("canplay", play);
      video.pause();
    };
  }, []);

  useLayoutEffect(() => {
    const sec = section.current;
    const stg = stage.current;
    if (!sec || !stg) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const audit = new URLSearchParams(window.location.search).has("audit");
    const setR = (r: number) => stg.style.setProperty("--r", `${r.toFixed(1)}%`);
    const setMaskDirection = (direction: "top" | "bottom") => {
      const mask = `linear-gradient(to ${direction}, #000 var(--r), rgba(0,0,0,0) calc(var(--r) + 22%))`;
      stg.style.webkitMaskImage = mask;
      stg.style.maskImage = mask;
    };
    const apply = (rawProgress: number) => {
      const progress = clamp(rawProgress);
      const entryEnd = 0.16;
      const exitStart = 0.54;

      if (progress <= exitStart) {
        // Existing soft reveal from the previous screen.
        setMaskDirection("top");
        setR(lerp(R_HIDDEN, R_SHOWN, smoothstep(clamp(progress / entryEnd))));
      } else {
        // Once the composition has had time to hold, use the same broad,
        // feathered wipe as the opening act. This removes the hard horizontal
        // video edge while the standards screen appears underneath.
        const exit = smoothstep(clamp((progress - exitStart) / (1 - exitStart)));
        setMaskDirection("bottom");
        setR(lerp(130, -40, exit));
      }
    };

    if (audit || reduce) {
      setMaskDirection("top");
      setR(R_SHOWN);
      return;
    }

    setMaskDirection("top");
    setR(R_HIDDEN);
    const trigger = ScrollTrigger.create({
      trigger: sec,
      start: "top top",
      end: "+=120%",
      pin: stg,
      pinType: "fixed",
      scrub: 0.5,
      invalidateOnRefresh: true,
      onRefresh: (self) => apply(self.progress),
      onUpdate: (self) => apply(self.progress),
    });
    return () => trigger.kill();
  }, []);

  return (
    <section ref={section} className="relative" style={{ marginTop: "-100vh" }}>
      <div
        ref={stage}
        className="section-bg relative h-screen w-full overflow-hidden"
        style={
          {
            "--r": `${R_HIDDEN}%`,
            WebkitMaskImage: "linear-gradient(to top, #000 var(--r), rgba(0,0,0,0) calc(var(--r) + 22%))",
            maskImage: "linear-gradient(to top, #000 var(--r), rgba(0,0,0,0) calc(var(--r) + 22%))",
          } as React.CSSProperties
        }
      >
        {/* The only default media layer is the requested video. There is no poster,
            canvas, background image, or default pool photograph in this state. */}
        <video
          ref={baseVideo}
          className="absolute inset-0 z-0 h-full w-full object-cover"
          src={DEFAULT_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
        />

        {/* The Manifesto keeps the default film. Only People Behind Alpago
            introduces a hover image over it. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PEOPLE_IMAGE}
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] h-full w-full object-cover transition-opacity duration-700"
          style={{
            opacity: hover === "people" ? 1 : 0,
            objectPosition: "50% 43%",
            filter: "brightness(0.82) sepia(0.24) saturate(0.78) hue-rotate(-7deg)",
          }}
        />

        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 z-[2] block h-full w-full"
          role="img"
          aria-label="Alpago — the Manifesto and the People behind Alpago"
        >
          <defs>
            <mask id="alpago-a-white">
              <rect x="0" y="0" width={W} height={H} fill="#000" />
              <text x={W / 2} y={LETTER_Y} textAnchor="middle" dominantBaseline="central" fill="#fff" style={LETTER_FONT}>a</text>
            </mask>
            <mask id="alpago-a-black">
              <rect x="0" y="0" width={W} height={H} fill="#fff" />
              <text x={W / 2} y={LETTER_Y} textAnchor="middle" dominantBaseline="central" fill="#000" style={LETTER_FONT}>a</text>
            </mask>
            <clipPath id="alpago-single-top"><rect x="0" y="0" width={W} height={DIV} /></clipPath>
            <clipPath id="alpago-single-bot"><rect x="0" y={DIV} width={W} height={H - DIV} /></clipPath>
          </defs>
          <g clipPath="url(#alpago-single-top)">
            <rect x="0" y="0" width={W} height={H} fill="var(--bg)" mask="url(#alpago-a-black)" />
          </g>
          <g clipPath="url(#alpago-single-bot)">
            <rect x="0" y="0" width={W} height={H} fill="var(--bg)" mask="url(#alpago-a-white)" />
          </g>
        </svg>

        <div className="pointer-events-none absolute inset-0 z-[3]">
          <div
            onMouseEnter={() => setHover("manifesto")}
            onMouseLeave={() => setHover(null)}
            className="group pointer-events-auto absolute left-8 top-[16vh] md:left-14"
          >
            <h3 className="display" style={TITLE}>The Manifesto</h3>
            <Link
              href="/the-alpago/manifesto"
              className="caption mt-7 inline-block px-9 py-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100 focus-visible:opacity-100"
              style={CTA}
            >
              Learn More
            </Link>
          </div>

          <div
            onMouseEnter={() => setHover("people")}
            onMouseLeave={() => setHover(null)}
            className="group pointer-events-auto absolute right-8 top-[16vh] text-right md:right-14"
          >
            <h3 className="display" style={TITLE}>
              <span className="block">People Behind</span>
              <span className="block">Alpago</span>
            </h3>
            <Link
              href="/the-alpago/people"
              className="caption mt-7 inline-block px-9 py-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100 focus-visible:opacity-100"
              style={CTA}
            >
              Meet the Team
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
