"use client";

import { useRef } from "react";
import { extend, useFrame, type ThreeElement } from "@react-three/fiber";
import { shaderMaterial, useScroll } from "@react-three/drei";
import * as THREE from "three";

/**
 * Ocean surface — Ch1-Ch3 of the manifeste scrollytelling.
 *
 * Ch1 (scroll 0 → 0.15)   : "L'horizon" — calm low-poly water, slow waves.
 * Ch2 (scroll 0.15 → 0.30): "La houle"   — amplitude ramps up, foam crests.
 * Ch3 (scroll 0.30 → 0.43): "La transformation" — second noise layer adds
 *                            orthogonal flow trajectories suggesting code.
 *
 * Rendering : custom ShaderMaterial with vertex displacement (simplex noise +
 * two sine waves) and a fragment that gradients from #1A4D6B (deep) to
 * #2D5F7C (mid) with #B8C5D6 rim foam. No reflections, no transparency.
 */

// Inline GLSL 3D simplex noise — Ashima/IQ classic, public domain.
// Used in both ramps; cheap enough for 80x80 vertex shader at 60fps.
const SIMPLEX_3D_GLSL = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(
    i.z+vec4(0.0,i1.z,i2.z,1.0))
   +i.y+vec4(0.0,i1.y,i2.y,1.0))
   +i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

const VERTEX_SHADER = /* glsl */ `
uniform float uTime;
uniform float uScrollProgress;
varying float vDisplacement;
varying vec3 vViewPosition;
varying vec2 vUv;

${SIMPLEX_3D_GLSL}

void main() {
  vUv = uv;
  vec3 pos = position;

  // Base houle : two sine waves overlaid for organic motion.
  // Period ~3-4s, amplitude up to 0.15 unit per brief.
  float wave1 = sin(pos.x * 0.35 + uTime * 0.55) * 0.08;
  float wave2 = sin(pos.y * 0.28 + uTime * 0.40 + 1.7) * 0.07;
  float baseDisp = wave1 + wave2;

  // Ch2 ramp : 0.15 → 0.30 amplifies amplitude.
  float houleRamp = smoothstep(0.15, 0.30, uScrollProgress);
  float houleDisp = snoise(vec3(pos.xy * 0.18, uTime * 0.25)) * 0.18 * houleRamp;

  // Ch3 ramp : 0.30 → 0.43 adds orthogonal "flow trajectories".
  float flowRamp = smoothstep(0.30, 0.43, uScrollProgress);
  float flowA = snoise(vec3(pos.x * 0.55 - uTime * 0.6, pos.y * 0.05, 0.0));
  float flowB = snoise(vec3(pos.x * 0.05, pos.y * 0.55 + uTime * 0.45, 1.7));
  float flowDisp = (flowA + flowB) * 0.06 * flowRamp;

  float displacement = baseDisp + houleDisp + flowDisp;
  pos.z += displacement;

  vDisplacement = displacement;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  vViewPosition = mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
}
`;

