"use client";

import Reveal from "@/components/Reveal";
import BlurText from "@/components/BlurText";
import AwardPopup, { type AwardDetails } from "@/components/awards/AwardPopup";
import { useState } from "react";

type Award = AwardDetails;

const AWARDS: Award[] = [
  { tag: "Development", name: "RAED Ventures", caption: "Scape Global Forum — New Development Project" },
  { tag: "Design & Build", name: "Construction Week", caption: "Top 50 GCC Developers — Green Building" },
  { tag: "Properties", name: "HALA", caption: "LIV GOLF — Building Material & Infrastructure Award" },
  { tag: "Design & Build", name: "RAED Ventures", caption: "Cityscape Global Forum — Best New Development" },
  { tag: "Properties", name: "HALA", caption: "LIV GOLF — Building Material & Infrastructure Award" },
];

function Card({ award, onClick }: { award: Award; onClick: () => void }) {
  const { tag, name, caption } = award;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`View ${caption} award details`}
      className="ease-alpago flex w-[300px] shrink-0 cursor-pointer flex-col justify-between p-8 text-left outline-none transition-[border-color,background-color,transform] duration-500 hover:-translate-y-1 hover:border-[color:var(--bronze-hi)] focus-visible:border-[color:var(--bronze-hi)]"
      style={{ border: "1px solid var(--line)", minHeight: "220px", background: "rgba(236,227,213,0.02)" }}
    >
      <span className="caption" style={{ color: "var(--bronze)", fontSize: "0.6rem" }}>
        {tag}
      </span>
      <div className="display" style={{ fontSize: "clamp(1.2rem, 2vw, 26px)", letterSpacing: "0.04em", color: "var(--ink)" }}>
        {name}
      </div>
      <p className="text-[13px] leading-relaxed" style={{ color: "var(--ink-dim)" }}>
        {caption}
      </p>
    </button>
  );
}

export default function Awards() {
  const [activeAward, setActiveAward] = useState<Award | null>(null);
  const loop = [...AWARDS, ...AWARDS];
  return (
    <>
      <section id="awards" className="relative overflow-hidden py-[14vh]">
      <div className="mx-auto mb-[8vh] w-full max-w-[1560px] px-6 text-center md:px-14">
        <BlurText as="h2" className="display gold-head" blur={14} children={"Awards & Achievements"} />
      </div>

      <Reveal y={30} blur={8}>
        <div className="marquee relative w-full overflow-hidden">
          <div className="marquee-track flex gap-6 px-6">
            {loop.map((a, i) => (
              <Card key={i} award={a} onClick={() => setActiveAward(a)} />
            ))}
          </div>
          {/* edge fades — matched to the page gradient's outer stop */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24" style={{ background: "linear-gradient(to right, #150d07, transparent)" }} />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24" style={{ background: "linear-gradient(to left, #150d07, transparent)" }} />
        </div>
      </Reveal>
      </section>
      <AwardPopup award={activeAward} onClose={() => setActiveAward(null)} />
    </>
  );
}
