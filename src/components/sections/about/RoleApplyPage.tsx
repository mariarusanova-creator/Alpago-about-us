"use client";

import Link from "next/link";
import { useState } from "react";
import type { Role } from "@/data/roles";
import AlpagoSelect from "@/components/ui/AlpagoSelect";

const GOLD: React.CSSProperties = { backgroundImage: "linear-gradient(180deg,var(--gold-1),var(--gold-2) 48%,var(--gold-3))", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" };
const FIELD = "alpago-field h-14 w-full border bg-transparent px-5 outline-none transition-colors duration-300 placeholder:text-[color:var(--ink-dim)]";
const COUNTRY_CODES = ["+971", "+90", "+44", "+1"].map((value) => ({ value, label: value }));

export default function RoleApplyPage({ role }: { role: Role }) {
  const [fileName, setFileName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const clearError = (field: string) => setErrors((current) => {
    if (!current[field]) return current;
    const next = { ...current };
    delete next[field];
    return next;
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next: Record<string, string> = {};
    if (!String(data.get("firstName") ?? "").trim()) next.firstName = "Please enter your first name";
    if (!String(data.get("lastName") ?? "").trim()) next.lastName = "Please enter your last name";
    const email = String(data.get("email") ?? "").trim();
    if (!email) next.email = "Please enter your email address";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Please enter a valid email address";
    if (!String(data.get("phone") ?? "").trim()) next.phone = "Please enter your phone number";
    if (!fileName) next.cv = "Please attach your CV before submitting";
    setErrors(next);
  };

  return (
    <main className="section-bg min-h-screen px-6 pb-24 pt-36 md:px-14 md:pb-32 md:pt-44">
      <div className="mx-auto grid max-w-[1440px] gap-16 lg:grid-cols-[minmax(0,0.8fr)_minmax(520px,1fr)] lg:gap-24">
        <div>
          <Link href={`/careers/open-roles/${role.slug}`} className="group caption inline-flex items-center gap-3" style={{ color: "var(--bronze-hi)", letterSpacing: "0.18em" }}>
            <svg aria-hidden viewBox="0 0 28 28" className="ease-alpago-soft h-6 w-6 rotate-[-135deg] transition-transform duration-500 group-hover:-translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M8 20 20 8M10 8h10v10" />
            </svg>
            <span>Back to role</span>
          </Link>
          <span className="caption mt-14 block" style={{ color: "var(--bronze-hi)", letterSpacing: "0.18em" }}>{role.company}</span>
          <h1 className="display mt-5 text-[clamp(3rem,6vw,80px)] leading-[0.98]" style={GOLD}>{role.title}</h1>
          <p className="mt-8 max-w-[46ch]" style={{ color: "var(--ink-dim)", fontFamily: "var(--font-social), sans-serif", fontSize: "16px", lineHeight: 1.8 }}>We review every application with care. Share the experience, perspective, and standards you would bring to Alpago.</p>
        </div>
        <div className="border p-7 md:p-10" style={{ borderColor: "var(--line)" }}>
          <div className="flex items-start justify-between"><div><span className="caption" style={{ color: "var(--bronze-hi)" }}>Application</span><h2 className="display mt-3 text-[42px]" style={GOLD}>Apply Now</h2></div><Link aria-label="Close application" href={`/careers/open-roles/${role.slug}`} className="ease-alpago grid h-11 w-11 place-items-center border border-[color:var(--line-strong)] text-2xl font-light text-[color:var(--ink)] transition-[background-color,border-color,color,transform] duration-500 hover:rotate-90 hover:border-[#876540] hover:bg-[#876540] hover:text-[#f1eadf]">×</Link></div>
          <form noValidate className="mt-10 grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <input name="firstName" aria-invalid={Boolean(errors.firstName)} className={FIELD} style={{ "--field-border": errors.firstName ? "var(--error)" : "var(--line-strong)", color: "var(--ink)" } as React.CSSProperties} placeholder="First Name *" onChange={() => clearError("firstName")} />
              </div>
              <div>
                <input name="lastName" aria-invalid={Boolean(errors.lastName)} className={FIELD} style={{ "--field-border": errors.lastName ? "var(--error)" : "var(--line-strong)", color: "var(--ink)" } as React.CSSProperties} placeholder="Last Name *" onChange={() => clearError("lastName")} />
              </div>
            </div>
            <div>
              <input name="email" aria-invalid={Boolean(errors.email)} type="email" className={FIELD} style={{ "--field-border": errors.email ? "var(--error)" : "var(--line-strong)", color: "var(--ink)" } as React.CSSProperties} placeholder="Email Address *" onChange={() => clearError("email")} />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[132px_minmax(0,1fr)] sm:gap-4">
              <AlpagoSelect
                ariaLabel="Country calling code"
                name="countryCode"
                options={COUNTRY_CODES}
                defaultValue="+971"
                style={{ "--field-border": "var(--line-strong)", color: "var(--ink)" } as React.CSSProperties}
              />
              <div className="min-w-0">
                <input name="phone" aria-invalid={Boolean(errors.phone)} type="tel" className={`${FIELD} min-w-0`} style={{ "--field-border": errors.phone ? "var(--error)" : "var(--line-strong)", color: "var(--ink)" } as React.CSSProperties} placeholder="Phone Number *" onChange={() => clearError("phone")} />
              </div>
            </div>
            <textarea name="message" className="alpago-field min-h-[150px] w-full resize-none border bg-transparent p-5 outline-none transition-colors duration-300 placeholder:text-[color:var(--ink-dim)]" style={{ "--field-border": "var(--line-strong)", color: "var(--ink)" } as React.CSSProperties} placeholder="Message" />
            <div className="flex flex-wrap items-center gap-4">
              <label className="alpago-field caption group/upload inline-flex h-11 cursor-pointer items-center gap-2.5 border px-4 transition-colors duration-300 hover:bg-[rgba(135,101,64,0.06)]" style={{ "--field-border": errors.cv ? "var(--error)" : "var(--line-strong)", color: "var(--ink)", letterSpacing: "0.12em" } as React.CSSProperties}>
                <svg aria-hidden viewBox="0 0 24 24" className="ease-alpago-soft h-[17px] w-[17px] transition-transform duration-500 group-hover/upload:-translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 16V4M7.5 8.5 12 4l4.5 4.5M5 14v5h14v-5" />
                </svg>
                <span>Upload CV</span>
                <input name="cv" type="file" accept=".pdf,.doc,.docx" aria-invalid={Boolean(errors.cv)} className="hidden" onChange={(event) => { setFileName(event.target.files?.[0]?.name ?? ""); clearError("cv"); }} />
              </label>
              {fileName && <span className="min-w-0 break-all text-sm" style={{ color: "var(--ink-dim)" }}>{fileName}</span>}
            </div>
            {Object.keys(errors).length > 0 && (
              <div role="alert" className="alpago-form-notice">
                <span aria-hidden className="alpago-form-notice-icon">!</span>
                Please complete the highlighted fields.
              </div>
            )}
            <button type="submit" className="alpago-dark-button caption mt-5 w-fit px-10 py-4 outline-none transition-[background-color,color,box-shadow] duration-500 focus-visible:ring-1 focus-visible:ring-[color:var(--bronze-hi)]" style={{ letterSpacing: "0.15em" }}>Submit</button>
          </form>
        </div>
      </div>
    </main>
  );
}
