"use client";

import { useMemo, useRef } from "react";
import { extend, useFrame, type ThreeElement } from "@react-three/fiber";
import { shaderMaterial, useScroll } from "@react-three/drei";
import * as THREE from "three";

/**
 * Logo convergence — Ch7 hero of the manifeste scrollytelling.
 *
 * The brand "T" mark materializes at the scene origin as the
 * culminating image of the whole experience. After 6 chapters of
 * ocean → dive → coast → network, all energy collapses into the
 * brand identity.
 *
 * Geometry : THREE.Shape hand-built from the SVG path of the brand
 * logo (`components/site/logo.tsx`, viewBox 0 0 24 24, path
 * "M3 4.5 H17 L20 7.5 V11 H13 V20 L9.5 16.5 V11 H3 Z"). Built as
 * ShapeGeometry (flat) rather than ExtrudeGeometry — flat reads
 * cleaner under bloom and avoids dark side-faces fighting the glow.
 *
 * Material : custom ShaderMaterial implementing the brand linear
 * gradient #4EA8F9 → #0A68F7 along the SVG's gradient direction
 * (top-left to bottom-right). HDR-brightened (multiplier > 1) so
 * the bloom pass picks the logo up as a strong light source.
 *
 * Materialization animation (scroll 0.93 → 1.00) :
 *   - Scale  : 0 → 1 with easeOutBack (slight overshoot, lands
 *              with a snap that punctuates the convergence).
 *   - Opacity : delayed scale; logo grows transparent first then
 *               solidifies — feels like materialization rather
 *               than a static fade-in.
 *
 * Camera : Ch7 waypoint = [0, 0, 2.2] lookAt origin, FOV 45.
 * Logo target height ≈ 0.8 unit → fills ~17% of frame height.
 */

// ---- Geometry ----------------------------------------------------
//
// SVG path uses Y-down coordinates with origin top-left. Three.js
// uses Y-up. We flip Y by computing (24 - svgY) per vertex, then
// translate-to-center via geometry.center() after construction.
//
// Vertices in SVG order :
//   M3 4.5    → (3,    4.5)
//   H17       → (17,   4.5)
//   L20 7.5   → (20,   7.5)
//   V11       → (20,  11.0)
//   H13       → (13,  11.0)
//   V20       → (13,  20.0)
//   L9.5 16.5 → (9.5, 16.5)
//   V11       → (9.5, 11.0)
//   H3        → (3,   11.0)
//   Z         → close
//
// 9 unique vertices, all straight lines, single closed contour.
// Perfect for THREE.Shape's lineTo path.

const SVG_VERTICES_DOWN: ReadonlyArray<readonly [number, number]> = [
  [3, 4.5],
  [17, 4.5],
  [20, 7.5],
  [20, 11.0],
  [13, 11.0],
  [13, 20.0],
  [9.5, 16.5],
  [9.5, 11.0],
  [3, 11.0],
];

function buildLogoGeometry(): THREE.ShapeGeometry {
  const shape = new THREE.Shape();
  // Flip Y : (svgY → 24 - svgY) to convert Y-down to Y-up.
  const [x0, y0] = SVG_VERTICES_DOWN[0];
  shape.moveTo(x0, 24 - y0);
  for (let i = 1; i < SVG_VERTICES_DOWN.length; i++) {
    const [x, y] = SVG_VERTICES_DOWN[i];
    shape.lineTo(x, 24 - y);
  }
  shape.closePath();

  const geometry = new THREE.ShapeGeometry(shape);
  // Center on origin so the logo materializes on the camera's
  // lookAt target rather than off-axis to the upper-right.
  geometry.center();
  // SVG units are 0..24 (~22 wide, ~16 tall after the path bounds).
  // Target visual height ≈ 0.8 unit at z=2.2 with FOV 45.
  // The logo's vertical extent is 20 - 4.5 = 15.5 SVG units.
  // 0.8 / 15.5 ≈ 0.052 — but we want a punchier presence, bump
  // a hair to 0.06 → final visual height ≈ 0.93 unit.
  geometry.scale(0.06, 0.06, 0.06);
  // computeBoundingBox is needed by the gradient shader to map
  // local position → 0..1 gradient coordinate.
  geometry.computeBoundingBox();
  return geometry;
}

