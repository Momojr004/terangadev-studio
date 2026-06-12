"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "./parallax";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * The manifesto's color script — the oryzo.ai "every scene is its own
 * world" engine. One fixed background layer whose color tweens as each
 * scene crosses the center of the viewport:
 *
 *   hero / ch.1   cream, warm paper       (Acte I — le monde de papier)
 *   ch.2          dark wine               (le coût saigne)
 *   ch.3          bruised violet          (les excuses, la nuit tombe)
 *   bascule/ch.4+ near-black → deep navy  (Acte II/III — le numérique)
 *   ch.7          cream again             (la boucle se ferme)
 *
 * It also drives two satellites through the same triggers:
 *  - `--manifeste-dark` (0..1) on <html>, consumed by the film overlay
 *    (vignette only exists in the dark acts);
 *  - the WebGL canvas opacity (the particle scene belongs to the dark
 *    world; it fades in at the bascule and back out before the finale).
 */
const SCENES: Array<{ id: string; bg: string; dark: number; canvas: number }> =
  [
    { id: "chapter-0", bg: "#F2EBDD", dark: 0, canvas: 0 },
    { id: "chapter-1", bg: "#EFE3C9", dark: 0, canvas: 0 },
    { id: "chapter-2", bg: "#220A10", dark: 1, canvas: 0 },
    { id: "chapter-3", bg: "#170B1D", dark: 1, canvas: 0 },
    { id: "manifeste-slide", bg: "#04070D", dark: 1, canvas: 1 },
    { id: "chapter-4", bg: "#071021", dark: 1, canvas: 1 },
    { id: "chapter-5", bg: "#06141F", dark: 1, canvas: 1 },
    { id: "chapter-6", bg: "#0B0F20", dark: 1, canvas: 1 },
    { id: "chapter-7", bg: "#F2EBDD", dark: 0, canvas: 0 },
  ];

export function ColorScript() {
  const bgRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const bg = bgRef.current;
    if (!bg) return;
    const instant = prefersReducedMotion();
    document.documentElement.style.setProperty("--manifeste-dark", "0");

    for (const scene of SCENES) {
      const trigger = document.getElementById(scene.id);
      if (!trigger) continue;
      // The 70% line: a scene takes over while its predecessor is still
      // on screen, so text never sits on the wrong world's color.
      ScrollTrigger.create({
        trigger,
        start: "top 70%",
        end: "bottom 70%",
        onToggle: (self) => {
          if (!self.isActive) return;
          const duration = instant ? 0 : 1.2;
          gsap.to(bg, {
            backgroundColor: scene.bg,
            duration,
            ease: "power2.inOut",
            overwrite: "auto",
          });
          gsap.to(document.documentElement, {
            "--manifeste-dark": scene.dark,
            duration,
            ease: "power2.inOut",
            overwrite: "auto",
          });
          const canvasWrap = document.getElementById("manifeste-canvas-wrap");
          if (canvasWrap) {
            gsap.to(canvasWrap, {
              opacity: scene.canvas,
              duration: instant ? 0 : 1.6,
              ease: "power2.inOut",
              overwrite: "auto",
            });
          }
        },
      });
    }
  });

  return (
    <div
      ref={bgRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{ backgroundColor: "#F2EBDD" }}
    />
  );
}

/**
 * Film finishing pass — grain everywhere, vignette only when the world
 * is dark (driven by --manifeste-dark). Mounted AFTER the canvas so it
 * grades the 3D scene too.
 */
export function FilmOverlay() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.7 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "200px 200px",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          opacity: "calc(var(--manifeste-dark, 0) * 1)",
          background:
            "radial-gradient(ellipse 120% 90% at 50% 50%, transparent 45%, rgba(2,4,10,0.6) 100%)",
        }}
      />
    </div>
  );
}
