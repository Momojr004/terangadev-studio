"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

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
  const [enabled, setEnabled] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isWide = window.matchMedia("(min-width: 768px)").matches;
    if (reduceMotion || !isWide) return;
    setEnabled(true);
  }, []);

  // In light mode the WebGL sphere reads as a dark blob against the
  // light backdrop — use the soft gradient fallback instead so the
  // hero stays airy.
  if (!enabled || resolvedTheme === "light") {
    return <HeroFallback />;
  }

  return <HeroScene />;
}
