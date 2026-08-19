"use client";

import BlurText from "@/components/BlurText";
import Reveal from "@/components/Reveal";
import MediaLayer from "@/components/MediaLayer";

export default function Explore() {
  return (
    <section
      id="explore"
      className="relative flex min-h-screen items-center justify-center overflow-hidden py-[16vh]"
    >
      <MediaLayer video="terrace" overlay={0.44} parallax={16} />
      <div className="relative mx-auto max-w-[900px] px-6 text-center">
        <Reveal>
          <span className="caption">Now</span>
        </Reveal>
        <BlurText
          as="h2"
          className="display mt-6"
          brightness={4}
          children={"Explore the properties where quality speaks for itself."}
        />
        <Reveal delay={0.15}>
          <a
            href="#top"
            className="group mt-12 inline-flex items-center gap-3 border px-8 py-4 text-[13px] tracking-[0.18em] uppercase transition-colors duration-500"
            style={{ borderColor: "var(--line-strong)", color: "var(--ink)" }}
          >
            <span>Visit Website</span>
            <span
              className="transition-transform duration-500 group-hover:translate-x-1"
              style={{ color: "var(--bronze)" }}
            >
              →
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
