import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { productMeta, type ProductSlug } from "@/lib/products";
import { cn } from "@/lib/cn";
import { ProductPreview } from "./product-preview";

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

  const isHorizontal = variant === "horizontal";

  return (
    <article
      className={cn(
        "border-border bg-bg group relative flex w-full flex-col overflow-hidden rounded-3xl border p-8 md:p-12 lg:p-14",
        isHorizontal && "h-full md:h-[80vh] md:w-[80vw] md:shrink-0",
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

      {/* 2-column on desktop : copy + CTAs LEFT (priority for the
          reader's eye), preview RIGHT and constrained so buttons never
          get cropped. Stays vertical on mobile / homepage stacked. */}
      <div
        className={cn(
          "mt-8 flex flex-1 flex-col gap-8 md:mt-10 md:gap-12",
          isHorizontal &&
            "md:flex-row md:items-center md:gap-10 lg:gap-16",
        )}
      >
        <div
          className={cn(
            "flex flex-col gap-5",
            isHorizontal && "md:w-[42%] md:shrink-0",
          )}
        >
          <p className="text-muted font-mono text-xs uppercase tracking-[0.18em]">
            {t("sector")}
          </p>
          <h2 className="font-display text-4xl leading-[1.04] font-medium tracking-tight md:text-5xl lg:text-6xl">
            {t("name")}
          </h2>
          <p className="font-display max-w-md text-lg leading-tight tracking-tight md:text-xl lg:text-2xl">
            {t("tagline")}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-3 md:mt-4">
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
          className={cn(
            "w-full",
            isHorizontal && "md:flex-1",
          )}
        >
          <ProductPreview slug={slug} />
        </div>
      </div>
    </article>
  );
}
