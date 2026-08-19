import Link from "next/link";
import type { Role } from "@/data/roles";

export default function RoleCard({ role }: { role: Role }) {
  return (
    <article className="relative flex min-h-[500px] flex-col md:min-h-[540px]">
      <div className="flex min-h-9 items-center justify-between gap-5 px-1 pb-4">
        <span className="caption leading-none" style={{ color: "var(--ink)", opacity: 0.82, letterSpacing: "0.18em" }}>{role.posted}</span>
        <span className="caption text-right leading-none" style={{ color: "var(--bronze-hi)", letterSpacing: "0.18em" }}>{role.company}</span>
      </div>
      <Link
        href={`/careers/open-roles/${role.slug}`}
        aria-label={`View ${role.title}`}
        className="group/panel relative flex flex-1 flex-col rounded-[7px] p-7 [transform:translate3d(0,0,0)] will-change-transform hover:[transform:translate3d(0,-5px,0)] hover:shadow-[0_24px_56px_rgba(36,24,15,0.08)] md:p-9"
        style={{
          background: "rgba(126,91,56,0.09)",
          transition:
            "transform 950ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 950ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <div>
          <h3 className="display text-[clamp(1.85rem,2.8vw,42px)] leading-[1.04]" style={{ color: "var(--ink)" }}>{role.title}</h3>
          <p className="mt-7 max-w-[42ch]" style={{ color: "var(--ink-dim)", fontFamily: "var(--font-social), sans-serif", fontSize: "15.5px", lineHeight: 1.72 }}>{role.description}</p>
        </div>
        <div className="mt-auto flex items-end justify-between gap-4 pt-12">
          <div className="caption flex flex-wrap items-center leading-none" style={{ color: "var(--ink)", opacity: 0.72, letterSpacing: "0.12em" }}>
            <span>{role.location}</span>
            <span aria-hidden className="mx-4 h-[3px] w-[3px] shrink-0 rounded-full bg-current" />
            <span>{role.type}</span>
          </div>
          <span
            aria-hidden
            className="flex h-12 w-12 shrink-0 items-center justify-center border text-[color:var(--ink)] group-hover/panel:border-[color:var(--ink)] group-hover/panel:bg-[color:var(--ink)] group-hover/panel:text-[color:var(--btn-ink)]"
            style={{
              borderColor: "rgba(43,34,26,0.3)",
              transition: "color 520ms ease, background-color 520ms ease, border-color 520ms ease",
            }}
          >
            <svg viewBox="0 0 28 28" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1"><path d="M8 20 20 8M10 8h10v10" /></svg>
          </span>
        </div>
      </Link>
    </article>
  );
}
