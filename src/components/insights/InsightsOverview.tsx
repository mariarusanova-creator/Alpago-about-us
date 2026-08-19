import Link from "next/link";
import Reveal from "@/components/Reveal";
import InsightsCategorySection from "@/components/insights/InsightsCategorySection";
import InsightsAwards from "@/components/insights/InsightsAwards";
import { INSIGHT_CATEGORIES, getInsightArticles } from "@/data/insights";

const GOLD: React.CSSProperties = {
  backgroundImage: "linear-gradient(180deg,var(--gold-1),var(--gold-2) 48%,var(--gold-3))",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
};

export default function InsightsOverview() {
  return (
    <main id="top" style={{ background: "#e0dcd1" }}>
      <header className="px-6 pb-[12vh] pt-40 text-center md:px-14 md:pt-48">
        <Reveal>
          <div className="caption flex items-center justify-center gap-3" style={{ color: "var(--ink-faint)", letterSpacing: ".2em" }}>
            <Link href="/">Home</Link><span>/</span><span style={{ color: "var(--bronze-hi)" }}>Insights</span>
          </div>
        </Reveal>
        <Reveal delay={0.05} y={24} blur={8}>
          <h1 className="display mt-12 pb-[0.12em]" style={{ ...GOLD, fontSize: "clamp(4rem,10vw,140px)", lineHeight: .96 }}>
            Insights
          </h1>
        </Reveal>
      </header>

      {INSIGHT_CATEGORIES.map((category) => {
        const articles = getInsightArticles(category.slug);
        return <InsightsCategorySection key={category.slug} category={category} articles={articles} />;
      })}

      <InsightsAwards />
    </main>
  );
}
