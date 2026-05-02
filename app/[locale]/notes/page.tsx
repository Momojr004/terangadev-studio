import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "NotesIndex" });
  return {
    title: t("headline"),
    description: t("subhead"),
  };
}

export default async function NotesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <NotesContent />;
}

function NotesContent() {
  const t = useTranslations("NotesIndex");

  const previews = [
    { title: t("preview1Title"), body: t("preview1Body") },
    { title: t("preview2Title"), body: t("preview2Body") },
    { title: t("preview3Title"), body: t("preview3Body") },
  ];

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-12 md:pt-28 md:pb-20">
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

      {/* Coming soon */}
      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <p className="text-teranga-primary font-mono text-xs uppercase tracking-[0.2em]">
            {t("comingSoonTag")}
          </p>
          <h2 className="font-display mt-6 max-w-3xl text-3xl leading-tight font-medium tracking-tight md:text-4xl">
            {t("comingSoonTitle")}
          </h2>
          <p className="text-muted mt-6 max-w-2xl text-base leading-relaxed">
            {t("comingSoonBody")}
          </p>

          <ul className="mt-16 grid gap-6 md:grid-cols-3">
            {previews.map((preview, idx) => (
              <li
                key={idx}
                className="border-border bg-bg flex flex-col gap-4 rounded-2xl border p-8"
              >
                <div className="flex items-center justify-between">
                  <span className="text-teranga-primary font-mono text-xs">
                    0{idx + 1}
                  </span>
                  <span className="border-border text-muted rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em]">
                    {t("previewLabel")}
                  </span>
                </div>
                <h3 className="font-display text-xl leading-tight font-medium tracking-tight">
                  {preview.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {preview.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="border-border bg-surface flex flex-col items-start gap-6 rounded-3xl border p-10 md:flex-row md:items-center md:justify-between md:p-14">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl leading-tight font-medium tracking-tight md:text-4xl">
                {t("ctaHeadline")}
              </h2>
              <p className="text-muted mt-4 text-base leading-relaxed">
                {t("ctaBody")}
              </p>
            </div>
            <a
              href={`mailto:${siteConfig.email}?subject=notes`}
              className="bg-teranga-primary hover:bg-teranga-secondary inline-flex h-12 shrink-0 items-center gap-2 rounded-full px-7 text-sm font-medium text-white transition-colors duration-300"
            >
              {t("ctaButton")}
              <ArrowUpRight className="size-4" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
