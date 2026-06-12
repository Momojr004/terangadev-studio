"use client";

import { CameraRig } from "./camera-rig";
import { MorphObject } from "./morph-object";

/**
 * Subtraction edition: ONE object in the dark — the morphing particle
 * cloud (the dissolved cahier finding its order). Ocean plane, particle
 * flow, galaxy and nebula files stay in the tree but unused: a single
 * focal element is the whole point.
 */
export function ManifesteScene() {
  return (
    <>
      <fog attach="fog" args={["#04070D", 30, 60]} />
      <MorphObject />
      <CameraRig />
    </>
  );
}
