"use client";

import { useRef, type CSSProperties } from "react";
import { useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { ExpandingPanel } from "./expanding-panel";

const editorial = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

/**
 * Chapter 4, oryzo.ai expanding-window edition: the before/after grid
 * lives inside a centered panel that opens to full bleed as you scroll,
 * while the chapter title — monumental — sits behind it, readable in
 * the clipped margins. The narrative lines + punches follow as a calm
 * full-height coda once the window has fully opened.
 */
export function Chapter4OtherWorld() {
  const t = useTranslations("Manifeste.chapter04");
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-30%" });

  const lines = [t("line1"), t("line2"), t("line3")];
  const punches = [t("punch1"), t("punch2")];

  return (
    <section ref={sectionRef} id="chapter-4" className="relative">
      <ExpandingPanel
        backdrop={
          /* Giant ghost title behind the window — revealed in the
             margins, swallowed as the panel expands. */
          <div className="flex h-full flex-col items-center justify-center gap-6 px-4 text-center">
            <span
              className={`${mono.className} text-[10px] uppercase tracking-[0.35em] text-white/50 md:text-xs`}
            >
              Chapitre 04 / 07
            </span>
            <p
              className={`${editorial.className} text-[clamp(3rem,13vw,12rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.03em] text-white/15`}
            >
              {t("title")}
            </p>
          </div>
        }
      >
        {/* Inside the window — the digitized world, before/after. */}
        <div
          className="flex h-full flex-col justify-center px-6 py-10 md:px-16 lg:px-24"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(13,40,64,0.96) 0%, rgba(5,12,24,0.99) 60%), linear-gradient(180deg, #07101F 0%, #050B16 100%)",
          }}
        >
          <div className="mx-auto w-full max-w-5xl">
            <div className="grid gap-x-10 gap-y-4 md:grid-cols-12 md:gap-y-6">
              <div className="flex items-baseline gap-3 md:col-span-5">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                  {t("beforeTitle")}
                </span>
                <span className="inline-block h-px flex-1 bg-white/15" />
              </div>
              <div className="hidden md:col-span-2 md:block" />
              <div className="flex items-baseline gap-3 md:col-span-5">
                <span className="inline-block h-px flex-1 bg-[#4EA8F9]/40" />
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#4EA8F9]">
                  {t("afterTitle")}
                </span>
              </div>

              {[
                { before: t("before1"), after: t("after1") },
                { before: t("before2"), after: t("after2") },
                { before: t("before3"), after: t("after3") },
                { before: t("before4"), after: t("after4") },
              ].map((row, i) => (
                <div key={i} className="contents">
                  <p
                    style={{ animationDelay: `${0.3 + i * 0.15}s` } as CSSProperties}
                    className={`manifeste-citation ${inView ? "is-visible" : ""} ${editorial.className} text-base leading-snug text-white/35 line-through md:col-span-5 md:text-xl lg:text-2xl`}
                  >
                    {row.before}
                  </p>
                  <div
                    aria-hidden
                    className="hidden items-center justify-center md:col-span-2 md:flex"
                  >
                    <span className="inline-block h-px w-full bg-white/10" />
                  </div>
                  <p
                    style={{ animationDelay: `${0.45 + i * 0.15}s` } as CSSProperties}
                    className={`manifeste-citation ${inView ? "is-visible" : ""} ${editorial.className} text-base font-medium leading-snug text-white md:col-span-5 md:text-xl lg:text-2xl`}
                  >
                    {row.after}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ExpandingPanel>

      {/* Coda — calm full-height block once the window has opened. */}
      <div className="relative flex min-h-dvh flex-col items-center justify-center px-6 py-24 text-center md:px-16">
        <div className={`${editorial.className} max-w-3xl space-y-4 md:space-y-5`}>
          {lines.map((text, i) => (
            <p
              key={i}
              style={{ animationDelay: `${0.3 + i * 0.3}s` } as CSSProperties}
              className={`manifeste-citation ${inView ? "is-visible" : ""} text-xl leading-tight text-cyan-50/80 md:text-2xl lg:text-3xl`}
            >
              {text}
            </p>
          ))}
        </div>

        <div className={`${editorial.className} mt-14 space-y-3 md:mt-20`}>
          {punches.map((text, i) => (
            <p
              key={i}
              style={
                {
                  animationDelay: `${1.4 + i * 0.5}s`,
                  color: i === 1 ? "#4EA8F9" : "#FFFFFF",
                } as CSSProperties
              }
              className={`manifeste-citation ${inView ? "is-visible" : ""} text-4xl font-bold uppercase leading-[1.02] tracking-[-0.02em] md:text-6xl lg:text-7xl`}
            >
              {text}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
