import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { productMeta, type ProductSlug } from "@/lib/products";
import { cn } from "@/lib/cn";

export function ProductCard({
  slug,
  variant = "stacked",
  index,
}: {
  slug: ProductSlug;
  variant?: "stacked" | "horizontal";
  index: number;
}) {
  const meta = productMeta[slug];
  const t = useTranslations(meta.namespace);
  const tIndex = useTranslations("ProductsIndex");

  const isLive = meta.status === "LIVE";

  return (
    <article
      className={cn(
        "border-border bg-bg group relative flex w-full flex-col overflow-hidden rounded-3xl border p-8 md:p-12 lg:p-16",
        variant === "horizontal" && "h-full md:h-[80vh] md:w-[80vw] md:shrink-0",
      )}
    >
      <div className="flex items-start justify-between gap-6">
        <span className="text-muted font-mono text-xs uppercase tracking-[0.18em]">
          0{index + 1} / 04
        </span>
        <span
          className={cn(
            "rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em]",
            isLive
              ? "border-teranga-primary/40 text-teranga-primary"
              : "border-border text-muted",
          )}
        >
          {meta.status === "LIVE" ? "LIVE" : "EN PILOTE"}
        </span>
      </div>

      <div className="mt-10 flex flex-1 flex-col justify-end gap-6">
        <p className="text-muted font-mono text-xs uppercase tracking-[0.18em]">
          {t("sector")}
        </p>
        <h2 className="font-display text-5xl leading-[1.04] font-medium tracking-tight md:text-6xl lg:text-7xl">
          {t("name")}
        </h2>
        <p className="font-display max-w-2xl text-xl leading-tight tracking-tight md:text-2xl">
          {t("tagline")}
        </p>

        <div className="mt-4 flex items-center gap-4">
          <Link
            href={`/produits/${slug}` as never}
            className="bg-teranga-primary hover:bg-teranga-secondary inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-medium text-white transition-colors duration-300 [transition-timing-function:var(--ease-expo-out)]"
          >
            {tIndex("viewProduct")}
            <ArrowUpRight className="size-4" />
          </Link>
          {meta.externalUrl && (
            <a
              href={meta.externalUrl}
              target="_blank"
              rel="noreferrer"
              className="border-border hover:bg-surface inline-flex h-11 items-center gap-2 rounded-full border px-6 text-sm font-medium transition-colors duration-300"
            >
              {tIndex("viewSite")}
              <ArrowUpRight className="size-4" />
            </a>
          )}
        </div>
      </div>

      <div
        aria-hidden
        className="from-teranga-secondary/10 to-teranga-primary/20 pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-gradient-to-br blur-3xl"
      />
    </article>
  );
}
