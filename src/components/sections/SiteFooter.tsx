"use client";

import { useRef, useState, type CSSProperties, type FormEvent } from "react";
import { usePathname } from "next/navigation";
import Reveal from "@/components/Reveal";
import EnquiryDrawer from "@/components/sections/EnquiryDrawer";

const NAV = ["Alpago Way", "Businesses", "Insights", "Careers", "Investors", "Contact Us"];

const OFFICES: [string, string][] = [
  ["Head Office", "Boulevard Plaza Tower, Downtown Dubai"],
  ["Technical Office", "Golden Mile, Palm Jumeirah, Dubai"],
  ["Manufacturing Unit", "Dubai Investment Park 02, Dubai"],
  ["Turkey Office", "Vadistanbul / Sarıyer, Istanbul"],
];

const SOCIALS: [string, string][] = [
  ["TikTok", "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-2.31-2.83v-3.5a6.37 6.37 0 1 0 5.76 6.33V8.69a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.12z"],
  ["LinkedIn", "M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z"],
  ["Facebook", "M13.5 21v-8.25h2.77l.41-3.22H13.5V7.47c0-.93.26-1.57 1.6-1.57h1.7V3.02c-.29-.04-1.3-.13-2.47-.13-2.45 0-4.12 1.49-4.12 4.23v2.41H7.5v3.22h2.71V21h3.29z"],
  ["YouTube", "M21.58 7.19a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.82.42A2.5 2.5 0 0 0 2.42 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .42 4.81 2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.82-.42a2.5 2.5 0 0 0 1.76-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.42-4.81zM10 15V9l5.2 3z"],
  ["Instagram", "M12 2.2c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85C2.42 3.92 3.94 2.38 7.15 2.27 8.42 2.21 8.8 2.2 12 2.2zm0 3.6a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zm0 2.2a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm6.44-2.7a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"],
];

const CTA_ROUTES = new Set([
  "/the-alpago",
  "/businesses/alpago-properties",
  "/businesses/alpago-design-build",
  "/businesses/f1rst-motors",
]);

