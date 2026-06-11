# DEPLOYMENT — TerangaDev Studio V1

> Checklist opérationnelle pour le ship V1 sur `terangadev.com`.
> Suivre dans l'ordre. Cocher au fur et à mesure.

**Stack (branche `ibnou-v2`)** : Next.js 16 (Turbopack) · React 19 · **Node 22** · Payload CMS 3 · **SQLite** (`@payloadcms/db-sqlite` / libsql) · Resend (emails) · next-intl (FR/EN). Build vérifié **exit 0**, ESLint **0 erreur / 0 warning**, typecheck OK.

---

## 0. Pré-requis (avant de lancer le déploiement)

### Décisions business à confirmer
- [ ] **RCCM** réel d'Arona à inscrire dans `app/[locale]/mentions-legales/page.tsx` (champ "à compléter")
- [ ] **NINEA** réel à inscrire idem
- [ ] **Adresse complète** Point E (numéro de rue, etc.) à valider
- [ ] **Email contact officiel** : `contact@terangadev.com` confirmé ?
- [ ] **WhatsApp pro** : `+221 77 942 33 17` confirmé ?

### Comptes externes à créer
- [ ] **Resend** : créer compte sur resend.com, générer API key, vérifier domaine `terangadev.com` (SPF + DKIM records DNS)
- [ ] **GitHub repo** : passer `Momojr004/terangadev-studio` en **public** (actuellement privé) — décision à prendre, pour ou contre la transparence du code
- [ ] **Plausible** ou alternative analytics : décider. Recommandé **Plausible self-hosted** pour cohérence souveraineté technique

### Asset attendus (J+50 photos pro)
- [ ] Photos équipe livrées par photographe Dakar (6 portraits 4:5 + 3-4 ambiances 16:9)
- [ ] Format final : WebP optimisé, sRGB, dimensions cohérentes
- [ ] Placement attendu : `public/team/{arona,babacar,mouhamed,rane,ibnou,yabaye}.webp`
- [ ] Update `lib/team.ts` : ajouter `photo: "/team/<id>.webp"` à chaque membre
- [ ] Update `components/team/team-grid.tsx` : remplacer placeholder initiales par `<Image>` next/image

---

## 1. Provisioning serveur

### VPS OVH
- [ ] VPS provisionné (recommandé : VPS Comfort 4 vCore / 8 GB RAM / 160 GB SSD à Gravelines)
- [ ] Ubuntu 24.04 LTS installé
- [ ] SSH key déployée, password root désactivé
- [ ] Firewall UFW configuré : 22 (SSH custom port), 80, 443 ouverts
- [ ] Fail2ban installé sur SSH

### Stack runtime
- [ ] Node.js **22 LTS** installé via nodesource — **requis** (des deps, dont `undici`, exigent les Web APIs de Node 22 ; Node 20 plante)
- [ ] pnpm activé via corepack : `corepack enable && corepack prepare pnpm@latest --activate`
- [ ] PM2 ou systemd unit pour process management
- [ ] **Base SQLite** (`@payloadcms/db-sqlite` / libsql) — **aucun serveur de base de données à provisionner**. Deux options :
  - **Fichier local** (défaut, le plus simple) : la base vit dans un fichier sur le disque du VPS (ex. `/opt/terangadev/data/terangadev.db`), à inclure dans les backups.
  - **libsql managé** (Turso / serveur libsql) : possible, mais le code ne lit aujourd'hui que `DATABASE_URI` comme `client.url` — un token d'auth nécessiterait d'ajouter `authToken` dans `payload.config.ts`.
- [ ] Caddy ou Nginx pour reverse proxy + auto-HTTPS Let's Encrypt
- [ ] Disk space monitoring (df, alertes > 80%)

### Variables d'environnement
Créer `/opt/terangadev/.env.production` :

```bash
NODE_ENV=production

# Payload
PAYLOAD_SECRET=<rotate via openssl rand -hex 32>
# SQLite/libsql — fichier local (défaut). Voir §1 pour l'option libsql managé.
DATABASE_URI=file:/opt/terangadev/data/terangadev.db

# Resend (formulaire /contact, via app/api/contact/route.ts)
RESEND_API_KEY=re_<key>
CONTACT_EMAIL=contact@terangadev.com
CONTACT_FROM=TerangaDev <contact@terangadev.com>
```

