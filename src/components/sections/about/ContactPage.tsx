"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import AlpagoSelect from "@/components/ui/AlpagoSelect";

const GOLD: React.CSSProperties = {
  backgroundImage: "linear-gradient(180deg, var(--gold-1) 0%, var(--gold-2) 48%, var(--gold-3) 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
};

const OFFICES = [
  {
    name: "Head Office",
    titleLines: ["Head", "Office"],
    address: "Boulevard Plaza Tower, Downtown Dubai",
    city: "Dubai, UAE",
    query: "Boulevard Plaza Tower Downtown Dubai",
  },
  {
    name: "Technical Office",
    titleLines: ["Technical", "Office"],
    address: "Golden Mile, Palm Jumeirah, Dubai",
    city: "Dubai, UAE",
    query: "Golden Mile Palm Jumeirah Dubai",
  },
  {
    name: "Manufacturing Unit",
    titleLines: ["Manufacturing", "Unit"],
    address: "Dubai Investment Park 02, Dubai",
    city: "Dubai, UAE",
    query: "Dubai Investment Park 2 Dubai",
  },
  {
    name: "Turkey Office",
    titleLines: ["Turkey", "Office"],
    address: "Vadistanbul / Sarıyer, Istanbul",
    city: "Istanbul, Türkiye",
    query: "Vadistanbul Sariyer Istanbul",
  },
] as const;

const REQUIRED_FIELDS = ["firstName", "lastName", "email", "subject"] as const;
const COUNTRY_CODES = ["+971", "+90", "+44", "+1"].map((value) => ({ value, label: value }));
const SUBJECTS = [
  { value: "", label: "Subject of Enquiry *", disabled: true },
  { value: "Property Enquiry", label: "Property Enquiry" },
  { value: "Business Partnership", label: "Business Partnership" },
  { value: "Media & Press", label: "Media & Press" },
  { value: "Careers", label: "Careers" },
  { value: "General Enquiry", label: "General Enquiry" },
];

