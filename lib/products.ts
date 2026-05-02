export const productSlugs = [
  "creneau",
  "nurapic",
  "sama-reservation",
  "ticket-events",
] as const;

export type ProductSlug = (typeof productSlugs)[number];

export const productMeta: Record<
  ProductSlug,
  {
    status: "LIVE" | "PILOT";
    externalUrl?: string;
    namespace: string;
  }
> = {
  creneau: {
    status: "LIVE",
    externalUrl: "https://creneau-sn.com",
    namespace: "ProductCreneau",
  },
  nurapic: {
    status: "LIVE",
    externalUrl: "https://nurapic.com",
    namespace: "ProductNurapic",
  },
  "sama-reservation": {
    status: "PILOT",
    namespace: "ProductSama",
  },
  "ticket-events": {
    status: "PILOT",
    namespace: "ProductTicket",
  },
};

export function isValidProductSlug(slug: string): slug is ProductSlug {
  return (productSlugs as readonly string[]).includes(slug);
}
