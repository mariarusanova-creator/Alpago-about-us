"use client";

import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { ScrollTrigger } from "@/lib/gsap";
import { TRAIL, Trail, headPos } from "./trail";

/**
 * USPs — client-team design: a full-height image on the LEFT that melts into the
 * cream page through soft feathered edges, a right-aligned text block (headline
 * with a bold metric phrase + short supporting line), and thin gold arc lines
 * drifting across the background. The bottom measuring ruler from the previous
 * treatment is kept (the "lines" the client liked).
 *
 * Transitions per item, matching the site rule "text first, then the mask reveal":
 * the previous text blurs away → the new text blur-reveals → THEN the new image
 * wipes up over the old one behind the soft feathered edge. Pinned + scrubbed.
 */
export const ITEMS = [
  {
    metric: "UAE record",
    img: "/media/alp/img-3195.jpg",
    pre: "Casa del Sole — the ",
    bold: "highest villa transaction",
    post: " ever recorded in the UAE.",
    body: "A benchmark sale on Palm Jumeirah that redefined the ceiling of the ultra-prime market.",
  },
  {
    metric: "Top 18",
    img: "/media/alp/img-3714.jpg",
    pre: "Kural Vista — among the ",
    bold: "eighteen most beautiful homes",
    post: " in Dubai.",
    body: "Recognised design — architecture as a statement of restraint, never excess.",
  },
  {
    metric: "6 villas",
    img: "/media/alp/aerial.jpg",
    pre: "",
    bold: "Six signature villas",
    post: " on Palm Jumeirah’s Billionaires’ Row.",
    body: "A beachfront enclave that helped catalyse Dubai’s most coveted address.",
  },
  {
    metric: "+30–40%",
    img: "/media/alp/dsc00258.jpg",
    pre: "",
    bold: "Thirty to forty percent",
    post: " above market-average return on investment.",
    body: "Sustained performance across our completed developments — value that endures.",
  },
  {
    metric: "World Top 100",
    img: "/media/alp/dsc09291.jpg",
    pre: "Ranked among the ",
    bold: "Top 100 Real Estate Developers",
    post: " of the World.",
    body: "Global recognition for a deliberately selective portfolio.",
  },
  {
    metric: "2024–25",
    img: "/media/alp/dsc09633.jpg",
    pre: "",
    bold: "Best International Residential Development",
    post: ", 2024–25.",
    body: "Awarded for setting a new benchmark in residential craft.",
  },
  {
    metric: "2024–25",
    img: "/media/alp/palmflower-facade.jpg",
    pre: "",
    bold: "Best International Single Apartment Condominium",
    post: ", 2024–25.",
    body: "Palm Flower — a singular expression of vertical beachfront living.",
  },
  {
    metric: "WiredScore",
    img: "/media/alp/palmflower-dropoff.jpg",
    pre: "Palm Flower earns ",
    bold: "WiredScore certification",
    post: ".",
    body: "Pioneering smart, connected luxury living in the region.",
  },
];

const CAM_DIST = 6.5; // same camera distance the depth gallery uses for the trail
const smoothstep = (t: number) => t * t * (3 - 2 * t);
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const noOrphan = (s: string) => s.replace(/ (\S+)$/, String.fromCharCode(160) + "$1");

// the whole image block melts into the page on its right + bottom edges
const EDGE_MASK: React.CSSProperties = {
  WebkitMaskImage:
    "linear-gradient(to left, transparent 0%, rgba(0,0,0,0.18) 10%, #000 30%), linear-gradient(to top, transparent 0%, #000 14%)",
  maskImage:
    "linear-gradient(to left, transparent 0%, rgba(0,0,0,0.18) 10%, #000 30%), linear-gradient(to top, transparent 0%, #000 14%)",
  WebkitMaskComposite: "source-in",
  maskComposite: "intersect",
};

// each image reveals bottom-to-top behind its own soft feathered edge
const REVEAL_MASK: React.CSSProperties = {
  "--r": "-15%",
  WebkitMaskImage: "linear-gradient(to top, #000 var(--r), rgba(0,0,0,0) calc(var(--r) + 15%))",
  maskImage: "linear-gradient(to top, #000 var(--r), rgba(0,0,0,0) calc(var(--r) + 15%))",
} as React.CSSProperties;

export type UspPanoramaItem = (typeof ITEMS)[number];

