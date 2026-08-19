"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { clamp, smoothstep } from "./kit";
import LeaderProfileDrawer, { type AlpagoLeader } from "./LeaderProfileDrawer";

const PEOPLE_LEADERS: readonly AlpagoLeader[] = [
  {
    name: "Murat Ayyildiz",
    role: "Chairman",
    image: "/media/alp/leadership-c3-hq.png",
    copy: "That philosophy is not delegated. It is personally protected at the highest level of the Group.",
    biography: "At Alpago, our standards begin with a simple conviction: quality should never be compromised for convenience. Murat Ayyildiz protects this principle at Group level, guiding each business with a long-term perspective and a disciplined focus on integrity, precision, and lasting value.",
  },
  {
    name: "Ridvan Ayyildiz",
    role: "Vice Chairman",
    image: "/media/alp/leadership-c1-hq.png",
    copy: "The standards that define Alpago are upheld by people who continue to question accepted expectations.",
    biography: "Ridvan Ayyildiz helps translate the Group’s vision into the decisions that shape its businesses. His approach brings together strategic clarity, considered growth, and the belief that every outcome should strengthen the standard Alpago represents.",
  },
  {
    name: "Syed Azeem Mehroz",
    role: "CEO & CFO",
    image: "/media/alp/leadership-c2-hq.png",
    copy: "Quality is never accidental. It is shaped through care, disciplined judgment, and the pursuit of better outcomes.",
    biography: "As CEO & CFO, Syed Azeem Mehroz brings operational and financial discipline to the Group’s ambitions. His leadership connects strategy with execution, ensuring that growth remains measured, responsible, and aligned with Alpago’s long-term vision.",
  },
];

const PEOPLE_INTRO_LINES = ["The Visionaries Behind", "the World of Alpago"];
const PEOPLE_INTRO_COPY =
  "What began as a conviction to challenge conventional definitions of quality has evolved into a Group that continues to redefine expectations across every industry it enters. That philosophy is not delegated. It is personally protected by the visionaries of this immaculate vision.";

const GOLD: React.CSSProperties = {
  backgroundImage: "linear-gradient(180deg, var(--gold-1) 0%, var(--gold-2) 48%, var(--gold-3) 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
};

const PORTRAIT_OFFSET_X = [15, 0, 20];

