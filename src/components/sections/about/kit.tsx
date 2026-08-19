"use client";

/** Shared helpers for the experiential (pinned, scroll-scrubbed) About acts. */

export const GOLD: React.CSSProperties = {
  display: "inline-block",
  whiteSpace: "pre",
  backgroundImage: "linear-gradient(180deg, var(--gold-1) 0%, var(--gold-2) 48%, var(--gold-3) 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
};

/** Site-wide ceiling for centred statement headlines. */
export const STATEMENT_TITLE: React.CSSProperties = {
  fontSize: "clamp(1.35rem, 3.1vw, 42px)",
  lineHeight: 1.16,
  letterSpacing: "-0.01em",
};

export const smoothstep = (t: number) => {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
};
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** keep the last word bound so no orphan wraps alone */
export const noOrphan = (s: string) => s.replace(/ (\S+)$/, String.fromCharCode(160) + "$1");

/** Headline split into gold, per-character spans (class drives the blur-reveal). */
export function GoldLines({
  lines,
  charClass,
  style,
}: {
  lines: string[];
  charClass: string;
  style?: React.CSSProperties;
}) {
  return (
    <>
      {lines.map((line, i) => (
        <div
          key={i}
          className="display"
          style={{
            ...STATEMENT_TITLE,
            whiteSpace: "nowrap",
            paddingBottom: "0.06em",
            ...style,
          }}
        >
          {Array.from(line).map((ch, ci) => (
            <span key={ci} className={charClass} style={GOLD}>
              {ch}
            </span>
          ))}
        </div>
      ))}
    </>
  );
}

/** Paragraph split into word spans (class drives the blur-reveal). */
export function Words({ text, wordClass }: { text: string; wordClass: string }) {
  return (
    <>
      {noOrphan(text)
        .split(" ")
        .map((word, wi, arr) => (
          <span key={wi} className={wordClass} style={{ display: "inline-block", whiteSpace: "pre" }}>
            {word}
            {wi < arr.length - 1 ? " " : ""}
          </span>
        ))}
    </>
  );
}
