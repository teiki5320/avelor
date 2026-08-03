# INFRA — Fiche technique des services externes

> **Générée le 20/07/2026** par un scan du dépôt (dépendances, configs, variables d'environnement, workflows CI, code).
> Pour la mettre à jour : relancer le prompt de génération dans une session Claude Code (« Génère un fichier docs/INFRA.md… »).
> ⚠️ **Aucun secret n'est écrit dans ce fichier** — uniquement l'endroit où chaque secret vit.

---

## 1. Vercel — hébergement, déploiement, cron

| | |
|---|---|
| **Rôle** | Hébergement du site Next.js, déploiement automatique à chaque push sur `main`, exécution du cron quotidien des rappels email (7h UTC, `vercel.json`) |
| **Console** | https://vercel.com/dashboard |
| **Identifiants publics** | URL de production : `https://avelor.vercel.app` (domaine `avelor.fr` prévu — voir §11). Cron : `vercel.json` → `GET /api/cron/rappels` à `0 7 * * *` |
| **Secrets** | Toutes les variables d'environnement de production vivent dans **Vercel → Projet → Settings → Environment Variables** (voir tableau §12). Vercel injecte automatiquement `CRON_SECRET` dans l'en-tête des appels cron |
| **Reprise** | Compte Vercel propriétaire du projet (connecté au repo GitHub `teiki5320/avelor`). Pour reprendre : être invité comme membre du projet, ou transférer le projet |

## 2. Supabase — base de données

| | |
|---|---|
| **Rôle** | Stockage des fiches (table `fiches` : token, siret, reponses, company_data, email, rappels), avec règles RLS |
| **Console** | https://supabase.com/dashboard |
| **Identifiants publics** | `SUPABASE_URL` (URL du projet, non commitée mais publique par design) et `SUPABASE_ANON_KEY` (clé anonyme, conçue pour être exposable côté client — la sécurité repose sur les règles RLS). Lues dans `lib/supabase.ts:7-8` |
| **Secrets** | Les deux valeurs sont dans **Vercel (env production)** et **`.env.local`** (non commité) en local. La clé `service_role` (secrète, jamais utilisée par le code actuel) reste uniquement dans le dashboard Supabase |
| **Reprise** | Compte Supabase propriétaire du projet. Vérifier la table `fiches` + RLS via le dashboard ou le CLI (`supabase login`, `supabase projects api-keys`) |

## 3. Resend — envoi d'emails

| | |
|---|---|
| **Rôle** | Envoi du magic link (retrouver sa fiche) et des rappels quotidiens du cron. Code : `lib/resend.ts`, `app/api/cron/rappels/route.ts` |
| **Console** | https://resend.com/overview |
| **Identifiants publics** | `RESEND_FROM` — adresse d'expéditeur (défaut code : `AVELOR <onboarding@resend.dev>`, `lib/resend.ts:18`). À passer sur l'adresse du futur domaine après vérification DNS (SPF/DKIM) dans Resend |
| **Secrets** | `RESEND_API_KEY` : **Vercel (env production)** + `.env.local` en local |
| **Reprise** | Compte Resend propriétaire. Après achat du domaine : vérifier le domaine dans Resend (enregistrements DNS) avant d'envoyer depuis `contact@<domaine>` |

## 4. API Recherche d'entreprises (gouv.fr) — données SIRET principales

| | |
|---|---|
| **Rôle** | Source **principale** des données entreprise (nom, NAF, forme juridique, adresse…) à partir du SIRET. Code : `lib/sirene.ts:65` |
| **Console** | Aucune — API publique de l'État, **sans clé ni compte** : https://recherche-entreprises.api.gouv.fr |
| **Identifiants publics** | URL de base dans `lib/sirene.ts` |
| **Secrets** | Aucun |
| **Reprise** | Rien à reprendre — service public sans authentification |

## 5. API Sirene INSEE — données SIRET (secours)

| | |
|---|---|
| **Rôle** | **Fallback** si l'API gouv.fr échoue. Code : `lib/sirene.ts:67,180` |
| **Console** | https://portail-api.insee.fr (créer une application, souscrire à l'API Sirene) |
| **Identifiants publics** | URL de base `https://api.insee.fr/entreprises/sirene/V3` dans `lib/sirene.ts` |
| **Secrets** | `INSEE_API_KEY` : **Vercel (env production)** + `.env.local`. **Optionnelle** — sans elle, seul le fallback est désactivé |
| **Reprise** | Compte INSEE (gratuit) ; recréer une clé prend quelques minutes |

## 6. BODACC (OpenDataSoft) — annonces légales

| | |
|---|---|
| **Rôle** | Détection d'incohérences entre les annonces publiées (procédures collectives) et la situation déclarée par le dirigeant. Code : `lib/bodacc.ts:40` |
| **Console** | Aucune — API open data publique : https://bodacc-datadila.opendatasoft.com |
| **Identifiants publics** | URL de base dans `lib/bodacc.ts` |
| **Secrets** | Aucun |
| **Reprise** | Rien à reprendre |

## 7. Google Places (Google Cloud) — avocats locaux

| | |
|---|---|
| **Rôle** | Recherche d'avocats près de la ville du dirigeant, affichés sur la fiche. Code : `lib/googlePlaces.ts:20,28` |
| **Console** | https://console.cloud.google.com (projet Google Cloud avec « Places API » activée) |
| **Identifiants publics** | URL de base `https://maps.googleapis.com/maps/api/place` dans `lib/googlePlaces.ts` |
| **Secrets** | `GOOGLE_PLACES_API_KEY` : **Vercel (env production)** + `.env.local`. **Optionnelle** — sans elle, le bloc avocats est simplement vide. ⚠️ Service facturable : restreindre la clé (API Places uniquement) et surveiller les quotas |
| **Reprise** | Compte Google Cloud propriétaire du projet + moyen de paiement |

## 8. Plausible — statistiques de visite (optionnel)

| | |
|---|---|
| **Rôle** | Analytics sans cookies. Le script n'est chargé **que si** `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` est définie (`app/layout.tsx:74-77`) |
| **Console** | https://plausible.io |
| **Identifiants publics** | `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` (le domaine du site — public par design, préfixe `NEXT_PUBLIC_`) |
| **Secrets** | Aucun côté code. L'accès au dashboard Plausible = compte Plausible (payant) |
| **Reprise** | Compte Plausible, si souscrit un jour. **Actuellement non configuré** |

## 9. GitHub + GitHub Actions — code source et CI

| | |
|---|---|
| **Rôle** | Hébergement du code (`teiki5320/avelor`) et CI à chaque push/PR vers `main` : lint → build → tests (`.github/workflows/ci.yml`) |
| **Console** | https://github.com/teiki5320/avelor |
| **Identifiants publics** | Nom du dépôt. La CI n'utilise **aucun secret** (le build fonctionne sans variable d'environnement) |
| **Secrets** | Aucun secret CI configuré à ce jour (Settings → Secrets and variables → Actions, vide) |
| **Reprise** | Compte GitHub `teiki5320` propriétaire du dépôt ; inviter un collaborateur ou transférer le dépôt |

