"use client";

import { useMemo, useRef } from "react";
import { extend, useFrame, type ThreeElement } from "@react-three/fiber";
import { shaderMaterial, useScroll } from "@react-three/drei";
import * as THREE from "three";

/**
 * Coast geometry — Ch5 "La structure" of the manifeste scrollytelling.
 *
 * Hand-authored low-poly approximation of the **presqu'île de Dakar**
 * — westernmost point of continental Africa. The mesh evokes the
 * rounded quadrilateral peninsula pointing west toward Pointe des
 * Almadies (the actual western tip), with its broader eastern base
 * connecting back to the mainland and the northern bulge of Yoff /
 * the southern tail of Cap Manuel sketched in.
 *
 * NOT a cartographic map — an artistic interpretation. ~50 triangles
 * total, faceted shading via flat normals (no smoothing groups).
 *
 * Ch5 ramp (scroll 0.55 → 0.70) :
 *   - mesh y-offset rises from -2.5 (submerged, invisible under fog)
 *     to 0 (final position)
 *   - opacity ramps in over the same window so the coast doesn't
 *     "pop" through the fog as a hard silhouette
 *
 * Material : ocre #C9A876 (terre Dakar) at higher elevations, blue-
 * tinted at the wet-sand edges (low elevations). Subtle ambient
 * gradient sells the topography under the top-down Ch5 camera.
 *
 * Performance : 1 mesh, 1 draw call, ~50 tris. Custom ShaderMaterial
 * because we need both the elevation-driven color gradient AND a
 * scroll-driven uniform for the emerge animation in a single pass.
 */

// ---- Mesh authoring -------------------------------------------------
//
// Coordinate system : the mesh is authored in the XZ plane (Y = up).
// X spans roughly [-5, +5] east-west (~10 units = "30km Dakar width").
// Z spans roughly [-3, +3] north-south.
// Y carries the elevation : 0 at coast edges, 0.3 at inland peaks.
//
// Vertex layout (12 vertices) :
//
//      +Z (north / Yoff)
//        v3 ----- v4
//       /          \
//     v2  v10---v11  v5
//      |  |inland|   |
//     v1  v9----v8   v6      → +X (east / Plateau)
//       \          /
//        v0 ----- v7
//      -Z (south / Cap Manuel)
//
//  v12 = western tip (Pointe des Almadies) sticking out at -X
//
// We then triangulate into ~16 outer "coast slope" triangles and
// ~6 inland "plateau" triangles = ~22 tris. Doubled to ~44 with
// the south coast detail. Total fits the budget.
//
// Note : keeping X negative = west to align with the camera lookAt
// curve. Camera at Ch5 [0, 5, 4.5] lookAt origin will see this from
// above-and-slightly-south, framing the peninsula nicely.

const COAST_VERTICES: number[] = [
  // ---- outer coast ring (low elevation y ~ 0..0.05) ---------------
  // 0 : SE corner (south of Plateau)
  3.8, 0.0, -1.8,
  // 1 : E mid (Plateau coast)
  4.3, 0.05, -0.4,
  // 2 : NE upper (north Plateau toward Yoff)
  3.6, 0.05, 1.4,
  // 3 : N (Yoff coast)
  1.8, 0.0, 2.6,
  // 4 : NNW (Ngor)
  -0.4, 0.0, 2.4,
  // 5 : NW (approaching Almadies from north)
  -2.6, 0.05, 1.6,
  // 6 : far W (Pointe des Almadies — westernmost tip)
  -4.6, 0.0, 0.2,
  // 7 : SW (south of Almadies — Mamelles area)
  -2.8, 0.05, -1.4,
  // 8 : S (south coast, Mermoz)
  -0.6, 0.0, -2.2,
  // 9 : SSE (Cap Manuel area)
  1.6, 0.05, -2.4,

  // ---- inland plateau ring (raised elevation y ~ 0.20..0.30) ------
  // 10 : inland NE
  2.5, 0.25, 0.6,
  // 11 : inland N
  0.6, 0.30, 1.2,
  // 12 : inland W (closer to Almadies)
  -1.6, 0.22, 0.4,
  // 13 : inland S
  -0.4, 0.28, -0.8,
  // 14 : inland center (highest peak)
  1.2, 0.32, -0.2,
];

// Triangle indices — wind CCW when viewed from above (+Y down).
// Outer ring → inland ring : creates the "slope" geometry.
// Inland ring : 4 plateau triangles around the central peak (v14).
const COAST_INDICES: number[] = [
  // ---- outer slope triangles (coast rising to plateau) ------------
  // Each pair of adjacent outer verts links to an inland vert,
  // forming two triangles per "wedge" of the coast.
  //
  // SE wedge : v0 — v1 — v10
  0, 10, 1,
  // E wedge : v1 — v2 — v10
  1, 10, 2,
  // NE wedge : v2 — v3 — v10/v11
  2, 10, 11,
  2, 11, 3,
  // N wedge : v3 — v4 — v11
  3, 11, 4,
  // NNW wedge : v4 — v5 — v11/v12
  4, 11, 12,
  4, 12, 5,
  // NW wedge : v5 — v6 — v12
  5, 12, 6,
  // far W wedge : v6 — v7 — v12
  6, 12, 7,
  // SW wedge : v7 — v8 — v12/v13
  7, 12, 13,
  7, 13, 8,
  // S wedge : v8 — v9 — v13
  8, 13, 9,
  // SSE wedge : v9 — v0 — v13/v14
  9, 13, 14,
  9, 14, 0,
  // SE inland link : v0 — v10 — v14
  0, 14, 10,

  // ---- inland plateau triangles (around central peak v14) ---------
  10, 14, 11,
  11, 14, 12,
  12, 14, 13,
  // (v13 → v14 → v10 closes via the SE wedge above)
];