export default function SiteFooter({
  ctaTitle = "Explore the properties where quality speaks for itself",
  ctaLabel = "Make an enquiry",
  ctaHref = "#contact",
  showCta,
}: {
  ctaTitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  showCta?: boolean;
}) {
  const pathname = usePathname();
  const [newsletterError, setNewsletterError] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const enquiryTrigger = useRef<HTMLButtonElement>(null);
  const shouldShowCta = showCta !== false && CTA_ROUTES.has(pathname);
  const isEnquiryCta = ctaLabel.trim().toLowerCase() === "make an enquiry";

  const closeEnquiry = () => {
    setEnquiryOpen(false);
    requestAnimationFrame(() => enquiryTrigger.current?.focus());
  };

  function handleNewsletterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const email = String(new FormData(event.currentTarget).get("email") ?? "").trim();
    setNewsletterError(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  }

  return (
    <footer
      id="contact"
      className={`relative px-6 pb-10 md:px-14 ${shouldShowCta ? "pt-[14vh]" : "pt-10"}`}
    >
      <div className="w-full">
        {/* the enquiry CTA — centred, on its own. The newsletter now lives down in the
            brand row, filling the space beside the wordmark. */}
        {shouldShowCta && <div className="mx-auto flex w-full max-w-[620px] flex-col items-center pb-[11vh]">
          <Reveal className="w-full">
            <div className="flex flex-col items-center gap-9 text-center">
              <p
                className="display m-0"
                style={{ fontSize: "clamp(1.4rem, 2.6vw, 34px)", lineHeight: 1.25, color: "var(--ink)", maxWidth: "22ch" }}
              >
                {ctaTitle}
              </p>
              {isEnquiryCta ? (
                <button
                  ref={enquiryTrigger}
                  type="button"
                  onClick={() => setEnquiryOpen(true)}
                  className="alpago-dark-button caption inline-block cursor-pointer px-10 py-4 outline-none transition-[background-color,color,box-shadow] duration-500 focus-visible:ring-1 focus-visible:ring-[color:var(--bronze-hi)]"
                  style={{ letterSpacing: "0.14em" }}
                >
                  {ctaLabel}
                </button>
              ) : (
                <a
                  href={ctaHref}
                  className="alpago-dark-button caption inline-block px-10 py-4 transition-[background-color,color,box-shadow] duration-500"
                  style={{ letterSpacing: "0.14em" }}
                >
                  {ctaLabel}
                </a>
              )}
            </div>
          </Reveal>
        </div>}

        {/* (brand + socials + newsletter) | site nav */}
        <div
          className="flex flex-col justify-between gap-10 border-t pt-12 md:flex-row md:items-start"
          style={{ borderColor: "var(--line)" }}
        >
          <div>
            <div className="display" style={{ fontSize: "clamp(1.8rem, 2.6vw, 40px)", letterSpacing: "0.06em" }}>
              Alpago
            </div>
            <div className="mt-5 flex gap-3">
              {SOCIALS.map(([label, glyph]) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-full transition-colors duration-300"
                  style={{ border: "1px solid var(--ink-faint)", color: "var(--ink)" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d={glyph} />
                  </svg>
                </a>
              ))}
            </div>

            {/* newsletter — under the wordmark and socials */}
            <Reveal className="mt-9" y={16} blur={4}>
              <form noValidate onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3">
                <span className="caption" style={{ color: "var(--ink-dim)", letterSpacing: "0.16em" }}>
                  Stay connected to the Alpago world
                </span>
                <div className="flex w-full md:w-[420px]">
                  <input
                    type="email"
                    name="email"
                    placeholder="E-mail"
                    aria-invalid={newsletterError}
                    aria-describedby={newsletterError ? "newsletter-error" : undefined}
                    onChange={() => newsletterError && setNewsletterError(false)}
                    className="alpago-field w-full border bg-transparent px-5 py-3.5 text-[14px] outline-none"
                    style={{ "--field-border": "var(--ink-faint)", color: "var(--ink)" } as CSSProperties}
                  />
                  <button
                    type="submit"
                    className="alpago-dark-button caption px-8"
                    style={{ letterSpacing: "0.14em" }}
                  >
                    Join
                  </button>
                </div>
                {newsletterError && (
                  <div id="newsletter-error" role="alert" className="alpago-form-notice md:w-[420px]">
                    <span aria-hidden className="alpago-form-notice-icon">!</span>
                    Please enter a valid email address.
                  </div>
                )}
              </form>
            </Reveal>
          </div>

          {/* two columns of larger, left-aligned links so the block fills the space
              beside the brand rather than trailing down one thin column. justify-items
              keeps each link content-width, so the hover underline hugs the text. */}
          <nav className="grid grid-cols-2 justify-items-start gap-x-14 gap-y-6 md:mr-16">
            {NAV.map((item) => (
              <a
                key={item}
                href={item === "Investors" ? "/investors" : item === "Businesses" ? "/businesses" : item === "Insights" ? "/insights" : item === "Alpago Way" ? "/the-alpago" : item === "Careers" ? "/careers" : item === "Contact Us" ? "/contact" : "#"}
                className="caption link-underline"
                style={{ color: "var(--ink)", fontSize: "15px", letterSpacing: "0.16em" }}
              >
                {item}
              </a>
            ))}
          </nav>
        </div>

        {/* offices */}
        <div
          className="mt-14 grid grid-cols-1 gap-12 border-t pt-14 pb-4 sm:grid-cols-2 lg:grid-cols-4"
          style={{ borderColor: "var(--line)" }}
        >
          {OFFICES.map(([label, addr]) => (
            <div key={label}>
              <div className="display mb-4" style={{ fontSize: "23px", color: "var(--ink)" }}>
                {label}
              </div>
              <div className="text-[15.5px] leading-relaxed" style={{ color: "var(--ink-dim)" }}>
                {addr}
              </div>
            </div>
          ))}
        </div>

        {/* bottom bar */}
        <div
          className="mt-14 flex flex-col items-center justify-between gap-4 border-t pt-8 text-[12px] tracking-[0.1em] md:flex-row"
          style={{ borderColor: "var(--line)", color: "var(--ink-faint)" }}
        >
          <span>© Alpago {new Date().getFullYear()}. All Rights Reserved.</span>
          <div className="flex gap-8">
            <a className="link-underline" href="/terms-and-conditions">
              Terms &amp; Conditions
            </a>
            <a className="link-underline" href="/privacy-policy">
              Privacy Policy
            </a>
          </div>
          <span>
            Made with <span style={{ color: "var(--bronze-hi)" }}>♥</span> by tentwenty
          </span>
        </div>
      </div>
      {shouldShowCta && isEnquiryCta && <EnquiryDrawer open={enquiryOpen} onClose={closeEnquiry} />}
    </footer>
  );
}
