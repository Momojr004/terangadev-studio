"use client";

import { useMemo, useRef } from "react";
import { extend, useFrame, type ThreeElement } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useManifesteScroll } from "../scroll-source";

/**
 * Volumetric-feeling nebula clouds.
 *
 * Each cloud is a large icosahedron with a custom shader that:
 *   - Uses 3D simplex noise on view position to create internal density
 *   - Fades to transparent at the silhouette (Fresnel-style)
 *   - Pulses color over time around an assigned brand-aligned tint
 *
 * Three clouds drift slowly at different speeds and depths. Combined
 * with additive blending against the starfield, the result reads as a
 * proper 3D nebula — the user can see real motion at every frame.
 */

const SIMPLEX_3D = /* glsl */ `
vec3 mod289_3(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289_4(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 perm(vec4 x){return mod289_4(((x*34.0)+1.0)*x);}
vec4 taylorInv(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise3(vec3 v){
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
  i=mod289_3(i);
  vec4 p=perm(perm(perm(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
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
  vec4 norm=taylorInv(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

const CLOUD_VERTEX = /* glsl */ `
varying vec3 vWorldPos;
varying vec3 vNormal;
void main() {
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPos = worldPos.xyz;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

const CLOUD_FRAGMENT = /* glsl */ `
uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uSeed;
varying vec3 vWorldPos;
varying vec3 vNormal;

${SIMPLEX_3D}

void main() {
  // Multi-octave noise field on world position so the cloud has
  // internal density variation that drifts independently.
  vec3 p = vWorldPos * 0.18 + vec3(uSeed, uSeed * 1.3, -uSeed);
  float n1 = snoise3(p + uTime * 0.06);
  float n2 = snoise3(p * 2.4 - uTime * 0.04);
  float n3 = snoise3(p * 4.0 + uTime * 0.02);
  float density = n1 * 0.55 + n2 * 0.3 + n3 * 0.15;
  density = clamp(density * 0.5 + 0.5, 0.0, 1.0);

  // Fresnel-ish silhouette fade so the sphere never reads as a hard ball.
  vec3 viewDir = normalize(cameraPosition - vWorldPos);
  float facing = abs(dot(normalize(vNormal), viewDir));
  float silhouette = pow(facing, 1.4);

  // Pulse the color over time between the two assigned hues.
  float pulse = 0.5 + 0.5 * sin(uTime * 0.4 + uSeed * 3.0);
  vec3 col = mix(uColorA, uColorB, pulse * density);

  // Dialed down so the clouds read as distant haze, not a foreground layer.
  float alpha = density * silhouette * 0.32;
  gl_FragColor = vec4(col * 0.7, alpha);
}
`;

const NebulaCloudMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorA: new THREE.Color("#1B5FBE"),
    uColorB: new THREE.Color("#7FB8FF"),
    uSeed: 0,
  },
  CLOUD_VERTEX,
  CLOUD_FRAGMENT,
);

extend({ NebulaCloudMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    nebulaCloudMaterial: ThreeElement<typeof NebulaCloudMaterial>;
  }
}

type NebulaCloudImpl = THREE.ShaderMaterial & {
  uTime: number;
  uSeed: number;
};

type CloudConfig = {
  position: [number, number, number];
  scale: number;
  seed: number;
  colorA: string;
  colorB: string;
  driftAmplitude: number;
  driftSpeed: number;
};

const CLOUDS: CloudConfig[] = [
  {
    position: [-9, 3, -22],
    scale: 8,
    seed: 1.3,
    colorA: "#1B3F7E", // brand primary, dimmed
    colorB: "#3A6BAC",
    driftAmplitude: 2.5,
    driftSpeed: 0.05,
  },
  {
    position: [10, -2, -28],
    scale: 10,
    seed: 4.7,
    colorA: "#3D2E7E", // muted purple
    colorB: "#5B4FBA",
    driftAmplitude: 3.0,
    driftSpeed: 0.04,
  },
  {
    position: [0, 5, -30],
    scale: 7,
    seed: 7.2,
    colorA: "#2E7E70", // muted teal
    colorB: "#4FBEA5",
    driftAmplitude: 2.0,
    driftSpeed: 0.06,
  },
  {
    position: [-4, -5, -20],
    scale: 5,
    seed: 9.8,
    colorA: "#1F4A7E",
    colorB: "#3A6BAC",
    driftAmplitude: 1.6,
    driftSpeed: 0.08,
  },
];

function NebulaCloud({ config }: { config: CloudConfig }) {
  const matRef = useRef<NebulaCloudImpl>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const basePos = useMemo(
    () => new THREE.Vector3(...config.position),
    [config.position],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (matRef.current) {
      matRef.current.uTime = t;
      matRef.current.uSeed = config.seed;
    }
    if (meshRef.current) {
      meshRef.current.position.x =
        basePos.x + Math.sin(t * config.driftSpeed + config.seed) *
          config.driftAmplitude;
      meshRef.current.position.y =
        basePos.y +
        Math.sin(t * config.driftSpeed * 1.3 + config.seed) *
          config.driftAmplitude *
          0.5;
      meshRef.current.rotation.y = t * 0.03 + config.seed;
      meshRef.current.rotation.x = t * 0.02 + config.seed * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={config.position} scale={config.scale}>
      <icosahedronGeometry args={[1, 4]} />
      <nebulaCloudMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        uColorA={new THREE.Color(config.colorA) as never}
        uColorB={new THREE.Color(config.colorB) as never}
      />
    </mesh>
  );
}

export function NebulaClouds3D() {
  return (
    <>
      {CLOUDS.map((c, i) => (
        <NebulaCloud key={i} config={c} />
      ))}
    </>
  );
}
