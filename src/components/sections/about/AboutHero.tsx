"use client";

import { useRef, useState } from "react";
import Reveal from "@/components/Reveal";

const GOLD: React.CSSProperties = {
  backgroundImage: "linear-gradient(180deg, var(--gold-1) 0%, var(--gold-2) 48%, var(--gold-3) 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
};

// soft edge so the media melts into the page rather than sitting in a hard box
const MASK: React.CSSProperties = {
  WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 10%, #000 90%, transparent 100%)",
  maskImage: "linear-gradient(to bottom, transparent 0%, #000 10%, #000 90%, transparent 100%)",
};

export default function AboutHero() {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    const v = video.current;
    if (!v) return;
    v.play().catch(() => {});
    setPlaying(true);
  };

  return (
    <section id="top" className="relative min-h-screen overflow-hidden pt-[22vh] pb-[10vh] md:pt-[26vh]">
      <div className="mx-auto grid w-full max-w-[1560px] grid-cols-1 items-center gap-16 px-6 md:grid-cols-[1.05fr_1fr] md:px-14">
        {/* left — breadcrumb, wordmark headline, intro */}
        <div>
          <Reveal y={14} blur={4}>
            <div className="caption mb-8 flex items-center gap-3" style={{ color: "var(--ink-faint)" }}>
              <span>Home</span>
              <span style={{ opacity: 0.5 }}>—</span>
              <span style={{ color: "var(--bronze)" }}>The Alpago</span>
            </div>
          </Reveal>

          <Reveal y={26} blur={8} delay={0.05}>
            <h1
              className="display"
              style={{ ...GOLD, fontSize: "clamp(3rem, 8vw, 108px)", lineHeight: 1.02, letterSpacing: "-0.02em" }}
            >
              The Alpago
            </h1>
          </Reveal>

          <Reveal y={20} blur={6} delay={0.15}>
            <p
              className="mt-9 max-w-[46ch]"
              style={{
                color: "var(--ink-dim)",
                fontFamily: "var(--font-social), sans-serif",
                fontSize: "17.5px",
                lineHeight: 1.75,
              }}
            >
              A group defined not by what it builds, but by how. Across development,
              design and craft, Alpago pursues a single standard — the pursuit of what
              deserves to endure.
            </p>
          </Reveal>
        </div>

        {/* right — media with play affordance */}
        <Reveal y={30} blur={10} delay={0.2}>
          <div className="relative aspect-[4/5] w-full overflow-hidden md:aspect-[5/6]" style={MASK}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <video
              ref={video}
              className="h-full w-full object-cover"
              src="/media/video/hero-facade-hd.mp4"
              poster="/media/poster/hero-facade.jpg"
              loop
              playsInline
              preload="metadata"
            />
            <div
              className="pointer-events-none absolute inset-0 transition-opacity duration-700"
              style={{ background: "rgba(10,8,6,0.28)", opacity: playing ? 0 : 1 }}
            />
            <button
              onClick={play}
              aria-label="Play film"
              className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full backdrop-blur-sm transition-all duration-500 hover:scale-105"
              style={{
                background: "rgba(20,13,7,0.34)",
                border: "1px solid var(--line-strong)",
                opacity: playing ? 0 : 1,
                pointerEvents: playing ? "none" : "auto",
              }}
            >
              <svg width="20" height="22" viewBox="0 0 20 22" fill="none" aria-hidden>
                <path d="M19 11 0 22V0l19 11Z" fill="var(--ink)" />
              </svg>
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
