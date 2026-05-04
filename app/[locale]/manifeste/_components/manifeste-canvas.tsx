"use client";

import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Preload, ScrollControls } from "@react-three/drei";
import { ManifesteScene } from "./scene/manifeste-scene";

/**
 * Force ScrollControls to wake up its frameloop on mount. Without
 * this nudge, the WebGL framebuffer stays transparent at scroll=0
 * until the first wheel event — likely because ScrollControls only
 * triggers a render when its internal scroll position changes.
 */
function ScrollKickstart() {
  useEffect(() => {
    let cancelled = false;
    const nudge = () => {
      if (cancelled) return;
      // 1. Force R3F's ResizeObserver to measure (Canvas can stay at
      //    the HTML default 300x150 when portaled by ScrollControls).
      window.dispatchEvent(new Event("resize"));

      // 2. Simulate a real wheel event so ScrollControls fires its
      //    scroll handler — programmatic scrollTop assignment doesn't
      //    bubble to ScrollControls' listeners.
      const target = document.elementFromPoint(
        window.innerWidth / 2,
        window.innerHeight / 2,
      );
      if (target) {
        // tiny deltaY in both directions cancels out over the page
        // so the user effectively starts at scroll 0
        const wheel = (delta: number) =>
          new WheelEvent("wheel", {
            deltaY: delta,
            bubbles: true,
            cancelable: true,
          });
        target.dispatchEvent(wheel(2));
        requestAnimationFrame(() => {
          if (!cancelled) target.dispatchEvent(wheel(-2));
        });
      }
    };
    // 250ms timeout : longer than React Strict Mode's double-mount,
    // long enough for ScrollControls to fully wire its scroll handler.
    const t = setTimeout(nudge, 250);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);
  return null;
}

/**
 * V2 architecture — single persistent Canvas with ScrollControls
 * driving a global scroll progress (0 → 1). All scenes/cameras/
 * overlays react to this single source. No Lenis here — disabled
 * upstream in LenisProvider for /manifeste route.
 */
export function ManifesteCanvas() {
  return (
    <>
      <ScrollKickstart />
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
        <ScrollControls pages={7} damping={0.2} maxSpeed={2}>
          <ManifesteScene />
          <Preload all />
        </ScrollControls>
      </Canvas>
    </>
  );
}
