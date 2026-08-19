"use client";

import CareersHero from "./CareersHero";
import PinnedStatement from "./PinnedStatement";
import CareersCulture from "./CareersCulture";

/**
 * Culture & Careers — composed from the site's real pinned-act machinery so it feels
 * native to /the-alpago: PinnedStatement acts (pinned, scroll-scrubbed char-blur
 * statements with bed/wipe media and the -100vh stacked-card choreography) and a
 * pinned horizontal culture rail (CareersCulture). Copy from the Figma wireframe
 * (node 2421:2924); photography from the company profile deck.
 */
export default function CareersPage() {
  return (
    <>
      {/* breadcrumb — light over the dark hero bed */}
      <div
        className="caption fixed left-1/2 z-40 hidden items-center gap-2 md:flex"
        style={{ top: "104px", transform: "translateX(-50%)" }}
      >
        <a href="/" style={{ fontSize: "10px", color: "rgba(236,227,213,0.6)", letterSpacing: "0.24em" }}>Home</a>
        <span aria-hidden style={{ color: "rgba(236,227,213,0.45)", fontSize: "10px" }}>/</span>
        <span style={{ fontSize: "10px", color: "rgba(240,217,173,0.95)", letterSpacing: "0.24em" }}>Careers</span>
      </div>

      {/* 1 — HERO: video bed with the gold wordmark, same treatment as /the-alpago */}
      <CareersHero />

      {/* 2 — cream statement: its own char-blur reveal (animates in, not static) */}
      <PinnedStatement
        first
        eyebrow="Working at Alpago"
        lines={["Build what others", "call impossible."]}
        paragraph="Across Alpago Properties, Alpago Design & Build, and F1rst Motors, our people contribute to some of the region’s most ambitious developments, exceptional architectural projects, and the world’s rarest automotive collections."
        length={120}
      />

      {/* 3 — vertical culture cards over a blurred backdrop */}
      <CareersCulture />

      {/* 4 — one group, on the same quiet cream stage as the opening statement */}
      <PinnedStatement
        underWipe
        underGradient
        solidBg
        eyebrow="Join the people redefining standards"
        lines={["One Group.", "Endless Possibilities."]}
        paragraph="We’re looking for people who question accepted standards — who care more about getting it right than getting it done."
        length={120}
      />

      {/* 5 — closing statement over the First Motors bed */}
      <PinnedStatement
        first
        last
        mode="bed"
        bedReveal
        solidBg
        media={{ video: "careers-hero" }}
        lines={["If you believe quality should", "never be compromised,", "we’d like to meet you."]}
        ctaLabel="Explore Roles"
        ctaHref="/careers/open-roles"
        secondaryCtaLabel="Apply Now"
        secondaryCtaHref="/careers/open-application"
        length={110}
      />
    </>
  );
}
