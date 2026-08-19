"use client";

import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { ScrollTrigger } from "@/lib/gsap";
import { TRAIL, Trail, headPos } from "./trail";
import { ITEMS } from "./UspsPanorama";

/**
 * USPs — "facade" treatment, built from the client comp
 * (~/Downloads/Framed-Allure-Website-USPs.png): the Framed Allure batten facade
 * bleeds in from the LEFT and fogs into the cream page, thin gold arcs sweep the
 * open right-hand field, and the claims cycle in the right column.
 *
 * The difference from `panorama` is deliberate: there, a different photograph
 * wipes in behind every claim. Here ONE building holds for the whole section and
 * only the claims change — the arcs carry the movement instead of the imagery.
 * (It is also honest to the assets: the comp supplies exactly one feathered
 * facade plate, not eight.)
 *
 * Same choreography contract as the other treatments — text first, then motion —
 * and the same pin/scrub rules (pinType fixed, re-apply progress on refresh).
 */

const N = ITEMS.length;
const IMG = "/media/alp/usp-facade.png";
const CAM_DIST = 6.5; // same camera distance the other USP treatments use for the trail

const smoothstep = (t: number) => t * t * (3 - 2 * t);
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const noOrphan = (s: string) => s.replace(/ (\S+)$/, String.fromCharCode(160) + "$1");

/**
 * The plate has two arrangements, and the facade image renders without a cream
 * veil so its colour matches the supplied PNG artwork. The desktop edge uses
 * alpha only: it fades out instead of cutting the palms/building with a hard crop.
 *
 *  · under xl — the copy needs a full-width column, so the photo drops to a band
 *    across the FOOT of the stage. The claims get clean cream above it; the image
 *    keeps its own colour.
 *  · xl and up — there is room beside the copy, so the photo takes the left side
 *    with no extra tint over the artwork.
 */
const PLATE_CSS = `
.uf-plate {
  position: absolute; left: 0; right: 0; bottom: 0; height: 46%;
  overflow: hidden;
}
.uf-plate-art {
  height: 100%;
  width: 100%;
}
.uf-plate-img {
  height: 100%;
  width: 100%;
  object-fit: contain;
  object-position: left bottom;
}
@media (min-width: 1280px) {
  .uf-plate {
    top: 0; height: 100%; right: auto;
    width: min(72vw, calc(100% - 420px));
    -webkit-mask-image: linear-gradient(to right, #000 0%, #000 58%, rgba(0,0,0,0.72) 72%, transparent 100%);
            mask-image: linear-gradient(to right, #000 0%, #000 58%, rgba(0,0,0,0.72) 72%, transparent 100%);
  }
  .uf-plate-art {
    width: auto;
  }
  .uf-plate-img {
    width: auto;
    max-width: none;
    object-fit: contain;
    object-position: left center;
  }
}
`;

export default function UspsFacade() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const plate = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const texts = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const sec = section.current;
    const stg = stage.current;
    if (!sec || !stg) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const audit = new URLSearchParams(window.location.search).has("audit");

    // THE animated line — the exact same glowing tapered trail the panorama and
    // depth treatments render (shared Trail class + head path), on a transparent
    // overlay canvas, driven by the same scroll rules: grow with progress, reset
    // on a real reverse, fade at the ends.
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
    // over the cream page the trail is bronze (same rule the other treatments apply)
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
      const pos = P * N;
      for (let i = 0; i < N; i++) {
        const t = clamp(pos - i);
        const tn = clamp(pos - (i + 1));
        // text first — metric + headline, then the supporting line
        const tin = smoothstep(clamp((t - (i === 0 ? 0 : 0.08)) / 0.3));
        const bodyIn = smoothstep(clamp((t - (i === 0 ? 0.08 : 0.16)) / 0.3));
        const tout = i === N - 1 ? 0 : smoothstep(clamp(tn / 0.22));
        const wrap = texts.current[i];
        if (wrap) {
          const kids = wrap.children;
          setBlock(kids[0], tin * (1 - tout));
          setBlock(kids[1], tin * (1 - tout));
          setBlock(kids[2], bodyIn * (1 - tout));
        }
      }

      // the building breathes very slightly rather than swapping
      const pl = plate.current;
      if (pl) pl.style.transform = `scale(${(1.06 - 0.06 * smoothstep(P)).toFixed(4)})`;

      // the trail snakes onward with progress — exact same motion as the others
      trailStep(P);
    };

    resize();
    window.addEventListener("resize", resize);
    const ro = new ResizeObserver(() => resize());
    if (cvs) ro.observe(cvs);

    if (audit || reduce) {
      // static frame: simulate a stretch of scroll so a real drawn trail is visible
      for (let p = 0; p <= 0.11; p += 0.004) trailStep(p);
      apply(0.9 / N);
      return () => {
        window.removeEventListener("resize", resize);
        ro.disconnect();
        trail.dispose();
        renderer?.dispose();
      };
    }

    apply(0);
    stg.style.opacity = "0"; // hidden until it pins (pulled up behind the prev section)

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
      <div ref={stage} className="section-bg relative h-screen w-full overflow-hidden">
        {/* the facade — one building, holding for the whole section */}
        <style>{PLATE_CSS}</style>
        <div className="uf-plate">
          <div ref={plate} className="uf-plate-art will-change-transform">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {/* under xl the plate is a wide, short band, so frame onto the walkway,
                water and uplights at the foot; beside the copy at xl, the battens */}
            <img
              src={IMG}
              alt=""
              className="uf-plate-img block"
            />
          </div>
        </div>

        {/* the glowing trail — the exact same animated line as the panorama and
            depth treatments, snaking across the frame as you scroll */}
        <canvas ref={canvas} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />


        {/* Eyebrow + claims, sat further right than the panorama treatment so the
            copy lands on open cream. The right offset cannot go below ~286px: the
            fixed PageNav rail's widest pill ("Billionaire's Row") reaches 265px in
            from the right edge, so the column is narrowed to 400px to buy the rest
            of the shift instead. */}
        <span className="caption absolute right-6 top-[14vh] z-10 block w-[86vw] max-w-[400px] xl:right-[286px]">
          What sets us apart
        </span>

        <div className="absolute right-6 top-[26vh] z-10 grid w-[86vw] max-w-[400px] xl:right-[286px]">
          {ITEMS.map((it, i) => (
            <div
              key={i}
              ref={(el) => {
                texts.current[i] = el;
              }}
              style={{ gridArea: "1 / 1" }}
            >
              <span
                className="caption mb-5 block"
                style={{ fontSize: "0.62rem", color: "var(--bronze)", opacity: 0 }}
              >
                {it.metric}
              </span>
              {/* comp voice: ink headline with the claim phrase carrying the weight
                  (panorama sets its headlines in bronze — this is the differentiator) */}
              <h3
                className="display m-0"
                style={{
                  fontSize: "clamp(1.4rem, 2.4vw, 36px)",
                  lineHeight: 1.28,
                  letterSpacing: "-0.01em",
                  color: "var(--ink-strong)",
                  opacity: 0,
                }}
              >
                {it.pre}
                <span style={{ fontWeight: 600, color: "var(--ink)" }}>{it.bold}</span>
                {it.post}
              </h3>
              <p
                className="mt-[29px]"
                style={{
                  color: "var(--ink-strong)",
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
