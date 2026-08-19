"use client";

import Link from "next/link";
import { useState } from "react";
import InsightCard from "@/components/insights/InsightCard";
import type { InsightArticle, InsightCategory } from "@/data/insights";

export default function InsightsCategorySection({ category, articles }: { category: InsightCategory; articles: InsightArticle[] }) {
  const [active, setActive] = useState(0);
  const last = Math.max(0, articles.length - 3);
  const move = (direction: -1 | 1) => setActive((current) => Math.min(last, Math.max(0, current + direction)));

  return (
    <section className="relative overflow-hidden pb-[16vh]">
      <div className="mb-[7vh] flex items-end justify-between gap-8 px-6 md:px-14">
        <h2 className="display pb-[0.08em] text-[clamp(2.2rem,4.4vw,60px)] leading-[1.05] text-[color:var(--bronze-hi)]">{category.title}</h2>
        <div className="flex shrink-0 items-center gap-3">
          <Link href={`/insights/${category.slug}`} className="caption link-underline mr-2 hidden sm:inline-flex" style={{ color: "var(--bronze-hi)" }}>Explore All</Link>
          <button type="button" onClick={() => move(-1)} disabled={active === 0} aria-label={`Previous ${category.title}`} className="grid h-12 w-12 place-items-center border text-[color:var(--ink)] transition-[background-color,color,opacity] duration-500 hover:bg-[#876540] hover:text-[#f1eadf] disabled:opacity-35">
            <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M10 7l-5 5 5 5" /></svg>
          </button>
          <button type="button" onClick={() => move(1)} disabled={active === last} aria-label={`Next ${category.title}`} className="alpago-dark-button grid h-12 w-12 place-items-center transition-[background-color,color,opacity] duration-500 disabled:opacity-35">
            <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M14 7l5 5-5 5" /></svg>
          </button>
        </div>
      </div>
      <div className="overflow-hidden">
        <div className="insights-carousel-track flex w-full transition-transform duration-700 ease-[cubic-bezier(.22,.61,.36,1)]" style={{ "--insights-slide": active } as React.CSSProperties}>
          {articles.map((article, index) => <InsightCard key={article.slug} article={article} divider={index > 0} carousel />)}
        </div>
      </div>
      <Link href={`/insights/${category.slug}`} className="caption link-underline ml-6 mt-7 inline-flex sm:hidden" style={{ color: "var(--bronze-hi)" }}>Explore All</Link>
    </section>
  );
}
