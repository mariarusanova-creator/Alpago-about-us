"use client";

import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { TRAIL, Trail, headPos } from "./trail";

/**
 * Alternative USPs — a Three.js depth gallery (adapted from codrops "Atmospheric
 * Depth Gallery"): property planes stacked along Z that you scroll *through*, the
 * current + next cross-fading, each image shifting the atmospheric background, a
 * per-plane label, and a glowing tapered trail that snakes through the depth as you
 * scroll. Scroll-driven via a pinned ScrollTrigger (no wheel hijack).
 */
const USPS = [
  { n: "01", metric: "UAE record", img: "/media/alp/img-3195.jpg", text: "Casa del Sole — the highest villa transaction ever recorded in the UAE.", bg: "#2e2013", x: -0.55 },
  { n: "02", metric: "Top 18", img: "/media/alp/img-3714.jpg", text: "Kural Vista — among the eighteen most beautiful homes in Dubai.", bg: "#26221a", x: 0.5 },
  { n: "03", metric: "6 villas", img: "/media/alp/aerial.jpg", text: "Six signature beachfront villas on Palm Jumeirah’s Billionaires’ Row.", bg: "#22262b", x: -0.45 },
  { n: "04", metric: "+30–40%", img: "/media/alp/dsc00258.jpg", text: "Thirty to forty percent above market-average ROI across our projects.", bg: "#2c1f14", x: 0.5 },
  { n: "05", metric: "World Top 100", img: "/media/alp/dsc09291.jpg", text: "Ranked among the Top 100 Real Estate Developers of the World.", bg: "#232019", x: -0.5 },
  { n: "06", metric: "2024–25", img: "/media/alp/dsc09633.jpg", text: "Best International Residential Development, 2024–25.", bg: "#2a2016", x: 0.45 },
  { n: "07", metric: "2024–25", img: "/media/alp/palmflower-facade.jpg", text: "Best International Single Apartment Condominium, 2024–25.", bg: "#201d17", x: -0.4 },
  { n: "08", metric: "WiredScore", img: "/media/alp/palmflower-dropoff.jpg", text: "Palm Flower earns WiredScore certification — pioneering smart luxury living.", bg: "#1e1c1a", x: 0.5 },
];

const GAP = 6;
const CAM_DIST = 6.5;
const smoothstep = (t: number) => t * t * (3 - 2 * t);
// bind the last two words so no lone word wraps onto its own line
const noOrphan = (s: string) => s.replace(/ (\S+)$/, String.fromCharCode(160) + "$1");

// trail config + Trail + headPos now live in ./trail (shared with UspsPanorama)

