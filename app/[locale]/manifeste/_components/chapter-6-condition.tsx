"use client";

import { useRef, type CSSProperties } from "react";
import { useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { Plus_Jakarta_Sans, Special_Elite, JetBrains_Mono } from "next/font/google";
import { ChapterHeader } from "./chapter-header";
import { ChapterAtmosphere } from "./chapter-atmosphere";

const editorial = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const typewriter = Special_Elite({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

/**
 * Visual identity per condition — accent color, scattered keyword
 * positions, micro decoration + a hand-drawn-style icon that fills
 * the right side and replaces the previous large empty space.
 */
type ConditionStyle = {
  accent: string;
  accentText: string;
  glow: string;
  kwPositions: { top: string; left: string; rotate: number; size: string }[];
  /** Inline SVG markup for the illustration */
  illustration: (color: string) => React.ReactNode;
};

// Illustrations — minimal stroke SVGs sized to fill the right empty
// space. Each one references the condition's topic (code, team, time,
// infrastructure) in a clearly hand-built feel.
const IllCode = (color: string) => (
  <svg viewBox="0 0 200 200" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    {/* Repo bracket on the left */}
    <path d="M50 60 L30 100 L50 140" />
    {/* Repo bracket on the right */}
    <path d="M150 60 L170 100 L150 140" />
    {/* Code lines, with a few highlighted in accent */}
    <line x1="70" y1="80" x2="130" y2="80" opacity="0.5" />
    <line x1="70" y1="92" x2="118" y2="92" opacity="0.7" />
    <line x1="78" y1="104" x2="135" y2="104" opacity="0.45" />
    <line x1="70" y1="116" x2="110" y2="116" opacity="0.8" />
    <line x1="78" y1="128" x2="125" y2="128" opacity="0.5" />
    {/* Schema tag */}
    <rect x="60" y="40" width="80" height="14" rx="3" opacity="0.6" />
    <text x="68" y="50" fill={color} fontSize="9" fontFamily="monospace">{"schemas.ts"}</text>
  </svg>
);

const IllTeam = (color: string) => (
  <svg viewBox="0 0 200 200" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    {/* Six people forming a constellation around a center node (Dakar) */}
    <circle cx="100" cy="100" r="6" fill={color} opacity="0.9" />
    <text x="80" y="118" fill={color} fontSize="9" fontFamily="monospace" opacity="0.7">DAKAR</text>
    {[
      [40, 60], [160, 60], [30, 130], [170, 130], [100, 30], [100, 170],
    ].map(([x, y], i) => (
      <g key={i}>
        <line x1="100" y1="100" x2={x} y2={y} opacity="0.35" />
        <circle cx={x} cy={y} r="4" />
        <circle cx={x} cy={y - 8} r="3" />
      </g>
    ))}
  </svg>
);

const IllTime = (color: string) => (
  <svg viewBox="0 0 200 200" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    {/* Gantt-style timeline with three segments */}
    <line x1="20" y1="100" x2="180" y2="100" opacity="0.4" />
    {[0, 1, 2, 3, 4].map((i) => (
      <line key={i} x1={30 + i * 35} y1="95" x2={30 + i * 35} y2="105" opacity="0.4" />
    ))}
    <rect x="30" y="60" width="50" height="14" rx="2" opacity="0.7" />
    <rect x="80" y="80" width="60" height="14" rx="2" opacity="0.7" />
    <rect x="140" y="110" width="40" height="14" rx="2" opacity="0.7" />
    {/* Validation marks */}
    {[55, 110, 160].map((x, i) => (
      <g key={i}>
        <circle cx={x} cy="135" r="6" />
        <path d={`M${x - 3} 135 l 2 2 l 4 -4`} stroke={color} strokeWidth="1.4" />
      </g>
    ))}
    <text x="20" y="160" fontSize="9" fontFamily="monospace" fill={color} opacity="0.6">{"phase 01 → 02 → 03"}</text>
  </svg>
);

const IllInfra = (color: string) => (
  <svg viewBox="0 0 200 200" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    {/* Server stack */}
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <rect x="40" y={70 + i * 22} width="80" height="16" rx="2" />
        <circle cx="50" cy={78 + i * 22} r="2" fill={color} />
        <line x1="60" y1={78 + i * 22} x2="110" y2={78 + i * 22} opacity="0.4" />
      </g>
    ))}
    {/* Map of options to the right */}
    <line x1="130" y1="80" x2="170" y2="80" opacity="0.35" />
    <line x1="130" y1="100" x2="170" y2="100" opacity="0.35" />
    <line x1="130" y1="120" x2="170" y2="120" opacity="0.35" />
    <text x="135" y="82" fontSize="8" fontFamily="monospace" fill={color}>OVH</text>
    <text x="135" y="102" fontSize="8" fontFamily="monospace" fill={color}>ORACLE</text>
    <text x="135" y="122" fontSize="8" fontFamily="monospace" fill={color}>GCP</text>
    {/* Globe */}
    <circle cx="100" cy="40" r="14" />
    <ellipse cx="100" cy="40" rx="14" ry="5" opacity="0.5" />
    <line x1="86" y1="40" x2="114" y2="40" opacity="0.5" />
  </svg>
);

