"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useMediaQuery } from "@/lib/client-hooks";

const HeroScene = dynamic(
  () => import("./hero-scene").then((m) => m.HeroScene),
  {
    ssr: false,
    loading: () => <HeroFallback />,
  },
);

/**
 * Soft gradient fallback — also used in light mode where the WebGL
 * sphere would read as a dark navy blob and break uniformity.
 */
function HeroFallback() {
  return (
    <div
      aria-hidden
      className="from-teranga-secondary/20 via-teranga-primary/10 absolute inset-0 bg-gradient-to-br to-transparent"
    />
  );
}

export function HeroCanvas() {
  const { resolvedTheme } = useTheme();
  // WebGL only on wide viewports and when motion is allowed. Reading the
  // media queries via useSyncExternalStore (in useMediaQuery) keeps the
  // server snapshot at `false`, so SSR renders the fallback and the client
  // upgrades after hydration without a setState-in-effect.
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const isWide = useMediaQuery("(min-width: 768px)");
  const enabled = isWide && !reduceMotion;

  // In light mode the WebGL sphere reads as a dark blob against the
  // light backdrop — use the soft gradient fallback instead so the
  // hero stays airy.
  if (!enabled || resolvedTheme === "light") {
    return <HeroFallback />;
  }

  return <HeroScene />;
}
