"use client";

import { useEffect, useRef } from "react";

/**
 * Living backdrop for the manifesto.
 *
 * Dark navy base + 4 large blurred color blobs drifting on infinite,
 * desynchronized loops + soft cursor parallax. Pure CSS animation,
 * GPU-composited, no React re-renders per frame.
 *
 * Perf notes (v3):
 *  - Mix-blend-overlay grain removed — it forces a CPU compositor path
 *    on weaker GPUs and was the main scroll-jank culprit. Replaced by
 *    a flat low-opacity noise layer (no blend mode).
 *  - Wrapper promoted to its own compositor layer via translateZ(0)
 *    and `contain: paint`, so blob blur recompositing never invalidates
 *    the page content above it during scroll.
 *  - Blur radius lowered (80→64) to stay punchy but cheaper per frame.
 *  - 4 blobs instead of 5 — one fewer GPU-blurred layer.
 *
 * UX guards:
 *  - Cursor parallax magnitudes ≤ 40px (~3% viewport) — felt, not
 *    distracting.
 *  - `prefers-reduced-motion` freezes blob loops AND disables cursor
 *    parallax.
 */

// Keyframes live in app/globals.css to avoid React 19 Float hoisting
// our <style> tag out of the component tree (which broke hydration
// at body-level — see SiteBackdrop comment).

type BlobCfg = {
  color: string; // rgba inner stop
  top: string;
  left: string;
  size: string;
  blur: number;
  anim: string;
  duration: number;
  delay: number;
  opacity: number;
  /** Cursor parallax magnitude in px, applied through CSS vars. */
  parallax: number;
};

const BLOBS: BlobCfg[] = [
  {
    color: "rgba(78,168,249,0.95)", // brand cyan
    top: "-25%",
    left: "-20%",
    size: "110vmin",
    blur: 64,
    anim: "manifesteBlobA",
    duration: 36,
    delay: 0,
    opacity: 0.85,
    parallax: 30,
  },
  {
    color: "rgba(167,139,250,0.85)", // soft violet
    top: "-30%",
    left: "45%",
    size: "100vmin",
    blur: 64,
    anim: "manifesteBlobB",
    duration: 44,
    delay: -8,
    opacity: 0.8,
    parallax: 22,
  },
  {
    color: "rgba(251,113,133,0.80)", // magenta pink
    top: "40%",
    left: "-25%",
    size: "100vmin",
    blur: 72,
    anim: "manifesteBlobC",
    duration: 52,
    delay: -16,
    opacity: 0.75,
    parallax: 18,
  },
  {
    color: "rgba(125,211,192,0.85)", // teal / emerald
    top: "50%",
    left: "45%",
    size: "100vmin",
    blur: 72,
    anim: "manifesteBlobD",
    duration: 48,
    delay: -22,
    opacity: 0.8,
    parallax: 14,
  },
];

export function ManifesteBackdrop() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let rafId = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let queued = false;

    const onMove = (e: MouseEvent) => {
      // Normalize to [-0.5, 0.5] over the viewport
      targetX = e.clientX / window.innerWidth - 0.5;
      targetY = e.clientY / window.innerHeight - 0.5;
      if (!queued) {
        queued = true;
        rafId = requestAnimationFrame(tick);
      }
    };

    const tick = () => {
      queued = false;
      // Ease toward target (low-pass filter, ~0.08 lerp)
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      wrap.style.setProperty("--cursor-x", currentX.toFixed(4));
      wrap.style.setProperty("--cursor-y", currentY.toFixed(4));
      // Keep easing until close enough
      if (
        Math.abs(targetX - currentX) > 0.001 ||
        Math.abs(targetY - currentY) > 0.001
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
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{
        backgroundColor: "#04060E",
        backgroundImage:
          "linear-gradient(180deg, #06101F 0%, #050811 55%, #04060E 100%)",
        // Compositor isolation: paint stays local, no invalidation of
        // content above during blob animation / blur recomposite.
        contain: "paint",
        transform: "translateZ(0)",
      }}
    >
      {BLOBS.map((b, i) => (
        <div
          key={i}
          className="manifeste-blob absolute"
          style={{
            top: b.top,
            left: b.left,
            width: b.size,
            height: b.size,
            background: `radial-gradient(circle, ${b.color} 0%, rgba(0,0,0,0) 78%)`,
            filter: `blur(${b.blur}px)`,
            opacity: b.opacity,
            animation: `${b.anim} ${b.duration}s ease-in-out ${b.delay}s infinite`,
            marginLeft: `calc(var(--cursor-x, 0) * ${b.parallax}px)`,
            marginTop: `calc(var(--cursor-y, 0) * ${b.parallax}px)`,
            willChange: "transform",
          }}
        />
      ))}

      {/* Soft noise — no blend mode (perf), low alpha, just to break
          up banding on big saturated washes. */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.95  0 0 0 0 0.95  0 0 0 0 0.95  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "200px 200px",
        }}
      />

      {/* Vignette — gently darkens edges so titles always sit on
          a calm zone, regardless of blob position. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 90% at 50% 50%, transparent 45%, rgba(2,4,10,0.65) 100%)",
        }}
      />
    </div>
  );
}
