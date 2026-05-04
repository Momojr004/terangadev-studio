"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import * as THREE from "three";

/**
 * Particle flow above the ocean — Ch1-Ch3 of the manifeste.
 *
 * 600 points drifting in +X (marine current), wrapping at the cylinder edge.
 * Color lerps from contemplative off-white (#F5F5F0) → data-state cyan
 * (#7DD3C0) as scroll passes 0.20 (entering Ch3 transformation arc).
 *
 * <points> chosen over instancedMesh : 600 quads at PointsMaterial size 0.02
 * is ~ free; we get additive blending and depthWrite=false for clean layering
 * over the OceanPlane shader.
 */

const PARTICLE_COUNT = 600;
const FIELD_RADIUS = 25; // X/Z half-extent of cylinder
const FIELD_HEIGHT = 4; // Y span (0 → 3 above plane at -0.5 → particles 0..4)
const FIELD_Y_BASE = 0;
const FLOW_SPEED = 0.35; // world units / second along +X
const COLOR_BASE = new THREE.Color("#F5F5F0");
const COLOR_DATA = new THREE.Color("#7DD3C0");

export function ParticleFlow() {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const scroll = useScroll();

  // Reusable color instance — avoid per-frame allocation.
  const tmpColor = useMemo(() => new THREE.Color(), []);

  // Initial positions : random distribution in a cylinder, biased toward
  // camera Z range so density looks right from the rig path.
  const positions = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Bias Z slightly toward [-10, 10] (camera path range) but allow spread.
      const zBias = (Math.random() - 0.5) * 2; // -1..1
      const z =
        zBias < 0
          ? -Math.pow(Math.abs(zBias), 1.4) * FIELD_RADIUS
          : Math.pow(zBias, 1.4) * FIELD_RADIUS;
      arr[i * 3 + 0] = (Math.random() - 0.5) * 2 * FIELD_RADIUS;
      arr[i * 3 + 1] = FIELD_Y_BASE + Math.random() * FIELD_HEIGHT;
      arr[i * 3 + 2] = z;
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    const points = pointsRef.current;
    const material = materialRef.current;
    if (!points || !material) return;

    // 1. Drift particles along +X with periodic wrap. Direct mutation of the
    //    underlying buffer is the cheap path — mark needsUpdate once.
    const attr = points.geometry.attributes
      .position as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    const dx = FLOW_SPEED * delta;
    const limit = FIELD_RADIUS;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3;
      arr[idx] += dx;
      if (arr[idx] > limit) {
        arr[idx] = -limit;
      }
    }
    attr.needsUpdate = true;

    // 2. Scroll-driven color + opacity ramp.
    //    progress < 0.20 : off-white at 50% (contemplative).
    //    progress > 0.20 : lerp toward cyan at 80% (data state).
    const t = THREE.MathUtils.clamp(scroll.offset, 0, 1);
    const dataMix = THREE.MathUtils.smoothstep(t, 0.2, 0.4);
    tmpColor.copy(COLOR_BASE).lerp(COLOR_DATA, dataMix);
    material.color.copy(tmpColor);
    material.opacity = THREE.MathUtils.lerp(0.5, 0.8, dataMix);

    // Use elapsedTime for any future shader work — kept for parity with
    // useFrame contract per repo convention.
    void state.clock.elapsedTime;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={PARTICLE_COUNT}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.05}
        sizeAttenuation
        color={COLOR_BASE}
        transparent
        opacity={0.5}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
