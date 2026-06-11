"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Client-only hooks built on `useSyncExternalStore`.
 *
 * Why not `useState(false)` + `useEffect(() => setState(true))` ?
 * React 19's `react-hooks/set-state-in-effect` lint flags synchronous
 * setState inside an effect (it can trigger cascading renders). These
 * hooks read the same browser-only state without that pattern : the store
 * exposes a server snapshot (used during SSR / hydration) and a live client
 * snapshot, so render output is correct on both sides with no extra render.
 */

const noopSubscribe = () => () => {};

/** `false` during SSR and the hydration pass, `true` once on the client. */
export function useMounted(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true, // client snapshot
    () => false, // server snapshot
  );
}

/**
 * Reactive CSS media-query match. Returns `false` on the server, then the
 * live `matches` value on the client, updating when the query flips.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (typeof window === "undefined" || !window.matchMedia) {
        return () => {};
      }
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onStoreChange);
      return () => mql.removeEventListener("change", onStoreChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches, // client snapshot
    () => false, // server snapshot
  );
}
