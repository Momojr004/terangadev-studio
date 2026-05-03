import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { CaseDetail } from "@/components/cases/case-detail";
import { JsonLd } from "@/components/seo/json-ld";
import { isValidCaseSlug, caseMeta, caseSlugs } from "@/lib/cases";
import { breadcrumbSchema, caseStudySchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site-config";

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

  const meta = caseMeta[slug];
  const t = await getTranslations({ locale, namespace: meta.namespace });

  const url = `${siteConfig.url}/realisations/${slug}`;
  const realisationsUrl = `${siteConfig.url}/realisations`;

  return (
    <>
      <JsonLd
        data={[
          caseStudySchema({
            name: t("name"),
            description: t("tagline"),
            url,
            year: meta.year,
            sector: t("sector"),
          }),
          breadcrumbSchema([
            { name: "Accueil", url: siteConfig.url },
            { name: "Réalisations", url: realisationsUrl },
            { name: t("name"), url },
          ]),
        ]}
      />
      <CaseDetail slug={slug} />
    </>
  );
}
