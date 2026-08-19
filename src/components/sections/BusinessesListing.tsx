import Link from "next/link";
import SiteFooter from "@/components/sections/SiteFooter";

const BUSINESSES = [
  {
    name: "Alpago Properties",
    sector: "Ultra-Prime Real Estate",
    image: "/media/alp/palmflower-facade.jpg",
    href: "/businesses/alpago-properties",
    position: "center",
  },
  {
    name: "Alpago Design & Build",
    sector: "Design & Construction",
    image: "/media/alp/dsc09291.jpg",
    href: "/businesses/alpago-design-build",
    position: "center",
  },
  {
    name: "F1rst Motors",
    sector: "Rare Automobiles",
    image: "/media/alp/about-firstmotors.jpg",
    href: "/businesses/f1rst-motors",
    position: "center",
  },
];

export default function BusinessesListing() {
  return (
    <div id="top" className="section-bg min-h-screen">
      <section aria-labelledby="businesses-heading" className="pt-[104px] md:pt-[122px]">
        <h1 id="businesses-heading" className="sr-only">Alpago Businesses</h1>

        <div className="grid md:grid-cols-3">
          {BUSINESSES.map((business) => (
            <Link
              key={business.name}
              href={business.href}
              className="group relative block h-[76svh] min-h-[560px] overflow-hidden border-t border-[rgba(236,227,213,0.5)] first:border-t-0 md:h-[calc(100svh-122px)] md:min-h-[620px] md:border-l md:border-t-0 md:first:border-l-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={business.image}
                alt=""
                className="ease-alpago absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                style={{ objectPosition: business.position }}
              />

              <div
                className="pointer-events-none absolute inset-0 transition-opacity duration-700 group-hover:opacity-90"
                style={{
                  background:
                    "linear-gradient(to top, rgba(10,8,6,0.68) 0%, rgba(10,8,6,0.14) 38%, rgba(10,8,6,0.18) 100%)",
                }}
              />

              <span
                aria-hidden
                className="absolute right-[6%] top-[7%] grid h-12 w-12 place-items-center border text-white transition-[background-color,color,border-color,transform] duration-500 group-hover:border-white group-hover:bg-white group-hover:text-[#33251a] group-hover:[transform:translate3d(0,-2px,0)]"
                style={{
                  borderColor: "rgba(255,255,255,0.58)",
                  background: "rgba(31,25,20,0.16)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                }}
              >
                <svg viewBox="0 0 28 28" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M8 20 20 8M10 8h10v10" />
                </svg>
              </span>

              <div className="absolute inset-x-0 bottom-[12%] px-7 text-center md:px-8">
                <span
                  className="caption mb-4 block"
                  style={{
                    color: "rgba(255,255,255,0.95)",
                    fontSize: "0.78rem",
                    letterSpacing: "0.2em",
                    textShadow: "0 1px 16px rgba(10,8,6,0.65)",
                  }}
                >
                  {business.sector}
                </span>
                <h2
                  className="display mx-auto max-w-[18ch]"
                  style={{
                    color: "rgba(255,255,255,0.98)",
                    fontSize: "clamp(1.8rem,2.75vw,42px)",
                    lineHeight: 1.12,
                    textShadow: "0 1px 24px rgba(10,8,6,0.72)",
                  }}
                >
                  {business.name}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div aria-hidden className="h-[250px]" />
      <SiteFooter />
    </div>
  );
}