const STYLES: ConditionStyle[] = [
  {
    accent: "text-cyan-300/80",
    accentText: "rgba(125,211,192,1)",
    glow: "radial-gradient(circle, rgba(125,211,192,0.10) 0%, transparent 55%)",
    kwPositions: [
      { top: "6%", left: "4%", rotate: -3, size: "text-xs" },
      { top: "10%", left: "62%", rotate: 4, size: "text-xs" },
      { top: "94%", left: "5%", rotate: -2, size: "text-xs" },
      { top: "94%", left: "42%", rotate: 5, size: "text-xs" },
      { top: "94%", left: "75%", rotate: -1, size: "text-xs" },
    ],
    illustration: IllCode,
  },
  {
    accent: "text-amber-200/80",
    accentText: "rgba(252,211,77,1)",
    glow: "radial-gradient(circle, rgba(252,211,77,0.08) 0%, transparent 55%)",
    kwPositions: [
      { top: "5%", left: "4%", rotate: 3, size: "text-xs" },
      { top: "9%", left: "55%", rotate: -4, size: "text-xs" },
      { top: "93%", left: "4%", rotate: 2, size: "text-xs" },
      { top: "93%", left: "44%", rotate: -3, size: "text-xs" },
      { top: "93%", left: "78%", rotate: 4, size: "text-xs" },
    ],
    illustration: IllTeam,
  },
  {
    accent: "text-rose-200/80",
    accentText: "rgba(253,164,175,1)",
    glow: "radial-gradient(circle, rgba(253,164,175,0.08) 0%, transparent 55%)",
    kwPositions: [
      { top: "5%", left: "3%", rotate: -2, size: "text-xs" },
      { top: "8%", left: "62%", rotate: 5, size: "text-xs" },
      { top: "92%", left: "5%", rotate: -4, size: "text-xs" },
      { top: "94%", left: "46%", rotate: 3, size: "text-xs" },
      { top: "92%", left: "78%", rotate: -1, size: "text-xs" },
    ],
    illustration: IllTime,
  },
  {
    accent: "text-teal-200/80",
    accentText: "rgba(94,234,212,1)",
    glow: "radial-gradient(circle, rgba(94,234,212,0.10) 0%, transparent 55%)",
    kwPositions: [
      { top: "6%", left: "4%", rotate: 4, size: "text-xs" },
      { top: "9%", left: "58%", rotate: -3, size: "text-xs" },
      { top: "92%", left: "5%", rotate: 2, size: "text-xs" },
      { top: "94%", left: "44%", rotate: -5, size: "text-xs" },
      { top: "92%", left: "76%", rotate: 1, size: "text-xs" },
    ],
    illustration: IllInfra,
  },
];

