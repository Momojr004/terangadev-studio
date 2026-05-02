import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { productSlugs } from "@/lib/products";
import { caseSlugs } from "@/lib/cases";
import { serviceSlugs } from "@/lib/services";

const baseUrl = "https://terangadev.com";

const staticPaths = [
  "",
  "/produits",
  "/realisations",
  "/services",
  "/studio",
  "/rejoindre",
  "/contact",
  "/notes",
  "/mentions-legales",
  "/confidentialite",
] as const;

function buildUrl(locale: string, path: string): string {
  if (locale === routing.defaultLocale) {
    return `${baseUrl}${path}`;
  }
  return `${baseUrl}/${locale}${path}`;
}

function buildAlternates(path: string): Record<string, string> {
  return Object.fromEntries(
    routing.locales.map((l) => [l, buildUrl(l, path)]),
  );
}

export default function sitemap(): MetadataRoute.Sitemap {
  const dynamicPaths = [
    ...productSlugs.map((slug) => `/produits/${slug}`),
    ...caseSlugs.map((slug) => `/realisations/${slug}`),
    ...serviceSlugs.map((slug) => `/services/${slug}`),
  ];

  const allPaths = [...staticPaths, ...dynamicPaths];
  const lastModified = new Date();

  return allPaths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: buildUrl(locale, path),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1.0 : path.startsWith("/notes") ? 0.6 : 0.8,
      alternates: { languages: buildAlternates(path) },
    })),
  );
}
