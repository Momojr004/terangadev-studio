import { ArrowLeft, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  serviceMeta,
  formatFcfa,
  type ServiceSlug,
} from "@/lib/services";
import { caseMeta } from "@/lib/cases";
import { productMeta } from "@/lib/products";

export function ServiceDetail({ slug }: { slug: ServiceSlug }) {
  const meta = serviceMeta[slug];
  const t = useTranslations(meta.namespace);
  const tDetail = useTranslations("ServiceDetail");

  const deliverables = [
    t("deliverable1"),
    t("deliverable2"),
    t("deliverable3"),
    t("deliverable4"),
    t("deliverable5"),
    t.has?.("deliverable6") ? t("deliverable6") : null,
  ].filter(Boolean) as string[];

  const phases = [
    { title: t("phase1Title"), body: t("phase1Body") },
    { title: t("phase2Title"), body: t("phase2Body") },
    { title: t("phase3Title"), body: t("phase3Body") },
    { title: t("phase4Title"), body: t("phase4Body") },
  ];

  const referenceCase =
    meta.referenceCase && meta.referenceCase in caseMeta
      ? meta.referenceCase
      : null;
  const referenceProduct =
    meta.referenceProduct && meta.referenceProduct in productMeta
      ? meta.referenceProduct
      : null;

  return (
    <article>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 pt-12 pb-20 md:pt-16 md:pb-32">
          <Link
            href="/services"
            className="text-muted hover:text-teranga-primary inline-flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="size-4" />
            {tDetail("back")}
          </Link>

          <h1 className="font-display mt-12 text-5xl leading-[1.04] font-medium tracking-tight md:text-6xl lg:text-7xl">
            {t("name")}
          </h1>

          <p className="font-display mt-8 max-w-3xl text-2xl leading-tight tracking-tight md:text-3xl">
            {t("tagline")}
          </p>

          <p className="text-muted mt-8 max-w-2xl text-lg leading-relaxed">
            {t("description")}
          </p>
        </div>

        <div
          aria-hidden
          className="from-teranga-secondary/10 to-teranga-primary/20 pointer-events-none absolute -bottom-48 -right-48 h-[40rem] w-[40rem] rounded-full bg-gradient-to-br blur-3xl"
        />
      </section>

      {/* Deliverables */}
      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <p className="text-teranga-primary font-mono text-xs uppercase tracking-[0.2em]">
            {tDetail("deliverablesTitle")}
          </p>
          <ul className="mt-12 grid gap-x-8 gap-y-6 md:grid-cols-2">
            {deliverables.map((deliverable, idx) => (
              <li key={idx} className="flex items-start gap-4">
                <CheckCircle2 className="text-teranga-primary mt-0.5 size-5 shrink-0" />
                <p className="text-base leading-relaxed">{deliverable}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Process */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <p className="text-teranga-primary font-mono text-xs uppercase tracking-[0.2em]">
            {tDetail("processTitle")}
          </p>
          <ol className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {phases.map((phase, idx) => (
              <li
                key={idx}
                className="border-border flex flex-col gap-3 border-t pt-6"
              >
                <span className="text-teranga-primary font-mono text-xs">
                  0{idx + 1}
                </span>
                <h3 className="font-display text-xl leading-tight font-medium tracking-tight">
                  {phase.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {phase.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <p className="text-teranga-primary font-mono text-xs uppercase tracking-[0.2em]">
            {tDetail("pricingTitle")}
          </p>

          {meta.priceModel === "range" &&
            meta.priceMinFcfa !== undefined &&
            meta.priceMaxFcfa !== undefined && (
              <div className="mt-12 grid gap-8 md:grid-cols-2 md:gap-16">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-fg/70">
                    {tDetail("priceFromLabel")}
                  </p>
                  <p className="font-display from-teranga-secondary to-teranga-primary mt-4 bg-gradient-to-br bg-clip-text text-4xl leading-none font-medium tracking-tight text-transparent md:text-5xl lg:text-6xl">
                    {formatFcfa(meta.priceMinFcfa)} → {formatFcfa(meta.priceMaxFcfa)} FCFA
                  </p>
                </div>
                <p className="text-muted text-base leading-relaxed">
                  {tDetail("priceRangeNote")}
                </p>
              </div>
            )}

          {meta.priceModel === "quote" && (
            <div className="mt-12 grid gap-8 md:grid-cols-2 md:gap-16">
              <p className="font-display text-3xl leading-tight font-medium tracking-tight md:text-4xl">
                {tDetail("priceQuoteLabel")}
              </p>
              <p className="text-muted text-base leading-relaxed">
                {tDetail("priceQuoteText")}
              </p>
            </div>
          )}

          {meta.priceModel === "custom" && (
            <div className="mt-12 grid gap-8 md:grid-cols-2 md:gap-16">
              <p className="font-display text-3xl leading-tight font-medium tracking-tight md:text-4xl">
                {tDetail("priceCustomLabel")}
              </p>
              <p className="text-muted text-base leading-relaxed">
                {tDetail("priceCustomText")}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Reference case or product */}
      {(referenceCase || referenceProduct) && (
        <section>
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <p className="text-teranga-primary font-mono text-xs uppercase tracking-[0.2em]">
              {tDetail("referenceTitle")}
            </p>
            {referenceCase && <ReferenceCaseLink slug={referenceCase} />}
            {referenceProduct && <ReferenceProductLink slug={referenceProduct} />}
          </div>
        </section>
      )}

      {/* CTA */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="border-border bg-surface flex flex-col items-start gap-6 rounded-3xl border p-10 md:flex-row md:items-center md:justify-between md:p-14">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl leading-tight font-medium tracking-tight md:text-4xl">
                {tDetail("ctaHeadline")}
              </h2>
              <p className="text-muted mt-4 text-base leading-relaxed">
                {tDetail("ctaBody")}
              </p>
            </div>
            <Link
              href="/contact"
              className="bg-teranga-primary hover:bg-teranga-secondary inline-flex h-12 shrink-0 items-center gap-2 rounded-full px-7 text-sm font-medium text-white transition-colors duration-300"
            >
              {tDetail("ctaButton")}
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

function ReferenceCaseLink({ slug }: { slug: string }) {
  const namespace = caseMeta[slug as keyof typeof caseMeta].namespace;
  const t = useTranslations(namespace);
  return (
    <Link
      href={`/realisations/${slug}` as never}
      className="border-border bg-bg hover:border-teranga-primary/40 group mt-12 flex flex-col items-start gap-6 rounded-3xl border p-10 transition-all md:flex-row md:items-center md:justify-between md:p-14"
    >
      <div className="max-w-2xl">
        <p className="text-muted font-mono text-xs uppercase tracking-[0.18em]">
          {t("sector")}
        </p>
        <h3 className="font-display mt-3 text-3xl leading-tight font-medium tracking-tight md:text-4xl">
          {t("name")}
        </h3>
        <p className="text-muted mt-4 text-base leading-relaxed">
          {t("tagline")}
        </p>
      </div>
      <ArrowUpRight className="text-fg/40 size-6 shrink-0 transition-all duration-500 [transition-timing-function:var(--ease-expo-out)] group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-teranga-primary" />
    </Link>
  );
}

function ReferenceProductLink({ slug }: { slug: string }) {
  const namespace = productMeta[slug as keyof typeof productMeta].namespace;
  const t = useTranslations(namespace);
  return (
    <Link
      href={`/produits/${slug}` as never}
      className="border-border bg-bg hover:border-teranga-primary/40 group mt-12 flex flex-col items-start gap-6 rounded-3xl border p-10 transition-all md:flex-row md:items-center md:justify-between md:p-14"
    >
      <div className="max-w-2xl">
        <p className="text-muted font-mono text-xs uppercase tracking-[0.18em]">
          {t("sector")}
        </p>
        <h3 className="font-display mt-3 text-3xl leading-tight font-medium tracking-tight md:text-4xl">
          {t("name")}
        </h3>
        <p className="text-muted mt-4 text-base leading-relaxed">
          {t("tagline")}
        </p>
      </div>
      <ArrowUpRight className="text-fg/40 size-6 shrink-0 transition-all duration-500 [transition-timing-function:var(--ease-expo-out)] group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-teranga-primary" />
    </Link>
  );
}
