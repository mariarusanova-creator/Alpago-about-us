"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// Pinned "track record" section. Scroll advances through the achievements: each image
// holds at FULL opacity, then fades fast at the very end into the next (no long muddy
// crossfade); the text stays until its image is gone. A measuring-ruler runs along the
// bottom with a marker that travels to the active station.
type Ach = {
  n: string;
  metric: string; // short label shown on the ruler
  title: string;
  text: string;
  img: string;
};

const ACH: Ach[] = [
  {
    n: "01",
    metric: "UAE record",
    title: "Casa del Sole",
    text: "The first signature villa — the highest villa transaction ever recorded in the UAE at the time.",
    img: "/media/alp/pool-dusk.jpg",
  },
  {
    n: "02",
    metric: "Top 18",
    title: "Kural Vista",
    text: "Named amongst the eighteen most beautiful homes in Dubai.",
    img: "/media/alp/aerial.jpg",
  },
  {
    n: "03",
    metric: "6 villas",
    title: "Billionaires’ Row",
    text: "Six signature beachfront villas developed on Frond G, Palm Jumeirah — one of Dubai’s most exclusive residential addresses.",
    img: "/media/alp/dsc09633.jpg",
  },
  {
    n: "04",
    metric: "+30–40%",
    title: "Above the market",
    text: "Thirty to forty percent above market-average ROI across our projects.",
    img: "/media/alp/dsc00258.jpg",
  },
  {
    n: "05",
    metric: "World Top 100",
    title: "Top 100 Developers",
    text: "Ranked among the Top 100 Real Estate Developers of the World.",
    img: "/media/alp/dsc09291.jpg",
  },
  {
    n: "06",
    metric: "2024–25",
    title: "Best Residential Development",
    text: "Best International Residential Development, 2024–25.",
    img: "/media/alp/dsc05123.jpg",
  },
  {
    n: "07",
    metric: "2024–25",
    title: "Best Condominium",
    text: "Best International Single Apartment Condominium, 2024–25.",
    img: "/media/alp/palmflower-facade.jpg",
  },
  {
    n: "08",
    metric: "WiredScore",
    title: "Palm Flower",
    text: "Pioneering smart luxury living — Palm Flower earns WiredScore certification, setting new benchmarks for technology-enabled ultra-prime residences.",
    img: "/media/alp/palmflower-dropoff.jpg",
  },
];

// soft edge so the image melts into the background on its left + top/bottom
const IMG_MASK: React.CSSProperties = {
  WebkitMaskImage:
    "linear-gradient(to right, transparent 0%, #000 30%), linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)",
  maskImage:
    "linear-gradient(to right, transparent 0%, #000 30%), linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)",
  WebkitMaskComposite: "source-in",
  maskComposite: "intersect",
};

