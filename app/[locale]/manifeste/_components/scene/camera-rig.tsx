"use client";

import { useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import * as THREE from "three";

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
const WAYPOINTS: [number, number, number][] = [
  [0, 0.5, 8], // Ch1
  [0, 2, 7], // Ch2
  [1.5, 3, 5.5], // Ch3
  [2, -1, 3.5], // Ch4 (dive)
  [0, 5, 4.5], // Ch5 (top-down)
  [-1, 3, 2.5], // Ch6
  [0, 0, 2.2], // Ch7 (center)
];

// Look-at targets — a parallel curve so each chapter can frame its
// subject. Without this, low-altitude Ch1 with lookAt origin makes
// the camera look almost horizontally, pushing the ocean plane out of
// the frustum. Tilting down via lookAt below origin pulls the ocean
// into the lower half of the frame.
const LOOK_AT_WAYPOINTS: [number, number, number][] = [
  [0, -3, 0], // Ch1 — tilt down to see ocean horizon
  [0, -2, 0], // Ch2 — slight upward as camera rises
  [0, -1, 0], // Ch3 — almost level
  [0, 0, 0], // Ch4 — origin during the dive
  [0, 0, 0], // Ch5 — top-down on the coast (Pass 4)
  [0, 0.5, 0], // Ch6 — network nodes (Pass 4)
  [0, 0, 0], // Ch7 — logo at origin (Pass 5)
];

// Reusable Vector3 to avoid per-frame allocation.
const TMP_LOOKAT = new THREE.Vector3();

export function CameraRig() {
  const scroll = useScroll();
  const { camera, invalidate } = useThree();

  const positionCurve = useMemo(() => {
    const points = WAYPOINTS.map((p) => new THREE.Vector3(...p));
    return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.3);
  }, []);

  const lookAtCurve = useMemo(() => {
    const points = LOOK_AT_WAYPOINTS.map((p) => new THREE.Vector3(...p));
    return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.3);
  }, []);

  useFrame(() => {
    const t = THREE.MathUtils.clamp(scroll.offset, 0, 1);
    camera.position.copy(positionCurve.getPoint(t));
    lookAtCurve.getPoint(t, TMP_LOOKAT);
    camera.lookAt(TMP_LOOKAT);
    // Force-invalidate so the renderer doesn't optimize this frame
    // away — useful in "demand" frameloop scenarios (which ScrollControls
    // can implicitly trigger).
    invalidate();
  });

  return null;
}
