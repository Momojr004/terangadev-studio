"use client";

import { useRef, type CSSProperties } from "react";
import { useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  Special_Elite,
  Newsreader,
  Permanent_Marker,
  JetBrains_Mono,
} from "next/font/google";
import { ChapterHeader } from "./chapter-header";
import { DecorativeScatter } from "./decorative-scatter";

const typewriter = Special_Elite({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const editorial = Newsreader({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const marker = Permanent_Marker({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const stencil = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

type Citation = {
  text: string;
  fontClass: string;
  position: string;
  rotation: number;
  size: string;
  color: string;
  delay: number;
};

export function Chapter3Excuses() {
  const t = useTranslations("Manifeste.chapter03");
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-200px" });

  const citations: Citation[] = [
    {
      text: t("citation1"),
      fontClass: typewriter.className,
      position: "left-[6%] top-[20%] md:left-[8%] md:top-[22%]",
      rotation: -2.5,
      size: "text-2xl md:text-4xl lg:text-5xl",
      color: "text-amber-100",
      delay: 0.4,
    },
    {
      text: t("citation2"),
      fontClass: `${editorial.className} italic`,
      position: "right-[6%] top-[34%] md:right-[10%] md:top-[34%]",
      rotation: 1.5,
      size: "text-2xl md:text-4xl lg:text-5xl",
      color: "text-rose-200",
      delay: 1.0,
    },
    {
      text: t("citation3"),
      fontClass: marker.className,
      position: "left-[8%] top-[48%] md:left-[14%] md:top-[48%]",
      rotation: -1,
      size: "text-2xl md:text-3xl lg:text-4xl",
      color: "text-cyan-100/90",
      delay: 1.6,
    },
    {
      text: t("citation4"),
      fontClass: `${stencil.className} uppercase`,
      position: "right-[6%] top-[62%] md:right-[8%] md:top-[62%]",
      rotation: 0,
      size: "text-base md:text-2xl lg:text-3xl",
      color: "text-amber-50/85",
      delay: 2.2,
    },
  ];

  return (
    <section
      ref={ref}
      id="chapter-3"
      className="relative flex min-h-dvh flex-col overflow-hidden px-6 py-24 md:px-16 lg:px-24"
    >
      {/* Chapter-tinted halo : magenta/fuchsia wash — chorus of voices. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(232,121,249,0.10) 0%, rgba(6,16,32,0.55) 60%, rgba(6,16,32,0.75) 100%)",
        }}
      />

      <DecorativeScatter
        items={[
          { content: "(souvent)", top: "5%", right: "3%", rotate: 5, color: "rgba(255,255,255,0.3)", size: "text-xs" },
          { content: "✕", top: "8%", left: "3%", rotate: -12, size: "text-2xl", color: "rgba(252,211,77,0.3)", mono: false },
          { content: "→ datée", top: "94%", right: "4%", rotate: 4, color: "rgba(252,211,77,0.45)", size: "text-xs", spaced: true },
          { content: "?", top: "92%", left: "3%", rotate: 8, size: "text-3xl", color: "rgba(253,164,175,0.25)", mono: false },
        ]}
      />

      <ChapterHeader index={3} title={t("title")} theme="magenta" />

      {/* Citations + responses : structured grid so each excuse meets
          its real answer. Citations preserve their multi-typo character
          (typewriter, italic serif, marker, stencil) so the chapter still
          reads as a "wall of voices" — but paired with our rebuttals. */}
      <div className="relative z-10 mt-4 grid gap-x-12 gap-y-10 md:grid-cols-12 md:gap-y-14">
        <div className="flex items-baseline gap-3 md:col-span-12">
          <span className="from-teranga-secondary to-teranga-primary inline-block h-px w-10 bg-gradient-to-r" />
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">
            04 excuses · 04 réponses
          </p>
        </div>
        {citations.map((c, i) => {
          const rebutKey = `rebut${i + 1}` as
            | "rebut1"
            | "rebut2"
            | "rebut3"
            | "rebut4";
          return (
            <div
              key={i}
              className="contents"
              style={{ animationDelay: `${c.delay}s` } as CSSProperties}
            >
              <div className="md:col-span-6">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">
                  0{i + 1} · excuse
                </span>
                <p
                  style={{ animationDelay: `${c.delay}s` } as CSSProperties}
                  className={`manifeste-citation ${inView ? "is-visible" : ""} mt-3 ${c.fontClass} ${c.size} ${c.color} leading-[1.05] tracking-tight`}
                >
                  {c.text}
                </p>
              </div>
              <div className="md:col-span-6 md:border-l md:border-white/10 md:pl-8">
                <span className="text-teranga-secondary font-mono text-[10px] uppercase tracking-[0.3em]">
                  0{i + 1} · {t("rebutTitle").toLowerCase()}
                </span>
                <p
                  style={{ animationDelay: `${c.delay + 0.35}s` } as CSSProperties}
                  className={`manifeste-citation ${inView ? "is-visible" : ""} ${editorial.className} mt-3 text-lg leading-snug text-white/85 md:text-xl`}
                >
                  {t(rebutKey)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Punchline — center bottom, definitive */}
      <div
        style={{ animationDelay: "3.0s" } as CSSProperties}
        className={`manifeste-citation ${inView ? "is-visible" : ""} relative z-10 self-center text-center ${editorial.className} mt-12`}
      >
        <p className="text-3xl leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
          {t("punchline")}
        </p>
        <p className="mt-2 text-3xl leading-tight tracking-tight text-rose-300 italic md:text-5xl lg:text-6xl">
          {t("punchline2")}
        </p>
      </div>
    </section>
  );
}
