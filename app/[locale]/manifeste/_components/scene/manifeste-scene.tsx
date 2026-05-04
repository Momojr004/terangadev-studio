"use client";

import { CameraRig } from "./camera-rig";
import { OceanPlane } from "./ocean-plane";
import { ParticleFlow } from "./particle-flow";

/**
 * The persistent 3D scene — single source of truth for visuals
 * across the entire manifeste.
 *
 * Pass 2 (current) : Ch1-Ch3 ocean visuals — OceanPlane (shader displaced)
 * + ParticleFlow (drifting particles, scroll-driven color shift). Camera
 * waypoints 1-3 traverse this from sea level to mid altitude.
 *
 * Pass 3+ will add : underwater dive (Ch4), coast geometry (Ch5),
 * network nodes (Ch6), logo convergence (Ch7).
 */
export function ManifesteScene() {
  return (
    <>
      {/* Atmospheric depth — fades distant ocean into the bg color so the
          horizon dissolves rather than ending in a hard edge. Drei's <fog>
          attaches as scene.fog, picked up by R3F's default lit materials and
          referenced explicitly by the OceanPlane shader. */}
      <fog attach="fog" args={["#0A1628", 15, 40]} />

      {/* Lighting — palette per brief : cool ocean key + secondary fill +
          hemisphere for depth body. Pass 2 introduces hemisphereLight at
          0.4 intensity so the ocean reads as a body of water, not a flat
          plane catching only point sources. */}
      <ambientLight intensity={0.32} color="#1A4D6B" />
      <hemisphereLight
        args={["#2D5F7C", "#0A1628", 0.4]}
      />
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
