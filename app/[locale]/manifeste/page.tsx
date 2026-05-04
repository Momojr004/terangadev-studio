import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ManifesteCanvas } from "./_components/manifeste-canvas";
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
    <main
      id="manifeste-content"
      className="fixed inset-0 bg-[#0A1628] text-white"
    >
      <SkipButton />
      <ManifesteCanvas />
      {/* Kickstart applied via ManifesteCanvas internal effect */}

      {/* Dev pass indicator — remove at final ship V2 */}
      <div className="pointer-events-none absolute bottom-6 left-6 z-10 font-mono text-[10px] uppercase tracking-[0.4em] text-cyan-200/40 md:bottom-8 md:left-8">
        Pass 5 / convergence · Ch1-Ch7
      </div>
    </main>
  );
}
