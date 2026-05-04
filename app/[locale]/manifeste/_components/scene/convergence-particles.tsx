"use client";

import { useMemo, useRef } from "react";
import { extend, useFrame, type ThreeElement } from "@react-three/fiber";
import { shaderMaterial, useScroll } from "@react-three/drei";
import * as THREE from "three";

/**
 * Convergence particles — Ch7 prelude of the manifeste scrollytelling.
 *
 * 180 cyan motes that rush inward from a sphere shell (radius 4-6
 * around origin) toward the center where the brand logo materializes.
 * Per-particle delays (via aSeed) give a staggered "data converging
 * into the brand" feel rather than a synchronized implosion.
 *
 * Ch7 ramp (scroll 0.85 → 1.00) :
 *   - 0.85 → 0.88 : fade in (motes appear at sphere shell)
 *   - 0.88 → 0.95 : rush inward with eased trajectory
 *   - 0.95 → 0.99 : fade out (absorb into the materializing logo)
 *
 * GPU-side animation : we ship start position as `position`, end
 * scatter as `aEnd`, and per-particle seed as `aSeed`. The vertex
 * shader interpolates with eased progress, so the buffer is uploaded
 * once at mount and stays static across the chapter — no per-frame
 * CPU writes.
 *
 * Visual : cyan #7DD3C0, additive blending, depthWrite=false, no
 * sizeAttenuation falloff (we want the motes readable as discrete
 * specks even when they get extremely close to the camera at z≈2.2).
 */

const PARTICLE_COUNT = 180;
const SHELL_INNER = 4.0;
const SHELL_OUTER = 6.0;

// ---- Shader -------------------------------------------------------

const CONVERGENCE_VERTEX_SHADER = /* glsl */ `
attribute vec3 aEnd;       // per-particle landing position near origin
attribute float aSeed;     // 0..1 randomness for delay + size variation

uniform float uProgress;   // 0..1 mapped from scroll [0.85..0.95]
uniform float uPixelSize;

varying float vAlphaEnv;   // alpha envelope passed to fragment

// Quartic ease-in : slow start, accelerating rush at the end.
// Sells "particles drifting then sucked into the convergence".
float easeInQuart(float t) {
  return t * t * t * t;
}

void main() {
  // Per-particle delay : seed offsets the start of each particle's
  // motion by up to 25% of the window. Late-starting particles will
  // arrive after the lead pack, smearing the convergence over time.
  float delay = aSeed * 0.25;
  float local = clamp((uProgress - delay) / (1.0 - delay), 0.0, 1.0);
  float eased = easeInQuart(local);

  vec3 pos = mix(position, aEnd, eased);

  // Alpha envelope : ramp in fast at start, fade out as particle
  // reaches the destination (0.85 of local time → start fading).
  float fadeIn = smoothstep(0.0, 0.15, local);
  float fadeOut = 1.0 - smoothstep(0.85, 1.0, local);
  vAlphaEnv = fadeIn * fadeOut;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  // Per-particle size variation via aSeed for organic feel. No
  // distance attenuation (350.0 / -mvPosition.z stays close to
  // constant across the convergence so motes don't bloom up huge).
  float sizeJitter = mix(0.7, 1.3, aSeed);
  gl_PointSize = uPixelSize * sizeJitter * (180.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

const CONVERGENCE_FRAGMENT_SHADER = /* glsl */ `
uniform float uOpacity;
uniform vec3 uColor;

varying float vAlphaEnv;

void main() {
  // Soft circular sprite — same disc-with-falloff trick as nodes.
  vec2 c = gl_PointCoord - vec2(0.5);
  float d = length(c);
  if (d > 0.5) discard;

  float core = 1.0 - smoothstep(0.0, 0.18, d);
  float halo = (1.0 - smoothstep(0.18, 0.5, d)) * 0.5;
  float alpha = max(core, halo);

  gl_FragColor = vec4(uColor, alpha * vAlphaEnv * uOpacity);
}
`;

const ConvergenceShaderMaterial = shaderMaterial(
  {
    uOpacity: 0,
    uProgress: 0,
    uPixelSize: 1.0,
    uColor: new THREE.Color("#7DD3C0"),
  },
  CONVERGENCE_VERTEX_SHADER,
  CONVERGENCE_FRAGMENT_SHADER,
);

extend({ ConvergenceShaderMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    convergenceShaderMaterial: ThreeElement<typeof ConvergenceShaderMaterial>;
  }
}

type ConvergenceShaderMaterialImpl = THREE.ShaderMaterial & {
  uOpacity: number;
  uProgress: number;
};

// ---- Component ----------------------------------------------------

export function ConvergenceParticles() {
  const materialRef = useRef<ConvergenceShaderMaterialImpl>(null);
  const scroll = useScroll();

  // Pre-compute per-particle attributes once.
  // - position : random point on sphere shell radius [SHELL_INNER, SHELL_OUTER]
  // - aEnd    : near-origin scatter (radius 0.05) so motes don't all
  //             collapse to the exact same pixel
  // - aSeed   : 0..1 used for delay + size jitter
  const { positions, ends, seeds } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const ends = new Float32Array(PARTICLE_COUNT * 3);
    const seeds = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Uniform sphere shell sampling : random direction (rejection-
      // free via spherical coords), random radius in [inner, outer].
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = SHELL_INNER + Math.random() * (SHELL_OUTER - SHELL_INNER);

      positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // End scatter : tiny offset around origin so motes terminate
      // across the logo footprint, not in a single point. Logo is
      // ~0.8 unit tall so 0.05 keeps motes visually "inside" it.
      ends[i * 3 + 0] = (Math.random() - 0.5) * 0.1;
      ends[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
      ends[i * 3 + 2] = (Math.random() - 0.5) * 0.1;

      seeds[i] = Math.random();
    }
    return { positions, ends, seeds };
  }, []);

  useFrame(() => {
    const mat = materialRef.current;
    if (!mat) return;

    const t = THREE.MathUtils.clamp(scroll.offset, 0, 1);

    // Outer envelope : fade-in 0.85→0.88, fade-out 0.97→1.00.
    // The vertex shader's per-particle envelope handles the per-mote
    // rush-fade; this outer one masks the entire system at chapter
    // boundaries so it doesn't pop in/out abruptly.
    const fadeIn = THREE.MathUtils.smoothstep(t, 0.85, 0.88);
    const fadeOut = 1 - THREE.MathUtils.smoothstep(t, 0.97, 1.0);
    mat.uOpacity = fadeIn * fadeOut;

    // Progress : map scroll [0.85..0.95] → [0..1] for the rush-in
    // animation. Particles arrive at origin by 0.95, then the logo
    // takes over the visual.
    mat.uProgress = THREE.MathUtils.clamp(
      (t - 0.85) / (0.95 - 0.85),
      0,
      1,
    );
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={PARTICLE_COUNT}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aEnd"
          args={[ends, 3]}
          count={PARTICLE_COUNT}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSeed"
          args={[seeds, 1]}
          count={PARTICLE_COUNT}
          itemSize={1}
        />
      </bufferGeometry>
      <convergenceShaderMaterial
        ref={materialRef}
        uPixelSize={1.0}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
