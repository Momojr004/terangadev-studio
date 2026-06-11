"use client";

import { motion } from "framer-motion";
import type { CSSProperties } from "react";

/**
 * Unified prominent header for each chapter with per-chapter color
 * identity. Uses inline styles for the gradient text so Tailwind v4's
 * JIT compiler never has to guess at dynamic class names — every
 * rendered chapter gets a guaranteed colored title.
 */
type Theme = {
  numberColor: string;
  ruleGradient: string;
  labelColor: string;
  titleGradient: string;
};

const THEMES: Record<string, Theme> = {
  default: {
    numberColor: "rgba(255,255,255,0.15)",
    ruleGradient: "linear-gradient(to right, #4EA8F9, #0A68F7)",
    labelColor: "rgba(255,255,255,0.65)",
    titleGradient: "linear-gradient(135deg, #FFFFFF, #FFFFFF)",
  },
  amber: {
    numberColor: "rgba(252,211,77,0.18)",
    ruleGradient: "linear-gradient(to right, #FCD34D, #FBBF24)",
    labelColor: "rgba(252,211,77,0.85)",
    titleGradient: "linear-gradient(135deg, #FEF3C7 0%, #FCD34D 50%, #F59E0B 100%)",
  },
  rose: {
    numberColor: "rgba(253,164,175,0.18)",
    ruleGradient: "linear-gradient(to right, #FB7185, #FDA4AF)",
    labelColor: "rgba(253,164,175,0.85)",
    titleGradient: "linear-gradient(135deg, #FFE4E6 0%, #FDA4AF 50%, #FB7185 100%)",
  },
  magenta: {
    numberColor: "rgba(232,121,249,0.18)",
    ruleGradient: "linear-gradient(to right, #E879F9, #F472B6)",
    labelColor: "rgba(232,121,249,0.85)",
    titleGradient: "linear-gradient(135deg, #F5D0FE 0%, #E879F9 50%, #FB7185 100%)",
  },
  cyan: {
    numberColor: "rgba(125,211,192,0.18)",
    ruleGradient: "linear-gradient(to right, #67E8F9, #5EEAD4)",
    labelColor: "rgba(125,211,192,0.9)",
    titleGradient: "linear-gradient(135deg, #CFFAFE 0%, #67E8F9 50%, #5EEAD4 100%)",
  },
  teal: {
    numberColor: "rgba(94,234,212,0.18)",
    ruleGradient: "linear-gradient(to right, #5EEAD4, #6EE7B7)",
    labelColor: "rgba(94,234,212,0.9)",
    titleGradient: "linear-gradient(135deg, #CCFBF1 0%, #5EEAD4 50%, #6EE7B7 100%)",
  },
  brand: {
    numberColor: "rgba(78,168,249,0.20)",
    ruleGradient: "linear-gradient(to right, #4EA8F9, #0A68F7)",
    labelColor: "rgba(78,168,249,1)",
    titleGradient: "linear-gradient(135deg, #CFFAFE 0%, #4EA8F9 50%, #0A68F7 100%)",
  },
};

/** Inline style helper for gradient-clipped text. */
function gradientTextStyle(background: string): CSSProperties {
  return {
    backgroundImage: background,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    WebkitTextFillColor: "transparent",
  };
}

export function ChapterHeader({
  index,
  title,
  theme = "default",
}: {
  /** 1..7 */
  index: number;
  title: string;
  theme?: keyof typeof THEMES;
}) {
  const padded = String(index).padStart(2, "0");
  const t = THEMES[theme] ?? THEMES.default;

  return (
    <motion.header
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-25% 0px -25% 0px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 mb-12 flex flex-col gap-4 md:mb-16"
    >
      <div className="flex items-baseline gap-5">
        <span
          className="font-display text-[7rem] font-medium leading-none tracking-tight md:text-[10rem] lg:text-[12rem]"
          style={{ color: t.numberColor }}
        >
          {padded}
        </span>
        <span
          aria-hidden
          className="inline-block h-px w-12 md:w-20"
          style={{ backgroundImage: t.ruleGradient }}
        />
        <span
          className="font-mono text-[10px] uppercase tracking-[0.35em] md:text-xs"
          style={{ color: t.labelColor }}
        >
          Chapitre {padded} / 07
        </span>
      </div>
      <h2
        className="font-display max-w-3xl text-3xl leading-[1.1] font-medium tracking-tight md:text-4xl lg:text-5xl"
        style={gradientTextStyle(t.titleGradient)}
      >
        {title}
      </h2>
    </motion.header>
  );
}

export { gradientTextStyle };
