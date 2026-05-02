# BRIEF — Refonte terangadev.com

> **Document de cadrage.** Single source of truth pour la phase build.
> Toute décision prise dans cette session de discovery est consolidée ici.
> **Si une décision change, on met ce fichier à jour avant de toucher au code.**

---

## 0. Contexte

- **Entreprise** : TerangaDev — agence/studio IT sénégalais, fondée en 2022
- **CEO & co-fondateur** : Arona Momo ("Serigne bi"), basé à Dakar
- **Équipe** : Arona, Babacar Diop, Mouhamed (lead refonte), Rane, Ibnou, Yabaye
- **Site existant** : terangadev.com (générique, à remplacer)
- **Domaine** : terangadev.com (déjà actif)
- **Hébergement marketing site** : **OVH France** (validé phase 5) — alignement souveraineté technique
- **Repo** : `cyber-pulse-design` (cette session)
- **Adresse physique** : Point E, Dakar
- **Email contact** : `contact@terangadev.com`
- **WhatsApp** : `+221 77 942 33 17`

---

## 1. Positionnement

### One-liner officiel — Hero principal
> **Le seul studio à Dakar qui shippe ses propres SaaS depuis 2022 — et qui t'accompagne de l'idée à la maintenance.**

### Tagline courte — sous logo, signatures, meta description
> **Studio produit dakarois.**

### Posture éditoriale
- Voix à la **première personne du pluriel** (« on »), jamais « nous » corporate
- Opinionated, transparente, technique sans jargon creux
- **Souveraineté technique assumée** (pas géographique mensongère) : équipe à Dakar, code propriétaire client, infra au choix client, zéro vendor lock-in
- Honnêteté sur les choix et les limites, à la Tighten / Basecamp

### Mots interdits dans tout le copy
*expertise, leadership, sur mesure, solutions innovantes, qualité, excellence, passion, équipe expérimentée, à votre écoute, votre satisfaction est notre priorité*

---

## 2. Cibles & filtrage

### ICP (3 patterns identifiés via cas existants)

| # | Pattern client | Cas vitrine | Vente type |
|---|---|---|---|
| 1 | **PME en gestion manuelle, sans contrôle ni traçabilité** | Hydrautech | Plateforme de gestion sur mesure + formation équipe + maintenance contrat annuel |
| 2 | **Porteur de projet (idée → prod)** : SaaS, marque, e-com, projet communautaire | Ndougalma | Accompagnement A-Z : idéation, business model, dev, marketing digital, maintenance |
| 3 | **Vertical SaaS** (auto-écoles, photographes, etc.) | Créneau, Nurapic, Sama Reservation, Ticket-Events | Abonnement SaaS + marketplace exposée + onboarding |

### Anti-ICP (à filtrer dès la home par signaux explicites)

1. **Le négociateur au rabais** — TerangaDev facture déjà sous le marché avec plus de valeur. Pas de marge pour casser le prix. → Filtrage par **fourchettes de tarifs visibles** sur chaque page Service.
2. **Le client pas sérieux** — joignabilité erratique, plan de décaissement non respecté, validations en retard. → Filtrage par mention explicite du **process contractuel** (plan de décaissement, créneaux de validation) sur la page Services.

### Audience EN
**Diaspora US/UK + fonds d'investissement.** Le copy EN n'est pas une traduction littérale du FR : il vise un public deal-flow / tech-fluent. Plus assertif, moins descriptif, plus orienté traction et architecture.

---

## 3. Promesses chiffrables (preuves sociales)

À utiliser dans Hero, bandeau de chiffres, pages produits, signatures.

| Metric | Valeur | Source |
|---|---|---|
| **SaaS en prod sous notre marque** | **4** (Créneau, Nurapic, Sama Reservation, Ticket-Events) | Direct |
| **Projets livrés depuis 2022** | **~30** (vitrines, e-com, plateformes incluses) | Estimation |
| **Clients sous contrat de maintenance actif** | **6** | Direct |
| **Délai record de livraison** | **Hydrautech : <2 mois** (plateforme gestion + formation 10+ employés + 200+ matériels tracés) | Direct |
| **Délai d'avance moyen** | **Ndougalma : 5 mois → 3 mois** (livré 2 mois en avance) | Direct |
| **Auto-écoles inscrites sur Créneau** | **30** en 5 mois | Direct |
| **Inscriptions élèves générées via marketplace Créneau** | **50** | Direct |
| **Photos uploadées/mois sur Nurapic** | **2 000+** (3 mois en prod) | Direct |

