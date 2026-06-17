"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mulberry32 } from "@/lib/rng";
import { useManifesteScroll } from "../scroll-source";

/**
 * The manifesto's central object — TerangaDev's answer to oryzo.ai's
 * cork coaster. One particle cloud, four states, scrubbed by scroll:
 *
 *   hero        perfect sphere   (the promise, intact)
 *   ch.1–3      scattered chaos  (the paper world falling apart)
 *   ch.4–6      ordered lattice  (the other world: structure)
 *   ch.7        converged core   (the reveal: one bright point)
 *
 * Positions are lerped on the GPU-uploaded buffer each frame from
 * precomputed target arrays — no allocation in the frame loop. Color
 * follows the same journey (cyan → amber → teal → brand blue).
 */

const COUNT = 1800;

// Deterministic targets (fixed seed) so every visit shows the same object.
function buildTargets() {
  const rand = mulberry32(0x7e8a_06f7);

  const sphere = new Float32Array(COUNT * 3);
  const chaos = new Float32Array(COUNT * 3);
  const lattice = new Float32Array(COUNT * 3);

  // Sphere — Fibonacci-ish distribution, radius 2.2, slight jitter.
  for (let i = 0; i < COUNT; i++) {
    const u = rand() * 2 - 1;
    const theta = rand() * Math.PI * 2;
    const r = 2.2 * Math.cbrt(0.7 + rand() * 0.3);
    const s = Math.sqrt(1 - u * u);
    sphere[i * 3] = r * s * Math.cos(theta);
    sphere[i * 3 + 1] = r * u;
    sphere[i * 3 + 2] = r * s * Math.sin(theta);
  }

  // Chaos — wide flat scatter, like sheets blown across a desk.
  for (let i = 0; i < COUNT; i++) {
    chaos[i * 3] = (rand() - 0.5) * 16;
    chaos[i * 3 + 1] = (rand() - 0.5) * 7;
    chaos[i * 3 + 2] = (rand() - 0.5) * 10;
  }

  // Lattice — points snapped to a cubic grid: legible order.
  const side = Math.ceil(Math.cbrt(COUNT));
  const step = 5.2 / side;
  for (let i = 0; i < COUNT; i++) {
    const gx = i % side;
    const gy = Math.floor(i / side) % side;
    const gz = Math.floor(i / (side * side));
    lattice[i * 3] = (gx - side / 2) * step + (rand() - 0.5) * 0.05;
    lattice[i * 3 + 1] = (gy - side / 2) * step + (rand() - 0.5) * 0.05;
    lattice[i * 3 + 2] = (gz - side / 2) * step + (rand() - 0.5) * 0.05;
  }

  // Burst — the structure shatters: each point flung straight outward (its
  // own direction from the centre) to a far, varied radius. Used for the
  // final beat instead of condensing to a bright core; paired with a fade
  // so the cloud explodes and then vanishes, never a dense blob.
  const burst = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    const x = lattice[i * 3];
    const y = lattice[i * 3 + 1];
    const z = lattice[i * 3 + 2];
    const len = Math.hypot(x, y, z) || 0.001;
    const radius = 12 + rand() * 9;
    burst[i * 3] = (x / len) * radius;
    burst[i * 3 + 1] = (y / len) * radius;
    burst[i * 3 + 2] = (z / len) * radius;
  }

  return { sphere, chaos, lattice, burst };
}

// Soft round sprite so points render as glow dots, not squares.
function makeSprite(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.6)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

const COLOR_STOPS = [
  new THREE.Color("#7ECBFF"), // hero — bright cyan
  new THREE.Color("#FCD34D"), // paper/cost — warm amber
  new THREE.Color("#5EEAD4"), // other world — teal
  new THREE.Color("#4EA8F9"), // reveal — brand blue
];

const TMP_COLOR = new THREE.Color();

export function MorphObject() {
  const scroll = useManifesteScroll();
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  const { sphere, chaos, lattice, burst } = useMemo(() => buildTargets(), []);
  const positions = useMemo(() => sphere.slice(), [sphere]);
  const sprite = useMemo(() => makeSprite(), []);

  useFrame((state) => {
    const points = pointsRef.current;
    const material = materialRef.current;
    if (!points || !material) return;

    const t = THREE.MathUtils.clamp(scroll.offset, 0, 1);
    // Morph ramps (full-page scroll, 0..1). The canvas only becomes
    // visible at the bascule (~0.17), already in its chaos state — the
    // dissolved cahier. Order emerges through the expanding window,
    // converges to the core before the cream finale covers the scene.
    const toChaos = THREE.MathUtils.smoothstep(t, 0.05, 0.15);
    const toLattice = THREE.MathUtils.smoothstep(t, 0.3, 0.44);
    // Final beat: instead of condensing to a bright point (which read as a
    // dense blob over the copy), the ordered cloud EXPLODES outward and
    // fades. The burst spans the end of ch.6 into ch.7, so the structure is
    // already flying apart where the block used to sit.
    const toBurst = THREE.MathUtils.smoothstep(t, 0.72, 0.92);

    const attr = points.geometry.getAttribute(
      "position",
    ) as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < COUNT * 3; i++) {
      // sphere → chaos → lattice → burst (explode outward, then fade)
      let v = sphere[i] + (chaos[i] - sphere[i]) * toChaos;
      v += (lattice[i] - v) * toLattice;
      v += (burst[i] - v) * toBurst;
      arr[i] = v;
    }
    attr.needsUpdate = true;

    // Color journey along the same arc.
    if (t < 0.33) {
      TMP_COLOR.lerpColors(COLOR_STOPS[0], COLOR_STOPS[1], t / 0.33);
    } else if (t < 0.7) {
      TMP_COLOR.lerpColors(COLOR_STOPS[1], COLOR_STOPS[2], (t - 0.33) / 0.37);
    } else {
      TMP_COLOR.lerpColors(COLOR_STOPS[2], COLOR_STOPS[3], (t - 0.7) / 0.3);
    }
    material.color.copy(TMP_COLOR);
    // Particles streak a touch larger as they fly, and the whole cloud
    // fades to nothing across the burst so it disappears before the cream
    // finale — no dense point left glowing over the copy.
    material.size = 0.055 + toBurst * 0.05;
    material.opacity =
      (0.55 - toChaos * 0.15 + toLattice * 0.2) * (1 - toBurst);

    // Slow constant spin + a gentle scroll-driven turn.
    points.rotation.y = state.clock.elapsedTime * 0.03 + t * Math.PI * 0.8;
    points.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.08;
  });

  return (
    <points ref={pointsRef} position={[0, -0.4, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.055}
        map={sprite}
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}
