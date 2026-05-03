import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ServiceDetail } from "@/components/services/service-detail";
import { JsonLd } from "@/components/seo/json-ld";
import {
  isValidServiceSlug,
  serviceMeta,
  serviceSlugs,
} from "@/lib/services";
import { breadcrumbSchema, serviceSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site-config";

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidServiceSlug(slug)) {
    return {};
  }
  const meta = serviceMeta[slug];
  const t = await getTranslations({ locale, namespace: meta.namespace });
  return {
    title: t("name"),
    description: t("tagline"),
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  if (!isValidServiceSlug(slug)) {
    notFound();
  }

  const meta = serviceMeta[slug];
  const t = await getTranslations({ locale, namespace: meta.namespace });

  const url = `${siteConfig.url}/services/${slug}`;
  const servicesUrl = `${siteConfig.url}/services`;

  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            name: t("name"),
            description: t("description"),
            url,
            priceMin: meta.priceMinFcfa,
            priceMax: meta.priceMaxFcfa,
          }),
          breadcrumbSchema([
            { name: "Accueil", url: siteConfig.url },
            { name: "Services", url: servicesUrl },
            { name: t("name"), url },
          ]),
        ]}
      />
      <ServiceDetail slug={slug} />
    </>
  );
}
