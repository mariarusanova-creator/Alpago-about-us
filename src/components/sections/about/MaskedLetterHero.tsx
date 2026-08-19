"use client";

/**
 * MaskedLetterHero — the Alpago "a" straddling a two-band split, after the Alpago
 * Instagram key-frames:
 *   · TOP band  = plain cream + the two-tier header; the upper half of the "a" is a
 *                 WINDOW onto a film (footage shows through the letter).
 *   · BOTTOM band = a full-bleed image; the lower half of the "a" is knocked out in
 *                 cream, so the letter reads as a solid silhouette over the photo.
 * The single "a" glyph is shared by both bands, so it's continuous across the divide.
 *
 * One self-contained inline SVG does it all: a mask (white = inside the letter), two
 * horizontal clip bands, a <foreignObject> film in the top band's letter, a photo in
 * the bottom band, and a cream letter over that photo.
 */

const XHTML = "http://www.w3.org/1999/xhtml";

export default function MaskedLetterHero({
  eyebrow,
  headThin,
  headBold,
  video,
  bottomImage,
  poster,
  letter = "a",
}: {
  eyebrow: string;
  headThin: string[];
  headBold: string;
  video: string;
  bottomImage: string;
  poster?: string;
  letter?: string;
}) {
  // viewBox geometry — landscape; the divide sits at 58%, the glyph centred on it
  const W = 1000;
  const H = 620;
  const DIV = 360; // band divide (y)

  return (
    <section className="section-bg relative z-10 w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        className="block w-full"
        style={{ height: "clamp(460px, 84vh, 940px)" }}
        role="img"
        aria-label={`Alpago — ${eyebrow}`}
      >
        <defs>
          <mask id="alpago-a-mask">
            <rect x="0" y="0" width={W} height={H} fill="#000" />
            <text
              x={W / 2}
              y="380"
              textAnchor="middle"
              dominantBaseline="central"
              fill="#fff"
              style={{ fontFamily: "var(--font-basel), serif", fontWeight: 400, fontSize: "540px", letterSpacing: "-0.02em" }}
            >
              {letter}
            </text>
          </mask>
          <clipPath id="alpago-top-band">
            <rect x="0" y="0" width={W} height={DIV} />
          </clipPath>
          <clipPath id="alpago-bottom-band">
            <rect x="0" y={DIV} width={W} height={H - DIV} />
          </clipPath>
        </defs>

        {/* BOTTOM band — full-bleed photo, with the lower half of the "a" in cream */}
        <g clipPath="url(#alpago-bottom-band)">
          <foreignObject x="0" y="0" width={W} height={H}>
            <div {...{ xmlns: XHTML }} style={{ width: "100%", height: "100%" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={bottomImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </foreignObject>
          <rect x="0" y="0" width={W} height={H} fill="var(--bg)" mask="url(#alpago-a-mask)" />
        </g>

        {/* TOP band — cream, with the upper half of the "a" a window onto the film */}
        <g clipPath="url(#alpago-top-band)">
          <rect x="0" y="0" width={W} height={H} fill="var(--bg)" />
          <g mask="url(#alpago-a-mask)">
            <foreignObject x="0" y="0" width={W} height={H}>
              <div {...{ xmlns: XHTML }} style={{ width: "100%", height: "100%" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <video
                  src={video}
                  poster={poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </foreignObject>
          </g>
        </g>
      </svg>

      {/* two-tier header — overlaid on the plain top band */}
      <div className="pointer-events-none absolute inset-x-0 top-0">
        <div className="mx-auto w-full max-w-[1320px] px-6 pt-[15vh] md:px-14">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-[minmax(0,0.5fr)_minmax(0,1fr)] md:gap-16">
            <span className="caption self-start" style={{ color: "var(--bronze)", letterSpacing: "0.2em" }}>
              {eyebrow}
            </span>
            <h1
              className="display m-0"
              style={{ color: "var(--ink)", fontSize: "clamp(1.5rem, 3vw, 40px)", lineHeight: 1.24, letterSpacing: "-0.01em", overflowWrap: "anywhere" }}
            >
              {headThin.map((line, i) => (
                <span key={i} className="block" style={{ fontWeight: 400 }}>
                  {line}
                </span>
              ))}
              <span className="block" style={{ fontWeight: 500, color: "var(--ink-strong)" }}>
                {headBold}
              </span>
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
