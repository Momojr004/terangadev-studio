"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { Newsreader, Special_Elite } from "next/font/google";

const editorial = Newsreader({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const typewriter = Special_Elite({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const SceneClient = dynamic(
  () => import("./chapter-4-scene").then((m) => m.Scene),
  {
    ssr: false,
    loading: () => <SceneFallback />,
  },
);

function SceneFallback() {
  return (
    <div
      aria-hidden
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse at 70% 50%, #4EA8F9 0%, #0A68F7 30%, #0A2A6B 70%, #061a44 100%)",
      }}
    />
  );
}

export function Chapter4OtherWorld() {
  const t = useTranslations("Manifeste.chapter04");
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-200px" });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isWide = window.matchMedia("(min-width: 768px)").matches;
    if (!reduceMotion && isWide) setEnabled(true);
  }, []);

  const lines = [t("line1"), t("line2"), t("line3")];
  const punches = [t("punch1"), t("punch2")];

  return (
    <section
      ref={ref}
      className="relative flex min-h-dvh items-center overflow-hidden bg-[#061a44]"
    >
      {/* R3F scene full bleed in background */}
      <div className="pointer-events-none absolute inset-0">
        {enabled ? <SceneClient /> : <SceneFallback />}
      </div>

      {/* Vertical gradient overlay to keep left-side text readable */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, #061a44 0%, rgba(6,26,68,0.85) 35%, transparent 70%)",
        }}
      />

      {/* Chapter label */}
      <p
        style={{ animationDelay: "0s" } as CSSProperties}
        className={`absolute left-6 top-24 z-10 manifeste-citation ${inView ? "is-visible" : ""} ${typewriter.className} text-[10px] uppercase tracking-[0.4em] text-cyan-200/60 md:left-16 md:top-28`}
      >
        {t("label")}
      </p>

      {/* Copy stack — left half */}
      <div className="relative z-10 mx-auto max-w-2xl px-6 py-32 md:mx-0 md:max-w-3xl md:pl-16 md:pr-12 lg:pl-24">
        <div className={`${editorial.className} space-y-5 md:space-y-6`}>
          {lines.map((text, i) => (
            <p
              key={i}
              style={
                { animationDelay: `${0.6 + i * 0.7}s` } as CSSProperties
              }
              className={`manifeste-citation ${inView ? "is-visible" : ""} text-2xl leading-tight text-cyan-50 md:text-3xl lg:text-4xl`}
            >
              {text}
            </p>
          ))}
        </div>

        <div className={`${editorial.className} mt-10 space-y-3 md:mt-14`}>
          {punches.map((text, i) => (
            <p
              key={i}
              style={
                { animationDelay: `${3.2 + i * 0.5}s` } as CSSProperties
              }
              className={`manifeste-citation ${inView ? "is-visible" : ""} text-3xl leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl`}
            >
              {text}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
