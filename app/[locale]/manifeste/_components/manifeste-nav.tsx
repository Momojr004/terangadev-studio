"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useManifesteScroll } from "./scroll-source";

/**
 * Persistent wayfinding for the manifeste route.
 *
 *   - Top      : 2px brand-gradient progress bar.
 *   - Right    : 7 chapter dots. The active dot is "promoted" : it grows
 *                into a bigger orbit with a rotating gradient ring, a
 *                pulsing core, and the chapter title slides in from the
 *                right. The inactive dots become small ticks.
 *   - Bottom   : reuse same scroll source so everything stays synced.
 */
const CHAPTER_COUNT = 7;

export function ManifesteNav() {
  const scroll = useManifesteScroll();
  const locale = useLocale();
  const t = useTranslations("Manifeste");
  const isFr = locale !== "en";
  const labelNav = isFr ? "Navigation chapitres" : "Chapter navigation";
  const labelJump = (n: number) =>
    isFr ? `Aller au chapitre ${n}` : `Go to chapter ${n}`;

  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setProgress(scroll.offset);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [scroll]);

  // 0 means "intro section visible" (no dot is active). 1..7 means the
  // chapter of that number is the dominant section on screen.
  const [activeChapter, setActiveChapter] = useState(0);
  useEffect(() => {
    // Observe chapter-0 (the intro) AND chapter-1..7 so transitions
    // from intro to Ch1 flip the active dot correctly.
    const sections = Array.from({ length: CHAPTER_COUNT + 1 }, (_, i) =>
      document.getElementById(`chapter-${i}`),
    ).filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length === 0) return;
        const id = visible[0].target.id;
        const n = parseInt(id.replace("chapter-", ""), 10);
        if (n >= 0 && n <= CHAPTER_COUNT) setActiveChapter(n);
      },
      {
        threshold: [0.15, 0.35, 0.6],
        rootMargin: "-30% 0px -30% 0px",
      },
    );
    for (const s of sections) observer.observe(s);
    return () => observer.disconnect();
  }, []);

  const jumpTo = (n: number) => {
    const el = document.getElementById(`chapter-${n}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* Top progress bar */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-40 h-[2px] bg-white/8"
      >
        <div
          className="from-teranga-secondary to-teranga-primary h-full bg-gradient-to-r shadow-[0_0_10px_rgba(78,168,249,0.45)] transition-[width] duration-150 ease-out"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>

      {/* Side rail */}
      <nav
        aria-label={labelNav}
        className="fixed top-1/2 right-6 z-40 hidden -translate-y-1/2 md:block"
      >
        <ul className="flex flex-col gap-5">
          {Array.from({ length: CHAPTER_COUNT }, (_, i) => i + 1).map((n) => {
            const active = n === activeChapter;
            const title = t(`chapter0${n}.title` as "chapter01.title");
            return (
              <li key={n} className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => jumpTo(n)}
                  aria-label={labelJump(n)}
                  aria-current={active ? "true" : undefined}
                  className="group flex items-center justify-end gap-3"
                >
                  {/* Chapter title : slides in only when active or hover */}
                  <span
                    className={`whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.28em] transition-all duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] ${
                      active
                        ? "translate-x-0 text-white/85 opacity-100"
                        : "translate-x-2 text-white/0 opacity-0 group-hover:translate-x-0 group-hover:text-white/70 group-hover:opacity-100 group-focus-visible:opacity-100"
                    }`}
                  >
                    <span className="text-teranga-secondary mr-2">0{n}</span>
                    {title}
                  </span>

                  {/* Dot + active orbit */}
                  <span className="relative inline-flex h-8 w-8 items-center justify-center">
                    {/* Background ring (always visible, subtle) */}
                    <span
                      className={`absolute inset-1 rounded-full border transition-all duration-500 ${
                        active
                          ? "border-teranga-secondary/40"
                          : "border-white/0"
                      }`}
                    />

                    {/* Rotating arc — only visible when active */}
                    <svg
                      viewBox="0 0 32 32"
                      className={`absolute inset-0 transition-opacity duration-500 ${
                        active ? "opacity-100" : "opacity-0"
                      }`}
                      style={{
                        animation: active ? "nav-rotate 4s linear infinite" : "none",
                      }}
                      aria-hidden
                    >
                      <defs>
                        <linearGradient id={`nav-grad-${n}`} x1="0" x2="32" y1="0" y2="32" gradientUnits="userSpaceOnUse">
                          <stop offset="0" stopColor="#4EA8F9" />
                          <stop offset="1" stopColor="#0A68F7" />
                        </linearGradient>
                      </defs>
                      <circle
                        cx="16"
                        cy="16"
                        r="13"
                        fill="none"
                        stroke={`url(#nav-grad-${n})`}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeDasharray="40 50"
                      />
                    </svg>

                    {/* Core dot — pulses when active */}
                    <span
                      className={`relative inline-block rounded-full transition-all duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] ${
                        active
                          ? "from-teranga-secondary to-teranga-primary h-3 w-3 bg-gradient-to-br shadow-[0_0_14px_rgba(78,168,249,0.85)]"
                          : "h-1.5 w-1.5 bg-white/30 group-hover:bg-white/80 group-hover:scale-150"
                      }`}
                      style={
                        active
                          ? { animation: "nav-pulse 2.4s ease-in-out infinite" }
                          : undefined
                      }
                    />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <style jsx>{`
          @keyframes nav-rotate {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          @keyframes nav-pulse {
            0%,
            100% {
              box-shadow: 0 0 10px rgba(78, 168, 249, 0.55);
              transform: scale(1);
            }
            50% {
              box-shadow: 0 0 22px rgba(78, 168, 249, 0.95);
              transform: scale(1.18);
            }
          }
        `}</style>
      </nav>
    </>
  );
}
