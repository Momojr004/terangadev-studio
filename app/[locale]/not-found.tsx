import { useTranslations } from "next-intl";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site-config";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="from-teranga-secondary/15 via-teranga-primary/10 pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b to-transparent"
      />

      <div className="relative mx-auto flex min-h-[calc(100dvh-5rem)] max-w-4xl flex-col items-start justify-center gap-10 px-6 py-24">
        <p className="text-teranga-primary font-mono text-xs uppercase tracking-[0.2em]">
          {t("tag")}
        </p>

        <h1 className="font-display text-5xl leading-[1.04] font-medium tracking-tight md:text-6xl lg:text-7xl">
          {t("headline")}
        </h1>

        <p className="text-muted max-w-xl text-lg leading-relaxed md:text-xl">
          {t("subhead")}
        </p>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/"
            className="bg-teranga-primary hover:bg-teranga-secondary inline-flex h-12 items-center gap-2 rounded-full px-7 text-sm font-medium text-white transition-colors duration-300"
          >
            <ArrowLeft className="size-4" />
            {t("homeCta")}
          </Link>
          <a
            href={`mailto:${siteConfig.email}`}
            className="border-border hover:bg-surface inline-flex h-12 items-center gap-2 rounded-full border px-7 text-sm font-medium transition-colors duration-300"
          >
            {t("contactCta")}
            <ArrowUpRight className="size-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