---

## 4. Direction artistique

### Mood
**80% Swiss + soul** (rigueur typographique, grille forte, copy intelligent — refs : Tighten, Pixelmatters, Verhaert, Oryzo)
**+ 20% Tech maximaliste** sur moments T1 signature (refs : Lusion, Active Theory)

### Système d'orchestration 3-tiers

| Tier | Où | Rendu | Stack |
|---|---|---|---|
| **T1 — Signature** | Hero principal, transition Produits, case study Hydrautech | WebGL custom (R3F) + scène 3D simple + sound design discret on-hover | React Three Fiber + GLSL léger + (Tone.js optionnel V2) |
| **T2 — Précision** | Sections services, process, métriques, témoignages, scroll réalisations | Animations chorégraphiées au scroll, 2D, compteurs, courbes, screenshots animés | GSAP + ScrollTrigger + Framer Motion + Lenis |
| **T3 — Sobre** | Case studies détaillées, blog Notes, mentions légales, formulaires | Transitions discrètes, focus contenu, performance prioritaire | Tailwind + transitions CSS |

### Typographie — VALIDÉE

> **Décision** : on remplace **Montserrat** (police display de l'ancien site) par **Newsreader**.
> Conséquence assumée : la marque évolue de *"agence tech moderne"* (Montserrat sans-serif) vers *"studio éditorial premium"* (Newsreader serif). C'est aligné avec le repositionnement studio produit.

| Rôle | Police | Pourquoi | Licence |
|---|---|---|---|
| **Display** (titres, Hero, sections) | **Newsreader** (Google Fonts) — **remplace Montserrat** | Serif éditorial à optical sizing variable, contraste fort, soul "magazine" qui colle au studio produit | Open Source (SIL) |
| **Body** (texte courant, copy, paragraphes) | **Inter** (inchangé) | Workhorse moderne, lisibilité parfaite FR + EN + diacritiques, supportée partout | Open Source (SIL) |
| **Mono** (stack mentions, code blocks dans Notes) | **JetBrains Mono** | Clarté technique, ligatures dispo, signal "studio dev" | Open Source (Apache 2.0) |

**Upgrade ultérieur envisageable si budget** : remplacer Newsreader par **PP Editorial New** (Pangram Pangram, ~$200) pour un display plus distinctif. À rediscuter post-V1.

### Palette — VALIDÉE (alignée sur la brand TerangaDev existante)

> **Discipline** : pas d'accent chaud foreign (terracotta, emerald, lime — abandonnés). Tout ce qui n'est pas neutre passe par le **gradient bleu signature** du logo. Cohérence forcée, évite l'effet "agence qui pioche dans toutes les couleurs Tailwind par défaut".

```
BRAND CORE (existant — extrait de tailwind.config.ts)
  teranga-primary    #0A68F7   electric blue (logo gradient end-stop)
  teranga-secondary  #4EA8F9   sky blue (logo gradient mid)
  teranga-dark       #1A1B22   near-black avec hint pourpre

NEUTRES TECH (existant)
  tech-gray-dark     #403E43
  tech-gray          #8E9196
  tech-gray-light    #F6F6F7

LIGHT MODE (par défaut)
  bg            #FFFFFF        existant
  fg            #1A1B22        teranga-dark
  muted         #6B7280        gris texte secondaire
  border        #E5E7EB        borders subtiles
  surface       #F6F6F7        tech-gray-light (alt sections)

DARK MODE (toggle)
  bg            #0A0F1C        teranga-dark approfondi
  fg            #F1F5F9        warm off-white
  muted         #94A3B8
  border        #1E293B
  surface       #111827

GRADIENT SIGNATURE (Hero T1, CTA hover, badges LIVE, accents stratégiques)
  from #4EA8F9  →  to #0A68F7   (le gradient du logo)
```

**Logo** : le T à double découpe en gradient bleu — signature inchangée, à conserver dans tous les contextes (header, favicon, OG image, signature email).

### Principes d'animation
- **Easing** : `cubic-bezier(0.16, 1, 0.3, 1)` (out-expo modifié) sur 600-800ms pour les T2 / T1
- **Pas de spring bounce** — on est studio, pas application iOS
- **Sound design** : limité aux interactions T1 (Hero hover, transition vers Produits). Toujours muté par défaut, opt-in visible.
- **Performance** : T1 dégradé proprement sur mobile mid-range. Détection `prefers-reduced-motion` respectée partout.

### Références visuelles inspirantes (validées en discovery)
- **Visuel** : oryzo.ai, exp-ion.lusion.co, activetheory.net
- **Voix & business** : tighten.com, pixelmatters.com, verhaert.digital

### Anti-patterns à proscrire (issus de l'audit concurrence)
- ❌ Copy générique copié-collé entre agences
- ❌ Bourrage SEO 2012-style ("création site web Dakar" répété 30 fois)
- ❌ Témoignages anonymes ("Aminata D." sans entreprise ni photo)
- ❌ Études de cas = screenshots sans contexte business
- ❌ Équipe invisible (pas de photos, pas de noms)
- ❌ Prix entièrement cachés
- ❌ Stack technique invisible
- ❌ Blog vide ou rempli de billets génériques sur "pourquoi un site web en 2025"
- ❌ Wax cliché en background

---

## 5. Architecture & sitemap

### Menu principal (5 entrées max)
```
Produits  ·  Réalisations  ·  Services  ·  Notes  ·  Studio          [Discutons]
```
- **Logo** = retour Accueil
- **CTA bouton à droite du menu** : *« Discutons de ton projet »* (modal formulaire)
- **Sticky** scroll réduit (header transparent → solide)
- **Mobile** : burger classique mais animation T2 quand ouvert

### Pages

| Slug | Titre | Job |
|---|---|---|
| `/` | Accueil | Hook + 3 chemins ICP + preuves + double CTA |
| `/produits` | Produits | 4 cartes SaaS au scroll (2 LIVE, 2 EN PILOTE) |
| `/produits/creneau` | Créneau | Page produit dédiée — fiche, métriques, démo, lien externe |
| `/produits/nurapic` | Nurapic | Idem |
| `/produits/sama-reservation` | Sama Reservation | SaaS de réservation pour **salons de coiffure, massage, esthétique & wellness** |
| `/produits/ticket-events` | Ticket-Events | SaaS de billetterie pour **organisateurs d'événements** (concerts, conférences, salons) |
| `/realisations` | Réalisations | Index des cas clients |
| `/realisations/hydrautech` | Hydrautech | Case study détaillée — Client / Problème / Approche / Résultats chiffrés |
| `/realisations/ndougalma` | Ndougalma | Case study détaillée |
| `/realisations/...` | autres cas | À étoffer V2/V3 |
| `/services` | Services | Vue d'ensemble + fourchettes tarifaires |
| `/services/plateformes-gestion` | Plateformes de gestion | Service détaillé |
| `/services/accompagnement-projet` | Accompagnement A-Z | Service détaillé |
| `/services/identite-site-vitrine` | Identité visuelle + site vitrine | Service détaillé |
| `/services/audit-systeme` | Audit SI (réseaux + logiciel) | Service détaillé |
| `/services/audit-securite` | Audit sécurité | Service détaillé |
| `/services/reseaux-telephonie-ip` | Installation réseaux & téléphonie IP | Service détaillé |
| `/services/marketing-digital` | Marketing digital | Service détaillé |
| `/notes` | Notes | Index blog/journal |
| `/notes/[slug]` | Article | Template article |
| `/studio` | Studio | Équipe + histoire + manifeste souveraineté |
| `/rejoindre` | Rejoindre | On embauche / Spontanées |
| `/contact` | Contact | Formulaire long + Calendly + WhatsApp + adresse Dakar |
| `/manifeste` | Manifeste (V3) | Page-essai sur les choix techniques |
| `/mentions-legales` | Mentions légales | Obligatoire |
| `/confidentialite` | Politique de confidentialité | Obligatoire |

### i18n
- Routes : `/fr/...` (défaut, sans préfixe en URL canonique) et `/en/...`
- Hreflang propre, sitemap.xml multilingue
- Switch langue dans header secondaire (à droite, discret)

---

## 6. Wireframe textuel — Page Accueil

```
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER  [logo TerangaDev]  Produits Réalisations Services Notes Studio  [FR/EN]  [Discutons →]
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  HERO  (T1 — signature)                                              │
│  ┌─────────────────────────┬─────────────────────────────────────┐  │
│  │ Le seul studio à Dakar  │  [Scène R3F — V1: gradient GSAP    │  │
│  │ qui shippe ses propres  │   animé / V2: WebGL custom]         │  │
│  │ SaaS depuis 2022 —      │                                      │  │
│  │ et qui t'accompagne     │                                      │  │
│  │ de l'idée à la          │                                      │  │
│  │ maintenance.            │                                      │  │
│  │                         │                                      │  │
│  │ [Discutons]  [Réserver] │                                      │  │
│  └─────────────────────────┴─────────────────────────────────────┘  │
│                                                                       │
├─────────────────────────────────────────────────────────────────────┤
│  BANDEAU CHIFFRES  (T2 — compteurs animés)                          │
│  4 SaaS en prod  ·  ~30 projets livrés  ·  6 clients en maintenance │
│  · Hydrautech livré en <2 mois · Ndougalma livré 2 mois en avance   │
├─────────────────────────────────────────────────────────────────────┤
│  3 CHEMINS ICP  (T2 — 3 colonnes scroll-reveal)                     │
│  ┌───────────┬───────────┬───────────┐                              │
│  │ Tu gères  │ Tu portes │ Tu cherches│                              │
│  │ ton stock │ une idée  │ un SaaS    │                              │
│  │ à la main │ à lancer  │ vertical   │                              │
│  │           │           │            │                              │
│  │ → Hydra-  │ → Ndou-   │ → Créneau, │                              │
│  │   utech   │   galma   │   Nurapic  │                              │
│  └───────────┴───────────┴───────────┘                              │
├─────────────────────────────────────────────────────────────────────┤
│  PRODUITS — TEASER  (T1 transition vers /produits)                   │
│  Aperçu des 4 SaaS, scroll horizontal ou cartes orchestrées         │
│  → CTA "Voir tous nos produits"                                      │
├─────────────────────────────────────────────────────────────────────┤
│  RÉALISATIONS — TEASER  (T2)                                        │
│  3 case studies en avant : Hydrautech / Ndougalma / 1 autre         │
│  → CTA "Voir toutes nos réalisations"                                │
├─────────────────────────────────────────────────────────────────────┤
│  POURQUOI NOUS  (T2 — narrative)                                    │
│  "On a codé, lancé et maintenu 4 SaaS sous notre marque.            │
│  On sait ce que ça coûte de faire vivre un produit — c'est pour ça  │
│  qu'on accompagne le tien jusqu'au bout."                           │
│  + 4 piliers : Studio produit / Souveraineté technique /            │
│    Accompagnement A-Z / Délais respectés                            │
├─────────────────────────────────────────────────────────────────────┤
│  ÉQUIPE — TEASER  (T2 — photos noir & blanc, hover couleur)         │
│  6 visages avec noms + rôles + stack maîtrisé                       │
│  → CTA "Découvrir le studio"                                         │
├─────────────────────────────────────────────────────────────────────┤
│  TÉMOIGNAGES  (T3 — citations nominatives)                          │
│  3 témoignages : prénom + nom + entreprise + photo + 1 ligne forte  │
├─────────────────────────────────────────────────────────────────────┤
│  NOTES — TEASER  (T3)                                               │
│  3 derniers articles : titre + 1 ligne + lecture estimée            │
├─────────────────────────────────────────────────────────────────────┤
│  CTA FINAL  (T1 — section pleine page)                              │
│  "Tu as un projet ? On en discute en 30 minutes."                   │
│  [Formulaire court]  [Réserver Calendly]  [WhatsApp +221 77 942...] │
├─────────────────────────────────────────────────────────────────────┤
│  FOOTER  Logo · Liens · Stack visible · Point E Dakar              │
│         contact@terangadev.com · WhatsApp · Réseaux                 │
│         Mentions / Confidentialité · "Hébergé sur OVH France"      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 7. Stratégie de copy par section (job-to-be-done)

| Section Home | Job principal | Mécanique copy |
|---|---|---|
| Hero | Faire stopper le scroll en 3 secondes et identifier le visiteur | One-liner court + CTA double |
| Bandeau chiffres | Donner crédibilité avant que le doute s'installe | Métriques brutes, pas d'adjectifs |
| 3 chemins ICP | Permettre au visiteur de se reconnaître en <10s | Phrase d'identification commençant par « Tu » |
| Teaser Produits | Asseoir le positionnement studio produit | Aperçu visuel fort, peu de texte, vers `/produits` |
| Teaser Réalisations | Prouver par les cas | Métrique forte par card, pas de blabla |
| Pourquoi nous | Convertir l'attention en intention | Storytelling 2 phrases + 4 piliers courts |
| Équipe | Construire confiance via visages | Photos pro + stack maîtrisé en mono |
| Témoignages | Lever les dernières objections | Citations nominatives, 1 ligne max chacune |
| Notes teaser | Asseoir l'autorité technique | 3 articles récents, ton Tighten |
| CTA final | Convertir | Formulaire 4 champs + Calendly + WhatsApp |

---

## 8. CTAs & funnel

### CTA primaire (sur tout le site)
- **Bouton "Discutons de ton projet"** → modal formulaire 4 champs (Nom · Entreprise · Que veux-tu construire · Email/WhatsApp)
- **Bouton "Réserver un appel" à parité de visibilité** → Calendly direct (créneau 30 min)
- Les deux **côte-à-côte**, jamais l'un en gras et l'autre planqué

### Canaux contact (page /contact + footer)
- Formulaire long (avec budget approximatif, timeline souhaitée, type de projet)
- Calendly intégré
- WhatsApp business `+221 77 942 33 17` (lien direct)
- Email : `contact@terangadev.com` (à valider)
- Adresse physique Dakar (à compléter)

### Tarification — fourchettes finales validées

Affichage en bas de chaque page Service correspondante, formulation type :
> *« Projets typiques entre X et Y FCFA. Devis fixe après cadrage. »*

| Service | Fourchette FCFA | Note |
|---|---|---|
| **Site vitrine + identité visuelle** | **150 000 → 2 000 000** | Le haut de fourchette = vitrine *exceptionnel + rebrand identité complète* |
| **E-commerce** | **150 000 → 1 000 000** | Tournant typiquement autour de 350-400k pour un projet standard |
| **Application SaaS pour porteur de projet** | **1 800 000 → 30 000 000** | Inclut idéation, dev, marketing, maintenance |
| **Système de gestion sur mesure** | **1 800 000 → 30 000 000** | Inclut formation équipe + maintenance annuelle |
| **Audit SI, audit sécurité, réseaux/IP** | Sur devis | Dépend du périmètre client |
| **Marketing digital** | Non quantifiable a priori | Devis cas par cas |

**Logique d'affichage** : ces fourchettes filtrent l'anti-ICP "négociateur au rabais" (qui voit qu'on n'est pas un studio à 50k FCFA) sans bloquer les gros projets institutionnels.

---

## 9. Stack technique

### Frontend
```
Next.js 15 (App Router)
React 19
TypeScript strict
Tailwind CSS v4 + tailwind-variants
Framer Motion         (animations 2D contextuelles)
GSAP + ScrollTrigger  (chorégraphies T2)
Lenis                 (smooth scroll)
React Three Fiber + drei  (1 morceau Hero T1, simple)
next-intl             (i18n FR/EN, hreflang)
shadcn/ui             (modal, form, dialog)
React Hook Form + Zod (formulaires)
```

### Backend
```
Payload CMS (auto-hébergé) — choix par défaut, compatible n8n via API REST
PostgreSQL (côté Payload)
Resend                (emails formulaire contact)
Calendly embed        (booking)
n8n                   (auto-publish blog, V3)
```

### Hébergement
- **Site marketing** : **OVH France** (validé) — alignement souveraineté technique, performance correcte sur l'Afrique francophone via réseau OVH
- **Domaine** : terangadev.com (déjà actif, à migrer)
- **CDN** : Cloudflare (gratuit, perf globale, edge en Afrique)
- **Analytics** : Plausible (self-hosted ou cloud) — privacy-first, cohérent avec souveraineté

### Accessibilité, perf, SEO
- Lighthouse cible : **>90 sur les 4 axes**
- Core Web Vitals : LCP <2.5s sur Android mid-range
- Contraste WCAG AA partout, AAA sur le copy principal
- `prefers-reduced-motion` respecté
- Schema.org : Organization, Service, BlogPosting, BreadcrumbList
- Sitemap.xml + robots.txt + hreflang

---

## 10. Production de contenu

| Asset | Responsable | Échéance |
|---|---|---|
| **Brief photographe** | Claude rédige, Mouhamed valide et envoie | J+10 |
| **Rédaction copy FR** (home + 4 produits + 4 cases + about + manifeste + 2 articles Notes) | Mouhamed + Claude | J+30 |
| **Traduction copy EN** complète | Mouhamed + Claude | J+45 |
| **Démos vidéo des 4 SaaS** (Loom/Screen Studio) | Mouhamed selon instructions Claude | J+45 |
| **Photographie équipe pro** | Photographe externe Dakar | J+50 |
| **Logos clients** (autorisations formalisées) | Mouhamed | J+55 |
| **Témoignages clients nominatifs** (×3 min) | Mouhamed | J+45 |

### Angles éditoriaux Notes (validés)
**Mix A + B + C + D, diversifié :**
- A — Notes techniques : choix Laravel, Postgres, Docker, retours stack
- B — Retours d'XP produit : leçons Créneau, Nurapic
- C — Souveraineté & marché : état de la tech au Sénégal, dépendance GAFAM
- D — Pédagogie client : combien coûte vraiment X, comment choisir Y

**Fréquence cible** : minimum 1 article/mois, ramp à 2-3/mois en croisière (n8n + manuel).

---

## 11. Timeline — V1 unique à J+60

> **Décision (validée 2026-05-02)** : on abandonne le phasage V1/V2/V3. On ship **un V1 monolithique, complet et finalisé, à J+60** (≈ 2 mois).
>
> **Pourquoi** : à J+60, les pilotes Sama Reservation + Ticket-Events seront finis, donc les 4 SaaS seront tous publics. Le site sort en cohérence totale (FR + EN + R3F + Notes + n8n + photos pro), pas en plusieurs vagues incohérentes.

### Périmètre V1 (J+60)

**Pages**
- Home complète avec Hero **R3F WebGL** (T1 signature, niveau Lusion-grade visé)
- 4 pages Produits — toutes en **LIVE** (Créneau, Nurapic, Sama Reservation, Ticket-Events) avec démos animées intégrées
- Réalisations index + 4 case studies détaillées (Hydrautech, Ndougalma, Créneau, Nurapic)
- 7 pages Services + fourchettes tarifaires affichées
- Notes : squelette CMS Payload + 2 premiers articles publiés
- Studio (équipe, histoire, manifeste souveraineté)
- Rejoindre
- Contact (formulaire long + Calendly + WhatsApp)
- Mentions légales + Politique de confidentialité

**Langues**
- **FR** complète
- **EN** complète avec hreflang propre

**Production contenu**
- Copy production FR + EN (Mouhamed + Claude)
- **Photos équipe pro intégrées** (shoot complet réalisé avant J+50)
- Démos vidéo des 4 SaaS (Loom/Screen Studio sous instructions Claude)
- Logos clients avec autorisations OK

**Technique**
- Stack complet (Next 15 + Tailwind v4 + Framer Motion + GSAP + R3F + Payload + i18n)
- Motion T1/T2/T3 déployée selon plan §4
- CMS Payload opérationnel — Mouhamed publie en autonomie
- n8n auto-publish blog branché et testé
- Hébergement OVH France final
- Audit Lighthouse ≥85 sur 4 axes mobile + desktop
- Schema.org, sitemap.xml, robots.txt, hreflang

### Capacités allouées
- **Mouhamed** : 4h/jour × ~50 jours ouvrés ≈ 200h
- **Claude** : disponible sur demande, sessions denses
- **Photographe externe** : à briefer avant J+10, shoot avant J+50

### Jalons cibles
| Jalon | Date relative | Livrable |
|---|---|---|
| J+0 | Démarrage build | Brief locké, repo prêt |
| J+10 | Brief photographe | Brief shoot rédigé, photographe choisi |
| J+15 | Squelette site | Toutes les pages routées, layouts en place, design tokens posés |
| J+30 | Contenu FR complet | Toutes pages écrites en FR, Hero T1 placeholder en place, motion T2 déployée |
| J+45 | Hero R3F + EN | Scène WebGL livrée, traduction EN bouclée, démos SaaS intégrées |
| J+50 | Photos équipe | Shoot pro terminé, photos intégrées |
| J+55 | QA + perf | Audits Lighthouse passés, accessibilité validée, mobile testé en réel |
| **J+60** | **Ship V1** | Site live sur OVH, DNS migré, monitoring en place |

---

## 12. Maintenance post-livraison

- **Owners** : Mouhamed + Claude
- **Cadence** : audit trimestriel (Lighthouse, deps, content)
- **Updates** : Renovate ou Dependabot pour les deps automatiques
- **Backups** : DB Payload sauvegardée quotidiennement (cron + S3-compatible)
- **Monitoring** : UptimeRobot ou équivalent sur le marketing site

---

## 13. Décisions ouvertes pour la phase build

> Les 8 décisions ouvertes du cadrage ont **toutes été tranchées** en phase 5+ (hébergement OVH France, tagline confirmée, Point E Dakar, contact@terangadev.com, secteurs Sama/Ticket, fourchettes tarifaires, typo Newsreader, palette TerangaDev existante respectée).

Décisions restantes pour démarrer la build :

1. ⚠️ **Stratégie repo** : refactor du repo `cyber-pulse-design` existant (Vite + React) en Next.js 15, ou création d'un repo neuf et migration progressive ? Impact sur git history, CI, hébergement actuel.
2. ⚠️ **Choix CMS final** : Payload (auto-hébergé sur OVH, plus de contrôle) vs Sanity (cloud, vitesse de mise en place). À trancher avant J+15.
3. ⚠️ **Photographe Dakar** : nom + budget shoot équipe (6 personnes + ambiance studio). Brief Claude prêt à fournir avant J+10.
4. ⚠️ **Briefs détaillés cas clients** : récupérer auprès d'Arona / clients les autorisations + métriques précises pour Hydrautech / Ndougalma / Créneau / Nurapic, format case study Pixelmatters-grade.
5. ⚠️ **Autorisations logos clients** : confirmées au global, à formaliser un par un par écrit avant publication V1.
6. ⚠️ **Métriques pilote Sama Reservation + Ticket-Events** à collecter d'ici J+50 pour les pages produits.
7. ⚠️ **Témoignages clients nominatifs** : 3 minimum à collecter d'ici J+45 (citation + nom + entreprise + photo + autorisation).

---

## 14. Anti-patterns à proscrire absolument

```
❌ « expertise », « leadership », « solutions sur mesure »
❌ Copy générique copiable d'un site d'agence à l'autre
❌ Bourrage SEO ("création site web Dakar" répété)
❌ Témoignages anonymes (« Aminata D. »)
❌ Études de cas sans contexte business chiffré
❌ Équipe invisible (zéro photo, zéro nom)
❌ Prix entièrement cachés
❌ Stack technique invisible
❌ Blog vide ou rempli de billets génériques
❌ Wax cliché en background
❌ Auto-acceptation de cookies sans choix
❌ Slider Hero rotatif (8 messages = aucun message)
❌ Pop-ups intrusifs
❌ Compteurs LinkedIn fake
```

---

## 15. Définition de "fait" pour V1

- [ ] Toutes les pages V1 listées en §11 sont en ligne sur terangadev.com
- [ ] Lighthouse ≥85 sur les 4 axes en mobile + desktop
- [ ] Formulaire contact fonctionnel + email Resend → réception confirmée
- [ ] Calendly embed opérationnel
- [ ] WhatsApp link opérationnel
- [ ] CMS Payload : Mouhamed peut publier un article Notes sans aide
- [ ] Accessibilité : nav clavier complète, contraste WCAG AA, alt sur toutes les images
- [ ] SEO basique : sitemap.xml, robots.txt, schema.org Organization, meta description par page
- [ ] Mobile : tout fluide sur Android mid-range testé en réel

---

*Brief consolidé après 5 thématiques de discovery. Toute modification = update direct de ce fichier avant push code.*
