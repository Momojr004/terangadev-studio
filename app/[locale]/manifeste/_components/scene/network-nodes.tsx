"use client";

import { useMemo, useRef } from "react";
import { extend, useFrame, type ThreeElement } from "@react-three/fiber";
import { shaderMaterial, useScroll } from "@react-three/drei";
import * as THREE from "three";

/**
 * Network nodes — Ch6 "Le réseau" of the manifeste scrollytelling.
 *
 * Three lit nodes positioned over the CoastGeometry to evoke the
 * dakarois tech ecosystem — one per neighbourhood :
 *   - Plateau   (downtown, eastern business core)
 *   - Almadies  (residential / beach, western tip)
 *   - Yoff      (north, near the airport)
 *
 * Each node = a single point sprite with soft additive halo. Three
 * connections (Plateau↔Almadies, Almadies↔Yoff, Yoff↔Plateau) form
 * a closed triangle, drawn as LineSegments with a shader that pulses
 * a bright cyan band traveling along each segment ~ every 2s.
 *
 * Ch6 ramp (scroll 0.70 → 0.78) :
 *   - nodes + connections fade in
 * Then stays visible through 0.95 (Ch7 entry) — handing off to
 * the logo convergence pass.
 *
 * Performance : 1 Points (3 verts) + 1 LineSegments (6 verts =
 * 3 segments). 2 draw calls total. <0.05ms/frame.
 *
 * Why LineSegments over InstancedMesh : Lines give us a 1-pixel
 * baseline render at any zoom (no width-vs-distance weirdness) and
 * the pulse-along-segment shader only needs a per-vertex `aProgress`
 * attribute (0 at start, 1 at end). InstancedMesh on tube geometry
 * would cost more verts and need its own LookAt math per segment for
 * basically identical visual fidelity at this scale.
 */

// ---- Node positions (matches CoastGeometry layout) -----------------
//
// Placed at coast XZ positions, slightly above the inland plateau
// elevation so they "hover" over the city like beacons. Y values are
// in the same local frame as the coast mesh (which is positioned at
// y=-0.5), so the final world y = nodeY + (-0.5) = nodeY - 0.5.
//
// Coast inland peak is y=0.32 → world y=-0.18. Nodes at y=0.55 →
// world y=0.05. Just above the surface, clearly visible top-down.

const NODE_PLATEAU: [number, number, number] = [3.4, 0.55, -0.4];   // east
const NODE_ALMADIES: [number, number, number] = [-3.8, 0.55, 0.4];  // west tip
const NODE_YOFF: [number, number, number] = [0.6, 0.55, 2.2];       // north

const NODE_POSITIONS = [NODE_PLATEAU, NODE_ALMADIES, NODE_YOFF];

// Three connections forming a closed triangle. Each entry is a pair
// of node indices [a, b]. Order within a pair sets the pulse direction
// (pulse travels from a → b).
const CONNECTIONS: [number, number][] = [
  [0, 1], // Plateau → Almadies
  [1, 2], // Almadies → Yoff
  [2, 0], // Yoff → Plateau
];

// ---- Node shader (soft glowing point sprite) -----------------------

const NODE_VERTEX_SHADER = /* glsl */ `
uniform float uPixelSize;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  // Distance-attenuated point size, calibrated for ~12-18 px on
  // screen at the Ch6 camera distance (~3-4 units from origin).
  gl_PointSize = uPixelSize * (350.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

const NODE_FRAGMENT_SHADER = /* glsl */ `
uniform float uOpacity;
uniform vec3 uColor;
uniform float uTime;

void main() {
  // Distance from sprite center (gl_PointCoord is [0,1]).
  vec2 c = gl_PointCoord - vec2(0.5);
  float d = length(c);
  if (d > 0.5) discard;

  // Hard core (full color) + soft halo (gaussian-ish falloff).
  // Subtle 2s-period pulse on the core brightness so each node
  // breathes — sells the "live network" feel.
  float pulse = 0.85 + 0.15 * sin(uTime * 3.14);
  float core = (1.0 - smoothstep(0.0, 0.18, d)) * pulse;
  float halo = (1.0 - smoothstep(0.18, 0.5, d)) * 0.55;
  float alpha = max(core, halo);

  gl_FragColor = vec4(uColor, alpha * uOpacity);
}
`;

const NodeShaderMaterial = shaderMaterial(
  {
    uOpacity: 0,
    uPixelSize: 1.0,
    uColor: new THREE.Color("#7DD3C0"),
    uTime: 0,
  },
  NODE_VERTEX_SHADER,
  NODE_FRAGMENT_SHADER,
);

extend({ NodeShaderMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    nodeShaderMaterial: ThreeElement<typeof NodeShaderMaterial>;
  }
}

type NodeShaderMaterialImpl = THREE.ShaderMaterial & {
  uOpacity: number;
  uTime: number;
};

// ---- Connection shader (animated pulse along each segment) ---------

const CONNECTION_VERTEX_SHADER = /* glsl */ `
attribute float aProgress;   // 0 at segment start, 1 at segment end
attribute float aSegId;      // segment index 0..N-1, used to phase-offset pulses
varying float vProgress;
varying float vSegId;

void main() {
  vProgress = aProgress;
  vSegId = aSegId;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
}
`;

const CONNECTION_FRAGMENT_SHADER = /* glsl */ `
uniform float uOpacity;
uniform vec3 uColor;
uniform vec3 uPulseColor;
uniform float uTime;
uniform float uPulseSpeed;   // pulse cycles per second
uniform float uPulseWidth;   // pulse half-width along [0,1]

