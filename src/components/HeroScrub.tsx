"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { VERT, NOISE_FRAG, FRAG, smooth } from "./sections/dissolve";
import * as THREE from "three";

// One media per statement. The noise shader dissolves between them on scroll.
export type HeroSlide = {
  src: string;
  video?: boolean;
  eyebrow?: string;
  rows?: string[];
  text?: string;
  columns?: string[];
  /** Fill transparent source pixels before the image is uploaded to WebGL. */
  background?: string;
  /** Canvas filter applied only while drawing this slide. */
  filter?: string;
  /** Fit the full source width without cropping its left or right edges. */
  fitWidth?: boolean;
  positionY?: "center" | "top" | "bottom";
  /** Scale the fitted media while preserving its alignment. */
  mediaScale?: number;
  /** Fine vertical adjustment after fitting, in CSS pixels. */
  mediaOffsetY?: number;
  /** Uniform full-frame colour wash baked into this slide. */
  tint?: string;
  tone?: "light" | "dark";
};

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    src: "/media/video/hero-2-hd.mp4",
    video: true,
    rows: [
      "Our work defines what deserves",
      "to exist in the world of ultra-luxury.",
    ],
  },
  {
    src: "/media/video/hero-facade-hd.mp4",
    video: true,
    rows: [
      "Exceptional quality is the foundation",
      "and it makes all the difference.",
    ],
  },
  {
    src: "/media/video/hero-3-hd.mp4",
    video: true,
    rows: [
      "Developing properties that are the epitome",
      "of creativity, innovation and long-term asset value.",
    ],
  },
];

// scroll windows: [start,end] of each media->next dissolve (wider = slower/gentler)
const T: [number, number][] = [
  [0.1, 0.42],
  [0.48, 0.8],
];

// dissolve shader + easing are shared with the about page's ActTransparency

