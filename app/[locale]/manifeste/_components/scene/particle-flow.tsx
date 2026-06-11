"use client";

import { useMemo, useRef } from "react";
import { extend, useFrame, type ThreeElement } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useManifesteScroll } from "../scroll-source";
import { mulberry32 } from "@/lib/rng";

/**
 * Drifting sparkle field above the ocean.
 *
 * Each particle is rendered as a 4-pointed star via a fragment shader
 * (the default <pointsMaterial> would draw a square, which the user
 * found ugly). Per-particle phase makes each spark twinkle on its own
 * clock so the field reads as alive, not synced.
 */

const PARTICLE_COUNT = 600;
const FIELD_RADIUS = 22;
const FIELD_HEIGHT = 5;
const FIELD_Y_BASE = 0;
const FLOW_SPEED = 0.35;
const COLOR_BASE = new THREE.Color("#F5F5F0");
const COLOR_DATA = new THREE.Color("#7DD3C0");

const STAR_VERTEX = /* glsl */ `
attribute float aSize;
attribute float aPhase;
attribute float aTwinkleAmp;
uniform float uTime;
uniform float uPixelRatio;
uniform float uOpacity;
varying float vAlpha;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // Per-particle twinkle : each star pulses on its own phase so the
  // field never reads as a single synchronised animation.
  float twinkle = 1.0 - aTwinkleAmp * 0.5 * (1.0 + sin(uTime * 2.2 + aPhase * 6.2831));
  vAlpha = uOpacity * twinkle;

  // Size attenuation so far stars are smaller.
  gl_PointSize = aSize * uPixelRatio * (340.0 / -mvPosition.z);
}
`;

const STAR_FRAGMENT = /* glsl */ `
uniform vec3 uColor;
varying float vAlpha;

void main() {
  // Convert PointCoord [0,1] to centered uv [-0.5, 0.5].
  vec2 uv = gl_PointCoord - vec2(0.5);
  vec2 absUv = abs(uv);

  // 4-pointed star : pixels on the cardinal axes (where one of |uv.x|
  // or |uv.y| is small) get strong alpha, diagonal pixels get less.
  // The product (1 - min*K) bounded with smoothstep gives the spokes.
  float radial = smoothstep(0.5, 0.0, length(uv));
  float axisStrength = clamp(1.0 - min(absUv.x, absUv.y) * 7.0, 0.0, 1.0);
  float spokes = pow(axisStrength, 2.0) * radial;

  // Bright center bloom.
  float center = smoothstep(0.12, 0.0, length(uv)) * 1.2;

  float shape = clamp(spokes + center, 0.0, 1.4);
  gl_FragColor = vec4(uColor, shape * vAlpha);
}
`;

const SparkleMaterial = shaderMaterial(
  {
    uTime: 0,
    uPixelRatio: 1,
    uOpacity: 0.7,
    uColor: new THREE.Color("#F5F5F0"),
  },
  STAR_VERTEX,
  STAR_FRAGMENT,
);

extend({ SparkleMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    sparkleMaterial: ThreeElement<typeof SparkleMaterial>;
  }
}

type SparkleMaterialImpl = THREE.ShaderMaterial & {
  uTime: number;
  uPixelRatio: number;
  uOpacity: number;
  uColor: THREE.Color;
};

export function ParticleFlow() {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<SparkleMaterialImpl>(null);
  const scroll = useManifesteScroll();
  const tmpColor = useMemo(() => new THREE.Color(), []);
  const dpr =
    typeof window !== "undefined"
      ? Math.min(window.devicePixelRatio || 1, 1.6)
      : 1;

  // Initial particle attributes : positions skewed toward camera Z,
  // size/twinkle randomised per particle.
  const buffers = useMemo(() => {
    const rand = mulberry32(0x5eed_f10e);
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const phases = new Float32Array(PARTICLE_COUNT);
    const twinkleAmps = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const zBias = (rand() - 0.5) * 2;
      const z =
        zBias < 0
          ? -Math.pow(Math.abs(zBias), 1.4) * FIELD_RADIUS
          : Math.pow(zBias, 1.4) * FIELD_RADIUS;
      positions[i * 3 + 0] = (rand() - 0.5) * 2 * FIELD_RADIUS;
      positions[i * 3 + 1] = FIELD_Y_BASE + rand() * FIELD_HEIGHT;
      positions[i * 3 + 2] = z;
      // Size skewed low : most particles small, a few are bright sparkles.
      sizes[i] = 0.5 + Math.pow(rand(), 2.4) * 2.8;
      phases[i] = rand();
      twinkleAmps[i] = 0.4 + rand() * 0.6;
    }
    return { positions, sizes, phases, twinkleAmps };
  }, []);

  useFrame((state, delta) => {
    const points = pointsRef.current;
    const material = materialRef.current;
    if (!points || !material) return;

    // 1. Drift particles along +X with wrap.
    const attr = points.geometry.attributes
      .position as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    const dx = FLOW_SPEED * delta;
    const limit = FIELD_RADIUS;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3;
      arr[idx] += dx;
      if (arr[idx] > limit) arr[idx] = -limit;
    }
    attr.needsUpdate = true;

    // 2. Scroll-driven color shift + opacity ramp.
    const t = THREE.MathUtils.clamp(scroll.offset, 0, 1);
    const dataMix = THREE.MathUtils.smoothstep(t, 0.2, 0.4);
    tmpColor.copy(COLOR_BASE).lerp(COLOR_DATA, dataMix);
    material.uColor.copy(tmpColor);
    material.uOpacity = THREE.MathUtils.lerp(0.55, 0.85, dataMix);

    // 3. Time + DPR for the shader.
    material.uTime = state.clock.elapsedTime;
    material.uPixelRatio = dpr;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[buffers.positions, 3]}
          count={PARTICLE_COUNT}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          args={[buffers.sizes, 1]}
          count={PARTICLE_COUNT}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aPhase"
          args={[buffers.phases, 1]}
          count={PARTICLE_COUNT}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aTwinkleAmp"
          args={[buffers.twinkleAmps, 1]}
          count={PARTICLE_COUNT}
          itemSize={1}
        />
      </bufferGeometry>
      <sparkleMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
