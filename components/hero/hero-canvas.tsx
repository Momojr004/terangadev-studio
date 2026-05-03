"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const HeroScene = dynamic(
  () => import("./hero-scene").then((m) => m.HeroScene),
  {
    ssr: false,
    loading: () => <HeroFallback />,
  },
);

function HeroFallback() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 from-teranga-secondary/30 via-teranga-primary/30 to-teranga-primary/40 bg-gradient-to-br"
    />
  );
}

export function HeroCanvas() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isWide = window.matchMedia("(min-width: 768px)").matches;
    if (reduceMotion || !isWide) return;
    setEnabled(true);
  }, []);

  if (!enabled) {
    return <HeroFallback />;
  }

  return <HeroScene />;
}
