"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Sync Lenis with GSAP on a SINGLE rAF loop.
 *
 * Without this, Lenis smooth-scrolls on its own rAF while every GSAP
 * ScrollTrigger reads `window.scrollY` on GSAP's separate ticker — the
 * scrubbed timelines (color script, cahier, horizontal pin…) then lag a
 * frame behind the real scroll position, which reads as jank. Driving
 * `lenis.raf` from the GSAP ticker and forwarding Lenis scroll events to
 * `ScrollTrigger.update` collapses everything onto one clock.
 */
function LenisGsapSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(onTick);
    };
  }, [lenis]);

  return null;
}

// Lenis runs on every route, /manifeste included. `autoRaf: false` lets the
// GSAP ticker drive Lenis so there is exactly one rAF loop on the page.
export function LenisProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
        autoRaf: false,
      }}
    >
      <LenisGsapSync />
      {children}
    </ReactLenis>
  );
}