const smoothstep = (t: number) => t * t * (3 - 2 * t);
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default function Usps() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const imgsRef = useRef<HTMLDivElement[]>([]);
  const textsRef = useRef<HTMLDivElement[]>([]);
  const stationsRef = useRef<HTMLDivElement[]>([]);
  const marker = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const sec = section.current;
    const stg = stage.current;
    if (!sec || !stg) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const audit = new URLSearchParams(window.location.search).has("audit");
    const imgs = imgsRef.current.filter(Boolean);
    const texts = textsRef.current.filter(Boolean);
    const stations = stationsRef.current.filter(Boolean);
    const N = ACH.length;

    // a = active float 0..N-1. Item `seg` holds full opacity, then in the last 28% of
    // its segment fades fast into `seg+1`.
    const apply = (a: number) => {
      const seg = Math.min(N - 2, Math.max(0, Math.floor(a)));
      const f = clamp(a - seg); // 0..1 within this segment
      // images: hold at FULL opacity, then a quick dissolve in the last ~18%
      const cross = smoothstep(clamp((f - 0.82) / 0.18));
      // text: sequential swap — outgoing fades fully out, THEN incoming in, so the two
      // text blocks never overlap. Text stays through almost the whole image fade.
      const outT = 1 - smoothstep(clamp((f - 0.8) / 0.12));
      const inT = smoothstep(clamp((f - 0.92) / 0.08));

      imgs.forEach((el, i) => {
        let o = 0;
        let s = 1;
        if (i === seg) {
          o = 1 - cross;
          s = 1 + f * 0.02; // barely any scale — the fade completes before it grows
        } else if (i === seg + 1) {
          o = cross;
          s = 1.02 - cross * 0.02;
        }
        el.style.opacity = o.toFixed(3);
        el.style.transform = `scale(${s.toFixed(3)})`;
      });
      texts.forEach((el, i) => {
        const o = i === seg ? outT : i === seg + 1 ? inT : 0;
        el.style.opacity = o.toFixed(3);
        el.style.transform = `translateY(${((1 - o) * 8).toFixed(1)}px)`;
      });

      // ruler marker slides continuously; counter + station flip at the text swap
      const active = seg + (f > 0.88 ? 1 : 0);
      if (marker.current)
        marker.current.style.left = ((a / (N - 1)) * 100).toFixed(3) + "%";
      stations.forEach((el, i) => {
        el.style.opacity = i === active ? "1" : "0.32";
      });
      if (counter.current) counter.current.textContent = ACH[active].n;
    };

    if (audit || reduce) {
      apply(0);
      return;
    }
    apply(0);
    stg.style.opacity = "0"; // hidden until it pins (sits pulled-up behind prev section)

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sec,
        start: "top top",
        end: "+=" + N * 46 + "%",
        pin: stg,
        pinType: "fixed",
        scrub: 0.5,
        onUpdate: (self) => {
          apply(self.progress * (N - 1));
          const inA = clamp(self.progress / 0.04);
          const out = clamp((self.progress - 0.94) / 0.06);
          stg.style.opacity = (smoothstep(inA) * (1 - smoothstep(out))).toFixed(3);
        },
      });
    }, sec);

    return () => ctx.revert();
  }, []);

  return (
    <section id="usps" ref={section} className="relative" style={{ marginTop: "-100vh" }}>
      <div ref={stage} className="relative h-screen w-full overflow-hidden">
        {/* top badge — record counter */}
        <div className="absolute left-[8%] top-[9vh] z-20 flex items-center gap-3">
          <span
            className="display grid h-11 w-11 place-items-center rounded-xl"
            style={{
              border: "1px solid var(--ink-faint)",
              color: "var(--bronze-hi)",
              fontSize: "18px",
            }}
          >
            <span ref={counter}>01</span>
          </span>
          <span className="caption">Track record — {ACH.length} milestones</span>
        </div>

        {/* right — full-opacity image per achievement, fast fade between */}
        <div className="absolute inset-y-0 right-0 w-[52%]" style={IMG_MASK}>
          {ACH.map((a, i) => (
            <div
              key={a.n}
              ref={(el) => {
                if (el) imgsRef.current[i] = el;
              }}
              className="absolute inset-0"
              style={{ opacity: 0, willChange: "opacity, transform" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.img} alt="" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          ))}
        </div>

        {/* left — stacked text blocks, crossfading in lockstep with the image */}
        <div className="absolute left-[8%] top-[34%] z-10 w-[40%] max-w-[440px]">
          {ACH.map((a, i) => (
            <div
              key={a.n}
              ref={(el) => {
                if (el) textsRef.current[i] = el;
              }}
              className="absolute left-0 top-0"
              style={{ opacity: 0, willChange: "opacity, transform" }}
            >
              <p
                className="display m-0"
                style={{ fontSize: "clamp(1.5rem, 3vw, 40px)", lineHeight: 1.06, color: "var(--ink)" }}
              >
                {a.title}
              </p>
              <p
                className="m-0 mt-5"
                style={{
                  fontSize: "16.5px",
                  lineHeight: 1.55,
                  color: "var(--ink-dim)",
                  maxWidth: "40ch",
                }}
              >
                {a.text}
              </p>
            </div>
          ))}
        </div>

        {/* bottom — measuring ruler with a travelling marker */}
        <div className="absolute inset-x-[8%] bottom-[8vh] z-20">
          {/* fine tick track (measuring-tape look) */}
          <div
            className="relative h-[38px]"
            style={{
              borderBottom: "1px solid var(--ink-faint)",
              backgroundImage:
                "repeating-linear-gradient(to right, var(--ink-faint) 0 1px, transparent 1px 14px)",
              backgroundPosition: "left bottom",
              backgroundSize: "100% 8px",
              backgroundRepeat: "repeat-x",
            }}
          >
            {/* travelling marker */}
            <div
              ref={marker}
              className="absolute bottom-0 -translate-x-1/2"
              style={{ left: "0%", willChange: "left" }}
            >
              <div className="h-[38px] w-[2px]" style={{ background: "var(--bronze-hi)" }} />
            </div>
          </div>

          {/* station labels */}
          <div className="relative mt-3 h-4">
            {ACH.map((a, i) => (
              <div
                key={a.n}
                ref={(el) => {
                  if (el) stationsRef.current[i] = el;
                }}
                className="absolute -translate-x-1/2 text-center"
                style={{
                  left: `${(i / (ACH.length - 1)) * 100}%`,
                  opacity: 0.32,
                  transition: "opacity 0.25s ease",
                }}
              >
                <span
                  className="caption whitespace-nowrap"
                  style={{ color: "var(--ink)", fontSize: "11px" }}
                >
                  {a.metric}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