// ---- Shader ------------------------------------------------------
//
// Reproduces the SVG `linearGradient` (x1=2 y1=2 → x2=22 y2=22),
// i.e. diagonal top-left → bottom-right. After centering the
// geometry on origin, that maps to local-space "(-x_extent/2,
// +y_extent/2)" → "(+x_extent/2, -y_extent/2)" (remember Y was
// flipped during build).
//
// The shader passes vUv-equivalent local-position-normalized
// coordinates from vertex → fragment, then maps that to the
// gradient axis dot product.
//
// HDR multiplier : the bloom pass uses luminanceThreshold ~0.4.
// Standard sRGB blue at full brightness (1, 1, 1) → ~0.7 luminance.
// Mixing by 2.0 gives the logo enough headroom to bloom strongly
// while staying readable as the gradient palette in the core.

const LOGO_VERTEX_SHADER = /* glsl */ `
uniform vec3 uBboxMin;
uniform vec3 uBboxMax;

varying vec2 vGradCoord;   // 0..1 along bbox X, 0..1 along bbox Y

void main() {
  vec3 sizeBbox = uBboxMax - uBboxMin;
  vec3 normalized = (position - uBboxMin) / sizeBbox;
  // Gradient axis : top-left (x=0, y=1) → bottom-right (x=1, y=0).
  vGradCoord = vec2(normalized.x, 1.0 - normalized.y);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const LOGO_FRAGMENT_SHADER = /* glsl */ `
uniform vec3 uColorStart;   // #4EA8F9 — top-left
uniform vec3 uColorEnd;     // #0A68F7 — bottom-right
uniform float uOpacity;
uniform float uHdrBoost;    // multiplier for bloom strength

varying vec2 vGradCoord;

void main() {
  // Project the (x, y) coord onto the diagonal gradient axis.
  // Using (x + (1-yFlipped))/2 = (vGradCoord.x + vGradCoord.y)/2.
  float t = (vGradCoord.x + vGradCoord.y) * 0.5;
  vec3 col = mix(uColorStart, uColorEnd, t) * uHdrBoost;
  gl_FragColor = vec4(col, uOpacity);
}
`;

const LogoShaderMaterial = shaderMaterial(
  {
    uOpacity: 0,
    uHdrBoost: 2.0,
    uColorStart: new THREE.Color("#4EA8F9"),
    uColorEnd: new THREE.Color("#0A68F7"),
    uBboxMin: new THREE.Vector3(),
    uBboxMax: new THREE.Vector3(),
  },
  LOGO_VERTEX_SHADER,
  LOGO_FRAGMENT_SHADER,
);

extend({ LogoShaderMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    logoShaderMaterial: ThreeElement<typeof LogoShaderMaterial>;
  }
}

type LogoShaderMaterialImpl = THREE.ShaderMaterial & {
  uOpacity: number;
  uHdrBoost: number;
  uBboxMin: THREE.Vector3;
  uBboxMax: THREE.Vector3;
};

// ---- Halo shader (replaces postprocessing bloom) -----------------
//
// Bloom postprocessing was pulled (it washed out Pass 1-4 due to a
// tonemap/colorspace double-application that 3 hours of debugging
// couldn't cleanly resolve). Instead, render a soft additive radial
// gradient sprite BEHIND the logo to fake the "arrival glow" effect.
//
// PlaneGeometry sized 4× the logo bounding diameter, billboarded
// implicitly via shader (we keep it on the XY plane at z=-0.02 since
// the camera at Ch7 is on +Z looking at origin — close enough to
// face camera). Custom radial falloff with a brand-color tinted core.

const HALO_VERTEX_SHADER = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const HALO_FRAGMENT_SHADER = /* glsl */ `
uniform float uOpacity;
uniform vec3 uColor;

varying vec2 vUv;