## 10. Google Fonts — polices (build uniquement)

| | |
|---|---|
| **Rôle** | Playfair Display + Outfit via `next/font/google` (`app/layout.tsx:2`). Les polices sont **téléchargées au build puis auto-hébergées** : aucun appel à Google au runtime, aucun compte |
| **Secrets / reprise** | Rien |

## 11. Domaine

| | |
|---|---|
| **Actuel** | `avelor.vercel.app` (sous-domaine Vercel gratuit, codé en dur dans ~30 fichiers : métadonnées, sitemap, mentions légales…) |
| **Prévu** | Achat d'un domaine propre (idéalement `avelor.fr`, de préférence via Vercel Domains pour un DNS pilotable en CLI) + adresse `contact@<domaine>` (l'adresse actuelle `contact@avelor.vercel.app` dans les pages légales **ne peut pas recevoir d'emails**). Plan détaillé : `_plans/roadmap.md` § « MISE EN LIGNE » |

---

## 12. Récapitulatif — où vit chaque secret

| Secret | Où il vit | Jamais dans |
|---|---|---|
| `SUPABASE_URL` | Vercel (env prod) + `.env.local` + dashboard Supabase | le dépôt Git |
| `SUPABASE_ANON_KEY` | Vercel (env prod) + `.env.local` + dashboard Supabase | le dépôt Git |
| Clé `service_role` Supabase | Dashboard Supabase uniquement (non utilisée par le code) | partout ailleurs |
| `RESEND_API_KEY` | Vercel (env prod) + `.env.local` + dashboard Resend | le dépôt Git |
| `INSEE_API_KEY` | Vercel (env prod) + `.env.local` + portail INSEE | le dépôt Git |
| `GOOGLE_PLACES_API_KEY` | Vercel (env prod) + `.env.local` + console Google Cloud | le dépôt Git |
| `CRON_SECRET` | Vercel (env prod) uniquement — généré aléatoirement (`openssl rand -hex 32`) | le dépôt Git |
| Secrets CI GitHub | Aucun à ce jour | — |

