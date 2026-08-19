"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { Link as LinkIcon, Send, Share2 } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import InsightCard from "@/components/insights/InsightCard";
import Reveal from "@/components/Reveal";
import type { InsightArticle, InsightCategory } from "@/data/insights";

const GOLD: React.CSSProperties = {
  backgroundImage: "linear-gradient(180deg,var(--gold-1),var(--gold-2) 48%,var(--gold-3))",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
};

export default function InsightArticlePage({
  article,
  category,
  related,
}: {
  article: InsightArticle;
  category: InsightCategory;
  related: InsightArticle[];
}) {
  const path = `/insights/${category.slug}/${article.slug}`;
  const mediaSection = useRef<HTMLElement>(null);
  const media = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = mediaSection.current;
    const figure = media.current;
    if (!section || !figure) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: .65,
        onUpdate: ({ progress }) => {
          const enter = gsap.utils.clamp(0, 1, progress / .22);
          const leave = gsap.utils.clamp(0, 1, (progress - .76) / .24);
          const opacity = enter * (1 - leave);
          figure.style.opacity = opacity.toFixed(3);
          figure.style.filter = `blur(${((1 - opacity) * 7).toFixed(2)}px)`;
          figure.style.setProperty("--media-top-fade", `${((1 - enter) * 48).toFixed(2)}%`);
          figure.style.setProperty("--media-bottom-fade", `${((1 - leave) * 100).toFixed(2)}%`);
        },
      });
    }, section);
    return () => context.revert();
  }, []);

  return (
    <main id="top" style={{ background: "#e0dcd1" }}>
      <article>
        <header className="px-6 pb-[9vh] pt-40 text-center md:px-14 md:pt-48">
          <Reveal>
            <div className="caption mx-auto flex max-w-[1100px] flex-wrap items-center justify-center gap-3" style={{ color: "var(--ink-faint)", letterSpacing: ".15em" }}>
              <Link href="/">Home</Link><span>/</span><Link href="/insights">Insights</Link><span>/</span>
              <Link href={`/insights/${category.slug}`}>{category.title}</Link><span>/</span>
              <span style={{ color: "var(--bronze-hi)" }}>{article.title}</span>
            </div>
          </Reveal>
          <Reveal delay={0.05} y={22} blur={8}>
            <span className="caption mt-12 inline-flex border px-4 py-2" style={{ borderColor: "var(--line-strong)", background: "#e0dcd1" }}>
              {article.tag}
            </span>
            <h1 className="display mx-auto mt-7 max-w-[1100px]" style={{ ...GOLD, fontSize: "clamp(3rem,7vw,96px)", lineHeight: .98 }}>
              {article.title}
            </h1>
            <p className="caption mt-7" style={{ color: "var(--ink-faint)", letterSpacing: ".14em" }}>{article.date}</p>
          </Reveal>
        </header>

        <section ref={mediaSection} className="relative h-[180vh]">
          <figure ref={media} className="sticky top-0 h-screen w-full overflow-hidden will-change-[opacity,filter]" style={{ "--media-top-fade": "48%", "--media-bottom-fade": "100%" } as React.CSSProperties}>
            <div className="relative h-full w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={article.heroImage} alt="" className="h-full w-full object-cover" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[36%]" style={{ background: "linear-gradient(to bottom,#e0dcd1 0%,rgba(224,220,209,.78) var(--media-top-fade),rgba(224,220,209,0) 100%)" }} />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[36%]" style={{ background: "linear-gradient(to top,#e0dcd1 0%,rgba(224,220,209,.72) calc(100% - var(--media-bottom-fade)),rgba(224,220,209,0) 100%)" }} />
            </div>
          </figure>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-[-100px] z-10 h-[220px]"
            style={{ background: "linear-gradient(to bottom,rgba(224,220,209,0) 0%,#e0dcd1 58%,#e0dcd1 100%)" }}
          />
        </section>

        <div className="grid w-full gap-16 px-6 py-[12vh] md:grid-cols-[minmax(0,980px)_180px] md:justify-between md:px-14">
          <div className="min-w-0 max-w-[980px]">
            <p className="text-[20px] leading-[1.75] md:text-[23px]" style={{ color: "var(--ink)", fontFamily: "var(--font-social),sans-serif" }}>
              {article.intro}
            </p>
            <h2 className="display mt-16" style={{ ...GOLD, fontSize: "clamp(2rem,4vw,48px)", lineHeight: 1.08 }}>{article.sectionTitle}</h2>
            <div className="mt-8 space-y-7">
              {article.body.slice(0, 2).map((paragraph) => (
                <p key={paragraph} className="text-[17px] leading-[1.85]" style={{ color: "var(--ink)", fontFamily: "var(--font-social),sans-serif" }}>{paragraph}</p>
              ))}
            </div>

            <blockquote className="my-16 border-y py-10" style={{ borderColor: "var(--line-strong)" }}>
              <p className="display" style={{ ...GOLD, fontSize: "clamp(2rem,4.2vw,54px)", lineHeight: 1.08 }}>“{article.quote}”</p>
            </blockquote>

            <h3 className="caption mb-8">Key Numbers</h3>
            <div className="grid grid-cols-2 gap-x-12 gap-y-10 md:grid-cols-4">
              {article.stats.map((stat) => (
                <div key={stat.label}>
                  <div className="display text-[clamp(2.5rem,5vw,60px)] leading-none" style={GOLD}>{stat.value}</div>
                  <div className="caption mt-3" style={{ color: "var(--ink-dim)", fontSize: ".62rem", letterSpacing: ".14em" }}>{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-16 space-y-7">
              {article.body.slice(2).map((paragraph) => (
                <p key={paragraph} className="text-[17px] leading-[1.85]" style={{ color: "var(--ink)", fontFamily: "var(--font-social),sans-serif" }}>{paragraph}</p>
              ))}
            </div>
          </div>

          <aside className="caption md:sticky md:top-32 md:self-start" style={{ color: "var(--ink-faint)", letterSpacing: ".13em" }}>
            <div>
              <span className="block">Published</span>
              <span className="mt-3 block" style={{ color: "var(--ink)" }}>{article.date}</span>
              <span className="mt-10 block">Share</span>
              <div className="mt-5 flex gap-3">
                {[
                  { label: "LinkedIn", icon: Send, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(path)}` },
                  { label: "Facebook", icon: Share2, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(path)}` },
                  { label: "Copy link", icon: LinkIcon, href: path },
                ].map(({ label, icon: Icon, href }) => (
                  <a key={label} href={href} aria-label={label} className="grid h-10 w-10 place-items-center rounded-full transition-colors duration-300 hover:bg-[color:var(--ink)] hover:text-[color:var(--btn-ink)]" style={{ border: "1px solid var(--line-strong)" }}><Icon aria-hidden className="h-4 w-4" strokeWidth={1.35} /></a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </article>

      <section className="pb-[100px] pt-[calc(11vh+50px)]">
        <div className="mb-[7vh] flex flex-col gap-7 px-6 md:flex-row md:items-end md:justify-between md:px-14">
          <div>
            <span className="caption">Continue exploring</span>
            <h2 className="display mt-5" style={{ ...GOLD, fontSize: "clamp(2.2rem,4.5vw,60px)" }}>
              Other {category.title}
            </h2>
          </div>
          <Link href={`/insights/${category.slug}`} className="alpago-dark-button caption w-fit px-8 py-4 transition-[background-color,color,box-shadow] duration-500" style={{ letterSpacing: ".14em" }}>
            Explore All
          </Link>
        </div>
        <div className="grid md:grid-cols-3">
          {related.map((item, index) => (
            <InsightCard key={item.slug} article={item} compact divider={index > 0} />
          ))}
        </div>
      </section>
    </main>
  );
}
