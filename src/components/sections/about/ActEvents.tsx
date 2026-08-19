"use client";

import { useLayoutEffect, useRef } from "react";
import Reveal from "@/components/Reveal";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * The Alpago World — the original three-panel experience, group and craft act.
 * The complete panel grid scrolls naturally into a final cream-foot frame
 * before the closing acts continue.
 */
const PANELS = [
  {
    image: "/media/alp/about-experience.jpg",
    title: "Living the Alpago standard",
    tag: "The Experience",
    category: "Releases",
  },
  {
    image: "/media/alp/about-group.jpg",
    title: "A family of ventures",
    tag: "The Group",
    category: "Market Numbers",
  },
  {
    image: "/media/alp/about-craft.jpg",
    title: "Detail as a discipline",
    tag: "The Craft",
    category: "Releases",
  },
];

const GOLD_WRAP: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(180deg, var(--gold-1) 0%, var(--gold-2) 48%, var(--gold-3) 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
};

function Panel({
  image,
  title,
  tag,
  category,
  divider,
}: {
  image: string;
  title: string;
  tag: string;
  category: string;
  divider: boolean;
}) {
  return (
    <div
      className="standalone-world-card over-img group relative h-[82vh] flex-1 overflow-hidden"
      style={
        divider
          ? { borderLeft: "1px solid rgba(236,227,213,0.5)" }
          : undefined
      }
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(10,8,6,0.6) 0%, rgba(10,8,6,0.12) 34%, rgba(10,8,6,0.18) 100%)",
        }}
      />

      <div className="pointer-events-none absolute inset-x-0 top-[7%] px-6 text-center">
        <span
          className="caption inline-block px-3 py-[7px]"
          style={{
            color: "rgba(255,255,255,0.95)",
            background: "rgba(31,25,20,0.48)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            fontSize: "0.62rem",
            letterSpacing: "0.16em",
            textShadow: "0 1px 12px rgba(10,8,6,0.55)",
          }}
        >
          {category}
        </span>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-[9%] px-6 text-center">
        <span
          className="caption mb-3 block"
          style={{
            color: "rgba(255,255,255,0.95)",
            fontSize: "0.82rem",
            textShadow: "0 1px 16px rgba(10,8,6,0.6)",
          }}
        >
          {tag}
        </span>
        <span
          className="block"
          style={{
            color: "rgba(255,255,255,0.98)",
            fontSize: "22px",
            lineHeight: 1.4,
            textShadow: "0 1px 22px rgba(10,8,6,0.7)",
          }}
        >
          {title}
        </span>
      </div>
    </div>
  );
}

export default function ActEvents({
  compactEnding = false,
  transparentBackground = false,
  fadeIn = false,
}: {
  compactEnding?: boolean;
  transparentBackground?: boolean;
  fadeIn?: boolean;
}) {
  const section = useRef<HTMLElement>(null);
  const composition = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = section.current;
    const content = composition.current;
    if (!fadeIn || !root || !content) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const audit = new URLSearchParams(window.location.search).has("audit");

    if (reduce || audit) {
      gsap.set(content, { opacity: 1, y: 0, filter: "blur(0px)" });
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        content,
        { opacity: 0, y: 48, filter: "blur(9px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top 82%",
            end: "top 42%",
            scrub: 0.7,
          },
        },
      );
    }, root);

    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => context.revert();
  }, [fadeIn]);

  return (
    <section
      ref={section}
      id="events"
      className={`relative z-20 w-full overflow-hidden pt-[9vh] ${compactEnding ? "pb-[14vh]" : "pb-[40vh]"}`}
      style={{ background: transparentBackground ? "transparent" : "#e0dcd1" }}
    >
      <div ref={composition} data-events-composition>
        <div className="mb-[7vh] px-6 text-center">
          <Reveal>
            <span className="caption" style={{ color: "var(--bronze-hi)" }}>
              Beyond the Build
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2
              className="display mt-6"
              style={{
                ...GOLD_WRAP,
                fontSize: "clamp(2rem, 4.2vw, 54px)",
                lineHeight: 1.1,
                paddingBottom: "0.1em",
              }}
            >
              The Alpago World
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <button
              type="button"
              aria-disabled="true"
              aria-label="Explore All is unavailable in this standalone presentation"
              className="alpago-dark-button caption ease-alpago mt-8 inline-block cursor-default px-9 py-4 transition-[background-color,color,box-shadow,transform] duration-500 hover:-translate-y-0.5"
              style={{
                color: "#efe7d8",
                letterSpacing: "0.14em",
              }}
            >
              Explore All
            </button>
          </Reveal>
        </div>

        <Reveal y={0} blur={6}>
          <div className="flex w-full">
            {PANELS.map((panel, index) => (
              <Panel key={panel.tag} {...panel} divider={index > 0} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
