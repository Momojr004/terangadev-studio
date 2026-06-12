"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ChapterHeader } from "./chapter-header";
import { prefersReducedMotion } from "./parallax";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const editorial = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const ACCENT = "#4EA8F9";

/**
 * Chapter 5, oryzo.ai horizontal-strip edition: the viewport pins
 * (sticky) for 300vh while the three path cards — plus a giant closing
 * line — travel horizontally, scrubbed by scroll. The reader scrolls
 * *through* the offer instead of skimming a 3-column table.
 */
export function Chapter5Paths() {
  const t = useTranslations("Manifeste.chapter05");
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const paths = [0, 1, 2].map((i) => ({
    title: t(`path${i + 1}Title`),
    body: t(`path${i + 1}Body`),
    caseRef: t(`path${i + 1}Case`),
    duration: t(`path${i + 1}Duration`),
  }));

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="chapter-5" className="relative h-[300vh]">
      <div className="sticky top-0 flex h-dvh flex-col justify-center overflow-hidden">
        <div className="px-6 md:px-16 lg:px-24">
          <ChapterHeader index={5} title={t("title")} />
        </div>

        {/* Horizontal track — wider than the screen on purpose. */}
        <div
          ref={trackRef}
          className="flex items-stretch gap-6 pl-6 pr-[12vw] md:gap-10 md:pl-16 lg:pl-24"
        >
          {paths.map((p, i) => {
            return (
              <article
                key={i}
                className="relative flex w-[78vw] shrink-0 flex-col gap-6 rounded-3xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-[2px] md:w-[42vw] md:p-10 lg:w-[36vw]"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`${mono.className} inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/50`}
                  >
                    <span
                      className="inline-block size-1.5 rounded-full"
                      style={{ backgroundColor: ACCENT }}
                    />
                    Voie 0{i + 1}
                  </span>
                  <span
                    className={`${editorial.className} text-5xl font-extrabold leading-none text-white/15 md:text-6xl`}
                  >
                    0{i + 1}
                  </span>
                </div>

                <div className="mt-2">
                  <h3
                    className={`${editorial.className} text-3xl font-bold uppercase leading-[1.02] tracking-[-0.02em] text-white md:text-4xl lg:text-5xl`}
                  >
                    {p.title}
                  </h3>
                  <p
                    className={`${editorial.className} mt-4 max-w-md text-base leading-snug text-white/60 md:text-lg`}
                  >
                    {p.body}
                  </p>
                </div>

                <dl className="mt-auto grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                  <div>
                    <dt
                      className={`${mono.className} text-[10px] uppercase tracking-[0.25em] text-white/40`}
                    >
                      Cas
                    </dt>
                    <dd className="mt-1.5 text-sm text-white/85 md:text-base">
                      {p.caseRef}
                    </dd>
                  </div>
                  <div>
                    <dt
                      className={`${mono.className} text-[10px] uppercase tracking-[0.25em] text-white/40`}
                    >
                      Délai
                    </dt>
                    <dd className="mt-1.5 text-sm text-white/85 md:text-base">
                      {p.duration}
                    </dd>
                  </div>
                </dl>
              </article>
            );
          })}

          {/* Closing slide — the chapter line, monumental. */}
          <div className="flex w-[88vw] shrink-0 items-center md:w-[70vw]">
            <p
              className={`${editorial.className} text-[clamp(2.4rem,7vw,6.5rem)] font-extrabold uppercase leading-[0.98] tracking-[-0.03em] text-white`}
            >
              {t("intro")}
            </p>
          </div>
        </div>

        {/* Drag cue */}
        <div
          className={`${mono.className} mt-10 flex items-center gap-3 px-6 text-[10px] uppercase tracking-[0.3em] text-white/35 md:px-16 lg:px-24`}
        >
          <span className="inline-block h-px w-10 bg-white/25" />
          Scrolle — la voie défile
        </div>
      </div>
    </section>
  );
}
