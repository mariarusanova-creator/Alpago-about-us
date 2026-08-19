"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { clamp, smoothstep } from "./kit";

const HEADLINE =
  "We have been raising the performance bar since our inception and this will be the case for decades to come.";

const FIRST_PARAGRAPH =
  "When the commitment is to do what is right for the client, rather than what is easiest for the business, outcomes are no longer measured against existing benchmarks. They begin to establish new ones.";

const SECOND_PARAGRAPH =
  "This philosophy shapes every discipline within Alpago Group. Whether developing landmark residences, creating integrated design and construction environments, or curating some of the world's most significant automobiles, every endeavour is guided by a single principle: exceptional outcomes are achieved when vision, craftsmanship, and execution remain uncompromised from beginning to end. That is how standards evolve. That is why Alpago exists.";

const CARDS = [
  {
    title: "Team of over 400 in-house Professionals",
    video: "/media/video/transparency-clean.mp4",
  },
  {
    title: "5 Offices and Facilities",
    video: "/media/video/transparency-clean-decision.mp4",
  },
  {
    title: "More than 20 Nationalities",
    video: "/media/video/transparency-nationalities.mp4",
  },
] as const;

export default function TheAlpagoV2Performance() {
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const mediaLayer = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const guideLines = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const sec = section.current;
    const vid = video.current;
    const media = mediaLayer.current;
    const copy = content.current;
    if (!sec || !vid || !media || !copy) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const audit = new URLSearchParams(window.location.search).has("audit");

    const apply = (progress: number) => {
      const p = clamp(progress);
      const enter = smoothstep(clamp((p - 0.025) / 0.09));
      const mediaLeave = smoothstep(clamp((p - 0.895) / 0.095));
      const mediaOpacity = enter * (1 - mediaLeave);

      const copyEnter = smoothstep(clamp((p - 0.1) / 0.1));
      const copyLeave = smoothstep(clamp((p - 0.4) / 0.1));
      const copyOpacity = copyEnter * (1 - copyLeave);
      const photoBlur = smoothstep(clamp((p - 0.44) / 0.14));

      media.style.opacity = mediaOpacity.toFixed(3);
      vid.style.filter = `blur(${(photoBlur * 25).toFixed(2)}px) saturate(${(1 - photoBlur * 0.08).toFixed(3)}) brightness(${(1 - photoBlur * 0.2).toFixed(3)})`;
      vid.style.transform = `scale(${(1.035 + photoBlur * 0.065).toFixed(4)})`;

      copy.style.opacity = copyOpacity.toFixed(3);
      copy.style.filter = `blur(${((1 - copyOpacity) * 12).toFixed(2)}px)`;
      copy.style.transform = `translateY(${((1 - copyEnter) * 34).toFixed(1)}px)`;

      // The reference grows the cards out of one tight central cluster. They
      // then remain as a single horizontal gallery until the entire scene exits.
      const exit = smoothstep(clamp((p - 0.865) / 0.105));
      const exitLift = exit * 42;
      const mobile = window.innerWidth < 768;
      const finalCardWidth = mobile
        ? window.innerWidth * 0.36
        : Math.max(218, Math.min(window.innerWidth * 0.2244, 326));
      const insightsGap = 20;
      const galleryWidth = finalCardWidth * CARDS.length + insightsGap * (CARDS.length - 1);
      const revealStarts = [0.6, 0.5, 0.55];
      const linesEnter = smoothstep(clamp((p - 0.72) / 0.055));

      if (guideLines.current) {
        guideLines.current.style.opacity = (linesEnter * (1 - exit)).toFixed(3);
        guideLines.current.style.transform = `translateY(calc(-50% - ${exitLift.toFixed(2)}px))`;
        guideLines.current.style.setProperty("--gallery-width", `${galleryWidth.toFixed(2)}px`);
      }

      cards.current.forEach((card, index) => {
        if (!card) return;
        const reveal = smoothstep(clamp((p - revealStarts[index]) / 0.14));
        const rowX = (index - 1) * (finalCardWidth + insightsGap);
        const x = rowX;
        const y = -(exitLift / window.innerHeight) * 100;
        const scale = 0.8 + reveal * 0.2;
        const opacity = reveal * (1 - exit);

        card.style.opacity = opacity.toFixed(3);
        card.style.filter = "none";
        card.style.zIndex = String(30 + index);
        card.style.pointerEvents = opacity > 0.55 ? "auto" : "none";
        card.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}vh, 0) scale(${scale.toFixed(4)})`;
      });
    };

    if (reduce || audit) {
      sec.style.height = "100vh";
      apply(0.72);
      vid.play().catch(() => {});
      return;
    }

    apply(0);
    vid.play().catch(() => {});
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sec,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.75,
        invalidateOnRefresh: true,
        onEnter: () => vid.play().catch(() => {}),
        onEnterBack: () => vid.play().catch(() => {}),
        onLeave: () => vid.pause(),
        onLeaveBack: () => vid.pause(),
        onRefresh: (self) => apply(self.progress),
        onUpdate: (self) => apply(self.progress),
      });
    }, sec);

    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={section}
      id="v2-performance"
      aria-label="Raising the performance bar"
      className="relative z-20"
      style={{ height: "600vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div
          ref={mediaLayer}
          className="nav-dark absolute inset-0 will-change-[opacity]"
          style={{ opacity: 0 }}
        >
          <video
            ref={video}
            aria-hidden
            className="h-full w-full object-cover will-change-[filter,transform]"
            src="/media/video/hero-3-hd.mp4"
            muted
            loop
            playsInline
            preload="auto"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(10,8,5,.68) 0%, rgba(10,8,5,.28) 43%, rgba(10,8,5,.68) 100%)",
            }}
          />
        </div>

        <div
          ref={content}
          className="over-img absolute inset-0 z-10 flex flex-col px-6 pb-[13vh] pt-[13vh] will-change-[opacity,transform,filter] md:px-14 md:pb-[14vh] md:pt-[11vh]"
          style={{ color: "#fffdf8", opacity: 0 }}
        >
          <div className="mx-auto flex h-full w-full max-w-[1560px] translate-y-[70px] flex-col">
            <h2
              className="display max-w-[31ch]"
              style={{
                display: "block",
                whiteSpace: "normal",
                color: "#fffdf8",
                fontSize: "clamp(1.65rem, 3.1vw, 42px)",
                fontWeight: 400,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                paddingBottom: "0.08em",
              }}
            >
              {HEADLINE}
            </h2>

            <div
              className="mt-[8vh] grid gap-7 md:mt-[clamp(72px,11vh,120px)] md:grid-cols-[minmax(0,360px)_minmax(0,680px)] md:gap-[5vw]"
              style={{
                color: "var(--ink-strong)",
                fontFamily: "var(--font-basel), system-ui, sans-serif",
                fontSize: "15.5px",
                lineHeight: 1.625,
                textShadow: "0 1px 22px rgba(10,8,6,0.65)",
              }}
            >
              <p className="max-w-[43ch]">{FIRST_PARAGRAPH}</p>
              <p className="max-w-[60ch]">{SECOND_PARAGRAPH}</p>
            </div>
          </div>
        </div>

        <div
          ref={guideLines}
          aria-hidden
          className="pointer-events-none absolute inset-x-[5.5vw] top-1/2 z-[19] flex -translate-y-1/2 items-center opacity-0 max-md:hidden"
        >
          <span className="h-px flex-1 bg-[rgba(255,255,255,0.3)]" />
          <span className="shrink-0" style={{ width: "calc(var(--gallery-width) + 40px)" }} />
          <span className="h-px flex-1 bg-[rgba(255,255,255,0.3)]" />
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
                  className="group relative h-full w-full overflow-hidden rounded-[3px] p-8 hover:-translate-y-3 hover:border-transparent"
                  style={{
                    border: "1px solid rgba(236,227,213,0.16)",
                    background:
                      "linear-gradient(165deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.02) 100%)",
                    backdropFilter: "blur(22px) saturate(112%)",
                    WebkitBackdropFilter: "blur(22px) saturate(112%)",
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.08), 0 20px 55px rgba(10,8,6,0.3)",
                    transition:
                      "translate 1150ms cubic-bezier(0.16, 1, 0.3, 1), border-color 700ms ease",
                  }}
                >
                  <video
                    aria-hidden
                    className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                    src={card.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                    style={{ background: "linear-gradient(180deg, rgba(10,8,5,.18), rgba(10,8,5,.78))" }}
                  />
                  <h3
                    className="display absolute bottom-8 left-8 right-8 z-10 text-white/80 transition-colors duration-700 group-hover:text-white"
                    style={{
                      fontSize: "24px",
                      fontWeight: 400,
                      lineHeight: 1.3,
                      letterSpacing: "0.03em",
                      textShadow: "0 1px 18px rgba(10,8,6,0.45)",
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
