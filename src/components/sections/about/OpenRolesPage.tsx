"use client";

import { useMemo, useState } from "react";
import { ROLES } from "@/data/roles";
import RoleCard from "./RoleCard";
import AlpagoSelect from "@/components/ui/AlpagoSelect";

const GOLD: React.CSSProperties = {
  backgroundImage: "linear-gradient(180deg, var(--gold-1) 0%, var(--gold-2) 48%, var(--gold-3) 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
};

export default function OpenRolesPage() {
  const [query, setQuery] = useState("");
  const [company, setCompany] = useState("All businesses");
  const [sort, setSort] = useState("Newest");

  const companies = ["All businesses", ...Array.from(new Set(ROLES.map((role) => role.company)))];
  const visibleRoles = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const filtered = ROLES.filter((role) => {
      const matchesCompany = company === "All businesses" || role.company === company;
      const matchesQuery = !normalized || `${role.title} ${role.company} ${role.description}`.toLowerCase().includes(normalized);
      return matchesCompany && matchesQuery;
    });
    return sort === "Oldest" ? [...filtered].reverse() : filtered;
  }, [company, query, sort]);

  return (
    <div className="min-h-screen section-bg">
      <header className="px-6 pb-10 pt-36 md:px-14 md:pb-12 md:pt-44">
        <div className="caption flex items-center gap-3" style={{ color: "var(--ink-faint)", letterSpacing: "0.22em" }}>
          <a href="/">Home</a><span>/</span><a href="/careers">Careers</a><span>/</span>
          <span style={{ color: "var(--bronze-hi)" }}>Open Roles</span>
        </div>
        <div className="mt-14">
          <div>
            <div className="caption mb-5">Careers at Alpago</div>
            <h1 className="display text-[clamp(3.5rem,8vw,112px)] leading-[0.9]" style={GOLD}>Open Roles</h1>
          </div>
        </div>
      </header>

      <section className="px-6 pb-28 pt-3 md:px-14 md:pb-40 md:pt-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <label className="alpago-field flex h-14 w-full items-center gap-4 border px-5 lg:max-w-[450px]" style={{ "--field-border": "var(--line-strong)" } as React.CSSProperties}>
            <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ color: "var(--bronze-hi)" }}>
              <circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" />
            </svg>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search roles" className="h-full w-full bg-transparent outline-none placeholder:text-[color:var(--ink-dim)]" style={{ color: "var(--ink)", fontFamily: "var(--font-social), sans-serif" }} />
          </label>
          <div className="flex flex-col gap-4 sm:flex-row">
            <AlpagoSelect
              ariaLabel="Filter by business"
              prefix="Business"
              options={companies.map((item) => ({ value: item, label: item }))}
              value={company}
              onValueChange={setCompany}
              className="w-full sm:w-[250px]"
              style={{ "--field-border": "var(--line-strong)" } as React.CSSProperties}
            />
            <AlpagoSelect
              ariaLabel="Sort open roles"
              prefix="Sort"
              options={[{ value: "Newest", label: "Newest" }, { value: "Oldest", label: "Oldest" }]}
              value={sort}
              onValueChange={setSort}
              className="w-full sm:w-[250px]"
              style={{ "--field-border": "var(--line-strong)" } as React.CSSProperties}
            />
          </div>
        </div>

        <div className="mt-12 grid gap-x-8 gap-y-16 md:grid-cols-2 md:gap-y-20 xl:grid-cols-3 xl:gap-x-14 xl:gap-y-24">
          {visibleRoles.map((role) => (
            <RoleCard key={`${role.title}-${role.company}`} role={role} />
          ))}
        </div>

        {visibleRoles.length === 0 && (
          <div className="py-28 text-center">
            <h2 className="display text-4xl" style={GOLD}>No roles found</h2>
            <p className="mt-5" style={{ color: "var(--ink-dim)" }}>Try another search or business area.</p>
          </div>
        )}
      </section>
    </div>
  );
}