export default function UspsPanorama({
  items = ITEMS,
  eyebrow = "What sets us apart",
  staticImage,
  textRight,
  extendImageFade = false,
  staticImageZoom = false,
}: {
  items?: UspPanoramaItem[];
  eyebrow?: string;
  staticImage?: string;
  textRight?: string;
  extendImageFade?: boolean;
  staticImageZoom?: boolean;
}) {
  const N = items.length;
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const imgs = useRef<(HTMLDivElement | null)[]>([]);
  const texts = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const sec = section.current;
    const stg = stage.current;
    if (!sec || !stg) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const audit = new URLSearchParams(window.location.search).has("audit");

    // THE animated line — the exact same glowing tapered trail as the depth design
    // (shared Trail class + head path), rendered on a transparent overlay canvas and
    // driven by the same scroll rules: grow with progress, reset on a real reverse,
    // fade at the ends.
    const cvs = canvas.current;
    let renderer: THREE.WebGLRenderer | null = null;
    if (cvs) {
      try {
        renderer = new THREE.WebGLRenderer({ canvas: cvs, antialias: true, alpha: true });
      } catch {
        renderer = null;
      }
    }
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.z = CAM_DIST;
    const trail = new Trail();
    // over the cream page the trail is bronze (same rule the depth gallery applies)
    if (document.body.classList.contains("light")) trail.material.color.set("#8a6a3e");
    scene.add(trail.group);
    const headV = new THREE.Vector3();
    let prevProgress = -1;
    // seed a short trail at the start so it exists immediately
    headPos(CAM_DIST, 0, headV);
    for (let i = TRAIL.seedCount; i >= 0; i--) {
      trail.addPoint(headV.clone().add(new THREE.Vector3(0, 0, -i * TRAIL.seedStepZ)));
    }
    const render = () => {
      if (!renderer) return;
      renderer.setClearColor(0x000000, 0);
      renderer.render(scene, camera);
    };
    const resize = () => {
      if (!renderer || !cvs) return;
      const w = cvs.clientWidth || window.innerWidth || 1280;
      const h = cvs.clientHeight || window.innerHeight || 720;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      render();
    };
    const trailStep = (P: number) => {
      if (prevProgress >= 0 && P < prevProgress - 0.02) trail.reset();
      trail.maxPoints = Math.round(THREE.MathUtils.lerp(TRAIL.minPoints, TRAIL.maxPoints, P));
      headPos(camera.position.z, P, headV);
      trail.addPoint(headV);
      const edge = Math.min(P + 0.06, 1 - P);
      trail.material.opacity = TRAIL.opacity * smoothstep(clamp(edge / 0.16));
      prevProgress = P;
      render();
    };

    const setBlock = (el: Element | null, a: number) => {
      if (!el) return;
      const s = (el as HTMLElement).style;
      s.opacity = a.toFixed(3);
      s.filter = `blur(${((1 - a) * 10).toFixed(2)}px)`;
      s.transform = `translateY(${((1 - a) * 16).toFixed(1)}px)`;
    };

    const apply = (P: number) => {
      const pos = P * N; // 0..N — one unit per item
      for (let i = 0; i < N; i++) {
        const t = clamp(pos - i); // local progress of item i's slice
        const tn = clamp(pos - (i + 1)); // local progress of the NEXT slice

        // text first — headline in, then the supporting line
        const tin = smoothstep(clamp((t - (i === 0 ? 0 : 0.08)) / 0.3));
        const bodyIn = smoothstep(clamp((t - (i === 0 ? 0.08 : 0.16)) / 0.3));
        const tout = i === N - 1 ? 0 : smoothstep(clamp(tn / 0.22));
        const wrap = texts.current[i];
        if (wrap) {
          const kids = wrap.children;
          setBlock(kids[0], tin * (1 - tout)); // metric
          setBlock(kids[1], tin * (1 - tout)); // headline
          setBlock(kids[2], bodyIn * (1 - tout)); // body
        }

        // …then the mask reveal — the image wipes up behind the feathered edge
        const rev = smoothstep(clamp((t - (i === 0 ? 0.38 : 0.45)) / 0.4));
        const im = imgs.current[i];
        if (im) {
          im.style.setProperty("--r", (rev * 115 - 15).toFixed(2) + "%");
          im.style.transform = `scale(${(1.05 - 0.05 * rev).toFixed(3)})`;
        }
      }

      // the trail snakes onward with progress — exact same motion as the depth design
      trailStep(P);
    };

    resize();
    window.addEventListener("resize", resize);
    const ro = new ResizeObserver(() => resize());
    if (cvs) ro.observe(cvs);

    if (audit || reduce) {
      // static frame: simulate a stretch of scroll so a real drawn trail is visible
      for (let p = 0; p <= 0.11; p += 0.004) trailStep(p);
      apply(0.9 / N); // item 01 fully in — representative frame
      return () => {
        window.removeEventListener("resize", resize);
        ro.disconnect();
        trail.dispose();
        renderer?.dispose();
      };
    }

    apply(0);
    stg.style.opacity = "0"; // hidden until it pins (pulled-up behind the prev section)

    const st = ScrollTrigger.create({
      trigger: sec,
      start: "top top",
      end: "+=" + N * 45 + "%",
      pin: stg,
      pinType: "fixed",
      scrub: 0.6,
      invalidateOnRefresh: true,
      // re-apply the CURRENT progress on refresh (never 0 — see project notes)
      onRefresh: (self) => apply(clamp(self.progress / 0.94)),
      onUpdate: (self) => {
        apply(clamp(self.progress / 0.94));
        const inA = clamp(self.progress / 0.04);
        const outA = clamp((self.progress - 0.96) / 0.04);
        stg.style.opacity = (smoothstep(inA) * (1 - smoothstep(outA))).toFixed(3);
      },
    });

    return () => {
      st.kill();
      window.removeEventListener("resize", resize);
      ro.disconnect();
      trail.dispose();
      renderer?.dispose();
    };
  }, []);

  return (
    <section id="usps" ref={section} className="relative" style={{ marginTop: "-100vh" }}>
      {/* section-bg = opaque page-matched gradient so the acts behind never bleed through */}
      <div ref={stage} className="section-bg relative h-screen w-full overflow-hidden">
        {/* image panorama — full height, left; melts into the page on the right/bottom */}
        <div
          className="absolute inset-y-0 left-0 w-full md:w-[58%]"
          style={
            extendImageFade
              ? {
                  ...EDGE_MASK,
                  WebkitMaskImage:
                    "linear-gradient(to left, transparent 0%, rgba(0,0,0,0.18) calc(10% + 10px), #000 calc(30% + 20px)), linear-gradient(to top, transparent 0%, #000 14%)",
                  maskImage:
                    "linear-gradient(to left, transparent 0%, rgba(0,0,0,0.18) calc(10% + 10px), #000 calc(30% + 20px)), linear-gradient(to top, transparent 0%, #000 14%)",
                }
              : EDGE_MASK
          }
        >
          {staticImage ? (
            <div
              className="absolute inset-0"
              style={{ transform: staticImageZoom ? "scale(1.045)" : undefined, transition: "transform 2.4s cubic-bezier(0.22,1,0.36,1)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={staticImage} alt="" className="h-full w-full object-cover" />
            </div>
          ) : items.map((it, i) => (
            <div
              key={i}
              ref={(el) => {
                imgs.current[i] = el;
              }}
              className="absolute inset-0 will-change-transform"
              style={REVEAL_MASK}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={staticImage ?? it.img} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>

        {/* the glowing trail — the exact same animated line as the depth design,
            snaking across the whole frame as you scroll */}
        <canvas ref={canvas} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />

        {/* mobile: keep the text legible where it sits over the image */}
        <div
          className="pointer-events-none absolute inset-0 md:hidden"
          style={{
            background:
              "linear-gradient(to right, transparent 20%, color-mix(in srgb, var(--bg) 78%, transparent) 62%)",
          }}
        />

        {/* same right offset + width as the text block below, so its left edge lines
            up with the headline rather than sitting centred on the page */}
        <span
          className="caption absolute right-6 top-[14vh] z-10 block w-[86vw] max-w-[430px] md:right-[300px]"
          style={textRight ? { right: textRight } : undefined}
        >
          {eyebrow}
        </span>

        {/* text block — right column; items stacked in the same grid cell. The 300px
            right offset clears the fixed PageNav rail, whose widest pill
            ("Billionaire's Row") reaches 265px in from the right edge and was landing
            on top of this copy. */}
        <div
          className="absolute right-6 top-[26vh] z-10 grid w-[86vw] max-w-[430px] md:right-[300px]"
          style={textRight ? { right: textRight } : undefined}
        >
          {items.map((it, i) => (
            <div
              key={i}
              ref={(el) => {
                texts.current[i] = el;
              }}
              style={{ gridArea: "1 / 1" }}
            >
              <span className="caption mb-5 block" style={{ fontSize: "0.62rem", color: "var(--bronze-hi)", opacity: 0 }}>
                {it.metric}
              </span>
              <h3
                className="display m-0"
                style={{
                  fontSize: "clamp(1.4rem, 2.4vw, 36px)",
                  lineHeight: 1.28,
                  letterSpacing: "-0.01em",
                  color: "var(--bronze)",
                  opacity: 0,
                }}
              >
                {it.pre}
                <span style={{ fontWeight: 500 }}>{it.bold}</span>
                {it.post}
              </h3>
              <p
                className="mt-[29px]"
                style={{
                  color: "var(--ink-dim)",
                  fontFamily: "var(--font-social), sans-serif",
                  fontSize: "15px",
                  lineHeight: 1.75,
                  maxWidth: "40ch",
                  opacity: 0,
                }}
              >
                {noOrphan(it.body)}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
