"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { ChapterHeader } from "./chapter-header";

const display = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const ACCENT = "#4EA8F9";

/** One condition per screen: index, statement, concrete note. */
function ConditionBeat({
  index,
  condition,
  note,
}: {
  index: number;
  condition: string;
  note: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-35%" });

  return (
    <div
      ref={ref}
      className="mx-auto flex min-h-[80vh] w-full max-w-4xl flex-col justify-center px-6 md:px-12"
    >
      <p
        className={`${mono.className} text-[11px] uppercase tracking-[0.3em] transition-opacity duration-700 md:text-xs ${inView ? "opacity-100" : "opacity-0"}`}
        style={{ color: ACCENT }}
      >
        Condition 0{index} / 04
      </p>
      <p
        className={`${display.className} mt-5 text-3xl font-bold leading-[1.05] tracking-[-0.02em] text-white transition-all duration-1000 md:text-5xl ${inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
      >
        {condition}
      </p>
      <div
        className={`mt-8 max-w-xl border-l-2 pl-5 transition-all delay-500 duration-1000 ${inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
        style={{ borderColor: "rgba(78,168,249,0.35)" }}
      >
        <p
          className={`${mono.className} text-[10px] uppercase tracking-[0.25em] text-white/40`}
        >
          Concrètement
        </p>
        <p
          className={`${display.className} mt-2 text-base leading-snug text-white/70 md:text-lg`}
        >
          {note}
        </p>
      </div>
    </div>
  );
}

/**
 * Chapter 6 — the conditions, subtraction edition: header + intro,
 * then four numbered statements, one per screen. The reader leaves
 * knowing exactly what is asked of them — that's the whole UX.
 */
export function Chapter6Condition() {
  const t = useTranslations("Manifeste.chapter06");
  const headRef = useRef<HTMLDivElement>(null);
  const headIn = useInView(headRef, { once: true, margin: "-25%" });

  const conditions = [1, 2, 3, 4].map((i) => ({
    condition: t(`condition${i}`),
    note: t(`conditionNote${i}`),
  }));

  return (
    <section id="chapter-6" className="relative text-white">
      <div
        ref={headRef}
        className="flex min-h-[80vh] flex-col justify-center px-6 py-24 md:px-12 lg:px-16"
      >
        <ChapterHeader index={6} title={t("title")} />
        <p
          className={`${display.className} max-w-2xl text-2xl font-medium leading-tight tracking-[-0.01em] transition-all duration-1000 md:text-3xl ${headIn ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
        >
          {t("intro")}
        </p>
      </div>

      {conditions.map((c, i) => (
        <ConditionBeat key={i} index={i + 1} {...c} />
      ))}
    </section>
  );
}