> ℹ️ **`NEXT_PUBLIC_SITE_URL` n'est plus requis** : l'URL canonique est codée en dur dans `lib/site-config.ts` (et reprise par `robots.ts` / `sitemap.ts`). Pour changer de domaine, éditer ce fichier.

- [ ] Permissions strictes sur `.env.production` : `chmod 600`, owner = node user
- [ ] Créer le dossier de la base : `mkdir -p /opt/terangadev/data` (si fichier SQLite local)

---

## 2. Domain + DNS

### DNS records à configurer chez registrar (probablement OVH ou Gandi)
- [ ] `terangadev.com` → A record pointant sur l'IP du VPS
- [ ] `www.terangadev.com` → CNAME `terangadev.com`
- [ ] `_atproto.terangadev.com` → optionnel (BlueSky verification)
- [ ] **TTL** : 300 (5 min) le jour du switch pour rollback rapide, remonter à 3600 après stabilisation

### Resend domain verification
- [ ] TXT `_dmarc.terangadev.com` : politique DMARC
- [ ] TXT `terangadev.com` : SPF (`v=spf1 include:_spf.resend.com ~all`)
- [ ] TXT DKIM key fournie par Resend
- [ ] Vérification dans dashboard Resend → green checkmarks

### SSL / HTTPS
- [ ] Caddy ou Nginx + certbot configuré
- [ ] HSTS activé (max-age 31536000)
- [ ] HTTP → HTTPS redirect 301

---

## 3. Build et déploiement