export default function PeopleVisionariesCards() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const reveal = useRef<HTMLDivElement>(null);
  const background = useRef<HTMLImageElement>(null);
  const tint = useRef<HTMLDivElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const guideLines = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const details = useRef<(HTMLDivElement | null)[]>([]);
  const profileTriggers = useRef<(HTMLButtonElement | null)[]>([]);
  const [profileIndex, setProfileIndex] = useState<number | null>(null);

  const closeProfile = () => {
    const closingIndex = profileIndex;
    setProfileIndex(null);
    if (closingIndex !== null) requestAnimationFrame(() => profileTriggers.current[closingIndex]?.focus());
  };

  useLayoutEffect(() => {
    const sec = section.current;
    const stg = stage.current;
    const img = background.current;
    const opening = intro.current;
    if (!sec || !stg || !img || !opening) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const audit = new URLSearchParams(window.location.search).has("audit");
    const introChars = opening.querySelectorAll<HTMLElement>(".pvc-intro-char");
    const introRows = opening.querySelectorAll<HTMLElement>(".pvc-intro-row");

    const setEnter = (value: number) => {
      const progress = smoothstep(clamp(value));
      if (!reveal.current) return;
      reveal.current.style.setProperty("--r", `${(progress * 115 - 15).toFixed(2)}%`);
      reveal.current.style.visibility = value <= 0.001 ? "hidden" : "visible";
    };

    const setWipe = (radius: number) => {
      stg.style.setProperty("--r", `${radius.toFixed(2)}%`);
    };

    const apply = (progress: number) => {
      const blurProgress = smoothstep(clamp((progress - 0.29) / 0.1));
      img.style.filter = `blur(${(blurProgress * 25).toFixed(1)}px) saturate(${(1.01 - blurProgress * 0.09).toFixed(2)}) brightness(${(0.74 - blurProgress * 0.13).toFixed(2)})`;
      img.style.transform = `scale(${(1.025 + blurProgress * 0.065).toFixed(3)})`;
      if (tint.current) tint.current.style.opacity = (0.3 + blurProgress * 0.4).toFixed(3);

      // Entrance choreography from the supplied reference:
      // 1) all three cards reveal as a horizontal gallery;
      // 2) the gallery converges and scales into the existing central stack;
      // 3) only then do the guide lines and leader details appear.
      const cardReveal = smoothstep(clamp((progress - 0.335) / 0.055));
      const fanOut = smoothstep(clamp((progress - 0.35) / 0.11));
      const gather = smoothstep(clamp((progress - 0.5) / 0.12));
      const stackReady = smoothstep(clamp((progress - 0.62) / 0.04));
      const rawIndex = clamp((progress - 0.665) / 0.175) * (PEOPLE_LEADERS.length - 1);
      const exitLift = smoothstep(clamp((progress - 0.82) / 0.15)) * 48;
      const activeIndex = Math.round(rawIndex);

      if (guideLines.current) {
        guideLines.current.style.opacity = (stackReady * 0.5).toFixed(3);
        guideLines.current.style.transform = `translateY(calc(-50% - ${exitLift.toFixed(2)}px))`;
      }

      cards.current.forEach((card, index) => {
        if (!card) return;
        const relative = index - rawIndex;
        const distance = Math.abs(relative);
        const stackedY = relative * 7.2;
        const stackedScale = Math.max(0.89, 1 - distance * 0.045);
        const lineScale = window.innerWidth < 768 ? 0.42 : 0.56;
        const clusterScale = lineScale * 0.48;
        const rowScale = lineScale;
        const lineSpacing = window.innerWidth < 768 ? 30 : 27;
        const clusterX = (index - 1) * (window.innerWidth < 768 ? 4 : 3.2);
        const rowX = (index - 1) * lineSpacing;
        const fanY = [2.6, -1.4, 1.7][index] ?? 0;
        const x = (clusterX + (rowX - clusterX) * fanOut) * (1 - gather);
        const rowY = fanY * (1 - fanOut);
        const y = rowY * (1 - gather) + stackedY * gather - (exitLift / window.innerHeight) * 100;
        const fanScale = clusterScale + (rowScale - clusterScale) * fanOut;
        const scale = fanScale + (stackedScale - fanScale) * gather;
        const stackedOpacity = Math.max(0.28, 1 - Math.max(0, distance - 1.25) * 0.5);
        const opacity = cardReveal * (1 + (stackedOpacity - 1) * gather);
        card.style.opacity = opacity.toFixed(3);
        card.style.filter = `blur(${((1 - cardReveal) * 7).toFixed(2)}px)`;
        card.style.zIndex = String(30 - Math.round(distance * 6) + (index === activeIndex ? 2 : 0));
        card.style.transform = `translate3d(${x.toFixed(2)}vw, ${y.toFixed(2)}vh, 0) scale(${scale.toFixed(4)})`;
      });

      details.current.forEach((detail, index) => {
        if (!detail) return;
        const distance = Math.abs(index - rawIndex);
        // Let the outgoing copy clear before the next leader locks into the
        // foreground. The cards overlap during the hand-off; the typography
        // deliberately does not, keeping names and counters legible.
        const visibility = stackReady * smoothstep(clamp((0.5 - distance) / 0.18));
        detail.style.opacity = visibility.toFixed(3);
        detail.style.pointerEvents = visibility > 0.55 ? "auto" : "none";
        detail.style.transform = `translate3d(0, ${((index - rawIndex) * 22 - exitLift).toFixed(1)}px, 0)`;
      });
    };

    if (audit || reduce) {
      setEnter(1);
      setWipe(130);
      gsap.set(introChars, { opacity: 0 });
      gsap.set(introRows, { filter: "blur(12px)" });
      apply(0.66);
      return;
    }

    setEnter(0);
    setWipe(130);
    apply(0);
    gsap.set(introChars, { opacity: 0 });
    gsap.set(introRows, { filter: "blur(12px)" });

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sec,
          start: "top top",
          end: "+=600%",
          pin: stg,
          pinType: "fixed",
          scrub: 0.65,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress;
            setEnter(smoothstep(clamp(progress / 0.16)));
            const wipeProgress = clamp((progress - 0.84) / 0.155);
            const radius = 130 - wipeProgress * 170;
            setWipe(radius);
            stg.dataset.navoff = progress < 0.06 || radius < 8 ? "1" : "0";
            apply(progress);
          },
          onRefresh: (self) => {
            const progress = self.progress;
            setEnter(smoothstep(clamp(progress / 0.16)));
            const wipeProgress = clamp((progress - 0.84) / 0.155);
            const radius = 130 - wipeProgress * 170;
            setWipe(radius);
            stg.dataset.navoff = progress < 0.06 || radius < 8 ? "1" : "0";
            apply(progress);
          },
          onLeave: () => { stg.dataset.navoff = "1"; },
          onEnterBack: () => { stg.dataset.navoff = "0"; },
        },
      });

      timeline.fromTo(
        introChars,
        { opacity: 0 },
        { opacity: 1, ease: "none", stagger: { amount: 0.055 }, duration: 0.075 },
        0.105,
      );
      timeline.fromTo(
        introRows,
        { filter: "blur(12px)" },
        { filter: "blur(0px)", ease: "none", duration: 0.085 },
        0.105,
      );
      timeline.to(introChars, { opacity: 0, ease: "none", stagger: { amount: 0.035 }, duration: 0.055 }, 0.275);
      timeline.to(introRows, { filter: "blur(12px)", ease: "none", duration: 0.07 }, 0.275);
      timeline.to({}, { duration: 0.001 }, 1);
    }, sec);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={section}
      className="relative z-20 w-screen"
      style={{ marginLeft: "calc((100% - 100vw) / 2)", marginTop: "-100vh" }}
    >
      <div
        ref={stage}
        data-navoff="1"
        className="nav-dark relative z-20 h-screen w-full overflow-hidden"
        style={{
          "--r": "130%",
          WebkitMaskImage: "linear-gradient(to bottom, #000 var(--r), rgba(0,0,0,0) calc(var(--r) + 40%))",
          maskImage: "linear-gradient(to bottom, #000 var(--r), rgba(0,0,0,0) calc(var(--r) + 40%))",
        } as React.CSSProperties}
      >
        <div
          ref={reveal}
          className="absolute -left-8 -right-8 inset-y-0"
          style={{
            "--r": "-15%",
            WebkitMaskImage: "linear-gradient(to top, #000 var(--r), rgba(0,0,0,0) calc(var(--r) + 15%))",
            maskImage: "linear-gradient(to top, #000 var(--r), rgba(0,0,0,0) calc(var(--r) + 15%))",
          } as React.CSSProperties}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={background}
            src="/media/alp/people-visionaries-9383.png"
            alt=""
            aria-hidden
            className="absolute inset-[-4%] h-[108%] w-[108%] object-cover object-center will-change-[filter,transform]"
          />
          <div
            ref={tint}
            className="pointer-events-none absolute inset-0 opacity-0"
            style={{
              background: "linear-gradient(135deg, rgba(151,86,40,0.62) 0%, rgba(107,54,23,0.52) 54%, rgba(76,36,16,0.46) 100%)",
              mixBlendMode: "soft-light",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(22,12,6,0.42) 0%, rgba(20,11,5,0.14) 23%, rgba(24,12,5,0.28) 72%, rgba(17,8,3,0.7) 100%)," +
                "radial-gradient(70% 70% at 50% 48%, rgba(35,17,7,0.08), rgba(18,8,3,0.48))",
            }}
          />
        </div>

        <div ref={intro} className="over-img pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6 text-center md:px-14">
          <div className="flex max-w-[1040px] flex-col items-center">
            <h2 className="display">
              {PEOPLE_INTRO_LINES.map((line) => (
                <span
                  key={line}
                  className="pvc-intro-row block"
                  style={{ fontSize: "clamp(1.9rem, 5.4vw, 68px)", lineHeight: 1.06, letterSpacing: "-0.03em", paddingBottom: "0.05em" }}
                >
                  {Array.from(line).map((character, index) => (
                    <span key={index} className="pvc-intro-char" style={GOLD}>{character}</span>
                  ))}
                </span>
              ))}
            </h2>
            <p
              className="pvc-intro-row mt-8"
              style={{ color: "#fffdf8", fontFamily: "var(--font-social), sans-serif", fontSize: "16.5px", fontWeight: 500, lineHeight: 1.75, maxWidth: "58ch" }}
            >
              {Array.from(PEOPLE_INTRO_COPY).map((character, index) => (
                <span key={index} className="pvc-intro-char">{character}</span>
              ))}
            </p>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <div className="relative h-[70vh] w-[min(28vw,430px)] min-w-[300px] max-md:h-[54vh] max-md:w-[72vw] max-md:min-w-0">
            {PEOPLE_LEADERS.map((leader, index) => (
              <div
                key={leader.name}
                ref={(element) => { cards.current[index] = element; }}
                className="absolute inset-0 overflow-hidden rounded-[3px] opacity-0 shadow-[0_32px_80px_rgba(9,6,4,0.2)] will-change-[transform,opacity]"
                style={{ background: "linear-gradient(145deg, #ebe7dd 0%, #ddd8cb 60%, #d2ccbe 100%)" }}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-white/45" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={leader.image}
                  alt={leader.name}
                  className="absolute inset-x-[-7%] bottom-0 h-[94%] w-[114%] object-contain object-bottom"
                  style={{ transform: `translateX(${PORTRAIT_OFFSET_X[index]}px)` }}
                />
              </div>
            ))}
          </div>
        </div>

        <div
          ref={guideLines}
          aria-hidden
          className="pointer-events-none absolute inset-x-[5.5vw] top-1/2 z-50 flex -translate-y-1/2 items-center opacity-0 max-md:inset-x-6"
        >
          <span className="h-px flex-1 bg-[rgba(226,192,138,0.42)]" />
          <span className="w-[calc(min(28vw,430px)+40px)] min-w-[340px] max-md:w-[calc(72vw+40px)] max-md:min-w-0" />
          <span className="h-px flex-1 bg-[rgba(226,192,138,0.42)]" />
        </div>

        {PEOPLE_LEADERS.map((leader, index) => (
          <div
            key={leader.name}
            ref={(element) => { details.current[index] = element; }}
            className="absolute inset-0 z-[55] opacity-0 will-change-[transform,opacity]"
            style={{ pointerEvents: "none" }}
          >
            <div className="absolute left-[5.5vw] top-[31vh] w-[27vw] max-w-[390px] max-md:left-6 max-md:top-[12vh] max-md:w-[55vw]">
              <span className="caption" style={{ color: "rgba(226,192,138,0.92)", letterSpacing: "0.22em" }}>{leader.role}</span>
              <h3
                className="display mt-4 whitespace-nowrap max-md:mt-2"
                style={{ ...GOLD, fontSize: "clamp(2rem, 3.5vw, 52px)", lineHeight: 1, letterSpacing: "-0.035em" }}
              >
                {leader.name}
              </h3>
            </div>

            <div className="absolute right-[7vw] top-[calc(35vh+20px)] max-md:right-6 max-md:top-[calc(14vh+20px)]">
              <span className="display block text-right" style={{ ...GOLD, fontSize: "clamp(1.25rem, 2.4vw, 34px)", lineHeight: 1 }}>
                {String(index + 1).padStart(2, "0")} / 03
              </span>
            </div>

            <p
              className="absolute bottom-[calc(8vh+40px)] left-[5.5vw] w-[27vw] max-w-[390px] max-md:bottom-[calc(1.5rem+40px)] max-md:left-6 max-md:w-[46vw]"
              style={{ color: "rgba(245,240,232,0.8)", fontFamily: "var(--font-social), sans-serif", fontSize: "clamp(13px, 1.05vw, 15px)", lineHeight: 1.7 }}
            >
              {leader.copy}
            </p>

            <button
              ref={(element) => { profileTriggers.current[index] = element; }}
              type="button"
              onClick={() => setProfileIndex(index)}
              className="caption absolute bottom-[calc(8vh+40px)] right-[6vw] inline-flex min-w-[190px] cursor-pointer items-center justify-center px-7 py-5 transition-colors duration-300 max-md:bottom-[calc(1.75rem+40px)] max-md:right-6 max-md:min-w-[170px]"
              style={{ background: "rgba(236,231,219,0.96)", color: "#30261c", letterSpacing: "0.15em" }}
              onMouseEnter={(event) => {
                event.currentTarget.style.background = "#876540";
                event.currentTarget.style.color = "#f1eadf";
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.background = "rgba(236,231,219,0.96)";
                event.currentTarget.style.color = "#30261c";
              }}
            >
              Learn More
            </button>
          </div>
        ))}
      </div>
      <LeaderProfileDrawer
        leaders={PEOPLE_LEADERS}
        activeIndex={profileIndex ?? 0}
        open={profileIndex !== null}
        onChange={setProfileIndex}
        onClose={closeProfile}
      />
    </section>
  );
}
