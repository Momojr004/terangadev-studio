"use client";

import { useRef, type CSSProperties } from "react";
import { useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { Plus_Jakarta_Sans, Special_Elite } from "next/font/google";
import { ChapterHeader, gradientTextStyle } from "./chapter-header";
import { DecorativeScatter } from "./decorative-scatter";

const editorial = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const typewriter = Special_Elite({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export function Chapter4OtherWorld() {
  const t = useTranslations("Manifeste.chapter04");
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-200px" });

  const lines = [t("line1"), t("line2"), t("line3")];
  const punches = [t("punch1"), t("punch2")];

  return (
    <section
      ref={ref}
      id="chapter-4"
      className="relative flex min-h-dvh items-center overflow-hidden"
    >
      {/* Chapter-tinted halo : cyan digital frontier. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 65% 50%, rgba(125,211,192,0.12) 0%, rgba(6,16,32,0.55) 55%, rgba(6,16,32,0.75) 100%)",
        }}
      />

      <DecorativeScatter
        items={[
          { content: "(rayé)", top: "5%", left: "3%", rotate: -6, color: "rgba(253,164,175,0.45)", size: "text-xs", spaced: true },
          { content: "→ digital", top: "5%", right: "4%", rotate: 4, color: "rgba(125,211,192,0.55)", size: "text-xs", spaced: true },
          { content: "✱", top: "94%", left: "3%", rotate: 18, size: "text-2xl", color: "rgba(252,211,77,0.3)", mono: false },
          { content: "frontière", top: "94%", right: "4%", rotate: -3, color: "rgba(94,234,212,0.5)", size: "text-sm", spaced: true },
        ]}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:px-16 lg:px-24">
        <ChapterHeader index={4} title={t("title")} theme="cyan" />

        {/* Avant / Après comparison grid — fills the viewport with a
            visible contrast between the paper world and the digitized
            one. Each row is a dimension (stock, équipes, clients,
            décisions) with both states side by side. */}
        <div className="mt-6 grid gap-x-10 gap-y-6 md:grid-cols-12 md:gap-y-8">
          <div className="flex items-baseline gap-3 md:col-span-5">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-rose-300/80">
              {t("beforeTitle")}
            </span>
            <span className="inline-block h-px flex-1 bg-rose-300/30" />
          </div>
          <div className="hidden md:col-span-2 md:block" />
          <div className="flex items-baseline gap-3 md:col-span-5">
            <span className="from-teal-400 to-cyan-300 inline-block h-px flex-1 bg-gradient-to-r" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-teal-200">
              {t("afterTitle")}
            </span>
          </div>

          {[
            { before: t("before1"), after: t("after1"), rotate: "md:-rotate-[0.6deg]" },
            { before: t("before2"), after: t("after2"), rotate: "md:rotate-[0.5deg]" },
            { before: t("before3"), after: t("after3"), rotate: "md:-rotate-[0.4deg]" },
            { before: t("before4"), after: t("after4"), rotate: "md:rotate-[0.7deg]" },
          ].map((row, i) => (
            <div key={i} className={`contents ${row.rotate}`}>
              <p
                style={{ animationDelay: `${0.4 + i * 0.2}s` } as CSSProperties}
                className={`manifeste-citation ${inView ? "is-visible" : ""} ${editorial.className} text-lg leading-snug text-rose-100/60 line-through md:col-span-5 md:text-xl lg:text-2xl ${i % 2 === 0 ? "md:translate-x-2" : "md:-translate-x-1"}`}
              >
                {row.before}
              </p>
              <div
                aria-hidden
                className="hidden items-center justify-center md:col-span-2 md:flex"
              >
                <span className={`from-rose-300 via-amber-200 to-teal-300 inline-block h-px w-full bg-gradient-to-r ${i % 2 === 0 ? "rotate-[3deg]" : "-rotate-[2deg]"}`} />
              </div>
              <p
                style={{ animationDelay: `${0.6 + i * 0.2}s` } as CSSProperties}
                className={`manifeste-citation ${inView ? "is-visible" : ""} ${editorial.className} text-lg leading-snug text-teal-50 md:col-span-5 md:text-xl lg:text-2xl ${i % 2 === 0 ? "md:-translate-x-2" : "md:translate-x-3"}`}
              >
                {row.after}
              </p>
            </div>
          ))}
        </div>

        {/* Original 3 lines kept as a sub-section — they were the original
            copy and still anchor the chapter rhetorically. */}
        <div className={`${editorial.className} mt-16 space-y-4 border-t border-white/10 pt-10 md:space-y-5`}>
          {lines.map((text, i) => (
            <p
              key={i}
              style={{ animationDelay: `${1.6 + i * 0.3}s` } as CSSProperties}
              className={`manifeste-citation ${inView ? "is-visible" : ""} text-xl leading-tight text-cyan-50/80 md:text-2xl lg:text-3xl`}
            >
              {text}
            </p>
          ))}
        </div>

        <div className={`${editorial.className} mt-12 space-y-3 md:mt-16`}>
          {punches.map((text, i) => {
            const isAccent = i === 1;
            const style: CSSProperties = {
              animationDelay: `${3.0 + i * 0.5}s`,
              ...(isAccent
                ? gradientTextStyle(
                    "linear-gradient(90deg, #CCFBF1 0%, #5EEAD4 50%, #67E8F9 100%)",
                  )
                : { color: "#FFFFFF" }),
            };
            return (
              <p
                key={i}
                style={style}
                className={`manifeste-citation ${inView ? "is-visible" : ""} text-3xl leading-[1.1] tracking-tight md:text-5xl lg:text-6xl`}
              >
                {text}
              </p>
            );
          })}
        </div>
      </div>
    </section>
  );
}
