"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Pass 1 placeholder mesh — torus knot at origin.
 * Visually distinctive so we can see camera movement clearly.
 * Will be replaced in Pass 2 by the actual scene geometry
 * (sea wave plane → particles → coast → network → logo).
 */
export function TestMesh() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.18;
      ref.current.rotation.x += delta * 0.06;
    }
  });

  return (
    <mesh ref={ref}>
      <torusKnotGeometry args={[1, 0.32, 160, 32]} />
      <meshStandardMaterial
        color="#7DD3C0"
        emissive="#2D5F7C"
        emissiveIntensity={0.35}
        roughness={0.28}
        metalness={0.55}
      />
    </mesh>
  );
}
