"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const HEADLINE = [
  "An investment-worthy experience,",
  "created and curated for you.",
];

const GOLD: React.CSSProperties = {
  display: "inline-block",
  whiteSpace: "pre",
  backgroundImage: "linear-gradient(180deg, #e2c28e 0%, #c59a5b 48%, #8e673a 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
};

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smoothstep = (t: number) => t * t * (3 - 2 * t);

export default function InvestorsPage() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLAnchorElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const sec = section.current;
    const stg = stage.current;
    const imageEl = image.current;
    const buttonEl = button.current;
    const labelEl = label.current;
    if (!sec || !stg || !imageEl || !buttonEl || !labelEl) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const audit = new URLSearchParams(window.location.search).has("audit");
    const chars = Array.from(stg.querySelectorAll<HTMLElement>(".investor-cta-char"));

    gsap.set(chars, { filter: "blur(12px)", opacity: 0 });
    gsap.set([labelEl, buttonEl], { filter: "blur(8px)", opacity: 0, y: 12 });

    const apply = (progress: number) => {
      // Same soft bottom-up image hand-off and settling zoom as the final Business act.
      const reveal = smoothstep(clamp(progress / 0.34));
      const clip = `inset(${(100 - reveal * 100).toFixed(2)}% 0 0 0)`;
      imageEl.style.clipPath = clip;
      (imageEl.style as CSSStyleDeclaration & { webkitClipPath?: string }).webkitClipPath = clip;
      imageEl.style.transform = `scale(${(1.065 - reveal * 0.065).toFixed(4)})`;

      const labelReveal = smoothstep(clamp((progress - 0.24) / 0.13));
      labelEl.style.opacity = labelReveal.toFixed(3);
      labelEl.style.filter = `blur(${((1 - labelReveal) * 8).toFixed(2)}px)`;
      labelEl.style.transform = `translateY(${((1 - labelReveal) * 12).toFixed(1)}px)`;

      const textReveal = clamp((progress - 0.31) / 0.24);
      chars.forEach((char, index) => {
        const start = (index / Math.max(chars.length - 1, 1)) * 0.62;
        const amount = smoothstep(clamp((textReveal - start) / 0.38));
        char.style.opacity = amount.toFixed(3);
        char.style.filter = `blur(${((1 - amount) * 12).toFixed(2)}px)`;
      });

      const buttonReveal = smoothstep(clamp((progress - 0.58) / 0.16));
      buttonEl.style.opacity = buttonReveal.toFixed(3);
      buttonEl.style.filter = `blur(${((1 - buttonReveal) * 8).toFixed(2)}px)`;
      buttonEl.style.transform = `translateY(${((1 - buttonReveal) * 12).toFixed(1)}px)`;

      stg.style.opacity = smoothstep(clamp(progress / 0.05)).toFixed(3);
    };

    if (audit || reduce) {
      apply(0.82);
      return;
    }

    apply(0);
    stg.style.opacity = "0";
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sec,
        start: "top top",
        end: "+=150%",
        pin: stg,
        pinType: "fixed",
        scrub: 0.6,
        invalidateOnRefresh: true,
        onRefresh: (self) => apply(clamp(self.progress / 0.88)),
        onUpdate: (self) => apply(clamp(self.progress / 0.88)),
      });
    }, sec);

    return () => ctx.revert();
  }, []);

  return (
    <section id="investor-conversation" ref={section} className="relative" style={{ marginTop: "-100vh" }}>
      <div ref={stage} className="nav-dark relative h-screen w-full overflow-hidden">
        <div
          ref={image}
          className="absolute inset-0 will-change-transform"
          style={{ clipPath: "inset(100% 0 0 0)", transformOrigin: "50% 55%" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/img/investors-cta.jpg"
            alt="An Alpago residence overlooking the water"
            className="h-full w-full object-cover"
            style={{ objectPosition: "50% 50%", filter: "saturate(0.78) contrast(1.04) brightness(0.68)" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(10,8,6,0.16), rgba(10,8,6,0.38))" }}
          />
        </div>

        <div className="over-img absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
          <span ref={label} className="caption mb-7" style={{ color: "rgba(239,225,202,0.84)", letterSpacing: "0.22em" }}>
            A Conversation About Value
          </span>
          <div className="display" style={{ lineHeight: 1.08, letterSpacing: "-0.025em" }}>
            {HEADLINE.map((line) => (
              <div key={line} style={{ fontSize: "clamp(2rem, 5vw, 62px)", paddingBottom: "0.08em" }}>
                {Array.from(line).map((char, index) => (
                  <span key={index} className="investor-cta-char" style={GOLD}>{char}</span>
                ))}
              </div>
            ))}
          </div>
          <a
            ref={button}
            href="#contact"
            className="investor-session-button caption mt-11 inline-block px-10 py-4"
            onMouseEnter={(event) => {
              event.currentTarget.style.background = "#876540";
              event.currentTarget.style.color = "#f1eadf";
              event.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.background = "rgba(236,231,219,0.94)";
              event.currentTarget.style.color = "#30261c";
              event.currentTarget.style.transform = "translateY(0)";
            }}
            style={{
              background: "rgba(236,231,219,0.94)",
              color: "#30261c",
              letterSpacing: "0.15em",
              transition: "background-color 420ms ease, color 420ms ease, transform 420ms ease",
            }}
          >
            Schedule a Session
          </a>
        </div>
      </div>
    </section>
  );
}
