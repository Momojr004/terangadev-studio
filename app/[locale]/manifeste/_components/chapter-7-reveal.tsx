"use client";

import { useRef, type CSSProperties } from "react";
import { useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Plus_Jakarta_Sans, Special_Elite } from "next/font/google";
import { useRouter } from "@/i18n/navigation";
import { mulberry32 } from "@/lib/rng";
import { ChapterHeader, gradientTextStyle } from "./chapter-header";
import { DecorativeScatter } from "./decorative-scatter";

const editorial = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
});

const typewriter = Special_Elite({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

// 24 dots distributed around the edges, animated to converge toward center.
// Computed once at module scope with a fixed seed : deterministic, so the
// inline positions baked into SSR'd DOM hydrate without a mismatch.
const CONVERGING_DOTS = (() => {
  const rand = mulberry32(0xc0_07_d075);
  return Array.from({ length: 24 }, (_, i) => {
    const angle = (i / 24) * Math.PI * 2;
    const radius = 45 + rand() * 10;
    return {
      x: 50 + Math.cos(angle) * radius,
      y: 50 + Math.sin(angle) * radius,
      delay: 0.6 + rand() * 1.4,
    };
  });
})();

function ConvergingDots() {
  const positions = CONVERGING_DOTS;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {positions.map((p, i) => (
        <span
          key={i}
          className="manifeste-dot-converge absolute size-1.5 rounded-full bg-cyan-300/80"
          style={
            {
              left: `${p.x}%`,
              top: `${p.y}%`,
              animationDelay: `${p.delay}s`,
              boxShadow: "0 0 10px rgba(126, 203, 255, 0.7)",
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

export function Chapter7Reveal() {
  const t = useTranslations("Manifeste.chapter07");
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-200px" });
  const router = useRouter();

  function handleCta() {
    document.cookie =
      "terangadev_seen_intro=1; path=/; max-age=31536000; SameSite=Lax";
    router.push("/");
  }

  const transitions = [
    t("transition1"),
    t("transition2"),
    t("transition3"),
  ];

  return (
    <section
      ref={ref}
      id="chapter-7"
      className="relative flex min-h-dvh flex-col overflow-hidden px-6 py-24 md:px-16"
    >
      {/* Brand halo center + multi-color satellites. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(74,168,249,0.20) 0%, transparent 55%), radial-gradient(circle at 18% 18%, rgba(125,211,192,0.10) 0%, transparent 40%), radial-gradient(circle at 82% 82%, rgba(252,211,77,0.08) 0%, transparent 35%), radial-gradient(circle at 18% 82%, rgba(253,164,175,0.10) 0%, transparent 35%), radial-gradient(circle at 82% 18%, rgba(94,234,212,0.08) 0%, transparent 35%)",
        }}
      />

      <DecorativeScatter
        items={[
          { content: "depuis 2024", top: "85%", left: "4%", rotate: -3, color: "rgba(125,211,192,0.55)", size: "text-xs", spaced: true },
          { content: "✱", top: "12%", right: "5%", rotate: 14, size: "text-2xl", color: "rgba(252,211,77,0.3)", mono: false },
          { content: "Point E · Dakar", top: "92%", right: "5%", rotate: 2, color: "rgba(94,234,212,0.55)", size: "text-[10px]", spaced: true },
          { content: "+", top: "90%", left: "48%", rotate: 22, size: "text-xl", color: "rgba(252,211,77,0.3)", mono: false },
        ]}
      />

      {/* Converging dots */}
      {inView && <ConvergingDots />}

      {/* Chapter header at top — same visual signature as the other six
          chapters so the reader feels the rhythm continues. */}
      <div className="relative z-10">
        <ChapterHeader index={7} title={t("title")} theme="brand" />
      </div>

      {/* Reveal stack — vertically centered in the remaining space so
          the logo + tagline + CTA stay the visual focal point. */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center">
        {/* Logo T mark */}
        <div
          style={{ animationDelay: "1.6s" } as CSSProperties}
          className={`manifeste-citation ${inView ? "is-visible" : ""} relative`}
        >
          <div
            aria-hidden
            className="absolute inset-0 -m-8 rounded-full blur-2xl"
            style={{
              background:
                "radial-gradient(circle, rgba(126,203,255,0.45) 0%, transparent 65%)",
            }}
          />
          <svg
            width="88"
            height="88"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
            className="relative"
          >
            <defs>
              <linearGradient
                id="ch7-logo-gradient"
                x1="2"
                y1="2"
                x2="22"
                y2="22"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#7ECBFF" />
                <stop offset="1" stopColor="#0A68F7" />
              </linearGradient>
            </defs>
            <path
              d="M3 4.5 H17 L20 7.5 V11 H13 V20 L9.5 16.5 V11 H3 Z"
              fill="url(#ch7-logo-gradient)"
            />
          </svg>
        </div>

        {/* Wordmark */}
        <p
          style={{
            animationDelay: "2.0s",
            ...gradientTextStyle(
              "linear-gradient(135deg, #CFFAFE 0%, #4EA8F9 50%, #0A68F7 100%)",
            ),
          }}
          className={`manifeste-citation ${inView ? "is-visible" : ""} ${editorial.className} mt-6 text-3xl font-semibold tracking-tight md:text-5xl`}
        >
          {t("wordmark")}
        </p>

        {/* Tagline */}
        <p
          style={{
            animationDelay: "2.4s",
            ...gradientTextStyle(
              "linear-gradient(90deg, #FEF3C7 0%, #FDA4AF 50%, #CCFBF1 100%)",
            ),
          }}
          className={`manifeste-citation ${inView ? "is-visible" : ""} ${editorial.className} mt-4 text-xl italic tracking-tight md:text-2xl`}
        >
          {t("tagline")}
        </p>

        {/* Promise */}
        <p
          style={{ animationDelay: "2.9s" } as CSSProperties}
          className={`manifeste-citation ${inView ? "is-visible" : ""} ${editorial.className} mt-12 max-w-2xl text-2xl leading-tight tracking-tight text-white md:text-3xl lg:text-4xl`}
        >
          {t("promise")}
        </p>

        {/* Transitions list */}
        <div className="mt-12 space-y-3 md:mt-16">
          {transitions.map((text, i) => (
            <p
              key={i}
              style={
                { animationDelay: `${3.5 + i * 0.4}s` } as CSSProperties
              }
              className={`manifeste-citation ${inView ? "is-visible" : ""} ${editorial.className} text-lg italic text-cyan-100/70 md:text-xl`}
            >
              {text}
            </p>
          ))}
        </div>

        {/* Final stats strip — anchors the reveal in concrete track
            record before the CTA. Same numbers as the home StatsBar so
            the reader carries the same proof out of the manifesto. */}
        <div
          style={{ animationDelay: "4.6s" } as CSSProperties}
          className={`manifeste-citation ${inView ? "is-visible" : ""} mt-16 grid w-full max-w-4xl grid-cols-2 gap-x-6 gap-y-8 border-y border-white/10 py-8 md:mt-20 md:grid-cols-4`}
        >
          {[
            { value: t("finalStat1"), label: t("finalStat1Label"), tilt: "md:-rotate-[1.2deg] md:-translate-y-1", grad: "linear-gradient(135deg, #67E8F9 0%, #CFFAFE 100%)" },
            { value: t("finalStat2"), label: t("finalStat2Label"), tilt: "md:rotate-[1.5deg] md:translate-y-2", grad: "linear-gradient(135deg, #FCD34D 0%, #FEF3C7 100%)" },
            { value: t("finalStat3"), label: t("finalStat3Label"), tilt: "md:-rotate-[0.8deg] md:-translate-y-2", grad: "linear-gradient(135deg, #FDA4AF 0%, #FFE4E6 100%)" },
            { value: t("finalStat4"), label: t("finalStat4Label"), tilt: "md:rotate-[1.0deg] md:translate-y-1", grad: "linear-gradient(135deg, #5EEAD4 0%, #CCFBF1 100%)" },
          ].map((stat, i) => (
            <div key={i} className={`flex flex-col items-center text-center ${stat.tilt}`}>
              <span
                className={`${editorial.className} text-4xl font-semibold leading-none md:text-5xl`}
                style={gradientTextStyle(stat.grad)}
              >
                {stat.value}
              </span>
              <span
                className={`${typewriter.className} mt-3 text-[10px] uppercase tracking-[0.25em] text-white/60`}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          style={{ animationDelay: "5.2s" } as CSSProperties}
          className={`manifeste-citation ${inView ? "is-visible" : ""} mt-16 flex flex-col items-center gap-4 md:mt-20`}
        >
          <p
            className={`${typewriter.className} text-[10px] uppercase tracking-[0.3em] text-cyan-200/50 md:text-xs`}
          >
            {t("ctaSub")}
          </p>
          <button
            type="button"
            onClick={handleCta}
            className="group inline-flex h-14 items-center gap-3 rounded-full bg-white px-8 text-base font-medium text-[#061a44] shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:bg-cyan-100 hover:shadow-xl hover:shadow-cyan-400/40"
          >
            {t("cta")}
            <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}
