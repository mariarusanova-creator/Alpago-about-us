"use client";

import BlurText from "@/components/BlurText";
import Reveal from "@/components/Reveal";
import MediaLayer from "@/components/MediaLayer";

type Panel = {
  n: string;
  title: string;
  body: string;
  tag: string;
  video?: string;
  image?: string;
  align: "left" | "right";
};

const PANELS: Panel[] = [
  {
    n: "01",
    title: "Casa del Sole",
    body: "The first signature villa — and the highest villa transaction ever recorded in the UAE at the time.",
    tag: "Record Transaction",
    image: "/media/img/DSC01948-em.jpg",
    align: "left",
  },
  {
    n: "02",
    title: "Kural Vista",
    body: "Named among the eighteen most beautiful homes in Dubai — architecture as a statement of restraint.",
    tag: "Recognised Design",
    video: "terrace",
    align: "right",
  },
  {
    n: "03",
    title: "Frond G — Billionaires&rsquo; Row",
    body: "Six signature beachfront villas developed on Palm Jumeirah, one of Dubai&rsquo;s most exclusive addresses.",
    tag: "The Enclave",
    video: "aerial2",
    align: "left",
  },
  {
    n: "04",
    title: "30–40% above market",
    body: "Sustained return on investment above the market average across our completed developments.",
    tag: "Enduring Value",
    image: "/media/img/DSC06377-HDR.jpg",
    align: "right",
  },
];

export default function Milestones() {
  return (
    <section id="milestones" className="relative">
      <div className="mx-auto max-w-[1440px] px-6 pt-[16vh] md:px-12">
        <Reveal>
          <span className="caption">Proof, not claim</span>
        </Reveal>
        <BlurText
          as="h2"
          className="display mt-6 max-w-3xl"
          brightness={6}
          children={"A record of firsts that redefined the ceiling of the market."}
        />
      </div>

      <div className="mt-[10vh]">
        {PANELS.map((p) => (
          <article
            key={p.n}
            className="relative flex min-h-[92vh] items-end overflow-hidden"
          >
            {p.video ? (
              <MediaLayer video={p.video} overlay={0.24} parallax={16} />
            ) : (
              <MediaLayer image={p.image} overlay={0.24} parallax={16} />
            )}

            {/* directional scrim for caption legibility over bright media */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  p.align === "right"
                    ? "linear-gradient(to top left, rgba(10,8,6,0.55), transparent 52%)"
                    : "linear-gradient(to top right, rgba(10,8,6,0.55), transparent 52%)",
              }}
            />

            <div className="relative mx-auto w-full max-w-[1440px] px-6 pb-[9vh] md:px-12">
              <div
                className={`max-w-xl ${
                  p.align === "right" ? "md:ml-auto md:text-right" : ""
                }`}
              >
                <Reveal>
                  <div
                    className="display mb-4 leading-none"
                    style={{
                      fontSize: "clamp(3rem, 7vw, 6rem)",
                      color: "var(--bronze)",
                      opacity: 0.85,
                    }}
                  >
                    {p.n}
                  </div>
                  <span className="caption" style={{ color: "var(--bronze-hi)" }}>
                    {p.tag}
                  </span>
                </Reveal>
                <BlurText
                  as="h3"
                  className="display mt-4"
                  brightness={10}
                  blur={10}
                  children={p.title.replace(/&rsquo;/g, "’")}
                />
                <Reveal delay={0.05}>
                  <p
                    className={`mt-5 text-[15px] leading-relaxed ${
                      p.align === "right" ? "md:ml-auto" : ""
                    }`}
                    style={{
                      maxWidth: "34ch",
                      color: "var(--ink-strong)",
                      textShadow: "0 1px 24px rgba(10,8,6,0.7)",
                    }}
                    dangerouslySetInnerHTML={{ __html: p.body }}
                  />
                </Reveal>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
