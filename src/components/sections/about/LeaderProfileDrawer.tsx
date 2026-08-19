"use client";

import { createPortal } from "react-dom";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";

export type AlpagoLeader = {
  name: string;
  role: string;
  image: string;
  copy: string;
  biography: string;
};

type LeaderProfileDrawerProps = {
  leaders: readonly AlpagoLeader[];
  activeIndex: number;
  open: boolean;
  onChange: (index: number) => void;
  onClose: () => void;
};

export default function LeaderProfileDrawer({ leaders, activeIndex, open, onChange, onClose }: LeaderProfileDrawerProps) {
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const leader = leaders[activeIndex];

  useEffect(() => setMounted(true), []);

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

  const showPrevious = () => onChange((activeIndex - 1 + leaders.length) % leaders.length);
  const showNext = () => onChange((activeIndex + 1) % leaders.length);

  if (!mounted || !leader) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[120] transition-[visibility] duration-700 ${open ? "visible" : "invisible"}`}
      aria-hidden={!open}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        aria-label="Close leadership profile"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
        className={`ease-alpago absolute inset-0 h-full w-full cursor-default bg-[rgba(28,20,14,0.46)] backdrop-blur-[2px] transition-opacity duration-700 ${open ? "opacity-100" : "opacity-0"}`}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="leader-profile-name"
        className={`ease-alpago-panel absolute inset-y-0 right-0 w-full overflow-hidden shadow-[-28px_0_70px_rgba(29,19,11,0.18)] transition-transform duration-700 md:w-[52vw] md:max-w-[760px] ${open ? "translate-x-0" : "translate-x-full"}`}
        style={{
          background: "#e0dcd1",
          color: "#332a2a",
          "--bg": "#e0dcd1",
          "--ink": "#332a2a",
          "--ink-dim": "rgba(51,42,42,0.68)",
          "--ink-faint": "rgba(51,42,42,0.36)",
          "--bronze-hi": "#7d5c2f",
          "--line": "rgba(51,42,42,0.14)",
          "--line-strong": "rgba(51,42,42,0.26)",
          "--btn-ink": "#e8e4d9",
        } as CSSProperties}
      >
        <button
          ref={closeButtonRef}
          type="button"
          aria-label="Close leadership profile"
          onClick={onClose}
          tabIndex={open ? 0 : -1}
          className="ease-alpago absolute right-6 top-6 z-10 grid h-11 w-11 cursor-pointer place-items-center border border-[color:var(--line-strong)] text-2xl font-light text-[color:var(--ink)] outline-none transition-[background-color,border-color,color,transform] duration-500 hover:rotate-90 hover:border-[#876540] hover:bg-[#876540] hover:text-[#f1eadf] focus-visible:ring-1 focus-visible:ring-[color:var(--bronze-hi)] md:right-12 md:top-12"
        >
          ×
        </button>

        <div data-lenis-prevent className="h-full touch-pan-y overflow-y-auto overscroll-contain">
          <div className="flex min-h-full flex-col px-6 pb-36 pt-24 md:px-12 md:pb-40 md:pt-16 lg:px-16">
            <div className="relative h-[260px] w-[254px] shrink-0 overflow-hidden border border-[color:var(--line)] sm:h-[300px] sm:w-[292px]" style={{ background: "linear-gradient(145deg, #ebe7dd 0%, #d7d1c3 100%)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img key={leader.image} src={leader.image} alt={leader.name} className="absolute inset-x-[-7%] bottom-0 object-contain object-bottom" style={{ height: "96%", width: "114%" }} />
            </div>

            <div key={leader.name} className="mt-7 animate-[bc-in_0.5s_var(--ease)_both]">
              <h2 id="leader-profile-name" className="display text-[clamp(2.25rem,4vw,54px)] leading-[1]" style={{ color: "var(--bronze-hi)", letterSpacing: "-0.03em" }}>
                {leader.name}
              </h2>
              <p className="caption mt-3" style={{ color: "var(--bronze-hi)", letterSpacing: "0.17em" }}>
                {leader.role}
              </p>
              <p className="mt-7 max-w-[62ch] text-[16px] leading-[1.75]" style={{ color: "var(--ink)", fontFamily: "var(--font-social), sans-serif" }}>
                {leader.biography}
              </p>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28" style={{ background: "linear-gradient(to top, #e0dcd1 58%, rgba(224,220,209,0))" }} />
        <div className="absolute bottom-6 left-6 right-6 z-20 flex items-end justify-between gap-8 md:bottom-12 md:left-12 md:right-12 lg:left-16 lg:right-16">
          <div className="flex gap-3">
            <button type="button" onClick={showPrevious} aria-label="Previous leader" className="grid h-12 w-12 cursor-pointer place-items-center border border-[color:var(--line-strong)] text-[color:var(--ink)] outline-none transition-[background-color,border-color,color] duration-500 hover:border-[#876540] hover:bg-[#876540] hover:text-[#f1eadf] focus-visible:ring-1 focus-visible:ring-[color:var(--bronze-hi)]">
              <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M10 7l-5 5 5 5" /></svg>
            </button>
            <button type="button" onClick={showNext} aria-label="Next leader" className="alpago-dark-button grid h-12 w-12 cursor-pointer place-items-center outline-none transition-[background-color,color,box-shadow] duration-500 focus-visible:ring-1 focus-visible:ring-[color:var(--bronze-hi)]">
              <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M14 7l5 5-5 5" /></svg>
            </button>
          </div>

          <div className="flex gap-3">
            <a href="#" onClick={(event) => event.preventDefault()} aria-label={`${leader.name} on X`} className="grid h-10 w-10 place-items-center border border-[color:var(--ink-faint)] text-[color:var(--ink)] transition-[background-color,border-color,color] duration-300 hover:border-[#876540] hover:bg-[#876540] hover:text-[#f1eadf]">
              <svg aria-hidden viewBox="0 0 24 24" className="h-[15px] w-[15px]" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" /></svg>
            </a>
            <a href="#" onClick={(event) => event.preventDefault()} aria-label={`${leader.name} on LinkedIn`} className="grid h-10 w-10 place-items-center border border-[color:var(--ink-faint)] text-[color:var(--ink)] transition-[background-color,border-color,color] duration-300 hover:border-[#876540] hover:bg-[#876540] hover:text-[#f1eadf]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" /></svg>
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
