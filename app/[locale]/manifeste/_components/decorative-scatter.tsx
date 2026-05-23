"use client";

import { JetBrains_Mono } from "next/font/google";
import type { CSSProperties } from "react";

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

/**
 * Decorative scattered marks that break the visual rectangle of a
 * chapter. Each chapter passes its own list of items so the scatter
 * pattern is unique per section.
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
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 hidden md:block ${className ?? ""}`}
    >
      {items.map((item, i) => (
        <span
          key={i}
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
