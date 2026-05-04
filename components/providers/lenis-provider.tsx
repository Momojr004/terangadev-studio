"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";

export function LenisProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Skip Lenis on /manifeste — drei <ScrollControls> handles smooth scroll
  // via its own damping. Running Lenis + ScrollControls together causes
  // wheel events to be double-handled (the classic conflict).
  const isManifeste =
    pathname === "/manifeste" || pathname.startsWith("/manifeste/");

  if (isManifeste) {
    return <>{children}</>;
  }

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