const FRAGMENT_SHADER = /* glsl */ `
uniform float uTime;
uniform vec3 uColorDeep;
uniform vec3 uColorMid;
uniform vec3 uColorFoam;
uniform vec3 uColorUnderside;
uniform vec3 uColorCaustic;
uniform vec3 uFogColor;

varying float vDisplacement;
varying vec3 vViewPosition;
varying vec2 vUv;

// Cheap 2D hash noise — sufficient for caustic shimmer on the
// underside. Avoids re-running the simplex used in the vertex
// shader (we only need ~8-12 instructions of organic jitter here).
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise2(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
  vec3 baseCol;

  if (gl_FrontFacing) {
    // ===== TOP SIDE (Ch1-Ch3 visuals, unchanged) =====
    // Gradient from deep (#1A4D6B) at troughs to mid (#2D5F7C) at crests.
    // vDisplacement spans roughly [-0.2, +0.3]; remap to [0,1].
    float h = clamp((vDisplacement + 0.2) / 0.5, 0.0, 1.0);
    baseCol = mix(uColorDeep, uColorMid, h);

    // Foam suggestion : subtle rim where displacement exceeds threshold.
    float foam = smoothstep(0.12, 0.22, vDisplacement);
    baseCol = mix(baseCol, uColorFoam, foam * 0.55);
  } else {
    // ===== UNDERSIDE (Ch4 dive — looking up at the ocean) =====
    // Deeper blue baseline + animated caustic ripples : two superposed
    // sine cones offset in time, modulated by hash noise so the pattern
    // doesn't read as a regular grid. Scale UVs to give caustics a
    // 1-2m visual cell size.
    vec2 uv = vUv * 35.0;
    float t = uTime * 0.6;

    // Two concentric ripple sources offset, simulating refracted sun.
    // Frequencies bumped 1.3→2.5 / 1.1→2.2 for tighter, more readable
    // caustic cell sizes (~30-50px on screen at typical dive distance).
    float r1 = sin(length(uv - vec2(15.0, 12.0)) * 2.5 - t * 1.4);
    float r2 = sin(length(uv - vec2(22.0, 24.0)) * 2.2 + t * 1.1);
    // Soft noise breakup — keeps caustics organic rather than mathy.
    float n = noise2(uv * 0.55 + t * 0.2);

    // Caustic ramp : retain visible cells via mild pow sharpening,
    // floor at 0.15 keeps the underside from going pure-black.
    float caustic = (r1 + r2) * 0.5 * 0.6 + n * 0.4;
    caustic = pow(clamp(caustic * 0.5 + 0.5, 0.0, 1.0), 1.4);
    caustic = clamp(caustic, 0.15, 1.0);

    // Mix factor 0.65 — lets the underside base color show through
    // in troughs and caustic highlights pop in peaks. Reads as ocean
    // refraction rather than a flat blue wash.
    baseCol = mix(uColorUnderside, uColorCaustic, caustic * 0.65);
  }

  // Atmospheric fog by view-space distance — camera at Ch1 sits at
  // distance ~8 from origin, so push fog to [15, 40] to keep the near
  // ocean clearly visible while distant edges still dissolve to bg.
  float dist = length(vViewPosition);
  float fogFactor = smoothstep(15.0, 40.0, dist);
  vec3 finalCol = mix(baseCol, uFogColor, fogFactor);

  gl_FragColor = vec4(finalCol, 1.0);
}
`;

const OceanShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uScrollProgress: 0,
    uColorDeep: new THREE.Color("#1A4D6B"),
    uColorMid: new THREE.Color("#2D5F7C"),
    uColorFoam: new THREE.Color("#B8C5D6"),
    uColorUnderside: new THREE.Color("#163A52"),
    uColorCaustic: new THREE.Color("#7DB5DC"),
    uFogColor: new THREE.Color("#0A1628"),
  },
  VERTEX_SHADER,
  FRAGMENT_SHADER,
);

extend({ OceanShaderMaterial });

// Module augmentation so <oceanShaderMaterial /> is typed in JSX.
declare module "@react-three/fiber" {
  interface ThreeElements {
    oceanShaderMaterial: ThreeElement<typeof OceanShaderMaterial>;
  }
}

// Concrete handle type for the ref — drei's shaderMaterial returns a class
// extending THREE.ShaderMaterial with our uniforms hoisted as fields.
type OceanShaderMaterialImpl = THREE.ShaderMaterial & {
  uTime: number;
  uScrollProgress: number;
  uFogColor: THREE.Color;
};

export function OceanPlane() {
  const materialRef = useRef<OceanShaderMaterialImpl>(null);
  const scroll = useScroll();

  useFrame((state) => {
    if (!materialRef.current) return;
    materialRef.current.uTime = state.clock.elapsedTime;
    materialRef.current.uScrollProgress = THREE.MathUtils.clamp(
      scroll.offset,
      0,
      1,
    );
    // Mirror the scene fog color into our shader's fog uniform so the
    // underwater fog ramp (driven by <UnderwaterFog />) stays in sync
    // with the ocean's distance-fade. Falls back gracefully if no fog.
    const sceneFog = state.scene.fog;
    if (sceneFog && (sceneFog as THREE.Fog).color) {
      materialRef.current.uFogColor.copy((sceneFog as THREE.Fog).color);
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry args={[60, 60, 80, 80]} />
      <oceanShaderMaterial ref={materialRef} side={THREE.DoubleSide} />
    </mesh>
  );
}
