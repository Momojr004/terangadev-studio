"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { JetBrains_Mono } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
});

/**
 * The oryzo.ai "● SCROLL TO CONTINUE" pill — fixed bottom-center, alive
 * for the whole journey, gone once the final chapter takes over (the
 * cream flip is the destination; the pill would nag).
 *
 * mix-blend-difference keeps it legible over every chapter color world
 * without per-section logic.
 */
export function ScrollCue() {
  const t = useTranslations("Manifeste");
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = ref.current;
    const finale = document.getElementById("chapter-7");
    if (!el || !finale) return;

    ScrollTrigger.create({
      trigger: finale,
      start: "top 70%",
      onEnter: () => gsap.to(el, { autoAlpha: 0, y: 12, duration: 0.5 }),
      onLeaveBack: () => gsap.to(el, { autoAlpha: 1, y: 0, duration: 0.5 }),
    });
  });

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed bottom-6 left-1/2 z-30 -translate-x-1/2 mix-blend-difference md:bottom-8"
    >
      <span
        className={`${mono.className} inline-flex items-center gap-2.5 rounded-full border border-white/25 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-white/85`}
      >
        <span className="manifeste-cue-dot inline-block size-1.5 rounded-full bg-white" />
        {t("scrollHint")}
      </span>
    </div>
  );
}
