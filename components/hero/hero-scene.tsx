"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { mulberry32 } from "@/lib/rng";

function PrimaryShape() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.05;
      meshRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={meshRef} scale={1.4}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color="#0a68f7"
          distort={0.42}
          speed={1.6}
          roughness={0.18}
          metalness={0.32}
        />
      </mesh>
    </Float>
  );
}

function OrbitDots() {
  const groupRef = useRef<THREE.Group>(null);
  const positions = useMemo(() => {
    const rand = mulberry32(0x0_b17d075);
    const items: { x: number; y: number; z: number; scale: number }[] = [];
    for (let i = 0; i < 14; i++) {
      const angle = (i / 14) * Math.PI * 2;
      const radius = 2.4 + Math.sin(i * 0.7) * 0.4;
      items.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle * 1.3) * 1.2,
        z: Math.sin(angle) * radius,
        scale: 0.04 + rand() * 0.05,
      });
    }
    return items;
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
      groupRef.current.rotation.x += delta * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      {positions.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]} scale={p.scale}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial
            color="#4ea8f9"
            emissive="#0a68f7"
            emissiveIntensity={0.6}
            roughness={0.2}
            metalness={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.2], fov: 45 }}
      dpr={[1, 1.6]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.25} />
      <pointLight position={[5, 5, 5]} intensity={2.4} color="#4ea8f9" />
      <pointLight
        position={[-5, -3, -5]}
        intensity={1.2}
        color="#0a68f7"
      />
      <PrimaryShape />
      <OrbitDots />
    </Canvas>
  );
}
