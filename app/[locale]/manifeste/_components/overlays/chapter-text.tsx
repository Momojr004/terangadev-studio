"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

/**
 * Chapter scroll windows — each tuple is
 *   [fadeInStart, holdStart, fadeOutStart, fadeOutEnd]
 *
 * Within each window the local timeline progress is :
 *   t < fadeInStart           → progress 0    (hidden)
 *   fadeInStart → holdStart   → progress 0    → 0.5  (chars stagger in)
 *   holdStart   → fadeOutStart→ progress 0.5  (held visible)
 *   fadeOutStart→ fadeOutEnd  → progress 0.5  → 1    (block fades out)
 *   t > fadeOutEnd            → progress 1    (hidden)
 *
 * Tuned for narrative pacing : Ch4 (la traversée) gets the longest hold
 * because "l'eau devient code" lands the brand metaphor; Ch7 (le nœud)
 * holds longest of all so the TerangaDev mark has time to settle.
 */
const CHAPTER_WINDOWS: Array<[number, number, number, number]> = [
  [0.02, 0.07, 0.12, 0.15], // Ch1 — L'horizon
  [0.16, 0.21, 0.27, 0.3], // Ch2 — La houle
  [0.31, 0.36, 0.4, 0.43], // Ch3 — La transformation
  [0.45, 0.5, 0.58, 0.62], // Ch4 — La traversée  (longest hold during dive)
  [0.63, 0.68, 0.72, 0.75], // Ch5 — La structure
  [0.76, 0.81, 0.86, 0.9], // Ch6 — Le réseau
  [0.91, 0.95, 0.985, 1.0], // Ch7 — Le nœud central  (held to scroll end)
];

/**
 * Tiny SplitText replacement — wraps each character of `text` in a
 * <span class="char">, preserves spaces as non-breaking, preserves
 * newlines as block-level <br/>. ~15 lines, no GSAP Club required.
 */
function splitChars(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let charKey = 0;
  const lines = text.split("\n");
  lines.forEach((line, lineIdx) => {
    const trimmed = line.trim();
    Array.from(trimmed).forEach((ch) => {
      nodes.push(
        <span
          key={charKey++}
          className="char inline-block"
          style={{ whiteSpace: "pre" }}
        >
          {ch === " " ? " " : ch}
        </span>,
      );
    });
    if (lineIdx < lines.length - 1) {
      nodes.push(<br key={`br-${lineIdx}`} />);
    }
  });
  return nodes;
}

interface ChapterTextProps {
  text: string;
  chapterIndex: number;
  /** Optional eyebrow — small label rendered above the main text. */
  eyebrow?: string;
}

export function ChapterText({ text, chapterIndex, eyebrow }: ChapterTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const scroll = useScroll();

  const window_ = CHAPTER_WINDOWS[chapterIndex];
  const splitNodes = useMemo(() => splitChars(text), [text]);
  const eyebrowNodes = useMemo(
    () => (eyebrow ? splitChars(eyebrow) : null),
    [eyebrow],
  );

  // Build the per-char timeline once. Two phases packed into a single
  // [0,1] timeline so we can drive it linearly from local window
  // progress without branching every frame :
  //   timeline 0 → 0.5  : chars stagger in (opacity, y, rotateX)
  //   timeline 0.5 → 1  : block-level fade out (whole text dims as one)
  useGSAP(
    () => {
      if (!containerRef.current || !blockRef.current) return;
      const chars = containerRef.current.querySelectorAll<HTMLElement>(".char");

      // Set initial state explicitly so first paint never shows the
      // un-animated chars in their final position.
      gsap.set(chars, { opacity: 0, y: 20, rotateX: -20 });
      gsap.set(blockRef.current, { opacity: 1 });

      const tl = gsap.timeline({ paused: true });

      // Phase A : in (timeline 0 → 0.5). Total intrinsic length = 1
      // unit so we then re-time it down to 0.5 via timeScale at the
      // wrapping label level. Simpler : build it directly on a 0.5s
      // base since we're driving by progress not realtime.
      tl.to(
        chars,
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.4,
          ease: "power3.out",
          stagger: 0.018,
        },
        0,
      );

      // Phase B : out (timeline 0.5 → 1). Block-level fade — the
      // staggered exit felt fussy in testing; a clean group dim
      // matches the calmer narrative beats between chapters.
      tl.to(
        blockRef.current,
        {
          opacity: 0,
          y: -12,
          duration: 0.4,
          ease: "power2.in",
        },
        0.6,
      );

      tl.totalDuration(1); // normalize so progress(p) maps 1:1 to local window progress
      tlRef.current = tl;
    },
    { scope: containerRef },
  );

  // Drive timeline progress from scroll.offset every frame.
  useFrame(() => {
    const tl = tlRef.current;
    if (!tl) return;

    const t = scroll.offset;
    const [inStart, holdStart, outStart, outEnd] = window_;

    let p: number;
    if (t <= inStart) p = 0;
    else if (t < holdStart) {
      // map [inStart, holdStart] → [0, 0.5]
      p = ((t - inStart) / (holdStart - inStart)) * 0.5;
    } else if (t < outStart) {
      p = 0.5; // hold
    } else if (t < outEnd) {
      // map [outStart, outEnd] → [0.5, 1]
      p = 0.5 + ((t - outStart) / (outEnd - outStart)) * 0.5;
    } else p = 1;

    tl.progress(p);
  });

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-20 flex items-start justify-center"
      style={{
        // Push down 30% from top so we don't fight the central WebGL
        // focal points (logo, network nodes, ocean horizon).
        paddingTop: "30vh",
        // 3D context for rotateX char animation
        perspective: "800px",
      }}
      aria-hidden="true"
    >
      <div ref={blockRef} className="flex max-w-4xl flex-col items-center px-6">
        {eyebrowNodes && (
          <div
            className="mb-4 font-mono text-[10px] uppercase tracking-[0.4em] text-cyan-200/60"
            style={{ textShadow: "0 1px 8px rgba(10, 22, 40, 0.6)" }}
          >
            {eyebrowNodes}
          </div>
        )}
        <div
          className="font-display text-center font-light text-[#F5F5F0]"
          style={{
            fontSize: "clamp(2.5rem, 5vw, 5rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            // Soft drop shadow for legibility over the variable WebGL
            // backdrop. Two layers : tight dark for contrast on lit
            // areas, wider blur for a halo on dark areas (Ch4 dive).
            textShadow:
              "0 1px 2px rgba(10, 22, 40, 0.7), 0 4px 24px rgba(10, 22, 40, 0.5)",
          }}
        >
          {splitNodes}
        </div>
      </div>
    </div>
  );
}
