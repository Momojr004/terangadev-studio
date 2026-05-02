import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Rejoindre" });
  return {
    title: t("headline"),
    description: t("subhead"),
  };
}

export default async function RejoindrePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <RejoindreContent />;
}

function RejoindreContent() {
  const t = useTranslations("Rejoindre");

  const howWeWork = [
    { title: t("howWeWork1Title"), body: t("howWeWork1Body") },
    { title: t("howWeWork2Title"), body: t("howWeWork2Body") },
    { title: t("howWeWork3Title"), body: t("howWeWork3Body") },
  ];

  const expectations = [
    t("whatWeLookFor1"),
    t("whatWeLookFor2"),
    t("whatWeLookFor3"),
    t("whatWeLookFor4"),
  ];

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-16 md:pt-28 md:pb-20">
        <p className="text-teranga-primary font-mono text-xs uppercase tracking-[0.2em]">
          {t("tag")}
        </p>
        <h1 className="font-display mt-6 max-w-4xl text-4xl leading-[1.05] font-medium tracking-tight md:text-5xl lg:text-6xl xl:text-7xl">
          {t("headline")}
        </h1>
        <p className="text-muted mt-8 max-w-2xl text-lg leading-relaxed md:text-xl">
          {t("subhead")}
        </p>
      </section>

      {/* How we work */}
      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <p className="text-teranga-primary font-mono text-xs uppercase tracking-[0.2em]">
            {t("howWeWorkTitle")}
          </p>
          <ol className="mt-12 grid gap-8 md:grid-cols-3">
            {howWeWork.map((item, idx) => (
              <li
                key={idx}
                className="border-border flex flex-col gap-3 border-t pt-6"
              >
                <span className="text-teranga-primary font-mono text-xs">
                  0{idx + 1}
                </span>
                <h3 className="font-display text-2xl leading-tight font-medium tracking-tight">
                  {item.title}
                </h3>
                <p className="text-muted text-base leading-relaxed">
                  {item.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* What we look for */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <p className="text-teranga-primary font-mono text-xs uppercase tracking-[0.2em]">
            {t("whatWeLookForTitle")}
          </p>
          <ul className="mt-12 grid gap-x-8 gap-y-6 md:grid-cols-2">
            {expectations.map((expectation, idx) => (
              <li key={idx} className="flex items-start gap-4">
                <CheckCircle2 className="text-teranga-primary mt-0.5 size-5 shrink-0" />
                <p className="text-base leading-relaxed">{expectation}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Spontaneous */}
      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="border-border bg-bg flex flex-col items-start gap-8 rounded-3xl border p-10 md:flex-row md:items-center md:justify-between md:p-14">
            <div className="max-w-2xl">
              <p className="text-teranga-primary font-mono text-xs uppercase tracking-[0.2em]">
                {t("spontaneousTitle")}
              </p>
              <p className="font-display mt-6 text-2xl leading-tight tracking-tight md:text-3xl">
                {t("spontaneousBody")}
              </p>
            </div>
            <a
              href={`mailto:hello@${siteConfig.url.replace("https://", "")}`}
              className="bg-teranga-primary hover:bg-teranga-secondary inline-flex h-12 shrink-0 items-center gap-2 rounded-full px-7 text-sm font-medium text-white transition-colors duration-300"
            >
              {t("spontaneousCta")}
              <ArrowUpRight className="size-4" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
