"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { smoothstep, clamp } from "./kit";

/**
 * Our Culture — a pinned stage that WIPES IN over the preceding statement (bottom-up
 * mask, same as ActAwards), then scroll drives a VERTICAL track of big frosted cards
 * upward so they arrive one-by-one over a photographic backdrop that starts SHARP and
 * BLURS OUT as you move through. The completed rail then leaves normally into the
 * following statement. No shadows.
 */
const CARDS = [
  {
    tag: "01 Standards",
    name: "Careers Defined by Higher Standards",
    body: "Working at Alpago means becoming part of a culture where standards guide every decision. We value people who ask better questions, challenge accepted thinking, and pursue solutions beyond conventional expectations. Our culture is built on trust, accountability, curiosity, and an uncompromising commitment to doing what is right, not what is easiest.",
  },
  {
    tag: "02 Growth",
    name: "A Culture that Never Stops Learning",
    body: "The industries we operate in continue to evolve. Our people evolve with them. Learning at Alpago is not an occasional initiative. We encourage curiosity, continuous development, and the confidence to challenge established thinking in pursuit of better outcomes. Because the standard we set tomorrow should always exceed the one we set today.",
  },
  {
    tag: "03 Community",
    name: "Beyond the Workplace",
    body: "The relationships built at Alpago extend far beyond projects and professions. Throughout the year, our people come together through celebrations, team gatherings, cultural events, sporting activities, learning experiences, and shared milestones that strengthen the connections behind the work we do. These moments are not separate from our culture; they are part of it.",
  },
];

const BASE_FILTER = "saturate(0.88) brightness(0.72)";

