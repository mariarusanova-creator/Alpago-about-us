"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/** Simple on-enter fade/rise used for captions, paragraphs, buttons. */
export default function Reveal({
  children,
  className = "",
  y = 26,
  delay = 0,
  blur = 6,
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
  delay?: number;
  blur?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y, filter: `blur(${blur}px)` },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.1,
          delay,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top bottom-=12%" },
        }
      );
    }, el);
    return () => ctx.revert();
  }, [y, delay, blur]);

  return (
    <div
      ref={ref}
      className={`reveal-el ${className}`}
      style={{ visibility: "hidden" }}
    >
      {children}
    </div>
  );
}
