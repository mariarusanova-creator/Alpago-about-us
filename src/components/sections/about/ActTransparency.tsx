"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { VERT, NOISE_FRAG, FRAG, smooth } from "../dissolve";
import { GOLD } from "./kit";

/**
 * Transparency — THREE messages carried by the same noise-dissolve as the business
 * page hero (shared GLSL in ../dissolve): each message has its own film, and as you
 * scroll the shader dissolves film N into N+1 while the statements blur in and out in
 * sync. The last message holds, then the whole act merges away bottom-up.
 */
// each film can be a looping video OR a still image (`still: true`). Stills keep the
// scroll push-in + noise dissolve, they just have no internal motion of their own.
type Message = { src: string; rows: string[]; still?: boolean };

const BASE_MESSAGES: Message[] = [
  {
    src: "/media/video/aerial-hd.mp4",
    rows: ["Team of over 400", "in-house professionals."],
  },
  {
    src: "/media/video/terrace-hd.mp4",
    rows: ["5 offices", "and facilities."],
  },
  {
    src: "/media/alp/transparency-dropoff.jpg",
    still: true,
    rows: ["More than 20", "nationalities."],
  },
];

// the act ENTERS with the film masking in from the bottom behind a soft feathered
// edge, then runs its dissolves. Everything after is shifted to sit clear of it.
const ENTER = 0.16;
// scroll windows for each film→next dissolve
const T: [number, number][] = [
  [0.24, 0.48],
  [0.54, 0.8],
];
// per-message [fade-in at, fade-out at] — nothing shows until the film is in
const IO: [number | null, number | null][] = [
  [0.12, 0.26],
  [0.34, 0.52],
  [0.58, 0.86],
];


