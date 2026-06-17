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

const COUNT = 6000;

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

  // Lattice — a big, PAGE-FILLING ordered grid. Spread wide in XY so the
  // structure occupies the whole screen (an ambient field, not a small
  // block in the centre); kept shallow in Z so every point stays in front
  // of the camera.
  const side = Math.ceil(Math.cbrt(COUNT));
  const stepXY = 8.5 / side;
  const stepZ = 3.5 / side;
  for (let i = 0; i < COUNT; i++) {
    const gx = i % side;
    const gy = Math.floor(i / side) % side;
    const gz = Math.floor(i / (side * side));
    lattice[i * 3] = (gx - side / 2) * stepXY + (rand() - 0.5) * 0.25;
    lattice[i * 3 + 1] = (gy - side / 2) * stepXY + (rand() - 0.5) * 0.25;
    lattice[i * 3 + 2] = (gz - side / 2) * stepZ + (rand() - 0.5) * 0.15;
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
    const radius = 9 + rand() * 7;
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
    // Final beat — timed so the burst PLAYS OUT while ch.6 condition 04 is
    // on screen and the dark canvas is still up (the ColorScript fades the
    // canvas as ch.7's cream arrives ~0.93, so the explosion must finish
    // just before). The page-filling grid holds through conditions 1-3,
    // then the whole screen of particles bursts off the edges and is gone.
    const toBurst = THREE.MathUtils.smoothstep(t, 0.9, 0.935);

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
    // The page-filling field stays SUBTLE (it covers the whole screen, so
    // low opacity keeps it from drowning the copy). At the burst it flares
    // brighter — the detonation — then the whole thing fades to nothing for
    // the cream finale. `toBurst * (1 - toBurst)` peaks mid-explosion.
    material.size = 0.05 + toBurst * 0.1;
    material.opacity =
      (0.4 - toChaos * 0.06) * (1 - toBurst) + toBurst * (1 - toBurst) * 1.8;

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
