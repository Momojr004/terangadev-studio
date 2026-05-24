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

        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {portfolioEntries.map((entry) => (
            <li key={entry.id}>
              <a
                href={entry.url ?? "#"}
                target={entry.url ? "_blank" : undefined}
                rel={entry.url ? "noreferrer" : undefined}
                className="border-border bg-bg hover:border-teranga-primary/40 group flex h-full flex-col overflow-hidden rounded-2xl border transition-colors duration-300"
              >
                <div className="border-border bg-surface relative aspect-[16/10] w-full overflow-hidden border-b">
                  <Image
                    src={entry.image}
                    alt={`Aperçu de ${entry.title}`}
                    width={800}
                    height={500}
                    sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
                    className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 [transition-timing-function:var(--ease-expo-out)] group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-teranga-primary font-mono text-[10px] uppercase tracking-[0.2em]">
                      {categoryLabels[entry.category]}
                    </span>
                    <span className="text-muted font-mono text-[10px] uppercase tracking-[0.2em]">
                      {entry.year}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl leading-tight font-medium tracking-tight group-hover:text-teranga-primary transition-colors">
                    {entry.title}
                  </h3>
                  <p className="text-muted mt-auto text-sm leading-relaxed">
                    {entry.description}
                  </p>
                  {entry.url && (
                    <span className="text-teranga-primary mt-3 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.18em] transition-transform group-hover:translate-x-1">
                      {visitSite}
                      <ArrowUpRight className="size-3.5" />
                    </span>
                  )}
                </div>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
