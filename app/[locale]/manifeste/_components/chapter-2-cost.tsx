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
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { ChapterHeader, gradientTextStyle } from "./chapter-header";
import { DecorativeScatter } from "./decorative-scatter";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const editorial = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
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
  annual,
  inView,
  delay,
  offsetClass = "",
}: {
  value: string;
  suffix: string;
  label: string;
  annual: string;
  inView: boolean;
  delay: number;
  offsetClass?: string;
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
      className={`grid grid-cols-1 items-baseline gap-3 border-t border-white/10 pt-6 md:grid-cols-12 md:gap-8 ${offsetClass}`}
    >
      <div
        className={`flex items-baseline ${mono.className} md:col-span-4`}
      >
        <span
          className="text-6xl font-semibold leading-none tracking-tighter md:text-7xl lg:text-8xl"
          style={gradientTextStyle(
            "linear-gradient(135deg, #FFE4E6 0%, #FDA4AF 45%, #FB7185 100%)",
          )}
        >
          <CountingNumber
            value={numericValue}
            inView={inView}
            delay={delay + 0.2}
          />
          {suffix && (
            <span className="text-4xl md:text-5xl lg:text-6xl">{suffix}</span>
          )}
        </span>
      </div>
      <p className="text-base leading-snug text-white/80 md:col-span-5 md:text-lg lg:text-xl">
        {label}
      </p>
      <div className={`flex flex-col gap-1 md:col-span-3 ${mono.className}`}>
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
          12 mois
        </span>
        <span className="text-teranga-secondary text-xl font-medium tracking-tight md:text-2xl">
          {annual}
        </span>
      </div>
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
      id="chapter-2"
      className="relative flex min-h-dvh flex-col justify-center overflow-hidden px-6 py-24 md:px-16 lg:px-24"
    >
      {/* Chapter-tinted halo : rose alarm for the silent cost. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 70% 30%, rgba(253,164,175,0.12) 0%, rgba(6,16,32,0.50) 55%, rgba(6,16,32,0.70) 100%)",
        }}
      />

      <DecorativeScatter
        items={[
          { content: "FCFA", top: "6%", right: "4%", rotate: -8, color: "rgba(252,211,77,0.4)", spaced: true },
          { content: "—", top: "12%", left: "4%", rotate: 20, size: "text-2xl", color: "rgba(253,164,175,0.3)", mono: false },
          { content: "rouge dans tes comptes", top: "92%", left: "4%", rotate: -3, color: "rgba(253,164,175,0.45)", size: "text-[10px]", spaced: true },
          { content: "✱", top: "92%", right: "6%", rotate: -4, size: "text-2xl", color: "rgba(252,211,77,0.35)", mono: false },
        ]}
      />

      <div className="relative z-10 flex flex-col gap-12 md:gap-16">
        <ChapterHeader index={2} title={t("title")} theme="rose" />

        {/* Intro line */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{
            delay: 0.2,
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={`${editorial.className} max-w-3xl text-2xl leading-tight text-white md:text-3xl lg:text-4xl`}
        >
          {t("intro")}
        </motion.p>

        {/* Stats — each row : big number + label + 12-month projection */}
        <div className="space-y-8 md:space-y-10">
          <div className="flex items-baseline justify-between">
            <p className={`${mono.className} text-[10px] uppercase tracking-[0.3em] text-white/50`}>
              {t("asideTitle")}
            </p>
            <span className="from-teranga-secondary/40 to-teranga-primary/40 inline-block h-px flex-1 mx-6 bg-gradient-to-r" />
            <p className={`${mono.className} text-[10px] uppercase tracking-[0.3em] text-white/40`}>
              03 cas observés
            </p>
          </div>
          <StatRow
            value={t("stat1Value")}
            suffix={t("stat1Suffix")}
            label={t("stat1Label")}
            annual={t("stat1Annual")}
            inView={inView}
            delay={0.5}
            offsetClass="md:-rotate-[0.5deg] md:translate-x-4"
          />
          <StatRow
            value={t("stat2Value")}
            suffix={t("stat2Suffix")}
            label={t("stat2Label")}
            annual={t("stat2Annual")}
            inView={inView}
            delay={1.0}
            offsetClass="md:rotate-[0.7deg] md:-translate-x-2 md:translate-y-2"
          />
          <StatRow
            value={t("stat3Value")}
            suffix={t("stat3Suffix")}
            label={t("stat3Label")}
            annual={t("stat3Annual")}
            inView={inView}
            delay={1.5}
            offsetClass="md:-rotate-[0.4deg] md:translate-x-6"
          />
          <p className={`${mono.className} pt-2 text-[10px] uppercase tracking-[0.25em] text-white/35`}>
            ✱ {t("asideFootnote")}
          </p>
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
          className={`${editorial.className} max-w-4xl text-3xl leading-[1.1] tracking-tight md:text-5xl lg:text-6xl`}
          style={gradientTextStyle(
            "linear-gradient(90deg, #FFE4E6 0%, #FDA4AF 50%, #FB7185 100%)",
          )}
        >
          {t("question")}
        </motion.p>
      </div>
    </section>
  );
}
