"use client";

import { useLayoutEffect, useRef } from "react";
import { ScrollTrigger } from "@/lib/gsap";

const VIDEO = "/media/video/manifesto-infinity-scroll.mp4";
const REVERSE_VIDEO = "/media/video/manifesto-infinity-scroll-reverse.mp4";

const GOLD: React.CSSProperties = {
  backgroundImage: "linear-gradient(180deg, var(--gold-1) 0%, var(--gold-2) 48%, var(--gold-3) 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
};

const HEADING: React.CSSProperties = {
  ...GOLD,
  fontSize: "clamp(1.55rem, 3.6vw, 44px)",
  lineHeight: 1.2,
  letterSpacing: "-0.01em",
  paddingBottom: "0.08em",
};

const BLURB: React.CSSProperties = {
  fontFamily: "var(--font-social), sans-serif",
  fontSize: "clamp(14px, 1.25vw, 16.5px)",
  lineHeight: 1.72,
  // Match the Make an Enquiry button: full-strength espresso brown, with no
  // translucent text layer over the light video bed.
  color: "var(--ink)",
  opacity: 1,
};

// This page uses a light video bed, so every copy layer must keep the page's
// espresso palette instead of inheriting the cream-on-image treatment.
const LIGHT_COPY: React.CSSProperties = {
  "--ink": "#332a2a",
  "--ink-dim": "rgba(51, 42, 42, 0.64)",
  "--ink-strong": "rgba(51, 42, 42, 0.82)",
  "--ink-faint": "rgba(51, 42, 42, 0.36)",
  "--bronze": "#8a6a3e",
  "--bronze-hi": "#7d5c2f",
} as React.CSSProperties;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

