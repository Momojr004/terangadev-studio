"use client";

/**
 * Decorative organic SVG blobs — labs.google design language.
 *
 * Large irregular shapes positioned at section edges (often
 * partially overflowing the viewport) in saturated brand colors.
 * Slow infinite drift + rotation, GPU-composited. Each section
 * also has a soft cursor parallax: blobs lean toward the cursor
 * with different per-shape magnitudes for a subtle depth feel.
 *
 * Animations are pure CSS keyframes defined in app/globals.css.
 * Cursor parallax is driven by a single rAF-throttled mousemove
 * listener that writes CSS variables on this wrapper.
 */

import { useEffect, useRef, type CSSProperties } from "react";

const BLOB_PATHS = {
  // Generated via blobmaker.app — irregular organic shapes with
  // 6-8 control points each, no perfect symmetry.
  blob1:
    "M44.8,-58.1C58.5,-49.4,70.5,-37.4,75.1,-23C79.7,-8.6,76.9,8.2,69.5,21.8C62.1,35.5,50,46,36.7,55.3C23.3,64.7,8.7,72.9,-5.6,73.5C-19.9,74.1,-39.8,67.1,-52.7,55C-65.5,42.8,-71.3,25.6,-72.6,7.9C-73.9,-9.8,-70.7,-28,-60.7,-39.3C-50.7,-50.6,-33.9,-55,-19,-61.9C-4.2,-68.8,8.7,-78.2,21.3,-77C33.9,-75.8,46.1,-66.9,44.8,-58.1Z",
  blob2:
    "M52.4,-63.6C66.6,-52.1,76.2,-34.6,78.5,-16.5C80.8,1.6,75.8,20.3,66,35.6C56.2,50.9,41.6,62.8,25.1,68.4C8.6,74,-9.8,73.4,-26.6,67.2C-43.4,61,-58.6,49.2,-67.9,33.6C-77.2,18,-80.6,-1.4,-75.3,-18.3C-70,-35.2,-56,-49.5,-40.5,-60.6C-25,-71.6,-12.5,-79.3,3.2,-83.1C18.8,-86.9,38.2,-75.1,52.4,-63.6Z",
  blob3:
    "M38.7,-50.2C53.3,-43.2,71.2,-37.4,77.4,-25.7C83.6,-13.9,78.1,3.7,71.1,18.6C64.1,33.5,55.5,45.6,43.5,55.2C31.4,64.8,15.7,71.9,0.4,71.3C-14.9,70.7,-29.8,62.4,-43.7,52.4C-57.5,42.3,-70.4,30.6,-74.7,16C-79,1.5,-74.7,-15.9,-66.4,-29.7C-58.1,-43.5,-45.7,-53.7,-32.6,-60.7C-19.5,-67.7,-5.7,-71.6,5.9,-79.6C17.5,-87.6,24,-57.2,38.7,-50.2Z",
  blob4:
    "M30.6,-46.5C39.5,-37.7,46.4,-28.2,52.2,-17C58,-5.7,62.7,7.4,60.6,19.3C58.5,31.3,49.6,42.2,38.2,51.5C26.8,60.8,13.4,68.5,-0.8,69.6C-15.1,70.7,-30.2,65.2,-43,56.4C-55.8,47.6,-66.3,35.4,-70.3,21.4C-74.4,7.4,-72,-8.3,-65.8,-21.1C-59.7,-33.9,-49.8,-43.9,-38.4,-51.7C-27,-59.5,-13.5,-65.2,-1.2,-63.5C11,-61.9,21.7,-55.3,30.6,-46.5Z",
} as const;

type Anim = "blobDriftA" | "blobDriftB" | "blobDriftC" | "blobDriftD";

type BlobCfg = {
  shape: keyof typeof BLOB_PATHS;
  color: string;
  /** CSS size — e.g. "40vw", "500px" */
  size: string;
  /** Absolute positioning — at least one side */
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  /** Static rotation applied first */
  rotation?: number;
  /** Animation variant — different keyframe per slot avoids sync */
  animation: Anim;
  /** Animation duration in seconds (default 60) */
  duration?: number;
  /** Negative delay so the loop is mid-cycle on load */
  delay?: number;
  /** Opacity 0-1 (default 1) */
  opacity?: number;
  /** Cursor parallax magnitude in px (default 16). Bigger blobs
      should usually move less — they feel "further back". */
  parallax?: number;
};

export function SectionBlobs({ blobs }: { blobs: BlobCfg[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Track cursor RELATIVE to this section so blobs only react when
    // the cursor is over them — avoids the whole page following the
    // mouse across multiple sections.
    let rafId = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let queued = false;

    const onMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      // Normalize to [-0.5, 0.5] across the section bounds. Clamp so
      // blobs ease back to center when the cursor leaves vertically.
      targetX = (e.clientX - rect.left) / rect.width - 0.5;
      const dy = (e.clientY - rect.top) / rect.height - 0.5;
      targetY = Math.max(-1, Math.min(1, dy));
      if (!queued) {
        queued = true;
        rafId = requestAnimationFrame(tick);
      }
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      if (!queued) {
        queued = true;
        rafId = requestAnimationFrame(tick);
      }
    };

    const tick = () => {
      queued = false;
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      wrap.style.setProperty("--cursor-x", currentX.toFixed(4));
      wrap.style.setProperty("--cursor-y", currentY.toFixed(4));
      if (
        Math.abs(targetX - currentX) > 0.001 ||
        Math.abs(targetY - currentY) > 0.001
      ) {
        queued = true;
        rafId = requestAnimationFrame(tick);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseout", onLeave, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {blobs.map((b, i) => {
        const parallax = b.parallax ?? 16;
        const style: CSSProperties = {
          position: "absolute",
          width: b.size,
          height: b.size,
          opacity: b.opacity ?? 1,
          top: b.position.top,
          bottom: b.position.bottom,
          left: b.position.left,
          right: b.position.right,
          animation: `${b.animation} ${b.duration ?? 60}s ease-in-out ${b.delay ?? 0}s infinite`,
          // Cursor parallax layered via margin (animation already
          // owns `transform`). Each blob gets its own magnitude so
          // they don't move in lockstep.
          marginLeft: `calc(var(--cursor-x, 0) * ${parallax}px)`,
          marginTop: `calc(var(--cursor-y, 0) * ${parallax}px)`,
          willChange: "transform, margin",
        };
        return (
          <svg
            key={i}
            viewBox="-100 -100 200 200"
            preserveAspectRatio="xMidYMid meet"
            style={style}
          >
            <g transform={`rotate(${b.rotation ?? 0})`}>
              <path d={BLOB_PATHS[b.shape]} fill={b.color} />
            </g>
          </svg>
        );
      })}
    </div>
  );
}

// Re-export type so consumers can import BlobCfg if they want strong typing
export type { BlobCfg };
