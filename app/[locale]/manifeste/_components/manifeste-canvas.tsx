"use client";

import { Canvas } from "@react-three/fiber";
import { ScrollControls } from "@react-three/drei";
import { ManifesteScene } from "./scene/manifeste-scene";

/**
 * V2 architecture — single persistent Canvas with ScrollControls
 * driving a global scroll progress (0 → 1). All scenes/cameras/
 * overlays react to this single source. No Lenis here — disabled
 * upstream in LenisProvider for /manifeste route.
 */
export function ManifesteCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 8], fov: 45, near: 0.1, far: 100 }}
      dpr={[1, 1.6]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      style={{
        position: "absolute",
        inset: 0,
        background: "#0A1628",
      }}
    >
      <ScrollControls pages={7} damping={0.2} maxSpeed={2}>
        <ManifesteScene />
      </ScrollControls>
    </Canvas>
  );
}
