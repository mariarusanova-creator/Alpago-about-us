"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import AwardPopup, { type AwardDetails } from "@/components/awards/AwardPopup";

const AWARDS: AwardDetails[] = [
  {
    tag: "Development",
    name: "RAED Ventures",
    caption: "Scape Global Forum — New Development Project",
  },
  {
    tag: "Design & Build",
    name: "Construction Week",
    caption: "Top 50 GCC Developers — Green Building",
  },
  {
    tag: "Properties",
    name: "HALA",
    caption: "LIV GOLF — Infrastructure Award",
  },
  {
    tag: "Design & Build",
    name: "RAED Ventures",
    caption: "Cityscape Global Forum — Best New Development",
  },
  {
    tag: "Properties",
    name: "HALA",
    caption: "LIV GOLF — Infrastructure Award",
  },
];

export default function TheAlpagoV2Awards() {
  const [activeAward, setActiveAward] = useState<AwardDetails | null>(null);
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = section.current;
    const pinnedStage = stage.current;
    const rail = track.current;
    if (!root || !pinnedStage || !rail) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const audit = new URLSearchParams(window.location.search).has("audit");
    const maxX = () => Math.max(0, rail.scrollWidth - pinnedStage.clientWidth);

    if (reduce || audit) {
      gsap.set(rail, { x: 0, y: 0, opacity: 1, filter: "none" });
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        rail,
        { opacity: 0, y: 42, filter: "blur(9px)" },
          {
            opacity: 1,
            y: 0,
            filter: "none",
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top 82%",
            end: "top 8%",
            scrub: 0.75,
            onLeave: () => {
              rail.style.filter = "none";
            },
            onRefresh: (self) => {
              if (self.progress >= 1) rail.style.filter = "none";
            },
          },
        },
      );

      gsap.to(rail, {
        x: () => -maxX(),
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${maxX() + window.innerHeight * 0.7}`,
          pin: pinnedStage,
          pinType: "fixed",
          scrub: 0.9,
          invalidateOnRefresh: true,
        },
      });
    }, root);

    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => context.revert();
  }, []);

  return (
    <>
      <section
        ref={section}
        id="v2-awards"
        aria-label="Awards and Achievements"
        className="relative z-30"
      >
        <div ref={stage} className="relative z-30 h-screen w-full overflow-hidden">
          <div
            ref={track}
            className="absolute inset-y-0 left-0 flex h-full w-max items-center gap-8 px-6 will-change-transform md:gap-14 md:px-14"
          >
            <div className="flex w-[76vw] max-w-[560px] shrink-0 flex-col justify-center">
              <span className="caption mb-6" style={{ color: "var(--bronze-hi)" }}>
                Recognition
              </span>
              <h2
                className="display max-w-[11ch]"
                style={{
                  color: "var(--gold-2)",
                  fontSize: "clamp(2.4rem, 5.2vw, 68px)",
                  lineHeight: 1.04,
                  letterSpacing: "-0.02em",
                }}
              >
                Awards &amp; Achievements
              </h2>
              <p
                className="mt-7 max-w-[38ch]"
                style={{
                  color: "var(--ink-dim)",
                  fontFamily: "var(--font-basel), system-ui, sans-serif",
                  fontSize: "15.5px",
                  lineHeight: 1.625,
                }}
              >
                A record of firsts recognised across the industry — keep scrolling to move through it.
              </p>
            </div>

            {AWARDS.map((award, index) => (
              <div key={`${award.name}-${award.caption}-${index}`} className="shrink-0">
                <div className="mb-4 flex items-baseline gap-4">
                  <span
                    className="caption"
                    style={{ color: "var(--bronze-lo)", fontSize: "0.72rem", letterSpacing: "0.16em" }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="caption"
                    style={{ color: "var(--bronze-lo)", fontSize: "0.72rem", letterSpacing: "0.16em" }}
                  >
                    {award.tag}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveAward(award)}
                  aria-label={`View ${award.caption} award details`}
                  className="ease-alpago-soft flex h-[46vh] w-[300px] cursor-pointer flex-col justify-between rounded-[3px] border border-[color:var(--line-strong)] p-8 text-left outline-none transition-[border-color,background-color,translate,box-shadow] duration-700 hover:-translate-y-2 hover:border-[color:var(--bronze-hi)] focus-visible:border-[color:var(--bronze-hi)] md:w-[330px]"
                  style={{
                    background: "transparent",
                    boxShadow: "none",
                  }}
                >
                  <div
                    className="display"
                    style={{
                      color: "var(--gold-2)",
                      fontSize: "24px",
                      lineHeight: 1.3,
                      letterSpacing: "0.03em",
                    }}
                  >
                    {award.name}
                  </div>
                  <p
                    className="text-[13.5px] leading-[1.65]"
                    style={{ color: "var(--ink-dim)" }}
                  >
                    {award.caption}
                  </p>
                </button>
              </div>
            ))}

            <div className="w-[10vw] shrink-0" />
          </div>
        </div>
      </section>

      <AwardPopup award={activeAward} onClose={() => setActiveAward(null)} />
    </>
  );
}
