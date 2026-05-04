"use client";

import { CameraRig } from "./camera-rig";
import { TestMesh } from "./test-mesh";

/**
 * The persistent 3D scene — single source of truth for visuals
 * across the entire manifeste. Pass 1 = test mesh + lights only.
 * Pass 2 will add: sea plane, particle flow field, coast geometry,
 * network nodes, logo convergence target.
 */
export function ManifesteScene() {
  return (
    <>
      {/* Lighting — palette per brief : cool ocean key + secondary fill */}
      <ambientLight intensity={0.32} color="#1A4D6B" />
      <pointLight
        position={[5, 5, 5]}
        intensity={1.6}
        color="#7DD3C0"
        decay={2}
      />
      <pointLight
        position={[-5, -3, -5]}
        intensity={0.9}
        color="#2D5F7C"
        decay={2}
      />

      <TestMesh />
      <CameraRig />
    </>
  );
}
