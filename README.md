# TerangaDev — Studio produit dakarois

Le repo du site refondu **terangadev.com** — studio produit basé à Dakar
qui shippe ses propres SaaS depuis 2024 et accompagne ses clients de
l'idée à la maintenance.

> Brief de cadrage complet : voir [`BRIEF.md`](./BRIEF.md).
> Brief photographe (J+50) : voir [`BRIEF_PHOTO.md`](./BRIEF_PHOTO.md).

---

## Stack

- **Next.js 16** (App Router, Turbopack)
- **React 19** + TypeScript strict
- **Tailwind CSS v4** avec `@theme` brand tokens (gradient #0A68F7 → #4EA8F9)
- **next-intl v4** pour i18n FR/EN avec `localePrefix: 'as-needed'`
- **Framer Motion + GSAP + Lenis** pour les motions T1/T2
- **React Three Fiber + drei** pour le Hero T1 WebGL
- **Payload CMS v3** auto-hébergé (SQLite dev, PostgreSQL prod)
- **Resend** pour les emails du formulaire de contact
- **Schema.org JSON-LD** sur toutes les pages indexables
- **OpenGraph image** dynamique générée via `next/og`

## Structure

```
app/
├── (payload)/                 ← admin Payload + REST/GraphQL routes
├── [locale]/                  ← pages localisées FR/EN
│   ├── produits/{,[slug]}     ← 4 SaaS (Créneau, Nurapic, Sama, Ticket)
│   ├── realisations/{,[slug]} ← cas Hydrautech, Ndougalma
│   ├── services/{,[slug]}     ← 7 services (plateformes, A-Z, audit, etc.)
│   ├── notes/{,[slug]}        ← blog wired Payload Local API
│   ├── studio                 ← équipe + manifeste souveraineté
│   ├── rejoindre              ← careers
│   ├── contact                ← formulaire 7 champs + Calendly + WhatsApp
│   ├── mentions-legales       ← légal sénégalais
│   ├── confidentialite        ← RGPD + loi 2008-12
│   ├── opengraph-image.tsx    ← OG image 1200×630 dynamique
│   └── not-found.tsx          ← 404 customisé
├── api/contact/               ← Resend wiring + log fallback
├── sitemap.ts + robots.ts     ← SEO crawlable
collections/                    ← Payload Posts/Media/Users
components/
├── home/                      ← 7 sections home
├── hero/                      ← R3F WebGL Canvas + fallback
├── products|cases|services/   ← templates détail
├── motion/                    ← reveal + counter
└── seo/                       ← JsonLd component
i18n/                          ← next-intl routing config
lib/                           ← cases, products, services, team, schema...
messages/{fr,en}.json          ← copy bilingue
payload.config.ts              ← config Payload + collections
```

## Démarrage

```bash
pnpm install
pnpm payload generate:importmap   # première fois seulement
pnpm dev
```

Ouvre [http://localhost:3000](http://localhost:3000) (FR) ou
[http://localhost:3000/en](http://localhost:3000/en).

Admin Payload : [http://localhost:3000/admin](http://localhost:3000/admin)
(au premier accès, wizard de création du compte admin).

## Variables d'environnement

Crée un `.env.local` à la racine (gitignoré) :

```bash
# Payload CMS
PAYLOAD_SECRET=change-me-please-rotate-in-prod
DATABASE_URI=file:./terangadev.db   # SQLite dev
# DATABASE_URI=postgres://user:pass@host:5432/terangadev   # Postgres prod

# Resend (optional — sans clé, /api/contact log seulement)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxx
CONTACT_EMAIL=contact@terangadev.com
CONTACT_FROM=TerangaDev <contact@terangadev.com>
```

## Commandes utiles

```bash
pnpm dev                            # dev server
pnpm build && pnpm start            # build + prod local
pnpm lint                           # ESLint
pnpm payload generate:importmap     # regen admin import map
pnpm payload generate:types         # regen payload-types.ts
pnpm payload migrate                # run DB migrations (Postgres prod)
```

## Architecture du build

53 pages statiques + 5 routes dynamiques (admin, REST, GraphQL,
GraphQL playground, /api/contact). Tout buildé en ~60s avec
Turbopack.

Routes notables :
- `/sitemap.xml` — 51 URLs avec `hreflang` FR/EN
- `/robots.txt` — `Allow: /` + `Disallow: /api/`
- `/opengraph-image` — OG image générée par locale
- `/admin/*` — Payload admin UI
- `/api/[...slug]` — Payload REST API
- `/api/graphql` — Payload GraphQL endpoint

## Hosting cible

OVH France (Roubaix / Gravelines) — alignement souveraineté technique
avec le manifeste de la page `/studio`. SQLite en dev, PostgreSQL en
prod (à provisionner sur le VPS au moment du DNS migration J+60).

## Contributions

Repo privé sous `Momojr004/terangadev-studio`. Issues et PR via GitHub.

Direction artistique et front : Mouhamed.
Direction produit et architecture : Arona Momo.
