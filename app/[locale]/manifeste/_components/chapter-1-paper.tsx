"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Special_Elite } from "next/font/google";
import { ChapterHeader, gradientTextStyle } from "./chapter-header";
import { ChapterAtmosphere } from "./chapter-atmosphere";

const typewriter = Special_Elite({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const CHAR_DELAY = 0.038;
const LINE_PAUSE = 0.6;
const INITIAL_DELAY = 0.5;

function Line({ text, baseDelay }: { text: string; baseDelay: number }) {
  return (
    <span className="block">
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="typewriter-char"
          style={{ animationDelay: `${baseDelay + i * CHAR_DELAY}s` }}
        >
          {char === " " ? " " : char}
        </span>
      ))}
    </span>
  );
}

export function Chapter1Paper() {
  const t = useTranslations("Manifeste.chapter01");
  const tParent = useTranslations("Manifeste");

  const lines = [t("line1"), t("line2"), t("line3"), t("line4")];

  // Total typewriter duration to time the continue indicator
  const totalChars = lines.reduce((sum, line) => sum + line.length, 0);
  const totalDuration =
    INITIAL_DELAY + lines.length * LINE_PAUSE + totalChars * CHAR_DELAY;

  return (
    <section
      id="chapter-1"
      className={`relative flex min-h-dvh flex-col justify-center overflow-hidden px-6 py-24 text-amber-50 md:px-16 lg:px-24 ${typewriter.className}`}
    >
      {/* Narrative atmosphere : paper sheets falling */}
      <ChapterAtmosphere kind="paper" />

      {/* Chapter-tinted halo : warm amber wash for the paper world. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 40%, rgba(252,211,77,0.10) 0%, rgba(6,16,32,0.55) 60%, rgba(6,16,32,0.75) 100%)",
        }}
      />

      <ChapterHeader index={1} title={t("title")} theme="amber" />

      {/* Decorative scatter — small asymmetric marks that break the grid.
          They sit behind the main content and never grab attention. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 hidden md:block"
      >
        <span className="text-teranga-secondary/30 absolute top-[18%] right-[8%] font-mono text-2xl">
          +
        </span>
        <span className="absolute top-[62%] left-[42%] inline-block h-px w-10 rotate-[18deg] bg-white/20" />
        <span className="text-teranga-secondary/25 absolute top-[78%] right-[18%] font-mono text-xs">
          ✱
        </span>
      </div>

      {/* Two-column composition broken on purpose : typewriter slightly
          rotated, aside off the baseline. Editorial, not boxy. */}
      <div className="relative z-10 grid gap-12 md:grid-cols-12 md:gap-16">
        <div className="space-y-7 text-2xl leading-[1.18] tracking-tight md:col-span-7 md:-rotate-[1deg] md:space-y-9 md:text-4xl lg:text-5xl">
          {lines.map((text, lineIdx) => {
            const previousChars = lines
              .slice(0, lineIdx)
              .reduce((sum, line) => sum + line.length, 0);
            const baseDelay =
              INITIAL_DELAY +
              lineIdx * LINE_PAUSE +
              previousChars * CHAR_DELAY;
            return <Line key={lineIdx} text={text} baseDelay={baseDelay} />;
          })}
        </div>

        <motion.aside
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: 1.2,
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="md:col-span-5 md:translate-y-16 md:rotate-[1.5deg] md:pl-8 md:border-l md:border-white/10"
        >
          <div className="flex items-baseline gap-3">
            <span
              className="font-display text-7xl font-medium leading-none tracking-tight md:text-8xl"
              style={gradientTextStyle(
                "linear-gradient(135deg, #FEF3C7 0%, #FCD34D 50%, #F59E0B 100%)",
              )}
            >
              {t("supportStat")}
            </span>
          </div>
          <p className="mt-5 max-w-sm text-base leading-snug text-amber-50/85 md:text-lg">
            {t("supportLine")}
          </p>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-amber-700/60">
            {t("supportSource")}
          </p>

          <div className="mt-12 border-t border-white/10 pt-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-700/70">
              {t("lossLabel")}
            </p>
            <ul className="mt-5 space-y-3 text-sm leading-snug text-amber-50/80 md:text-base">
              {[
                t("loss1"),
                t("loss2"),
                t("loss3"),
                t("loss4"),
              ].map((label, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="inline-block size-1.5 shrink-0 rounded-full"
                    style={{
                      backgroundImage:
                        "linear-gradient(135deg, #FCD34D, #FB7185)",
                    }}
                  />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </motion.aside>
      </div>

      {/* Continue indicator — Framer Motion fine for single wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: totalDuration + 0.3,
          duration: 1.2,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 text-center md:bottom-14"
      >
        <p className="text-[9px] uppercase tracking-[0.4em] text-amber-700/50">
          {tParent("scrollHint")}
        </p>
        <motion.p
          animate={{ y: [0, 4, 0] }}
          transition={{
            delay: totalDuration + 0.5,
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mt-2 text-sm text-amber-700/50"
        >
          ↓
        </motion.p>
      </motion.div>
    </section>
  );
}
