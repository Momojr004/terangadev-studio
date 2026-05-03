"use client";

import { useRef, type CSSProperties } from "react";
import { useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { Newsreader, Special_Elite } from "next/font/google";

const editorial = Newsreader({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  display: "swap",
});

const typewriter = Special_Elite({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

function SilentPhrase({ number, text }: { number: number; text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-35% 0px -35% 0px" });

  return (
    <div
      ref={ref}
      className="relative flex min-h-dvh items-center px-6 md:px-16 lg:px-24"
    >
      <div className="max-w-5xl">
        <p
          style={{ animationDelay: "0s" } as CSSProperties}
          className={`manifeste-citation ${inView ? "is-visible" : ""} ${typewriter.className} text-[10px] uppercase tracking-[0.4em] text-cyan-200/30 md:text-xs`}
        >
          {String(number).padStart(2, "0")} / 04
        </p>
        <p
          style={{ animationDelay: "0.4s" } as CSSProperties}
          className={`manifeste-citation ${inView ? "is-visible" : ""} ${editorial.className} mt-10 text-4xl leading-[1.08] tracking-tight text-white md:mt-14 md:text-6xl lg:text-7xl xl:text-8xl`}
        >
          {text}
        </p>
      </div>
    </div>
  );
}

export function Chapter6Condition() {
  const t = useTranslations("Manifeste.chapter06");
  const introRef = useRef<HTMLElement>(null);
  const introInView = useInView(introRef, {
    once: true,
    margin: "-200px",
  });

  return (
    <section className="relative bg-[#0a0e1a]">
      {/* Soft brand halo at center fading to black — depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(74,168,249,0.05) 0%, transparent 60%)",
        }}
      />

      {/* Intro section with chapter label + intro line */}
      <section
        ref={introRef}
        className="relative flex min-h-dvh flex-col justify-center px-6 md:px-16 lg:px-24"
      >
        <p
          style={{ animationDelay: "0s" } as CSSProperties}
          className={`manifeste-citation ${introInView ? "is-visible" : ""} ${typewriter.className} text-[10px] uppercase tracking-[0.4em] text-cyan-200/60 md:text-xs`}
        >
          {t("label")}
        </p>
        <p
          style={{ animationDelay: "0.5s" } as CSSProperties}
          className={`manifeste-citation ${introInView ? "is-visible" : ""} ${editorial.className} mt-12 max-w-4xl text-5xl leading-[1.05] tracking-tight text-white md:text-7xl lg:text-8xl`}
        >
          {t("intro")}
        </p>
        <p
          style={{ animationDelay: "1.2s" } as CSSProperties}
          className={`manifeste-citation ${introInView ? "is-visible" : ""} ${typewriter.className} mt-12 text-[10px] uppercase tracking-[0.4em] text-cyan-200/40 md:text-xs`}
        >
          ↓ continue
        </p>
      </section>

      {/* 4 silent phrases, each their own viewport */}
      <SilentPhrase number={1} text={t("condition1")} />
      <SilentPhrase number={2} text={t("condition2")} />
      <SilentPhrase number={3} text={t("condition3")} />
      <SilentPhrase number={4} text={t("condition4")} />
    </section>
  );
}
