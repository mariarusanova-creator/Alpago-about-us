"use client";

import { useLayoutEffect, useRef } from "react";
import HeroScrub, { type HeroSlide } from "@/components/HeroScrub";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { clamp, smoothstep } from "./kit";

const SLIDES: HeroSlide[] = [
  {
    src: "/media/video/alpago-performance-client.mp4",
    video: true,
    playbackRate: 0.6,
    background: "#120905",
    tone: "light",
    fitWidth: true,
    positionY: "top",
    filter: "sepia(0.3) saturate(0.88) brightness(0.98) contrast(0.97)",
    tint: "rgba(112, 67, 30, 0.42)",
    eyebrow: "Alpago is raising the ceiling",
    rows: [
      "To redefine what can be expected,",
      "and what should be considered exceptional.",
    ],
  },
  {
    src: "/media/video/alpago-performance-client.mp4",
    video: true,
    playbackRate: 0.6,
    background: "#120905",
    tone: "light",
    fitWidth: true,
    positionY: "top",
    filter: "sepia(0.3) saturate(0.88) brightness(0.98) contrast(0.97)",
    tint: "rgba(112, 67, 30, 0.42)",
    columns: [
      "When doing what is right for the client takes precedence over what is easiest for the business, outcomes are no longer measured against existing benchmarks. They become new ones. Across the Group, this principle takes different forms, from property and design & build to automotive curation, but the commitment remains the same: No compromise in quality, standards and outcome.",
    ],
  },
];

const CARDS = [
  {
    title: "Team of over 400 in-house Professionals",
  },
  {
    title: "5 Offices and Facilities",
  },
  {
    title: "More than 20 Nationalities",
  },
] as const;

function V3PerformanceCards() {
  const section = useRef<HTMLElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const guides = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const sec = section.current;
    if (!sec) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const audit = new URLSearchParams(window.location.search).has("audit");

    const apply = (progress: number) => {
      const p = clamp(progress);
      const mobile = window.innerWidth < 768;
      const cardWidth = mobile
        ? window.innerWidth * 0.36
        : Math.max(218, Math.min(window.innerWidth * 0.2244, 326));
      const gap = 20;
      const galleryWidth = cardWidth * CARDS.length + gap * (CARDS.length - 1);
      // Match Version 2's reveal exactly: the centre card leads, followed by
      // the right and left cards, with the same long opacity/scale easing.
      const enterStarts = [0.1, 0, 0.05];
      const exit = smoothstep(clamp((p - 0.72) / 0.16));
      const guideEnter = smoothstep(clamp((p - 0.24) / 0.08));

      if (guides.current) {
        guides.current.style.opacity = (guideEnter * (1 - exit)).toFixed(3);
        guides.current.style.setProperty("--gallery-width", `${galleryWidth.toFixed(2)}px`);
        guides.current.style.transform = `translateY(calc(-50% - ${(exit * 44).toFixed(2)}px))`;
      }

      cards.current.forEach((card, index) => {
        if (!card) return;
        const enter = smoothstep(clamp((p - enterStarts[index]) / 0.14));
        const x = (index - 1) * (cardWidth + gap);
        const y = -exit * 44;
        const opacity = enter * (1 - exit);
        const scale = 0.8 + enter * 0.2;

        card.style.opacity = opacity.toFixed(3);
        card.style.filter = "none";
        card.style.pointerEvents = opacity > 0.6 ? "auto" : "none";
        card.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
      });
    };

    if (reduce || audit) {
      sec.style.height = "100vh";
      apply(0.52);
      return;
    }

    apply(0);
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sec,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.75,
        // Measure this scene after the pinned dissolve above it. Otherwise a
        // hot refresh can keep the old start/end values and leave every card
        // at its initial opacity: 0 even though the section is on screen.
        refreshPriority: -1,
        invalidateOnRefresh: true,
        onEnter: (self) => apply(self.progress),
        onEnterBack: (self) => apply(self.progress),
        onRefresh: (self) => apply(self.progress),
        onUpdate: (self) => apply(self.progress),
      });
    }, sec);

    const refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 450);
    return () => {
      cancelAnimationFrame(refreshFrame);
      window.clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={section}
      id="v3-performance-cards"
      aria-label="Alpago Group at a glance"
      className="relative z-20"
      style={{ height: "320vh", marginTop: "-100vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div
          ref={guides}
          aria-hidden
          className="pointer-events-none absolute inset-x-[5.5vw] top-1/2 z-[19] flex -translate-y-1/2 items-center opacity-0 max-md:hidden"
        >
          <span className="h-px flex-1 bg-[rgba(103,78,43,0.24)]" />
          <span className="shrink-0" style={{ width: "calc(var(--gallery-width) + 40px)" }} />
          <span className="h-px flex-1 bg-[rgba(103,78,43,0.24)]" />
        </div>

        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <div className="relative h-[50.32vh] w-[22.44vw] min-w-[218px] max-w-[326px] max-md:h-[28vh] max-md:w-[36vw] max-md:min-w-0 max-md:max-w-none">
            {CARDS.map((card, index) => (
              <div
                key={card.title}
                ref={(element) => {
                  cards.current[index] = element;
                }}
                className="pointer-events-none absolute inset-0 opacity-0 will-change-[transform,opacity,filter]"
              >
                <article
                  className="group relative h-full w-full overflow-hidden rounded-[3px] p-8 transition-transform duration-1000 hover:-translate-y-3"
                  style={{
                    border: "1px solid rgba(104,79,46,0.24)",
                    background: "linear-gradient(165deg, rgba(242,235,223,0.2), rgba(242,235,223,0.06))",
                    backdropFilter: "blur(22px) saturate(108%)",
                    WebkitBackdropFilter: "blur(22px) saturate(108%)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.24), 0 20px 55px rgba(78,57,32,0.12)",
                  }}
                >
                  <h3
                    className="display absolute bottom-8 left-8 right-8 z-10"
                    style={{
                      color: "var(--bronze-hi)",
                      fontSize: "24px",
                      fontWeight: 400,
                      lineHeight: 1.3,
                      letterSpacing: "0.03em",
                    }}
                  >
                    {card.title}
                  </h3>
                </article>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function TheAlpagoV3Performance() {
  return (
    <div id="v2-performance" className="relative z-20">
      <HeroScrub
        id="v3-performance-dissolve"
        ariaLabel="Raising the performance bar"
        slides={SLIDES}
        scrollLength={270}
        variant="performance"
      />
      <V3PerformanceCards />
    </div>
  );
}
