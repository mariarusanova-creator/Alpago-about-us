"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const FINAL_FRAME_SECONDS = 4.5;
const FINAL_FRAME_SCROLL_PROGRESS = 0.98;
const VIDEO_OPACITY = 0.82;

type VideoMode = "forward" | "reverse";

export default function TheAlpagoV2Background() {
  const layer = useRef<HTMLDivElement>(null);
  const forwardVideo = useRef<HTMLVideoElement>(null);
  const reverseVideo = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    const root = layer.current;
    const forward = forwardVideo.current;
    const reverse = reverseVideo.current;
    const story = document.querySelector<HTMLElement>("#v2-story");
    const performanceSection = document.querySelector<HTMLElement>("#v2-performance");
    const events = document.querySelector<HTMLElement>("#events");
    const finalPrinciple = document.querySelector<HTMLElement>("#v2-principle-05");
    const isVersion3 = Boolean(document.querySelector("[data-v3-hero]"));
    const reverseEndSection = isVersion3 ? finalPrinciple : events;
    if (!root || !forward || !reverse || !story || !performanceSection || !reverseEndSection) return;

    [forward, reverse].forEach((media) => {
      media.muted = true;
      media.defaultMuted = true;
      media.loop = false;
    });

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const audit = new URLSearchParams(window.location.search).has("audit");
    let forwardEnd = 0;
    let reverseEnd = 0;
    let activeMode: VideoMode = "forward";
    let activeVideo = forward;
    let targetProgress = audit ? 1 : 0;
    let targetTime = 0;
    let timelineEnd = 0;
    let animationFrame = 0;
    let lastBackwardSeek = 0;
    let lastTargetUpdate = 0;
    let timelineDirection = 1;
    let targetPlaybackRate = 0.32;
    let smoothedPlaybackRate = 0.32;

    const showMode = (mode: VideoMode) => {
      if (mode === activeMode) return;
      activeVideo.pause();
      activeMode = mode;
      activeVideo = mode === "forward" ? forward : reverse;
      forward.style.opacity = mode === "forward" ? String(VIDEO_OPACITY) : "0";
      reverse.style.opacity = mode === "reverse" ? String(VIDEO_OPACITY) : "0";
      smoothedPlaybackRate = Math.max(0.12, Math.min(1, targetPlaybackRate));
      activeVideo.playbackRate = smoothedPlaybackRate;
    };

    const updateTarget = (
      progress: number,
      direction = timelineDirection,
      scrollVelocity = 0,
      scrollRange = 1,
      mode: VideoMode = activeMode,
    ) => {
      const switchingMode = mode !== activeMode;
      showMode(mode);
      const nextProgress = Math.max(0, Math.min(1, progress));
      if (Math.abs(nextProgress - targetProgress) > 0.00001) {
        lastTargetUpdate = performance.now();
        timelineDirection = direction;
      }
      targetProgress = nextProgress;
      timelineEnd = activeMode === "forward" ? forwardEnd : reverseEnd;
      targetTime = targetProgress * timelineEnd;

      // The inactive file may still be parked at a time left over from a
      // previous pass through the page. Align it once at the hand-off so the
      // two matching frames join cleanly; subsequent forward motion remains
      // native video playback rather than a sequence of manual seeks.
      if (switchingMode && timelineEnd > 0 && !activeVideo.seeking) {
        activeVideo.pause();
        activeVideo.currentTime = targetTime;
      }

      if (timelineEnd > 0 && Math.abs(scrollVelocity) > 1) {
        targetPlaybackRate = Math.max(
          isVersion3 ? 0.08 : 0.2,
          Math.min(2.2, (Math.abs(scrollVelocity) * timelineEnd) / Math.max(1, scrollRange)),
        );
      }
    };

    const prepareForward = () => {
      if (!Number.isFinite(forward.duration) || forward.duration <= 0) return;
      forwardEnd = Math.min(FINAL_FRAME_SECONDS, Math.max(0, forward.duration - 0.06));
      forward.pause();
      if (activeMode === "forward") {
        timelineEnd = forwardEnd;
        targetTime = targetProgress * timelineEnd;
        forward.currentTime = reduce ? 0.01 : targetTime;
      }
    };

    const prepareReverse = () => {
      if (!Number.isFinite(reverse.duration) || reverse.duration <= 0) return;
      reverseEnd = Math.min(FINAL_FRAME_SECONDS, Math.max(0, reverse.duration - 0.04));
      reverse.pause();
      if (activeMode === "reverse") {
        timelineEnd = reverseEnd;
        targetTime = targetProgress * timelineEnd;
        reverse.currentTime = reduce ? reverseEnd : targetTime;
      } else {
        reverse.currentTime = 0;
      }
    };

    const driveVideo = (now: number) => {
      if (timelineEnd > 0 && !reduce && !audit) {
        const difference = targetTime - activeVideo.currentTime;
        const recentlyMoving = now - lastTargetUpdate < 520;
        const atStart = targetProgress <= 0.001;
        const atEnd = targetProgress >= 0.999;

        if (
          (atStart && activeVideo.currentTime <= 0.04) ||
          (atEnd && activeVideo.currentTime >= targetTime - 0.04)
        ) {
          activeVideo.pause();
          if (!activeVideo.seeking && Math.abs(difference) > 0.002) {
            activeVideo.currentTime = targetTime;
          }
        } else if (timelineDirection > 0) {
          if (isVersion3 && difference <= 0.018) {
            // Let native playback approach the scroll target, then hold there.
            // This prevents the reversed file from racing to its final frame
            // several sections before the fifth principle appears.
            activeVideo.pause();
          } else if (activeVideo.currentTime >= timelineEnd) {
            activeVideo.pause();
          } else if (recentlyMoving || difference > 0.01) {
            const desiredRate = Math.max(
              isVersion3 ? 0.05 : 0.08,
              Math.min(2.2, targetPlaybackRate + difference * 1.15),
            );
            const rateEase = difference < -0.04 ? 0.22 : 0.1;
            smoothedPlaybackRate += (desiredRate - smoothedPlaybackRate) * rateEase;
            activeVideo.playbackRate = smoothedPlaybackRate;
            if (activeVideo.paused) activeVideo.play().catch(() => {});
          } else if (!recentlyMoving && !activeVideo.paused) {
            activeVideo.pause();
          }
        } else if (difference < -0.006) {
          activeVideo.pause();
          if (!activeVideo.seeking && now - lastBackwardSeek > 24) {
            activeVideo.currentTime = Math.max(0, activeVideo.currentTime + difference * 0.26);
            lastBackwardSeek = now;
          }
        } else if (!activeVideo.paused) {
          activeVideo.pause();
        }
      }

      animationFrame = requestAnimationFrame(driveVideo);
    };

    if (forward.readyState >= 1) prepareForward();
    if (reverse.readyState >= 1) prepareReverse();
    forward.addEventListener("loadedmetadata", prepareForward);
    reverse.addEventListener("loadedmetadata", prepareReverse);
    animationFrame = requestAnimationFrame(driveVideo);

    const context = gsap.context(() => {
      if (!reduce && !audit) {
        ScrollTrigger.create({
          trigger: story,
          start: "top top",
          endTrigger: performanceSection,
          end: "top top",
          invalidateOnRefresh: true,
          onRefresh: (self) => {
            if (window.scrollY <= self.end + 1) {
              updateTarget(
                Math.min(1, self.progress / FINAL_FRAME_SCROLL_PROGRESS),
                self.direction,
                0,
                self.end - self.start,
                "forward",
              );
            }
          },
          onUpdate: (self) => updateTarget(
            Math.min(1, self.progress / FINAL_FRAME_SCROLL_PROGRESS),
            self.direction,
            self.getVelocity(),
            self.end - self.start,
            "forward",
          ),
        });

        ScrollTrigger.create({
          trigger: performanceSection,
          start: "bottom bottom",
          endTrigger: reverseEndSection,
          end: isVersion3 ? "top 52%" : "top 72%",
          // This range depends on pinned scenes inside the performance block.
          // Refresh it after those pins have contributed their spacer lengths,
          // otherwise the reverse animation finishes several sections too early.
          refreshPriority: isVersion3 ? -10 : 0,
          invalidateOnRefresh: true,
          onRefresh: (self) => {
            if (window.scrollY >= self.start - 1) {
              updateTarget(
                self.progress,
                self.direction,
                0,
                self.end - self.start,
                "reverse",
              );
            }
          },
          onUpdate: (self) => updateTarget(
            self.progress,
            self.direction,
            self.getVelocity(),
            self.end - self.start,
            "reverse",
          ),
          onLeave: () => updateTarget(1, 1, 0, 1, "reverse"),
          onLeaveBack: () => updateTarget(1, 1, 0, 1, "forward"),
        });
      }
    }, root);

    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      context.revert();
      cancelAnimationFrame(animationFrame);
      forward.removeEventListener("loadedmetadata", prepareForward);
      reverse.removeEventListener("loadedmetadata", prepareReverse);
      forward.pause();
      reverse.pause();
    };
  }, []);

  const mediaStyle: React.CSSProperties = {
    filter: "grayscale(0.18) sepia(0.6) saturate(0.48) hue-rotate(4deg) contrast(0.88) brightness(1.09)",
    transition: "opacity 180ms linear",
    willChange: "opacity",
  };

  return (
    <div
      ref={layer}
      aria-hidden
      data-v2-sticky-background
      className="sticky top-0 h-screen w-full overflow-hidden will-change-[opacity]"
      style={{ background: "#e4dfd4" }}
    >
      <video
        ref={reverseVideo}
        className="absolute inset-0 h-full w-full object-cover"
        src="/media/video/v2-background-reverse.mp4"
        muted
        playsInline
        preload="auto"
        style={{ ...mediaStyle, opacity: 0 }}
      />
      <video
        ref={forwardVideo}
        className="absolute inset-0 h-full w-full object-cover"
        src="/media/video/v2-background-scroll.mp4"
        muted
        playsInline
        preload="auto"
        style={{ ...mediaStyle, opacity: VIDEO_OPACITY }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(229,220,203,0.34) 0%, rgba(232,223,207,0.27) 52%, rgba(220,209,190,0.35) 100%)",
        }}
      />
    </div>
  );
}
