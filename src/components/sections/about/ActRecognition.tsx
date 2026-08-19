"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { GOLD } from "./kit";
import AwardPopup, { type AwardDetails } from "@/components/awards/AwardPopup";

const AWARDS: AwardDetails[] = [
  { tag: "Development", name: "RAED Ventures", caption: "Scape Global Forum — New Development Project" },
  { tag: "Design & Build", name: "Construction Week", caption: "Top 50 GCC Developers — Green Building" },
  { tag: "Properties", name: "HALA", caption: "LIV GOLF — Infrastructure Award" },
  { tag: "Design & Build", name: "RAED Ventures", caption: "Cityscape Global Forum — Best New Development" },
  { tag: "Properties", name: "HALA", caption: "LIV GOLF — Infrastructure Award" },
];

const EVENTS = [
  { tag: "Releases", date: "1 day ago", title: "A new benchmark on the Palm", img: "/media/alp/dsc09291.jpg" },
  { tag: "Market Sentiment", date: "1 day ago", title: "Where ultra-prime is heading", img: "/media/alp/dsc09633.jpg" },
  { tag: "Releases", date: "1 day ago", title: "Inside the Alpago atelier", img: "/media/alp/img-3714.jpg" },
];

export default function ActRecognition() {
  const [activeAward, setActiveAward] = useState<AwardDetails | null>(null);
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const sec = section.current;
    const stg = stage.current;
    const tr = track.current;
    if (!sec || !stg || !tr) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const audit = new URLSearchParams(window.location.search).has("audit");

    if (audit || reduce) {
      stg.style.opacity = "1";
      return;
    }

    const maxX = () => Math.max(0, tr.scrollWidth - stg.clientWidth);
    stg.style.opacity = "0";

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sec,
        start: "top top",
        end: () => "+=" + (maxX() + window.innerHeight),
        pin: stg,
        pinType: "fixed",
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // hold briefly at the ends; travel horizontally in the middle
          const p = gsap.utils.clamp(0, 1, (self.progress - 0.06) / 0.88);
          tr.style.transform = `translateX(${(-maxX() * p).toFixed(1)}px)`;
          const inA = gsap.utils.clamp(0, 1, self.progress / 0.04);
          stg.style.opacity = inA.toFixed(3);
        },
      });
    }, sec);

    return () => ctx.revert();
  }, []);

  return (
    <>
    <section id="recognition" ref={section} className="relative" style={{ marginTop: "-100vh" }}>
      <div ref={stage} className="section-bg relative h-screen w-full overflow-hidden">
        <div ref={track} className="absolute inset-y-0 left-0 flex h-full items-center gap-8 px-6 md:gap-12 md:px-14" style={{ width: "max-content" }}>
          {/* intro panel */}
          <div className="flex w-[70vw] max-w-[520px] shrink-0 flex-col justify-center">
            <span className="caption mb-6" style={{ color: "var(--bronze)" }}>
              Recognition
            </span>
            <h2 className="display" style={{ ...GOLD, fontSize: "clamp(2.2rem, 5vw, 68px)", lineHeight: 1.05 }}>
              Awards & Achievements
            </h2>
            <p className="mt-[34px] max-w-[38ch] text-[15px] leading-relaxed" style={{ color: "var(--ink-dim)" }}>
              A record of firsts recognised across the industry — scroll to move through it.
            </p>
          </div>

          {/* award cards */}
          {AWARDS.map((a, i) => (
            <button
              type="button"
              onClick={() => setActiveAward(a)}
              aria-label={`View ${a.caption} award details`}
              key={`a${i}`}
              className="ease-alpago flex h-[52vh] w-[300px] shrink-0 cursor-pointer flex-col justify-between p-8 text-left outline-none transition-[border-color,background-color,transform] duration-500 hover:-translate-y-1 focus-visible:border-[color:var(--bronze-hi)]"
              style={{ border: "1px solid var(--line)", background: "rgba(236,227,213,0.02)" }}
            >
              <span className="caption" style={{ color: "var(--bronze)", fontSize: "0.6rem" }}>
                {a.tag}
              </span>
              <div className="display" style={{ fontSize: "26px", letterSpacing: "0.04em", color: "var(--ink)" }}>
                {a.name}
              </div>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--ink-dim)" }}>
                {a.caption}
              </p>
            </button>
          ))}

          {/* events header */}
          <div className="flex w-[46vw] max-w-[420px] shrink-0 flex-col justify-center">
            <h2 className="display" style={{ ...GOLD, fontSize: "clamp(2rem, 4.4vw, 60px)", lineHeight: 1.06 }}>
              Events & Conferences
            </h2>
            <a href="#top" className="caption link-underline mt-6" style={{ color: "var(--bronze-hi)" }}>
              Explore All →
            </a>
          </div>

          {/* event cards */}
          {EVENTS.map((e, i) => (
            <article key={`e${i}`} className="flex h-[64vh] w-[360px] shrink-0 flex-col">
              <div className="h-[60%] w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={e.img} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="mt-5 flex items-center gap-4">
                <span className="caption px-3 py-1" style={{ border: "1px solid var(--line)", color: "var(--bronze)", fontSize: "0.55rem" }}>
                  {e.tag}
                </span>
                <span className="text-[12px]" style={{ color: "var(--ink-faint)" }}>
                  {e.date}
                </span>
              </div>
              <h3 className="display mt-4" style={{ fontSize: "22px", lineHeight: 1.3, color: "var(--ink)" }}>
                {e.title}
              </h3>
              <a href="#top" className="caption link-underline mt-4 self-start" style={{ color: "var(--bronze-hi)" }}>
                Learn More →
              </a>
            </article>
          ))}

          <div className="w-[10vw] shrink-0" />
        </div>
      </div>
    </section>
    <AwardPopup award={activeAward} onClose={() => setActiveAward(null)} />
    </>
  );
}