export default function HeroScrub({
  slides = DEFAULT_SLIDES,
  id = "top",
  ariaLabel,
  scrollLength = 150,
  variant = "default",
}: {
  slides?: HeroSlide[];
  id?: string;
  ariaLabel?: string;
  scrollLength?: number;
  variant?: "default" | "performance";
}) {
  const SLIDES = slides;
  const section = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const glCanvas = useRef<HTMLCanvasElement>(null);
  const fade = useRef<HTMLDivElement>(null);
  const scrim = useRef<HTMLDivElement>(null);
  const stmtRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const sec = section.current;
    const cvs = glCanvas.current;
    if (!sec || !cvs) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const params = new URLSearchParams(window.location.search);
    const audit = params.has("audit");

    // ---- Three.js fullscreen plane ----
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: cvs,
        alpha: true,
        // full-screen textured quad: MSAA adds nothing, costs plenty
        antialias: false,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }
    renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);
    camera.position.z = 1;

    // one cover-fit offscreen canvas + texture per slide
    const canvases = SLIDES.map(() => document.createElement("canvas"));
    const media: (HTMLImageElement | HTMLVideoElement)[] = new Array(SLIDES.length);
    const textures = canvases.map((c) => {
      const t = new THREE.CanvasTexture(c);
      // NoColorSpace = pass the source pixels straight through. Tagging these sRGB
      // makes the GPU decode them to linear on sample, and this custom ShaderMaterial
      // has no matching encode on output — which rendered the whole hero too dark.
      t.colorSpace = THREE.NoColorSpace;
      t.minFilter = THREE.LinearFilter;
      t.magFilter = THREE.LinearFilter;
      return t;
    });
    const transparentTex = new THREE.DataTexture(
      new Uint8Array([0, 0, 0, 0]),
      1,
      1,
      THREE.RGBAFormat
    );
    transparentTex.needsUpdate = true;

    // bake the fbm noise field into a texture ONCE, so the dissolve just samples it
    const noiseRT = new THREE.WebGLRenderTarget(1024, 1024, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
      stencilBuffer: false,
    });
    {
      const bakeScene = new THREE.Scene();
      const bakeMat = new THREE.ShaderMaterial({
        uniforms: { uScale: { value: 2.4 } }, // larger, gentler noise blobs
        vertexShader: VERT,
        fragmentShader: NOISE_FRAG,
      });
      const bakeMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bakeMat);
      bakeScene.add(bakeMesh);
      renderer.setRenderTarget(noiseRT);
      renderer.render(bakeScene, camera);
      renderer.setRenderTarget(null);
      bakeMesh.geometry.dispose();
      bakeMat.dispose();
    }

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexA: { value: textures[0] },
        uTexB: { value: textures[0] },
        uNoise: { value: noiseRT.texture },
        uProgress: { value: 0 },
        uEdge: { value: 0.4 }, // wide feather → soft, crossfade-like (lighter, less chunky)
        uZoom: { value: 1 },
        uFade: { value: 0 },
      },
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    const render = () => renderer.render(scene, camera);

    const mediaSize = (m: HTMLImageElement | HTMLVideoElement) =>
      m instanceof HTMLVideoElement
        ? { w: m.videoWidth, h: m.videoHeight }
        : { w: m.naturalWidth, h: m.naturalHeight };

    // cover-fit each source into its canvas (the shader samples them as-is)
    const drawInto = (i: number) => {
      const m = media[i];
      const c = canvases[i];
      if (!m || !c.width) return;
      const { w: mw, h: mh } = mediaSize(m);
      if (!mw || !mh) return;
      const ctx = c.getContext("2d")!;
      ctx.filter = "none";
      ctx.clearRect(0, 0, c.width, c.height);
      const background = SLIDES[i]?.background;
      if (background) {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, c.width, c.height);
      }
      const ir = mw / mh;
      const cr = c.width / c.height;
      let dw = c.width;
      let dh = c.height;
      let dx = 0;
      let dy = 0;
      if (SLIDES[i]?.fitWidth) {
        dw = c.width;
        dh = dw / ir;
        dx = 0;
        if (SLIDES[i]?.positionY === "top") dy = 0;
        else if (SLIDES[i]?.positionY === "bottom") dy = c.height - dh;
        else dy = (c.height - dh) / 2;
      } else if (ir > cr) {
        dh = c.height;
        dw = dh * ir;
        dx = (c.width - dw) / 2;
      } else {
        dw = c.width;
        dh = dw / ir;
        if (SLIDES[i]?.positionY === "top") dy = 0;
        else if (SLIDES[i]?.positionY === "bottom") dy = c.height - dh;
        else dy = (c.height - dh) / 2;
      }
      const mediaScale = SLIDES[i]?.mediaScale ?? 1;
      if (mediaScale !== 1) {
        dw *= mediaScale;
        dh *= mediaScale;
        dx = (c.width - dw) / 2;
        if (SLIDES[i]?.positionY === "top") dy = 0;
        else if (SLIDES[i]?.positionY === "bottom") dy = c.height - dh;
        else dy = (c.height - dh) / 2;
      }
      dy += (SLIDES[i]?.mediaOffsetY ?? 0) * (c.height / (cvs.clientHeight || c.height));
      ctx.filter = SLIDES[i]?.filter ?? "none";
      ctx.drawImage(m, dx, dy, dw, dh);
      ctx.filter = "none";
      if (SLIDES[i]?.tint) {
        ctx.fillStyle = SLIDES[i].tint!;
        ctx.fillRect(0, 0, c.width, c.height);
      }
      textures[i].needsUpdate = true;
    };

    const resize = () => {
      // size from the canvas's own box (window.innerWidth can be 0 in some
      // embedded/preview contexts), with sane fallbacks
      const w = cvs.clientWidth || window.innerWidth || 1280;
      const h = cvs.clientHeight || window.innerHeight || 720;
      const scale = Math.min(1.6, 2600 / w); // sharper source textures on retina
      canvases.forEach((c, i) => {
        const cw = Math.max(1, Math.round(w * scale));
        const ch = Math.max(1, Math.round(h * scale));
        if (c.width === cw && c.height === ch) return; // ResizeObserver fires a lot
        c.width = cw;
        c.height = ch;
        // three allocates a CanvasTexture's GPU storage ONCE and IMMUTABLY
        // (texStorage2D); every later needsUpdate is a texSubImage2D from the canvas.
        // So growing the source canvas after that first upload overflows the
        // allocation — Chrome drops the upload with "GL_INVALID_VALUE:
        // glCopySubTextureCHROMIUM: Offset overflows texture dimensions" and the quad
        // renders blank (white over the cream page). Disposing forces three to
        // re-allocate at the new size on the next upload.
        textures[i].dispose();
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(w, h, false);
      SLIDES.forEach((_, i) => drawInto(i));
      render();
    };

    const videoEls: HTMLVideoElement[] = [];
    SLIDES.forEach((s, i) => {
      if (s.video) {
        const vid = document.createElement("video");
        vid.src = s.src;
        vid.muted = true;
        vid.loop = true;
        vid.playsInline = true;
        vid.autoplay = true;
        vid.preload = "auto";
        vid.addEventListener("loadeddata", () => {
          drawInto(i);
          render();
        });
        vid.play().catch(() => {});
        media[i] = vid;
        videoEls.push(vid);
        return;
      }
      const im = new Image();
      im.onload = () => {
        drawInto(i);
        render();
      };
      im.src = s.src;
      media[i] = im;
    });

    // repaint the video slides while the hero is on screen — paused otherwise so
    // the rest of the page never pays for a decode it can't see
    let vraf = 0;
    let heroVisible = true;
    let lastPaint = 0;
    const pump = (now: number) => {
      vraf = requestAnimationFrame(pump);
      if (!heroVisible || now - lastPaint < 33) return; // ~30fps is plenty here
      lastPaint = now;
      let painted = false;
      SLIDES.forEach((s, i) => {
        const m = media[i];
        if (!s.video || !(m instanceof HTMLVideoElement) || m.readyState < 2) return;
        drawInto(i);
        painted = true;
      });
      if (painted) render();
    };
    vraf = requestAnimationFrame(pump);

    const vis = new IntersectionObserver(
      ([e]) => {
        heroVisible = e.isIntersecting;
        videoEls.forEach((v) => (heroVisible ? v.play().catch(() => {}) : v.pause()));
      },
      { threshold: 0 }
    );
    vis.observe(cvs);

    resize();
    window.addEventListener("resize", resize);
    // ResizeObserver is reliable even where window resize events / innerWidth
    // are unavailable; it also fires once the canvas gets its initial size.
    const ro = new ResizeObserver(() => resize());
    ro.observe(cvs);

    const setPair = (
      a: THREE.Texture,
      b: THREE.Texture,
      prog: number,
      zoom: number
    ) => {
      material.uniforms.uTexA.value = a;
      material.uniforms.uTexB.value = b;
      material.uniforms.uProgress.value = prog;
      material.uniforms.uZoom.value = zoom;
      render();
    };

    // ---- audit: static preview. ?seg=0|1|2 picks media+statement, ?d=0..1 mid-transition ----
    if (audit) {
      const seg = Math.max(0, Math.min(SLIDES.length - 1, Number(params.get("seg") || 0)));
      const d = Number(params.get("d") || 0);
      const apply = () => {
        const b = d > 0 ? textures[seg + 1] ?? transparentTex : textures[seg];
        setPair(textures[seg], b, d, 1);
      };
      apply();
      const first = stmtRefs.current[seg];
      if (first) {
        first.style.visibility = "visible";
        gsap.set(first.querySelectorAll(".hero-char"), { opacity: 1 });
        gsap.set(first.querySelectorAll(".hero-row"), { filter: "blur(0px)" });
      }
      const iv = window.setInterval(apply, 250);
      window.setTimeout(() => clearInterval(iv), 3000);
      return () => {
        window.removeEventListener("resize", resize);
        ro.disconnect();
        renderer.dispose();
      };
    }

    const dctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sec,
          start: "top top",
          end: `+=${scrollLength}%`,
          pin: stage.current,
          scrub: reduce ? false : 0.65,
          onUpdate: (self) => {
            const p = self.progress;
            // Performance imagery is art-directed to the exact supplied crop,
            // so it stays at its native fitted scale instead of pushing in.
            const zoom = variant === "performance" ? 1 : 1 + p * 0.06;
            const map = gsap.utils.mapRange;
            // bottom-up merge fade — set BEFORE setPair's render so there's a single
            // render per frame (no double GPU pass)
            const mergeRaw = gsap.utils.clamp(0, 1, map(0.82, 1, 0, 1, p));
            const mergeF = mergeRaw * mergeRaw * (3 - 2 * mergeRaw);
            const introRaw = variant === "performance"
              ? gsap.utils.clamp(0, 1, map(0.015, 0.11, 0, 1, p))
              : 1;
            const introF = introRaw * introRaw * (3 - 2 * introRaw);
            // The shared properties hero uses a directional bottom-up merge.
            // Version 3 Performance must not: over the pale infinity background
            // its feather reads as a dark horizontal shadow moving up the screen.
            material.uniforms.uFade.value = variant === "performance" ? 0 : mergeF;
            // The performance variant arrives inside an already pinned viewport:
            // the first image fades in rather than travelling up with the section.
            cvs.style.opacity = (
              introF * (variant === "performance" ? 1 - mergeF : 1)
            ).toFixed(3);
            if (SLIDES.length === 2) {
              const twoSlideTransition: [number, number] = [0.18, 0.5];
              if (p < twoSlideTransition[0]) {
                setPair(textures[0], textures[0], 0, zoom);
              } else if (p < twoSlideTransition[1]) {
                setPair(
                  textures[0],
                  textures[1],
                  smooth(map(twoSlideTransition[0], twoSlideTransition[1], 0, 1, p)),
                  zoom
                );
              } else {
                setPair(textures[1], textures[1], 0, zoom);
              }
            } else if (p < T[0][0]) setPair(textures[0], textures[0], 0, zoom);
            else if (p < T[0][1])
              setPair(
                textures[0],
                textures[1],
                smooth(map(T[0][0], T[0][1], 0, 1, p)),
                zoom
              );
            else if (p < T[1][0]) setPair(textures[1], textures[1], 0, zoom);
            else if (p < T[1][1])
              setPair(
                textures[1],
                textures[2],
                smooth(map(T[1][0], T[1][1], 0, 1, p)),
                zoom
              );
            // last media just holds — no dissolve-out animation
            else setPair(textures[2], textures[2], 0, zoom);

            // merge ONLY after the last media + its text are fully shown: keep
            // scrolling and it dissolves into the background
            // fade the text scrim out with the merge so it doesn't cover the reveal
            // (uFade itself is set at the top of onUpdate, before the render)
            if (scrim.current) {
              scrim.current.style.opacity = (introF * (1 - mergeF)).toFixed(3);
            }
          },
        },
      });

      // statements: char-by-char BLUR reveal (same treatment as the rest of
      // the page), synced to the image dissolves; last one holds until the fade
      const io: [number | null, number | null][] = variant === "performance"
        ? SLIDES.length === 2
          ? [
              [0.035, 0.19],
              [0.42, 0.86],
            ]
          : [
              [0.035, 0.17], // first statement now receives the same fade/blur reveal
              [0.3, 0.49],
              [0.54, 0.86],
            ]
        : [
            [null, 0.12], // stmt 0: starts visible, blurs out before dissolve 1
            [0.28, 0.48], // stmt 1
            [0.52, 0.86], // stmt 2 (last): holds, then blurs out together with the merge
          ];
      // the blur lives on the ROW (2 filtered elements) while chars keep their
      // staggered opacity — same look, a fraction of the per-frame raster cost
      stmtRefs.current.forEach((el, i) => {
        if (!el) return;
        const chars = el.querySelectorAll<HTMLElement>(".hero-char");
        const rows = el.querySelectorAll<HTMLElement>(".hero-row");
        const [inAt, outAt] = io[i];
        gsap.set(el, { autoAlpha: 1 });
        const startsVisible = i === 0 && variant !== "performance";
        gsap.set(chars, startsVisible ? { opacity: 1 } : { opacity: 0 });
        gsap.set(rows, startsVisible ? { filter: "blur(0px)" } : { filter: "blur(12px)" });
        if (inAt != null) {
          tl.fromTo(
            chars,
            { opacity: 0 },
            { opacity: 1, ease: "none", stagger: { amount: 0.04 }, duration: 0.07 },
            inAt
          );
          tl.fromTo(
            rows,
            { filter: "blur(12px)" },
            { filter: "blur(0px)", ease: "none", duration: 0.09 },
            inAt
          );
        }
        if (outAt != null) {
          tl.to(
            chars,
            { opacity: 0, ease: "none", stagger: { amount: 0.035 }, duration: 0.06 },
            outAt
          );
          tl.to(rows, { filter: "blur(12px)", ease: "none", duration: 0.08 }, outAt);
        }
      });

      // keep the scrubbed timeline ~1 unit long so positions map to progress
      tl.to({}, { duration: 0.001 }, 1);
    }, sec);

    return () => {
      window.removeEventListener("resize", resize);
      ro.disconnect();
      vis.disconnect();
      cancelAnimationFrame(vraf);
      videoEls.forEach((v) => {
        v.pause();
        v.removeAttribute("src");
        v.load();
      });
      dctx.revert();
      renderer.dispose();
      textures.forEach((t) => t.dispose());
      transparentTex.dispose();
      noiseRT.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div ref={section} id={id} aria-label={ariaLabel} className="relative z-20">
      <div ref={stage} className="relative z-20 h-screen w-full overflow-hidden">
        {/* scroll-driven merge: the hero is masked away from the bottom up, revealing
            the section behind it — directional, and never covers the next section */}
        <div ref={fade} className="absolute inset-0">
          {/* the merge fade is done in-shader (alpha), so the canvas has no backdrop —
              its transparency reveals the section behind during the merge */}
          <canvas
            ref={glCanvas}
            className="absolute inset-0 h-full w-full"
            aria-hidden
            style={{ opacity: variant === "performance" ? 0 : 1 }}
          />
          {/* Version 3 Performance deliberately has no full-screen scrim. A fading
              bottom gradient leaves a visible horizontal band over the pale infinity
              background as the pinned stage exits. */}
          {variant !== "performance" && (
            <div
              ref={scrim}
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(50% 17% at 50% 88%, rgba(10,8,6,0.8) 0%, rgba(10,8,6,0.66) 38%, rgba(10,8,6,0.34) 70%, transparent 100%), " +
                  "linear-gradient(to bottom, rgba(10,8,6,0.34) 0%, rgba(10,8,6,0.18) 6%, rgba(10,8,6,0.06) 12%, transparent 18%)",
              }}
            />
          )}
        </div>

        <div
          className={
            variant === "performance"
              ? "absolute inset-0 flex items-center justify-center px-6 py-[12vh] md:px-14"
              : "absolute inset-0 flex items-end justify-center px-6 pb-[9vh]"
          }
        >
          <div className={`grid w-full place-items-center text-center ${variant === "performance" ? "max-w-[1560px]" : "max-w-[1100px]"}`}>
            {SLIDES.map((s, i) => (
              <div
                key={i}
                ref={(el) => {
                  stmtRefs.current[i] = el;
                }}
                // the first two statements sit fully over imagery, so in the light
                // theme they keep the light gold; the last lands on the cream bg
                className={`${s.tone !== "dark" ? "over-img " : ""}flex flex-col items-center justify-center`}
                style={{
                  gridArea: "1 / 1",
                  visibility: "hidden",
                  color: s.tone === "dark" ? "var(--bronze-hi)" : undefined,
                }}
              >
                {s.eyebrow && (
                  <span
                    className="hero-row hero-char caption mb-7 block"
                    style={{
                      color: s.tone === "dark" ? "var(--bronze-hi)" : undefined,
                      letterSpacing: "0.16em",
                    }}
                  >
                    {s.eyebrow}
                  </span>
                )}
                {s.columns ? (
                  <div
                    className="hero-row hero-char flex w-full max-w-[60ch] flex-col items-center justify-center gap-7 text-center"
                    style={{
                      color: s.tone === "dark" ? "#5b432d" : "#f5eee4",
                      fontFamily: "var(--font-basel), system-ui, sans-serif",
                      fontSize: "15.5px",
                      lineHeight: 1.625,
                    }}
                  >
                    {s.columns.map((column, columnIndex) => (
                      <p
                        key={columnIndex}
                        className={
                          s.columns!.length === 1
                            ? "max-w-[60ch] text-center"
                            : columnIndex === 0
                              ? "max-w-[43ch] text-center"
                              : "max-w-[60ch] text-center"
                        }
                      >
                        {column}
                      </p>
                    ))}
                  </div>
                ) : s.text ? (
                  <p
                    className="hero-row hero-char block max-w-[68ch]"
                    style={{
                      color: variant === "performance"
                        ? "#5b432d"
                        : s.tone === "dark" ? "var(--bronze-hi)" : "#fffdf8",
                      background: variant === "performance" || s.tone === "dark"
                        ? "transparent"
                        : "radial-gradient(ellipse at center, rgba(10,8,6,.55) 0%, rgba(10,8,6,.32) 50%, transparent 78%)",
                      padding: variant === "performance" || s.tone === "dark" ? 0 : "42px 76px",
                      maxWidth: variant === "performance"
                        ? i === 1 ? "43ch" : "60ch"
                        : undefined,
                      fontFamily: variant === "performance"
                        ? "var(--font-basel), system-ui, sans-serif"
                        : "var(--font-social), sans-serif",
                      fontSize: variant === "performance" ? "15.5px" : "clamp(1rem, 1.55vw, 22px)",
                      lineHeight: variant === "performance" ? 1.625 : 1.65,
                      textAlign: "center",
                      textShadow: variant === "performance" || s.tone === "dark"
                        ? "none"
                        : "0 2px 28px rgba(10,8,6,.82)",
                    }}
                  >
                    {s.text}
                  </p>
                ) : s.rows?.map((row, r) => (
                  <span
                    key={r}
                    className="hero-row display block"
                    style={{
                      fontSize: "clamp(1.15rem, 3.4vw, 40px)",
                      lineHeight: 1.08,
                      paddingBottom: "0.06em",
                      whiteSpace: "nowrap",
                    }}
                  >
                      {Array.from(row).map((ch, ci) => (
                        <span
                        key={ci}
                        className="hero-char"
                        style={{
                          display: "inline-block",
                          whiteSpace: "pre",
                          ...(s.tone === "dark"
                            ? { color: "var(--bronze-hi)" }
                            : {
                                backgroundImage:
                                  "linear-gradient(180deg, var(--gold-1) 0%, var(--gold-2) 48%, var(--gold-3) 100%)",
                                WebkitBackgroundClip: "text",
                                backgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                color: "transparent",
                              }),
                        }}
                      >
                        {ch}
                      </span>
                    ))}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
