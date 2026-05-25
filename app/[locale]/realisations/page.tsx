import type { Metadata } from "next";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import {
  setRequestLocale,
  getTranslations,
  getMessages,
} from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { caseSlugs, caseMeta } from "@/lib/cases";
import {
  portfolioEntries,
  CATEGORY_LABELS_FR,
  CATEGORY_LABELS_EN,
} from "@/lib/portfolio";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "WorkIndex" });
  return {
    title: t("headline"),
    description: t("subhead"),
  };
}

export default async function RealisationsPage({
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

  return <RealisationsContent messages={messages} />;
}

function RealisationsContent({
  messages,
}: {
  messages: Record<string, Record<string, string>>;
}) {
  const t = useTranslations("WorkIndex");
  const locale = useLocale();
  const categoryLabels = locale === "en" ? CATEGORY_LABELS_EN : CATEGORY_LABELS_FR;
  const moreLabel = locale === "en" ? "More projects" : "Plus de projets";
  const moreSubhead =
    locale === "en"
      ? "Showcase sites, e-commerce, internal platforms — what we shipped without writing a full case study."
      : "Sites vitrines, e-commerce, plateformes internes — ce qu'on a livré sans écrire un cas détaillé.";
  const visitSite = locale === "en" ? "Visit" : "Voir le site";

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

      {/* Headlining cases — deep case studies */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <ul className="border-border divide-border divide-y border-y">
          {caseSlugs.map((slug, idx) => {
            const meta = caseMeta[slug];
            const ns = messages[meta.namespace];
            return (
              <li key={slug}>
                <Link
                  href={`/realisations/${slug}` as never}
                  className="group flex items-baseline gap-6 py-10 transition-colors duration-300 md:gap-12 md:py-14"
                >
                  <span className="text-muted hidden font-mono text-xs uppercase tracking-[0.2em] md:block md:w-12">
                    0{idx + 1}
                  </span>
                  <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-baseline md:gap-12">
                    <h2 className="font-display text-4xl leading-tight font-medium tracking-tight transition-colors group-hover:text-teranga-primary md:flex-1 md:text-5xl">
                      {ns.name}
                    </h2>
                    <p className="text-muted font-mono text-xs uppercase tracking-[0.15em] md:w-72">
                      {ns.sector}
                    </p>
                    <p className="text-muted max-w-md text-sm leading-relaxed md:flex-1">
                      {ns.tagline}
                    </p>
                  </div>
                  <div className="text-muted hidden font-mono text-xs uppercase tracking-[0.2em] md:block md:w-20 md:text-right">
                    {t("yearLabel")} {meta.year}
                  </div>
                  <ArrowUpRight className="text-fg/40 size-5 shrink-0 transition-all duration-500 [transition-timing-function:var(--ease-expo-out)] group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-teranga-primary" />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* More projects — portfolio grid (no detail page, just card + link
          to live site). Pulled from /lib/portfolio.ts and the legacy
          screenshots are kept in /public/portfolio/. */}
      <section className="mx-auto max-w-6xl px-6 pb-24 md:pb-32">
        <div className="mb-12 flex items-baseline justify-between gap-6 md:mb-16">
          <div>
            <p className="text-teranga-primary font-mono text-xs uppercase tracking-[0.2em]">
              {moreLabel}
            </p>
            <h2 className="font-display mt-4 max-w-2xl text-3xl leading-tight font-medium tracking-tight md:text-4xl lg:text-5xl">
              {moreSubhead}
            </h2>
          </div>
          <span className="text-muted hidden shrink-0 font-mono text-xs uppercase tracking-[0.2em] md:block">
            {portfolioEntries.length} projets
          </span>
        </div>

        {/* Portfolio entries — alternating layout (image right / left),
            ~60vh per item so 1.5-2 projects share a scroll viewport.
            Large image, big typography, visible visit CTA. */}
        <ul className="flex flex-col gap-12 md:gap-20">
          {portfolioEntries.map((entry, idx) => {
            const reversed = idx % 2 === 1;
            return (
              <li
                key={entry.id}
                className="flex items-center md:min-h-[60vh]"
              >
                <a
                  href={entry.url ?? "#"}
                  target={entry.url ? "_blank" : undefined}
                  rel={entry.url ? "noreferrer" : undefined}
                  className={`group grid w-full items-center gap-10 md:grid-cols-2 md:gap-16 ${reversed ? "md:[&>*:first-child]:order-2" : ""}`}
                >
                  <div className="border-border bg-bg relative aspect-[4/3] w-full overflow-hidden rounded-3xl border shadow-sm transition-shadow duration-500 group-hover:shadow-xl [transition-timing-function:var(--ease-expo-out)]">
                    <Image
                      src={entry.image}
                      alt={`Aperçu de ${entry.title}`}
                      width={1200}
                      height={900}
                      sizes="(min-width: 768px) 45vw, 92vw"
                      className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 [transition-timing-function:var(--ease-expo-out)] group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                      <span className="text-teranga-primary font-mono text-[10px] uppercase tracking-[0.25em]">
                        {categoryLabels[entry.category]}
                      </span>
                      <span className="text-muted/60 font-mono text-[10px]">
                        ·
                      </span>
                      <span className="text-muted font-mono text-[10px] uppercase tracking-[0.25em]">
                        {entry.year}
                      </span>
                    </div>
                    <h3 className="font-display text-4xl leading-tight font-medium tracking-tight md:text-5xl lg:text-6xl group-hover:text-teranga-primary transition-colors duration-500 [transition-timing-function:var(--ease-expo-out)]">
                      {entry.title}
                    </h3>
                    <p className="text-muted max-w-xl text-base leading-relaxed md:text-lg">
                      {entry.description}
                    </p>
                    {entry.url && (
                      <span className="text-teranga-primary mt-2 inline-flex items-center gap-2 text-sm font-medium transition-transform duration-300 group-hover:translate-x-1 [transition-timing-function:var(--ease-expo-out)]">
                        {visitSite}
                        <ArrowUpRight className="size-4" />
                      </span>
                    )}
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
