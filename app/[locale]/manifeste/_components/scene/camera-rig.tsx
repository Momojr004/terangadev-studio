"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useManifesteScroll } from "../scroll-source";

/**
 * 7 camera waypoints — placeholder positions for Pass 1.
 * Will be refined in Pass 2 to follow the narrative arc:
 *   Ch1 horizon (low, sea level) →
 *   Ch2 houle (rising) →
 *   Ch3 transformation (mid alt) →
 *   Ch4 traversée (dive + emerge, fastest segment) →
 *   Ch5 structure (top-down topo view) →
 *   Ch6 réseau (closer orbit) →
 *   Ch7 nœud central (convergence to logo)
 */
// Subtraction edition: one object at the origin, the camera makes a
// single slow dolly toward it with a gentle lateral drift. No dives,
// no orbits — the eye always knows where it is.
const WAYPOINTS: [number, number, number][] = [
  [0, 0.4, 10],
  [0.4, 0.5, 9],
  [0.7, 0.3, 8],
  [0.4, 0.2, 7],
  [-0.3, 0.4, 6.5],
  [-0.5, 0.3, 6],
  [0, 0.2, 5.2],
];

const LOOK_AT_WAYPOINTS: [number, number, number][] = [
  [0, -0.4, 0],
  [0, -0.4, 0],
  [0, -0.4, 0],
  [0, -0.4, 0],
  [0, -0.4, 0],
  [0, -0.4, 0],
  [0, -0.4, 0],
];

// Reusable Vector3 to avoid per-frame allocation.
const TMP_POS = new THREE.Vector3();
const TMP_LOOKAT = new THREE.Vector3();

export function CameraRig() {
  const scroll = useManifesteScroll();
  const { camera, invalidate } = useThree();

  const positionCurve = useMemo(() => {
    const points = WAYPOINTS.map((p) => new THREE.Vector3(...p));
    return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.3);
  }, []);

  const lookAtCurve = useMemo(() => {
    const points = LOOK_AT_WAYPOINTS.map((p) => new THREE.Vector3(...p));
    return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.3);
  }, []);

  // Mouse parallax — read by useFrame, written by a single window
  // listener. Normalized to [-1, 1] on each axis. Smoothed in-frame so
  // the camera glides instead of snapping.
  const pointer = useRef({ x: 0, y: 0 });
  const smoothPointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state) => {
    const t = THREE.MathUtils.clamp(scroll.offset, 0, 1);

    // Base waypoint along the scroll curve.
    positionCurve.getPoint(t, TMP_POS);

    // Cosmic breathing sway + slow orbital arc around the galaxy
    // center. The orbital component is the visible constant motion the
    // user feels even when scroll is paused. Amplitudes modest enough
    // to never compete with chapter copy.
    const breath = state.clock.elapsedTime;
    TMP_POS.x += Math.sin(breath * 0.18) * 0.12;
    TMP_POS.y += Math.sin(breath * 0.14 + 1.7) * 0.07;

    // Subtle pointer parallax — present but discreet.
    smoothPointer.current.x = THREE.MathUtils.lerp(
      smoothPointer.current.x,
      pointer.current.x,
      0.035,
    );
    smoothPointer.current.y = THREE.MathUtils.lerp(
      smoothPointer.current.y,
      pointer.current.y,
      0.035,
    );
    const parallaxStrength = 0.15 * (1 - t * 0.7);
    TMP_POS.x += smoothPointer.current.x * parallaxStrength;
    TMP_POS.y += -smoothPointer.current.y * parallaxStrength * 0.6;

    camera.position.copy(TMP_POS);

    lookAtCurve.getPoint(t, TMP_LOOKAT);
    camera.lookAt(TMP_LOOKAT);

    invalidate();
  });

  return null;
}
