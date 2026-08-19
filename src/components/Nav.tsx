"use client";

import { useEffect, useState, type CSSProperties } from "react";

type NavLink = { label: string; href: string; dropdown?: boolean };

/** The site menu. "The Alpago" is the about page; "Businesses" is the Group
 *  listing page. Kept in one
 *  place so every page shows the same nav. */
const DEFAULT_LINKS: NavLink[] = [
  { label: "The Alpago", href: "/the-alpago" },
  { label: "Businesses", href: "/businesses" },
  { label: "Insights", href: "/insights" },
  { label: "Careers", href: "/careers" },
  { label: "Investors", href: "/investors" },
  { label: "Contact Us", href: "/contact" },
];

type Lenis = { stop: () => void; start: () => void };

export default function Nav({ links = DEFAULT_LINKS }: { links?: NavLink[] }) {
  const [open, setOpen] = useState(false);
  const [ar, setAr] = useState(false);

  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (open) lenis?.stop();
    else lenis?.start();
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[80]">
        <div className="relative flex w-full items-center justify-between px-6 py-9 md:px-14">
          {/* left: language switcher */}
          <div className="flex items-center text-[12px] tracking-[0.14em]">
            <button
              onClick={() => setAr((v) => !v)}
              className="transition-opacity hover:opacity-80"
              style={{
                fontFamily: "var(--font-fedra), system-ui",
                fontSize: "15px",
                color: "var(--ink)",
              }}
              aria-label="التبديل إلى العربية"
            >
              العربية
            </button>
          </div>

          {/* center: logo */}
          <a
            href="#top"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            aria-label="Alpago Properties — home"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/alpago-logo.svg"
              alt="Alpago"
              className="h-7 w-auto md:h-9"
              style={{ opacity: 0.95 }}
            />
          </a>

          {/* right: burger */}
          <button
            onClick={() => setOpen(true)}
            className="flex cursor-pointer items-center gap-3 text-[12px] tracking-[0.2em] uppercase"
            style={{ color: "var(--ink)" }}
            aria-label="Open menu"
          >
            <span className="hidden sm:inline">Menu</span>
            <span className="flex h-4 w-6 flex-col justify-between">
              <span className="block h-px w-full" style={{ background: "currentColor" }} />
              <span className="block h-px w-full" style={{ background: "currentColor" }} />
              <span className="block h-px w-full" style={{ background: "currentColor" }} />
            </span>
          </button>
        </div>
      </header>

      {/* fullscreen overlay menu.
          overflow-hidden + pointer-events are load-bearing: while closed, each link is
          individually offset translateY(120%) for the stagger, which pushes them back
          down past the panel's own -100% and into the top of the viewport, where they
          silently swallow the click meant for the burger. */}
      <div
        className="nav-overlay fixed inset-0 z-[90] flex flex-col overflow-hidden"
        style={{
          transform: open ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 0.9s cubic-bezier(0.76,0,0.24,1)",
          pointerEvents: open ? "auto" : "none",
        }}
        aria-hidden={!open}
      >
        <div className="mx-auto flex w-full max-w-[1560px] items-center justify-between gap-5 px-6 py-6 md:gap-[100px] md:px-12">
          <form
            action="/search"
            method="get"
            onSubmit={() => setOpen(false)}
            role="search"
            className="ml-11 mt-5 flex h-12 min-w-0 flex-1 md:h-14"
          >
            <label htmlFor="menu-search" className="sr-only">Search the Alpago website</label>
            <input
              id="menu-search"
              name="q"
              type="search"
              autoComplete="off"
              placeholder="Search"
              className="alpago-field h-full min-w-0 flex-1 border bg-transparent px-5 text-[15px] outline-none placeholder:text-[color:var(--ink-dim)] md:px-6 md:text-[16px]"
              style={{ "--field-border": "var(--line-strong)", color: "var(--ink)", fontFamily: "var(--font-social), sans-serif" } as CSSProperties}
            />
            <button type="submit" className="alpago-dark-button caption shrink-0 cursor-pointer px-5 outline-none transition-[background-color,color,box-shadow] duration-500 focus-visible:ring-1 focus-visible:ring-[color:var(--bronze-hi)] md:px-8" style={{ letterSpacing: "0.14em" }}>
              Search
            </button>
          </form>

          <button
            onClick={() => setOpen(false)}
            className="flex cursor-pointer items-center gap-3 text-[12px] tracking-[0.2em] uppercase"
            style={{ color: "var(--ink)" }}
            aria-label="Close menu"
          >
            <span className="hidden sm:inline">Close</span>
            <span className="relative block h-4 w-4">
              <span
                className="absolute left-0 top-1/2 block h-px w-full"
                style={{ background: "currentColor", transform: "rotate(45deg)" }}
              />
              <span
                className="absolute left-0 top-1/2 block h-px w-full"
                style={{ background: "currentColor", transform: "rotate(-45deg)" }}
              />
            </span>
          </button>
        </div>

        <nav className="mx-auto flex w-full max-w-[1560px] flex-1 flex-col justify-center gap-3 px-6 md:gap-4 md:px-12">
          {links.map((l, i) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="group flex items-baseline gap-6 overflow-hidden"
              style={{
                transform: open ? "translateY(0)" : "translateY(120%)",
                opacity: open ? 1 : 0,
                transition: `transform 0.9s cubic-bezier(0.22,1,0.36,1) ${
                  0.15 + i * 0.07
                }s, opacity 0.6s ease ${0.15 + i * 0.07}s`,
              }}
            >
              <span
                className="caption"
                style={{ fontSize: "0.6rem", color: "var(--bronze)", minWidth: "2ch" }}
              >
                0{i + 1}
              </span>
              <span
                className="display flex items-center gap-3 transition-transform duration-500 group-hover:translate-x-2"
                style={{ fontSize: "clamp(2.1rem, 6.2vw, 5rem)", lineHeight: 1.02 }}
              >
                {l.label}
                {l.dropdown && (
                  <svg width="0.5em" height="0.5em" viewBox="0 0 24 24" fill="none" aria-hidden style={{ opacity: 0.6 }}>
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