export default function CareersCulture() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const reveal = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bgImg = useRef<HTMLImageElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  useLayoutEffect(() => {
    const sec = section.current;
    const stg = stage.current;
    const tr = track.current;
    const img = bgImg.current;
    if (!sec || !stg || !tr || !img) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const audit = new URLSearchParams(window.location.search).has("audit");
    const cards = cardRefs.current;

    // Scroll the final card fully past the top edge before this act gives way to
    // the next screen. The extra travel keeps it out of the cream transition.
    const maxY = () => Math.max(0, tr.scrollHeight - stg.clientHeight + stg.clientHeight * 0.72);
    const setEnter = (e: number) => {
      if (reveal.current) {
        const t = smoothstep(clamp(e));
        const r1 = t * 200 - 85; // opaque edge sweeps -85% → 115%
        // the mask %'s are relative to the STAGE box — if the transparent stop passes
        // the element's top edge (>100%) while the wipe is mid-flight, the element
        // boundary chops the half-faded image into a hard line. Clamp the feather to
        // the box until the opaque edge itself clears the top, then let it go.
        const r2 = r1 < 100 ? Math.min(r1 + 85, 100) : r1 + 85;
        reveal.current.style.setProperty("--r1", r1.toFixed(1) + "%");
        reveal.current.style.setProperty("--r2", r2.toFixed(1) + "%");
        reveal.current.style.visibility = e <= 0.001 ? "hidden" : "visible";
      }
      sec.style.pointerEvents = e > 0.55 ? "" : "none";
    };

    const revealCards = () => {
      const h = window.innerHeight;
      cards.forEach((c) => {
        if (!c) return;
        const top = c.getBoundingClientRect().top;
        const e = smoothstep(clamp((h * 0.9 - top) / (h * 0.36)));
        c.style.opacity = e.toFixed(3);
        c.style.transform = `translateY(${((1 - e) * 60).toFixed(1)}px)`;
      });
    };

    if (audit || reduce) {
      setEnter(1);
      img.style.filter = `blur(24px) ${BASE_FILTER}`;
      cards.forEach((c) => c && (c.style.opacity = "1"));
      return;
    }
    setEnter(0);
    img.style.filter = BASE_FILTER;

    const ctx = gsap.context(() => {
      // 1 — wipe IN over the pinned statement behind (bottom-up mask)
      ScrollTrigger.create({
        trigger: sec,
        start: "top bottom",
        end: "top top",
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => setEnter(self.progress),
        onRefresh: (self) => setEnter(self.progress),
      });

      // 2 — pin + vertical travel of the card track + backdrop blur-out
      ScrollTrigger.create({
        trigger: sec,
        start: "top top",
        end: () => "+=" + (maxY() + window.innerHeight * 1.5),
        pin: stg,
        pinType: "fixed",
        scrub: 0.6,
        invalidateOnRefresh: true,
        onRefresh: revealCards,
        onUpdate: (self) => {
          // Let the fully revealed photograph breathe before the cards begin.
          const p = clamp((self.progress - 0.2) / 0.76);
          tr.style.transform = `translateY(${(-maxY() * p).toFixed(1)}px)`;
          const b = smoothstep(clamp(p / 0.28)) * 30;
          img.style.filter = b > 0.1 ? `blur(${b.toFixed(1)}px) ${BASE_FILTER}` : BASE_FILTER;
          revealCards();

        },
      });
    }, sec);

    return () => ctx.revert();
  }, []);

  return (
    <section id="culture" ref={section} className="relative" style={{ marginTop: "-100vh" }}>
      <div
        ref={stage}
        className="nav-dark relative h-screen w-full overflow-hidden"
      >
        <div className="absolute inset-0">
          <div
            ref={reveal}
          className="absolute inset-0"
          style={
            {
              "--r1": "-85%",
              "--r2": "0%",
              WebkitMaskImage: "linear-gradient(to top, #000 var(--r1), rgba(0,0,0,0) var(--r2))",
              maskImage: "linear-gradient(to top, #000 var(--r1), rgba(0,0,0,0) var(--r2))",
            } as React.CSSProperties
          }
        >
          {/* fixed blurred backdrop */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={bgImg}
            src="/media/alp/careers-culture-team.png"
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover will-change-[filter]"
            style={{
              filter: BASE_FILTER,
              transform: "scale(1.08)",
              // the blur/will-change put the img on its own layer, so it escapes the
              // parent mask — mask it directly (inherits --r1/--r2) to feather it
              WebkitMaskImage: "linear-gradient(to top, #000 var(--r1), rgba(0,0,0,0) var(--r2))",
              maskImage: "linear-gradient(to top, #000 var(--r1), rgba(0,0,0,0) var(--r2))",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to bottom, rgba(10,8,6,0.28) 0%, rgba(10,8,6,0.12) 46%, rgba(10,8,6,0.38) 100%)",
              WebkitMaskImage: "linear-gradient(to top, #000 var(--r1), rgba(0,0,0,0) var(--r2))",
              maskImage: "linear-gradient(to top, #000 var(--r1), rgba(0,0,0,0) var(--r2))",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(90deg, rgba(8,7,6,0.66) 0%, rgba(8,7,6,0.2) 22%, rgba(8,7,6,0.02) 44%, rgba(8,7,6,0.02) 56%, rgba(8,7,6,0.2) 78%, rgba(8,7,6,0.66) 100%)",
              WebkitMaskImage: "linear-gradient(to top, #000 var(--r1), rgba(0,0,0,0) var(--r2))",
              maskImage: "linear-gradient(to top, #000 var(--r1), rgba(0,0,0,0) var(--r2))",
            }}
          />

          {/* vertical card track — travels up on scroll */}
          <div
            ref={track}
            className="over-img absolute inset-x-0 top-0 flex flex-col items-center gap-[10vh] px-6 pt-[112vh] pb-[24vh] will-change-transform"
          >
            {CARDS.map((c, i) => (
              <article
                key={c.name}
                ref={(el) => { cardRefs.current[i] = el; }}
                className="relative flex min-h-[58vh] w-full max-w-[560px] flex-col justify-between rounded-[20px] p-10 will-change-transform md:p-12"
                style={{
                  border: "1px solid rgba(236,227,213,0.16)",
                  background: "linear-gradient(165deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.025) 100%)",
                  backdropFilter: "blur(26px) saturate(115%)",
                  WebkitBackdropFilter: "blur(26px) saturate(115%)",
                }}
              >
                <div className="flex items-center">
                  <span className="caption" style={{ color: "var(--bronze-hi)", letterSpacing: "0.24em", fontSize: "0.72rem" }}>{c.tag}</span>
                </div>
                <div>
                  <h3 className="display" style={{ color: "var(--ink)", fontSize: "clamp(1.5rem, 3vw, 34px)", lineHeight: 1.2, letterSpacing: "-0.01em" }}>{c.name}</h3>
                  <p className="mt-6 text-[15px] leading-relaxed" style={{ color: "rgba(236,227,213,0.82)" }}>{c.body}</p>
                </div>
              </article>
            ))}
          </div>

          </div>
        </div>
      </div>
    </section>
  );
}
