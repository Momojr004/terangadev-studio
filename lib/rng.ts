/**
 * Deterministic seeded pseudo-random generator (mulberry32).
 *
 * Purpose : replace `Math.random()` in render-time / module-scope code that
 * lays out decorative geometry (R3F particle fields, converging dots…).
 *
 * Two wins over `Math.random()` :
 *  1. **Purity** — uses only arithmetic, so it is a pure function. React 19's
 *     `react-hooks/purity` lint no longer flags the call site (unlike the
 *     impure `Math.random` global).
 *  2. **SSR stability** — given a fixed seed, server and client produce the
 *     exact same sequence, so any positions baked into SSR'd DOM (inline
 *     styles, etc.) hydrate without a mismatch.
 *
 * @param seed 32-bit integer seed.
 * @returns a function yielding floats in [0, 1).
 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function next(): number {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
