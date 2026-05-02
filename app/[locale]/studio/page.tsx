import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { TeamGrid } from "@/components/team/team-grid";
import { siteConfig } from "@/lib/site-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Studio" });
  return {
    title: t("headline"),
    description: t("subhead"),
  };
}

export default async function StudioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <StudioContent />;
}

function StudioContent() {
  const t = useTranslations("Studio");

  const manifestoPillars = [
    { title: t("manifesto1Title"), body: t("manifesto1Body") },
    { title: t("manifesto2Title"), body: t("manifesto2Body") },
    { title: t("manifesto3Title"), body: t("manifesto3Body") },
    { title: t("manifesto4Title"), body: t("manifesto4Body") },
  ];

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-16 md:pt-28 md:pb-20">
        <p className="text-teranga-primary font-mono text-xs uppercase tracking-[0.2em]">
          {t("tag")}
        </p>
        <h1 className="font-display mt-6 text-5xl leading-[1.04] font-medium tracking-tight md:text-6xl lg:text-7xl xl:text-[5.25rem]">
          {t("headline")}
        </h1>
        <p className="text-muted mt-8 max-w-2xl text-lg leading-relaxed md:text-xl">
          {t("subhead")}
        </p>
      </section>

      {/* History */}
      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="grid gap-12 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-4">
              <p className="text-teranga-primary font-mono text-xs uppercase tracking-[0.2em]">
                {t("historyTitle")}
              </p>
            </div>
            <p className="font-display text-2xl leading-snug tracking-tight md:col-span-8 md:text-3xl">
              {t("historyBody")}
            </p>
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <p className="text-teranga-primary font-mono text-xs uppercase tracking-[0.2em]">
            {t("manifestoTag")}
          </p>
          <h2 className="font-display mt-6 max-w-3xl text-4xl leading-tight font-medium tracking-tight md:text-5xl lg:text-6xl">
            {t("manifestoTitle")}
          </h2>
          <p className="text-muted mt-6 max-w-2xl text-lg leading-relaxed">
            {t("manifestoSubhead")}
          </p>

          <ol className="mt-16 grid gap-x-8 gap-y-12 md:grid-cols-2">
            {manifestoPillars.map((pillar, idx) => (
              <li
                key={idx}
                className="border-border flex flex-col gap-3 border-t pt-6"
              >
                <span className="text-teranga-primary font-mono text-xs">
                  0{idx + 1}
                </span>
                <h3 className="font-display text-2xl leading-tight font-medium tracking-tight">
                  {pillar.title}
                </h3>
                <p className="text-muted text-base leading-relaxed">
                  {pillar.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Team */}
      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            <p className="text-teranga-primary font-mono text-xs uppercase tracking-[0.2em]">
              {t("teamTitle")}
            </p>
            <h2 className="font-display mt-6 text-4xl leading-tight font-medium tracking-tight md:text-5xl lg:text-6xl">
              {t("teamSubhead")}
            </h2>
          </div>
          <TeamGrid className="mt-16" />
        </div>
      </section>

      {/* Stack */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <p className="text-teranga-primary font-mono text-xs uppercase tracking-[0.2em]">
            {t("stackTitle")}
          </p>
          <ul className="text-muted mt-12 flex flex-wrap gap-2 font-mono text-sm">
            {siteConfig.stack.map((tech) => (
              <li
                key={tech}
                className="border-border bg-surface rounded-full border px-4 py-2"
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="border-border bg-surface flex flex-col items-start gap-6 rounded-3xl border p-10 md:flex-row md:items-center md:justify-between md:p-14">
            <h2 className="font-display max-w-2xl text-3xl leading-tight font-medium tracking-tight md:text-4xl">
              {t("ctaHeadline")}
            </h2>
            <Link
              href="/contact"
              className="bg-teranga-primary hover:bg-teranga-secondary inline-flex h-12 shrink-0 items-center gap-2 rounded-full px-7 text-sm font-medium text-white transition-colors duration-300"
            >
              {t("ctaButton")}
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
