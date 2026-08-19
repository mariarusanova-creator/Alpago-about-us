"use client";

import Reveal from "@/components/Reveal";
import BlurText from "@/components/BlurText";

const SOFT: React.CSSProperties = {
  WebkitMaskImage: "radial-gradient(120% 120% at 50% 50%, #000 60%, transparent 100%)",
  maskImage: "radial-gradient(120% 120% at 50% 50%, #000 60%, transparent 100%)",
};

export default function PriorityStatement() {
  return (
    <section id="priority" className="relative overflow-hidden py-[18vh]">
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-14">
        {/* big statement — scroll-blur reveal, left aligned */}
        <BlurText
          as="h2"
          className="display"
          blur={16}
          brightness={20}
          children={
            "For Alpago, that priority has always been clear: doing what is right for the client before doing what is easy for the business."
          }
        />

        {/* centered image */}
        <Reveal className="mt-[12vh]" y={40} blur={12}>
          <div className="mx-auto aspect-[16/9] w-full max-w-[760px] overflow-hidden" style={SOFT}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/alp/dsc06371.jpg" alt="" className="h-full w-full object-cover" />
          </div>
        </Reveal>

        {/* caption, bottom-right */}
        <Reveal className="mt-12 flex justify-end" y={18} blur={5} delay={0.1}>
          <p
            className="max-w-[40ch] text-right"
            style={{
              color: "var(--ink-faint)",
              fontFamily: "var(--font-social), sans-serif",
              fontSize: "14.5px",
              lineHeight: 1.7,
            }}
          >
            That single principle shapes every conversation, every recommendation, and
            every decision we make.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
