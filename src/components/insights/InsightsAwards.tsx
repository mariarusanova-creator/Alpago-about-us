"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { clamp, smoothstep } from "@/components/sections/about/kit";
import SiteFooter from "@/components/sections/SiteFooter";
import AwardPopup, { type AwardDetails } from "@/components/awards/AwardPopup";

type Award = AwardDetails;
const CURRENT: Award[] = [
  { tag: "Development", name: "RAED Ventures", caption: "Cityscape Global Forum — New Development Project" },
  { tag: "Design & Build", name: "Construction Week", caption: "Top 50 GCC Developers — Green Building" },
  { tag: "Properties", name: "HALA", caption: "LIV GOLF — Infrastructure Award" },
  { tag: "Design & Build", name: "RAED Ventures", caption: "Cityscape Global Forum — Best New Development" },
  { tag: "Properties", name: "HALA", caption: "LIV GOLF — Building Material Award" },
];
const GOLD: React.CSSProperties = { backgroundImage: "linear-gradient(180deg,var(--gold-1),var(--gold-2) 48%,var(--gold-3))", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" };
const BG_SCALE = 1.12;

function Composition({ title, awards, image, compositionRef, trackRef, backgroundRef, onAwardClick, masked = false }: { title: string; awards: Award[]; image: string; compositionRef: React.RefObject<HTMLDivElement | null>; trackRef: React.RefObject<HTMLDivElement | null>; backgroundRef: React.RefObject<HTMLDivElement | null>; onAwardClick: (award: Award) => void; masked?: boolean }) {
  return (
    <div ref={compositionRef} className="absolute inset-0 will-change-[opacity,filter]" style={masked ? ({ "--entry-r": "-22%", WebkitMaskImage: "linear-gradient(to top,#000 var(--entry-r),rgba(0,0,0,0) calc(var(--entry-r) + 22%))", maskImage: "linear-gradient(to top,#000 var(--entry-r),rgba(0,0,0,0) calc(var(--entry-r) + 22%))" } as React.CSSProperties) : undefined}>
      <div ref={backgroundRef} className="absolute inset-0 will-change-transform" style={{ transform: `scale(${BG_SCALE})` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="" className="h-full w-full object-cover" style={{ objectPosition: "50% 52%", filter: "brightness(.8) saturate(.88)" }} />
      </div>
      <div className="absolute inset-0" style={{ background: "linear-gradient(90deg,rgba(10,8,6,.66),rgba(10,8,6,.44) 42%,rgba(10,8,6,.3)),linear-gradient(180deg,rgba(10,8,6,.36),transparent 22%,transparent 74%,rgba(10,8,6,.38))" }} />
      <div ref={trackRef} className="over-img absolute inset-y-0 left-0 flex h-full w-max items-center gap-8 px-6 will-change-transform md:gap-14 md:px-14">
        <div className="flex w-[70vw] max-w-[500px] shrink-0 flex-col justify-center"><h2 className="display pb-[.1em] text-[clamp(2rem,4.2vw,54px)] leading-[1.1]" style={{ ...GOLD, filter: "drop-shadow(0 2px 16px rgba(10,8,6,.55))" }}>{title}</h2></div>
        {awards.map((award, index) => (
          <div key={`${title}-${award.name}-${index}`} className="shrink-0">
            <div className="mb-4 flex items-baseline gap-4"><span className="caption text-[.82rem] text-white">0{index + 1}</span><span className="caption text-[.82rem] text-white">{award.tag}</span></div>
            <button type="button" onClick={() => onAwardClick(award)} aria-label={`View ${award.caption} award details`} className="ease-alpago flex h-[46vh] w-[300px] cursor-pointer flex-col justify-between rounded-[3px] p-8 text-left outline-none transition-[border-color,background-color,transform] duration-500 hover:-translate-y-1 focus-visible:border-[color:var(--bronze-hi)] md:w-[330px]" style={{ border: "1px solid rgba(236,227,213,.16)", background: "linear-gradient(165deg,rgba(255,255,255,.09),rgba(255,255,255,.02))", backdropFilter: "blur(22px) saturate(112%)", WebkitBackdropFilter: "blur(22px) saturate(112%)", boxShadow: "inset 0 1px rgba(255,255,255,.08),0 20px 55px rgba(10,8,6,.3)" }}><div className="display text-[24px] leading-[1.3] tracking-[.03em] text-[color:var(--ink)]">{award.name}</div><p className="text-[13.5px] leading-[1.65] text-white/75">{award.caption}</p></button>
          </div>
        ))}
        <div className="w-[10vw] shrink-0" />
      </div>
    </div>
  );
}

export default function InsightsAwards() {
  const [activeAward, setActiveAward] = useState<Award | null>(null);
  const section = useRef<HTMLElement>(null), stage = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLDivElement>(null);
  const firstTrack = useRef<HTMLDivElement>(null);
  const firstBg = useRef<HTMLDivElement>(null);
  const footer = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const sec = section.current, stg = stage.current, a = first.current, at = firstTrack.current, ab = firstBg.current, ft = footer.current;
    if (!sec || !stg || !a || !at || !ab || !ft) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const maxX = (track: HTMLDivElement) => Math.max(0, track.scrollWidth - stg.clientWidth);
    const firstBase = () => maxX(at) + window.innerHeight * 1.45;
    const fade = () => window.innerHeight * .8;
    const beigeHold = () => window.innerHeight * .24;
    const footerFade = () => window.innerHeight * .8;
    const footerHold = () => window.innerHeight * .35;
    const total = () => firstBase() + fade() + beigeHold() + footerFade() + footerHold();
    const setEntry = (raw: number) => a.style.setProperty("--entry-r", `${(smoothstep(clamp(raw)) * 122 - 22).toFixed(2)}%`);
    const setFooter = (raw: number) => {
      const progress = smoothstep(clamp(raw));
      ft.style.opacity = progress.toFixed(3);
      ft.style.transform = `translateY(${((1 - progress) * 24).toFixed(1)}px)`;
      ft.style.pointerEvents = progress > .98 ? "auto" : "none";
    };
    if (reduce) { setEntry(1); setFooter(0); return; }
    setEntry(0);
    setFooter(0);

    const context = gsap.context(() => {
      ScrollTrigger.create({ trigger: sec, start: "top bottom", end: "top top", scrub: .6, invalidateOnRefresh: true, onUpdate: self => setEntry(self.progress), onRefresh: self => setEntry(self.progress) });
      ScrollTrigger.create({
        trigger: sec, start: "top top", end: () => `+=${total()}`, pin: stg, pinType: "fixed", scrub: .6, invalidateOnRefresh: true,
        onUpdate: self => {
          const d = self.progress * (self.end - self.start);
          setEntry(1);
          const p1 = clamp((d / firstBase() - .12) / .72);
          at.style.transform = `translateX(${(-maxX(at) * p1).toFixed(1)}px)`;
          ab.style.transform = `translateX(${(-(((BG_SCALE - 1) / 2) * stg.clientWidth) * p1).toFixed(1)}px) scale(${BG_SCALE})`;
          const firstOut = 1 - smoothstep(clamp((d - firstBase()) / fade()));
          a.style.opacity = firstOut.toFixed(3); a.style.filter = `blur(${((1 - firstOut) * 5).toFixed(2)}px)`;

          const footerIn = (d - firstBase() - fade() - beigeHold()) / footerFade();
          setFooter(footerIn);

          stg.dataset.navoff = firstOut > .48 ? "0" : "1";
        },
      });
    }, sec);
    return () => context.revert();
  }, []);

  return (
    <>
    <section id="awards" ref={section} className="relative z-10 h-screen">
      <div ref={stage} data-navoff="1" className="nav-dark relative h-screen w-full overflow-hidden" style={{ background: "#e0dcd1" }}>
        <Composition title="Awards & Achievements" awards={CURRENT} image="/media/alp/dsc09291.jpg" compositionRef={first} trackRef={firstTrack} backgroundRef={firstBg} onAwardClick={setActiveAward} masked />
        <div
          ref={footer}
          className="absolute inset-0 z-20 overflow-y-auto will-change-[opacity,transform]"
          style={{ background: "#e0dcd1", opacity: 0, pointerEvents: "none", transform: "translateY(24px)" }}
        >
          <SiteFooter showCta={false} />
        </div>
      </div>
    </section>
    <AwardPopup award={activeAward} onClose={() => setActiveAward(null)} />
    </>
  );
}
