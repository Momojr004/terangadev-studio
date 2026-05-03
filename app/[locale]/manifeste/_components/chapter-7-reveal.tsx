"use client";

import { useRef, type CSSProperties } from "react";
import { useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Newsreader, Special_Elite } from "next/font/google";
import { useRouter } from "@/i18n/navigation";

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

function ConvergingDots() {
  // 24 dots, distributed around the edges, animated to converge toward center
  const positions = Array.from({ length: 24 }, (_, i) => {
    const angle = (i / 24) * Math.PI * 2;
    const radius = 45 + Math.random() * 10;
    return {
      x: 50 + Math.cos(angle) * radius,
      y: 50 + Math.sin(angle) * radius,
      delay: 0.6 + Math.random() * 1.4,
    };
  });

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
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#061a44] px-6 py-24 md:px-16"
    >
      {/* Brand halo center */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(74,168,249,0.18) 0%, transparent 50%)",
        }}
      />

      {/* Converging dots */}
      {inView && <ConvergingDots />}

      {/* Chapter label */}
      <p
        style={{ animationDelay: "0s" } as CSSProperties}
        className={`absolute left-6 top-24 manifeste-citation ${inView ? "is-visible" : ""} ${typewriter.className} text-[10px] uppercase tracking-[0.4em] text-cyan-200/60 md:left-16 md:top-28`}
      >
        {t("label")}
      </p>

      {/* Logo center stack */}
      <div className="relative z-10 flex flex-col items-center text-center">
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
          style={{ animationDelay: "2.0s" } as CSSProperties}
          className={`manifeste-citation ${inView ? "is-visible" : ""} ${editorial.className} mt-6 text-3xl font-semibold tracking-tight text-white md:text-5xl`}
        >
          {t("wordmark")}
        </p>

        {/* Tagline */}
        <p
          style={{ animationDelay: "2.4s" } as CSSProperties}
          className={`manifeste-citation ${inView ? "is-visible" : ""} ${editorial.className} mt-4 text-xl italic tracking-tight text-cyan-100/80 md:text-2xl`}
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
