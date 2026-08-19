"use client";

import { createElement, useLayoutEffect, useRef, type ElementType } from "react";
import { gsap } from "@/lib/gsap";

type Props = {
  children: string;
  as?: ElementType;
  className?: string;
  style?: React.CSSProperties;
  /** darker start = more dramatic reveal (0 = from black) */
  brightness?: number;
  blur?: number;
  stagger?: number;
};

/**
 * Scroll-blur typography (after codrops "ScrollBlurTypography").
 * Splits text into characters and scrubs each from blurred+dim to sharp as the
 * element passes through the viewport.
 */
export default function BlurText({
  children,
  as = "p",
  className = "",
  style,
  brightness = 0,
  blur = 12,
  stagger = 0.045,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const chars = Array.from(el.querySelectorAll<HTMLElement>(".split-char"));
    if (!chars.length) return;

    if (reduce) {
      gsap.set(chars, { filter: "blur(0px) brightness(100%)" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        chars,
        { filter: `blur(${blur}px) brightness(${brightness}%)` },
        {
          filter: "blur(0px) brightness(100%)",
          ease: "none",
          stagger,
          scrollTrigger: {
            trigger: el,
            start: "top bottom-=12%",
            end: "bottom center+=10%",
            scrub: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [children, brightness, blur, stagger]);

  const words = children.split(" ");

  const content = words.map((word, wi) => (
    <span
      key={wi}
      style={{ display: "inline-block", whiteSpace: "nowrap" }}
      aria-hidden
    >
      {Array.from(word).map((ch, ci) => (
        <span key={ci} className="split-char">
          {ch}
        </span>
      ))}
      {wi < words.length - 1 ? <span className="split-char"> </span> : null}
    </span>
  ));

  return createElement(
    as,
    { ref, className, style, "aria-label": children },
    content
  );
}
