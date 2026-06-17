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

  // Ordered ring — a torus of points (named `lattice` for the morph
  // below). Replaces a filled cubic grid, which read head-on as a flat
  // pixelated block. Built in the XY plane so it FACES the camera: a
  // head-on ring with a hollow centre the copy reads through. (In the XZ
  // plane the camera saw it edge-on and the front/back rims piled up into
  // a solid bright ellipse under additive blending.)
  const TORUS_R = 2.6; // major radius
  const TORUS_r = 0.5; // tube radius
  const NU = 120; // points around the main ring
  const NV = Math.ceil(COUNT / NU); // rings around the tube
  for (let i = 0; i < COUNT; i++) {
    const iu = i % NU;
    const iv = Math.floor(i / NU);
    const u = (iu / NU) * Math.PI * 2;
    const v = (iv / NV) * Math.PI * 2;
    const rr = TORUS_R + TORUS_r * Math.cos(v);
    lattice[i * 3] = rr * Math.cos(u) + (rand() - 0.5) * 0.04; // X — ring
    lattice[i * 3 + 1] = rr * Math.sin(u) + (rand() - 0.5) * 0.04; // Y — ring
    lattice[i * 3 + 2] = TORUS_r * Math.sin(v) + (rand() - 0.5) * 0.04; // Z — tube depth
  }

  return { sphere, chaos, lattice };
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

  const { sphere, chaos, lattice } = useMemo(() => buildTargets(), []);
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
    const toCore = THREE.MathUtils.smoothstep(t, 0.82, 0.95);

    const attr = points.geometry.getAttribute(
      "position",
    ) as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < COUNT * 3; i++) {
      // sphere → chaos → lattice → core (lattice scaled to a point)
      let v = sphere[i] + (chaos[i] - sphere[i]) * toChaos;
      v += (lattice[i] - v) * toLattice;
      v += (lattice[i] * 0.06 - v) * toCore;
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
    // The core moment glows brighter as everything converges. Opacity
    // stays low overall — the object is a presence, never a competitor
    // to the copy in front of it.
    // Keep particles small + dim once they form the ring so the dense rim
    // doesn't sum to a white blob under additive blending — it stays a
    // faint coloured ring the copy reads over.
    material.size = 0.045 + toCore * 0.07;
    material.opacity = 0.5 - toChaos * 0.12 - toLattice * 0.18 + toCore * 0.12;

    // Spin in-plane (around the view axis Z) so the ordered ring keeps
    // facing the camera — a spin around Y would turn it edge-on and it
    // would pile up into a bright blob again. Sphere/chaos/core states are
    // rotation-agnostic, so this reads well across the whole morph.
    points.rotation.z = state.clock.elapsedTime * 0.04 + t * 0.5;
    points.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.05;
    points.rotation.y = 0;
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
