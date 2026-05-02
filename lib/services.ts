export const serviceSlugs = [
  "plateformes-gestion",
  "accompagnement-projet",
  "identite-site-vitrine",
  "audit-systeme",
  "audit-securite",
  "reseaux-telephonie-ip",
  "marketing-digital",
] as const;

export type ServiceSlug = (typeof serviceSlugs)[number];

type PriceModel = "range" | "quote" | "custom";

export const serviceMeta: Record<
  ServiceSlug,
  {
    namespace: string;
    priceModel: PriceModel;
    priceMinFcfa?: number;
    priceMaxFcfa?: number;
    referenceCase?: string;
    referenceProduct?: string;
  }
> = {
  "plateformes-gestion": {
    namespace: "ServicePlatforms",
    priceModel: "range",
    priceMinFcfa: 1_800_000,
    priceMaxFcfa: 30_000_000,
    referenceCase: "hydrautech",
  },
  "accompagnement-projet": {
    namespace: "ServiceProject",
    priceModel: "range",
    priceMinFcfa: 1_800_000,
    priceMaxFcfa: 30_000_000,
    referenceCase: "ndougalma",
  },
  "identite-site-vitrine": {
    namespace: "ServiceBrand",
    priceModel: "range",
    priceMinFcfa: 150_000,
    priceMaxFcfa: 2_000_000,
  },
  "audit-systeme": {
    namespace: "ServiceAuditIT",
    priceModel: "quote",
  },
  "audit-securite": {
    namespace: "ServiceAuditSec",
    priceModel: "quote",
  },
  "reseaux-telephonie-ip": {
    namespace: "ServiceNetwork",
    priceModel: "quote",
  },
  "marketing-digital": {
    namespace: "ServiceMarketing",
    priceModel: "custom",
  },
};

export function isValidServiceSlug(slug: string): slug is ServiceSlug {
  return (serviceSlugs as readonly string[]).includes(slug);
}

export function formatFcfa(value: number): string {
  return value.toLocaleString("fr-FR");
}
