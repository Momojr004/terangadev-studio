export const caseSlugs = ["hydrautech", "ndougalma"] as const;

export type CaseSlug = (typeof caseSlugs)[number];

export const caseMeta: Record<
  CaseSlug,
  {
    namespace: string;
    externalUrl?: string;
    year: number;
  }
> = {
  hydrautech: {
    namespace: "CaseHydrautech",
    externalUrl: "https://hydrautech-sn.com",
    year: 2024,
  },
  ndougalma: {
    namespace: "CaseNdougalma",
    year: 2025,
  },
};

export function isValidCaseSlug(slug: string): slug is CaseSlug {
  return (caseSlugs as readonly string[]).includes(slug);
}
