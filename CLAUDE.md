# Avelor

Plateforme SaaS (Next.js 14) d'aide aux dirigeants d'entreprise en difficulté en France.
Le dirigeant entre son SIRET, répond à un questionnaire, et reçoit une fiche personnalisée (stratégie, courriers, échéances, aides, annuaires).

## Commandes

```bash
npm run dev      # Serveur local (port 3000)
npm run build    # Build de production
npm run lint     # ESLint (config: next/core-web-vitals)
npm test         # Vitest (173 tests dans lib/__tests__/)
```

Déploiement automatique sur Vercel depuis la branche `main` → https://avelor.vercel.app

## Stack

- **Framework** : Next.js 14.2.35 App Router, TypeScript, React 18
- **CSS** : Tailwind 3.4 (JIT) + classes custom (voir `tailwind.config.js`)
- **Animations** : Framer Motion 11 (avec `LazyMotion` pour réduire le bundle)
- **UI** : Glass morphism (backdrop-blur, ombres glass), polices Playfair Display + Outfit
- **BDD** : Supabase (table `fiches` : token/siret/reponses/company_data/email/rappels)
- **Email** : Resend (magic link pour retrouver sa fiche + rappels cron quotidiens)
- **APIs externes** : INSEE Sirene (gouv.fr + INSEE fallback), BODACC, Google Places (avocats locaux), Infogreffe (signaux)
- **Validation** : Zod (schémas dans `lib/schemas.ts`)
- **Tests** : Vitest (173 tests, 14 fichiers)
- **CI** : GitHub Actions (lint → build → test)
- **Rate limiting** : middleware in-memory (à passer Upstash en prod)
- **PWA** : manifest.json + icônes 512/192/favicon

## Variables d'environnement

Voir `.env.example` — clés nécessaires en production :
`INSEE_API_KEY`, `GOOGLE_PLACES_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `RESEND_API_KEY`, `RESEND_FROM`, `NEXT_PUBLIC_BASE_URL`, `CRON_SECRET`, `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` (optionnel)

## Architecture

```
app/
  page.tsx                    # Home — saisie SIRET
  questionnaire/              # 12 étapes (8 base + 4 optionnelles : montantDettes, ageDirigeant, franchise, antecedents)
  fiche/[token]/              # Fiche personnalisée (dashboard, SSR)
  situation/[slug]/           # 4 pages informatives par situation
  courriers/[slug]/           # 12 modèles de courriers personnalisés
  outils/                     # 9 calculateurs (ATI, licenciement, prescription, AGS, etc.)
  annuaires/                  # 4 annuaires (mandataires, CIP, AGS, TAE)
  accompagnant/               # Parcours « j'accompagne un proche » + bandeau urgence + code postal
  faq/                        # FAQ avec JSON-LD FAQPage
  temoignages/                # 4 témoignages anonymisés
  api/fiche/                  # POST création fiche + GET récupération
  api/fiche/send-link/        # Envoi magic link par email
  api/fiche/rappels/          # POST programmer un rappel
  api/cron/rappels/           # GET cron quotidien (Vercel cron 7h)
  api/og/                     # Image OG dynamique (Edge runtime)
  api/stats/                  # Stats agrégées
  sitemap.ts, robots.ts       # SEO
  error.tsx, loading.tsx, not-found.tsx, global-error.tsx  # Error boundaries

components/
  fiche/
    dashboard/                # IdentiteHero, PriorityCards (splitté), QuickLinks, SectionNav, StrategieHero
    layouts/LayoutDashboard   # Layout principal de la fiche (FicheProvider)
    BlocAccordeon.tsx         # Composant accordéon (aria-expanded/controls/region)
    Bloc*.tsx                 # ~28 blocs (accordéons interactifs)
    ProgressTracker.tsx       # Suivi de progression (localStorage)
  Questionnaire.tsx           # 12 slides
  SiretInput.tsx              # Input SIRET avec validation
  Nav.tsx                     # Navigation (focus trap, aria-current, Escape ferme menu)
  Background.tsx              # Animations blob framer-motion
  Compteur.tsx                # Compteur de fiches créées
  LazyMotionProvider.tsx      # Wrapper LazyMotion (tree-shaking framer)

lib/
  types.ts                    # Types partagés (Reponses, CompanyData, Rappel, etc.)
  strategie.ts                # Moteur stratégie (5 axes) + getJuridiction() (TJ vs TC)
  priorites.ts                # Scoring 10 cartes prioritaires
  courriers.ts                # 12 courriers, personnalisation tone/situation
  secteur.ts                  # 15 secteurs (BTP, agri, HCR, santé, libéral, pêche…) + caisses retraite + ordres + CSP
  aidesRegionales.ts          # Aides régionales (13 régions + DOM)
  bodacc.ts                   # Détection incohérences BODACC vs situation
  tone.ts                     # Présets de ton (combatif/épuisé/perdu)
  ics.ts                      # Génération fichiers ICS
  sirene.ts                   # API gouv.fr + INSEE fallback
  supabase.ts                 # Client Supabase
  resend.ts                   # Envoi d'emails
  googlePlaces.ts             # Recherche avocats via Google Places
  organismes.ts               # buildOrganismes + buildOrdresProfessionnels + buildAidesPersonnelles + buildSoutien + buildReseauxSpecifiques
  schemas.ts                  # Schémas Zod pour validation API
  hooks.ts                    # useLocalStorage
  FicheContext.tsx            # React Context pour la fiche (utilisé par 18 blocs)
  __tests__/                  # 173 tests Vitest

