"use client";

/**
 * Floating keyword constellation behind the hero title.
 *
 * 10 small monospace words drift slowly across the hero, each on its
 * own loop with desynchronized timing. Sits at ~10% opacity so it
 * never competes with the headline — pure decorative "dimension".
 *
 * Pure CSS animations (driven by keyframes in app/globals.css). No
 * JS state, no per-frame React work.
 */

type Keyword = {
  text: string;
  top: string;
  left: string;
  size: string;
  anim: "driftA" | "driftB" | "driftC";
  duration: number;
  delay: number;
};

// All keywords sit in the RIGHT half of the hero (≥ 55% from left),
// the same zone as the WebGL canvas — they decorate that area without
// landing on top of the title/subhead/CTA which all live on the left.
// On mobile (md:hidden parent) the layer is hidden entirely.
const KEYWORDS: Keyword[] = [
  { text: "SaaS",     top: "10%", left: "62%", size: "text-sm",  anim: "driftA", duration: 28, delay: 0 },
  { text: "Dakar",    top: "16%", left: "88%", size: "text-base", anim: "driftB", duration: 34, delay: -4 },
  { text: "MVP",      top: "26%", left: "74%", size: "text-xs",  anim: "driftC", duration: 30, delay: -9 },
  { text: "ship",     top: "36%", left: "92%", size: "text-lg",  anim: "driftB", duration: 38, delay: -14 },
  { text: "code",     top: "44%", left: "68%", size: "text-sm",  anim: "driftA", duration: 32, delay: -6 },
  { text: "Mobile",   top: "54%", left: "82%", size: "text-base", anim: "driftC", duration: 36, delay: -18 },
  { text: "DevOps",   top: "62%", left: "60%", size: "text-sm",  anim: "driftB", duration: 40, delay: -22 },
  { text: "Senegal",  top: "72%", left: "84%", size: "text-xs",  anim: "driftA", duration: 26, delay: -3 },
  { text: "Design",   top: "80%", left: "70%", size: "text-sm",  anim: "driftC", duration: 34, delay: -11 },
  { text: "Studio",   top: "88%", left: "90%", size: "text-base", anim: "driftB", duration: 30, delay: -16 },
];

export function HeroKeywords() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block"
    >
      {KEYWORDS.map((k, i) => (
        <span
          key={i}
          className={`hero-keyword absolute font-mono uppercase tracking-[0.25em] ${k.size}`}
          style={{
            top: k.top,
            left: k.left,
            animationName: `heroKeyword_${k.anim}`,
            animationDuration: `${k.duration}s`,
            animationDelay: `${k.delay}s`,
            animationIterationCount: "infinite",
            animationTimingFunction: "ease-in-out",
            animationDirection: "alternate",
          }}
        >
          {k.text}
        </span>
      ))}
    </div>
  );
}
