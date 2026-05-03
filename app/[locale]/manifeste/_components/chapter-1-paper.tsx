"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Special_Elite } from "next/font/google";

const typewriter = Special_Elite({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.55, delayChildren: 0.4 },
  },
};

const lineVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

const charVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.001 } },
};

function Line({ text }: { text: string }) {
  return (
    <motion.span variants={lineVariants} className="block">
      {text.split("").map((char, i) => (
        <motion.span key={i} variants={charVariants} className="inline-block">
          {char === " " ? " " : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

export function Chapter1Paper() {
  const t = useTranslations("Manifeste.chapter01");
  const tParent = useTranslations("Manifeste");

  const lines = [t("line1"), t("line2"), t("line3"), t("line4")];

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

      {/* Warm light from top-left like an old desk lamp */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 20% 0%, #d4a574 0%, transparent 60%)",
        }}
      />

      {/* Vignette to focus the eye */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Chapter label — aged amber, mono caps tight */}
      <div className="relative z-10 mb-16 md:mb-24">
        <p className="text-[10px] uppercase tracking-[0.4em] text-amber-700/70 md:text-xs">
          {t("label")}
        </p>
      </div>

      {/* Main copy — typewriter staggered reveal */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 max-w-5xl space-y-7 text-2xl leading-[1.15] tracking-tight md:space-y-9 md:text-4xl lg:text-5xl xl:text-6xl"
      >
        {lines.map((text, i) => (
          <Line key={i} text={text} />
        ))}
      </motion.div>

      {/* Continue indicator — fades in after typewriter completes */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 5.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 text-center md:bottom-14"
      >
        <p className="text-[9px] uppercase tracking-[0.4em] text-amber-700/50">
          {tParent("scrollHint")}
        </p>
        <motion.p
          animate={{ y: [0, 4, 0] }}
          transition={{
            delay: 5.2,
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
