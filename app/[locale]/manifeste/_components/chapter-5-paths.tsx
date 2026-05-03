"use client";

import { useRef, type CSSProperties } from "react";
import { useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { Newsreader, JetBrains_Mono, Special_Elite } from "next/font/google";

const editorial = Newsreader({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
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
    { title: t("path1Title"), body: t("path1Body"), delay: 1.2 },
    { title: t("path2Title"), body: t("path2Body"), delay: 1.6 },
    { title: t("path3Title"), body: t("path3Body"), delay: 2.0 },
  ];

  return (
    <section
      ref={ref}
      className="relative flex min-h-dvh flex-col overflow-hidden bg-[#0a1f4a] px-6 py-24 md:px-16 lg:px-24"
    >
      {/* Subtle vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(74,168,249,0.08) 0%, transparent 50%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      {/* Chapter label */}
      <p
        style={{ animationDelay: "0s" } as CSSProperties}
        className={`relative z-10 manifeste-citation ${inView ? "is-visible" : ""} ${typewriter.className} text-[10px] uppercase tracking-[0.4em] text-cyan-200/60 md:text-xs`}
      >
        {t("label")}
      </p>

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

      {/* Path labels */}
      <div className="relative z-10 mt-12 grid grid-cols-1 gap-8 md:mt-16 md:grid-cols-3 md:gap-12">
        {paths.map((p, i) => (
          <div
            key={i}
            style={{ animationDelay: `${p.delay}s` } as CSSProperties}
            className={`manifeste-citation ${inView ? "is-visible" : ""} text-center md:text-left`}
          >
            <p
              className={`${mono.className} text-[10px] uppercase tracking-[0.3em] text-cyan-300/70`}
            >
              0{i + 1}
            </p>
            <h3
              className={`${editorial.className} mt-3 text-3xl leading-tight tracking-tight text-white md:text-4xl`}
            >
              {p.title}
            </h3>
            <p
              className={`${editorial.className} mt-2 text-lg italic leading-snug text-cyan-100/80 md:text-xl`}
            >
              {p.body}
            </p>
          </div>
        ))}
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
