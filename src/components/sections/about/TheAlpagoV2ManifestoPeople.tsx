"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const FEATURES = [
  {
    number: "01.",
    title: "The Manifesto",
    body: "The beliefs that guide every project — a written commitment to craft, restraint and the pursuit of what endures long after completion.",
    label: "Learn More",
    href: "/the-alpago/manifesto",
  },
  {
    number: "02.",
    title: "People Behind Alpago",
    body: "A multidisciplinary team of developers, architects and craftspeople united by a single conviction — that excellence is a matter of who, not just what.",
    label: "Meet the Team",
    href: "/the-alpago/people",
  },
] as const;

export default function TheAlpagoV2ManifestoPeople() {
  const section = useRef<HTMLElement>(null);
  const features = useRef<(HTMLElement | null)[]>([]);

  useLayoutEffect(() => {
    const root = section.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const audit = new URLSearchParams(window.location.search).has("audit");
    const items = features.current.filter((item): item is HTMLElement => Boolean(item));

    if (reduce || audit) {
      gsap.set(items, { opacity: 1, y: 0, filter: "blur(0px)" });
      return;
    }

    const context = gsap.context(() => {
      items.forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 45, filter: "blur(7px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            ease: "none",
            scrollTrigger: {
              trigger: item,
              start: "top 92%",
              end: "top 58%",
              scrub: 0.65,
            },
          },
        );
      });
    }, root);

    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => context.revert();
  }, []);

  return (
    <section
      ref={section}
      id="v2-manifesto-people"
      aria-label="The Manifesto and People Behind Alpago"
      className="relative z-20 min-h-screen px-6 pb-[180px] pt-[10vh] md:px-14 md:pb-[205px] md:pt-[12vh]"
    >
      <div className="mx-auto grid min-h-[68vh] w-full max-w-[1560px] grid-rows-2 gap-y-[50px]">
        {FEATURES.map((feature, index) => (
          <article
            key={feature.title}
            ref={(element) => {
              features.current[index] = element;
            }}
            className={`grid max-w-[650px] grid-cols-[34px_minmax(0,1fr)] content-start gap-x-4 will-change-[opacity,transform,filter] ${
              index === 1
                ? "self-end md:ml-auto md:mr-[4vw] md:w-[min(46vw,650px)]"
                : "md:ml-[4vw]"
            }`}
          >
            <span
              className="caption pt-[0.72em]"
              style={{ color: "var(--bronze-lo)", fontSize: "0.66rem", letterSpacing: "0.08em" }}
            >
              {feature.number}
            </span>

            <div>
              <h2
                className="display text-[clamp(1.3rem,3.8vw,46px)] leading-[1.08] tracking-[-0.015em]"
                style={{ color: "var(--gold-2)" }}
              >
                {feature.title}
              </h2>

              <p
                className="mt-7 max-w-[45ch]"
                style={{
                  color: "var(--ink-dim)",
                  fontFamily: "var(--font-basel), system-ui, sans-serif",
                  fontSize: "15.5px",
                  lineHeight: 1.625,
                }}
              >
                {feature.body}
              </p>

              <button
                type="button"
                disabled
                aria-label={`${feature.label} is unavailable in this standalone presentation`}
                className="alpago-dark-button caption ease-alpago mt-8 inline-flex min-h-11 cursor-default items-center justify-center px-8 py-3.5 transition-[background-color,color,box-shadow] duration-500"
                style={{ fontSize: "0.58rem", letterSpacing: "0.16em" }}
              >
                {feature.label}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
