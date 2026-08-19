"use client";

import Reveal from "@/components/Reveal";
import BlurText from "@/components/BlurText";
import MediaLayer from "@/components/MediaLayer";

/** Centered statement over an aerial bed — same treatment as the homepage Manifesto. */
export default function Transparency() {
  return (
    <section id="transparency" className="over-img relative flex min-h-screen items-center overflow-hidden py-[18vh]">
      <MediaLayer video="aerial" overlay={0.52} parallax={22} />
      <div className="relative mx-auto max-w-[1000px] px-6 text-center md:px-12">
        <Reveal y={14} blur={4}>
          <span className="caption">Our Principle</span>
        </Reveal>
        <BlurText
          as="h2"
          className="display mt-8"
          brightness={2}
          blur={16}
          children={"Transparency Without Exception"}
        />
        <Reveal delay={0.1} y={20} blur={6}>
          <p
            className="mx-auto mt-10 max-w-2xl"
            style={{
              color: "var(--ink-strong)",
              fontFamily: "var(--font-social), sans-serif",
              fontSize: "16px",
              lineHeight: 1.85,
            }}
          >
            Transparency is not something we provide when it is convenient. It is the
            foundation of every relationship we build. From the first conversation to the
            final handover, every decision is explained and every challenge is communicated
            with honesty. We believe our clients should never be left to interpret what is
            happening, or why. We give them clarity through transparency.
          </p>
        </Reveal>
      </div>

      {/* vertical scroll indicator (wireframe detail) */}
      <div className="absolute right-8 top-1/2 hidden h-24 w-px -translate-y-1/2 md:block" style={{ background: "var(--line-strong)" }}>
        <span className="absolute left-0 top-0 block h-8 w-full" style={{ background: "var(--bronze)" }} />
      </div>
    </section>
  );
}
