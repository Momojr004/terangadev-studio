"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const PARTICLE_COUNT = 64;
const SPHERE_RADIUS = 2.2;
const CONNECTION_DISTANCE = 1.05;

function ParticleNetwork() {
  const groupRef = useRef<THREE.Group>(null);

  const { particles, linePositions } = useMemo(() => {
    const particles: { pos: THREE.Vector3; size: number }[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = SPHERE_RADIUS * (0.55 + Math.random() * 0.45);
      particles.push({
        pos: new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi),
          r * Math.sin(phi) * Math.sin(theta),
        ),
        size: 0.022 + Math.random() * 0.045,
      });
    }

    const positions: number[] = [];
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dist = particles[i].pos.distanceTo(particles[j].pos);
        if (dist < CONNECTION_DISTANCE) {
          positions.push(
            particles[i].pos.x,
            particles[i].pos.y,
            particles[i].pos.z,
            particles[j].pos.x,
            particles[j].pos.y,
            particles[j].pos.z,
          );
        }
      }
    }

    return { particles, linePositions: new Float32Array(positions) };
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.075;
      groupRef.current.rotation.x += delta * 0.018;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Particles */}
      {particles.map((p, i) => (
        <mesh key={i} position={p.pos.toArray()}>
          <sphereGeometry args={[p.size, 12, 12]} />
          <meshStandardMaterial
            color="#7ecbff"
            emissive="#0a68f7"
            emissiveIntensity={1.6}
            roughness={0.18}
            metalness={0.55}
          />
        </mesh>
      ))}

      {/* Connections */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#4ea8f9" transparent opacity={0.22} />
      </lineSegments>
    </group>
  );
}

export function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.4], fov: 45 }}
      dpr={[1, 1.6]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={3} color="#4ea8f9" />
      <pointLight
        position={[-5, -3, -5]}
        intensity={1.5}
        color="#0a68f7"
      />
      <Float speed={0.9} rotationIntensity={0.18} floatIntensity={0.28}>
        <ParticleNetwork />
      </Float>
    </Canvas>
  );
}
