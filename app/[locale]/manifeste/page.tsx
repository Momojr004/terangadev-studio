import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Chapter1Paper } from "./_components/chapter-1-paper";
import { Chapter2Cost } from "./_components/chapter-2-cost";
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
    <div className="bg-black text-white">
      <SkipButton />
      <Chapter1Paper />
      <Chapter2Cost />
      {/* Chapters 3 → 7 to come */}
    </div>
  );
}
