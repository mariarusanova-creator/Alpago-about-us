"use client";

import Reveal from "@/components/Reveal";
import BlurText from "@/components/BlurText";

// soft feathered edges so images melt into the background (matches Overview language)
const SOFT: React.CSSProperties = {
  WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)",
  maskImage: "linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)",
};

export default function ExperienceDifference() {
  return (
    <section id="experience" className="relative overflow-hidden py-[16vh]">
      <div className="mx-auto w-full max-w-[1560px] px-6 md:px-14">
        {/* heading left, paragraph right */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-24">
          <BlurText
            as="h2"
            className="display gold-head"
            blur={14}
            children={"The Experience is the Difference"}
          />
          <Reveal y={22} blur={6}>
            <p
              className="max-w-[52ch] md:pt-2"
              style={{
                color: "var(--ink-dim)",
                fontFamily: "var(--font-social), sans-serif",
                fontSize: "16.5px",
                lineHeight: 1.8,
              }}
            >
              The difference in working with Alpago is not defined by the properties we
              develop, the spaces we shape, or the automobiles we curate. It is defined by
              the experience of working with a group whose priorities are fundamentally
              different. We believe that exceptional work can only come from exceptional
              intent — and intent is revealed not in what a company says, but in what it
              chooses to prioritise.
            </p>
          </Reveal>
        </div>

        {/* staggered image blocks — one upper-left, one lower-right */}
        <div className="relative mt-[10vh] grid grid-cols-1 gap-y-8 md:mt-[14vh] md:grid-cols-12">
          <Reveal className="md:col-span-7" y={40} blur={10}>
            <div className="aspect-[16/10] w-full overflow-hidden" style={SOFT}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/media/alp/dsc09042.jpg" alt="" className="h-full w-full object-cover" />
            </div>
          </Reveal>
          <div className="md:col-span-1" />
          <Reveal className="md:col-span-4 md:mt-[16vh]" y={40} blur={10} delay={0.12}>
            <div className="aspect-[3/4] w-full overflow-hidden" style={SOFT}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/media/alp/poolside-24-portrait.jpg" alt="" className="h-full w-full object-cover" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
