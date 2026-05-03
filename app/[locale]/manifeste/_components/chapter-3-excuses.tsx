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
      className="relative flex min-h-dvh flex-col overflow-hidden bg-[#14130f] px-6 py-24 md:px-16 lg:px-24"
    >
      {/* Concrete wall texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='c'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23c)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Subtle warm street-lamp light from top-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 80% 0%, #c89060 0%, transparent 55%)",
        }}
      />

      {/* Vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* Chapter label */}
      <p
        style={{ animationDelay: "0s" } as CSSProperties}
        className={`relative z-10 manifeste-citation ${inView ? "is-visible" : ""} ${typewriter.className} text-[10px] uppercase tracking-[0.4em] text-amber-700/70 md:text-xs`}
      >
        {t("label")}
      </p>

      {/* Scattered citations on wall */}
      <div className="relative z-10 flex-1">
        {citations.map((c, i) => (
          <p
            key={i}
            style={
              {
                transform: `rotate(${c.rotation}deg)`,
                animationDelay: `${c.delay}s`,
              } as CSSProperties
            }
            className={`manifeste-citation ${inView ? "is-visible" : ""} absolute max-w-md ${c.position} ${c.fontClass} ${c.size} ${c.color} leading-tight tracking-tight md:max-w-xl`}
          >
            {c.text}
          </p>
        ))}
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
