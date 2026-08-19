/**
 * The noise-dissolve shader from the business page hero (`HeroScrub`), extracted so
 * other sections can crossfade media with the EXACT same effect. Imported by
 * HeroScrub and by the about page's ActTransparency — don't fork the GLSL.
 * (codrops "webgl-noise-page-transition", extended to mix two textures.)
 */

export const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// fbm noise field — baked ONCE into a texture so the per-frame dissolve shader never
// recomputes 4-octave noise per pixel (that was the heavy part)
export const NOISE_GLSL = /* glsl */ `
  float rand(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u * u * (3.0 - 2.0 * u);
    return mix(
      mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
      mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y);
  }
  // fractal Brownian motion — cloudier, softer, more organic than single noise
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = p * 2.0 + vec2(31.0, 17.0);
      a *= 0.5;
    }
    return v / 0.9375;
  }
`;

// one-time bake pass: renders the fbm field to a texture
export const NOISE_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uScale;
  ${NOISE_GLSL}
  void main() {
    float n = fbm(vUv * uScale);
    gl_FragColor = vec4(n, n, n, 1.0);
  }
`;

// per-frame dissolve + merge — just a couple of texture samples, so it's cheap
export const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTexA;
  uniform sampler2D uTexB;
  uniform sampler2D uNoise;
  uniform float uProgress; // 0 = A, 1 = B
  uniform float uEdge;
  uniform float uZoom;
  uniform float uFade; // 0 = fully shown, 1 = merged away (bottom-up)

  void main() {
    vec2 uv = (vUv - 0.5) / uZoom + 0.5;
    float n = texture2D(uNoise, vUv).r; // baked fbm — no per-frame noise cost
    // remap so progress 0 => fully A and 1 => fully B (no speckle at the ends)
    float t = uProgress * (1.0 + 2.0 * uEdge) - uEdge;
    float m = smoothstep(t - uEdge, t + uEdge, n);
    vec4 a = texture2D(uTexA, uv);
    vec4 b = texture2D(uTexB, uv);
    vec4 col = mix(b, a, m);
    // bottom-up merge: fade the alpha away from the bottom with a soft edge.
    float w = 0.55;
    float e = uFade * (1.0 + w) - w;
    // multiply rgb + alpha together (premultiplied) so it fades cleanly to transparent
    col *= smoothstep(e, e + w, vUv.y);
    gl_FragColor = col;
  }
`;

// alpha-only variant: reveals ONE texture through the noise field (0 = hidden,
// 1 = shown) without mixing toward a second texture — partially-dissolved pixels
// keep the image's true colors instead of darkening toward black. Straight
// (non-premultiplied) output: three's default NormalBlending premultiplies by
// alpha at blend time — premultiplying here too would darken by alpha² mid-fade.
export const FRAG_REVEAL = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTexB;
  uniform sampler2D uNoise;
  uniform float uProgress; // 0 = hidden, 1 = fully shown
  uniform float uEdge;
  uniform float uZoom;

  void main() {
    vec2 uv = (vUv - 0.5) / uZoom + 0.5;
    float n = texture2D(uNoise, vUv).r;
    float t = uProgress * (1.0 + 2.0 * uEdge) - uEdge;
    float m = smoothstep(t - uEdge, t + uEdge, n); // 1 = still hidden
    vec4 b = texture2D(uTexB, uv);
    float a = b.a * (1.0 - m);
    gl_FragColor = vec4(b.rgb, a);
  }
`;

/** ease so the dissolve starts/ends gently instead of snapping */
export const smooth = (t: number) => {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
};
