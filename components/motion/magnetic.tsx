"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Magnetic wrapper — child element gently leans toward the cursor
 * when it enters a radius around it. Releases back to center on
 * mouseleave. rAF-throttled, lerp-smoothed, no React re-renders
 * during the animation.
 *
 * Usage: wrap an inline-block child (button, link). The wrapper
 * itself doesn't add visible styles.
 */
export function Magnetic({
  children,
  strength = 0.35,
  radius = 140,
  className,
}: {
  children: ReactNode;
  /** 0..1 — fraction of (cursor → button) vector applied to button */
  strength?: number;
  /** Activation radius in px around the button center */
  radius?: number;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const child = childRef.current;
    if (!wrap || !child) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let rafId = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let queued = false;

    const onMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < radius) {
        const falloff = 1 - dist / radius;
        targetX = dx * strength * falloff;
        targetY = dy * strength * falloff;
      } else {
        targetX = 0;
        targetY = 0;
      }
      if (!queued) {
        queued = true;
        rafId = requestAnimationFrame(tick);
      }
    };

    const tick = () => {
      queued = false;
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      child.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
      if (
        Math.abs(targetX - currentX) > 0.05 ||
        Math.abs(targetY - currentY) > 0.05
      ) {
        queued = true;
        rafId = requestAnimationFrame(tick);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, [strength, radius]);

  return (
    <div ref={wrapRef} className={className}>
      <div ref={childRef} style={{ willChange: "transform" }}>
        {children}
      </div>
    </div>
  );
}