Le fichier `.env.local` est ignoré par Git (`.gitignore`) ; `.env.example` liste les noms de variables **sans valeur**.

## 13. Valeurs publiques par design (aucun risque à les voir circuler)

- `NEXT_PUBLIC_BASE_URL` — l'URL du site
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` — le domaine déclaré à Plausible
- `RESEND_FROM` — l'adresse d'expéditeur des emails
- `SUPABASE_ANON_KEY` — clé *anonyme* Supabase, conçue pour être exposée côté client (la protection des données repose sur les règles RLS, pas sur le secret de cette clé)
- URLs d'API codées en dur : recherche-entreprises.api.gouv.fr, api.insee.fr, bodacc-datadila.opendatasoft.com, maps.googleapis.com
- Le nom du dépôt GitHub et l'URL de production

## 14. Checklist — reprise du projet sur une machine neuve

1. **Cloner** : `git clone https://github.com/teiki5320/avelor.git && cd avelor` (accès au dépôt GitHub requis)
2. **Installer** : Node.js ≥ 20, puis `npm install`
3. **Configurer** : `cp .env.example .env.local` et remplir les valeurs depuis les dashboards (Supabase → Settings → API ; Resend → API Keys ; INSEE et Google Cloud si besoin). *Le site démarre aussi sans aucune variable : seuls la sauvegarde de fiche, les emails et les avocats locaux sont désactivés.*
4. **Lancer** : `npm run dev` → http://localhost:3000
5. **Vérifier** : `npm run lint && npm run build && npm test` (259 tests) ; E2E : `npm run test:e2e`
6. **Administrer** : accès aux consoles Vercel (déploiement + variables), Supabase (données), Resend (emails), GitHub (code + CI) — toutes rattachées au compte propriétaire du projet
7. **Déployer** : merger sur `main` → déploiement Vercel automatique

## 15. À vérifier

- **« Infogreffe »** : cité dans `CLAUDE.md`, mais dans le code ce n'est qu'un nom de paramètre de `detectIncoherenceBodacc()` (`lib/bodacc.ts:116`) — les données proviennent en réalité de l'API BODACC. Aucun compte Infogreffe n'existe ni n'est nécessaire ; mettre à jour le CLAUDE.md à l'occasion
- **Plausible** : le branchement existe dans le code mais aucun compte n'est souscrit (`NEXT_PUBLIC_PLAUSIBLE_DOMAIN` non définie) — décision à prendre au lancement
- **Rate limiting** : actuellement en mémoire (`middleware.ts`), sans service externe. La migration prévue vers **Upstash Redis** ajoutera un service (et deux variables `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`) — mettre à jour cette fiche à ce moment-là
- **PWA** : `manifest.json` + icônes — purement statique, aucun service externe
