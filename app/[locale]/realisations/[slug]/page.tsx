import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { CaseDetail } from "@/components/cases/case-detail";
import { isValidCaseSlug, caseMeta, caseSlugs } from "@/lib/cases";

export function generateStaticParams() {
  return caseSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidCaseSlug(slug)) {
    return {};
  }
  const meta = caseMeta[slug];
  const t = await getTranslations({ locale, namespace: meta.namespace });
  return {
    title: t("name"),
    description: t("tagline"),
  };
}

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  if (!isValidCaseSlug(slug)) {
    notFound();
  }

  return <CaseDetail slug={slug} />;
}
