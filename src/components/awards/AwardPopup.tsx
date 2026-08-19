"use client";

import { createPortal } from "react-dom";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";

export type AwardDetails = {
  tag: string;
  name: string;
  caption: string;
  description?: string;
};

type AwardPopupProps = {
  award: AwardDetails | null;
  onClose: () => void;
};

const LOGOS: Record<string, string> = {
  "RAED Ventures": "/media/awards/raed-ventures.png",
  "Construction Week": "/media/awards/construction-week.png",
};

const DEFAULT_DESCRIPTION =
  "This recognition reflects Alpago’s commitment to considered design, uncompromising quality and the creation of places with enduring value.";

function getAwardCopy(award: AwardDetails) {
  const parts = award.caption.split(/\s+[—–-]\s+/);
  return {
    title: parts[0] || award.name,
    recognition: parts.slice(1).join(" — "),
  };
}

export default function AwardPopup({ award, onClose }: AwardPopupProps) {
  const [mounted, setMounted] = useState(false);
  const [renderedAward, setRenderedAward] = useState<AwardDetails | null>(award);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const open = Boolean(award);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (award) setRenderedAward(award);
  }, [award]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    document.body.style.overflow = "hidden";
    lenis?.stop();
    requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      lenis?.start();
    };
  }, [open]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key !== "Tab") return;

    const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
    );
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  if (!mounted || !renderedAward) return null;

  const { title, recognition } = getAwardCopy(renderedAward);
  const logo = LOGOS[renderedAward.name];

  return createPortal(
    <div
      className={`fixed inset-0 z-[160] transition-[visibility] duration-700 ${open ? "visible" : "invisible"}`}
      aria-hidden={!open}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        aria-label="Close award details"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
        className={`ease-alpago absolute inset-0 h-full w-full cursor-default bg-[rgba(28,20,14,0.48)] backdrop-blur-[2px] transition-opacity duration-700 ${open ? "opacity-100" : "opacity-0"}`}
      />

      <div
        ref={panelRef}
        data-lenis-prevent
        role="dialog"
        aria-modal="true"
        aria-labelledby="award-popup-title"
        className={`ease-alpago-panel absolute inset-y-0 right-0 w-full touch-pan-y overflow-y-auto overscroll-contain shadow-[-28px_0_70px_rgba(29,19,11,0.18)] transition-transform duration-700 md:w-1/2 ${open ? "translate-x-0" : "translate-x-full"}`}
        style={
          {
            background: "#e0dcd1",
            color: "#332a2a",
            "--bg": "#e0dcd1",
            "--ink": "#332a2a",
            "--ink-dim": "rgba(51,42,42,0.66)",
            "--ink-faint": "rgba(51,42,42,0.36)",
            "--bronze-hi": "#7d5c2f",
            "--line": "rgba(51,42,42,0.14)",
            "--line-strong": "rgba(51,42,42,0.26)",
            "--btn-ink": "#e8e4d9",
          } as CSSProperties
        }
      >
        <div className="flex min-h-full flex-col px-6 pb-16 pt-6 sm:px-10 sm:pt-10 md:px-12 md:pb-20 md:pt-12 lg:px-16 lg:pt-16">
          <div className="flex items-start justify-between gap-8">
            <div
              className="flex h-[168px] w-[168px] shrink-0 items-center justify-center overflow-hidden rounded-[3px] border border-[color:var(--line)] p-7 sm:h-[212px] sm:w-[212px] sm:p-8"
              style={{ background: "var(--bg)" }}
            >
              {logo ? (
                <div
                  role="img"
                  aria-label={`${renderedAward.name} logo`}
                  className="h-full w-full object-contain"
                  style={{
                    background: "var(--bronze-hi)",
                    WebkitMaskImage: `url(${logo})`,
                    maskImage: `url(${logo})`,
                    WebkitMaskPosition: "center",
                    maskPosition: "center",
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                    WebkitMaskSize: "contain",
                    maskSize: "contain",
                  }}
                />
              ) : (
                <span className="display text-center text-[30px] leading-tight tracking-[0.08em] text-[color:var(--bronze-hi)]">
                  {renderedAward.name}
                </span>
              )}
            </div>

            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Close award details"
              onClick={onClose}
              tabIndex={open ? 0 : -1}
              className="ease-alpago grid h-[52px] w-[52px] shrink-0 cursor-pointer place-items-center border border-[color:var(--line-strong)] text-[28px] font-light leading-none text-[color:var(--ink)] outline-none transition-[background-color,border-color,color,transform] duration-500 hover:rotate-90 hover:border-[#876540] hover:bg-[#876540] hover:text-[#f1eadf] focus-visible:ring-1 focus-visible:ring-[color:var(--bronze-hi)]"
            >
              ×
            </button>
          </div>

          <div key={`${renderedAward.name}-${renderedAward.caption}`} className="mt-10 animate-[bc-in_0.5s_var(--ease)_both]">
            <span
              className="inline-flex border border-[color:var(--line)] px-4 py-2 text-[13px] leading-none text-[color:var(--bronze-hi)]"
              style={{ fontFamily: "var(--font-social), sans-serif" }}
            >
              {renderedAward.tag}
            </span>

            <div className="mt-10 border-t border-[color:var(--line)] pt-8">
              <h2
                id="award-popup-title"
                className="display text-[clamp(2.2rem,4vw,56px)] leading-[1.02] text-[color:var(--bronze-hi)]"
              >
                {title}
              </h2>
              {recognition && (
                <p className="caption mt-4 leading-[1.6]" style={{ color: "var(--bronze-hi)", letterSpacing: "0.15em" }}>
                  {recognition}
                </p>
              )}
              <p
                className="mt-8 max-w-[58ch] text-[16px] leading-[1.75] text-[color:var(--ink)]"
                style={{ fontFamily: "var(--font-social), sans-serif" }}
              >
                {renderedAward.description ?? DEFAULT_DESCRIPTION}
              </p>
              <p
                className="mt-6 max-w-[58ch] text-[16px] leading-[1.75] text-[color:var(--ink-dim)]"
                style={{ fontFamily: "var(--font-social), sans-serif" }}
              >
                Presented by {renderedAward.name}, the award acknowledges the teams, partners and specialists behind the achievement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
