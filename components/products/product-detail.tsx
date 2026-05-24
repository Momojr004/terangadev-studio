import { ArrowLeft, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { productMeta, type ProductSlug } from "@/lib/products";
import { cn } from "@/lib/cn";
import { InterestForm } from "./interest-form";
import { ProductPreview } from "./product-preview";

export function ProductDetail({ slug }: { slug: ProductSlug }) {
  const meta = productMeta[slug];
  const t = useTranslations(meta.namespace);
  const tDetail = useTranslations("ProductDetail");

  const isLive = meta.status === "LIVE";
  const features = [
    t("feature1"),
    t("feature2"),
    t("feature3"),
    t("feature4"),
  ];
  const metrics = [t("metric1"), t("metric2"), t("metric3")];

  return (
    <article>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 pt-12 pb-20 md:pt-16 md:pb-32">
          <Link
            href="/produits"
            className="text-muted hover:text-teranga-primary inline-flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="size-4" />
            {tDetail("back")}
          </Link>

          <div className="mt-12 flex items-center gap-4">
            <p className="text-teranga-primary font-mono text-xs uppercase tracking-[0.2em]">
              {t("sector")}
            </p>
            <span
              className={cn(
                "rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em]",
                isLive
                  ? "border-teranga-primary/40 text-teranga-primary"
                  : "border-border text-muted",
              )}
            >
              {isLive ? "LIVE" : "EN PILOTE"}
            </span>
          </div>

          <h1 className="font-display mt-6 text-6xl leading-[1.04] font-medium tracking-tight md:text-7xl lg:text-[5.5rem]">
            {t("name")}
          </h1>

          <p className="font-display mt-8 max-w-3xl text-2xl leading-tight tracking-tight md:text-3xl">
            {t("tagline")}
          </p>

          <p className="text-muted mt-8 max-w-2xl text-lg leading-relaxed">
            {t("description")}
          </p>

          {isLive && meta.externalUrl && (
            <div className="mt-10">
              <a
                href={meta.externalUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-teranga-primary hover:bg-teranga-secondary inline-flex h-12 items-center gap-2 rounded-full px-7 text-sm font-medium text-white transition-colors duration-300"
              >
                {tDetail("visitSite")}
                <ArrowUpRight className="size-4" />
              </a>
            </div>
          )}

          {/* Site preview — full width below the hero copy */}
          <div className="mt-16 md:mt-20">
            <ProductPreview slug={slug} />
          </div>
        </div>

        <div
          aria-hidden
          className="from-teranga-secondary/10 to-teranga-primary/20 pointer-events-none absolute -bottom-48 -right-48 h-[40rem] w-[40rem] rounded-full bg-gradient-to-br blur-3xl"
        />
      </section>

      {/* Problem & Solution */}
      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <p className="text-teranga-primary font-mono text-xs uppercase tracking-[0.2em]">
                {tDetail("problemTitle")}
              </p>
              <p className="font-display mt-6 text-2xl leading-snug tracking-tight md:text-3xl">
                {t("problem")}
              </p>
            </div>
            <div>
              <p className="text-teranga-primary font-mono text-xs uppercase tracking-[0.2em]">
                {tDetail("solutionTitle")}
              </p>
              <p className="font-display mt-6 text-2xl leading-snug tracking-tight md:text-3xl">
                {t("solution")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <p className="text-teranga-primary font-mono text-xs uppercase tracking-[0.2em]">
            {tDetail("featuresTitle")}
          </p>
          <ul className="border-border mt-12 grid divide-y border-y md:grid-cols-2 md:divide-x md:divide-y-0">
            {features.map((feature, idx) => (
              <li
                key={idx}
                className="flex items-start gap-4 py-8 first:md:pr-12 last:md:pl-12 md:[&:nth-child(2)]:pl-12 md:[&:nth-child(3)]:pr-12"
              >
                <CheckCircle2 className="text-teranga-primary mt-0.5 size-5 shrink-0" />
                <p className="text-lg leading-relaxed">{feature}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Metrics or Interest form */}
      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          {isLive ? (
            <>
              <p className="text-teranga-primary font-mono text-xs uppercase tracking-[0.2em]">
                {tDetail("metricsTitle")}
              </p>
              <ul className="mt-12 grid gap-8 md:grid-cols-3">
                {metrics.map((metric, idx) => (
                  <li
                    key={idx}
                    className="border-border flex flex-col gap-3 border-t pt-6"
                  >
                    <span className="text-teranga-primary font-mono text-xs">
                      0{idx + 1}
                    </span>
                    <p className="font-display text-xl leading-tight tracking-tight">
                      {metric}
                    </p>
                  </li>
                ))}
              </ul>
              {meta.externalUrl && (
                <div className="mt-12">
                  <a
                    href={meta.externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-teranga-primary hover:bg-teranga-secondary inline-flex h-12 items-center gap-2 rounded-full px-7 text-sm font-medium text-white transition-colors duration-300"
                  >
                    {tDetail("visitSite")}
                    <ArrowUpRight className="size-4" />
                  </a>
                </div>
              )}
            </>
          ) : (
            <div className="grid gap-12 md:grid-cols-2 md:gap-16">
              <div>
                <p className="text-teranga-primary font-mono text-xs uppercase tracking-[0.2em]">
                  {tDetail("interestTitle")}
                </p>
                <p className="font-display mt-6 text-2xl leading-snug tracking-tight md:text-3xl">
                  {tDetail("interestBody")}
                </p>
                <ul className="mt-8 space-y-3">
                  {metrics.map((metric, idx) => (
                    <li key={idx} className="text-muted flex items-start gap-3 text-sm">
                      <span className="text-teranga-primary mt-1 inline-block size-1.5 shrink-0 rounded-full bg-current" />
                      {metric}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <InterestForm />
              </div>
            </div>
          )}
        </div>
      </section>
    </article>
  );
}
