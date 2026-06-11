"use client";

import { useMemo, useRef } from "react";
import { extend, useFrame, type ThreeElement } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useManifesteScroll } from "../scroll-source";

/**
 * Starfield — replaces the ocean + particle pair with a galaxy / deep
 * space backdrop. Three nested layers create depth :
 *   - Far : ~1400 dim, tiny stars, almost static
 *   - Mid : ~ 500 medium, gentle twinkle
 *   - Near:  ~120 bright, strong twinkle, slight scroll-driven drift
 *
 * Single Points mesh per layer with a custom shader so we get :
 *   - Per-vertex size (varied star magnitudes)
 *   - Per-vertex twinkle phase (each star pulses on its own clock)
 *   - Soft additive blending for that nebula glow when stars overlap
 */

const STAR_VERTEX = /* glsl */ `
attribute float aSize;
attribute float aBrightness;
attribute float aPhase;
uniform float uTime;
uniform float uPixelRatio;
uniform float uScrollDrift;
uniform float uTimeDrift;
varying float vBrightness;

void main() {
  vec3 pos = position;
  // Continuous time-based forward drift so stars always feel like
  // they're streaming past, even when the user isn't scrolling. Wraps
  // every Z-spread cycle so points never escape the field.
  pos.z = mod(pos.z + uTimeDrift + uScrollDrift, 40.0) - 20.0;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // Stronger twinkle so each star reads as alive.
  float twinkle = 0.45 + 0.55 * sin(uTime * 2.1 + aPhase * 6.2831);
  vBrightness = aBrightness * twinkle;

  gl_PointSize = aSize * uPixelRatio * (260.0 / -mvPosition.z);
}
`;

const STAR_FRAGMENT = /* glsl */ `
uniform vec3 uColorWarm;
uniform vec3 uColorCool;
varying float vBrightness;

void main() {
  // Circular falloff so each point reads as a real star, not a square.
  vec2 uv = gl_PointCoord - vec2(0.5);
  float d = length(uv);
  float core = smoothstep(0.5, 0.0, d);
  // Soft halo around the core for the brighter stars.
  float halo = smoothstep(0.5, 0.15, d) * 0.45;
  float alpha = (core + halo) * vBrightness;

  // Slight chromatic bias : brightest stars lean blue, dimmer ones warm.
  vec3 col = mix(uColorWarm, uColorCool, smoothstep(0.45, 0.95, vBrightness));
  gl_FragColor = vec4(col, alpha);
}
`;

const StarShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uPixelRatio: 1,
    uScrollDrift: 0,
    uTimeDrift: 0,
    uColorWarm: new THREE.Color("#F2E9CC"),
    uColorCool: new THREE.Color("#BFD9FF"),
  },
  STAR_VERTEX,
  STAR_FRAGMENT,
);

extend({ StarShaderMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    starShaderMaterial: ThreeElement<typeof StarShaderMaterial>;
  }
}

type StarLayer = {
  count: number;
  spreadX: number;
  spreadY: number;
  spreadZ: number;
  sizeMin: number;
  sizeMax: number;
  brightnessMin: number;
  brightnessMax: number;
  driftScale: number;
};

function buildAttributes(layer: StarLayer): {
  positions: Float32Array;
  sizes: Float32Array;
  brightness: Float32Array;
  phases: Float32Array;
} {
  const positions = new Float32Array(layer.count * 3);
  const sizes = new Float32Array(layer.count);
  const brightness = new Float32Array(layer.count);
  const phases = new Float32Array(layer.count);

  for (let i = 0; i < layer.count; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 2 * layer.spreadX;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 2 * layer.spreadY;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 2 * layer.spreadZ;
    // Skewed-low size distribution : most stars are tiny, a few are large.
    const r = Math.random();
    sizes[i] = layer.sizeMin + Math.pow(r, 2.2) * (layer.sizeMax - layer.sizeMin);
    brightness[i] =
      layer.brightnessMin +
      Math.pow(Math.random(), 1.5) *
        (layer.brightnessMax - layer.brightnessMin);
    phases[i] = Math.random();
  }
  return { positions, sizes, brightness, phases };
}

type StarShaderImpl = THREE.ShaderMaterial & {
  uTime: number;
  uPixelRatio: number;
  uScrollDrift: number;
  uTimeDrift: number;
};

function StarLayerPoints({
  layer,
  speed,
}: {
  layer: StarLayer;
  speed: number;
}) {
  const matRef = useRef<StarShaderImpl>(null);
  const scroll = useManifesteScroll();
  const attrs = useMemo(() => buildAttributes(layer), [layer]);
  const dpr =
    typeof window !== "undefined"
      ? Math.min(window.devicePixelRatio || 1, 1.6)
      : 1;

  useFrame((state) => {
    if (!matRef.current) return;
    matRef.current.uTime = state.clock.elapsedTime;
    matRef.current.uPixelRatio = dpr;
    matRef.current.uScrollDrift = scroll.offset * layer.driftScale;
    // Continuous hyperspace-style forward drift, layer-specific speed.
    matRef.current.uTimeDrift = state.clock.elapsedTime * speed;
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[attrs.positions, 3]}
          count={layer.count}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          args={[attrs.sizes, 1]}
          count={layer.count}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aBrightness"
          args={[attrs.brightness, 1]}
          count={layer.count}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aPhase"
          args={[attrs.phases, 1]}
          count={layer.count}
          itemSize={1}
        />
      </bufferGeometry>
      <starShaderMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

const LAYERS: StarLayer[] = [
  {
    // Far : the dust of the galaxy
    count: 1400,
    spreadX: 60,
    spreadY: 40,
    spreadZ: 35,
    sizeMin: 0.4,
    sizeMax: 1.4,
    brightnessMin: 0.18,
    brightnessMax: 0.45,
    driftScale: 0.5,
  },
  {
    // Mid : the populated middle ground
    count: 500,
    spreadX: 40,
    spreadY: 28,
    spreadZ: 20,
    sizeMin: 0.9,
    sizeMax: 2.4,
    brightnessMin: 0.35,
    brightnessMax: 0.75,
    driftScale: 1.4,
  },
  {
    // Near : the foreground beacons that twinkle
    count: 120,
    spreadX: 22,
    spreadY: 16,
    spreadZ: 10,
    sizeMin: 1.8,
    sizeMax: 4.2,
    brightnessMin: 0.55,
    brightnessMax: 1.0,
    driftScale: 3.2,
  },
];

// Per-layer drift speeds : far is slow, near is fast → real hyperspace
// parallax even when the user pauses scrolling.
const SPEEDS = [0.08, 0.22, 0.55];

export function Starfield() {
  return (
    <>
      {LAYERS.map((layer, idx) => (
        <StarLayerPoints key={idx} layer={layer} speed={SPEEDS[idx]} />
      ))}
    </>
  );
}
