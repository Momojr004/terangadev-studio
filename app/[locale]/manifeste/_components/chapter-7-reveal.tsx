"use client";

import { useRef, type CSSProperties } from "react";
import { useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { useRouter } from "@/i18n/navigation";

const editorial = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

// Magazine cream + ink — the oryzo.ai light flip after six dark chapters.
const CREAM = "#F2EBDD";
const INK = "#14110B";

/**
 * Chapter 7, light-flip edition: the page that has been deep navy for
 * six chapters turns cream — paper again, but on OUR terms this time.
 * Magazine layout: mono chip, monumental ink wordmark, editorial
 * stat cards in a ruled grid, one heavy ink CTA.
 */
export function Chapter7Reveal() {
  const t = useTranslations("Manifeste.chapter07");
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-200px" });
  const router = useRouter();

  function handleCta() {
    document.cookie =
      "terangadev_seen_intro=1; path=/; max-age=31536000; SameSite=Lax";
    router.push("/");
  }

  const transitions = [t("transition1"), t("transition2"), t("transition3")];

  const stats = [
    { value: t("finalStat1"), label: t("finalStat1Label") },
    { value: t("finalStat2"), label: t("finalStat2Label") },
    { value: t("finalStat3"), label: t("finalStat3Label") },
    { value: t("finalStat4"), label: t("finalStat4Label") },
  ];

  return (
    <section
      ref={ref}
      id="chapter-7"
      className="relative overflow-hidden"
      style={{ backgroundColor: CREAM, color: INK }}
    >
      {/* Soft paper grain so the cream doesn't read flat-digital. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.1  0 0 0 0 0.08  0 0 0 0 0.05  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "200px 200px",
        }}
      />

      <div className="relative mx-auto flex min-h-dvh max-w-6xl flex-col px-6 py-24 md:px-12 md:py-28">
        {/* Top rule + chip */}
        <div
          style={{ animationDelay: "0.2s" } as CSSProperties}
          className={`manifeste-citation ${inView ? "is-visible" : ""} flex items-center justify-between border-b pb-6`}
        >
          <span
            className={`${mono.className} inline-flex items-center gap-2.5 rounded-full border border-black/20 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-black/70 md:text-[11px]`}
          >
            <span className="bg-teranga-primary inline-block size-1.5 rounded-full" />
            Chapitre 07 / 07 — {t("title")}
          </span>
          <span
            className={`${mono.className} hidden text-[10px] uppercase tracking-[0.3em] text-black/40 md:block`}
          >
            Point E · Dakar — depuis 2024
          </span>
        </div>

        {/* Wordmark — monumental ink, brand-blue accent */}
        <div className="flex flex-1 flex-col justify-center py-16 md:py-20">
          <p
            style={{ animationDelay: "0.5s" } as CSSProperties}
            className={`manifeste-citation ${inView ? "is-visible" : ""} ${mono.className} text-[10px] uppercase tracking-[0.35em] text-black/50 md:text-xs`}
          >
            {t("ctaSub")}
          </p>
          <h2
            style={{ animationDelay: "0.7s" } as CSSProperties}
            className={`manifeste-citation ${inView ? "is-visible" : ""} ${editorial.className} mt-6 text-[clamp(3.2rem,12vw,11rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.035em]`}
          >
            {t("wordmark")}
            <span className="block text-[#0A68F7]">{t("tagline")}</span>
          </h2>

          <p
            style={{ animationDelay: "1.1s" } as CSSProperties}
            className={`manifeste-citation ${inView ? "is-visible" : ""} ${editorial.className} mt-10 max-w-2xl text-xl leading-snug text-black/80 md:text-2xl lg:text-3xl`}
          >
            {t("promise")}
          </p>

          {/* Transitions — small editorial column */}
          <div className="mt-10 max-w-md space-y-2 border-l-2 border-black/15 pl-5">
            {transitions.map((text, i) => (
              <p
                key={i}
                style={{ animationDelay: `${1.4 + i * 0.25}s` } as CSSProperties}
                className={`manifeste-citation ${inView ? "is-visible" : ""} ${editorial.className} text-base italic text-black/60 md:text-lg`}
              >
                {text}
              </p>
            ))}
          </div>
        </div>

        {/* Stat cards — ruled magazine grid */}
        <div
          style={{ animationDelay: "2.2s" } as CSSProperties}
          className={`manifeste-citation ${inView ? "is-visible" : ""} grid grid-cols-2 border-y border-black/15 md:grid-cols-4`}
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`flex flex-col gap-3 px-5 py-8 md:px-7 md:py-10 ${i > 0 ? "border-l border-black/10" : ""} ${i >= 2 ? "max-md:border-t max-md:border-black/10" : ""} ${i === 2 ? "max-md:border-l-0" : ""}`}
            >
              <span
                className={`${editorial.className} text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl`}
              >
                {stat.value}
              </span>
              <span
                className={`${mono.className} text-[10px] uppercase tracking-[0.25em] text-black/50`}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Closing line — the loop closes: paper was never the enemy */}
        <p
          style={{ animationDelay: "2.5s" } as CSSProperties}
          className={`manifeste-citation ${inView ? "is-visible" : ""} ${editorial.className} mt-14 max-w-3xl text-2xl font-semibold italic leading-snug text-black/85 md:mt-16 md:text-3xl lg:text-4xl`}
        >
          {t("closing")}
        </p>

        {/* CTA — heavy ink pill */}
        <div
          style={{ animationDelay: "2.8s" } as CSSProperties}
          className={`manifeste-citation ${inView ? "is-visible" : ""} mt-12 flex flex-col items-start gap-6 md:mt-14 md:flex-row md:items-center md:justify-between`}
        >
          <p
            className={`${mono.className} text-[10px] uppercase tracking-[0.3em] text-black/45`}
          >
            Une décision. Maintenant.
          </p>
          <button
            type="button"
            onClick={handleCta}
            className="group inline-flex h-16 items-center gap-4 rounded-full px-10 text-lg font-semibold text-[#F2EBDD] transition-transform duration-300 hover:scale-[1.03] md:h-[4.5rem] md:px-12 md:text-xl"
            style={{ backgroundColor: INK }}
          >
            {t("cta")}
            <ArrowRight className="size-6 transition-transform duration-300 group-hover:translate-x-1.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