export default function ContactPage() {
  const [errors, setErrors] = useState<string[]>([]);
  const [officeCursor, setOfficeCursor] = useState(0);
  const officeTrack = useRef<HTMLDivElement>(null);

  const moveOffices = (direction: -1 | 1) => {
    const track = officeTrack.current;
    if (!track) return;
    setOfficeCursor((current) => {
      const next = Math.max(0, Math.min(OFFICES.length - 1, current + direction));
      const target = track.children.item(next) as HTMLElement | null;
      if (target) {
        const trackLeft = track.getBoundingClientRect().left;
        const targetLeft = target.getBoundingClientRect().left;
        track.scrollTo({ left: track.scrollLeft + targetLeft - trackLeft, behavior: "smooth" });
      }
      return next;
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next = REQUIRED_FIELDS.filter((name) => !String(data.get(name) ?? "").trim());
    const email = String(data.get("email") ?? "").trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !next.includes("email")) next.push("email");
    setErrors(next);
  };

  const clearFormError = (name: string) => {
    setErrors((current) => current.filter((field) => field !== name));
  };

  const fieldStyle = (name: string): React.CSSProperties => ({
    color: "var(--ink)",
    "--field-border": errors.includes(name) ? "var(--error)" : "var(--line-strong)",
  } as React.CSSProperties);

  return (
    <main className="section-bg min-h-screen">
      <header className="px-6 pb-6 pt-36 md:px-14 md:pb-8 md:pt-44">
        <div className="caption flex items-center gap-3" style={{ color: "var(--ink-faint)", letterSpacing: "0.22em" }}>
          <Link href="/" className="link-underline">Home</Link>
          <span>/</span>
          <span style={{ color: "var(--bronze-hi)" }}>Contact</span>
        </div>
        <h1 className="display mt-14 text-[clamp(3.5rem,8vw,112px)] leading-[0.9]" style={GOLD}>Contact Us</h1>
      </header>

      <section aria-labelledby="offices-title" className="overflow-hidden px-6 pb-[167px] pt-14 md:px-14 md:pt-20">
        <div className="mb-10 flex items-end justify-between gap-8 md:mb-12">
          <div>
            <span className="caption" style={{ color: "var(--bronze-hi)", letterSpacing: "0.2em" }}>Our Contact Details</span>
            <h2 id="offices-title" className="display mt-4 text-[clamp(2.6rem,5vw,68px)] leading-none" style={GOLD}>Our Offices</h2>
          </div>
          <div className="flex shrink-0 gap-3">
            {([-1, 1] as const).map((direction) => (
              <button
                key={direction}
                type="button"
                onClick={() => moveOffices(direction)}
                disabled={direction < 0 ? officeCursor === 0 : officeCursor === OFFICES.length - 1}
                aria-label={direction < 0 ? "Previous offices" : "Next offices"}
                className="group grid h-12 w-12 place-items-center border text-[color:var(--ink)] transition-[background-color,color,border-color,opacity] duration-500 hover:border-[color:var(--ink)] hover:bg-[color:var(--ink)] hover:text-[color:var(--btn-ink)] disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[color:var(--ink)]"
                style={{ borderColor: "rgba(43,34,26,0.3)" }}
              >
                <svg aria-hidden viewBox="0 0 28 28" className={`h-6 w-6 ${direction < 0 ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M5 14h18M17 8l6 6-6 6" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        <div
          ref={officeTrack}
          className="-mr-6 flex snap-x snap-mandatory gap-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:-mr-14 md:gap-6"
        >
          {OFFICES.map((office, index) => (
            <article
              key={office.name}
              className="group flex min-h-[430px] w-[84vw] max-w-[430px] shrink-0 snap-start flex-col rounded-[7px] p-7 [transform:translate3d(0,0,0)] will-change-transform hover:[transform:translate3d(0,-8px,0)] hover:shadow-[0_24px_56px_rgba(36,24,15,0.08)] sm:w-[62vw] md:min-h-[470px] md:p-9 lg:w-[38vw] xl:w-[31vw] xl:max-w-none"
              style={{
                background: "rgba(126,91,56,0.09)",
                transition:
                  "transform 950ms cubic-bezier(0.22,1,0.36,1), box-shadow 950ms cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              <div className="flex items-start justify-between gap-6">
                <span className="caption" style={{ color: "var(--bronze-hi)", letterSpacing: "0.18em" }}>Office</span>
                <span className="caption" style={{ color: "var(--ink)", opacity: 0.56, letterSpacing: "0.14em" }}>
                  {String(index + 1).padStart(2, "0")} / {String(OFFICES.length).padStart(2, "0")}
                </span>
              </div>

              <h3 className="display mt-8 max-w-[11ch] text-[clamp(2rem,3.2vw,46px)] leading-[1.02]" style={{ color: "var(--ink)" }}>
                {office.titleLines.map((line) => <span key={line} className="block">{line}</span>)}
              </h3>
              <div className="mt-8 border-t pt-7" style={{ borderColor: "rgba(43,34,26,0.2)" }}>
                <span className="caption" style={{ color: "var(--ink)", opacity: 0.58, letterSpacing: "0.16em" }}>{office.city}</span>
                <p className="display mt-4 max-w-[27ch] text-[21px] leading-[1.3]" style={{ color: "var(--ink)" }}>{office.address}</p>
              </div>

              <div className="mt-auto flex items-end justify-between gap-5 pt-10">
                <div className="relative top-[3px] flex min-h-12 flex-col justify-end gap-2 text-[14.5px] leading-relaxed" style={{ color: "var(--ink-dim)", fontFamily: "var(--font-social), sans-serif" }}>
                  <a href="mailto:info@alpago.com" className="link-underline block w-fit">info@alpago.com</a>
                  <a href="tel:+15550000000" className="link-underline block w-fit">+1 555 000 0000</a>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.query)}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Get directions to ${office.name}`}
                  className="grid h-12 w-12 shrink-0 place-items-center border text-[color:var(--ink)] transition-[background-color,color,border-color] duration-500 group-hover:border-[color:var(--ink)] group-hover:bg-[color:var(--ink)] group-hover:text-[color:var(--btn-ink)]"
                  style={{ borderColor: "rgba(43,34,26,0.3)" }}
                >
                  <svg aria-hidden viewBox="0 0 28 28" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1"><path d="M8 20 20 8M10 8h10v10" /></svg>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t px-6 pb-20 pt-[167px] md:px-14 md:pb-28" style={{ borderColor: "rgba(43,34,26,0.18)" }}>
        <div className="grid gap-12 lg:grid-cols-[minmax(280px,0.75fr)_minmax(520px,1.25fr)] lg:gap-24">
          <div>
            <h2 className="display text-[clamp(2.6rem,5vw,68px)] leading-[1]" style={GOLD}>Enquiry Form</h2>
            <p className="mt-6 max-w-[36ch] text-[16px] leading-[1.75]" style={{ color: "var(--ink)", fontFamily: "var(--font-social), sans-serif" }}>
              Complete the form and our team will respond to your enquiry.
            </p>
          </div>

          <form noValidate className="grid gap-4" onSubmit={handleSubmit}>
            <input name="firstName" aria-label="First Name" aria-invalid={errors.includes("firstName")} placeholder="First Name *" className="alpago-field h-14 w-full border bg-transparent px-5 outline-none transition-colors duration-300 placeholder:text-[color:var(--ink-dim)]" style={fieldStyle("firstName")} onChange={() => clearFormError("firstName")} />
            <input name="lastName" aria-label="Last Name" aria-invalid={errors.includes("lastName")} placeholder="Last Name *" className="alpago-field h-14 w-full border bg-transparent px-5 outline-none transition-colors duration-300 placeholder:text-[color:var(--ink-dim)]" style={fieldStyle("lastName")} onChange={() => clearFormError("lastName")} />
            <input name="email" type="email" aria-label="Email Address" aria-invalid={errors.includes("email")} placeholder="Email Address *" className="alpago-field h-14 w-full border bg-transparent px-5 outline-none transition-colors duration-300 placeholder:text-[color:var(--ink-dim)]" style={fieldStyle("email")} onChange={() => clearFormError("email")} />
            <input name="company" aria-label="Company Name" placeholder="Company Name" className="alpago-field h-14 w-full border bg-transparent px-5 outline-none transition-colors duration-300 placeholder:text-[color:var(--ink-dim)]" style={fieldStyle("company")} />

            <div className="grid grid-cols-[108px_minmax(0,1fr)] gap-4">
              <AlpagoSelect ariaLabel="Country calling code" name="countryCode" options={COUNTRY_CODES} defaultValue="+971" style={fieldStyle("phone")} />
              <input name="phone" type="tel" aria-label="Phone Number" placeholder="Phone Number" className="alpago-field h-14 min-w-0 w-full border bg-transparent px-5 outline-none transition-colors duration-300 placeholder:text-[color:var(--ink-dim)]" style={fieldStyle("phone")} />
            </div>

            <AlpagoSelect
              ariaLabel="Subject of Enquiry"
              name="subject"
              options={SUBJECTS}
              defaultValue=""
              invalid={errors.includes("subject")}
              onValueChange={() => clearFormError("subject")}
              style={fieldStyle("subject")}
            />

            <textarea name="message" aria-label="Message" placeholder="Message" className="alpago-field min-h-[170px] w-full resize-none border bg-transparent p-5 outline-none transition-colors duration-300 placeholder:text-[color:var(--ink-dim)]" style={fieldStyle("message")} />

            {errors.length > 0 && (
              <div role="alert" className="alpago-form-notice">
                <span aria-hidden className="alpago-form-notice-icon">!</span>
                Please complete the highlighted fields.
              </div>
            )}

            <button type="submit" className="alpago-dark-button caption mt-1 inline-flex w-full items-center justify-center px-10 py-4 outline-none transition-[background-color,color,box-shadow] duration-500 focus-visible:ring-1 focus-visible:ring-[color:var(--bronze-hi)]" style={{ letterSpacing: "0.15em" }}>Submit</button>
          </form>
        </div>
      </section>
    </main>
  );
}