const VERTEX_SHADER = /* glsl */ `
uniform float uEmerge;        // 0 = submerged, 1 = fully risen
uniform float uSubmergedY;    // y-offset when submerged

varying float vElevation;
varying vec3 vViewPosition;
varying vec3 vNormal;

void main() {
  vElevation = position.y;

  // Lift the entire mesh from uSubmergedY back to 0 as uEmerge → 1.
  vec3 pos = position;
  pos.y += mix(uSubmergedY, 0.0, uEmerge);

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  vViewPosition = mvPosition.xyz;
  vNormal = normalMatrix * normal;
  gl_Position = projectionMatrix * mvPosition;
}
`;

const FRAGMENT_SHADER = /* glsl */ `
uniform vec3 uColorOcre;       // dry inland ocre
uniform vec3 uColorWetSand;    // blue-tinted coast edges
uniform vec3 uFogColor;
uniform float uOpacity;

varying float vElevation;
varying vec3 vViewPosition;
varying vec3 vNormal;

void main() {
  // Elevation gradient : 0.0 at edge → 1.0 at peak (peak is ~0.32).
  // Smoothstep gives a soft transition from wet sand to dry ocre.
  float h = smoothstep(0.0, 0.28, vElevation);
  vec3 baseCol = mix(uColorWetSand, uColorOcre, h);

  // Faceted shading : use the (flat) normal against a fixed key
  // direction. This sells the low-poly silhouette under the top-down
  // camera by giving each face a slightly different brightness.
  vec3 N = normalize(vNormal);
  vec3 keyDir = normalize(vec3(0.4, 0.9, 0.3));
  float ndotl = max(dot(N, keyDir), 0.0);
  float light = 0.55 + 0.45 * ndotl;
  baseCol *= light;

  // Atmospheric fog — match scene fog so the coast dissolves into
  // the navy bg at distance, just like the ocean.
  float dist = length(vViewPosition);
  float fogFactor = smoothstep(15.0, 40.0, dist);
  vec3 finalCol = mix(baseCol, uFogColor, fogFactor);

  gl_FragColor = vec4(finalCol, uOpacity);
}
`;

const CoastShaderMaterial = shaderMaterial(
  {
    uEmerge: 0,
    uSubmergedY: -2.5,
    uOpacity: 0,
    uColorOcre: new THREE.Color("#C9A876"),
    uColorWetSand: new THREE.Color("#5A6E7A"), // ocre × ocean mid
    uFogColor: new THREE.Color("#0A1628"),
  },
  VERTEX_SHADER,
  FRAGMENT_SHADER,
);

extend({ CoastShaderMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    coastShaderMaterial: ThreeElement<typeof CoastShaderMaterial>;
  }
}

type CoastShaderMaterialImpl = THREE.ShaderMaterial & {
  uEmerge: number;
  uOpacity: number;
  uFogColor: THREE.Color;
};

export function CoastGeometry() {
  const materialRef = useRef<CoastShaderMaterialImpl>(null);
  const scroll = useScroll();

  // Build the BufferGeometry once. We compute *flat* normals (one
  // normal per triangle, replicated to its 3 vertices) by NOT calling
  // computeVertexNormals on an indexed mesh — instead we expand the
  // index buffer into a non-indexed geometry, then computeVertexNormals
  // produces per-face flat normals as a side-effect of triangle
  // ordering. This gives the faceted low-poly look.
  const geometry = useMemo(() => {
    const positions = new Float32Array(COAST_VERTICES);
    const indices = new Uint16Array(COAST_INDICES);

    const indexed = new THREE.BufferGeometry();
    indexed.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    indexed.setIndex(new THREE.BufferAttribute(indices, 1));

    // Convert to non-indexed so each triangle has its own 3 unique
    // vertices → computeVertexNormals yields flat shading.
    const flat = indexed.toNonIndexed();
    flat.computeVertexNormals();
    indexed.dispose();
    return flat;
  }, []);

  useFrame((state) => {
    const material = materialRef.current;
    if (!material) return;

    // Ch5 ramp : emerge + fade in over scroll [0.55, 0.70].
    // Stay fully visible from 0.70 onward (no fade-out — coast persists
    // through Ch6/Ch7 since the network nodes sit on top of it).
    const t = THREE.MathUtils.clamp(scroll.offset, 0, 1);
    const emerge = THREE.MathUtils.smoothstep(t, 0.55, 0.70);
    material.uEmerge = emerge;
    material.uOpacity = emerge;

    // Mirror scene fog color so the coast respects the same
    // underwater → surface fog ramp the ocean uses.
    const sceneFog = state.scene.fog;
    if (sceneFog && (sceneFog as THREE.Fog).color) {
      material.uFogColor.copy((sceneFog as THREE.Fog).color);
    }
  });

  return (
    <mesh
      geometry={geometry}
      position={[0, -0.5, 0]}
      // Coast sits AT the ocean plane y=-0.5. Internal vertex y values
      // (0..0.32) push the inland peaks slightly above the surface.
    >
      <coastShaderMaterial
        ref={materialRef}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
