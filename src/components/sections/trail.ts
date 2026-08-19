import * as THREE from "three";

/**
 * The glowing tapered scroll-trail from the USPs depth gallery, extracted so other
 * sections can render the EXACT same animated line (same path, taper and feel).
 * Verbatim from UspsDepth — do not fork the maths; import from here.
 */
const TAU = Math.PI * 2;

// trail path + look config (matched to the repo's TrailController / Trail)
export const TRAIL = {
  startX: -0.96, startY: -1.05, width: 3, hCycles: 1.85, amp: 0.78, vCycles: 2.1,
  distanceAhead: 1.65, baseDepth: 4.78, depthSpan: 6.52, progressDepthOffset: -0.1,
  minPoints: 14, maxPoints: 200, seedCount: 10, seedStepZ: 0.12,
  radiusHead: 0.012, radiusTail: 0.003, color: "#f6f9ff", opacity: 0.55,
};

// tapered glowing tube that follows the accumulated trail points
export class Trail {
  group = new THREE.Group();
  points: THREE.Vector3[] = [];
  mesh: THREE.Mesh | null = null;
  minDistance = 0.006;
  maxPoints = TRAIL.maxPoints;
  material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(TRAIL.color),
    transparent: true,
    opacity: TRAIL.opacity,
    depthWrite: false,
    depthTest: false,
  });

  addPoint(pos: THREE.Vector3) {
    const last = this.points[this.points.length - 1] || null;
    if (last && pos.distanceToSquared(last) < this.minDistance * this.minDistance) return;
    const next = last ? last.clone().lerp(pos, 0.5) : pos.clone();
    this.points.push(next);
    while (this.points.length > this.maxPoints) this.points.shift();
    if (this.points.length < 2) return;
    const curve = new THREE.CatmullRomCurve3(this.points, false, "centripetal", 0.67);
    const segments = Math.max(24, Math.min(180, this.points.length * 4));
    const geo = this.buildTube(curve, segments);
    if (!this.mesh) {
      this.mesh = new THREE.Mesh(geo, this.material);
      this.mesh.renderOrder = 1200;
      this.group.add(this.mesh);
      return;
    }
    this.mesh.geometry.dispose();
    this.mesh.geometry = geo;
  }

  buildTube(curve: THREE.CatmullRomCurve3, segments: number) {
    const path = curve.getSpacedPoints(segments);
    const radial = 6;
    const up = new THREE.Vector3(0, 0, 1);
    const tan = new THREE.Vector3();
    const nor = new THREE.Vector3();
    const bin = new THREE.Vector3();
    const off = new THREE.Vector3();
    const vp = new THREE.Vector3();
    const verts: number[] = [];
    const idx: number[] = [];
    for (let i = 0; i < path.length; i++) {
      const t = i / Math.max(path.length - 1, 1);
      const r = TRAIL.radiusHead + (TRAIL.radiusTail - TRAIL.radiusHead) * Math.pow(t, 1.5);
      curve.getTangent(t, tan).normalize();
      nor.crossVectors(up, tan).normalize();
      if (nor.lengthSq() === 0) nor.set(1, 0, 0);
      bin.crossVectors(tan, nor).normalize();
      for (let j = 0; j <= radial; j++) {
        const a = (j / radial) * TAU;
        off.copy(nor).multiplyScalar(-Math.cos(a) * r).addScaledVector(bin, Math.sin(a) * r);
        vp.copy(path[i]).add(off);
        verts.push(vp.x, vp.y, vp.z);
      }
    }
    const ring = radial + 1;
    for (let i = 0; i < path.length - 1; i++) {
      for (let j = 0; j < radial; j++) {
        const b = i * ring + j;
        idx.push(b, b + ring, b + 1, b + ring, b + ring + 1, b + 1);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }

  reset() {
    if (this.mesh) {
      this.mesh.geometry.dispose();
      this.group.remove(this.mesh);
      this.mesh = null;
    }
    this.points = [];
  }

  dispose() {
    this.reset();
    this.material.dispose();
  }
}

export const headPos = (cameraZ: number, progress: number, out: THREE.Vector3) => {
  const p = THREE.MathUtils.clamp(progress, 0, 1);
  const x = TRAIL.startX + Math.sin(p * TAU * TRAIL.hCycles) * TRAIL.width;
  const y = TRAIL.startY + Math.sin(p * TAU * TRAIL.vCycles) * TRAIL.amp;
  const dp = TRAIL.progressDepthOffset + p * (1 - TRAIL.progressDepthOffset);
  const z = cameraZ + TRAIL.distanceAhead - (TRAIL.baseDepth + dp * TRAIL.depthSpan);
  return out.set(x, y, z);
};
