"use client";

import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { clamp } from "./kit";

/**
 * InfinityCore — the Alpago infinity as a REAL 3D object (GLB generated from the
 * wooden-Möbius artwork). It rotates a little as the page scrolls, so the flat
 * statement copy appears to slide OVER a dimensional form. PBR wood is lit by a
 * neutral studio environment (RoomEnvironment) plus warm key/rim lights.
 *
 *  - variant "core": a fixed, low-opacity centre-piece the page scrolls across
 *    (Manifesto page — "the infinity is the core").
 *  - variant "hero": an in-flow element placed by its parent (People page motif).
 *
 * Falls back to the flat PNG on no-WebGL / load error / reduced-motion.
 */

const GLB = "/media/alp/infinity.glb";

export default function InfinityCore({
  variant = "core",
  className = "",
  opacity = variant === "core" ? 0.6 : 0.95,
  maxWidth = variant === "core" ? "min(1120px, 88vw)" : "100%",
  yaw = variant === "core" ? 26 : 16,
}: {
  variant?: "core" | "hero";
  className?: string;
  opacity?: number;
  maxWidth?: string;
  yaw?: number;
}) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const fallback = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    const el = host.current;
    const cvs = canvas.current;
    const fb = fallback.current;
    if (!el || !cvs) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const showFallback = () => {
      cvs.style.display = "none";
      if (fb) fb.style.opacity = String(opacity);
    };

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: cvs, alpha: true, antialias: true });
    } catch {
      showFallback();
      return;
    }
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0.1, 6.6);

    // studio IBL for believable reflections on the polished stone — kept restrained
    // so the near-black marble stays DARK (a bright env washes it to silver)
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 0.8;

    // soft key for form + a warm rim for brand warmth; low ambient keeps it moody
    const key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(2.5, 3, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xffe6bf, 0.6);
    rim.position.set(-3.2, 1.5, -2.5);
    scene.add(rim);
    scene.add(new THREE.AmbientLight(0xffffff, 0.18));

    const pivot = new THREE.Group();
    scene.add(pivot);

    const map = gsap.utils.mapRange;
    const sweep = (yaw * Math.PI) / 180; // how far it turns from the hero to the footer
    // hero pose: near face-on (reads as a clean ∞), slightly looking down onto it
    let targetY = reduce ? 0.12 : -0.08;
    let targetX = reduce ? 0.06 : 0.12;
    let curY = targetY;
    let curX = targetX;
    let ready = false;

    const size = () => {
      const w = el.clientWidth || 1;
      const h = el.clientHeight || 1;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      if (ready) renderer.render(scene, camera);
    };

    const loader = new GLTFLoader();
    loader.load(
      GLB,
      (gltf) => {
        const model = gltf.scene;
        // centre + normalise
        const box = new THREE.Box3().setFromObject(model);
        const c = box.getCenter(new THREE.Vector3());
        const s = box.getSize(new THREE.Vector3());
        model.position.sub(c);
        const maxDim = Math.max(s.x, s.y, s.z) || 1;
        model.scale.setScalar(1.9 / maxDim);
        // Blender's Y-up export lays the ∞ flat in the X-Z plane, so a camera looking
        // down Z sees it EDGE-ON (reads as one loop). Tip it up so the ∞ face fronts
        // the camera; scroll rotation then turns it a little for depth.
        model.rotation.x = -Math.PI / 2;
        pivot.add(model);
        ready = true;
        if (fb) fb.style.opacity = "0"; // 3D took over — drop the flat fallback
        size();
        renderer.render(scene, camera);
      },
      undefined,
      () => showFallback()
    );

    size();

    // rotate across the FULL page scroll — "rotates a bit while scrolling"
    let st: ScrollTrigger | undefined;
    if (!reduce) {
      st = ScrollTrigger.create({
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.8,
        onUpdate: (self) => {
          const p = self.progress;
          // start near face-on at the hero, turn gently as the page scrolls
          targetY = map(0, 1, -0.08, sweep, p);
          targetX = map(0, 1, 0.12, -0.06, p);
          if (variant === "core") {
            const outP = clamp((p - 0.86) / 0.12);
            el.style.opacity = (1 - outP).toFixed(3);
          }
        },
      });
    }

    // render loop — ease toward the scroll target + a slow idle sway so it breathes
    let raf = 0;
    let visible = true;
    const clock = new THREE.Clock();
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!ready || !visible) return;
      const t = clock.getElapsedTime();
      const sway = reduce ? 0 : Math.sin(t * 0.5) * 0.05;
      curY += (targetY + sway - curY) * 0.07;
      curX += (targetX - curX) * 0.07;
      pivot.rotation.set(curX, curY, reduce ? 0 : Math.sin(t * 0.4) * 0.02);
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(loop);

    // pause the loop while the canvas is off-screen
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 });
    io.observe(cvs);
    const ro = new ResizeObserver(() => size());
    ro.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      st?.kill();
      io.disconnect();
      ro.disconnect();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose();
      });
      envRT.dispose();
      pmrem.dispose();
      renderer.dispose();
    };
  }, [variant, opacity, yaw]);

  return (
    <div
      ref={host}
      aria-hidden
      className={
        (variant === "core"
          ? "pointer-events-none fixed inset-0 z-0 "
          : "pointer-events-none relative aspect-square w-full ") + className
      }
      style={{ opacity: variant === "core" ? opacity : 1 }}
    >
      <canvas ref={canvas} className="block h-full w-full" />
      {/* flat fallback (no WebGL / load error / reduced motion) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={fallback}
        src="/media/alp/infinity-marble.png"
        alt=""
        className="pointer-events-none absolute left-1/2 top-1/2 h-auto -translate-x-1/2 -translate-y-1/2"
        style={{
          width: maxWidth,
          opacity: 0,
          transition: "opacity 0.6s ease",
          filter: "drop-shadow(0 40px 60px rgba(60,40,20,0.18))",
        }}
      />
    </div>
  );
}
