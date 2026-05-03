"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Special_Elite } from "next/font/google";

const typewriter = Special_Elite({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const CHAR_DELAY = 0.038;
const LINE_PAUSE = 0.6;
const INITIAL_DELAY = 0.5;

function Line({ text, baseDelay }: { text: string; baseDelay: number }) {
  return (
    <span className="block">
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="typewriter-char"
          style={{ animationDelay: `${baseDelay + i * CHAR_DELAY}s` }}
        >
          {char === " " ? " " : char}
        </span>
      ))}
    </span>
  );
}

export function Chapter1Paper() {
  const t = useTranslations("Manifeste.chapter01");
  const tParent = useTranslations("Manifeste");

  const lines = [t("line1"), t("line2"), t("line3"), t("line4")];

  // Total typewriter duration to time the continue indicator
  const totalChars = lines.reduce((sum, line) => sum + line.length, 0);
  const totalDuration =
    INITIAL_DELAY + lines.length * LINE_PAUSE + totalChars * CHAR_DELAY;

  return (
    <section
      className={`relative flex min-h-dvh flex-col justify-center overflow-hidden bg-[#1a1816] px-6 py-24 text-amber-50 md:px-16 lg:px-24 ${typewriter.className}`}
    >
      {/* Paper grain texture overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Warm desk lamp light from top-left */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 20% 0%, #d4a574 0%, transparent 60%)",
        }}
      />

      {/* Vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Chapter label */}
      <div className="relative z-10 mb-16 md:mb-24">
        <p className="text-[10px] uppercase tracking-[0.4em] text-amber-700/70 md:text-xs">
          {t("label")}
        </p>
      </div>

      {/* Main copy — pure CSS typewriter (deterministic per-char delay) */}
      <div className="relative z-10 max-w-5xl space-y-7 text-2xl leading-[1.18] tracking-tight md:space-y-9 md:text-4xl lg:text-5xl xl:text-6xl">
        {lines.map((text, lineIdx) => {
          const previousChars = lines
            .slice(0, lineIdx)
            .reduce((sum, line) => sum + line.length, 0);
          const baseDelay =
            INITIAL_DELAY +
            lineIdx * LINE_PAUSE +
            previousChars * CHAR_DELAY;
          return <Line key={lineIdx} text={text} baseDelay={baseDelay} />;
        })}
      </div>

      {/* Continue indicator — Framer Motion fine for single wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: totalDuration + 0.3,
          duration: 1.2,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 text-center md:bottom-14"
      >
        <p className="text-[9px] uppercase tracking-[0.4em] text-amber-700/50">
          {tParent("scrollHint")}
        </p>
        <motion.p
          animate={{ y: [0, 4, 0] }}
          transition={{
            delay: totalDuration + 0.5,
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mt-2 text-sm text-amber-700/50"
        >
          ↓
        </motion.p>
      </motion.div>
    </section>
  );
}
