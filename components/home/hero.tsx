import { useTranslations } from "next-intl";

export function Hero() {
  const t = useTranslations("Home");
  return (
    <section className="relative">
      <div className="mx-auto flex min-h-[calc(100dvh-5rem)] max-w-6xl flex-col items-start justify-center gap-10 px-6 py-24">
        <p className="text-teranga-primary font-mono text-xs uppercase tracking-[0.2em]">
          {t("tag")}
        </p>

        <h1 className="font-display text-5xl leading-[1.04] font-medium tracking-tight md:text-6xl lg:text-7xl xl:text-[5.25rem]">
          {t("headlineFirst")}{" "}
          <span className="from-teranga-secondary to-teranga-primary bg-gradient-to-r bg-clip-text text-transparent">
            {t("headlineSecond")}
          </span>
        </h1>

        <p className="text-muted max-w-xl text-lg leading-relaxed md:text-xl">
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
            href="#contact"
            className="border-border hover:bg-surface inline-flex h-12 items-center rounded-full border px-7 text-sm font-medium transition-colors duration-300 [transition-timing-function:var(--ease-expo-out)]"
          >
            {t("ctaSecondary")}
          </a>
        </div>
      </div>
    </section>
  );
}
