"use client";

import { useRef, type CSSProperties } from "react";
import { JetBrains_Mono } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "./parallax";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

type ScatterItem = {
  /** Content : string, number, or a symbol like "+" "✱" "—" */
  content: string;
  /** % from top */
  top: string;
  /** % from left or right edge */
  left?: string;
  right?: string;
  /** Rotation in degrees */
  rotate: number;
  /** Tailwind text-size class, e.g. "text-xs" */
  size?: string;
  /** Color (raw CSS color or rgba) */
  color: string;
  /** Optional uppercase letterspacing for mono labels */
  spaced?: boolean;
  /** Use mono font when true (defaults to true) */
  mono?: boolean;
};

// Per-item parallax depths, cycled by index — alternating sign so
// neighbouring marks drift in opposite directions (oryzo-style debris
// floating at different depths). 1 ≈ 12vh of travel across the chapter.
const SCATTER_SPEEDS = [-0.8, 0.55, -0.4, 0.9, -0.65, 0.45, -1.0, 0.7];

/**
 * Decorative scattered marks that break the visual rectangle of a
 * chapter. Each chapter passes its own list of items so the scatter
 * pattern is unique per section. Each mark is scroll-scrubbed at its
 * own speed while the chapter crosses the viewport.
 *
 * Hidden under md so mobile stays calm.
 */
export function DecorativeScatter({
  items,
  className,
}: {
  items: ScatterItem[];
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const wrap = wrapRef.current;
      if (!wrap) return;
      gsap.utils
        .toArray<HTMLElement>("[data-scatter]", wrap)
        .forEach((el, i) => {
          const speed = SCATTER_SPEEDS[i % SCATTER_SPEEDS.length];
          const travel = () => speed * window.innerHeight * 0.12;
          gsap.fromTo(
            el,
            { y: () => travel() },
            {
              y: () => -travel(),
              ease: "none",
              scrollTrigger: {
                trigger: wrap,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );
        });
    },
    { scope: wrapRef },
  );

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 hidden md:block ${className ?? ""}`}
    >
      {items.map((item, i) => (
        <span
          key={i}
          data-scatter
          style={
            {
              top: item.top,
              left: item.left,
              right: item.right,
              transform: `rotate(${item.rotate}deg)`,
              color: item.color,
            } as CSSProperties
          }
          className={`absolute ${item.size ?? "text-xs"} ${
            item.mono === false ? "" : mono.className
          } ${item.spaced ? "uppercase tracking-[0.3em]" : ""}`}
        >
          {item.content}
        </span>
      ))}
    </div>
  );
}
