"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Category = "Businesses" | "Insights" | "Careers";
type SearchItem = { category: Category; title: string; description: string; href: string };

const ITEMS: SearchItem[] = [
  { category: "Businesses", title: "Alpago Properties", description: "Ultra-prime residential development shaped by discretion, precision, and uncompromising standards.", href: "/businesses/alpago-properties" },
  { category: "Businesses", title: "Alpago Design & Build", description: "An integrated design and construction practice protecting intent from first sketch to final detail.", href: "/businesses/alpago-design-build" },
  { category: "Businesses", title: "F1rst Motors", description: "A destination for rare, limited-production, and investment-grade automobiles.", href: "/businesses/f1rst-motors" },
  { category: "Businesses", title: "Alpago Facility Management", description: "Technical care and operational excellence for exceptional residential assets.", href: "/businesses" },
  { category: "Businesses", title: "Alpago Manufacturing", description: "Specialist production where material knowledge meets exacting craftsmanship.", href: "/businesses" },
  { category: "Insights", title: "The Alpago Standard", description: "Why standards should drive decisions, not profit — and how that principle shapes every outcome.", href: "/the-alpago" },
  { category: "Insights", title: "Our Manifesto", description: "The convictions behind Alpago and the responsibility that comes with redefining a category.", href: "/the-alpago/manifesto" },
  { category: "Insights", title: "People Behind Alpago", description: "Meet the visionaries, makers, and leaders responsible for the work.", href: "/the-alpago/people" },
  { category: "Insights", title: "Built on Transparency", description: "A closer look at the clarity, accountability, and trust embedded in the Alpago approach.", href: "/the-alpago" },
  { category: "Insights", title: "A Long-Term Perspective", description: "Creating lasting value through selective development and disciplined execution.", href: "/investors" },
  { category: "Careers", title: "Open Roles", description: "Explore current opportunities across the Alpago Group.", href: "/careers/open-roles" },
  { category: "Careers", title: "Life at Alpago", description: "Discover a culture built around ownership, curiosity, and exceptional standards.", href: "/careers" },
  { category: "Careers", title: "Senior Project Manager", description: "Lead the delivery of ultra-prime residential projects from pre-construction through handover.", href: "/careers/open-roles/senior-project-manager" },
  { category: "Careers", title: "Senior Interior Architect", description: "Develop highly resolved residential interiors from concept to technical delivery.", href: "/careers/open-roles/senior-interior-architect" },
  { category: "Careers", title: "Construction Quality Manager", description: "Establish and maintain exacting quality standards across active sites and final finishes.", href: "/careers/open-roles/construction-quality-manager" },
];

