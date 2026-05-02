export const teamMembers = [
  {
    id: "arona",
    initials: "AM",
    namespace: "TeamArona",
    stack: ["Laravel", "PostgreSQL", "Architecture", "Stratégie produit"],
  },
  {
    id: "babacar",
    initials: "BD",
    namespace: "TeamBabacar",
    stack: ["Laravel", "PostgreSQL", "Docker", "Ansible"],
  },
  {
    id: "mouhamed",
    initials: "MO",
    namespace: "TeamMouhamed",
    stack: ["Next.js", "React 19", "Tailwind v4", "TypeScript"],
  },
  {
    id: "rane",
    initials: "RA",
    namespace: "TeamRane",
    stack: ["Laravel", "Vue.js", "PostgreSQL", "Filament"],
  },
  {
    id: "ibnou",
    initials: "IB",
    namespace: "TeamIbnou",
    stack: ["React Native", "Next.js", "Tailwind", "Mobile"],
  },
  {
    id: "yabaye",
    initials: "YA",
    namespace: "TeamYabaye",
    stack: ["Docker", "Ansible", "OVH", "Sécurité"],
  },
] as const;

export type TeamMember = (typeof teamMembers)[number];
