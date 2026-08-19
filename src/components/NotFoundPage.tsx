import Nav from "@/components/Nav";

export default function NotFoundPage() {
  return (
    <main data-not-found-page id="top" className="relative isolate min-h-[100svh] overflow-hidden bg-[#0a0806] text-white">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/media/video/hero-2-hd.mp4"
        poster="/media/poster/hero.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/35" />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(circle at center, transparent 0%, rgba(8,5,3,.12) 48%, rgba(8,5,3,.45) 100%)" }}
      />

      <Nav />

      <section className="relative z-10 flex min-h-[100svh] items-center justify-center px-6 pb-24 pt-28 text-center md:px-12 md:pb-28">
        <div className="flex max-w-3xl flex-col items-center">
          <p className="caption mb-5 text-white/70" style={{ fontSize: "0.62rem", letterSpacing: "0.32em" }}>
            Page not found
          </p>
          <h1 className="display text-[clamp(6rem,17vw,14rem)] leading-[0.72] tracking-[-0.055em] text-white">
            404
          </h1>
          <p
            className="mt-6 max-w-[43ch] -translate-y-5 text-[15.5px] leading-relaxed"
            style={{ color: "#fff", textShadow: "0 1px 22px rgba(10,8,6,0.65)" }}
          >
            Sorry, we can&apos;t find the page you are looking for
          </p>
          <a
            href="/"
            className="mt-4 inline-flex min-h-12 items-center justify-center bg-white px-8 py-4 text-[#1c150e] uppercase transition-colors duration-500 hover:bg-[#876540] hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white"
            style={{ fontSize: "0.58rem", letterSpacing: "0.18em", fontWeight: 400 }}
          >
            Back to Home Page
          </a>
        </div>
      </section>

    </main>
  );
}
