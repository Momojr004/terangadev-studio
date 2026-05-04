"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import * as THREE from "three";

import { CameraRig } from "./camera-rig";
import { CoastGeometry } from "./coast-geometry";
import { ConvergenceParticles } from "./convergence-particles";
import { DepthBubbles } from "./depth-bubbles";
import { LogoConvergence } from "./logo-convergence";
import { NetworkNodes } from "./network-nodes";
import { OceanPlane } from "./ocean-plane";
import { ParticleFlow } from "./particle-flow";

/**
 * The persistent 3D scene — single source of truth for visuals
 * across the entire manifeste.
 *
 * Pass 2 : Ch1-Ch3 ocean visuals — OceanPlane + ParticleFlow.
 * Pass 3 : Ch4 "La traversée" dive — adds DepthBubbles rising from
 * the abyss + UnderwaterFog ramping the scene fog color when the
 * camera plunges below the surface. The OceanPlane shader renders a
 * caustic underside via gl_FrontFacing branch (Option A).
 * Pass 4 : Ch5 "La structure" + Ch6 "Le réseau" — adds CoastGeometry
 * (low-poly presqu'île de Dakar emerging from the water) and
 * NetworkNodes (3 lit beacons over Plateau / Almadies / Yoff with
 * pulsing cyan connections evoking the dakarois tech ecosystem).
 *
 * Pass 5 (current) : Ch7 "La convergence" — adds ConvergenceParticles
 * (~180 cyan motes rushing inward from a sphere shell) and
 * LogoConvergence (the brand "T" mark materializing at origin with
 * an easeOutBack snap, plus an additive radial halo plane behind it
 * for the "arrival glow" — replaces postprocessing bloom which broke
 * Pass 1-4 colorspace).
 */

const FOG_SURFACE = new THREE.Color("#0A1628");
const FOG_UNDERWATER = new THREE.Color("#050D1F");

/**
 * Drives scene.fog.color between the surface palette and the
 * darker underwater palette as the camera plunges below y = -0.5.
 * Mutating the existing Fog instance (rather than swapping fog
 * objects) keeps materials' fog uniforms stable across frames.
 *
 * Distance band [near, far] also tightens when underwater so
 * visibility falls off faster — sells the depth claustrophobia.
 */
function UnderwaterFog() {
  const scroll = useScroll();
  const tmpColor = useMemo(() => new THREE.Color(), []);

  useFrame((state) => {
    const fog = state.scene.fog as THREE.Fog | null;
    if (!fog) return;

    // Two ramps : camera depth (primary signal) + scroll (secondary
    // smoother during the Ch4 → Ch5 ascent so fog doesn't snap back
    // the instant camera crosses y=0). Take the max so we stay in
    // underwater mood for the full Ch4 window.
    const cameraY = state.camera.position.y;
    const depthMix = THREE.MathUtils.smoothstep(cameraY, 0.5, -1.0);
    const t = THREE.MathUtils.clamp(scroll.offset, 0, 1);
    const scrollMix =
      THREE.MathUtils.smoothstep(t, 0.43, 0.5) *
      (1 - THREE.MathUtils.smoothstep(t, 0.55, 0.62));
    const mix = Math.max(depthMix, scrollMix);

    tmpColor.copy(FOG_SURFACE).lerp(FOG_UNDERWATER, mix);
    fog.color.copy(tmpColor);

    // Tighten visibility when underwater : near/far compress slightly,
    // but keep enough far distance for the ocean underside caustics
    // and bubbles to remain readable from the dive viewpoint.
    fog.near = THREE.MathUtils.lerp(15, 8, mix);
    fog.far = THREE.MathUtils.lerp(40, 32, mix);
  });

  return null;
}

export function ManifesteScene() {
  return (
    <>
      {/* Atmospheric depth — fades distant ocean into the bg color so the
          horizon dissolves rather than ending in a hard edge. Drei's <fog>
          attaches as scene.fog, picked up by R3F's default lit materials and
          referenced explicitly by the OceanPlane shader. UnderwaterFog
          mutates this same instance per-frame for the Ch4 dive. */}
      <fog attach="fog" args={["#0A1628", 15, 40]} />
      <UnderwaterFog />

      {/* Lighting — palette per brief : cool ocean key + secondary fill +
          hemisphere for depth body. Pass 2 introduces hemisphereLight at
          0.4 intensity so the ocean reads as a body of water, not a flat
          plane catching only point sources. */}
      <ambientLight intensity={0.32} color="#1A4D6B" />
      <hemisphereLight
        args={["#2D5F7C", "#0A1628", 0.4]}
      />
      <pointLight
        position={[5, 5, 5]}
        intensity={1.6}
        color="#7DD3C0"
        decay={2}
      />
      <pointLight
        position={[-5, -3, -5]}
        intensity={0.9}
        color="#2D5F7C"
        decay={2}
      />

      <OceanPlane />
      <ParticleFlow />
      <DepthBubbles />
      <CoastGeometry />
      <NetworkNodes />
      <ConvergenceParticles />
      <LogoConvergence />
      <CameraRig />
    </>
  );
}
