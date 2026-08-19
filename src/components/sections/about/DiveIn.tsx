"use client";

import Reveal from "@/components/Reveal";
import BlurText from "@/components/BlurText";

const SOFT: React.CSSProperties = {
  WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)",
  maskImage: "linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)",
};

const IMAGES = [
  { src: "/media/alp/pool-dusk.jpg", span: "md:col-span-4", ratio: "aspect-[3/4]", up: "" },
  { src: "/media/alp/dsc07985.jpg", span: "md:col-span-4", ratio: "aspect-[3/4]", up: "md:-mt-[8vh]" },
  { src: "/media/alp/palmflower-facade.jpg", span: "md:col-span-4", ratio: "aspect-[3/4]", up: "md:mt-[6vh]" },
];

export default function DiveIn() {
  return (
    <section id="gallery" className="relative overflow-hidden py-[16vh]">
      <div className="mx-auto w-full max-w-[1560px] px-6 md:px-14">
        <div className="mx-auto max-w-[820px] text-center">
          <BlurText
            as="h2"
            className="display gold-head"
            blur={14}
            children={"Dive Into the Full Alpago Experience"}
          />
          <Reveal y={18} blur={5} delay={0.08}>
            <p
              className="mx-auto mt-8 max-w-[54ch]"
              style={{
                color: "var(--ink-dim)",
                fontFamily: "var(--font-social), sans-serif",
                fontSize: "16px",
                lineHeight: 1.8,
              }}
            >
              From the first sketch to the final handover, every Alpago project is a study
              in restraint and rarity. Step inside the world we build.
            </p>
          </Reveal>
        </div>

        <div className="mt-[12vh] grid grid-cols-1 gap-8 md:grid-cols-12">
          {IMAGES.map((im, i) => (
            <Reveal key={i} className={`${im.span} ${im.up}`} y={44} blur={11} delay={i * 0.1}>
              <div className={`${im.ratio} w-full overflow-hidden`} style={SOFT}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={im.src} alt="" className="h-full w-full object-cover" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
