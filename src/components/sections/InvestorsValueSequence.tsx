"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { GOLD, STATEMENT_TITLE, clamp, smoothstep } from "./about/kit";

const DEFAULT_INTRO_LINES = ["Value rooted", "in quality"];
const DEFAULT_INTRO_BODY =
  "Markets fluctuate. Trends evolve. Preferences change. But architecture of lasting significance, exceptional craftsmanship, and genuine rarity continue to command recognition across generations.";

export type ValueSequenceItem = {
  number: string;
  name: string;
  text: string;
};

const DEFAULT_ITEMS: ValueSequenceItem[] = [
  {
    number: "01",
    name: "Alpago Properties",
    text: "Through Alpago Properties, residences are conceived with a level of architectural ambition, craftsmanship, and execution that positions them among the most sought-after addresses in their market.",
  },
  {
    number: "02",
    name: "Alpago Design & Build",
    text: "Through Alpago Design & Build, privately owned residences are transformed through uncompromising design and construction, often redefining the benchmark for quality within their communities. The result is not simply a better home, but a more valuable one.",
  },
  {
    number: "03",
    name: "F1rst Motors",
    text: "Limited production, provenance, engineering significance, and cultural relevance have established many collector automobiles as enduring assets that continue to command global demand. F1rst Motors curates vehicles selected not simply for rarity, but for their lasting significance within automotive history.",
  },
];

const CARD_ASSETS = [
  {
    image: "/media/alp/palmflower-facade.jpg",
    alt: "An Alpago Properties residence",
    href: "/businesses/alpago-properties",
    position: "50% 50%",
  },
  {
    image: "/media/alp/dsc09291.jpg",
    alt: "Alpago Design and Build craftsmanship",
    href: "/businesses/alpago-design-build",
    position: "51% 50%",
  },
  {
    image: "/media/alp/about-firstmotors.jpg",
    alt: "A rare automobile curated by F1rst Motors",
    href: "/businesses/f1rst-motors",
    position: "50% 50%",
  },
];

const IMAGE_MASK: React.CSSProperties = {
  WebkitMaskImage:
    "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.08) 8%, rgba(0,0,0,0.5) 20%, #000 38%, #000 100%), linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.1) 8%, rgba(0,0,0,0.62) 20%, #000 34%, #000 100%)",
  maskImage:
    "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.08) 8%, rgba(0,0,0,0.5) 20%, #000 38%, #000 100%), linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.1) 8%, rgba(0,0,0,0.62) 20%, #000 34%, #000 100%)",
  WebkitMaskComposite: "source-in",
  maskComposite: "intersect",
};

