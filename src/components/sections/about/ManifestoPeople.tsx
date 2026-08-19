"use client";

import Reveal from "@/components/Reveal";

const SOFT: React.CSSProperties = {
  WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 14%, #000 86%, transparent 100%)",
  maskImage: "linear-gradient(to bottom, transparent 0%, #000 14%, #000 86%, transparent 100%)",
};

const GOLD: React.CSSProperties = {
  backgroundImage: "linear-gradient(180deg, var(--gold-1) 0%, var(--gold-2) 48%, var(--gold-3) 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
};

export default function ManifestoPeople() {
  return (
    <section id="manifesto" className="relative overflow-hidden py-[16vh]">
      <div className="mx-auto grid w-full max-w-[1560px] grid-cols-1 gap-16 px-6 md:grid-cols-2 md:gap-24 md:px-14">
        {/* The Manifesto */}
        <Reveal y={30} blur={8}>
          <div>
            <div className="aspect-[16/10] w-full overflow-hidden" style={SOFT}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/media/alp/dsc00434.jpg" alt="" className="h-full w-full object-cover" />
            </div>
            <h3 className="display mt-10" style={{ ...GOLD, fontSize: "clamp(1.8rem, 3.4vw, 44px)" }}>
              The Manifesto
            </h3>
            <p
              className="mt-5 max-w-[44ch]"
              style={{
                color: "var(--ink-dim)",
                fontFamily: "var(--font-social), sans-serif",
                fontSize: "16px",
                lineHeight: 1.8,
              }}
            >
              The beliefs that guide every project we take on — a written commitment to
              craft, restraint and the pursuit of what endures long after completion.
            </p>
            <a
              href="#top"
              className="caption mt-8 inline-block px-9 py-4 transition-colors duration-300"
              style={{ background: "var(--ink)", color: "var(--btn-ink, #1c150e)", letterSpacing: "0.14em" }}
            >
              Learn More
            </a>
          </div>
        </Reveal>

        {/* People Behind Alpago */}
        <Reveal y={30} blur={8} delay={0.12}>
          <div className="flex h-full flex-col justify-center">
            <h3 className="display" style={{ ...GOLD, fontSize: "clamp(2rem, 4.4vw, 60px)", lineHeight: 1.08 }}>
              People Behind Alpago
            </h3>
            <p
              className="mt-6 max-w-[42ch]"
              style={{
                color: "var(--ink-dim)",
                fontFamily: "var(--font-social), sans-serif",
                fontSize: "16px",
                lineHeight: 1.8,
              }}
            >
              A multidisciplinary team of developers, architects and craftspeople united
              by a single conviction — that excellence is a matter of who, not just what.
            </p>
            <a href="#top" className="caption link-underline mt-8 inline-block" style={{ color: "var(--bronze-hi)" }}>
              Meet the team →
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
