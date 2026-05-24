/**
 * Additional portfolio entries — projects we shipped but didn't write a
 * full case study for. They land below the headlining cases on
 * /realisations as compact cards (title, category, short copy, year,
 * external link + screenshot).
 *
 * The category is what we show on the chip. Five buckets cover the
 * whole portfolio so the page reads as a typology rather than a list :
 *   - "vitrine"   : marketing / brand sites
 *   - "saas"      : full SaaS products
 *   - "ecommerce" : online stores
 *   - "platform"  : community / directory platforms
 *   - "marketing" : creative agency / brand work
 */
export type PortfolioCategory =
  | "vitrine"
  | "saas"
  | "ecommerce"
  | "platform"
  | "marketing";

export type PortfolioEntry = {
  id: string;
  title: string;
  category: PortfolioCategory;
  /** Short one-line copy for the card */
  description: string;
  /** Public URL of the live project (or null if offline) */
  url?: string;
  /** Path inside /public — must exist */
  image: string;
  /** Year shipped */
  year: number;
};

export const portfolioEntries: PortfolioEntry[] = [
  {
    id: "creneau",
    title: "Créneau",
    category: "saas",
    description:
      "Plateforme SaaS pour la gestion des auto-écoles et le suivi des élèves conducteurs.",
    url: "https://creneau-sn.com",
    image: "/portfolio/creneau-sn.png",
    year: 2024,
  },
  {
    id: "aslpe",
    title: "ASLPE",
    category: "vitrine",
    description:
      "Site de l'Alliance pour la Solidarité et la Lutte contre la Précarité chez les Enfants.",
    url: "https://aslpe.org",
    image: "/portfolio/aslpe-org.png",
    year: 2024,
  },
  {
    id: "sow-digital",
    title: "Sow Digital Groupe",
    category: "vitrine",
    description:
      "Site de l'agence de communication et photographie Sow Digital Groupe.",
    url: "https://groupe-sowdigital.com",
    image: "/portfolio/sow-digital-groupe.png",
    year: 2024,
  },
  {
    id: "delta-solution",
    title: "Delta Solution",
    category: "marketing",
    description:
      "Agence de communication : flyers, kakémonos et supports visuels imprimés.",
    url: "https://deltasolution.terangadev.com",
    image: "/portfolio/delta-solution.png",
    year: 2024,
  },
  {
    id: "qgss",
    title: "QGSS · Quincaillerie Sidibé",
    category: "ecommerce",
    description:
      "E-commerce pour la vente en ligne d'outils et matériaux de quincaillerie.",
    url: "http://qgss-sn.com",
    image: "/portfolio/qgss.png",
    year: 2023,
  },
  {
    id: "reference-conduite",
    title: "Référence de Conduite",
    category: "platform",
    description:
      "Plateforme de cours en ligne pour l'apprentissage du code de la route.",
    url: "https://www.cours.referencedeconduite.com",
    image: "/portfolio/reference-conduite.png",
    year: 2023,
  },
  {
    id: "ameaes",
    title: "AMEAES",
    category: "platform",
    description:
      "Annuaire des auto-écoles du Sénégal pour l'Amicale des Moniteurs et Employés.",
    url: "https://am1.terangadev.com",
    image: "/portfolio/ameaes.png",
    year: 2023,
  },
  {
    id: "vip-coiffure",
    title: "VIP Coiffure",
    category: "vitrine",
    description:
      "Site et prise de rendez-vous en ligne pour le salon VIP Coiffure.",
    url: "https://www.vip-coiffure.terangadev.com",
    image: "/portfolio/vip-coiffure.png",
    year: 2023,
  },
];

export const CATEGORY_LABELS_FR: Record<PortfolioCategory, string> = {
  vitrine: "Site vitrine",
  saas: "Plateforme SaaS",
  ecommerce: "E-commerce",
  platform: "Plateforme",
  marketing: "Marketing digital",
};

export const CATEGORY_LABELS_EN: Record<PortfolioCategory, string> = {
  vitrine: "Showcase site",
  saas: "SaaS platform",
  ecommerce: "E-commerce",
  platform: "Platform",
  marketing: "Digital marketing",
};