const GOLD: React.CSSProperties = {
  backgroundImage: "linear-gradient(180deg, var(--gold-1) 0%, var(--gold-2) 48%, var(--gold-3) 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"All" | Category>("All");

  useEffect(() => {
    setQuery(new URLSearchParams(window.location.search).get("q") ?? "");
  }, []);

  const normalized = query.trim().toLowerCase();
  const queryMatches = useMemo(() => ITEMS.filter((item) => (
    !normalized || `${item.title} ${item.description} ${item.category}`.toLowerCase().includes(normalized)
  )), [normalized]);
  const results = useMemo(() => (
    category === "All" ? queryMatches : queryMatches.filter((item) => item.category === category)
  ), [category, queryMatches]);
  const counts = useMemo(() => ({
    All: queryMatches.length,
    Businesses: queryMatches.filter((item) => item.category === "Businesses").length,
    Insights: queryMatches.filter((item) => item.category === "Insights").length,
    Careers: queryMatches.filter((item) => item.category === "Careers").length,
  }), [queryMatches]);

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const url = query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : "/search";
    window.history.replaceState(null, "", url);
  };

  return (
    <main className="section-bg min-h-screen">
      <header className="px-6 pb-16 pt-36 md:px-14 md:pb-24 md:pt-44">
        <div className="caption flex items-center gap-3" style={{ color: "var(--ink-faint)", letterSpacing: "0.22em" }}>
          <Link href="/">Home</Link><span>/</span><span style={{ color: "var(--bronze-hi)" }}>Search</span>
        </div>
        <div className="mt-14">
          <div className="caption mb-5">Explore Alpago</div>
          <h1 className="display text-[clamp(3.5rem,8vw,112px)] leading-[0.9]" style={GOLD}>Search</h1>
          <form role="search" onSubmit={submitSearch} className="mt-12 flex h-16 w-full max-w-[700px] md:h-[72px]">
            <label htmlFor="search-page-input" className="sr-only">Search the Alpago website</label>
            <input
              id="search-page-input"
              name="q"
              type="search"
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search"
              className="alpago-field h-full min-w-0 flex-1 border bg-transparent px-5 text-[18px] outline-none placeholder:text-[color:var(--ink-dim)] md:px-6"
              style={{ "--field-border": "var(--line-strong)", color: "var(--ink)", background: "rgba(255,255,255,0.1)", fontFamily: "var(--font-social), sans-serif" } as React.CSSProperties}
            />
            <button type="submit" className="alpago-dark-button caption shrink-0 cursor-pointer px-7 outline-none transition-[background-color,color,box-shadow] duration-500 focus-visible:ring-1 focus-visible:ring-[color:var(--bronze-hi)] md:px-10" style={{ letterSpacing: "0.14em" }}>
              Search
            </button>
          </form>
        </div>
      </header>

      <section className="border-t px-6 pb-32 md:px-14 md:pb-40" style={{ borderColor: "var(--line)" }}>
        <div className="-mx-6 flex gap-8 overflow-x-auto border-b px-6 py-6 md:-mx-14 md:gap-14 md:px-14" style={{ borderColor: "var(--line)" }}>
          {(Object.keys(counts) as Array<keyof typeof counts>).map((item) => (
            <button key={item} type="button" onClick={() => setCategory(item)} className="caption shrink-0 pb-1 transition-colors" style={{ color: category === item ? "var(--ink)" : "var(--ink-faint)", letterSpacing: "0.15em", borderBottom: category === item ? "1px solid var(--bronze-hi)" : "1px solid transparent" }}>
              {item} / {counts[item]}
            </button>
          ))}
        </div>

        <p className="caption pb-8 pt-12" style={{ color: "var(--ink-faint)", letterSpacing: "0.14em" }}>
          {results.length} {results.length === 1 ? "result" : "results"} found{query ? <> for “{query}”</> : null}
        </p>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {results.map((item) => (
            <article key={`${item.category}-${item.title}`} className="ease-alpago-soft group flex min-h-[390px] flex-col border p-7 transition-[transform,border-color,box-shadow] duration-700 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(28,20,12,0.07)] md:p-9" style={{ borderColor: "var(--line-strong)", background: "rgba(255,255,255,0.08)" }}>
              <div className="caption" style={{ color: "var(--ink-faint)", letterSpacing: "0.15em" }}>Home / {item.category}</div>
              <div className="mt-12">
                <h2 className="display text-[clamp(1.7rem,2.5vw,36px)] leading-[1.08]" style={GOLD}>{item.title}</h2>
                <p className="mt-6 max-w-[42ch] text-[16px] leading-[1.72]" style={{ color: "var(--ink)", fontFamily: "var(--font-social), sans-serif" }}>{item.description}</p>
              </div>
              <Link href={item.href} className="caption mt-auto flex w-fit items-center gap-3 pt-16" style={{ color: "var(--bronze-hi)", letterSpacing: "0.14em" }}>
                Learn More
                <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 transition-transform duration-500 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M14 7l5 5-5 5" /></svg>
              </Link>
            </article>
          ))}
        </div>

        {results.length === 0 && (
          <div className="py-24 text-center">
            <h2 className="display text-4xl" style={GOLD}>No results found</h2>
            <p className="mt-5" style={{ color: "var(--ink-dim)" }}>Try another keyword or category.</p>
          </div>
        )}
      </section>
    </main>
  );
}