void main() {
  // Distance from center of the plane (0..1 across the unit quad).
  vec2 c = vUv - vec2(0.5);
  float d = length(c) * 2.0; // 0 at center, 1 at edge of inscribed circle

  // Two-stage radial falloff : sharp inner core + soft outer halo.
  // Core : exponential decay near center for a punchy bright bloom.
  float core = exp(-d * 6.0);
  // Outer halo : smooth quadratic falloff for the wide diffuse glow.
  float halo = pow(max(0.0, 1.0 - d), 3.0);
  float alpha = (core * 0.85 + halo * 0.45) * uOpacity;

  // Tint slightly toward the brand cyan for energy feel, not pure
  // white which would feel sterile.
  gl_FragColor = vec4(uColor, alpha);
}
`;

const LogoHaloMaterial = shaderMaterial(
  {
    uOpacity: 0,
    uColor: new THREE.Color("#7DCEFF"), // cyan-blue, between brand cyan and brand blue
  },
  HALO_VERTEX_SHADER,
  HALO_FRAGMENT_SHADER,
);

extend({ LogoHaloMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    logoHaloMaterial: ThreeElement<typeof LogoHaloMaterial>;
  }
}

type LogoHaloMaterialImpl = THREE.ShaderMaterial & {
  uOpacity: number;
  uColor: THREE.Color;
};

// ---- Easing -------------------------------------------------------
//
// easeOutBack : overshoot then settle. The constant 1.70158 is the
// canonical "back" tension. Gives a satisfying snap at the moment
// the logo locks into place.

function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

// ---- Component ----------------------------------------------------

export function LogoConvergence() {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<LogoShaderMaterialImpl>(null);
  const haloMatRef = useRef<LogoHaloMaterialImpl>(null);
  const scroll = useScroll();

  const geometry = useMemo(() => buildLogoGeometry(), []);

  // Halo plane sized to ~4× the logo's bounding diameter so the glow
  // extends well beyond the silhouette but doesn't fill the whole frame.
  const haloSize = useMemo(() => {
    const bbox = geometry.boundingBox;
    if (!bbox) return 4;
    const w = bbox.max.x - bbox.min.x;
    const h = bbox.max.y - bbox.min.y;
    return Math.max(w, h) * 4.5;
  }, [geometry]);

  useFrame(() => {
    const group = groupRef.current;
    const mat = matRef.current;
    const haloMat = haloMatRef.current;
    if (!group || !mat || !haloMat) return;

    const t = THREE.MathUtils.clamp(scroll.offset, 0, 1);

    // Materialization window : 0.93 → 1.00.
    // Scale uses easeOutBack across the full window for the snap.
    // Opacity is delayed (starts at 0.94) so the logo scales up
    // semi-transparent then solidifies — sells materialization.
    const scaleProgress = THREE.MathUtils.smoothstep(t, 0.93, 1.0);
    const opacityProgress = THREE.MathUtils.smoothstep(t, 0.94, 0.99);
    // Halo fades in slightly earlier than the logo body and stays
    // bright at the end — the convergence energy "arrives" before
    // the geometry crystallizes.
    const haloProgress = THREE.MathUtils.smoothstep(t, 0.91, 0.97);

    const easedScale = easeOutBack(scaleProgress);
    group.scale.setScalar(easedScale);

    mat.uOpacity = opacityProgress;
    haloMat.uOpacity = haloProgress;

    // Bbox uniforms : geometry doesn't change, but the ref is null
    // on first mount so we sync each frame. Vector3.copy is ~6
    // floats — trivial cost, idempotent, robust to HMR.
    const bbox = geometry.boundingBox;
    if (bbox) {
      mat.uBboxMin.copy(bbox.min);
      mat.uBboxMax.copy(bbox.max);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={0}>
      {/* Halo behind the logo — additive radial gradient sprite */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[haloSize, haloSize]} />
        <logoHaloMaterial
          ref={haloMatRef}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* The logo geometry itself */}
      <mesh geometry={geometry}>
        <logoShaderMaterial
          ref={matRef}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