export default function ManifestoPage({ hideHero = false }: { hideHero?: boolean }) {
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const reverseVideo = useRef<HTMLVideoElement>(null);
  const panels = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const sec = section.current;
    const vid = video.current;
    const reverseVid = reverseVideo.current;
    if (!sec || !vid || !reverseVid) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const audit = new URLSearchParams(window.location.search).has("audit");
    const count = panels.current.length;
    let sequenceDuration = 1;
    let targetProgress = 0;
    let displayedProgress = 0;
    let stepLocked = false;
    let stepStartedAt = 0;
    let lastWheelAt = 0;
    let unlockTimer = 0;
    let transitionFrame = 0;
    let transitionToken = 0;
    let activeVideo: HTMLVideoElement = vid;
    let raf = 0;

    const showVideo = (element: HTMLVideoElement) => {
      activeVideo = element;
      vid.style.opacity = element === vid ? "1" : "0";
      reverseVid.style.opacity = element === reverseVid ? "1" : "0";
    };

    const stopVideoTransition = () => {
      transitionToken += 1;
      cancelAnimationFrame(transitionFrame);
      vid.pause();
      reverseVid.pause();
    };

    const playSegment = (fromIndex: number, toIndex: number) => {
      stopVideoTransition();
      const token = transitionToken;
      const forward = toIndex > fromIndex;
      const media = forward ? vid : reverseVid;
      const mediaDuration = Number.isFinite(media.duration) ? media.duration : sequenceDuration;
      const fromProgress = fromIndex / Math.max(1, count - 1);
      const toProgress = toIndex / Math.max(1, count - 1);
      const startTime = forward ? fromProgress * mediaDuration : (1 - fromProgress) * mediaDuration;
      const endTime = forward ? toProgress * mediaDuration : (1 - toProgress) * mediaDuration;
      const transitionDuration = 1.05;
      const playbackRate = Math.max(0.25, Math.abs(endTime - startTime) / transitionDuration);

      const beginPlayback = () => {
        if (token !== transitionToken) return;
        media.playbackRate = playbackRate;
        showVideo(media);
        media.play().catch(() => {});

        const monitor = () => {
          if (token !== transitionToken) return;
          const reached = media.currentTime >= endTime - 0.006;
          if (reached) {
            media.pause();
            media.currentTime = clamp(endTime, 0, Math.max(0, mediaDuration - 0.001));
            return;
          }
          transitionFrame = requestAnimationFrame(monitor);
        };
        transitionFrame = requestAnimationFrame(monitor);
      };

      const clampedStart = clamp(startTime, 0, Math.max(0, mediaDuration - 0.001));
      if (Math.abs(media.currentTime - clampedStart) > 0.004) {
        media.addEventListener("seeked", beginPlayback, { once: true });
        media.currentTime = clampedStart;
      } else {
        beginPlayback();
      }
    };

    const paint = (progress: number) => {
      const p = clamp(progress);
      const position = p * (count - 1);
      const current = Math.min(count - 1, Math.floor(position));
      const local = position - current;
      const transition = current < count - 1 ? smooth(clamp(local)) : 0;

      panels.current.forEach((panel, index) => {
        if (!panel) return;
        let opacity = 0;
        let y = 26;
        let blur = 12;
        if (index === current) {
          opacity = 1 - transition;
          y = -18 * transition;
          blur = 8 * transition;
        } else if (index === current + 1) {
          opacity = transition;
          y = 26 * (1 - transition);
          blur = 12 * (1 - transition);
        }
        panel.style.opacity = opacity.toFixed(4);
        panel.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
        panel.style.filter = `blur(${blur.toFixed(1)}px)`;
        panel.style.visibility = opacity < 0.002 ? "hidden" : "visible";
      });
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const deltaProgress = targetProgress - displayedProgress;
      displayedProgress = Math.abs(deltaProgress) < 0.0001
        ? targetProgress
        : displayedProgress + deltaProgress * 0.16;
      displayedProgress = clamp(displayedProgress);
      paint(displayedProgress);
    };

    const onMetadata = () => {
      if (vid.readyState < 1 || reverseVid.readyState < 1) return;
      sequenceDuration = Number.isFinite(vid.duration) ? vid.duration : 1;
      vid.pause();
      vid.currentTime = 0;
      reverseVid.pause();
      reverseVid.currentTime = Math.max(0, reverseVid.duration - 0.001);
      showVideo(vid);
      paint(0);
    };
    vid.addEventListener("loadedmetadata", onMetadata);
    reverseVid.addEventListener("loadedmetadata", onMetadata);
    if (vid.readyState >= 1 && reverseVid.readyState >= 1) onMetadata();

    if (audit || reduce) {
      paint(0);
      return () => {
        vid.removeEventListener("loadedmetadata", onMetadata);
        reverseVid.removeEventListener("loadedmetadata", onMetadata);
      };
    }

    raf = requestAnimationFrame(tick);
    const trigger = ScrollTrigger.create({
      trigger: sec,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        targetProgress = self.progress;
      },
      onRefresh: (self) => {
        targetProgress = self.progress;
        displayedProgress = self.progress;
        paint(self.progress);
      },
    });

    const releaseStepWhenQuiet = () => {
      window.clearTimeout(unlockTimer);
      unlockTimer = window.setTimeout(() => {
        const gestureIsQuiet = performance.now() - lastWheelAt > 170;
        const transitionHasSettled = performance.now() - stepStartedAt > 900;
        if (gestureIsQuiet && transitionHasSettled) {
          stepLocked = false;
        } else {
          releaseStepWhenQuiet();
        }
      }, 180);
    };

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 4) return;
      const start = sec.offsetTop;
      const end = start + sec.offsetHeight - window.innerHeight;
      const y = window.scrollY;
      if (y < start - 2 || y > end + 2) return;

      const direction = event.deltaY > 0 ? 1 : -1;
      const progress = clamp((y - start) / Math.max(1, end - start));
      const currentIndex = Math.round(progress * (count - 1));
      const targetIndex = currentIndex + direction;

      // At the outer anchors the same gesture is allowed to continue into the
      // preceding/following section instead of trapping the page.
      if (targetIndex < 0 || targetIndex >= count) return;

      event.preventDefault();
      event.stopPropagation();
      lastWheelAt = performance.now();
      if (stepLocked) {
        releaseStepWhenQuiet();
        return;
      }

      stepLocked = true;
      stepStartedAt = performance.now();
      playSegment(currentIndex, targetIndex);
      const targetY = start + (targetIndex / Math.max(1, count - 1)) * (end - start);
      const lenis = (window as unknown as {
        __lenis?: { scrollTo: (target: number, options?: Record<string, unknown>) => void };
      }).__lenis;

      if (lenis) {
        lenis.scrollTo(targetY, {
          duration: 1.05,
          lock: true,
          force: true,
          easing: (t: number) => t * t * (3 - 2 * t),
        });
      } else {
        window.scrollTo({ top: targetY, behavior: "smooth" });
      }
      releaseStepWhenQuiet();
    };

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });

    targetProgress = trigger.progress;
    displayedProgress = trigger.progress;
    paint(trigger.progress);
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(transitionFrame);
      window.clearTimeout(unlockTimer);
      window.removeEventListener("wheel", onWheel, { capture: true });
      trigger.kill();
      vid.pause();
      reverseVid.pause();
      vid.removeEventListener("loadedmetadata", onMetadata);
      reverseVid.removeEventListener("loadedmetadata", onMetadata);
    };
  }, []);

  const sceneClass =
    "absolute inset-0 flex items-center px-6 pt-16 will-change-[opacity,transform,filter] md:px-14";
  const copyClass = "w-full max-w-[760px]";

  return (
    <section ref={section} className="relative h-[400vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[var(--bg)]">
        <video
          ref={video}
          src={VIDEO}
          muted
          playsInline
          preload="auto"
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            backfaceVisibility: "hidden",
            filter: "contrast(1.045) saturate(1.015)",
            objectPosition: "calc(50% + 106px) calc(50% + 44px)",
            transition: "opacity 220ms ease-in-out",
          }}
        />

        <video
          ref={reverseVideo}
          src={REVERSE_VIDEO}
          muted
          playsInline
          preload="auto"
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            backfaceVisibility: "hidden",
            filter: "contrast(1.045) saturate(1.015)",
            objectPosition: "calc(50% + 106px) calc(50% + 44px)",
            opacity: 0,
            transition: "opacity 220ms ease-in-out",
          }}
        />

        {/* Light lift keeps copy readable across the full video timeline. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-[68%]"
          style={{ background: "linear-gradient(to right, rgba(235,231,221,0.86) 0%, rgba(235,231,221,0.75) 42%, rgba(235,231,221,0.24) 70%, rgba(235,231,221,0) 100%)" }}
        />

        <div
          className="caption absolute left-1/2 top-[104px] z-30 hidden items-center gap-2 md:flex"
          style={{ transform: "translateX(-50%)" }}
        >
          <a href="/" className="transition-opacity hover:opacity-70" style={{ fontSize: "10px", color: "var(--bronze-lo)", letterSpacing: "0.24em" }}>
            Home
          </a>
          <span aria-hidden style={{ color: "var(--bronze-lo)", fontSize: "10px" }}>/</span>
          <a href="/the-alpago" className="transition-opacity hover:opacity-70" style={{ fontSize: "10px", color: "var(--bronze-lo)", letterSpacing: "0.24em" }}>
            The Alpago
          </a>
          <span aria-hidden style={{ color: "var(--bronze-lo)", fontSize: "10px" }}>/</span>
          <span style={{ fontSize: "10px", color: "var(--bronze)", letterSpacing: "0.24em" }}>The Manifesto</span>
        </div>

        <div className="absolute inset-0 z-10 mx-auto w-full max-w-[1440px]" style={LIGHT_COPY}>
          {!hideHero && (
            <div ref={(el) => { panels.current[0] = el; }} className={sceneClass}>
              <div className={copyClass}>
                <span className="caption" style={{ color: "var(--bronze-hi)" }}>The Alpago</span>
                <h1 className="display mt-6" style={{ ...GOLD, fontSize: "clamp(2.6rem, 6.4vw, 92px)", lineHeight: 1.03, letterSpacing: "-0.02em", paddingBottom: "0.08em" }}>
                  The Manifesto
                </h1>
                <p className="mt-8 max-w-[46ch]" style={BLURB}>
                  The beliefs that guide every project — a written commitment to craft, restraint and the pursuit of what endures long after completion.
                </p>
              </div>
            </div>
          )}

          <div ref={(el) => { panels.current[hideHero ? 0 : 1] = el; }} className={sceneClass}>
            <div className={copyClass}>
              <span className="caption" style={{ color: "var(--bronze-hi)", letterSpacing: "0.24em" }}>Alpago is built on a different premise</span>
              <h2 className="display mt-8" style={HEADING}>
                Quality is not a comparative measure within an industry — it is an absolute standard that exists independent of it.
              </h2>
              <p className="mt-7 max-w-[40ch]" style={BLURB}>
                With this vision, most of what is accepted today as ‘luxury’ simply does not qualify.
              </p>
            </div>
          </div>

          <div ref={(el) => { panels.current[hideHero ? 1 : 2] = el; }} className={sceneClass}>
            <div className={copyClass}>
              <h2 className="display" style={HEADING}>
                This is why Alpago does not aim to improve standards. It aims to reset them.
              </h2>
              <div className="mt-8 max-w-[58ch] space-y-5">
                <p style={BLURB}>
                  Not through interpretation, but through delivery. Not through positioning, but through outcome. Every project, every space, every vehicle associated with Alpago is selected, shaped, or delivered with a single intent: to reflect what the highest level actually looks like when nothing is reduced, softened, or made convenient.
                </p>
                <p style={BLURB}>
                  We are not interested in being the best within the acceptable standards. We are interested in elevating the standards — because they should be far higher when it comes to luxury.
                </p>
              </div>
            </div>
          </div>

          <div ref={(el) => { panels.current[hideHero ? 2 : 3] = el; }} className={sceneClass}>
            <div className={copyClass}>
              <h2 className="display" style={HEADING}>
                To show what quality becomes when it is taken to its real limit — not the industry’s limit — and to ensure that once it is seen, it cannot be unseen.
              </h2>
              <p className="mt-7 max-w-[48ch]" style={BLURB}>
                Because once you understand what the highest standard actually is, everything below it stops being enough.
              </p>
            </div>
          </div>
        </div>

        <div className="caption absolute bottom-8 left-1/2 z-20 -translate-x-1/2" style={{ color: "var(--ink-faint)", letterSpacing: "0.22em", fontSize: "9px" }}>
          Scroll to continue
        </div>
      </div>
    </section>
  );
}
