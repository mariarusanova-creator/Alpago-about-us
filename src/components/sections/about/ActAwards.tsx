"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { smoothstep, clamp } from "./kit";
import AwardPopup, { type AwardDetails } from "@/components/awards/AwardPopup";

/**
 * Awards & Achievements — a pinned HORIZONTAL rail riding over a full-bleed
 * photograph. The act ENTERS by being uncovered from below, matching the way
 * this act later uncovers the closing experience screen, then scroll drives the card track sideways
 * while the backdrop drifts more slowly behind it for depth. The backdrop's drift
 * is clamped to its own overscan so it never exposes empty space at the edge.
 * Cards are quiet frosted-glass frames over the image.
 */
const AWARDS: AwardDetails[] = [
  { tag: "Development", name: "RAED Ventures", caption: "Scape Global Forum — New Development Project" },
  { tag: "Design & Build", name: "Construction Week", caption: "Top 50 GCC Developers — Green Building" },
  { tag: "Properties", name: "HALA", caption: "LIV GOLF — Infrastructure Award" },
  { tag: "Design & Build", name: "RAED Ventures", caption: "Cityscape Global Forum — Best New Development" },
  { tag: "Properties", name: "HALA", caption: "LIV GOLF — Infrastructure Award" },
];

// how much the backdrop is overscanned; its drift is clamped to this slack
const BG_SCALE = 1.12;

// gold gradient that WRAPS normally (kit.GOLD is single-line only — it was
// clipping "Awards & Achievements" against the stage's overflow-hidden)
const GOLD_WRAP: React.CSSProperties = {
  backgroundImage: "linear-gradient(180deg, var(--gold-1) 0%, var(--gold-2) 48%, var(--gold-3) 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
};

