"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";

/**
 * Shared scroll source for the manifeste route.
 *
 * Why custom: drei's <ScrollControls> creates an internal scrollable
 * container and exposes scroll progress via <useScroll/>. That worked for
 * pure-3D pages but breaks the moment we need HTML chapters with their
 * own React context (next-intl, next/navigation) — `<Scroll html>`
 * portals across the R3F reconciler boundary and loses providers.
 *
 * Solution: use the native window scroll. Canvas is fixed in background,
 * chapters scroll the document normally, and R3F components read scroll
 * progress through this context (which mirrors drei's useScroll shape,
 * so camera-rig/ocean-plane/particle-flow only swap their import).
 */
export type ScrollHandle = {
  /** 0..1 normalized scroll position */
  offset: number;
  /**
   * Mirror of drei's useScroll().range — returns 0..1 ramp covering
   * [start, start+distance] of the global offset.
   */
  range: (start: number, distance: number) => number;
};

const ScrollContext = createContext<ScrollHandle | null>(null);

export function useManifesteScroll(): ScrollHandle {
  const handle = useContext(ScrollContext);
  if (!handle) {
    throw new Error(
      "useManifesteScroll must be used inside <ManifesteScrollProvider>",
    );
  }
  return handle;
}

export function ManifesteScrollProvider({ children }: { children: ReactNode }) {
  // Mutable ref keeps the latest offset without re-rendering. R3F
  // components read this through getters on the handle (below), which
  // means useFrame() picks up updates synchronously each frame without
  // triggering a re-render of the React tree.
  const offsetRef = useRef(0);

  const handle = useMemo<ScrollHandle>(
    () => ({
      get offset() {
        return offsetRef.current;
      },
      range(start, distance) {
        const v = (offsetRef.current - start) / distance;
        return v < 0 ? 0 : v > 1 ? 1 : v;
      },
    }),
    [],
  );

  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      offsetRef.current = max > 0 ? window.scrollY / max : 0;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <ScrollContext.Provider value={handle}>{children}</ScrollContext.Provider>
  );
}
