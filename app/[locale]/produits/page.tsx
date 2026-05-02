import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { ScrollOrchestrator } from "@/components/products/scroll-orchestrator";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "ProductsIndex",
  });
  return {
    title: t("headline"),
    description: t("subhead"),
  };
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ProductsContent />;
}

function ProductsContent() {
  const t = useTranslations("ProductsIndex");
  const tHome = useTranslations("Home");

  return (
    <>
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

        <div className="text-muted mt-12 hidden items-center gap-3 md:flex">
          <ArrowDown className="size-4" />
          <span className="font-mono text-xs uppercase tracking-[0.2em]">
            {t("scrollHint")}
          </span>
        </div>
      </section>

      <ScrollOrchestrator />

      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="border-border bg-surface flex flex-col items-start gap-6 rounded-3xl border p-10 md:flex-row md:items-center md:justify-between md:p-14">
          <div className="max-w-2xl">
            <p className="text-teranga-primary font-mono text-xs uppercase tracking-[0.2em]">
              Prochaine étape
            </p>
            <h2 className="font-display mt-4 text-3xl leading-tight font-medium tracking-tight md:text-4xl">
              Tu vois un de nos verticaux dans ton métier ? Ou tu veux
              construire le tien ?
            </h2>
          </div>
          <Link
            href="/contact"
            className="bg-teranga-primary hover:bg-teranga-secondary inline-flex h-12 shrink-0 items-center gap-2 rounded-full px-7 text-sm font-medium text-white transition-colors duration-300"
          >
            {tHome("ctaPrimary")}
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
