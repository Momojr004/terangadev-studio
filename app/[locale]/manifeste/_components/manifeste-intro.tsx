"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "./parallax";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const display = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "700", "800"],
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const EASE = [0.16, 1, 0.3, 1] as const;
const INK = "#14110B";

/**
 * Acte I, scene 1 — cream paper world. Ink typography, oryzo.ai
 * grammar: corner mono labels, one monumental display line ("LE
 * CAHIER."), the CSS-3D notebook floating center stage (CahierLayer,
 * fixed behind this section's text). The old hook copy becomes the
 * small setup block above the title.
 *
 * Exit: each [data-hero-layer] is scrubbed away at its own speed —
 * the composition separates into depth planes as the reader scrolls.
 */
export function ManifesteIntro() {
  const t = useTranslations("Manifeste.intro");
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const section = sectionRef.current;
      if (!section) return;

      gsap.utils
        .toArray<HTMLElement>("[data-hero-layer]")
        .forEach((layer, i) => {
          gsap.to(layer, {
            y: () => -window.innerHeight * (0.12 + i * 0.1),
            opacity: 0,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="chapter-0"
      className="relative flex min-h-dvh flex-col justify-between overflow-hidden px-6 pb-24 pt-28 md:px-12 md:pb-28 md:pt-32 lg:px-16"
      style={{ color: INK }}
    >
      {/* Top row — eyebrow chip left, index right */}
      <div
        data-hero-layer
        className="relative z-10 flex items-start justify-between"
      >
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className={`${mono.className} inline-flex items-center gap-2.5 rounded-full border border-black/20 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-black/70 md:text-[11px]`}
        >
          <span className="bg-teranga-primary inline-block size-1.5 rounded-full" />
          {t("eyebrow")}
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.8, ease: EASE }}
          className={`${mono.className} hidden text-[10px] uppercase tracking-[0.3em] text-black/40 md:block`}
        >
          07 — 2026
        </motion.span>
      </div>

      {/* Setup block — the original hook, small and quiet */}
      <div data-hero-layer className="relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9, ease: EASE }}
          className={`${display.className} max-w-xs text-base leading-relaxed text-black/60 md:max-w-sm md:text-lg`}
        >
          {t("hookLine1")} {t("hookLine2")}{" "}
          <span className="font-medium text-black/90">{t("hookLine3")}</span>
        </motion.p>
      </div>

      {/* Monument — the object, named */}
      <div className={`relative z-10 ${display.className}`}>
        <div data-hero-layer>
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 1.2, ease: EASE }}
            className="text-balance text-[clamp(3.4rem,14vw,12.5rem)] font-extrabold uppercase leading-[0.88] tracking-[-0.035em]"
          >
            {t("title").replace(/\.$/, "")}
            <span className="text-[#0A68F7]">.</span>
          </motion.h1>
        </div>

        {/* Bottom row — corner label + subhead */}
        <div
          data-hero-layer
          className="mt-8 flex items-end justify-between gap-8 md:mt-10"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.9, duration: 1 }}
            className={`${mono.className} hidden text-[10px] uppercase tracking-[0.3em] text-black/35 md:block`}
          >
            Dakar · Sénégal
          </motion.span>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 0.9, ease: EASE }}
            className="max-w-xs text-right text-sm leading-relaxed text-black/65 md:text-base"
          >
            {t("subhead")}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
