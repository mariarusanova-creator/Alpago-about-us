import Link from "next/link";
import type { Role } from "@/data/roles";
import { ROLES } from "@/data/roles";
import RoleCard from "./RoleCard";

const GOLD: React.CSSProperties = {
  backgroundImage: "linear-gradient(180deg, var(--gold-1) 0%, var(--gold-2) 48%, var(--gold-3) 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
};

export default function RoleDetailPage({ role }: { role: Role }) {
  const related = ROLES.filter((item) => item.slug !== role.slug).slice(0, 3);

  return (
    <main className="section-bg min-h-screen">
      <header className="px-6 pb-14 pt-36 md:px-14 md:pb-14 md:pt-44">
        <div className="caption flex flex-wrap items-center gap-3" style={{ color: "var(--ink)", opacity: 0.76, letterSpacing: "0.22em" }}>
          <Link href="/">Home</Link><span>/</span><Link href="/careers">Careers</Link><span>/</span>
          <Link href="/careers/open-roles">Open Roles</Link><span>/</span>
          <span style={{ color: "var(--bronze-hi)" }}>{role.title}</span>
        </div>
        <div className="mt-14 max-w-[980px]">
          <span className="caption" style={{ color: "var(--bronze-hi)", letterSpacing: "0.2em" }}>{role.company}</span>
          <h1 className="display mt-5 text-[clamp(3rem,7vw,96px)] leading-[0.96]" style={GOLD}>{role.title}</h1>
          <div className="caption mt-9 flex flex-wrap items-center gap-5" style={{ color: "var(--ink)", opacity: 1, letterSpacing: "0.14em" }}>
            <span>{role.location}</span><span className="h-[3px] w-[3px] rounded-full bg-current" /><span>{role.type}</span><span className="h-[3px] w-[3px] rounded-full bg-current" /><span>{role.posted}</span>
          </div>
        </div>
      </header>

      <section className="px-6 pb-28 md:px-14 md:pb-40">
        <div className="grid gap-14 border-t pt-14 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-24" style={{ borderColor: "var(--line)" }}>
          <div className="max-w-[760px] space-y-16">
            <section>
              <h2 className="display text-[clamp(2rem,3.5vw,44px)]" style={GOLD}>Job Description</h2>
              <p className="mt-7 max-w-[64ch] font-medium" style={{ color: "var(--ink)", fontFamily: "var(--font-social), sans-serif", fontSize: "17px", lineHeight: 1.85, opacity: 1 }}>{role.description}</p>
            </section>
            {[{ title: "Key Responsibilities", items: role.responsibilities }, { title: "Requirements", items: role.requirements }].map((block) => (
              <section key={block.title}>
                <h2 className="display text-[clamp(2rem,3.5vw,44px)]" style={GOLD}>{block.title}</h2>
                <ul className="mt-7 space-y-5">
                  {block.items.map((item) => (
                    <li key={item} className="flex max-w-[66ch] gap-5 font-medium" style={{ color: "var(--ink)", fontFamily: "var(--font-social), sans-serif", fontSize: "17px", lineHeight: 1.75, opacity: 1 }}>
                      <span className="mt-[0.78em] h-[3px] w-[3px] shrink-0 rounded-full" style={{ background: "var(--bronze-hi)" }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <aside
            className="apply-card group/apply h-fit border p-8 [transform:translate3d(0,0,0)] will-change-transform hover:[transform:translate3d(0,-4px,0)] hover:shadow-[0_22px_52px_rgba(36,24,15,0.09)] lg:sticky lg:top-28"
            style={{
              borderColor: "var(--line)",
              background: "rgba(255,255,255,0.12)",
              transition:
                "transform 850ms cubic-bezier(0.22,1,0.36,1), box-shadow 850ms cubic-bezier(0.22,1,0.36,1), border-color 500ms ease, background-color 500ms ease",
            }}
          >
            <span className="caption" style={{ color: "var(--bronze-hi)", letterSpacing: "0.18em" }}>Join Alpago</span>
            <h2 className="display mt-5 text-[32px] leading-tight" style={GOLD}>Apply for this position</h2>
            <p className="mt-5 font-medium" style={{ color: "var(--ink)", fontFamily: "var(--font-social), sans-serif", fontSize: "15px", lineHeight: 1.7, opacity: 1 }}>Tell us about the experience and perspective you would bring to {role.company}.</p>
            <Link
              href={`/careers/open-roles/${role.slug}/apply`}
              className="alpago-dark-button caption mt-8 inline-flex px-9 py-4 [transform:translate3d(0,0,0)] hover:[transform:translate3d(0,-2px,0)]"
              style={{
                letterSpacing: "0.15em",
                transition:
                  "transform 600ms cubic-bezier(0.22,1,0.36,1), background-color 400ms ease, color 400ms ease, box-shadow 600ms ease",
              }}
            >
              Apply Now
            </Link>
          </aside>
        </div>
      </section>

      <section className="px-6 pb-32 md:px-14 md:pb-40">
        <div className="flex items-end justify-between border-t pt-14" style={{ borderColor: "var(--line)" }}>
          <div><span className="caption" style={{ color: "var(--bronze-hi)" }}>Careers at Alpago</span><h2 className="display mt-4 text-[clamp(2.2rem,4.2vw,54px)]" style={GOLD}>Other Open Roles</h2></div>
          <Link href="/careers/open-roles" className="caption link-underline" style={{ color: "var(--bronze-hi)" }}>Explore All</Link>
        </div>
        <div className="mt-12 grid gap-x-8 gap-y-16 md:grid-cols-3 md:gap-y-20 xl:gap-x-14">
          {related.map((item) => <RoleCard key={item.slug} role={item} />)}
        </div>
      </section>
    </main>
  );
}
