"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useTranslations } from "next-intl";
import { JetBrains_Mono, Newsreader } from "next/font/google";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const editorial = Newsreader({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  display: "swap",
});

function CountingNumber({
  value,
  inView,
  delay = 0,
  duration = 1.4,
}: {
  value: number;
  inView: boolean;
  delay?: number;
  duration?: number;
}) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) =>
    Math.round(latest).toString(),
  );

  useEffect(() => {
    if (!inView) return;
    const t = window.setTimeout(() => {
      const controls = animate(motionValue, value, {
        duration,
        ease: [0.16, 1, 0.3, 1],
      });
      return () => controls.stop();
    }, delay * 1000);
    return () => window.clearTimeout(t);
  }, [inView, value, delay, duration, motionValue]);

  return <motion.span>{rounded}</motion.span>;
}

function StatRow({
  value,
  suffix,
  label,
  inView,
  delay,
}: {
  value: string;
  suffix: string;
  label: string;
  inView: boolean;
  delay: number;
}) {
  const numericValue = parseInt(value, 10);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        delay,
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="flex flex-col items-baseline gap-2 md:flex-row md:gap-8 lg:gap-12"
    >
      <div
        className={`flex items-baseline ${mono.className} text-stone-900`}
      >
        <span className="text-7xl font-semibold leading-none tracking-tighter md:text-8xl lg:text-[10rem]">
          <CountingNumber
            value={numericValue}
            inView={inView}
            delay={delay + 0.2}
          />
          {suffix && (
            <span className="text-5xl md:text-6xl lg:text-7xl">{suffix}</span>
          )}
        </span>
      </div>
      <p className="max-w-md text-base leading-snug text-stone-700 md:text-lg lg:text-xl">
        {label}
      </p>
    </motion.div>
  );
}

export function Chapter2Cost() {
  const t = useTranslations("Manifeste.chapter02");
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-200px" });

  return (
    <section
      ref={ref}
      className="relative flex min-h-dvh flex-col justify-center overflow-hidden bg-[#d4c5a8] px-6 py-24 md:px-16 lg:px-24"
    >
      {/* Subtle paper grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Inkblot blooms in corners — like coffee stains on a ledger */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-12 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{
          background: "radial-gradient(circle, #5a3a1a 0%, transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-12 h-96 w-96 rounded-full opacity-15 blur-3xl"
        style={{
          background: "radial-gradient(circle, #8b1a1a 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 flex flex-col gap-16 md:gap-24">
        {/* Chapter label */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`${mono.className} text-[10px] uppercase tracking-[0.4em] text-stone-700/80 md:text-xs`}
        >
          {t("label")}
        </motion.p>

        {/* Intro line */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{
            delay: 0.2,
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={`${editorial.className} max-w-3xl text-2xl leading-tight text-stone-900 md:text-3xl lg:text-4xl`}
        >
          {t("intro")}
        </motion.p>

        {/* Stats */}
        <div className="space-y-10 md:space-y-14">
          <StatRow
            value={t("stat1Value")}
            suffix={t("stat1Suffix")}
            label={t("stat1Label")}
            inView={inView}
            delay={0.5}
          />
          <StatRow
            value={t("stat2Value")}
            suffix={t("stat2Suffix")}
            label={t("stat2Label")}
            inView={inView}
            delay={1.0}
          />
          <StatRow
            value={t("stat3Value")}
            suffix={t("stat3Suffix")}
            label={t("stat3Label")}
            inView={inView}
            delay={1.5}
          />
        </div>

        {/* Question — serif punch */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{
            delay: 2.4,
            duration: 0.9,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={`${editorial.className} max-w-4xl text-3xl leading-[1.1] tracking-tight text-stone-900 md:text-5xl lg:text-6xl`}
        >
          {t("question")}
        </motion.p>
      </div>
    </section>
  );
}
