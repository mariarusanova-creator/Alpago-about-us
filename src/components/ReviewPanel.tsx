"use client";

import { useEffect, useState } from "react";
import type { ConvictionVariant } from "./sections/ConvictionSwitch";
import type { UspsVariant } from "./sections/UspsSwitch";

/**
 * One collapsible panel for all the review A/B switchers (replaces the separate
 * pills that were stacking up at bottom-centre). Collapsed by default to a small
 * "Review" pill; the open state survives the full page load a switch performs
 * (sessionStorage), so after picking a variant the panel is still open.
 * Picks navigate (full page load) — variants are chosen server-side; see the
 * switcher components for why this must never become a client-side swap.
 */
export default function ReviewPanel({
  conviction,
  usps,
}: {
  conviction: ConvictionVariant;
  usps: UspsVariant;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(sessionStorage.getItem("alpago:review-open") === "1");
  }, []);

  const toggle = () => {
    const next = !open;
    sessionStorage.setItem("alpago:review-open", next ? "1" : "0");
    setOpen(next);
  };

  const pick = (param: string, value: string, current: string) => {
    if (value === current) return;
    // picking implies the panel is in use — keep it open across the page load
    sessionStorage.setItem("alpago:review-open", "1");
    const url = new URL(window.location.href);
    url.searchParams.set(param, value);
    window.location.assign(url.toString());
  };

  const GROUPS: {
    param: string;
    label: string;
    current: string;
    options: { id: string; label: string; hint: string }[];
  }[] = [
    {
      param: "conviction",
      label: "Conviction reveal",
      current: conviction,
      options: [
        { id: "shape", label: "Shape", hint: "Silhouette scales up in place" },
        { id: "wipe", label: "Soft wipe", hint: "Film reveals bottom-to-top, feathered edge" },
      ],
    },
    {
      param: "usps",
      label: "USPs section",
      current: usps,
      options: [
        { id: "panorama", label: "Panorama", hint: "Client design — image melts into the page" },
        { id: "facade", label: "Facade", hint: "One facade holds; gold arcs draw as claims cycle" },
        { id: "depth", label: "Depth", hint: "Previous design — 3D depth gallery" },
      ],
    },
  ];

  return (
    <div className="fixed bottom-5 left-1/2 z-[75] flex -translate-x-1/2 flex-col items-center gap-2 md:bottom-7">
      {open && (
        <div
          className="flex flex-col gap-4 rounded-2xl p-4 backdrop-blur-sm"
          style={{
            border: "1px solid var(--line-strong)",
            background: "color-mix(in srgb, var(--bg) 82%, transparent)",
            minWidth: "270px",
          }}
        >
          {GROUPS.map((g) => (
            <div key={g.param} role="group" aria-label={`${g.label} style`}>
              <div className="caption mb-2" style={{ fontSize: "0.5rem", color: "var(--ink-faint)" }}>
                {g.label}
              </div>
              <div
                className="flex items-center gap-1 rounded-full p-1"
                style={{ border: "1px solid var(--line)" }}
              >
                {g.options.map((o) => {
                  const active = o.id === g.current;
                  return (
                    <button
                      key={o.id}
                      onClick={() => pick(g.param, o.id, g.current)}
                      aria-pressed={active}
                      title={o.hint}
                      className="caption flex-1 rounded-full px-4 py-2 transition-colors duration-300"
                      style={{
                        fontSize: "0.5rem",
                        letterSpacing: "0.16em",
                        background: active ? "var(--ink)" : "transparent",
                        color: active ? "var(--btn-ink, #1c150e)" : "var(--ink-dim)",
                      }}
                    >
                      {o.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={toggle}
        aria-expanded={open}
        aria-label="Toggle review options"
        className="caption flex items-center gap-2 rounded-full px-5 py-2.5 backdrop-blur-sm transition-colors duration-300"
        style={{
          fontSize: "0.5rem",
          letterSpacing: "0.18em",
          border: "1px solid var(--line-strong)",
          background: "color-mix(in srgb, var(--bg) 82%, transparent)",
          color: "var(--ink-dim)",
        }}
      >
        Review
        <span aria-hidden style={{ fontSize: "0.55rem", lineHeight: 1 }}>
          {open ? "▾" : "▴"}
        </span>
      </button>
    </div>
  );
}
