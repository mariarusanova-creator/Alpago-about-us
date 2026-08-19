"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { STATEMENT_TITLE } from "./kit";

export type StandardsStoryItem = {
  number: string;
  name: string;
  text: string;
};

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const smoothstep = (value: number) => value * value * (3 - 2 * value);

const GOLD: React.CSSProperties = {
  backgroundImage: "linear-gradient(180deg, var(--gold-1) 0%, var(--gold-2) 48%, var(--gold-3) 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
};

const ITEM_TOPS = [17, 27, 37, 47, 57];

export default function AlpagoStandardsStory({ items }: { items: StandardsStoryItem[] }) {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const photo = useRef<HTMLDivElement>(null);
  const photoScrim = useRef<HTMLDivElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const introGold = useRef<HTMLHeadingElement>(null);
  const introLight = useRef<HTMLHeadingElement>(null);
  const storyLine = useRef<SVGPathElement>(null);
  const storyLineReveal = useRef<SVGRectElement>(null);
  const beigeGradient = useRef<HTMLDivElement>(null);
  const beigeFill = useRef<HTMLDivElement>(null);
  const panels = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const sec = section.current;
    const stg = stage.current;
    const image = photo.current;
    const introEl = intro.current;
    if (!sec || !stg || !image || !introEl) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const audit = new URLSearchParams(window.location.search).has("audit");
    const apply = (rawProgress: number) => {
      const progress = clamp(rawProgress);
      const introIn = smoothstep(clamp(progress / 0.11));
      const imageReveal = smoothstep(clamp((progress - 0.17) / 0.15));
      const introOut = smoothstep(clamp((progress - 0.355) / 0.07));
      const gradientFade = smoothstep(clamp((progress - 0.915) / 0.055));
      const beigeFade = smoothstep(clamp((progress - 0.958) / 0.042));

      stg.style.opacity = introIn.toFixed(3);
      introEl.style.left = "50%";
      introEl.style.top = "50%";
      introEl.style.transform = "translate(-50%, -50%)";
      introEl.style.opacity = (1 - introOut).toFixed(3);

      if (introGold.current) introGold.current.style.opacity = (1 - imageReveal).toFixed(3);
      if (introLight.current) introLight.current.style.opacity = imageReveal.toFixed(3);

      image.style.opacity = (imageReveal * (1 - beigeFade)).toFixed(3);
      image.style.visibility = imageReveal > 0.002 ? "visible" : "hidden";
      if (photoScrim.current) photoScrim.current.style.opacity = imageReveal.toFixed(3);
      stg.dataset.navoff = imageReveal > 0.46 ? "0" : "1";

      // The five principles travel through one two-viewport photograph. The
      // first is anchored at its upper portion and the fifth at its lower edge.
      const storyProgress = smoothstep(clamp((progress - 0.435) / 0.505));
      image.style.transform = `translate3d(0, ${(-100 * storyProgress).toFixed(3)}vh, 0) scale(${(1.035 - imageReveal * 0.035).toFixed(4)})`;
      if (beigeGradient.current) {
        beigeGradient.current.style.opacity = (gradientFade * (1 - beigeFade)).toFixed(3);
      }
      if (beigeFill.current) beigeFill.current.style.opacity = beigeFade.toFixed(3);
      if (beigeFade > 0.58) stg.dataset.navoff = "1";
      if (storyLine.current) {
        const lineIn = smoothstep(clamp((progress - 0.415) / 0.035));
        // A useful first bend is already visible beside principle 01. From
        // there the same uninterrupted stroke is revealed by the scroll.
        const drawn = clamp(0.22 + storyProgress * 0.78);
        storyLine.current.style.opacity = (lineIn * (1 - beigeFade)).toFixed(3);
        if (storyLineReveal.current) {
          storyLineReveal.current.setAttribute("height", (224 * drawn).toFixed(2));
        }
      }

      const position = storyProgress * Math.max(1, items.length - 1);
      const active = Math.min(items.length - 1, Math.floor(position + 0.0001));
      const local = position - active;
      const transitionOut = smoothstep(clamp((local - 0.68) / 0.32));

      panels.current.forEach((panel, index) => {
        if (!panel) return;
        let opacity = 0;
        let y = 22;
        let blur = 10;
        if (index === active) {
          opacity = 1 - transitionOut;
          y = -14 * transitionOut;
          blur = 7 * transitionOut;
        } else if (index === active + 1) {
          opacity = transitionOut;
          y = 22 * (1 - transitionOut);
          blur = 10 * (1 - transitionOut);
        }
        if (storyProgress <= 0.001 && index === 0) opacity = 1;
        const visible = imageReveal * (1 - clamp((0.435 - progress) / 0.04));
        opacity *= visible * (1 - beigeFade);
        panel.style.opacity = opacity.toFixed(3);
        panel.style.visibility = opacity > 0.002 ? "visible" : "hidden";
        panel.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
        panel.style.filter = `blur(${blur.toFixed(2)}px)`;
      });
    };

    if (reduce || audit) {
      apply(0.58);
      return;
    }

    apply(0);
    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sec,
        start: "top top",
        end: "+=790%",
        pin: stg,
        pinType: "fixed",
        scrub: 1.1,
        invalidateOnRefresh: true,
        onUpdate: (self) => apply(self.progress),
        onRefresh: (self) => apply(self.progress),
      });
    }, sec);

    return () => context.revert();
  }, [items]);

  const introHeading = (
    <>
      <span className="block">Where standards</span>
      <span className="block">drive decisions,</span>
      <span className="block">not profit.</span>
    </>
  );

  return (
    <section id="standards" ref={section} className="relative z-20" style={{ marginTop: "-100vh" }}>
      <div ref={stage} data-navoff="1" className="section-bg nav-dark relative h-screen w-full overflow-hidden opacity-0">
        <div
          ref={photo}
          className="absolute left-0 top-0 h-[200vh] w-full origin-top overflow-hidden opacity-0 will-change-[transform,opacity]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/alp/about-craft.jpg"
            alt="Alpago craftsmanship and interior execution"
            className="h-full w-full object-cover"
            style={{ objectPosition: "54% 50%" }}
          />
          <div
            ref={photoScrim}
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(10,7,5,0.7) 0%, rgba(10,7,5,0.3) 38%, rgba(10,7,5,0.08) 63%, rgba(10,7,5,0.34) 100%), linear-gradient(to bottom, rgba(10,7,5,0.3) 0%, transparent 18%, transparent 76%, rgba(10,7,5,0.48) 100%)",
            }}
          />
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible"
            viewBox="0 0 100 200"
            preserveAspectRatio="none"
          >
            <defs>
              <filter id="standards-line-glow" x="-30%" y="-20%" width="160%" height="140%">
                <feGaussianBlur stdDeviation="0.32" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <mask id="standards-line-reveal" maskUnits="userSpaceOnUse" x="-5" y="-12" width="110" height="224">
                <rect ref={storyLineReveal} x="-5" y="-12" width="110" height="0" fill="white" />
              </mask>
            </defs>
            <path
              ref={storyLine}
              data-story-line
              d="M 68 -10 C 87 3, 92 18, 78 32 C 62 47, 34 43, 25 58 C 16 74, 38 83, 61 87 C 84 92, 89 103, 74 113 C 57 126, 32 120, 24 136 C 17 152, 40 160, 63 164 C 85 170, 89 184, 72 198 C 64 205, 62 211, 68 216"
              fill="none"
              stroke="rgba(247,241,232,0.5)"
              strokeWidth="1.05"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              filter="url(#standards-line-glow)"
              mask="url(#standards-line-reveal)"
              style={{ opacity: 0 }}
            />
          </svg>
        </div>

        {/* The long photograph resolves into the same cream canvas used by the
            page. The first layer preserves a visible photographic gradient;
            the second completes the transition to an uninterrupted beige frame. */}
        <div
          ref={beigeGradient}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-40 opacity-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(230,226,214,0) 0%, rgba(230,226,214,0.08) 28%, rgba(230,226,214,0.58) 66%, #e6e2d6 100%)",
          }}
        />
        <div
          ref={beigeFill}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-40 opacity-0"
          style={{ background: "#e0dcd1" }}
        />
        <div
          ref={intro}
          className="absolute z-20 w-max max-w-[90vw] will-change-[left,top,transform,opacity]"
          style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
        >
          <h2
            ref={introGold}
            className="display text-center"
            style={{ ...GOLD, ...STATEMENT_TITLE, paddingBottom: "0.08em" }}
          >
            {introHeading}
          </h2>
          <h2
            ref={introLight}
            className="over-img display absolute inset-0 text-center opacity-0"
            style={{ ...GOLD, ...STATEMENT_TITLE, paddingBottom: "0.08em" }}
          >
            {introHeading}
          </h2>
        </div>

        {items.map((item, index) => {
          const right = index % 2 === 1;
          return (
            <div
              key={item.number}
              ref={(element) => { panels.current[index] = element; }}
              className={`over-img absolute z-30 w-[min(40vw,520px)] max-md:left-6 max-md:right-auto max-md:w-[calc(100%-3rem)] ${right ? "right-[5.5vw] text-right" : "left-[5.5vw] text-left"}`}
              style={{ top: `${ITEM_TOPS[index] ?? 57}%`, opacity: 0, visibility: "hidden", willChange: "opacity,transform,filter" }}
            >
              <span
                className="caption mb-4 block"
                style={{ color: "var(--bronze-hi)" }}
              >
                {item.number}
              </span>
              <h3
                className="display"
                style={{ ...GOLD, fontSize: "clamp(1.65rem, 3.1vw, 42px)", lineHeight: 1.1, letterSpacing: "-0.02em", paddingBottom: "0.08em" }}
              >
                {item.name}
              </h3>
              <p
                className={`mt-6 text-[15.5px] leading-relaxed ${right ? "ml-auto" : "mr-auto"}`}
                style={{ color: "var(--ink-strong)", maxWidth: "43ch", textShadow: "0 1px 22px rgba(10,8,6,0.65)" }}
              >
                {item.text}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
