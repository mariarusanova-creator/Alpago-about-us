"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { clamp, smoothstep } from "./kit";

const SLIDES = [
  "/media/alp/people-gallery-01.jpg",
  "/media/alp/about-people-site-team.png",
  "/media/alp/people-family-hero-130517.jpg",
  "/media/alp/careers-team.jpg",
  "/media/alp/about-people.png",
];

const CENTRE = { left: 23, top: 25.5, width: 54, height: 49 };

function Arrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" width="24" height="24" fill="none">
      <path
        d={direction === "left" ? "M19 12H5M10 7l-5 5 5 5" : "M5 12h14M14 7l5 5-5 5"}
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="square"
        strokeLinejoin="miter"
        strokeOpacity={1}
      />
    </svg>
  );
}

/**
 * V2 gallery: one softly feathered centre image grows continuously into a
 * full-screen manual slider as the user scrolls.
 */
export default function PeopleGalleryMosaicSlider() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const clip = useRef<HTMLDivElement>(null);
  const controls = useRef<HTMLDivElement>(null);
  const tiles = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    const sec = section.current;
    const stg = stage.current;
    const centre = tiles.current[0];
    if (!sec || !stg || !centre) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const audit = new URLSearchParams(window.location.search).has("audit");

    const setWipe = (radius: number) => clip.current?.style.setProperty("--r", `${radius.toFixed(2)}%`);
    const setTerminal = (hidden: boolean) => {
      if (!clip.current) return;
      clip.current.style.visibility = hidden ? "hidden" : "visible";
      clip.current.style.opacity = hidden ? "0" : "1";
    };
    const setEdgeFade = (reveal: number) => {
      if (reveal >= 0.995) {
        centre.style.maskImage = "none";
        centre.style.webkitMaskImage = "none";
        return;
      }

      const horizontalEdge = 39 * (1 - reveal);
      const verticalEdge = 36 * (1 - reveal);
      const horizontal = `linear-gradient(to right, transparent 0%, rgba(0,0,0,0.14) ${(horizontalEdge * 0.2).toFixed(2)}%, rgba(0,0,0,0.42) ${(horizontalEdge * 0.48).toFixed(2)}%, rgba(0,0,0,0.76) ${(horizontalEdge * 0.74).toFixed(2)}%, #000 ${horizontalEdge.toFixed(2)}%, #000 ${(100 - horizontalEdge).toFixed(2)}%, rgba(0,0,0,0.76) ${(100 - horizontalEdge * 0.74).toFixed(2)}%, rgba(0,0,0,0.42) ${(100 - horizontalEdge * 0.48).toFixed(2)}%, rgba(0,0,0,0.14) ${(100 - horizontalEdge * 0.2).toFixed(2)}%, transparent 100%)`;
      const vertical = `linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.14) ${(verticalEdge * 0.2).toFixed(2)}%, rgba(0,0,0,0.42) ${(verticalEdge * 0.48).toFixed(2)}%, rgba(0,0,0,0.76) ${(verticalEdge * 0.74).toFixed(2)}%, #000 ${verticalEdge.toFixed(2)}%, #000 ${(100 - verticalEdge).toFixed(2)}%, rgba(0,0,0,0.76) ${(100 - verticalEdge * 0.74).toFixed(2)}%, rgba(0,0,0,0.42) ${(100 - verticalEdge * 0.48).toFixed(2)}%, rgba(0,0,0,0.14) ${(100 - verticalEdge * 0.2).toFixed(2)}%, transparent 100%)`;
      const mask = `${horizontal}, ${vertical}`;
      centre.style.maskImage = mask;
      centre.style.maskComposite = "intersect";
      centre.style.webkitMaskImage = mask;
      centre.style.setProperty("-webkit-mask-composite", "source-in");
    };
    const apply = (progress: number) => {
      const expand = smoothstep(clamp(progress / 0.58));
      const controlsIn = smoothstep(clamp((progress - 0.64) / 0.07));

      setEdgeFade(expand);
      centre.style.left = `${CENTRE.left * (1 - expand)}vw`;
      centre.style.top = `${CENTRE.top * (1 - expand)}vh`;
      centre.style.width = `${CENTRE.width + (100 - CENTRE.width) * expand}vw`;
      centre.style.height = `${CENTRE.height + (100 - CENTRE.height) * expand}vh`;
      centre.style.borderRadius = `${3 * (1 - expand)}px`;
      centre.style.transform = "translate3d(0,0,0)";
      centre.style.opacity = "1";

      if (controls.current) {
        controls.current.style.opacity = controlsIn.toFixed(3);
        controls.current.style.transform = `translate3d(0, ${(1 - controlsIn) * 18}px, 0)`;
        controls.current.style.pointerEvents = controlsIn > 0.85 ? "auto" : "none";
      }
    };

    setWipe(130);

    if (reduce || audit) {
      apply(0.72);
      return;
    }

    apply(0);
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sec,
        start: "top top",
        end: "+=500%",
        pin: stg,
        pinType: "fixed",
        scrub: 0.65,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;
          apply(progress);
          const wipeProgress = clamp((progress - 0.84) / 0.155);
          const radius = 130 - wipeProgress * 170;
          setWipe(radius);
          stg.dataset.navoff = progress < 0.47 || radius < 8 ? "1" : "0";
        },
        onRefresh: (self) => {
          const progress = self.progress;
          apply(progress);
          const wipeProgress = clamp((progress - 0.84) / 0.155);
          const radius = 130 - wipeProgress * 170;
          setWipe(radius);
          stg.dataset.navoff = progress < 0.47 || radius < 8 ? "1" : "0";
        },
        onEnter: () => {
          setTerminal(false);
          stg.style.pointerEvents = "auto";
          sec.style.zIndex = "20";
        },
        onLeave: () => {
          setTerminal(true);
          stg.style.pointerEvents = "none";
          stg.dataset.navoff = "1";
          sec.style.zIndex = "0";
        },
        onEnterBack: () => {
          setTerminal(false);
          stg.style.pointerEvents = "auto";
          stg.dataset.navoff = "0";
          sec.style.zIndex = "20";
        },
        onLeaveBack: () => {
          setTerminal(false);
          stg.style.pointerEvents = "auto";
          stg.dataset.navoff = "1";
          sec.style.zIndex = "20";
        },
      });
    }, sec);

    return () => ctx.revert();
  }, []);

  const move = (amount: number) => {
    setActive((current) => (current + amount + SLIDES.length) % SLIDES.length);
  };

  return (
    <section
      id="people-gallery-v2"
      ref={section}
      className="relative z-20 w-screen"
      style={{ marginLeft: "calc((100% - 100vw) / 2)" }}
    >
      <div ref={stage} data-navoff="1" className="nav-dark relative h-screen w-full overflow-hidden">
        <div
          ref={clip}
          className="absolute inset-0 will-change-[mask]"
          style={{
            "--r": "130%",
            WebkitMaskImage: "linear-gradient(to bottom, #000 var(--r), rgba(0,0,0,0) calc(var(--r) + 40%))",
            maskImage: "linear-gradient(to bottom, #000 var(--r), rgba(0,0,0,0) calc(var(--r) + 40%))",
          } as React.CSSProperties}
        >
          <div className="absolute inset-0">

            <div
              ref={(element) => { tiles.current[0] = element; }}
              className="absolute overflow-hidden will-change-[left,top,width,height,transform,opacity,mask-image]"
              style={{
                left: `${CENTRE.left}vw`,
                top: `${CENTRE.top}vh`,
                width: `${CENTRE.width}vw`,
                height: `${CENTRE.height}vh`,
                borderRadius: "3px",
                zIndex: 20,
              }}
            >
              {SLIDES.map((src, slideIndex) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src}
                  src={src}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 h-full w-full object-cover object-center transition-[opacity,transform] duration-[900ms] ease-out"
                  style={{
                    opacity: slideIndex === active ? 1 : 0,
                    transform: slideIndex === active ? "scale(1)" : "scale(1.025)",
                  }}
                />
              ))}
            </div>

            <div
              ref={controls}
              className="absolute inset-x-6 bottom-0 z-40 opacity-0 md:inset-x-14"
              style={{ pointerEvents: "none" }}
            >
              <div className="h-px w-full bg-white/30" />

              <div className="flex items-end justify-between pb-[6vh] pt-5 md:pt-6">
                <div
                  className="caption pb-3 text-left"
                  style={{ color: "#fffdf8", fontFamily: "var(--font-basel), system-ui, sans-serif", fontSize: "0.95rem", letterSpacing: "0.22em" }}
                >
                  {String(active + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
                </div>

                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => move(-1)}
                    aria-label="Previous image"
                    className="grid h-11 w-11 place-items-center text-white transition-colors duration-300 hover:bg-white/10 md:h-12 md:w-12"
                    style={{ border: "1px solid rgba(255,255,255,0.4)" }}
                  >
                    <Arrow direction="left" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(1)}
                    aria-label="Next image"
                    className="grid h-11 w-11 place-items-center bg-white text-[#24180f] transition-colors duration-300 hover:bg-[#d8c4a6] md:h-12 md:w-12"
                  >
                    <Arrow direction="right" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
