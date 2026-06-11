import { siteConfig } from "./site-config";

const baseUrl = siteConfig.url;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "TerangaDev",
    legalName: "TerangaDev",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    sameAs: [
      siteConfig.socials.github,
      siteConfig.socials.linkedin,
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Point E",
      addressLocality: "Dakar",
      addressCountry: "SN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: `+${siteConfig.whatsapp}`,
      contactType: "customer support",
      email: siteConfig.email,
      availableLanguage: ["French", "English"],
      areaServed: ["SN", "FR", "US", "GB"],
    },
    foundingDate: "2024",
    foundingLocation: {
      "@type": "Place",
      name: "Dakar, Senegal",
    },
    knowsAbout: [
      "Web Development",
      "SaaS Development",
      "Software Engineering",
      "Digital Marketing",
      "IT Audit",
      "Network Engineering",
    ],
  };
}

export function serviceSchema(args: {
  name: string;
  description: string;
  url: string;
  priceMin?: number;
  priceMax?: number;
}) {
  const offers =
    args.priceMin && args.priceMax
      ? {
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "XOF",
            lowPrice: args.priceMin,
            highPrice: args.priceMax,
          },
        }
      : {};
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: args.name,
    description: args.description,
    provider: {
      "@type": "Organization",
      name: "TerangaDev",
      url: baseUrl,
    },
    url: args.url,
    areaServed: {
      "@type": "Country",
      name: "Senegal",
    },
    ...offers,
  };
}

export function blogPostingSchema(args: {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  category: string;
  imageUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: args.title,
    description: args.description,
    url: args.url,
    ...(args.datePublished ? { datePublished: args.datePublished } : {}),
    ...(args.imageUrl ? { image: args.imageUrl } : {}),
    articleSection: args.category,
    author: {
      "@type": "Organization",
      name: "TerangaDev",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "TerangaDev",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
  };
}

export function breadcrumbSchema(
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function softwareApplicationSchema(args: {
  name: string;
  description: string;
  url: string;
  externalUrl?: string;
  category?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: args.name,
    description: args.description,
    url: args.externalUrl ?? args.url,
    applicationCategory: args.category ?? "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      priceCurrency: "XOF",
    },
    publisher: {
      "@type": "Organization",
      name: "TerangaDev",
      url: baseUrl,
    },
  };
}

export function caseStudySchema(args: {
  name: string;
  description: string;
  url: string;
  year: number;
  sector: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: args.name,
    description: args.description,
    url: args.url,
    dateCreated: `${args.year}`,
    creator: {
      "@type": "Organization",
      name: "TerangaDev",
      url: baseUrl,
    },
    about: args.sector,
  };
}
