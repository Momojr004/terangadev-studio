"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "./parallax";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * The oryzo.ai expanding-window moment: a 240vh wrapper whose inner
 * viewport sticks, while a clipped panel opens from a centered card to
 * full bleed, scrubbed by scroll. `backdrop` renders BEHIND the panel —
 * visible in the clipped margins at first, progressively covered as the
 * window expands (oryzo puts its giant "it's wearable" line there).
 *
 * The panel content counter-zooms (1.12 → 1) so the opening reads as a
 * camera pull-back, not a mask trick. Sticky + clip-path keeps layout
 * stable (no ScrollTrigger pin-spacer, no re-parenting — Lenis-safe).
 *
 * Under prefers-reduced-motion no clip is ever applied: the panel just
 * renders full-bleed.
 */
export function ExpandingPanel({
  backdrop,
  children,
  className,
}: {
  backdrop?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const outer = outerRef.current;
      const panel = panelRef.current;
      const inner = innerRef.current;
      if (!outer || !panel || !inner) return;

      const scrub = {
        trigger: outer,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        invalidateOnRefresh: true,
      } as const;

      gsap.fromTo(
        panel,
        { clipPath: "inset(16% 24% 16% 24% round 28px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 0px)",
          ease: "none",
          scrollTrigger: scrub,
        },
      );
      gsap.fromTo(
        inner,
        { scale: 1.12 },
        { scale: 1, ease: "none", scrollTrigger: scrub },
      );
    },
    { scope: outerRef },
  );

  return (
    <div ref={outerRef} className={`relative h-[240vh] ${className ?? ""}`}>
      <div className="sticky top-0 h-dvh overflow-hidden">
        {backdrop ? (
          <div aria-hidden className="absolute inset-0">
            {backdrop}
          </div>
        ) : null}
        <div ref={panelRef} className="relative h-full w-full">
          <div ref={innerRef} className="h-full w-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
