import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

const lastUpdated = "2026-05-03";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité TerangaDev — données collectées, finalités, conservation, droits utilisateurs.",
};

const contentFr = {
  tag: "Politique de confidentialité",
  headline: "Politique de confidentialité",
  intro:
    "On collecte le minimum vital. Pas de tracking publicitaire, pas de revente, pas de cookies tiers. Voici exactement ce qu'on fait avec tes données.",
  lastUpdated: `Dernière mise à jour : ${lastUpdated}`,
  sections: [
    {
      title: "Responsable du traitement",
      body: [
        "Le responsable du traitement des données collectées sur terangadev.com est **TerangaDev**.",
        "Pour toute question relative à tes données : **contact@terangadev.com**.",
      ],
    },
    {
      title: "Données que l'on collecte",
      body: [
        "**Via le formulaire de contact** : nom, email, entreprise, type de projet, fourchette de budget, timeline souhaitée, message libre. Ces champs sont remplis volontairement par l'utilisateur.",
        "**Via la navigation** : aucune donnée comportementale n'est collectée par défaut. Pas de Google Analytics, pas de pixel Meta, pas de Hotjar.",
        "**Cookies techniques** : préférence de thème (light/dark) et préférence de langue (fr/en) sont stockées en localStorage côté client. Aucune information personnelle n'y est associée. Ces cookies ne sont jamais transmis à des tiers.",
      ],
    },
    {
      title: "Finalités du traitement",
      body: [
        "Les données collectées via le formulaire de contact sont utilisées exclusivement pour :",
        "1. **Répondre** à ta demande de contact ou de devis.",
        "2. **Préparer** un appel de cadrage ou un cahier des charges.",
        "3. **Conserver** un historique de la relation pour des relances commerciales pertinentes.",
        "Aucune communication marketing automatisée n'est envoyée sans consentement explicite ultérieur.",
      ],
    },
    {
      title: "Base légale",
      body: [
        "**Consentement** : l'envoi du formulaire constitue un consentement explicite au traitement aux fins ci-dessus.",
        "**Intérêt légitime** : le suivi commercial de la relation client après un premier échange.",
      ],
    },
    {
      title: "Durée de conservation",
      body: [
        "Les données du formulaire sont conservées **12 mois** maximum après le dernier échange avec l'utilisateur.",
        "Au-delà, elles sont supprimées automatiquement, sauf si une relation client active justifie leur prolongation (signature de contrat, projet en cours).",
      ],
    },
    {
      title: "Destinataires",
      body: [
        "Les données sont accessibles uniquement à l'**équipe TerangaDev** en charge de la relation client.",
        "Aucune donnée n'est partagée, vendue, louée ou échangée avec des tiers.",
        "Aucun cookie publicitaire, aucune intégration de réseau publicitaire (Google Ads, Meta, etc.) n'est présent sur ce site.",
      ],
    },
    {
      title: "Hébergement et localisation des données",
      body: [
        "Les données sont stockées sur l'**infrastructure OVH France** (datacenters Roubaix / Gravelines).",
        "Aucun transfert de données hors Union européenne n'est effectué par défaut.",
        "Cette infrastructure est conforme **RGPD** pour les visiteurs européens et compatible avec la **loi sénégalaise 2008-12** relative à la protection des données personnelles.",
      ],
    },
    {
      title: "Tes droits",
      body: [
        "Conformément au RGPD et à la loi sénégalaise 2008-12, tu disposes des droits suivants :",
        "**Droit d'accès** : obtenir une copie des données qu'on a sur toi.",
        "**Droit de rectification** : corriger une donnée inexacte ou obsolète.",
        "**Droit à l'effacement** : demander la suppression de tes données (« droit à l'oubli »).",
        "**Droit à la limitation** : restreindre le traitement de tes données.",
        "**Droit d'opposition** : t'opposer au traitement pour un motif légitime.",
        "**Droit à la portabilité** : récupérer tes données dans un format structuré et lisible.",
      ],
    },
    {
      title: "Comment exercer tes droits",
      body: [
        "Envoie un email à **contact@terangadev.com** précisant le droit que tu souhaites exercer.",
        "Une réponse motivée te sera adressée sous **30 jours maximum**.",
        "Si tu estimes que tes droits ne sont pas respectés, tu peux saisir la **CDP Sénégal** (Commission de protection des données personnelles) ou la **CNIL** française selon ta résidence.",
      ],
    },
    {
      title: "Sécurité",
      body: [
        "Les données transitent uniquement via HTTPS.",
        "Les sauvegardes sont chiffrées et conservées sur l'infrastructure OVH.",
        "L'accès aux données est limité aux comptes nominatifs de l'équipe TerangaDev avec authentification forte.",
        "Aucune donnée personnelle n'est stockée en clair dans les logs techniques.",
      ],
    },
    {
      title: "Modifications de cette politique",
      body: [
        "Cette politique peut être révisée pour refléter l'évolution de nos pratiques ou des obligations légales.",
        "Toute modification substantielle sera notifiée par mise à jour de la date ci-dessus.",
        "Pour toute question : **contact@terangadev.com**.",
      ],
    },
  ],
} as const;

