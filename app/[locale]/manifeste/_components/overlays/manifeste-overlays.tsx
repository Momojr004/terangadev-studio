"use client";

import { ChapterText } from "./chapter-text";

/**
 * Pass 6 — kinetic typography overlays for the 7 chapters.
 *
 * Texts are inlined here as FR drafts; once narrative is locked, lift
 * to next-intl messages under namespace "Manifeste.chapters". Each
 * ChapterText computes its own scroll window by chapterIndex (see
 * CHAPTER_WINDOWS in chapter-text.tsx).
 *
 * The wrapper is rendered inside <Scroll html> in manifeste-canvas.tsx
 * so useScroll()/useFrame() resolve against the same R3F context that
 * drives the WebGL scene. No GSAP ScrollTrigger involved — single
 * source of scroll truth remains drei's ScrollControls.
 */

const CHAPTERS: Array<{ eyebrow?: string; text: string }> = [
  {
    eyebrow: "Ch. 1 — L'horizon",
    text: "Du large,\nl'horizon paraît clair.",
  },
  {
    eyebrow: "Ch. 2 — La houle",
    text: "Mais le large\nefface tout.",
  },
  {
    eyebrow: "Ch. 3 — La transformation",
    text: "Une idée se dresse,\nretombe,\nse relève.",
  },
  {
    eyebrow: "Ch. 4 — La traversée",
    text: "À un moment précis,\nl'eau devient code.",
  },
  {
    eyebrow: "Ch. 5 — La structure",
    text: "Une terre émerge.\nDu roc, posé.",
  },
  {
    eyebrow: "Ch. 6 — Le réseau",
    text: "Plateau. Almadies. Yoff.\nUn réseau, un battement.",
  },
  {
    eyebrow: "Ch. 7 — Le nœud central",
    text: "Au centre,\nun nœud.\nTerangaDev.",
  },
];

export function ManifesteOverlays() {
  return (
    <>
      {CHAPTERS.map((chapter, i) => (
        <ChapterText
          key={i}
          chapterIndex={i}
          text={chapter.text}
          eyebrow={chapter.eyebrow}
        />
      ))}
    </>
  );
}
