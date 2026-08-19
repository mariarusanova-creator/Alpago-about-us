"use client";

import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import AlpagoSelect from "@/components/ui/AlpagoSelect";

const COUNTRY_CODES = ["+971", "+90", "+44", "+1"].map((value) => ({ value, label: value }));
const REQUIRED_FIELDS = ["firstName", "lastName", "email"] as const;
const FIELD_CLASS =
  "alpago-field h-14 w-full border bg-transparent px-5 outline-none transition-colors duration-300 placeholder:text-[color:var(--ink-dim)]";

type EnquiryDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export default function EnquiryDrawer({ open, onClose }: EnquiryDrawerProps) {
  const [mounted, setMounted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

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
      'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next = REQUIRED_FIELDS.filter((name) => !String(data.get(name) ?? "").trim());
    const email = String(data.get("email") ?? "").trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !next.includes("email")) next.push("email");
    setErrors(next);
  };

  const clearError = (name: string) => {
    setErrors((current) => current.filter((field) => field !== name));
  };

  const fieldStyle = (name: string): CSSProperties => ({
    color: "var(--ink)",
    "--field-border": errors.includes(name) ? "var(--error)" : "var(--line-strong)",
  } as CSSProperties);

  if (!mounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[120] transition-[visibility] duration-700 ${open ? "visible" : "invisible"}`}
      aria-hidden={!open}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        aria-label="Close enquiry form"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
        className={`ease-alpago absolute inset-0 h-full w-full cursor-default bg-[rgba(28,20,14,0.42)] backdrop-blur-[2px] transition-opacity duration-700 ${open ? "opacity-100" : "opacity-0"}`}
      />

      <div
        ref={panelRef}
        data-lenis-prevent
        role="dialog"
        aria-modal="true"
        aria-labelledby="enquiry-drawer-title"
        className={`ease-alpago-panel absolute inset-y-0 right-0 w-full touch-pan-y overflow-y-auto overscroll-contain p-6 pb-12 pt-24 shadow-[-28px_0_70px_rgba(29,19,11,0.16)] transition-transform duration-700 md:w-1/2 md:p-10 md:pb-14 md:pt-24 lg:p-14 lg:pb-16 lg:pt-24 xl:p-16 xl:pb-16 xl:pt-24 ${open ? "translate-x-0" : "translate-x-full"}`}
        style={{
          background: "#e0dcd1",
          color: "#332a2a",
          "--bg": "#e0dcd1",
          "--ink": "#332a2a",
          "--ink-dim": "rgba(51,42,42,0.62)",
          "--ink-faint": "rgba(51,42,42,0.36)",
          "--bronze-hi": "#7d5c2f",
          "--error": "#a14e3f",
          "--line": "rgba(51,42,42,0.14)",
          "--line-strong": "rgba(51,42,42,0.26)",
          "--btn-ink": "#e8e4d9",
        } as CSSProperties}
      >
        <button
          ref={closeButtonRef}
          type="button"
          aria-label="Close enquiry form"
          onClick={onClose}
          tabIndex={open ? 0 : -1}
          className="ease-alpago absolute right-6 top-6 grid h-11 w-11 cursor-pointer place-items-center border border-[color:var(--line-strong)] text-2xl font-light text-[color:var(--ink)] outline-none transition-[background-color,border-color,color,transform] duration-500 hover:rotate-90 hover:border-[#876540] hover:bg-[#876540] hover:text-[#f1eadf] focus-visible:ring-1 focus-visible:ring-[color:var(--bronze-hi)] md:right-10 md:top-8"
        >
          ×
        </button>

        <div className="mx-auto w-full max-w-[590px]">
          <span className="caption block" style={{ color: "var(--bronze-hi)", letterSpacing: "0.18em" }}>
            Contact Alpago
          </span>
          <h2 id="enquiry-drawer-title" className="display mt-4 text-[clamp(2.8rem,5vw,68px)] leading-[0.98]" style={{ color: "var(--bronze-hi)" }}>
            Make an Enquiry
          </h2>
          <p className="mt-5 max-w-[42ch] text-[16px] leading-[1.7]" style={{ color: "var(--ink)", fontFamily: "var(--font-social), sans-serif" }}>
            Complete the form and our team will respond to your enquiry.
          </p>

          <form noValidate className="mt-9 grid gap-4" onSubmit={handleSubmit}>
            <input name="firstName" aria-label="First Name" aria-invalid={errors.includes("firstName")} placeholder="First Name *" className={FIELD_CLASS} style={fieldStyle("firstName")} onChange={() => clearError("firstName")} />
            <input name="lastName" aria-label="Last Name" aria-invalid={errors.includes("lastName")} placeholder="Last Name *" className={FIELD_CLASS} style={fieldStyle("lastName")} onChange={() => clearError("lastName")} />
            <input name="email" type="email" aria-label="Email Address" aria-invalid={errors.includes("email")} placeholder="Email Address *" className={FIELD_CLASS} style={fieldStyle("email")} onChange={() => clearError("email")} />
            <input name="company" aria-label="Company Name" placeholder="Company Name" className={FIELD_CLASS} style={fieldStyle("company")} />

            <div className="grid grid-cols-[108px_minmax(0,1fr)] gap-4 sm:grid-cols-[132px_minmax(0,1fr)]">
              <AlpagoSelect ariaLabel="Country calling code" name="countryCode" options={COUNTRY_CODES} defaultValue="+971" style={fieldStyle("phone")} />
              <input name="phone" type="tel" aria-label="Phone Number" placeholder="Phone Number" className={`${FIELD_CLASS} min-w-0`} style={fieldStyle("phone")} />
            </div>

            <textarea name="message" aria-label="Message" placeholder="Message" className="alpago-field min-h-[150px] w-full resize-none border bg-transparent p-5 outline-none transition-colors duration-300 placeholder:text-[color:var(--ink-dim)]" style={fieldStyle("message")} />

            {errors.length > 0 && (
              <div role="alert" className="alpago-form-notice">
                <span aria-hidden className="alpago-form-notice-icon">!</span>
                Please complete the highlighted fields.
              </div>
            )}

            <button type="submit" className="alpago-dark-button caption mt-2 w-fit px-10 py-4 outline-none transition-[background-color,color,box-shadow] duration-500 focus-visible:ring-1 focus-visible:ring-[color:var(--bronze-hi)]" style={{ letterSpacing: "0.15em" }}>
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>,
    document.body,
  );
}