export default function ActTransparency({
  firstVideoSrc = "/media/video/aerial-hd.mp4",
  secondVideoSrc = "/media/video/terrace-hd.mp4",
  thirdVideoSrc,
}: {
  firstVideoSrc?: string;
  secondVideoSrc?: string;
  thirdVideoSrc?: string;
}) {
  const messages = useMemo<Message[]>(
    () => [
      { ...BASE_MESSAGES[0], src: firstVideoSrc },
      { ...BASE_MESSAGES[1], src: secondVideoSrc },
      thirdVideoSrc ? { ...BASE_MESSAGES[2], src: thirdVideoSrc, still: false } : BASE_MESSAGES[2],
    ],
    [firstVideoSrc, secondVideoSrc, thirdVideoSrc]
  );
  const section = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const glCanvas = useRef<HTMLCanvasElement>(null);
  const reveal = useRef<HTMLDivElement>(null);
  const scrim = useRef<HTMLDivElement>(null);
  const eyebrow = useRef<HTMLSpanElement>(null);
  const stmtRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const sec = section.current;
    const stg = stage.current;
    const cvs = glCanvas.current;
    if (!sec || !stg || !cvs) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const audit = new URLSearchParams(window.location.search).has("audit");

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: cvs, alpha: true, antialias: false });
    } catch {
      return;
    }
    renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);
    camera.position.z = 1;

    // one cover-fit offscreen canvas + texture per message
    const canvases = messages.map(() => document.createElement("canvas"));
    // a film source is either a looping <video> or a static <img>
    type Source = {
      el: HTMLVideoElement | HTMLImageElement;
      video: boolean;
      ready: () => boolean;
      w: () => number;
      h: () => number;
    };
    const media: Source[] = [];
    const textures = canvases.map((c) => {
      const t = new THREE.CanvasTexture(c);
      // NoColorSpace: pass source pixels straight through — tagging sRGB here makes
      // the GPU decode to linear with no matching encode on output (renders too dark)
      t.colorSpace = THREE.NoColorSpace;
      t.minFilter = THREE.LinearFilter;
      t.magFilter = THREE.LinearFilter;
      return t;
    });

    // bake the fbm noise field once
    const noiseRT = new THREE.WebGLRenderTarget(1024, 1024, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
      stencilBuffer: false,
    });
    {
      const bakeScene = new THREE.Scene();
      const bakeMat = new THREE.ShaderMaterial({
        uniforms: { uScale: { value: 2.4 } },
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
        uEdge: { value: 0.4 }, // wide feather → soft, crossfade-like
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

    // cover-fit each film (video frame or still) into its canvas (shader samples as-is)
    const drawInto = (i: number) => {
      const s = media[i];
      const c = canvases[i];
      if (!s || !s.ready() || !c.width || !s.w() || !s.h()) return;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      const ir = s.w() / s.h();
      const cr = c.width / c.height;
      let dw = c.width;
      let dh = c.height;
      let dx = 0;
      let dy = 0;
      if (ir > cr) {
        dh = c.height;
        dw = dh * ir;
        dx = (c.width - dw) / 2;
      } else {
        dw = c.width;
        dh = dw / ir;
        dy = (c.height - dh) / 2;
      }
      ctx.drawImage(s.el, dx, dy, dw, dh);
      textures[i].needsUpdate = true;
    };

    const resize = () => {
      const w = cvs.clientWidth || window.innerWidth || 1280;
      const h = cvs.clientHeight || window.innerHeight || 720;
      const scale = Math.min(1.6, 2600 / w);
      canvases.forEach((c, i) => {
        const cw = Math.max(1, Math.round(w * scale));
        const ch = Math.max(1, Math.round(h * scale));
        if (c.width === cw && c.height === ch) return; // ResizeObserver fires a lot
        c.width = cw;
        c.height = ch;
        // a CanvasTexture's GPU storage is allocated ONCE and IMMUTABLY by three
        // (texStorage2D + texSubImage2D updates), so growing the source canvas after
        // the first upload overflows it — Chrome drops the upload ("GL_INVALID_VALUE:
        // glCopySubTextureCHROMIUM: Offset overflows texture dimensions") and the film
        // renders blank. Disposing forces a fresh allocation at the new size.
        textures[i].dispose();
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(w, h, false);
      messages.forEach((_, i) => drawInto(i));
      render();
    };

    messages.forEach((m, i) => {
      if (m.still) {
        const img = new Image();
        img.decoding = "async";
        const paint = () => {
          drawInto(i);
          render();
        };
        img.addEventListener("load", paint);
        img.src = m.src;
        if (img.complete && img.naturalWidth) paint();
        media[i] = {
          el: img,
          video: false,
          ready: () => img.naturalWidth > 0,
          w: () => img.naturalWidth,
          h: () => img.naturalHeight,
        };
        return;
      }
      const vid = document.createElement("video");
      vid.src = m.src;
      vid.muted = true;
      vid.loop = true;
      vid.playsInline = true;
      vid.preload = "auto";
      vid.addEventListener("loadeddata", () => {
        drawInto(i);
        render();
      });
      vid.play().catch(() => {});
      media[i] = {
        el: vid,
        video: true,
        ready: () => vid.readyState >= 2,
        w: () => vid.videoWidth,
        h: () => vid.videoHeight,
      };
    });

    // repaint the films only while the act is on screen
    let vraf = 0;
    let visible = true;
    let lastPaint = 0;
    const pump = (now: number) => {
      vraf = requestAnimationFrame(pump);
      if (!visible || now - lastPaint < 33) return; // ~30fps is plenty
      lastPaint = now;
      let painted = false;
      media.forEach((s, i) => {
        if (!s.video || !s.ready()) return; // stills are drawn once, not per frame
        drawInto(i);
        painted = true;
      });
      if (painted) render();
    };
    vraf = requestAnimationFrame(pump);

    const vis = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        media.forEach((s) => {
          if (!s.video) return;
          const v = s.el as HTMLVideoElement;
          visible ? v.play().catch(() => {}) : v.pause();
        });
      },
      { threshold: 0 }
    );
    vis.observe(cvs);

    resize();
    window.addEventListener("resize", resize);
    const ro = new ResizeObserver(() => resize());
    ro.observe(cvs);

    const setPair = (a: THREE.Texture, b: THREE.Texture, prog: number, zoom: number) => {
      material.uniforms.uTexA.value = a;
      material.uniforms.uTexB.value = b;
      material.uniforms.uProgress.value = prog;
      material.uniforms.uZoom.value = zoom;
      render();
    };

    const showStatement = (i: number) => {
      const el = stmtRefs.current[i];
      if (!el) return;
      el.style.visibility = "visible";
      gsap.set(el.querySelectorAll(".tr-char"), { opacity: 1 });
      gsap.set(el.querySelectorAll(".tr-row"), { filter: "blur(0px)" });
    };

    // --r drives the entry mask: -15% = film hidden below, 100% = fully in
    const setEnter = (e: number) => {
      if (reveal.current) {
        reveal.current.style.setProperty("--r", (e * 115 - 15).toFixed(2) + "%");
        // fully hide while masked away — masked media can leak a 1px edge row
        // while this layer travels over the act beneath (the "traveling line")
        reveal.current.style.visibility = e <= 0.001 ? "hidden" : "visible";
      }
    };

    if (audit || reduce) {
      setEnter(1);
      setPair(textures[0], textures[0], 0, 1);
      showStatement(0);
      if (eyebrow.current) eyebrow.current.style.opacity = "1";
      const iv = window.setInterval(() => setPair(textures[0], textures[0], 0, 1), 250);
      window.setTimeout(() => window.clearInterval(iv), 3000);
      return () => {
        window.clearInterval(iv);
        window.removeEventListener("resize", resize);
        ro.disconnect();
        vis.disconnect();
        cancelAnimationFrame(vraf);
        media.forEach((s) => {
          if (!s.video) return;
          const v = s.el as HTMLVideoElement;
          v.pause();
          v.removeAttribute("src");
          v.load();
        });
        renderer.dispose();
      };
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sec,
          start: "top top",
          end: "+=200%",
          pin: stg,
          pinType: "fixed",
          scrub: 0.65,
          onUpdate: (self) => {
            const p = self.progress;
            const zoom = 1 + p * 0.06; // subtle scroll-driven push-in
            const map = gsap.utils.mapRange;
            // entry: the film masks in from the BOTTOM behind a soft feathered edge
            setEnter(smooth(gsap.utils.clamp(0, 1, p / ENTER)));
            // bottom-up merge — set BEFORE setPair's render so there's one pass/frame
            const mergeRaw = gsap.utils.clamp(0, 1, map(0.86, 1, 0, 1, p));
            const mergeF = smooth(mergeRaw);
            material.uniforms.uFade.value = mergeF;

            if (p < T[0][0]) setPair(textures[0], textures[0], 0, zoom);
            else if (p < T[0][1])
              setPair(textures[0], textures[1], smooth(map(T[0][0], T[0][1], 0, 1, p)), zoom);
            else if (p < T[1][0]) setPair(textures[1], textures[1], 0, zoom);
            else if (p < T[1][1])
              setPair(textures[1], textures[2], smooth(map(T[1][0], T[1][1], 0, 1, p)), zoom);
            else setPair(textures[2], textures[2], 0, zoom);

            if (scrim.current) scrim.current.style.opacity = (1 - mergeF).toFixed(3);
            if (eyebrow.current)
              eyebrow.current.style.opacity = (
                smooth(gsap.utils.clamp(0, 1, p / 0.06)) * (1 - mergeF)
              ).toFixed(3);
          },
        },
      });

      // statements: char-by-char blur reveal, synced to the film dissolves. The blur
      // lives on the ROW (2 filtered elements) while chars keep staggered opacity —
      // same look, a fraction of the per-frame raster cost.
      stmtRefs.current.forEach((el, i) => {
        if (!el) return;
        const chars = el.querySelectorAll<HTMLElement>(".tr-char");
        const rows = el.querySelectorAll<HTMLElement>(".tr-row");
        const [inAt, outAt] = IO[i];
        gsap.set(el, { autoAlpha: 1 });
        // every message starts hidden — the first one fades in only once the film has
        // masked in, so nothing floats over the bare page background
        gsap.set(chars, { opacity: 0 });
        gsap.set(rows, { filter: "blur(12px)" });
        if (inAt != null) {
          tl.fromTo(chars, { opacity: 0 }, { opacity: 1, ease: "none", stagger: { amount: 0.04 }, duration: 0.07 }, inAt);
          tl.fromTo(rows, { filter: "blur(12px)" }, { filter: "blur(0px)", ease: "none", duration: 0.09 }, inAt);
        }
        if (outAt != null) {
          tl.to(chars, { opacity: 0, ease: "none", stagger: { amount: 0.035 }, duration: 0.06 }, outAt);
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
      media.forEach((s) => {
        if (!s.video) return;
        const v = s.el as HTMLVideoElement;
        v.pause();
        v.removeAttribute("src");
        v.load();
      });
      ctx.revert();
      renderer.dispose();
      textures.forEach((t) => t.dispose());
      noiseRT.dispose();
      material.dispose();
    };
  }, [messages]);

  return (
    <div id="transparency" ref={section} className="relative" style={{ marginTop: "-100vh" }}>
      <div ref={stage} className="relative h-screen w-full overflow-hidden">
        {/* film + scrim share one soft bottom-up mask so the act REVEALS from the
            bottom on entry (--r animates -15% → 100%). The canvas's own transparency
            during the exit merge still lets the next act through. */}
        <div
          ref={reveal}
          className="absolute inset-0"
          style={
            {
              "--r": "-15%",
              WebkitMaskImage: "linear-gradient(to top, #000 var(--r), rgba(0,0,0,0) calc(var(--r) + 15%))",
              maskImage: "linear-gradient(to top, #000 var(--r), rgba(0,0,0,0) calc(var(--r) + 15%))",
            } as React.CSSProperties
          }
        >
          <canvas ref={glCanvas} className="absolute inset-0 h-full w-full" aria-hidden />

          {/* soft plate behind the statements + a band at the very top so the nav stays
              legible over bright footage; both fade out with the merge */}
          <div
            ref={scrim}
            className="nav-dark pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(74% 54% at 50% 50%, rgba(10,8,6,0.62) 0%, rgba(10,8,6,0.46) 45%, rgba(10,8,6,0.24) 75%, rgba(10,8,6,0.1) 100%), " +
                "linear-gradient(to bottom, rgba(10,8,6,0.34) 0%, rgba(10,8,6,0.16) 8%, transparent 18%)",
            }}
          />
        </div>

        <div className="over-img absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <span ref={eyebrow} className="caption mb-8" style={{ opacity: 0 }}>
            Our Principle
          </span>

          <div className="grid place-items-center">
            {messages.map((m, i) => (
              <div
                key={i}
                ref={(el) => {
                  stmtRefs.current[i] = el;
                }}
                className="flex flex-col items-center justify-center"
                style={{ gridArea: "1 / 1", visibility: "hidden" }}
              >
                {m.rows.map((row, r) => (
                  <span
                    key={r}
                    className="tr-row display block"
                    style={{
                      fontSize: "clamp(1.3rem, 3vw, 40px)",
                      lineHeight: 1.16,
                      paddingBottom: "0.06em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {Array.from(row).map((ch, ci) => (
                      <span key={ci} className="tr-char" style={GOLD}>
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
