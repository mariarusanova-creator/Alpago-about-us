"use client";

import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Cinematic cylinder carousel (adapted from JosephASG/codrops-cinematic-scroll):
 * property images wrap around a rotating cylinder (curved from the sides). Scroll
 * spins it through a few images, then it settles and the centre image flattens out
 * to take the full width. Scroll-driven via a pinned ScrollTrigger.
 */
const IMAGES = [
  "/media/alp/pool-dusk.jpg",
  "/media/alp/dsc09291.jpg",
  "/media/alp/dsc09633.jpg",
  "/media/alp/palmflower-dropoff.jpg", // signature Palm Flower tower — the hero
  "/media/alp/aerial.jpg",
  "/media/alp/poolside-30.jpg",
  "/media/alp/dsc07985.jpg",
  "/media/alp/dsc05123.jpg",
  "/media/alp/dsc00258.jpg",
  "/media/alp/r-08572.jpg",
];
// which image ends up centred + goes full-width (index into IMAGES)
const HERO_INDEX = 3;
const N = IMAGES.length;
const RADIUS = 6.4; // wide enough that the front images run edge-to-edge, sides clipped
const HEIGHT = 1.5; // short, shallow drum — runs edge-to-edge yet fits with margins
const CAM_Y = 0.8; // gently elevated — a sliver of the top rim, drum front-on
const CAM_Z = 8.7; // close-ish so the front arc fills the width, silhouette clips off
const FOV = 62;
const STEPS = 4; // how many images spin past before it stops
const REVEAL_START = 0.66; // progress at which spinning stops and the hero flattens
const smoothstep = (t: number) => t * t * (3 - 2 * t);

export default function CylinderShowcase() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const heroImg = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    const sec = section.current;
    const stg = stage.current;
    const cvs = canvas.current;
    if (!sec || !stg || !cvs) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const audit = new URLSearchParams(window.location.search).has("audit");

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: cvs, antialias: true, alpha: true });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
    camera.position.set(0, CAM_Y, CAM_Z);
    camera.lookAt(0, -0.85, 0); // aim low so the drum rides up, centred with margins

    // ---- texture strip: draw the images side by side onto one canvas ----
    const SLOT = 780; // keeps the strip (SLOT * N) under the 8192px texture limit
    const tex = document.createElement("canvas");
    tex.width = SLOT * N;
    tex.height = Math.round(SLOT * (HEIGHT / (2 * Math.PI * RADIUS / N)));
    const tctx = tex.getContext("2d")!;
    const texture = new THREE.CanvasTexture(tex);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    // viewing the outside of the drum mirrors the strip — flip u so images read correctly
    texture.repeat.x = -1;
    texture.offset.x = 1;
    // mipmaps + anisotropy kill the moiré/aliasing shimmer on fine detail (travertine)
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const drawCover = (img: HTMLImageElement, x: number, w: number, h: number) => {
      const ir = img.naturalWidth / img.naturalHeight;
      const cr = w / h;
      let dw = w, dh = h, dx = x, dy = 0;
      if (ir > cr) { dh = h; dw = dh * ir; dx = x + (w - dw) / 2; }
      else { dw = w; dh = dw / ir; dy = (h - dh) / 2; }
      tctx.drawImage(img, dx, dy, dw, dh);
    };

    let loaded = 0;
    IMAGES.forEach((src, i) => {
      const img = new Image();
      img.onload = () => {
        drawCover(img, i * SLOT, SLOT, tex.height);
        texture.needsUpdate = true;
        loaded++;
        render();
      };
      img.src = src;
    });

    // ---- cylinder ----
    const geo = new THREE.CylinderGeometry(RADIUS, RADIUS, HEIGHT, 96, 1, true);
    const mat = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.FrontSide, // seen from outside — the drum's front face, viewed from above
      transparent: true,
    });
    const cyl = new THREE.Mesh(geo, mat);
    scene.add(cyl);

    // land the hero image dead-centre at the END of the spin, so the centre panel the
    // drum settles on is exactly the image that then scales up to full width
    const baseRot =
      -((HERO_INDEX + 0.5) / N) * Math.PI * 2 + Math.PI / 2 - STEPS * (Math.PI * 2) / N;

    const resize = () => {
      const w = cvs.clientWidth || window.innerWidth || 1280;
      const h = cvs.clientHeight || window.innerHeight || 720;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      render();
    };
    const render = () => renderer.render(scene, camera);

    // progress → rotation + reveal
    const apply = (p: number) => {
      // spin STEPS images past over the first REVEAL_START of the scroll, easing to a stop
      const spin = smoothstep(gsap.utils.clamp(0, 1, p / REVEAL_START));
      cyl.rotation.y = baseRot + spin * (STEPS * (Math.PI * 2) / N);

      // final phase: the drum — and every image except the centred one — dissolves
      // away, while the centre image scales up on its own to fill the frame edge-to-edge
      const rev = smoothstep(gsap.utils.clamp(0, 1, (p - REVEAL_START) / (1 - REVEAL_START)));
      const cylOut = smoothstep(gsap.utils.clamp(0, 1, rev / 0.5));
      mat.opacity = 1 - cylOut;
      cyl.scale.setScalar(1 + cylOut * 0.1);
      if (heroImg.current) {
        // fades in from the centre panel as the drum clears, then keeps growing to full
        const imgIn = smoothstep(gsap.utils.clamp(0, 1, (rev - 0.12) / 0.36));
        const grow = smoothstep(gsap.utils.clamp(0, 1, rev / 1));
        heroImg.current.style.opacity = imgIn.toFixed(3);
        const s = 0.44 + grow * 0.56;
        heroImg.current.style.transform = `scale(${s.toFixed(3)})`;
      }
      render();
    };

    resize();
    window.addEventListener("resize", resize);
    const ro = new ResizeObserver(() => resize());
    ro.observe(cvs);

    if (audit || reduce) {
      apply(1);
      return () => {
        window.removeEventListener("resize", resize);
        ro.disconnect();
        geo.dispose();
        mat.dispose();
        texture.dispose();
        renderer.dispose();
      };
    }

    apply(0);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sec,
        start: "top top",
        end: "+=280%",
        pin: stg,
        pinType: "fixed",
        scrub: 0.6,
        onUpdate: (self) => {
          apply(self.progress);
          // fade the whole section in/out at the edges (matches the other sections)
          const inA = gsap.utils.clamp(0, 1, self.progress / 0.05);
          const outA = gsap.utils.clamp(0, 1, (self.progress - 0.95) / 0.05);
          stg.style.opacity = (smoothstep(inA) * (1 - smoothstep(outA))).toFixed(3);
        },
      });
    }, sec);
    // start hidden until it pins (sits pulled-up behind the previous section)
    stg.style.opacity = "0";

    return () => {
      window.removeEventListener("resize", resize);
      ro.disconnect();
      ctx.revert();
      geo.dispose();
      mat.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <section ref={section} className="relative" style={{ marginTop: "-100vh" }}>
      <div ref={stage} className="relative h-screen w-full overflow-hidden">
        <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden />
        {/* the centre image, flattened to full width at the end */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={heroImg}
          src={IMAGES[HERO_INDEX]}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          style={{ opacity: 0, transform: "scale(0.44)", willChange: "opacity, transform" }}
        />
      </div>
    </section>
  );
}
