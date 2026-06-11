export const teamMembers = [
  {
    id: "arona",
    initials: "AR",
    namespace: "TeamArona",
    stack: ["Laravel", "PostgreSQL", "Architecture", "Stratégie produit"],
  },
  {
    id: "mouhamed",
    initials: "MO",
    namespace: "TeamMouhamed",
    stack: ["Next.js", "React 19", "Tailwind v4", "Figma"],
  },
  {
    id: "ibnou",
    initials: "IB",
    namespace: "TeamIbnou",
    stack: ["Réseaux", "Sécurité", "React Native", "Next.js"],
  },
  {
    id: "babacar",
    initials: "BD",
    namespace: "TeamBabacar",
    stack: ["Laravel", "PostgreSQL", "API REST", "Modélisation"],
  },
  {
    id: "rane",
    initials: "RA",
    namespace: "TeamRane",
    stack: ["Laravel", "Vue.js", "PostgreSQL", "Filament"],
  },
  {
    id: "yabaye",
    initials: "YA",
    namespace: "TeamYabaye",
    stack: ["Communauté", "Contenu", "Marketing", "Lancements"],
  },
] as const;

export type TeamMember = (typeof teamMembers)[number];
