"use client";

import BlurText from "@/components/BlurText";
import Reveal from "@/components/Reveal";
import MediaLayer from "@/components/MediaLayer";

/** Centered manifesto over an aerial drone bed. */
export default function Manifesto() {
  return (
    <section id="manifesto" className="relative flex min-h-screen items-center overflow-hidden py-[18vh]">
      <MediaLayer video="aerial" overlay={0.4} parallax={22} />
      <div className="relative mx-auto max-w-[1100px] px-6 text-center md:px-12">
        <Reveal>
          <span className="caption">The Conviction</span>
        </Reveal>
        <BlurText
          as="h2"
          className="display mt-8"
          brightness={2}
          blur={16}
          children={"Markets evolve when someone is willing to challenge the conventions."}
        />
        <Reveal delay={0.1}>
          <p className="mx-auto mt-10 max-w-xl text-[15px] leading-relaxed text-ink-dim">
            Alpago has helped shape Dubai&rsquo;s ultra-prime residential
            landscape, consistently redefining the meaning of luxury living.
            Guided by the belief that exceptional residences should reflect
            individuality, architectural distinction and enduring value, we
            create homes that set new benchmarks for the market.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