export default function ActAwards() {
  const [activeAward, setActiveAward] = useState<AwardDetails | null>(null);
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const reveal = useRef<HTMLDivElement>(null);
  const beigeBase = useRef<HTMLDivElement>(null);
  const composition = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bg = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const sec = section.current;
    const stg = stage.current;
    const tr = track.current;
    if (!sec || !stg || !tr) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const audit = new URLSearchParams(window.location.search).has("audit");

    const maxX = () => Math.max(0, tr.scrollWidth - stg.clientWidth);
    // Preserve every existing phase through the horizontal Awards sequence,
    // then append a deliberately slower closing transition. Keeping these
    // distances separate means the approved Doing → Awards entry is untouched.
    const baseDistance = () => maxX() + window.innerHeight * 1.45;
    const exitFadeDistance = () => window.innerHeight * 0.8;
    const beigeHoldDistance = () => window.innerHeight * 0.38;
    const galleryFadeDistance = () => window.innerHeight * 0.8;
    // Gallery is the destination of this act, but it must not sit behind the
    // transparent entry mask. Until Awards has completed, the preceding standards
    // screen is the only thing allowed to show through that mask.
    const setGalleryVisible = (visible: boolean) => {
      const gallery = document.getElementById("gallery");
      if (gallery) gallery.style.visibility = visible ? "visible" : "hidden";
    };
    const setGalleryFade = (raw: number) => {
      const fade = smoothstep(clamp(raw));
      const gallery = document.getElementById("gallery");
      const galleryComposition = gallery?.querySelector<HTMLElement>("[data-gallery-composition]");
      if (galleryComposition) {
        galleryComposition.style.opacity = fade.toFixed(3);
        galleryComposition.style.filter = `blur(${((1 - fade) * 5).toFixed(2)}px)`;
      }
      if (gallery) gallery.dataset.navoff = fade > 0.48 ? "0" : "1";
      // During the pinned frame the page-matched beige layer fades away to
      // reveal the already-aligned Gallery underneath.
      if (beigeBase.current) beigeBase.current.style.opacity = (1 - fade).toFixed(3);
    };
    const setEntryReveal = (raw: number) => {
      const revealProgress = smoothstep(clamp(raw));
      if (composition.current) {
        composition.current.style.setProperty(
          "--entry-r",
          `${(revealProgress * 122 - 22).toFixed(2)}%`
        );
      }
    };
    const setCompositionFade = (raw: number) => {
      const fade = smoothstep(clamp(raw));
      if (composition.current) {
        composition.current.style.opacity = fade.toFixed(3);
        composition.current.style.filter = `blur(${((1 - fade) * 5).toFixed(2)}px)`;
      }
      stg.dataset.navoff = fade > 0.48 ? "0" : "1";
    };

    if (audit || reduce) {
      setGalleryVisible(true);
      setEntryReveal(1);
      setCompositionFade(1);
      setGalleryFade(1);
      return;
    }

    setGalleryVisible(false);
    setEntryReveal(0);
    setCompositionFade(1);
    setGalleryFade(0);

    const ctx = gsap.context(() => {
      // The Awards photograph enters while its section moves into the viewport.
      // This lets the complete Alpago World panel grid scroll away naturally,
      // including its beige foot, before the image rises through the soft mask.
      ScrollTrigger.create({
        trigger: sec,
        start: "top bottom",
        end: "top top",
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => setEntryReveal(self.progress),
        onRefresh: (self) => setEntryReveal(self.progress),
      });

      // The incoming stage is plain beige while it reaches the viewport. Once
      // pinned, the Awards composition fades into that same stationary beige
      // frame; only after the fade has formed does the horizontal rail travel.
      ScrollTrigger.create({
        trigger: sec,
        start: "top top",
        end: () =>
          "+=" +
          (baseDistance() +
            exitFadeDistance() +
            beigeHoldDistance() +
            galleryFadeDistance()),
        pin: stg,
        pinType: "fixed",
        scrub: 0.6,
        invalidateOnRefresh: true,
        onRefresh: (self) => {
          const distance = self.progress * (self.end - self.start);
          const exitFade =
            1 -
            smoothstep(
              clamp((distance - baseDistance()) / exitFadeDistance())
            );
          const galleryFade = clamp(
            (distance -
              baseDistance() -
              exitFadeDistance() -
              beigeHoldDistance()) /
              galleryFadeDistance()
          );
          setCompositionFade(exitFade);
          setGalleryVisible(galleryFade > 0.001);
          setGalleryFade(galleryFade);
        },
        onEnter: () => setGalleryVisible(false),
        onLeave: () => {
          setGalleryVisible(true);
          setGalleryFade(1);
        },
        onEnterBack: () => setGalleryVisible(false),
        onUpdate: (self) => {
          const distance = self.progress * (self.end - self.start);
          const baseProgress = clamp(distance / baseDistance());

          // Entry and horizontal travel retain their previous pixel distances.
          const exitFade =
            1 -
            smoothstep(
              clamp((distance - baseDistance()) / exitFadeDistance())
            );
          setCompositionFade(exitFade);

          // After Awards has disappeared, hold on uninterrupted beige before
          // the closing experience begins its own equally measured fade-in.
          const galleryFade = clamp(
            (distance -
              baseDistance() -
              exitFadeDistance() -
              beigeHoldDistance()) /
              galleryFadeDistance()
          );
          setGalleryVisible(galleryFade > 0.001);
          setGalleryFade(galleryFade);
          // The rail waits for the fade-in to complete before travelling.
          const p = clamp((baseProgress - 0.12) / 0.72);
          const x = -maxX() * p;
          tr.style.transform = `translateX(${x.toFixed(1)}px)`;
          // the backdrop drifts slower for depth, but only within its own
          // overscan — it stops exactly at its edge, never showing a gap
          if (bg.current) {
            const slack = ((BG_SCALE - 1) / 2) * stg.clientWidth;
            bg.current.style.transform = `translateX(${(-slack * p).toFixed(1)}px) scale(${BG_SCALE})`;
          }
        },
      });
    }, sec);

    return () => ctx.revert();
  }, []);

  return (
    <>
    <section id="awards" ref={section} className="relative z-10" style={{ marginTop: "-100vh" }}>
      {/* nav-dark: while this act is under the header the nav flips to cream.
          No solid stage background: the outgoing act remains visible through
          the masked area during the transition. */}
      <div ref={stage} data-navoff="1" className="nav-dark relative h-screen w-full overflow-hidden">
        <div
          ref={reveal}
          data-awards-reveal
          className="absolute inset-0"
        >
          <div
            ref={beigeBase}
            aria-hidden
            className="absolute inset-0"
            style={{ background: "#e0dcd1" }}
          />
          <div
            ref={composition}
            className="absolute inset-0 will-change-[opacity,filter]"
            style={
              {
                "--entry-r": "-22%",
                opacity: 1,
                WebkitMaskImage:
                  "linear-gradient(to top, #000 var(--entry-r), rgba(0,0,0,0) calc(var(--entry-r) + 22%))",
                maskImage:
                  "linear-gradient(to top, #000 var(--entry-r), rgba(0,0,0,0) calc(var(--entry-r) + 22%))",
              } as React.CSSProperties
            }
          >
          {/* full-bleed backdrop, drifting slowly behind the rail */}
          <div ref={bg} className="absolute inset-0 will-change-transform" style={{ transform: `scale(${BG_SCALE})` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/alp/dsc09291.jpg"
              alt=""
              className="h-full w-full object-cover"
              style={{ objectPosition: "50% 52%", filter: "brightness(0.8) saturate(0.88)" }}
            />
          </div>
          {/* scrim so the glass frames and cream type stay legible over the photo */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(10,8,6,0.66) 0%, rgba(10,8,6,0.44) 42%, rgba(10,8,6,0.3) 100%), " +
                "linear-gradient(to bottom, rgba(10,8,6,0.36) 0%, transparent 22%, transparent 74%, rgba(10,8,6,0.38) 100%)",
            }}
          />

          <div
            ref={track}
            className="over-img absolute inset-y-0 left-0 flex h-full items-center gap-8 px-6 md:gap-14 md:px-14"
            style={{ width: "max-content" }}
          >
            {/* intro panel */}
            <div className="flex w-[70vw] max-w-[500px] shrink-0 flex-col justify-center">
              <span className="caption mb-6" style={{ color: "var(--bronze-hi)" }}>
                Recognition
              </span>
              <h2
                className="display"
                style={{
                  ...GOLD_WRAP,
                  fontSize: "clamp(2rem, 4.2vw, 54px)",
                  lineHeight: 1.1,
                  paddingBottom: "0.1em",
                  filter: "drop-shadow(0 2px 16px rgba(10,8,6,0.55))",
                }}
              >
                Awards &amp; Achievements
              </h2>
              <p
                className="mt-[30px] max-w-[38ch] text-[15.5px] leading-relaxed"
                style={{ color: "var(--ink-strong)", textShadow: "0 1px 22px rgba(10,8,6,0.65)" }}
              >
                A record of firsts recognised across the industry — keep scrolling to move
                through it.
              </p>
            </div>

            {AWARDS.map((a, i) => (
              <div key={i} className="shrink-0">
                {/* label row above the frame — white, larger for legibility over the photo */}
                <div className="mb-4 flex items-baseline gap-4">
                  <span
                    className="caption"
                    style={{ color: "rgba(255,255,255,0.95)", fontSize: "0.82rem", textShadow: "0 1px 14px rgba(10,8,6,0.6)" }}
                  >
                    0{i + 1}
                  </span>
                  <span
                    className="caption"
                    style={{ color: "rgba(255,255,255,0.95)", fontSize: "0.82rem", textShadow: "0 1px 14px rgba(10,8,6,0.6)" }}
                  >
                    {a.tag}
                  </span>
                </div>
                {/* quiet frosted-glass frame over the photograph */}
                <button
                  type="button"
                  onClick={() => setActiveAward(a)}
                  aria-label={`View ${a.caption} award details`}
                  className="ease-alpago-soft flex h-[46vh] w-[300px] cursor-pointer flex-col justify-between rounded-[3px] p-8 text-left outline-none transition-[border-color,background-color,translate,box-shadow] duration-700 hover:-translate-y-2 focus-visible:border-[color:var(--bronze-hi)] md:w-[330px]"
                  style={{
                    border: "1px solid rgba(236,227,213,0.16)",
                    background: "linear-gradient(165deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.02) 100%)",
                    backdropFilter: "blur(22px) saturate(112%)",
                    WebkitBackdropFilter: "blur(22px) saturate(112%)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 20px 55px rgba(10,8,6,0.3)",
                  }}
                >
                  <div
                    className="display"
                    style={{
                      fontSize: "24px",
                      lineHeight: 1.3,
                      letterSpacing: "0.03em",
                      color: "var(--ink)",
                      textShadow: "0 1px 18px rgba(10,8,6,0.45)",
                    }}
                  >
                    {a.name}
                  </div>
                  <p
                    className="text-[13.5px] leading-[1.65]"
                    style={{ color: "rgba(236,227,213,0.78)", textShadow: "0 1px 16px rgba(10,8,6,0.55)" }}
                  >
                    {a.caption}
                  </p>
                </button>
              </div>
            ))}

            <div className="w-[10vw] shrink-0" />
          </div>
          </div>
        </div>
      </div>
    </section>
    <AwardPopup award={activeAward} onClose={() => setActiveAward(null)} />
    </>
  );
}
