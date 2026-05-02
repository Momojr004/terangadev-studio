import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { siteConfig } from "@/lib/site-config";

const lastUpdated = "2026-05-03";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales du site TerangaDev — éditeur, hébergement, propriété intellectuelle.",
};

const contentFr = {
  tag: "Mentions légales",
  headline: "Mentions légales",
  lastUpdated: `Dernière mise à jour : ${lastUpdated}`,
  sections: [
    {
      title: "Éditeur du site",
      body: [
        "Le site terangadev.com est édité par TerangaDev, studio produit basé à Dakar, Sénégal.",
        "**Raison sociale** : TerangaDev",
        "**Siège social** : Point E, Dakar — Sénégal",
        "**RCCM** : à compléter",
        "**NINEA** : à compléter",
        "**Email** : contact@terangadev.com",
        "**Téléphone** : +221 77 942 33 17",
        "**Directeur de publication** : Arona Momo, CEO et co-fondateur",
      ],
    },
    {
      title: "Hébergement",
      body: [
        "Le site est hébergé par **OVH SAS**, société par actions simplifiée au capital de 50 000 000 €, immatriculée au RCS de Lille Métropole sous le numéro 424 761 419.",
        "**Siège social** : 2 rue Kellermann, 59100 Roubaix, France",
        "**Téléphone** : +33 9 72 10 10 07",
        "**Site** : ovh.com",
      ],
    },
    {
      title: "Conception et réalisation",
      body: [
        "Le site a été conçu, développé et est maintenu par les équipes TerangaDev en interne.",
        "**Stack technique publique** : Next.js · React · Tailwind CSS · TypeScript · Payload CMS · OVH France",
        "Le code source du site est privé. Il n'est pas distribué publiquement.",
      ],
    },
    {
      title: "Propriété intellectuelle",
      body: [
        "L'ensemble des éléments présents sur le site terangadev.com (textes, images, logo, charte graphique, code, structure, base de données) est la propriété exclusive de TerangaDev, sauf mention contraire explicite.",
        "Toute reproduction, représentation, modification ou publication, totale ou partielle, est strictement interdite sans autorisation préalable écrite de TerangaDev.",
        "Les marques et logos des clients (Hydrautech, Ndougalma, Créneau, Nurapic, Sama Reservation, Ticket-Events, etc.) sont la propriété de leurs détenteurs respectifs et utilisés ici avec autorisation.",
      ],
    },
    {
      title: "Crédits typographiques",
      body: [
        "Le site utilise les polices suivantes, distribuées sous licences ouvertes :",
        "**Newsreader** (display) — SIL Open Font License, par Production Type",
        "**Inter** (body) — SIL Open Font License, par Rasmus Andersson",
        "**JetBrains Mono** (mono) — Apache License 2.0, par JetBrains s.r.o.",
      ],
    },
    {
      title: "Liens externes",
      body: [
        "Le site peut contenir des liens vers des sites tiers (clients, partenaires, ressources techniques). TerangaDev n'exerce aucun contrôle sur le contenu de ces sites tiers et décline toute responsabilité quant à leur contenu, leur disponibilité ou les conséquences de leur utilisation.",
      ],
    },
    {
      title: "Litiges et droit applicable",
      body: [
        "Le site terangadev.com et son contenu sont régis par le droit sénégalais.",
        "En cas de litige, les tribunaux de Dakar sont seuls compétents, après tentative préalable de résolution amiable par contact à contact@terangadev.com.",
      ],
    },
  ],
} as const;

const contentEn = {
  tag: "Legal notices",
  headline: "Legal notices",
  lastUpdated: `Last updated: ${lastUpdated}`,
  sections: [
    {
      title: "Site publisher",
      body: [
        "The site terangadev.com is published by TerangaDev, a product studio based in Dakar, Senegal.",
        "**Legal name** : TerangaDev",
        "**Registered office** : Point E, Dakar — Senegal",
        "**RCCM** : to be filled",
        "**NINEA** : to be filled",
        "**Email** : contact@terangadev.com",
        "**Phone** : +221 77 942 33 17",
        "**Publication director** : Arona Momo, CEO and co-founder",
      ],
    },
    {
      title: "Hosting",
      body: [
        "The site is hosted by **OVH SAS**, a French simplified joint-stock company with capital of €50,000,000, registered under RCS Lille Métropole 424 761 419.",
        "**Address** : 2 rue Kellermann, 59100 Roubaix, France",
        "**Phone** : +33 9 72 10 10 07",
        "**Website** : ovh.com",
      ],
    },
    {
      title: "Design and development",
      body: [
        "The site was designed, developed and is maintained internally by TerangaDev teams.",
        "**Public tech stack** : Next.js · React · Tailwind CSS · TypeScript · Payload CMS · OVH France",
        "The source code is private and not publicly distributed.",
      ],
    },
    {
      title: "Intellectual property",
      body: [
        "All elements present on terangadev.com (text, images, logo, brand guidelines, code, structure, database) are the exclusive property of TerangaDev, unless explicitly stated otherwise.",
        "Any reproduction, representation, modification or publication, in whole or in part, is strictly forbidden without prior written authorization from TerangaDev.",
        "Client brands and logos (Hydrautech, Ndougalma, Créneau, Nurapic, Sama Reservation, Ticket-Events, etc.) are the property of their respective holders and used here with permission.",
      ],
    },
    {
      title: "Typography credits",
      body: [
        "The site uses the following typefaces under open licenses:",
        "**Newsreader** (display) — SIL Open Font License, by Production Type",
        "**Inter** (body) — SIL Open Font License, by Rasmus Andersson",
        "**JetBrains Mono** (mono) — Apache License 2.0, by JetBrains s.r.o.",
      ],
    },
    {
      title: "External links",
      body: [
        "The site may contain links to third-party sites (clients, partners, technical resources). TerangaDev does not exercise any control over the content of these third-party sites and disclaims any responsibility for their content, availability or the consequences of their use.",
      ],
    },
    {
      title: "Disputes and applicable law",
      body: [
        "The site terangadev.com and its content are governed by Senegalese law.",
        "In the event of a dispute, the courts of Dakar shall have sole jurisdiction, after a prior attempt at amicable resolution via contact at contact@terangadev.com.",
      ],
    },
  ],
} as const;

export default async function MentionsLegalesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const content = locale === "en" ? contentEn : contentFr;

  return (
    <>
      <section className="mx-auto max-w-4xl px-6 pt-20 pb-12 md:pt-28 md:pb-16">
        <p className="text-teranga-primary font-mono text-xs uppercase tracking-[0.2em]">
          {content.tag}
        </p>
        <h1 className="font-display mt-6 text-4xl leading-[1.05] font-medium tracking-tight md:text-5xl lg:text-6xl">
          {content.headline}
        </h1>
        <p className="text-muted mt-6 font-mono text-xs uppercase tracking-[0.18em]">
          {content.lastUpdated}
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-32 md:pb-40">
        <div className="space-y-16">
          {content.sections.map((section, idx) => (
            <article
              key={idx}
              className="border-border border-t pt-10"
            >
              <h2 className="font-display text-2xl leading-tight font-medium tracking-tight md:text-3xl">
                {section.title}
              </h2>
              <div className="text-muted mt-6 space-y-4 text-base leading-relaxed">
                {section.body.map((line, i) => (
                  <p key={i} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-fg font-medium">$1</strong>') }} />
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

void siteConfig;
