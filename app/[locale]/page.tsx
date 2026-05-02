import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations("Home");
  return (
    <section className="mx-auto flex min-h-[calc(100dvh-5rem)] max-w-6xl flex-col items-start justify-center gap-10 px-6 py-24">
      <p className="text-teranga-primary font-mono text-xs uppercase tracking-[0.2em]">
        {t("tag")}
      </p>

      <h1 className="font-display text-display-md md:text-display-xl lg:text-display-2xl leading-[1.04] font-medium tracking-tight">
        {t("headlineFirst")}{" "}
        <span className="from-teranga-secondary to-teranga-primary bg-gradient-to-r bg-clip-text text-transparent">
          {t("headlineSecond")}
        </span>
      </h1>

      <p className="text-muted text-body-lg max-w-xl leading-relaxed">
        {t("subhead")}
      </p>

      <div className="flex flex-wrap gap-4">
        <a
          href="#contact"
          className="bg-teranga-primary hover:bg-teranga-secondary inline-flex h-12 items-center rounded-full px-7 text-sm font-medium text-white transition-colors duration-300 [transition-timing-function:var(--ease-expo-out)]"
        >
          {t("ctaPrimary")}
        </a>
        <a
          href="#book"
          className="border-border hover:bg-surface inline-flex h-12 items-center rounded-full border px-7 text-sm font-medium transition-colors duration-300 [transition-timing-function:var(--ease-expo-out)]"
        >
          {t("ctaSecondary")}
        </a>
      </div>

      <div className="border-border text-muted mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t pt-8 font-mono text-xs">
        <span>{t("stat1")}</span>
        <span aria-hidden>·</span>
        <span>{t("stat2")}</span>
        <span aria-hidden>·</span>
        <span>{t("stat3")}</span>
        <span aria-hidden>·</span>
        <span>{t("stat4")}</span>
      </div>
    </section>
  );
}
