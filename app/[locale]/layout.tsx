import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { ConditionalShell } from "@/components/site/conditional-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { routing, type Locale } from "@/i18n/routing";
import { siteConfig } from "@/lib/site-config";
import { organizationSchema } from "@/lib/schema";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: "Site" });

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: `${t("name")} — ${t("tagline")}`,
      template: `%s · ${t("name")}`,
    },
    description: t("description"),
    applicationName: t("name"),
    authors: [{ name: t("name"), url: siteConfig.url }],
    creator: t("name"),
    publisher: t("name"),
    openGraph: {
      type: "website",
      locale: locale === "fr" ? "fr_SN" : "en_US",
      url: siteConfig.url,
      siteName: t("name"),
      title: `${t("name")} — ${t("tagline")}`,
      description: t("description"),
    },
    twitter: {
      card: "summary_large_image",
      title: `${t("name")} — ${t("tagline")}`,
      description: t("description"),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {/* Pure-CSS site-wide backdrop — server-rendered, no client
            component. Sits OUTSIDE LenisProvider to avoid hydration
            interference from ReactLenis root manipulation. The
            manifeste route renders its own stronger backdrop at z:0
            that covers this one. */}
        <div
          aria-hidden
          className="site-backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        >
          <div className="site-blob site-blob--a" />
          <div className="site-blob site-blob--b" />
          <div className="site-blob site-blob--c" />
          <div className="site-vignette" />
        </div>
        <LenisProvider>
          <ConditionalShell header={<Header />} footer={<Footer />}>
            {children}
          </ConditionalShell>
        </LenisProvider>
      </ThemeProvider>
      <JsonLd data={organizationSchema()} />
    </NextIntlClientProvider>
  );
}
