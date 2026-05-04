"use client";

import { useMemo, useRef } from "react";
import { extend, useFrame, type ThreeElement } from "@react-three/fiber";
import { shaderMaterial, useScroll } from "@react-three/drei";
import * as THREE from "three";

/**
 * Depth bubbles — Ch4 "La traversée" of the manifeste.
 *
 * 250 small particles rising from the abyss (y = -10) to the surface
 * (y = 0). Mixed sizes (small + large), per-particle vertical speed,
 * wrap on cross-zero. Visible only when scroll.offset > 0.40 — fade
 * in via material opacity ramp.
 *
 * Custom ShaderMaterial chosen over PointsMaterial because we need
 * per-point size variation (bubble radius randomised at init) AND
 * a soft circular alpha falloff so points don't read as squares
 * even at small sizes. AdditiveBlending + depthWrite=false to slot
 * cleanly under the OceanPlane backface caustics.
 *
 * Performance : 250 points, direct Float32Array mutation, single
 * draw call. ~0.05ms/frame on M1.
 */

const BUBBLE_COUNT = 400;
const FIELD_RADIUS_XZ = 8; // tight — bubbles concentrate near the dive viewpoint
const Y_BOTTOM = -8;
const Y_TOP = 1; // slightly above the surface so bubbles read as crossing it
const SPEED_MIN = 0.25;
const SPEED_MAX = 0.55;
const SIZE_SMALL = 0.05;
const SIZE_LARGE = 0.13;

const VERTEX_SHADER = /* glsl */ `
attribute float aSize;
attribute float aTint;
varying float vTint;

void main() {
  vTint = aTint;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  // Size attenuation : scale by inverse of view-space distance so
  // bubbles read at consistent on-screen scale regardless of depth.
  // Factor 1500 calibrated for the dive viewport — small bubbles
  // ~3-5px, large bubbles ~10-15px at typical 4-6u distance.
  gl_PointSize = aSize * (1500.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

const FRAGMENT_SHADER = /* glsl */ `
uniform float uOpacity;
uniform vec3 uColorBase;
uniform vec3 uColorTint;
varying float vTint;

void main() {
  // Circular soft falloff — distance from point center. GLSL's smoothstep
  // requires edge0 < edge1 (reversed order is undefined); use 1.0 - smoothstep
  // to invert the ramp so center=1, edge=0.
  vec2 c = gl_PointCoord - vec2(0.5);
  float d = length(c);
  if (d > 0.5) discard;
  float alpha = 1.0 - smoothstep(0.05, 0.5, d);

  vec3 col = mix(uColorBase, uColorTint, vTint);
  gl_FragColor = vec4(col, alpha * uOpacity);
}
`;

const BubbleShaderMaterial = shaderMaterial(
  {
    uOpacity: 0,
    uColorBase: new THREE.Color("#F5F5F0"),
    uColorTint: new THREE.Color("#B8D4E5"),
  },
  VERTEX_SHADER,
  FRAGMENT_SHADER,
);

extend({ BubbleShaderMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    bubbleShaderMaterial: ThreeElement<typeof BubbleShaderMaterial>;
  }
}

type BubbleShaderMaterialImpl = THREE.ShaderMaterial & {
  uOpacity: number;
};

export function DepthBubbles() {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<BubbleShaderMaterialImpl>(null);
  const scroll = useScroll();

  // Init buffers : positions, per-bubble size, per-bubble vertical
  // speed, per-bubble color tint mix [0..1].
  const { positions, sizes, speeds, tints } = useMemo(() => {
    const positions = new Float32Array(BUBBLE_COUNT * 3);
    const sizes = new Float32Array(BUBBLE_COUNT);
    const speeds = new Float32Array(BUBBLE_COUNT);
    const tints = new Float32Array(BUBBLE_COUNT);
    for (let i = 0; i < BUBBLE_COUNT; i++) {
      // Disc distribution (sqrt for uniform) within FIELD_RADIUS_XZ.
      const r = Math.sqrt(Math.random()) * FIELD_RADIUS_XZ;
      const theta = Math.random() * Math.PI * 2;
      positions[i * 3 + 0] = Math.cos(theta) * r;
      positions[i * 3 + 1] = Y_BOTTOM + Math.random() * (Y_TOP - Y_BOTTOM);
      positions[i * 3 + 2] = Math.sin(theta) * r;
      // ~25% of bubbles are "large" (visual variety).
      const isLarge = Math.random() < 0.25;
      sizes[i] = isLarge
        ? SIZE_LARGE * (0.7 + Math.random() * 0.6)
        : SIZE_SMALL * (0.6 + Math.random() * 0.8);
      speeds[i] = SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN);
      tints[i] = Math.random();
    }
    return { positions, sizes, speeds, tints };
  }, []);

  useFrame((state, delta) => {
    const points = pointsRef.current;
    const material = materialRef.current;
    if (!points || !material) return;

    // Scroll-driven opacity : fade in 0.40 → 0.48, hold, fade out
    // 0.62 → 0.70 (after the dive resolves into Ch5 top-down).
    const t = THREE.MathUtils.clamp(scroll.offset, 0, 1);
    const fadeIn = THREE.MathUtils.smoothstep(t, 0.4, 0.48);
    const fadeOut = 1 - THREE.MathUtils.smoothstep(t, 0.62, 0.7);
    material.uOpacity = Math.min(fadeIn, fadeOut) * 0.85;

    // Skip position updates if effectively invisible — saves ~0.05ms.
    if (material.uOpacity < 0.01) return;

    // Rise + wrap. Direct mutation, single needsUpdate.
    const attr = points.geometry.attributes
      .position as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < BUBBLE_COUNT; i++) {
      const idx = i * 3 + 1;
      arr[idx] += speeds[i] * delta;
      if (arr[idx] > Y_TOP) {
        // Reset to bottom with new XZ to avoid visible "column" patterns.
        const r = Math.sqrt(Math.random()) * FIELD_RADIUS_XZ;
        const theta = Math.random() * Math.PI * 2;
        arr[i * 3 + 0] = Math.cos(theta) * r;
        arr[idx] = Y_BOTTOM;
        arr[i * 3 + 2] = Math.sin(theta) * r;
      }
    }
    attr.needsUpdate = true;

    void state.clock.elapsedTime;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={BUBBLE_COUNT}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          args={[sizes, 1]}
          count={BUBBLE_COUNT}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aTint"
          args={[tints, 1]}
          count={BUBBLE_COUNT}
          itemSize={1}
        />
      </bufferGeometry>
      <bubbleShaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