varying float vProgress;
varying float vSegId;

void main() {
  // Each segment's pulse phase offset by aSegId * 0.33 → pulses
  // are visually staggered around the triangle, evoking traffic
  // flowing through the network.
  float phase = fract(uTime * uPulseSpeed + vSegId * 0.33);
  // Distance from current vertex's progress to the moving pulse
  // center. Shortest distance on a wrap-around [0,1] axis.
  float d = abs(vProgress - phase);
  d = min(d, 1.0 - d);
  float pulse = smoothstep(uPulseWidth, 0.0, d);

  vec3 col = mix(uColor, uPulseColor, pulse);
  // Base line is dimmer than the pulse highlights so the pulse
  // visibly travels rather than washing out.
  float alpha = (0.35 + pulse * 0.65) * uOpacity;

  gl_FragColor = vec4(col, alpha);
}
`;

const ConnectionShaderMaterial = shaderMaterial(
  {
    uOpacity: 0,
    uTime: 0,
    uPulseSpeed: 0.5,    // 2s period
    uPulseWidth: 0.18,
    uColor: new THREE.Color("#5BA89A"),       // dimmer cyan baseline
    uPulseColor: new THREE.Color("#B5F0E0"),  // brighter cyan highlight
  },
  CONNECTION_VERTEX_SHADER,
  CONNECTION_FRAGMENT_SHADER,
);

extend({ ConnectionShaderMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    connectionShaderMaterial: ThreeElement<typeof ConnectionShaderMaterial>;
  }
}

type ConnectionShaderMaterialImpl = THREE.ShaderMaterial & {
  uOpacity: number;
  uTime: number;
};

// ---- Component -----------------------------------------------------

export function NetworkNodes() {
  const nodeMaterialRef = useRef<NodeShaderMaterialImpl>(null);
  const connMaterialRef = useRef<ConnectionShaderMaterialImpl>(null);
  const scroll = useScroll();

  // Node geometry : 3-vertex Points buffer.
  const nodePositions = useMemo(() => {
    const arr = new Float32Array(NODE_POSITIONS.length * 3);
    NODE_POSITIONS.forEach((p, i) => {
      arr[i * 3 + 0] = p[0];
      arr[i * 3 + 1] = p[1];
      arr[i * 3 + 2] = p[2];
    });
    return arr;
  }, []);

  // Connection geometry : 2 verts per segment, with per-vertex
  // aProgress (0,1) and per-segment aSegId for pulse phase offset.
  const { connPositions, connProgress, connSegIds } = useMemo(() => {
    const positions = new Float32Array(CONNECTIONS.length * 2 * 3);
    const progress = new Float32Array(CONNECTIONS.length * 2);
    const segIds = new Float32Array(CONNECTIONS.length * 2);
    CONNECTIONS.forEach((pair, segIdx) => {
      const [a, b] = pair;
      const pa = NODE_POSITIONS[a];
      const pb = NODE_POSITIONS[b];
      // start vertex
      positions[segIdx * 6 + 0] = pa[0];
      positions[segIdx * 6 + 1] = pa[1];
      positions[segIdx * 6 + 2] = pa[2];
      progress[segIdx * 2 + 0] = 0.0;
      segIds[segIdx * 2 + 0] = segIdx;
      // end vertex
      positions[segIdx * 6 + 3] = pb[0];
      positions[segIdx * 6 + 4] = pb[1];
      positions[segIdx * 6 + 5] = pb[2];
      progress[segIdx * 2 + 1] = 1.0;
      segIds[segIdx * 2 + 1] = segIdx;
    });
    return {
      connPositions: positions,
      connProgress: progress,
      connSegIds: segIds,
    };
  }, []);

  useFrame((state) => {
    const t = THREE.MathUtils.clamp(scroll.offset, 0, 1);
    // Ch6 ramp : fade in 0.70 → 0.78. No fade-out — connections
    // remain visible into Ch7 entry where Pass 5 will take over.
    const fade = THREE.MathUtils.smoothstep(t, 0.70, 0.78);

    if (nodeMaterialRef.current) {
      nodeMaterialRef.current.uOpacity = fade;
      nodeMaterialRef.current.uTime = state.clock.elapsedTime;
    }
    if (connMaterialRef.current) {
      connMaterialRef.current.uOpacity = fade * 0.9;
      connMaterialRef.current.uTime = state.clock.elapsedTime;
    }
  });

  return (
    <group position={[0, -0.5, 0]}>
      {/* Connections sit beneath nodes in draw order so node halos
          render over the line endpoints. */}
      <lineSegments frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[connPositions, 3]}
            count={CONNECTIONS.length * 2}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-aProgress"
            args={[connProgress, 1]}
            count={CONNECTIONS.length * 2}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-aSegId"
            args={[connSegIds, 1]}
            count={CONNECTIONS.length * 2}
            itemSize={1}
          />
        </bufferGeometry>
        <connectionShaderMaterial
          ref={connMaterialRef}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[nodePositions, 3]}
            count={NODE_POSITIONS.length}
            itemSize={3}
          />
        </bufferGeometry>
        <nodeShaderMaterial
          ref={nodeMaterialRef}
          uPixelSize={1.0}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
