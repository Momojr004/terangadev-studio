export const siteConfig = {
  name: "TerangaDev",
  url: "https://terangadev.com",
  email: "contact@terangadev.com",
  whatsapp: "221779423317",
  whatsappDisplay: "+221 77 942 33 17",
  address: "Point E, Dakar",
  socials: {
    github: "https://github.com/Momojr004",
    linkedin: "https://www.linkedin.com/company/terangadev",
  },
  stack: [
    "Next.js",
    "Tailwind v4",
    "React Three Fiber",
    "Laravel 12",
    "PostgreSQL",
    "Redis",
    "Docker",
    "Ansible",
    "OVH",
  ],
} as const;

export const navItems = [
  { key: "produits", href: "/produits" },
  { key: "realisations", href: "/realisations" },
  { key: "services", href: "/services" },
  { key: "notes", href: "/notes" },
  { key: "studio", href: "/studio" },
] as const;

export const secondaryNavItems = [
  { key: "rejoindre", href: "/rejoindre" },
  { key: "contact", href: "/contact" },
] as const;
