import Link from "next/link";
import type { InsightArticle } from "@/data/insights";

const CATEGORY_LABELS: Record<InsightArticle["category"], string> = {
  "featured-releases": "Releases",
  "events-and-conferences": "Events",
  milestones: "Milestones",
};

export default function InsightCard({
  article,
  divider = false,
  rowDivider = false,
  compact = false,
  carousel = false,
}: {
  article: InsightArticle;
  divider?: boolean;
  rowDivider?: boolean;
  compact?: boolean;
  carousel?: boolean;
}) {
  return (
    <Link
      href={`/insights/${article.category}/${article.slug}`}
      className={`over-img group relative block overflow-hidden ${carousel ? "w-full flex-none md:w-1/3" : "w-full min-w-0 flex-1"} ${
        compact ? "h-[62vh] min-h-[520px]" : "h-[82vh] min-h-[620px]"
      }`}
      style={{
        ...(divider ? { borderLeft: "1px solid rgba(236,227,213,0.5)" } : {}),
        ...(rowDivider ? { borderTop: "1px solid rgba(236,227,213,0.5)" } : {}),
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={article.image}
        alt=""
        className="ease-alpago absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
      />
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700 group-hover:opacity-90"
        style={{
          background:
            "linear-gradient(to top, rgba(10,8,6,0.6) 0%, rgba(10,8,6,0.12) 34%, rgba(10,8,6,0.18) 100%)",
        }}
      />

      <div className="absolute inset-x-0 top-[7%] px-7 text-center md:px-8">
        <span
          className="caption inline-flex px-3 py-[7px]"
          style={{
            color: "rgba(255,255,255,0.95)",
            background: "rgba(31,25,20,0.48)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            fontSize: "0.61rem",
            letterSpacing: "0.15em",
          }}
        >
          {CATEGORY_LABELS[article.category]}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-[9%] px-7 text-center md:px-8">
        <span
          className="caption mb-3 block"
          style={{ color: "rgba(255,255,255,0.95)", fontSize: "0.82rem", textShadow: "0 1px 16px rgba(10,8,6,0.6)" }}
        >
          {article.tag}
        </span>
        <h3
          className="mx-auto max-w-[22ch]"
          style={{
            color: "rgba(255,255,255,0.98)",
            fontSize: compact ? "clamp(1.45rem,2.2vw,30px)" : "22px",
            lineHeight: 1.4,
            textShadow: "0 1px 24px rgba(10,8,6,0.65)",
          }}
        >
          {article.title}
        </h3>
      </div>
    </Link>
  );
}
