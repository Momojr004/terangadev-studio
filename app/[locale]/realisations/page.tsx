import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import {
  setRequestLocale,
  getTranslations,
  getMessages,
} from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { caseSlugs, caseMeta } from "@/lib/cases";

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
    </>
  );
}