const contentEn = {
  tag: "Privacy policy",
  headline: "Privacy policy",
  intro:
    "We collect the bare minimum. No ad tracking, no resale, no third-party cookies. Here's exactly what we do with your data.",
  lastUpdated: `Last updated: ${lastUpdated}`,
  sections: [
    {
      title: "Data controller",
      body: [
        "The controller of data collected on terangadev.com is **TerangaDev**.",
        "For any question regarding your data: **contact@terangadev.com**.",
      ],
    },
    {
      title: "Data we collect",
      body: [
        "**Via the contact form**: name, email, company, project type, budget range, desired timeline, free-form message. These fields are filled voluntarily by the user.",
        "**Via navigation**: no behavioral data is collected by default. No Google Analytics, no Meta pixel, no Hotjar.",
        "**Technical cookies**: theme preference (light/dark) and language preference (fr/en) are stored in client-side localStorage. No personal information is associated with them. These cookies are never transmitted to third parties.",
      ],
    },
    {
      title: "Processing purposes",
      body: [
        "Data collected via the contact form is used exclusively to:",
        "1. **Respond** to your contact or quote request.",
        "2. **Prepare** a scoping call or specification.",
        "3. **Maintain** a relationship history for relevant follow-up.",
        "No automated marketing communication is sent without further explicit consent.",
      ],
    },
    {
      title: "Legal basis",
      body: [
        "**Consent**: submitting the form constitutes explicit consent to the processing above.",
        "**Legitimate interest**: commercial follow-up of the client relationship after initial contact.",
      ],
    },
    {
      title: "Retention period",
      body: [
        "Form data is retained for a maximum of **12 months** after the last exchange with the user.",
        "Beyond that, it is automatically deleted unless an active client relationship justifies extension (signed contract, active project).",
      ],
    },
    {
      title: "Recipients",
      body: [
        "Data is accessible only to the **TerangaDev team** handling the client relationship.",
        "No data is shared, sold, rented or exchanged with third parties.",
        "No ad cookies, no advertising network integration (Google Ads, Meta, etc.) is present on this site.",
      ],
    },
    {
      title: "Hosting and data location",
      body: [
        "Data is stored on **OVH France infrastructure** (Roubaix / Gravelines datacenters).",
        "No data transfer outside the European Union is performed by default.",
        "This infrastructure is **GDPR-compliant** for European visitors and compatible with **Senegalese law 2008-12** on personal data protection.",
      ],
    },
    {
      title: "Your rights",
      body: [
        "Under GDPR and Senegalese law 2008-12, you have the following rights:",
        "**Right of access**: obtain a copy of the data we hold on you.",
        "**Right to rectification**: correct inaccurate or outdated data.",
        "**Right to erasure**: request deletion of your data (\"right to be forgotten\").",
        "**Right to restriction**: limit processing of your data.",
        "**Right to object**: oppose processing on legitimate grounds.",
        "**Right to portability**: retrieve your data in a structured, readable format.",
      ],
    },
    {
      title: "How to exercise your rights",
      body: [
        "Email **contact@terangadev.com** specifying the right you wish to exercise.",
        "A reasoned response will be sent within a **maximum of 30 days**.",
        "If you believe your rights are not respected, you may refer the matter to the **CDP Senegal** (Personal Data Protection Commission) or the French **CNIL** depending on your residence.",
      ],
    },
    {
      title: "Security",
      body: [
        "Data transits exclusively via HTTPS.",
        "Backups are encrypted and stored on OVH infrastructure.",
        "Data access is limited to TerangaDev team named accounts with strong authentication.",
        "No personal data is stored in cleartext in technical logs.",
      ],
    },
    {
      title: "Policy changes",
      body: [
        "This policy may be revised to reflect changes in our practices or legal obligations.",
        "Any substantial modification will be notified by updating the date above.",
        "For any question: **contact@terangadev.com**.",
      ],
    },
  ],
} as const;

export default async function ConfidentialitePage({
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
        <p className="font-display mt-8 max-w-2xl text-xl leading-tight tracking-tight md:text-2xl">
          {content.intro}
        </p>
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
