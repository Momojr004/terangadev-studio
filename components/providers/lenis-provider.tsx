"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

// Lenis runs on every route, /manifeste included: since the v3 layout the
// manifesto scrolls the native window (no more drei <ScrollControls>), so
// Lenis no longer double-handles wheel events there — and its inertia is
// what gives the scroll-driven chapters their weight.
export function LenisProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
