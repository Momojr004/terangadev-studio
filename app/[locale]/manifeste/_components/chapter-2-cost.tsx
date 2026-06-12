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
import { ChapterHeader } from "./chapter-header";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const display = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
  display: "swap",
});

// The cost bleeds — the one allowed accent in this chapter.
const RED = "#FB7185";

function CountingNumber({
  value,
  inView,
  duration = 1.6,
}: {
  value: number;
  inView: boolean;
  duration?: number;
}) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) =>
    Math.round(latest).toString(),
  );

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionValue, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [inView, value, duration, motionValue]);

  return <motion.span>{rounded}</motion.span>;
}

/** One stat, one screen. Number, sentence, projection — nothing else. */
function StatBeat({
  value,
  suffix,
  label,
  annual,
}: {
  value: string;
  suffix: string;
  label: string;
  annual: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30%" });
  const numericValue = parseInt(value, 10);

  return (
    <div
      ref={ref}
      className="flex min-h-[90vh] flex-col items-center justify-center px-6 text-center"
    >
      <p
        className={`${display.className} text-[clamp(5rem,18vw,15rem)] font-bold leading-none tracking-[-0.04em] text-white`}
      >
        <CountingNumber value={numericValue} inView={inView} />
        <span className="text-[0.45em] font-medium">{suffix}</span>
      </p>
      <p
        className={`${display.className} mt-6 max-w-md text-lg leading-snug text-white/70 transition-opacity duration-700 md:text-xl ${inView ? "opacity-100" : "opacity-0"}`}
      >
        {label}
      </p>
      <p
        className={`${mono.className} mt-5 text-[11px] uppercase tracking-[0.25em] transition-opacity delay-300 duration-700 md:text-xs ${inView ? "opacity-100" : "opacity-0"}`}
        style={{ color: RED }}
      >
        12 mois — {annual}
      </p>
    </div>
  );
}

/**
 * Chapter 2 — the invisible cost, five beats, one idea each:
 * header + intro, then each number alone on its own screen, then the
 * question. The dark-wine background (color script) does the talking.
 */
export function Chapter2Cost() {
  const t = useTranslations("Manifeste.chapter02");
  const headRef = useRef<HTMLDivElement>(null);
  const headIn = useInView(headRef, { once: true, margin: "-25%" });
  const endRef = useRef<HTMLDivElement>(null);
  const endIn = useInView(endRef, { once: true, margin: "-30%" });

  const stats = [1, 2, 3].map((i) => ({
    value: t(`stat${i}Value`),
    suffix: t(`stat${i}Suffix`),
    label: t(`stat${i}Label`),
    annual: t(`stat${i}Annual`),
  }));

  return (
    <section id="chapter-2" className="relative text-white">
      {/* Beat 1 — header + the sentence that frames the chapter */}
      <div
        ref={headRef}
        className="flex min-h-dvh flex-col justify-center px-6 py-24 md:px-12 lg:px-16"
      >
        <ChapterHeader index={2} title={t("title")} />
        <p
          className={`${display.className} max-w-2xl text-2xl font-medium leading-tight tracking-[-0.01em] transition-all duration-1000 md:text-3xl lg:text-4xl ${headIn ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
        >
          {t("intro")}
        </p>
      </div>

      {/* Beats 2–4 — one number per screen */}
      {stats.map((s, i) => (
        <StatBeat key={i} {...s} />
      ))}

      {/* Beat 5 — the question */}
      <div
        ref={endRef}
        className="flex min-h-[90vh] flex-col items-center justify-center px-6 text-center"
      >
        <p
          className={`${display.className} max-w-3xl text-3xl font-bold leading-[1.05] tracking-[-0.02em] text-white transition-all duration-1000 md:text-5xl lg:text-6xl ${endIn ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
        >
          {t("question")}
        </p>
        <p
          className={`${mono.className} mt-8 text-[10px] uppercase tracking-[0.3em] text-white/40 transition-opacity delay-500 duration-700 ${endIn ? "opacity-100" : "opacity-0"}`}
        >
          ✱ {t("asideFootnote")}
        </p>
      </div>
    </section>
  );
}
