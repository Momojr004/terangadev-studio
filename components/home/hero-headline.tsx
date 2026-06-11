"use client";

import { useEffect, useRef } from "react";

/**
 * Scramble-decode of the hero headline.
 *
 * On mount, every character starts as a glitch char and locks to its
 * target value at a staggered time, decoding the title in ~1.6s.
 *
 * Perf: writes directly to DOM via refs in a single rAF loop — zero
 * React re-renders during the animation. SSR still emits the full
 * text (good for SEO + reduced-motion users see it instantly).
 */

const GLITCH_CHARS =
  "█▓▒░@#$%&*+=?ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789╲╱┃┏┓┗┛";
const SETTLE_STAGGER_MS = 20;
const SETTLE_START_MS = 220;
const TICK_MS = 60;

function randomGlitch(): string {
  return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)] ?? "█";
}

export function HeroHeadline({
  first,
  second,
}: {
  first: string;
  second: string;
}) {
  const firstRef = useRef<HTMLSpanElement>(null);
  const secondRef = useRef<HTMLSpanElement>(null);
  const firstLen = first.length + 1; // include the joining space

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const target = `${first} ${second}`.split("");
    const settleAt = target.map(
      (_, i) => SETTLE_START_MS + i * SETTLE_STAGGER_MS,
    );

    const start = performance.now();
    let rafId = 0;
    let lastTick = 0;
    const buf = new Array<string>(target.length);

    const loop = (t: number) => {
      if (t - lastTick >= TICK_MS) {
        lastTick = t;
        const elapsed = t - start;
        let allDone = true;
        for (let i = 0; i < target.length; i++) {
          const ch = target[i] as string;
          if (ch === " " || ch === " " || ch === "—") {
            buf[i] = ch;
            continue;
          }
          if (elapsed >= (settleAt[i] as number)) {
            buf[i] = ch;
          } else {
            buf[i] = randomGlitch();
            allDone = false;
          }
        }
        if (firstRef.current) {
          firstRef.current.textContent = buf.slice(0, firstLen).join("");
        }
        if (secondRef.current) {
          secondRef.current.textContent = buf.slice(firstLen).join("");
        }
        if (allDone) return;
      }
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [first, second, firstLen]);

  return (
    <h1 className="font-display max-w-3xl text-5xl leading-[1.04] font-medium tracking-tight md:text-6xl lg:text-7xl xl:text-[5.25rem]">
      <span ref={firstRef} className="whitespace-pre-wrap">
        {first}{" "}
      </span>
      <span
        ref={secondRef}
        className="from-teranga-secondary to-teranga-primary bg-gradient-to-r bg-clip-text whitespace-pre-wrap text-transparent"
      >
        {second}
      </span>
    </h1>
  );
}