### Première mise en ligne
- [ ] `git clone https://github.com/Momojr004/terangadev-studio.git /opt/terangadev/app`
- [ ] `cd /opt/terangadev/app && git checkout ibnou-v2` (branche de travail courante — ou `main` une fois `ibnou-v2` mergée)
- [ ] `pnpm install --frozen-lockfile` (avec **Node 22** actif)
- [ ] `pnpm payload generate:importmap` — **requis** : génère `app/(payload)/admin/importMap.js` (gitignoré). Sans lui, le build casse sur la route `/admin`. *(Ce projet n'a aucun composant admin custom → le fichier généré est simplement `export const importMap = {}`.)*
- [ ] **Migrations Payload (SQLite)** : aucune migration n'est versionnée dans le repo (pas de dossier `migrations/`). Lancer `pnpm payload migrate:create` (génère la 1ère migration) **puis** `pnpm payload migrate` (crée les tables). Committer le dossier `migrations/` pour les déploiements suivants.
- [ ] `pnpm build` (vérifier **exit 0** — build validé localement : 21 routes compilées, 55 pages statiques générées)
- [ ] `pnpm start --port 3000` ou via PM2 : `pm2 start "pnpm start" --name terangadev`
- [ ] Vérifier que le service répond sur `localhost:3000`
- [ ] Reverse proxy Caddy/Nginx pointe sur `localhost:3000`
- [ ] Curl `https://terangadev.com` → HTTP 200 (after DNS propagation)

### Smoke tests post-deploy
- [ ] `/` → redirect `/manifeste` (cookie absent)
- [ ] `/manifeste` → 7 chapitres rendus
- [ ] `/produits` → 4 SaaS cards visibles
- [ ] `/realisations/hydrautech` → case study visible
- [ ] `/services/plateformes-gestion` → service detail + tarifs
- [ ] `/admin` → wizard Payload pour 1er user
- [ ] `/api/contact` → POST avec payload valide retourne 200
- [ ] `/sitemap.xml` → XML valide avec **46 URLs** (23 chemins × FR/EN : 10 statiques + 4 produits + 2 réalisations + 7 services)
- [ ] `/robots.txt` → contenu correct

### Verifications EN
- [ ] `/en/` → version anglaise du site
- [ ] `/en/manifeste` → version EN du manifeste
- [ ] Locale switcher (FR / EN) fonctionne sur toutes les pages

---

## 4. Post-deploy

### Première utilisation Payload
- [ ] Visite `/admin` → créer le 1er user admin (email + password robuste)
- [ ] Stocker creds dans 1Password / Bitwarden
- [ ] Créer 1er post de test status=published
- [ ] Vérifier `/notes` affiche le post (et non plus les placeholders)
- [ ] Visite `/notes/<slug>` → article rendu via Lexical

### Monitoring
- [ ] UptimeRobot configuré : ping `/` toutes les 5 min, alerte mail si down
- [ ] Logs PM2 ou systemd visibles (`pm2 logs` ou `journalctl -u terangadev`)
- [ ] Backup SQLite quotidien automatisé (cron : `sqlite3 terangadev.db ".backup '/backups/terangadev-$(date +\%F).db'"` → storage S3-compatible OVH)
- [ ] Plausible self-hosted ou cloud déployé (optionnel V1.0)

### SEO submission
- [ ] Google Search Console : verify ownership + submit sitemap
- [ ] Bing Webmaster Tools : idem
- [ ] Cocher dans GSC que `/manifeste` est noindex (intentionnel)

---

## 5. Cookie analytics + rétention (RGPD-compliant)

- [ ] Vérifier qu'aucun cookie tiers n'est posé par défaut (audit via Privacy Badger ou similar)
- [ ] Banner cookies UNIQUEMENT si on active Plausible cloud (analytics privacy-first ne nécessite pas de banner si self-hosted EU)
- [ ] Page `/confidentialite` à jour avec date du déploiement (champ "Dernière mise à jour" → updater à la date du ship)

---

## 6. Communication interne

- [ ] Annonce équipe TerangaDev (Slack interne)
- [ ] Update `BRIEF.md` à la racine du repo : statut V1 = SHIPPED, date
- [ ] Commit "chore: mark V1 as shipped <date>" → tag git `v1.0.0`
- [ ] Backup de l'ancien site `terangadev.com` (au cas où rollback needed)

---

## 7. Communication externe (post-ship)

- [ ] Post LinkedIn d'Arona : annonce nouveau site + lien
- [ ] Email aux clients existants (les 6 sous contrat de maintenance)
- [ ] Mention sur WhatsApp Status TerangaDev
- [ ] Optionnel : article de presse (Senego, Africa Tech...)

---

## 8. Plan de rollback (si gros problème)

### Si le build prod plante au déploiement
- [ ] Rollback git : `git checkout <previous tag> && pnpm install && pnpm build && pm2 restart`
- [ ] Si DB cassée : restore le backup SQLite le plus récent (remplacer le fichier `terangadev.db` par la dernière copie `.backup`)

### Si DNS doit être basculé en urgence vers ancien site
- [ ] Inverser A record vers IP ancien serveur
- [ ] TTL court (300s) accélère la propagation

---

## 9. Roadmap V1.1 (post-ship)

Items marqués comme "polish optionnel" pendant le V1 :

- [ ] **Sound design Act 1** — recruter sound designer freelance, partition par chapitre (~800-2000€)
- [ ] **Transitions inter-chapitres** — color bleeds GSAP entre Ch3↔Ch4 et Ch5↔Ch6
- [ ] **Mobile manifeste** — version raccourcie ou adaptée pour < 768px (R3F déjà fallback gradient mais l'expérience pourrait être plus immersive)
- [ ] **n8n auto-publish blog** — pipeline éditorial automatisé Notes
- [ ] **PP Editorial New** — upgrade font display de Newsreader (gratuit) vers PP Editorial New (~200€) pour distinction premium
- [ ] **Prod Lighthouse audit** — viser ≥85 sur les 4 axes en prod build (pas dev)
- [ ] **Tests Android mid-range réels** — pas juste devtools, vrai téléphone

---

## ✅ Critères de succès V1

- [ ] Site live sur https://terangadev.com (HTTPS, A+ SSL Labs)
- [ ] /manifeste 7 chapitres jouent fluidement (FR + EN)
- [ ] /admin Payload accessible, 1er post Notes créé
- [ ] Formulaire /contact envoie un email à contact@terangadev.com via Resend
- [ ] sitemap.xml indexé par Google (vérifier dans GSC sous 7 jours)
- [ ] Lighthouse a11y ≥95, BP ≥90, SEO ≥90 en prod build
- [ ] Aucun incident sécurité dans les 7 jours post-launch
- [ ] Premier prospect contact reçu via le nouveau formulaire dans le mois

---

*Document de référence pour le ship V1. À compléter et cocher au fur et à mesure.
Dernière révision : 2026-06-11 — resync sur la branche `ibnou-v2` : stack DB **SQLite** (et non PostgreSQL), Node 22 requis, étapes importmap + migrations clarifiées, `NEXT_PUBLIC_SITE_URL` retiré (URL en dur). Build vérifié exit 0 + lint propre.*
