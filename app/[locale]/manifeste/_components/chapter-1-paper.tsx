"use client";

import { useRef, type CSSProperties } from "react";
import { useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ChapterHeader } from "./chapter-header";

const display = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const INK = "#14110B";

/**
 * Chapter 1 — the paper world, two beats, one idea each:
 *
 *   beat 1   the four statements, large and quiet, left column —
 *            the open notebook (CahierLayer) owns the right half.
 *   beat 2   one number: 95%. Nothing competes with it.
 */
export function Chapter1Paper() {
  const t = useTranslations("Manifeste.chapter01");
  const beat1Ref = useRef<HTMLDivElement>(null);
  const beat2Ref = useRef<HTMLDivElement>(null);
  const beat1In = useInView(beat1Ref, { once: true, margin: "-25%" });
  const beat2In = useInView(beat2Ref, { once: true, margin: "-25%" });

  const lines = [t("line1"), t("line2"), t("line3"), t("line4")];

  return (
    <section id="chapter-1" className="relative" style={{ color: INK }}>
      {/* Beat 1 — the statements. Right half left empty on purpose:
          the notebook lives there. */}
      <div
        ref={beat1Ref}
        className="flex min-h-dvh flex-col justify-center px-6 py-24 md:px-12 lg:px-16"
      >
        <ChapterHeader index={1} title={t("title")} />
        <div
          className={`${display.className} max-w-xl space-y-5 md:space-y-6`}
        >
          {lines.map((text, i) => (
            <p
              key={i}
              style={{ animationDelay: `${0.2 + i * 0.35}s` } as CSSProperties}
              className={`manifeste-citation ${beat1In ? "is-visible" : ""} text-2xl font-medium leading-tight tracking-[-0.01em] md:text-3xl lg:text-4xl`}
            >
              {text}
            </p>
          ))}
        </div>
      </div>

      {/* Beat 2 — one number. */}
      <div
        ref={beat2Ref}
        className="flex min-h-[90vh] flex-col items-center justify-center px-6 py-24 text-center"
      >
        <p
          style={{ animationDelay: "0.1s" } as CSSProperties}
          className={`manifeste-citation ${beat2In ? "is-visible" : ""} ${display.className} text-[clamp(6rem,22vw,18rem)] font-bold leading-none tracking-[-0.04em]`}
        >
          {t("supportStat")}
        </p>
        <p
          style={{ animationDelay: "0.5s" } as CSSProperties}
          className={`manifeste-citation ${beat2In ? "is-visible" : ""} ${display.className} mt-6 max-w-md text-lg leading-snug text-black/70 md:text-xl`}
        >
          {t("supportLine")}
        </p>
        <p
          style={{ animationDelay: "0.8s" } as CSSProperties}
          className={`manifeste-citation ${beat2In ? "is-visible" : ""} mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-black/40`}
        >
          {t("supportSource")}
        </p>
      </div>
    </section>
  );
}
