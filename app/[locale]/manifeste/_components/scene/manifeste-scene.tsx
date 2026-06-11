"use client";

import { CameraRig } from "./camera-rig";
import { OceanPlane } from "./ocean-plane";
import { ParticleFlow } from "./particle-flow";

/**
 * Ocean backdrop restored. Galaxy spiral + nebula clouds 3D files are
 * kept in the tree but unused — easy to swap back in later.
 */
export function ManifesteScene() {
  return (
    <>
      <fog attach="fog" args={["#0A1628", 45, 110]} />
      <ambientLight intensity={0.32} color="#1A4D6B" />
      <hemisphereLight args={["#2D5F7C", "#0A1628", 0.4]} />
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
      <OceanPlane />
      <ParticleFlow />
      <CameraRig />
    </>
  );
}
