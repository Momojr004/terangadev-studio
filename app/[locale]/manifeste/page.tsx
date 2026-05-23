import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ManifesteCanvas } from "./_components/manifeste-canvas";
import { ManifesteNav } from "./_components/manifeste-nav";
import { ManifesteScrollProvider } from "./_components/scroll-source";
import { SkipButton } from "./_components/skip-button";
import { Chapter1Paper } from "./_components/chapter-1-paper";
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
 * V3 layout:
 *  - <ManifesteCanvas/> is `position: fixed; pointer-events: none; z:0`
 *    behind everything, so it stays pinned while the document scrolls.
 *  - The 7 chapters are rendered as a normal vertical stack — each is
 *    `min-h-dvh` with its own background (paper, dark, etc.), creating
 *    natural scroll height (~7 viewports).
 *  - <ManifesteScrollProvider/> wraps the whole thing so R3F components
 *    inside the Canvas can read scroll progress (0..1) without colliding
 *    with the i18n context that the chapters need.
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
      <ManifesteCanvas />
      <ManifesteNav />
      <main
        id="manifeste-content"
        className="relative z-10 bg-transparent text-white"
      >
        <SkipButton />
        <Chapter1Paper />
        <Chapter2Cost />
        <Chapter3Excuses />
        <Chapter4OtherWorld />
        <Chapter5Paths />
        <Chapter6Condition />
        <Chapter7Reveal />
      </main>
    </ManifesteScrollProvider>
  );
}
