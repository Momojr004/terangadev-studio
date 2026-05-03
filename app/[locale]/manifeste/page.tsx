import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Chapter1Paper } from "./_components/chapter-1-paper";
import { Chapter2Cost } from "./_components/chapter-2-cost";
import { Chapter3Excuses } from "./_components/chapter-3-excuses";
import { Chapter4OtherWorld } from "./_components/chapter-4-otherworld";
import { Chapter5Paths } from "./_components/chapter-5-paths";
import { Chapter6Condition } from "./_components/chapter-6-condition";
import { Chapter7Reveal } from "./_components/chapter-7-reveal";
import { SkipButton } from "./_components/skip-button";

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

export default async function ManifestePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="bg-black text-white" id="manifeste-content">
      <SkipButton />
      <Chapter1Paper />
      <Chapter2Cost />
      <Chapter3Excuses />
      <Chapter4OtherWorld />
      <Chapter5Paths />
      <Chapter6Condition />
      <Chapter7Reveal />
    </main>
  );
}
