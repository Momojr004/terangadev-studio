import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { CahierLayer } from "./_components/cahier-layer";
import { ColorScript, FilmOverlay } from "./_components/color-script";
import { GiantSlide } from "./_components/giant-slide";
import { ManifesteCanvas } from "./_components/manifeste-canvas";
import { ManifesteNav } from "./_components/manifeste-nav";
import { ManifesteScrollProvider } from "./_components/scroll-source";
import { ScrollCue } from "./_components/scroll-cue";
import { SkipButton } from "./_components/skip-button";
import { Chapter1Paper } from "./_components/chapter-1-paper";
import { ManifesteIntro } from "./_components/manifeste-intro";
import { Chapter2Cost } from "./_components/chapter-2-cost";
import { Chapter3Excuses } from "./_components/chapter-3-excuses";
import { Chapter4OtherWorld } from "./_components/chapter-4-otherworld";
import { Chapter5Paths } from "./_components/chapter-5-paths";
import { Chapter6Condition } from "./_components/chapter-6-condition";
import { Chapter7Reveal } from "./_components/chapter-7-reveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Manifeste" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    robots: {
      index: false,
      follow: true,
    },
  };
}

/**
 * V4 — « LE CAHIER » : one object, one story, three acts.
 *
 * Fixed layers (bottom → top):
 *  - <ColorScript/>     full-bleed background color, tweened per scene
 *                       (cream → wine → black → navy → cream).
 *  - <ManifesteCanvas/> WebGL particles — only visible in the dark acts
 *                       (opacity scrubbed by the ColorScript triggers).
 *  - <FilmOverlay/>     grain + dark-act vignette, grades everything.
 *  - <CahierLayer/>     the protagonist: a CSS-3D merchant's notebook,
 *                       choreographed across Acte I (#acte-papier).
 *
 * Acts (scrolling content, z-10):
 *  - Acte I  (papier)   : hero → ch.1 → ch.2 → ch.3 — the notebook
 *                         floats, opens, bleeds, loses its pages.
 *  - Acte II (bascule)  : giant slide + expanding window (ch.4) — the
 *                         object dissolves into particles, order forms.
 *  - Acte III (lumière) : ch.5 (pinned horizontal) → ch.6 → ch.7 cream
 *                         finale: « On ne jette pas ton cahier. »
 */
export default async function ManifestePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ManifesteScrollProvider>
      <ColorScript />
      <ManifesteCanvas />
      <FilmOverlay />
      <CahierLayer />
      <ManifesteNav />
      <ScrollCue />
      <main
        id="manifeste-content"
        className="relative z-10 bg-transparent text-white"
      >
        <SkipButton />
        <div id="acte-papier">
          <ManifesteIntro />
          <Chapter1Paper />
          <Chapter2Cost />
          <Chapter3Excuses />
          <GiantSlide />
        </div>
        <Chapter4OtherWorld />
        <Chapter5Paths />
        <Chapter6Condition />
        <Chapter7Reveal />
      </main>
    </ManifesteScrollProvider>
  );
}