data/
  organismes.json             # 107 territoires (96 dpts + 11 DOM-TOM), ~20 organismes par dpt

middleware.ts                 # Rate limiting (in-memory, à migrer Upstash)
vercel.json                   # Cron rappels quotidiens 7h
```

## Couleurs Tailwind custom

| Token        | Hex       | Usage                      |
|-------------|-----------|----------------------------|
| `navy`      | `#0A1628` | Texte principal, fonds     |
| `bleu`      | `#4A72B8` | Axe restructurer, liens    |
| `bleu-fonce`| `#1E3D82` | Accents, boutons           |
| `rouge`     | `#C94040` | Axe rebondir, alertes      |
| `jaune`     | `#C97830` | Axe céder, warnings        |
| `vert`      | `#28A050` | Axe sauvegarder, succès    |

## Conventions

- **Langue du code** : noms de variables/fonctions en français (ex: `reponses`, `effectifDetail`, `situationFragments`)
- **Langue UI** : tout en français, formulations inclusives (seul·e·s)
- **Tailwind JIT** : ne jamais utiliser de template literals pour les classes dynamiques (`bg-${color}/15`). Utiliser des maps statiques (ex: `PASTILLE_CLASSES`)
- **Entités HTML** : utiliser directement les caractères UTF-8 dans le JSX (é, è, ê, à…), pas les entités (&eacute; etc.). Exceptions JSX : `&apos;`, `&lt;`, `&gt;`, `&amp;`
- **Liens externes** : toujours `target="_blank" rel="noreferrer"`. URLs gouvernementales avec `www.` (ex: `https://www.impots.gouv.fr`)
- **Sources** : ne citer que des sources officielles (codes de loi, sites .gouv.fr). Pas de stats sans source vérifiable
- **URSSAF** : numéro universel `3957` (sauf MSA agriculture : `36 98`, CGSS Outre-mer : `0 820 000 [code]`)
- **Tribunal** : `getJuridiction(company)` → TJ pour libéraux/agri/santé (NAF 69-74, 01-03, 86-88), TC sinon (loi 22 déc. 2021)
- **Commits** : format conventionnel `type(scope): message` en français
- **Print** : classes `no-print` sur les éléments à masquer en impression
- **Animations** : utiliser `m.div` au lieu de `motion.div` (LazyMotion)
- **Framer Motion** : opérateurs `??` et `?:` à parenthéser explicitement (précédence)

## Données clés

- **Reponses** : 12 champs (situation, probleme, effectif, effectifDetail, moral, caution, regime, patrimoine, vente, montantDettes, ageDirigeant, franchise, antecedents)
- **CompanyData** : données INSEE (siret, nom, formeJuridique, naf, dateCreation, effectif, adresse, codePostal, ville, departement, fetched)
- **Stratégie** : 5 axes possibles avec scoring, chacun a titre/verdict/etapes/pourquoi/alternatives
- **PriorityCards** : 10 cartes possibles, top 4 sélectionnées par scoring selon les réponses
- **Blocs fiche** : ~28 blocs (Aides, Strategie, Checklist, PlanAction, Calendrier, Cessation45j, Trésorerie, Timeline, Rappels, ProtectionFamille, AuditCaution, Patrimoine, ConsequencesPerso, Aides, AidesEtat, Prescription, Organismes, CCSF, BailCommercial, Obligations, SanteSecteur, Soutien, Alertes, **PGE, Surendettement, Franchise, CreditBail, SCOP, Reclassement**)
- **Organismes par dpt** (data/organismes.json) : tribunal, cci, urssaf (ou cgss DOM), sie, banqueDeFrance, dreets, ddfip, cma, prefecture, pointJustice, carsat, conciliateur, ordreMedecins, ordreAvocats, chambreNotaires, ordrePharmaciens, urpsMedecins, urssafRegional, bge, initiativeFrance, franceActive, mdph, maisonJustice, solidaritePaysans (si agri), + DOM : cgss, bpiOutreMer, afd, ladom, cafat/cps/ieom (selon territoire)

## Couverture estimée

- **~78% de la pertinence** pour les profils-types de dirigeants en difficulté
- **107 territoires** couverts (96 départements + 11 DOM-TOM)
- **15 secteurs** (agri, BTP, commerce, HCR, transport, industrie, finance, immobilier, libéral, santé, éducation, artisanat, information, **pêche**, autre)
- **173 tests** verts (Vitest)

## Roadmap

Voir `_plans/roadmap.md` pour l'état d'avancement détaillé et la liste de ce qu'il reste à faire.
