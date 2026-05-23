"use client";

import { useMemo, useRef } from "react";
import { extend, useFrame, type ThreeElement } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useManifesteScroll } from "../scroll-source";

/**
 * Slowly rotating spiral galaxy — the main hero of the manifesto sky.
 *
 * 4 logarithmic spiral arms made of ~5000 points. Inner radius is
 * brighter and warmer (yellow/white core), outer arms are dimmer and
 * tilt toward brand blue. The whole disk slowly rotates around Y so
 * the motion is constantly visible, even when the user pauses scroll.
 *
 * The disk is tilted ~25° on X so we see it at a 3/4 angle, which
 * reads as a real galaxy and not a flat plate. The center sits a bit
 * behind the camera origin so chapters in the foreground naturally
 * frame against the bright core.
 */

const ARMS = 4;
const ARM_TIGHTNESS = 0.42; // smaller = looser arms
const TOTAL_POINTS = 5000;
const RADIUS_MAX = 18;

const GALAXY_VERTEX = /* glsl */ `
attribute float aRadius;
attribute float aTheta;
attribute float aArmJitter;
attribute float aSize;
attribute float aPhase;
attribute vec3 aColor;
uniform float uTime;
uniform float uPixelRatio;
uniform float uRotation;
uniform float uScrollDrift;
varying vec3 vColor;
varying float vAlpha;

void main() {
  // Spiral position = (radius, theta + scroll-driven extra spin) → 3D.
  float theta = aTheta + uTime * 0.04 * (1.0 - aRadius * 0.025) + uRotation;
  float r = aRadius;
  vec3 pos;
  pos.x = cos(theta) * r + aArmJitter * cos(theta + 1.57) * 0.3;
  pos.z = sin(theta) * r + aArmJitter * sin(theta + 1.57) * 0.3;
  pos.y = aArmJitter * 0.4;
  pos.z -= uScrollDrift;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // Gentle pulse — toned down so the galaxy stays atmospheric.
  float pulse = 0.55 + 0.10 * sin(uTime * 0.9 + aPhase * 6.2831);
  vColor = aColor * pulse;
  vAlpha = pulse * 0.7;

  gl_PointSize = aSize * uPixelRatio * (180.0 / -mvPosition.z);
}
`;

const GALAXY_FRAGMENT = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;
void main() {
  // Soft round star, reduced halo so the field reads as dust, not lamps.
  vec2 uv = gl_PointCoord - vec2(0.5);
  float d = length(uv);
  float core = smoothstep(0.5, 0.0, d);
  float halo = smoothstep(0.5, 0.15, d) * 0.18;
  float a = (core + halo) * vAlpha;
  gl_FragColor = vec4(vColor, a);
}
`;

const GalaxySpiralMaterial = shaderMaterial(
  {
    uTime: 0,
    uPixelRatio: 1,
    uRotation: 0,
    uScrollDrift: 0,
  },
  GALAXY_VERTEX,
  GALAXY_FRAGMENT,
);

extend({ GalaxySpiralMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    galaxySpiralMaterial: ThreeElement<typeof GalaxySpiralMaterial>;
  }
}

type GalaxySpiralImpl = THREE.ShaderMaterial & {
  uTime: number;
  uPixelRatio: number;
  uRotation: number;
  uScrollDrift: number;
};

function buildSpiral() {
  const radii = new Float32Array(TOTAL_POINTS);
  const thetas = new Float32Array(TOTAL_POINTS);
  const jitters = new Float32Array(TOTAL_POINTS);
  const sizes = new Float32Array(TOTAL_POINTS);
  const phases = new Float32Array(TOTAL_POINTS);
  const colors = new Float32Array(TOTAL_POINTS * 3);
  const positions = new Float32Array(TOTAL_POINTS * 3); // unused placeholder

  // Muted palette — the galaxy reads as atmospheric distance, not a
  // flashy logo. All colors stay below 0.5 luminance so they never
  // overpower chapter copy with additive blending.
  const colorCore = new THREE.Color("#7090B5"); // cool muted blue-gray core
  const colorMid = new THREE.Color("#3A6394"); // brand-aligned dim blue
  const colorOuter = new THREE.Color("#1D3358"); // deep navy outer arms

  const tmp = new THREE.Color();

  for (let i = 0; i < TOTAL_POINTS; i++) {
    // Skew radius toward the outer arms but keep a bright dense core.
    const u = Math.random();
    const r = Math.pow(u, 1.6) * RADIUS_MAX;
    radii[i] = r;

    // Pick one of the 4 arms and add a tight logarithmic twist.
    const arm = i % ARMS;
    const baseTheta = (arm / ARMS) * Math.PI * 2;
    const twist = ARM_TIGHTNESS * r;
    thetas[i] = baseTheta + twist;

    // Random offset perpendicular to the arm, narrower near the core.
    jitters[i] = (Math.random() - 0.5) * (0.7 + r * 0.18);

    // Brighter and bigger near the core.
    const coreBias = 1 - r / RADIUS_MAX;
    sizes[i] = 0.6 + Math.pow(coreBias, 1.8) * 2.4 + Math.random() * 0.4;
    phases[i] = Math.random();

    // Color : core warm, mid brand, outer deep.
    if (coreBias > 0.7) {
      tmp.copy(colorCore).lerp(colorMid, (0.85 - coreBias) * 5);
    } else if (coreBias > 0.35) {
      tmp.copy(colorMid).lerp(colorOuter, (0.7 - coreBias) * 2);
    } else {
      tmp.copy(colorOuter).multiplyScalar(0.6 + Math.random() * 0.3);
    }
    colors[i * 3 + 0] = tmp.r;
    colors[i * 3 + 1] = tmp.g;
    colors[i * 3 + 2] = tmp.b;

    positions[i * 3 + 0] = 0;
    positions[i * 3 + 1] = 0;
    positions[i * 3 + 2] = 0;
  }
  return { radii, thetas, jitters, sizes, phases, colors, positions };
}

export function GalaxySpiral() {
  const matRef = useRef<GalaxySpiralImpl>(null);
  const groupRef = useRef<THREE.Group>(null);
  const scroll = useManifesteScroll();
  const data = useMemo(() => buildSpiral(), []);
  const dpr =
    typeof window !== "undefined"
      ? Math.min(window.devicePixelRatio || 1, 1.6)
      : 1;

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uTime = state.clock.elapsedTime;
      matRef.current.uPixelRatio = dpr;
      // Slow continuous rotation of the whole disk via uniform — easier
      // than mutating the group every frame and synced to time.
      matRef.current.uRotation = state.clock.elapsedTime * 0.025;
      // Pull the galaxy slightly forward as scroll progresses.
      matRef.current.uScrollDrift = scroll.offset * 4;
    }
  });

  return (
    <group
      ref={groupRef}
      rotation={[-0.6, 0, 0.15]}
      position={[2, -3, -32]}
      scale={0.55}
    >
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[data.positions, 3]}
            count={TOTAL_POINTS}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-aRadius"
            args={[data.radii, 1]}
            count={TOTAL_POINTS}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-aTheta"
            args={[data.thetas, 1]}
            count={TOTAL_POINTS}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-aArmJitter"
            args={[data.jitters, 1]}
            count={TOTAL_POINTS}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-aSize"
            args={[data.sizes, 1]}
            count={TOTAL_POINTS}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-aPhase"
            args={[data.phases, 1]}
            count={TOTAL_POINTS}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-aColor"
            args={[data.colors, 3]}
            count={TOTAL_POINTS}
            itemSize={3}
          />
        </bufferGeometry>
        <galaxySpiralMaterial
          ref={matRef}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