export default function UspsDepth() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const labelWrap = useRef<HTMLDivElement>(null);
  const numEl = useRef<HTMLSpanElement>(null);
  const textEl = useRef<HTMLParagraphElement>(null);
  const marker = useRef<HTMLDivElement>(null);
  const stationsRef = useRef<HTMLDivElement[]>([]);

  useLayoutEffect(() => {
    const sec = section.current;
    const stg = stage.current;
    const cvs = canvas.current;
    if (!sec || !stg || !cvs) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const N = USPS.length;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: cvs, antialias: true });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);

    // light theme: the WebGL clear colour follows the cream palette instead
    const isLight = document.body.classList.contains("light");
    const LIGHT_BGS = ["#e4dfd2", "#e0dcd1", "#ddd9ce", "#e2dccd", "#dfdbd2", "#e1dccf", "#ded9d0", "#dcd8cb"];
    const bgOf = (i: number) => (isLight ? LIGHT_BGS[i % LIGHT_BGS.length] : USPS[i].bg);
    const bgColor = new THREE.Color(bgOf(0));
    const tmpA = new THREE.Color();
    const tmpB = new THREE.Color();

    const geo = new THREE.PlaneGeometry(3, 3);
    const loader = new THREE.TextureLoader();
    const planes = USPS.map((u, i) => {
      const mat = new THREE.MeshBasicMaterial({
        color: "#8a6a3e", side: THREE.DoubleSide, transparent: true, depthWrite: false,
        opacity: i === 0 ? 1 : 0,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(u.x, 0, -i * GAP);
      mesh.userData.aspect = 1.5;
      scene.add(mesh);
      loader.load(u.img, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        mat.map = tex;
        mat.color.set("#ffffff");
        mat.needsUpdate = true;
        const im = tex.image;
        if (im && im.width && im.height) mesh.userData.aspect = im.width / im.height;
        sizePlanes();
        render();
      });
      return mesh;
    });

    // trail
    const trail = new Trail();
    if (isLight) trail.material.color.set("#8a6a3e");
    scene.add(trail.group);
    const headV = new THREE.Vector3();
    let prevProgress = -1;
    // seed a short trail at the start so it exists immediately
    headPos(CAM_DIST, 0, headV);
    for (let i = TRAIL.seedCount; i >= 0; i--) {
      trail.addPoint(headV.clone().add(new THREE.Vector3(0, 0, -i * TRAIL.seedStepZ)));
    }

    const pointer = new THREE.Vector2(0, 0);
    const pointerCur = new THREE.Vector2(0, 0);
    const onPointer = (e: PointerEvent) => {
      pointer.set((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const sizePlanes = () => {
      const base = (cvs.clientWidth || 1280) < 768 ? 0.4 : 0.52;
      planes.forEach((p) => {
        const a = p.userData.aspect || 1.5;
        p.scale.set(base * a, base, 1);
      });
    };
    const resize = () => {
      const w = cvs.clientWidth || window.innerWidth || 1280;
      const h = cvs.clientHeight || window.innerHeight || 720;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      sizePlanes();
      render();
    };
    const render = () => {
      renderer.setClearColor(bgColor, 1);
      renderer.render(scene, camera);
    };

    // a = active float 0..N-1 ; progress = 0..1
    const apply = (progress: number) => {
      const a = progress * (N - 1);
      const cur = Math.floor(a);
      const next = Math.min(cur + 1, N - 1);
      const blend = a - cur;

      camera.position.z = CAM_DIST - a * GAP;

      // hold each plane at FULL opacity, then a fast fade near the end (before the
      // camera reaches it and scales it up) — kills the long muddy crossfade
      const h = smoothstep(gsap.utils.clamp(0, 1, (blend - 0.38) / 0.3));
      planes.forEach((p, i) => {
        const mat = p.material as THREE.MeshBasicMaterial;
        let o = 0;
        if (i === cur) o = 1 - h;
        if (i === next) o = Math.max(o, h);
        mat.opacity = o;
        const infl = o * (1 + i * 0.04);
        p.position.x = USPS[i].x + pointerCur.x * 0.14 * infl;
        p.position.y = pointerCur.y * 0.08 * infl;
      });

      // atmospheric background between current & next palette
      tmpA.set(bgOf(cur));
      tmpB.set(bgOf(next));
      bgColor.copy(tmpA).lerp(tmpB, blend);

      // trail — grow with progress, reset on a real reverse, fade at the ends
      if (prevProgress >= 0 && progress < prevProgress - 0.02) trail.reset();
      trail.maxPoints = Math.round(THREE.MathUtils.lerp(TRAIL.minPoints, TRAIL.maxPoints, progress));
      headPos(camera.position.z, progress, headV);
      trail.addPoint(headV);
      const edge = Math.min(progress + 0.06, 1 - progress);
      trail.material.opacity = TRAIL.opacity * smoothstep(THREE.MathUtils.clamp(edge / 0.16, 0, 1));
      prevProgress = progress;

      // label — stays full until its image starts fading, then swaps with NO overlap
      // (the outgoing text fully clears before the incoming appears)
      const swap = h >= 0.5;
      const showItem = swap ? next : cur;
      const labelOpacity = swap
        ? smoothstep(gsap.utils.clamp(0, 1, (h - 0.5) / 0.5))
        : 1 - smoothstep(gsap.utils.clamp(0, 1, h / 0.5));
      if (labelWrap.current) labelWrap.current.style.opacity = labelOpacity.toFixed(3);
      if (numEl.current) numEl.current.textContent = USPS[showItem].n;
      if (textEl.current && textEl.current.dataset.i !== String(showItem)) {
        textEl.current.textContent = USPS[showItem].text;
        textEl.current.dataset.i = String(showItem);
      }

      // ruler nav line — marker travels with progress, active station lights up
      if (marker.current) marker.current.style.left = (progress * 100).toFixed(2) + "%";
      stationsRef.current.forEach((el, i) => {
        if (el) el.style.opacity = i === showItem ? "1" : "0.32";
      });
    };

    resize();
    window.addEventListener("resize", resize);
    const ro = new ResizeObserver(() => resize());
    ro.observe(cvs);

    let rafId = 0;
    const tick = () => {
      pointerCur.lerp(pointer, 0.06);
      render();
      rafId = requestAnimationFrame(tick);
    };

    if (reduce) {
      apply(0);
      render();
      return () => {
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", onPointer);
        ro.disconnect();
        trail.dispose();
        renderer.dispose();
      };
    }

    apply(0);
    render();
    // hidden until it pins (pulled-up behind the previous pinned section)
    stg.style.opacity = "0";
    rafId = requestAnimationFrame(tick);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sec,
        start: "top top",
        end: "+=" + N * 50 + "%",
        pin: stg,
        pinType: "fixed",
        scrub: 0.6,
        onUpdate: (self) => {
          // content advances over the first 90% of the pin so the LAST item is fully
          // shown and held before the section fades out (never cut off mid-reveal)
          apply(gsap.utils.clamp(0, 1, self.progress / 0.9));
          const inA = gsap.utils.clamp(0, 1, self.progress / 0.06);
          const outA = gsap.utils.clamp(0, 1, (self.progress - 0.9) / 0.1);
          stg.style.opacity = (smoothstep(inA) * (1 - smoothstep(outA))).toFixed(3);
          render();
        },
      });
    }, sec);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      ro.disconnect();
      ctx.revert();
      geo.dispose();
      planes.forEach((p) => (p.material as THREE.Material).dispose());
      trail.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <section id="usps" ref={section} className="relative" style={{ marginTop: "-100vh" }}>
      <div ref={stage} className="relative h-screen w-full overflow-hidden">
        <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden />

        <div
          ref={labelWrap}
          className="pointer-events-none absolute inset-x-0 bottom-[22vh] flex flex-col items-center px-6 text-center"
        >
          <span ref={numEl} className="caption mb-4" style={{ fontSize: "0.7rem", color: "var(--bronze-hi)" }}>
            01
          </span>
          <p
            ref={textEl}
            className="display m-0"
            data-i="0"
            style={{
              fontSize: "clamp(1.3rem, 2.8vw, 34px)", lineHeight: 1.2, letterSpacing: "-0.01em",
              color: "var(--ink)", maxWidth: "24ch", textShadow: "0 2px 40px rgba(0,0,0,0.55)",
            }}
          >
            {noOrphan(USPS[0].text)}
          </p>
        </div>

        <span className="caption absolute left-1/2 top-[14vh] z-10 -translate-x-1/2">What sets us apart</span>

        {/* nav line — measuring ruler with a marker that travels as you scroll through */}
        <div className="absolute inset-x-6 bottom-[6vh] z-20 md:inset-x-14">
          <div
            className="relative h-[34px]"
            style={{
              borderBottom: "1px solid var(--ink-faint)",
              backgroundImage:
                "repeating-linear-gradient(to right, var(--ink-faint) 0 1px, transparent 1px 14px)",
              backgroundPosition: "left bottom",
              backgroundSize: "100% 8px",
              backgroundRepeat: "repeat-x",
            }}
          >
            <div
              ref={marker}
              className="absolute bottom-0 -translate-x-1/2"
              style={{ left: "0%", willChange: "left" }}
            >
              <div className="h-[34px] w-[2px]" style={{ background: "var(--bronze-hi)" }} />
            </div>
          </div>
          <div className="relative mt-3 h-4">
            {USPS.map((u, i) => (
              <div
                key={u.n}
                ref={(el) => {
                  if (el) stationsRef.current[i] = el;
                }}
                className="absolute -translate-x-1/2 text-center"
                style={{
                  left: `${(i / (USPS.length - 1)) * 100}%`,
                  opacity: 0.32,
                  transition: "opacity 0.25s ease",
                }}
              >
                <span className="caption whitespace-nowrap" style={{ color: "var(--ink)", fontSize: "11px" }}>
                  {u.metric}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
