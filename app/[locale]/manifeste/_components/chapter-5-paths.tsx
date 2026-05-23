"use client";

import { useRef, type CSSProperties } from "react";
import { useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { Plus_Jakarta_Sans, JetBrains_Mono, Special_Elite } from "next/font/google";
import { ChapterHeader } from "./chapter-header";
import { DecorativeScatter } from "./decorative-scatter";

const editorial = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const typewriter = Special_Elite({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export function Chapter5Paths() {
  const t = useTranslations("Manifeste.chapter05");
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-200px" });

  const paths = [
    {
      title: t("path1Title"),
      body: t("path1Body"),
      caseRef: t("path1Case"),
      duration: t("path1Duration"),
      price: t("path1Price"),
      delay: 1.2,
    },
    {
      title: t("path2Title"),
      body: t("path2Body"),
      caseRef: t("path2Case"),
      duration: t("path2Duration"),
      price: t("path2Price"),
      delay: 1.6,
    },
    {
      title: t("path3Title"),
      body: t("path3Body"),
      caseRef: t("path3Case"),
      duration: t("path3Duration"),
      price: t("path3Price"),
      delay: 2.0,
    },
  ];

  return (
    <section
      ref={ref}
      id="chapter-5"
      className="relative flex min-h-dvh flex-col overflow-hidden px-6 py-24 md:px-16 lg:px-24"
    >
      {/* Chapter-tinted halo : teal/emerald — three branching paths. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(94,234,212,0.12) 0%, rgba(6,16,32,0.55) 60%, rgba(6,16,32,0.80) 100%)",
        }}
      />

      <DecorativeScatter
        items={[
          { content: "→ port", top: "5%", left: "3%", rotate: -5, color: "rgba(125,211,192,0.5)", size: "text-xs", spaced: true },
          { content: "✱", top: "8%", right: "4%", rotate: 12, size: "text-2xl", color: "rgba(252,211,77,0.35)", mono: false },
          { content: "trois entrées · une équipe", top: "94%", left: "4%", rotate: -2, color: "rgba(125,211,192,0.45)", size: "text-[10px]", spaced: true },
          { content: "+", top: "94%", right: "5%", rotate: 24, size: "text-2xl", color: "rgba(94,234,212,0.4)", mono: false },
        ]}
      />

      <ChapterHeader index={5} title={t("title")} theme="teal" />

      {/* Beams diagram */}
      <div className="relative z-10 mt-16 flex flex-1 items-center justify-center md:mt-24">
        <svg
          viewBox="0 0 800 360"
          className="h-auto w-full max-w-4xl"
          aria-hidden
        >
          <defs>
            <linearGradient
              id="beam-gradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#7ecbff" stopOpacity="1" />
              <stop offset="100%" stopColor="#0a68f7" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="source-gradient">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="40%" stopColor="#7ecbff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0a68f7" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="port-gradient">
              <stop offset="0%" stopColor="#7ecbff" stopOpacity="1" />
              <stop offset="100%" stopColor="#0a68f7" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Source halo */}
          <circle
            cx="400"
            cy="40"
            r="32"
            fill="url(#source-gradient)"
            className={`manifeste-citation ${inView ? "is-visible" : ""}`}
            style={{ animationDelay: "0.2s" } as CSSProperties}
          />
          {/* Source dot */}
          <circle
            cx="400"
            cy="40"
            r="4"
            fill="#ffffff"
            className={`manifeste-citation ${inView ? "is-visible" : ""}`}
            style={{ animationDelay: "0.4s" } as CSSProperties}
          />

          {/* 3 beams */}
          {[
            { x: 130, delay: 0.8 },
            { x: 400, delay: 1.0 },
            { x: 670, delay: 1.2 },
          ].map((beam, i) => (
            <g key={i}>
              <line
                x1="400"
                y1="44"
                x2={beam.x}
                y2="290"
                stroke="url(#beam-gradient)"
                strokeWidth="1.5"
                className={`manifeste-citation ${inView ? "is-visible" : ""}`}
                style={{ animationDelay: `${beam.delay}s` } as CSSProperties}
              />
              {/* Port halo */}
              <circle
                cx={beam.x}
                cy="290"
                r="22"
                fill="url(#port-gradient)"
                className={`manifeste-citation ${inView ? "is-visible" : ""}`}
                style={
                  { animationDelay: `${beam.delay + 0.2}s` } as CSSProperties
                }
              />
              {/* Port square */}
              <rect
                x={beam.x - 6}
                y="284"
                width="12"
                height="12"
                fill="#7ecbff"
                stroke="#ffffff"
                strokeWidth="1"
                className={`manifeste-citation ${inView ? "is-visible" : ""}`}
                style={
                  { animationDelay: `${beam.delay + 0.3}s` } as CSSProperties
                }
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Path cards — each one densified with reference case, duration
          and price tier so the chapter doesn't read as just a poetic
          three-bullet split. Rotations + vertical offsets per card so
          the row reads as a scattered editorial layout, not a table. */}
      <div className="relative z-10 mt-12 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-3 md:gap-8">
        {paths.map((p, i) => {
          const accent =
            i === 0
              ? { text: "text-cyan-300", from: "from-cyan-400", to: "to-cyan-300", border: "border-cyan-400/20", bg: "bg-cyan-400/[0.04]" }
              : i === 1
                ? { text: "text-amber-300", from: "from-amber-300", to: "to-amber-200", border: "border-amber-300/20", bg: "bg-amber-300/[0.04]" }
                : { text: "text-teal-300", from: "from-teal-300", to: "to-emerald-300", border: "border-teal-300/20", bg: "bg-teal-300/[0.04]" };
          return (
          <div
            key={i}
            style={{ animationDelay: `${p.delay}s` } as CSSProperties}
            className={`manifeste-citation ${inView ? "is-visible" : ""} relative flex flex-col gap-5 rounded-2xl border ${accent.border} ${accent.bg} p-6 backdrop-blur-[2px] md:p-8 ${i === 0 ? "md:-rotate-[1.8deg] md:translate-y-4" : i === 1 ? "md:rotate-[1.2deg] md:-translate-y-6" : "md:-rotate-[0.9deg] md:translate-y-8"}`}
          >
            <div className="flex items-baseline justify-between">
              <p
                className={`${mono.className} text-[10px] uppercase tracking-[0.3em] ${accent.text}`}
              >
                0{i + 1}
              </p>
              <span className={`${accent.from} ${accent.to} inline-block h-px w-12 bg-gradient-to-r`} />
            </div>

            <div>
              <h3
                className={`${editorial.className} text-2xl leading-tight tracking-tight text-white md:text-3xl`}
              >
                {p.title}
              </h3>
              <p
                className={`${editorial.className} mt-2 text-base italic leading-snug text-cyan-100/80 md:text-lg`}
              >
                {p.body}
              </p>
            </div>

            <dl className="mt-auto grid grid-cols-1 gap-3 border-t border-white/10 pt-5 text-sm">
              <div className="flex items-baseline justify-between gap-3">
                <dt
                  className={`${mono.className} text-[10px] uppercase tracking-[0.25em] text-white/40`}
                >
                  Cas
                </dt>
                <dd className="text-right text-white/85 text-xs md:text-sm">
                  {p.caseRef}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt
                  className={`${mono.className} text-[10px] uppercase tracking-[0.25em] text-white/40`}
                >
                  Délai
                </dt>
                <dd className="text-right text-white/85 text-xs md:text-sm">
                  {p.duration}
                </dd>
              </div>
            </dl>
          </div>
          );
        })}
      </div>

      {/* Punchline */}
      <p
        style={{ animationDelay: "2.8s" } as CSSProperties}
        className={`manifeste-citation ${inView ? "is-visible" : ""} relative z-10 mt-16 text-center ${editorial.className} text-4xl tracking-tight text-white md:mt-20 md:text-6xl lg:text-7xl`}
      >
        {t("intro")}
      </p>
    </section>
  );
}
