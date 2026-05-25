"use client";

import { useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import { ManifesteScene } from "./scene/manifeste-scene";

/**
 * Ocean backdrop, restored — opaque navy background, eye looking down
 * toward the wave plane.
 */
function FrameloopKick() {
  const { invalidate } = useThree();
  useEffect(() => {
    // Invalidate a few times across the first second to ensure the
    // continuous frameloop actually kicks in (React Strict Mode
    // double-mount can sometimes leave the loop dormant).
    let n = 0;
    const id = setInterval(() => {
      invalidate();
      if (++n > 30) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, [invalidate]);
  return null;
}

export function ManifesteCanvas() {
  return (
    <div
      id="manifeste-canvas-wrap"
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity: 0 }}
    >
      <Canvas
        camera={{ position: [0, 0.5, 8], fov: 45, near: 0.1, far: 100 }}
        dpr={[1, 1.6]}
        frameloop="always"
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
        onCreated={({ camera }) => {
          camera.lookAt(0, -3, 0);
          camera.updateProjectionMatrix();
        }}
      >
        <FrameloopKick />
        <ManifesteScene />
        <Preload all />
      </Canvas>
    </div>
  );
}
