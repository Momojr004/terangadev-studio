import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ProductDetail } from "@/components/products/product-detail";
import {
  isValidProductSlug,
  productMeta,
  productSlugs,
} from "@/lib/products";

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

  return <ProductDetail slug={slug} />;
}
