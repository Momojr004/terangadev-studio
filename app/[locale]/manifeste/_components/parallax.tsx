"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Scroll-scrub toolkit for the manifesto (oryzo.ai-style parallax).
 *
 * Everything here is *scrubbed*: element transforms are bound to the
 * scroll position itself (via GSAP ScrollTrigger) instead of playing
 * once on enter like the framer-motion reveals. Combined with Lenis'
 * inertia this is what produces the "layers floating at different
 * depths" feel of oryzo.ai.
 *
 * All effects are skipped under `prefers-reduced-motion`.
 */

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Wraps content in a layer that drifts vertically while it crosses the
 * viewport.
 *
 * `speed` is the depth: positive drifts *against* the scroll (appears
 * further away, like a background), negative drifts *with* it (appears
 * closer, like a foreground). 1 ≈ 12vh of total travel.
 */
export function ParallaxLayer({
  speed = 0.4,
  className,
  style,
  children,
}: {
  speed?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const el = ref.current;
      if (!el) return;
      const travel = () => speed * window.innerHeight * 0.12;
      gsap.fromTo(
        el,
        { y: () => travel() },
        {
          y: () => -travel(),
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
