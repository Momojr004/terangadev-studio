"use client";

import { motion } from "framer-motion";

/**
 * Chapter header, subtraction edition: one mono chip, one title in the
 * section's own text color. No gradients, no ghost numerals, no
 * per-chapter color identity — the color script (background) carries
 * the chapter mood, the type stays quiet and confident.
 */
export function ChapterHeader({
  index,
  title,
}: {
  /** 1..7 */
  index: number;
  title: string;
}) {
  const padded = String(index).padStart(2, "0");

  return (
    <motion.header
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-25% 0px -25% 0px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 mb-12 md:mb-16"
    >
      <span className="inline-flex items-center gap-2.5 rounded-full border border-current/20 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] opacity-70 md:text-[11px]">
        <span
          aria-hidden
          className="inline-block size-1.5 rounded-full bg-[#0A68F7]"
        />
        Chapitre {padded} / 07
      </span>
      <h2 className="font-display mt-6 max-w-[16ch] text-[clamp(2.4rem,6vw,5.2rem)] font-bold leading-[0.98] tracking-[-0.03em]">
        {title}
      </h2>
    </motion.header>
  );
}
