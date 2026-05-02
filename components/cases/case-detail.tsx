import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { caseMeta, type CaseSlug } from "@/lib/cases";

export function CaseDetail({ slug }: { slug: CaseSlug }) {
  const meta = caseMeta[slug];
  const t = useTranslations(meta.namespace);
  const tDetail = useTranslations("CaseDetail");

  const phases = [
    { title: t("phase1Title"), body: t("phase1Body") },
    { title: t("phase2Title"), body: t("phase2Body") },
    { title: t("phase3Title"), body: t("phase3Body") },
    { title: t("phase4Title"), body: t("phase4Body") },
  ];

  const results = [
    { value: t("result1Value"), label: t("result1Label") },
    { value: t("result2Value"), label: t("result2Label") },
    { value: t("result3Value"), label: t("result3Label") },
    { value: t("result4Value"), label: t("result4Label") },
  ];

  const stackItems = t("stack")
    .split("·")
    .map((s) => s.trim());

  return (
    <article>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 pt-12 pb-20 md:pt-16 md:pb-32">
          <Link
            href="/realisations"
            className="text-muted hover:text-teranga-primary inline-flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="size-4" />
            {tDetail("back")}
          </Link>

          <p className="text-teranga-primary mt-12 font-mono text-xs uppercase tracking-[0.2em]">
            {t("sector")}
          </p>

          <h1 className="font-display mt-6 text-6xl leading-[1.04] font-medium tracking-tight md:text-7xl lg:text-[5.5rem]">
            {t("name")}
          </h1>

          <p className="font-display mt-8 max-w-3xl text-2xl leading-tight tracking-tight md:text-3xl">
            {t("tagline")}
          </p>

          <p className="text-muted mt-8 max-w-2xl text-lg leading-relaxed">
            {t("description")}
          </p>

          {/* Meta row */}
          <div className="border-border mt-12 grid gap-6 border-t pt-8 md:grid-cols-3">
            <div>
              <p className="text-muted font-mono text-[10px] uppercase tracking-[0.2em]">
                {tDetail("yearLabel")}
              </p>
              <p className="mt-2 text-base">{meta.year}</p>
            </div>
            <div>
              <p className="text-muted font-mono text-[10px] uppercase tracking-[0.2em]">
                {tDetail("sectorLabel")}
              </p>
              <p className="mt-2 text-base">{t("sector")}</p>
            </div>
            <div>
              <p className="text-muted font-mono text-[10px] uppercase tracking-[0.2em]">
                {tDetail("scopeLabel")}
              </p>
              <p className="mt-2 text-base">{t("scope")}</p>
            </div>
          </div>

          {meta.externalUrl && (
            <div className="mt-12">
              <a
                href={meta.externalUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-teranga-primary hover:bg-teranga-secondary inline-flex h-12 items-center gap-2 rounded-full px-7 text-sm font-medium text-white transition-colors duration-300"
              >
                {tDetail("visitClient")}
                <ArrowUpRight className="size-4" />
              </a>
            </div>
          )}
        </div>

        <div
          aria-hidden
          className="from-teranga-secondary/10 to-teranga-primary/20 pointer-events-none absolute -bottom-48 -right-48 h-[40rem] w-[40rem] rounded-full bg-gradient-to-br blur-3xl"
        />
      </section>

      {/* Brief & Challenge */}
      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <p className="text-teranga-primary font-mono text-xs uppercase tracking-[0.2em]">
                {tDetail("briefTitle")}
              </p>
              <p className="font-display mt-6 text-2xl leading-snug tracking-tight md:text-3xl">
                {t("brief")}
              </p>
            </div>
            <div>
              <p className="text-teranga-primary font-mono text-xs uppercase tracking-[0.2em]">
                {tDetail("challengeTitle")}
              </p>
              <p className="font-display mt-6 text-2xl leading-snug tracking-tight md:text-3xl">
                {t("challenge")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Approach */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <p className="text-teranga-primary font-mono text-xs uppercase tracking-[0.2em]">
            {tDetail("approachTitle")}
          </p>
          <p className="font-display mt-8 max-w-4xl text-3xl leading-snug tracking-tight md:text-4xl">
            {t("approach")}
          </p>
        </div>
      </section>

      {/* Phases */}
      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <p className="text-teranga-primary font-mono text-xs uppercase tracking-[0.2em]">
            {tDetail("phasesTitle")}
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

      {/* Stack */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <p className="text-teranga-primary font-mono text-xs uppercase tracking-[0.2em]">
            {tDetail("stackTitle")}
          </p>
          <ul className="text-muted mt-12 flex flex-wrap gap-2 font-mono text-sm">
            {stackItems.map((tech) => (
              <li
                key={tech}
                className="border-border bg-bg rounded-full border px-4 py-2"
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Results */}
      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <p className="text-teranga-primary font-mono text-xs uppercase tracking-[0.2em]">
            {tDetail("resultsTitle")}
          </p>
          <ul className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
            {results.map((result, idx) => (
              <li key={idx} className="flex flex-col gap-3">
                <span className="font-display from-teranga-secondary to-teranga-primary bg-gradient-to-br bg-clip-text text-5xl leading-none font-medium tracking-tight text-transparent md:text-6xl">
                  {result.value}
                </span>
                <p className="text-muted text-sm leading-relaxed">
                  {result.label}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Next + CTA */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="border-border bg-surface flex flex-col items-start gap-6 rounded-3xl border p-10 md:flex-row md:items-center md:justify-between md:p-14">
            <div className="max-w-2xl">
              <p className="text-teranga-primary font-mono text-xs uppercase tracking-[0.2em]">
                {tDetail("nextTitle")}
              </p>
              <h2 className="font-display mt-4 text-3xl leading-tight font-medium tracking-tight md:text-4xl">
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