function SilentPhrase({
  number,
  text,
  note,
  keywords,
}: {
  number: number;
  text: string;
  note?: string;
  keywords: string[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-25% 0px -25% 0px" });
  const style = STYLES[number - 1];

  return (
    <div
      ref={ref}
      className="relative flex min-h-[75vh] items-center overflow-hidden border-t border-white/[0.04] px-6 py-16 md:min-h-[80vh] md:px-16 md:py-20 lg:px-24"
    >
      {/* Accent glow per condition — soft halo in the assigned hue. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: style.glow }}
      />

      {/* Decorative number echo — huge faded numeral pinned to the
          bottom-right where there is no chapter copy, so it adds scale
          contrast without clipping the title. */}
      <span
        aria-hidden
        className="font-display pointer-events-none absolute right-[-3rem] bottom-[-5rem] hidden text-[20rem] leading-none font-medium tracking-tight text-white/[0.045] md:block md:text-[26rem]"
      >
        {String(number).padStart(2, "0")}
      </span>

      {/* Scattered keywords — small mono tags placed around the main
          phrase. Hidden under md so mobile stays clean. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden md:block"
      >
        {keywords.map((kw, i) => {
          const pos = style.kwPositions[i] ?? style.kwPositions[0];
          return (
            <span
              key={i}
              style={
                {
                  top: pos.top,
                  left: pos.left,
                  transform: `rotate(${pos.rotate}deg)`,
                  color: style.accentText,
                  opacity: inView ? 0.7 : 0,
                  transition: `opacity 0.9s ease-out ${0.4 + i * 0.15}s`,
                } as CSSProperties
              }
              className={`${mono.className} absolute ${pos.size} uppercase tracking-[0.18em]`}
            >
              {kw}
            </span>
          );
        })}
      </div>

      <div className="relative z-10 grid w-full max-w-6xl gap-8 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-6">
          <p
            style={{ animationDelay: "0s" } as CSSProperties}
            className={`manifeste-citation ${inView ? "is-visible" : ""} ${typewriter.className} ${style.accent} text-[10px] uppercase tracking-[0.4em] md:text-xs`}
          >
            Condition {String(number).padStart(2, "0")} / 04
          </p>
          <p
            style={{ animationDelay: "0.4s" } as CSSProperties}
            className={`manifeste-citation ${inView ? "is-visible" : ""} ${editorial.className} mt-6 text-3xl leading-[1.06] tracking-tight text-white md:mt-8 md:text-5xl lg:text-6xl`}
          >
            {text}
          </p>
        </div>

        {/* Illustration column — fills the visual void to the right of
            the title with a topic-specific minimal stroke drawing. */}
        <div className="relative hidden md:col-span-3 md:flex md:items-center md:justify-center">
          <div
            style={{
              opacity: inView ? 0.7 : 0,
              transform: inView ? "scale(1) rotate(0)" : "scale(0.92) rotate(-2deg)",
              transition:
                "opacity 1.1s cubic-bezier(0.16,1,0.3,1) 0.6s, transform 1.1s cubic-bezier(0.16,1,0.3,1) 0.6s",
            }}
            className="aspect-square w-full max-w-[260px]"
          >
            {style.illustration(style.accentText)}
          </div>
        </div>

        {note && (
          <aside
            className={`md:col-span-3 md:translate-y-6 ${number % 2 === 0 ? "md:-rotate-[0.5deg]" : "md:rotate-[0.5deg]"} md:pt-4 md:border-l md:border-white/10 md:pl-6`}
          >
            <p
              style={{ animationDelay: "0.9s" } as CSSProperties}
              className={`manifeste-citation ${inView ? "is-visible" : ""} ${typewriter.className} ${style.accent} text-[10px] uppercase tracking-[0.3em]`}
            >
              Concrètement
            </p>
            <p
              style={{ animationDelay: "1.1s" } as CSSProperties}
              className={`manifeste-citation ${inView ? "is-visible" : ""} mt-4 text-base leading-snug text-white/80 md:text-lg`}
            >
              {note}
            </p>
            <span
              aria-hidden
              className={`${mono.className} mt-6 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] ${style.accent}`}
            >
              <span
                className="inline-block h-px w-8"
                style={{ background: style.accentText, opacity: 0.6 }}
              />
              Non négociable
            </span>
          </aside>
        )}
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

  const conditions = [1, 2, 3, 4].map((n) => ({
    text: t(`condition${n}` as "condition1"),
    note: t(`conditionNote${n}` as "conditionNote1"),
    keywords: [1, 2, 3, 4, 5].map((k) =>
      t(`kw${n}_${k}` as "kw1_1"),
    ),
  }));

  return (
    <section id="chapter-6" className="relative">
      {/* Narrative atmosphere : 4 dots pulsing (= 4 conditions) */}
      <ChapterAtmosphere kind="pulse" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(74,168,249,0.05) 0%, transparent 60%)",
        }}
      />

      {/* Intro section : preview the four conditions as colored mono
          dots so the reader knows what's coming. Breaks the rectangle. */}
      <section
        ref={introRef}
        className="relative flex min-h-dvh flex-col justify-center overflow-hidden px-6 md:px-16 lg:px-24"
      >
        <ChapterHeader index={6} title={t("title")} theme="brand" />
        <p
          style={{ animationDelay: "0.5s" } as CSSProperties}
          className={`manifeste-citation ${introInView ? "is-visible" : ""} ${editorial.className} mt-4 max-w-4xl text-4xl leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl`}
        >
          {t("intro")}
        </p>

        {/* Scattered preview of the 4 conditions — each card lives at
            its own safe absolute position so they never wrap into each
            other, but the layout still reads as editorial scatter, not
            a clean table. Cards inherit their accent color + a unique
            tilt. */}
        <div className="relative mt-12 hidden h-[360px] md:mt-16 md:block">
          {STYLES.map((s, i) => {
            const positions = [
              { top: "0%", left: "0%", rotate: -3 },
              { top: "18%", left: "42%", rotate: 2.5 },
              { top: "52%", left: "8%", rotate: -1.5 },
              { top: "62%", left: "48%", rotate: 3 },
            ];
            const pos = positions[i];
            return (
              <div
                key={i}
                style={
                  {
                    top: pos.top,
                    left: pos.left,
                    transform: `rotate(${pos.rotate}deg)`,
                    transitionDelay: `${1.4 + i * 0.15}s`,
                  } as CSSProperties
                }
                className={`manifeste-citation ${introInView ? "is-visible" : ""} ${mono.className} absolute max-w-[420px]`}
              >
                <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] md:text-xs">
                  <span
                    className="inline-block size-2 shrink-0 rounded-full"
                    style={{
                      background: s.accentText,
                      boxShadow: `0 0 12px ${s.accentText}`,
                    }}
                  />
                  <span
                    className="font-medium"
                    style={{ color: s.accentText }}
                  >
                    0{i + 1}
                  </span>
                  <span
                    className="inline-block h-px w-8 shrink-0"
                    style={{ background: s.accentText, opacity: 0.6 }}
                  />
                  <span className="text-white/80">
                    {t(`condition${i + 1}` as "condition1")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile : simple stacked list (no scatter on small screens) */}
        <ul className="mt-10 flex flex-col gap-3 md:hidden">
          {STYLES.map((s, i) => (
            <li
              key={i}
              className={`${mono.className} flex items-center gap-3 text-[10px] uppercase tracking-[0.25em]`}
            >
              <span
                className="inline-block size-2 shrink-0 rounded-full"
                style={{ background: s.accentText }}
              />
              <span style={{ color: s.accentText }}>0{i + 1}</span>
              <span className="text-white/70">
                {t(`condition${i + 1}` as "condition1")}
              </span>
            </li>
          ))}
        </ul>

        <p
          style={{ animationDelay: "1.8s" } as CSSProperties}
          className={`manifeste-citation ${introInView ? "is-visible" : ""} ${typewriter.className} mt-16 text-[10px] uppercase tracking-[0.4em] text-cyan-200/40 md:text-xs`}
        >
          ↓ continue
        </p>

        {/* Decorative scatter — small marks behind the intro that break
            the visual rectangle. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden md:block"
        >
          <span className="text-cyan-300/30 absolute top-[14%] right-[10%] font-mono text-xl rotate-[-4deg]">
            +
          </span>
          <span className="text-amber-200/25 absolute top-[28%] right-[18%] font-mono text-xs uppercase tracking-[0.4em]">
            non négociable
          </span>
          <span className="absolute top-[58%] right-[8%] inline-block h-px w-16 rotate-[24deg] bg-white/20" />
          <span className="text-rose-200/30 absolute bottom-[18%] right-[14%] font-mono text-2xl rotate-[6deg]">
            ✱
          </span>
        </div>
      </section>

      {conditions.map((c, i) => (
        <SilentPhrase
          key={i}
          number={i + 1}
          text={c.text}
          note={c.note}
          keywords={c.keywords}
        />
      ))}
    </section>
  );
}
