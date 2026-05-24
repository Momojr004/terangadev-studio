"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Plus_Jakarta_Sans } from "next/font/google";
import { gradientTextStyle } from "./chapter-header";

const display = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

/**
 * Full-screen opening of the manifesto — sits before Chapter 1 so the
 * reader gets a clear "this is a deliberate piece of writing, not a
 * sales page" signal before the typewriter section starts.
 *
 * Three lines reveal one after the other (framer-motion stagger), the
 * third line is the punch and gets the brand gradient treatment so
 * the eye lands on it.
 */
export function ManifesteIntro() {
  const t = useTranslations("Manifeste.intro");

  return (
    <section
      id="chapter-0"
      className="relative flex min-h-dvh items-center overflow-hidden px-6 py-16 md:px-16 md:py-20 lg:px-24"
    >
      {/* Soft cyan halo behind the headline — depth without weight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 35% 55%, rgba(78,168,249,0.10) 0%, rgba(6,16,32,0.55) 55%, rgba(6,16,32,0.75) 100%)",
        }}
      />

      {/* Decorative top-left mono mark */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-6 top-24 z-10 md:left-16 md:top-32"
      >
        <p className="text-teranga-secondary font-mono text-[10px] uppercase tracking-[0.35em] md:text-xs">
          {t("eyebrow")}
        </p>
      </motion.div>

      {/* Center stack */}
      <div className={`relative z-10 w-full max-w-5xl ${display.className}`}>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.4,
            duration: 1.0,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="text-4xl leading-[1.06] font-medium tracking-tight text-white md:text-6xl lg:text-7xl xl:text-[5.5rem]"
        >
          <span className="block">{t("hookLine1")}</span>
          <span className="block">{t("hookLine2")}</span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1.2 }}
            className="mt-2 block"
            style={gradientTextStyle(
              "linear-gradient(135deg, #CFFAFE 0%, #4EA8F9 50%, #0A68F7 100%)",
            )}
          >
            {t("hookLine3")}
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 2.0,
            duration: 0.9,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="text-muted mt-12 max-w-xl text-base leading-relaxed md:text-lg"
        >
          {t("subhead")}
        </motion.p>
      </div>

      {/* Scroll cue — bottom, pulses subtly */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.6, duration: 1.2 }}
        className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 md:bottom-14"
      >
        <p className="text-teranga-secondary/60 font-mono text-[10px] uppercase tracking-[0.35em]">
          {t("hint")}
        </p>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-teranga-secondary/60 text-sm"
        >
          ↓
        </motion.span>
      </motion.div>
    </section>
  );
}
