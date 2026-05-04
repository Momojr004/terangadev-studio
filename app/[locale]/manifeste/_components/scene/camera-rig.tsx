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

const LOOK_AT = new THREE.Vector3(0, 0, 0);

export function CameraRig() {
  const scroll = useScroll();
  const { camera } = useThree();

  const curve = useMemo(() => {
    const points = WAYPOINTS.map((p) => new THREE.Vector3(...p));
    // Catmull-Rom spline; tension 0.3 → smooth but not floppy
    return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.3);
  }, []);

  useFrame(() => {
    const t = THREE.MathUtils.clamp(scroll.offset, 0, 1);
    const point = curve.getPoint(t);
    camera.position.copy(point);
    camera.lookAt(LOOK_AT);
  });

  return null;
}
