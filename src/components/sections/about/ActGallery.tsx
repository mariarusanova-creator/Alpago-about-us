"use client";

/**
 * Closing statement before the footer — a single full-bleed image with the centred
 * title + paragraph on top. It stays pinned behind Awards, so the award stage
 * leaves through the top edge to uncover a screen that was already in place.
 */
export default function ActGallery() {
  return (
    <section
      id="gallery"
      data-navoff="1"
      className="nav-dark sticky top-0 z-0 h-screen w-full overflow-hidden"
      style={{ background: "#e0dcd1" }}
    >
      <div
        data-gallery-composition
        className="absolute inset-0 will-change-[opacity,filter]"
        style={{ opacity: 0 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/media/alp/gallery-layerfw.png" alt="" className="h-full w-full object-cover" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(rgba(10,8,6,0.32), rgba(10,8,6,0.32)), " +
            "radial-gradient(72% 58% at 50% 50%, rgba(10,8,6,0.58) 0%, rgba(10,8,6,0.4) 55%, rgba(10,8,6,0.28) 100%)",
        }}
      />

      <div className="over-img absolute inset-0 mx-auto flex max-w-[1100px] flex-col items-center justify-center px-6 text-center">
        <h2
          className="display"
          style={{
            backgroundImage: "linear-gradient(180deg, var(--gold-1) 0%, var(--gold-2) 48%, var(--gold-3) 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
            fontSize: "clamp(1.35rem, 3.1vw, 42px)",
            lineHeight: 1.16,
            letterSpacing: "-0.01em",
            paddingBottom: "0.06em",
          }}
        >
          Dive into the full Alpago experience.
        </h2>
        <p
          className="mt-[27px] mx-auto"
          style={{
            color: "var(--ink-strong)",
            maxWidth: "56ch",
            fontFamily: "var(--font-social), sans-serif",
            fontSize: "16.5px",
            lineHeight: 1.75,
            textShadow: "0 1px 18px rgba(10,8,6,0.55)",
          }}
        >
          From the first sketch to the final handover, every project is a study in
          restraint and rarity. Step inside the world we build.
        </p>
      </div>
      </div>
    </section>
  );
}
