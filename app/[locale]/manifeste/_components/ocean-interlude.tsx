"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/**
 * Transparent breathing section between two chapters. The chapter
 * backgrounds are fully opaque so the fixed ocean Canvas behind the
 * <main> only shows during these gaps. One viewport per interlude
 * is enough to let the wave displacement and particle drift register
 * before the next chapter slides in.
 *
 * A small mono cue (latin numeral pair) is centered and reveals on
 * view, mirroring the chapter labels typography so the transition
 * reads as part of the manifesto, not dead scroll.
 */
export function OceanInterlude({
  from,
  to,
}: {
  /** Chapter number we're leaving (e.g. "01") */
  from: string;
  /** Chapter number we're entering (e.g. "02") */
  to: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-30% 0px -30% 0px" });

  return (
    <section
      ref={ref}
      aria-hidden
      className="relative flex min-h-dvh items-center justify-center bg-transparent"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: inView ? 1 : 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-6 font-mono text-[10px] uppercase tracking-[0.4em] text-white/40"
      >
        <span>{from}</span>
        <span className="block h-px w-16 bg-white/30" />
        <span>{to}</span>
      </motion.div>
    </section>
  );
}
