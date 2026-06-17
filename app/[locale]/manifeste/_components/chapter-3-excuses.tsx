"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { ChapterHeader } from "./chapter-header";

const display = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const RED = "#FB7185";
const ACCENT = "#4EA8F9";

/** One excuse per screen: said, struck through, answered. */
function ExcuseBeat({
  index,
  excuse,
  rebuttal,
  rebutTitle,
}: {
  index: number;
  excuse: string;
  rebuttal: string;
  rebutTitle: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-35%" });

  return (
    <div
      ref={ref}
      className={`flex min-h-[85vh] flex-col items-center justify-center px-6 text-center ${inView ? "is-visible" : ""}`}
    >
      <p
        className={`${mono.className} text-[10px] tracking-[0.3em] text-white/35 uppercase transition-opacity duration-700 ${inView ? "opacity-100" : "opacity-0"}`}
      >
        Excuse 0{index}
      </p>

      <p
        className={`${display.className} relative mt-6 max-w-3xl text-3xl leading-tight font-medium tracking-[-0.01em] text-white/90 italic transition-all duration-1000 md:text-5xl ${inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
      >
        « {excuse} »
        {/* The strike — draws once the excuse has been read. On phones the
            quote wraps to 3 lines, so a single centered bar would cut
            through a word's middle (reads as a typo). Underline it at the
            bottom on mobile; keep the centered strike on md+ where the
            quote is one or two lines. */}
        <span
          aria-hidden
          className="manifeste-strike-line absolute top-auto -bottom-1 left-0 h-[3px] w-full rounded-full md:top-1/2 md:bottom-auto"
          style={{ backgroundColor: RED }}
        />
      </p>

      <p
        className={`${mono.className} mt-12 text-[10px] tracking-[0.3em] uppercase transition-opacity delay-700 duration-700 ${inView ? "opacity-100" : "opacity-0"}`}
        style={{ color: ACCENT }}
      >
        {rebutTitle}
      </p>
      <p
        className={`${display.className} mt-4 max-w-xl text-lg leading-snug text-white/75 transition-all delay-700 duration-1000 md:text-xl ${inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
      >
        {rebuttal}
      </p>
    </div>
  );
}

/**
 * Chapter 3 — the excuses, one per screen. Each one is spoken, struck
 * through in red, and answered. No font circus, no scatter: the
 * sequence IS the design.
 */
export function Chapter3Excuses() {
  const t = useTranslations("Manifeste.chapter03");
  const headRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const endIn = useInView(endRef, { once: true, margin: "-30%" });

  const excuses = [1, 2, 3, 4].map((i) => ({
    excuse: t(`citation${i}`),
    rebuttal: t(`rebut${i}`),
  }));

  return (
    <section id="chapter-3" className="relative text-white">
      <div
        ref={headRef}
        className="flex min-h-[70vh] flex-col justify-center px-6 py-24 md:px-12 lg:px-16"
      >
        <ChapterHeader index={3} title={t("title")} />
      </div>

      {excuses.map((e, i) => (
        <ExcuseBeat
          key={i}
          index={i + 1}
          excuse={e.excuse}
          rebuttal={e.rebuttal}
          rebutTitle={t("rebutTitle")}
        />
      ))}

      {/* Punchline */}
      <div
        ref={endRef}
        className="flex min-h-[90vh] flex-col items-center justify-center px-6 text-center"
      >
        <p
          className={`${display.className} max-w-3xl text-3xl leading-[1.05] font-bold tracking-[-0.02em] text-white transition-all duration-1000 md:text-5xl lg:text-6xl ${endIn ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
        >
          {t("punchline")}
        </p>
        <p
          className={`${display.className} mt-4 max-w-3xl text-3xl leading-[1.05] font-bold tracking-[-0.02em] italic transition-all delay-300 duration-1000 md:text-5xl lg:text-6xl ${endIn ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
          style={{ color: RED }}
        >
          {t("punchline2")}
        </p>
      </div>
    </section>
  );
}
