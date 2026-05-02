import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ServiceDetail } from "@/components/services/service-detail";
import {
  isValidServiceSlug,
  serviceMeta,
  serviceSlugs,
} from "@/lib/services";

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

  return <ServiceDetail slug={slug} />;
}
