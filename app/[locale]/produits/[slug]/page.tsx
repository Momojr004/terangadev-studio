import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ProductDetail } from "@/components/products/product-detail";
import { JsonLd } from "@/components/seo/json-ld";
import {
  isValidProductSlug,
  productMeta,
  productSlugs,
} from "@/lib/products";
import {
  breadcrumbSchema,
  softwareApplicationSchema,
} from "@/lib/schema";
import { siteConfig } from "@/lib/site-config";

export function generateStaticParams() {
  return productSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidProductSlug(slug)) {
    return {};
  }
  const meta = productMeta[slug];
  const t = await getTranslations({
    locale,
    namespace: meta.namespace,
  });
  return {
    title: t("name"),
    description: t("tagline"),
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  if (!isValidProductSlug(slug)) {
    notFound();
  }

  const meta = productMeta[slug];
  const t = await getTranslations({ locale, namespace: meta.namespace });

  const url = `${siteConfig.url}/produits/${slug}`;
  const productsUrl = `${siteConfig.url}/produits`;

  return (
    <>
      <JsonLd
        data={[
          softwareApplicationSchema({
            name: t("name"),
            description: t("description"),
            url,
            externalUrl: meta.externalUrl,
          }),
          breadcrumbSchema([
            { name: "Accueil", url: siteConfig.url },
            { name: "Produits", url: productsUrl },
            { name: t("name"), url },
          ]),
        ]}
      />
      <ProductDetail slug={slug} />
    </>
  );
}
