"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import AlpagoSelect from "@/components/ui/AlpagoSelect";
import InsightCard from "@/components/insights/InsightCard";
import type { InsightArticle, InsightCategory } from "@/data/insights";

const GOLD: React.CSSProperties = {
  backgroundImage: "linear-gradient(180deg,var(--gold-1),var(--gold-2) 48%,var(--gold-3))",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
};

export default function InsightsListing({
  category,
  articles,
}: {
  category: InsightCategory;
  articles: InsightArticle[];
}) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("all");
  const [sort, setSort] = useState("newest");
  const [visible, setVisible] = useState(6);

  const tags = useMemo(
    () => Array.from(new Set(articles.map((article) => article.tag))),
    [articles],
  );
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const result = articles.filter((article) => {
      const matchesTag = tag === "all" || article.tag === tag;
      const matchesQuery = !normalized || `${article.title} ${article.excerpt} ${article.tag}`.toLowerCase().includes(normalized);
      return matchesTag && matchesQuery;
    });
    return sort === "oldest" ? [...result].reverse() : result;
  }, [articles, query, sort, tag]);

  return (
    <main id="top" className="section-bg min-h-screen">
      <header className="px-6 pb-[11vh] pt-40 text-center md:px-14 md:pt-48">
        <div className="caption flex flex-wrap items-center justify-center gap-3" style={{ color: "var(--ink-faint)", letterSpacing: ".18em" }}>
          <Link href="/">Home</Link><span>/</span><Link href="/insights">Insights</Link><span>/</span>
          <span style={{ color: "var(--bronze-hi)" }}>{category.title}</span>
        </div>
        <span className="caption mt-12 block">{category.eyebrow}</span>
        <h1 className="display mx-auto mt-5 max-w-[1100px]" style={{ ...GOLD, fontSize: "clamp(3.4rem,8vw,110px)", lineHeight: .94 }}>
          {category.title}
        </h1>
      </header>

      <section className="pb-[16vh]">
        <div className="grid gap-4 px-6 py-6 md:grid-cols-[1fr_240px_220px] md:px-14">
          <label className="alpago-field flex h-14 items-center border px-5" style={{ "--field-border": "var(--line)" } as React.CSSProperties}>
            <Search aria-hidden className="mr-4 h-4 w-4 shrink-0" strokeWidth={1.35} style={{ color: "var(--bronze-hi)" }} />
            <span className="sr-only">Search articles</span>
            <input
              type="search"
              value={query}
              onChange={(event) => { setQuery(event.target.value); setVisible(6); }}
              placeholder="Search"
              className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-[color:var(--ink-dim)]"
              style={{ color: "var(--ink)", fontFamily: "var(--font-social),sans-serif" }}
            />
          </label>
          <AlpagoSelect
            ariaLabel="Filter by category"
            prefix="Category"
            value={tag}
            onValueChange={(value) => { setTag(value); setVisible(6); }}
            options={[{ value: "all", label: "All" }, ...tags.map((item) => ({ value: item, label: item }))]}
          />
          <AlpagoSelect
            ariaLabel="Sort articles"
            prefix="Sort"
            value={sort}
            onValueChange={setSort}
            options={[{ value: "newest", label: "Newest" }, { value: "oldest", label: "Oldest" }]}
          />
        </div>

        {filtered.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 xl:grid-cols-3">
              {filtered.slice(0, visible).map((article, index) => (
                <InsightCard key={article.slug} article={article} compact divider={index % 3 !== 0} rowDivider={index >= 3} />
              ))}
            </div>
            {visible < filtered.length && (
              <div className="flex justify-center px-6 pt-14">
                <button type="button" onClick={() => setVisible((value) => value + 3)} className="caption border px-10 py-4 transition-colors duration-500 hover:bg-[color:var(--ink)] hover:text-[color:var(--btn-ink)]" style={{ borderColor: "var(--ink)", color: "var(--ink)", letterSpacing: ".14em" }}>
                  Load More
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="px-6 py-28 text-center">
            <h2 className="display text-[clamp(2rem,4vw,52px)]" style={GOLD}>No stories found</h2>
            <p className="mt-5" style={{ color: "var(--ink-dim)" }}>Try another keyword or category.</p>
          </div>
        )}
      </section>
    </main>
  );
}
