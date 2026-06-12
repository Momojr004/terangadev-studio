"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { prefersReducedMotion } from "./parallax";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const display = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["700", "800"],
  display: "swap",
});

/**
 * The oryzo.ai "it's wearable" moment, between chapters 3 and 4: the
 * section is 260vh tall, its inner viewport stays stuck (CSS sticky)
 * while two oversized lines slide horizontally in opposite directions,
 * scrubbed by the scroll. The text is wider than the screen on purpose —
 * the reader scrolls *through* the sentence before chapter 4 opens.
 *
 * Sticky + scrub (rather than ScrollTrigger pin) keeps the layout
 * untouched: no element re-parenting, no pin-spacer, plays nice with
 * Lenis and the fixed R3F canvas behind.
 */
export function GiantSlide() {
  const t = useTranslations("Manifeste.slide");
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const section = sectionRef.current;
      if (!section) return;

      const scrub = {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
      } as const;

      // Two lines crossing each other — the depth cue of the effect.
      gsap.fromTo(
        "[data-slide-line='1']",
        { xPercent: 12 },
        { xPercent: -38, ease: "none", scrollTrigger: scrub },
      );
      gsap.fromTo(
        "[data-slide-line='2']",
        { xPercent: -32 },
        { xPercent: 10, ease: "none", scrollTrigger: scrub },
      );
      // Eyebrow drifts up slightly slower than the page — background depth.
      gsap.fromTo(
        "[data-slide-eyebrow]",
        { yPercent: 60, opacity: 0 },
        { yPercent: -60, opacity: 1, ease: "none", scrollTrigger: scrub },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="manifeste-slide"
      aria-label={`${t("line1")} ${t("line2")}`}
      className="relative h-[260vh]"
    >
      <div className="sticky top-0 flex h-dvh flex-col justify-center overflow-hidden">
        <p
          data-slide-eyebrow
          className="text-teranga-secondary/70 mb-6 px-6 font-mono text-[10px] uppercase tracking-[0.35em] md:px-16 md:text-xs lg:px-24"
        >
          {t("eyebrow")}
        </p>

        <div className={`select-none ${display.className}`} aria-hidden>
          <p
            data-slide-line="1"
            className="text-[16vw] leading-[0.95] font-extrabold tracking-tight whitespace-nowrap text-white md:text-[13vw]"
          >
            {t("line1")}
          </p>
          <p
            data-slide-line="2"
            className="text-right text-[16vw] leading-[0.95] font-extrabold tracking-tight whitespace-nowrap text-[#4EA8F9] md:text-[13vw]"
          >
            {t("line2")}
          </p>
        </div>
      </div>
    </section>
  );
}
