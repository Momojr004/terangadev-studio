import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import {
  setRequestLocale,
  getTranslations,
  getMessages,
} from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  serviceSlugs,
  serviceMeta,
  formatFcfa,
} from "@/lib/services";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ServicesIndex" });
  return {
    title: t("headline"),
    description: t("subhead"),
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = (await getMessages()) as Record<
    string,
    Record<string, string>
  >;

  return <ServicesContent messages={messages} />;
}

function ServicesContent({
  messages,
}: {
  messages: Record<string, Record<string, string>>;
}) {
  const t = useTranslations("ServicesIndex");

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-16 md:pt-28 md:pb-20">
        <p className="text-teranga-primary font-mono text-xs uppercase tracking-[0.2em]">
          {t("tag")}
        </p>
        <h1 className="font-display mt-6 max-w-4xl text-5xl leading-[1.05] font-medium tracking-tight md:text-6xl lg:text-7xl">
          {t("headline")}
        </h1>
        <p className="text-muted mt-8 max-w-2xl text-lg leading-relaxed md:text-xl">
          {t("subhead")}
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <ul className="border-border divide-border divide-y border-y">
          {serviceSlugs.map((slug, idx) => {
            const meta = serviceMeta[slug];
            const ns = messages[meta.namespace];

            let priceDisplay = "";
            let priceLabel = "";
            if (
              meta.priceModel === "range" &&
              meta.priceMinFcfa !== undefined &&
              meta.priceMaxFcfa !== undefined
            ) {
              priceLabel = t("priceRangeLabel");
              priceDisplay = `${formatFcfa(meta.priceMinFcfa)} → ${formatFcfa(meta.priceMaxFcfa)} FCFA`;
            } else if (meta.priceModel === "quote") {
              priceLabel = "";
              priceDisplay = t("priceQuoteLabel");
            } else if (meta.priceModel === "custom") {
              priceLabel = "";
              priceDisplay = t("priceCustomLabel");
            }

            return (
              <li key={slug}>
                <Link
                  href={`/services/${slug}` as never}
                  className="group flex items-start gap-6 py-10 transition-colors duration-300 md:items-baseline md:gap-12 md:py-12"
                >
                  <span className="text-muted hidden font-mono text-xs uppercase tracking-[0.2em] md:block md:w-12 md:pt-2">
                    0{idx + 1}
                  </span>
                  <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-baseline md:gap-12">
                    <h2 className="font-display text-3xl leading-tight font-medium tracking-tight transition-colors group-hover:text-teranga-primary md:flex-1 md:text-4xl">
                      {ns.name}
                    </h2>
                    <p className="text-muted max-w-md text-sm leading-relaxed md:flex-1">
                      {ns.tagline}
                    </p>
                  </div>
                  <div className="hidden flex-col items-end gap-1 md:flex md:w-72 md:text-right">
                    {priceLabel && (
                      <span className="text-muted font-mono text-[10px] uppercase tracking-[0.18em]">
                        {priceLabel}
                      </span>
                    )}
                    <span className="text-fg font-mono text-sm">
                      {priceDisplay}
                    </span>
                  </div>
                  <ArrowUpRight className="text-fg/40 size-5 shrink-0 transition-all duration-500 [transition-timing-function:var(--ease-expo-out)] group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-teranga-primary md:mt-2" />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