export default function InvestorsValueSequence({
  id = "investment-value",
  label = "Investment Value",
  introLines = DEFAULT_INTRO_LINES,
  introBody = DEFAULT_INTRO_BODY,
  items = DEFAULT_ITEMS,
}: {
  id?: string;
  label?: string;
  introLines?: string[];
  introBody?: string;
  items?: ValueSequenceItem[];
  imageSrc?: string;
  imageAlt?: string;
  compactLayout?: boolean;
  imageObjectPosition?: string;
  imageTop?: string;
  imageHeight?: string;
}) {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLElement | null)[]>([]);

  useLayoutEffect(() => {
    const sec = section.current;
    const stg = stage.current;
    const introEl = intro.current;
    const cardEls = cards.current.filter(Boolean) as HTMLElement[];
    if (!sec || !stg || !introEl || !cardEls.length) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const audit = new URLSearchParams(window.location.search).has("audit");
    const introChars = Array.from(introEl.querySelectorAll<HTMLElement>(".iv-intro-char"));
    const introWords = Array.from(introEl.querySelectorAll<HTMLElement>(".iv-intro-word"));

    const apply = (rawProgress: number) => {
      const progress = clamp(rawProgress);
      const introReveal = clamp(progress / 0.14);

      introChars.forEach((char, index) => {
        const start = (index / Math.max(1, introChars.length - 1)) * 0.58;
        const amount = smoothstep(clamp((introReveal - start) / 0.42));
        char.style.opacity = amount.toFixed(3);
        char.style.filter = `blur(${((1 - amount) * 12).toFixed(2)}px)`;
      });

      const bodyReveal = clamp((progress - 0.12) / 0.16);
      introWords.forEach((word, index) => {
        const start = (index / Math.max(1, introWords.length - 1)) * 0.55;
        const amount = smoothstep(clamp((bodyReveal - start) / 0.45));
        word.style.opacity = amount.toFixed(3);
        word.style.filter = `blur(${((1 - amount) * 8).toFixed(2)}px)`;
        word.style.transform = `translate3d(0, ${((1 - amount) * 10).toFixed(2)}px, 0)`;
      });

      const introOut = smoothstep(clamp((progress - 0.35) / 0.07));
      introEl.style.opacity = (1 - introOut).toFixed(3);
      introEl.style.transform = `translate3d(-50%, calc(-50% - ${(introOut * 18).toFixed(2)}px), 0)`;
      introEl.style.visibility = introOut > 0.999 ? "hidden" : "visible";

      // The reference uses three full-height cards that travel upward one after
      // another. Each later card covers the previous one while its content settles
      // through the same soft blur/fade language used throughout Alpago.
      const cardTravel = clamp((progress - 0.42) / 0.53) * items.length;
      cardEls.forEach((card, index) => {
        const local = cardTravel - index;
        const enter = smoothstep(clamp(local / 0.46));
        card.style.visibility = local > 0.001 ? "visible" : "hidden";
        card.style.transform = `translate3d(0, ${((1 - enter) * 100).toFixed(3)}vh, 0)`;

        const contentReveal = smoothstep(clamp((local - 0.14) / 0.36));
        const content = card.querySelector<HTMLElement>(".iv-card-content");
        const image = card.querySelector<HTMLElement>(".iv-card-image");
        const footer = card.querySelector<HTMLElement>(".iv-card-footer");
        if (content) {
          content.style.opacity = contentReveal.toFixed(3);
          content.style.filter = `blur(${((1 - contentReveal) * 10).toFixed(2)}px)`;
          content.style.transform = `translate3d(0, ${((1 - contentReveal) * 22).toFixed(2)}px, 0)`;
        }
        if (image) {
          image.style.opacity = contentReveal.toFixed(3);
          image.style.filter = `blur(${((1 - contentReveal) * 9).toFixed(2)}px)`;
          image.style.transform = `scale(${(1.075 - contentReveal * 0.075).toFixed(4)})`;
        }
        if (footer) {
          const footerReveal = smoothstep(clamp((local - 0.28) / 0.32));
          footer.style.opacity = footerReveal.toFixed(3);
          footer.style.transform = `translate3d(0, ${((1 - footerReveal) * 12).toFixed(2)}px, 0)`;
        }
      });

      stg.style.opacity = smoothstep(clamp(progress / 0.035)).toFixed(3);
    };

    if (reduce || audit) {
      apply(0.54);
      return;
    }

    apply(0);
    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sec,
        start: "top top",
        end: "+=650%",
        pin: stg,
        pinType: "fixed",
        scrub: 0.9,
        invalidateOnRefresh: true,
        onUpdate: (self) => apply(self.progress),
        onRefresh: (self) => apply(self.progress),
      });
    }, sec);

    return () => context.revert();
  }, [introBody, introLines, items]);

  return (
    <section id={id} ref={section} className="relative" style={{ marginTop: "-100vh" }}>
      <div ref={stage} className="section-bg relative h-screen w-full overflow-hidden opacity-0">
        <div
          ref={intro}
          className="absolute left-1/2 top-1/2 z-10 flex w-[min(760px,88vw)] flex-col items-center text-center will-change-[transform,opacity]"
          style={{ transform: "translate3d(-50%, -50%, 0)" }}
        >
          <span className="caption mb-5" style={{ color: "var(--bronze)", letterSpacing: "0.22em" }}>
            {label}
          </span>
          <div className="display" style={STATEMENT_TITLE}>
            {introLines.map((line) => (
              <div key={line} style={{ paddingBottom: "0.06em" }}>
                {Array.from(line).map((char, index) => (
                  <span key={index} className="iv-intro-char" style={GOLD}>{char}</span>
                ))}
              </div>
            ))}
          </div>
          <p
            className="mt-8 max-w-[58ch]"
            style={{ color: "var(--ink-dim)", fontFamily: "var(--font-social), sans-serif", fontSize: "clamp(14px,1.2vw,17px)", lineHeight: 1.75 }}
          >
            {introBody.split(" ").map((word, index, words) => (
              <span key={index} className="iv-intro-word inline-block whitespace-pre">
                {word}{index < words.length - 1 ? " " : ""}
              </span>
            ))}
          </p>
        </div>

        {items.map((business, index) => {
          const asset = CARD_ASSETS[index] ?? CARD_ASSETS[0];
          return (
            <article
              key={business.number}
              ref={(element) => { cards.current[index] = element; }}
              className="section-bg absolute inset-0 invisible will-change-transform"
              style={{ zIndex: 20 + index, transform: "translate3d(0,100vh,0)" }}
            >
              <div className="mx-auto h-full w-full max-w-[1560px] px-6 md:px-14">
                <div
                  className="iv-card-content absolute left-6 top-[18%] w-[min(44vw,590px)] max-md:right-6 max-md:top-[13%] max-md:w-auto md:left-14"
                  style={{ opacity: 0, willChange: "transform,opacity,filter" }}
                >
                  <h3
                    className="display"
                    style={{ ...GOLD, display: "block", whiteSpace: "normal", fontSize: "clamp(2rem,4.2vw,54px)", lineHeight: 1.08, letterSpacing: "-0.025em", paddingBottom: "0.1em" }}
                  >
                    {business.name}
                  </h3>
                  <p
                    className="mt-7 max-w-[46ch]"
                    style={{ color: "var(--ink-dim)", fontFamily: "var(--font-social), sans-serif", fontSize: "clamp(14px,1.14vw,16.5px)", lineHeight: 1.74 }}
                  >
                    {business.text}
                  </p>
                  <Link
                    href={asset.href}
                    className="caption mt-7 inline-flex items-center justify-center px-10 py-4 transition-colors duration-300"
                    style={{ background: "var(--ink)", color: "var(--btn-ink, #1c150e)", letterSpacing: "0.15em" }}
                    onMouseEnter={(event) => {
                      event.currentTarget.style.background = "#876540";
                      event.currentTarget.style.color = "#f1eadf";
                    }}
                    onMouseLeave={(event) => {
                      event.currentTarget.style.background = "var(--ink)";
                      event.currentTarget.style.color = "var(--btn-ink, #1c150e)";
                    }}
                  >
                    Explore
                  </Link>
                </div>

                <div
                  className="absolute bottom-0 right-0 top-0 w-[58vw] overflow-hidden max-md:left-[28%] max-md:w-[72%]"
                  style={IMAGE_MASK}
                >
                  <div className="iv-card-image h-full w-full origin-center" style={{ opacity: 0, willChange: "transform,opacity,filter" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={asset.image} alt={asset.alt} className="h-full w-full object-cover" style={{ objectPosition: asset.position, filter: "saturate(0.76) contrast(0.98)" }} />
                    <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(224,220,209,0.08), rgba(66,48,31,0.12))" }} />
                  </div>
                </div>

                <div
                  className="iv-card-footer absolute bottom-[8%] left-6 right-[calc(72%+20px)] border-b pb-7 md:left-14 md:right-[calc(58vw+28px)]"
                  style={{ borderColor: "var(--line)", opacity: 0, willChange: "transform,opacity" }}
                >
                  <span className="display text-[18px]" style={{ color: "var(--bronze-lo)" }}>{business.number}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
