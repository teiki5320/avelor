# Avelor

Plateforme SaaS (Next.js 14) d'aide aux dirigeants d'entreprise en difficulté en France.
Le dirigeant entre son SIRET, répond à un questionnaire, et reçoit une fiche personnalisée (stratégie, courriers, échéances, aides, annuaires).

## Commandes

```bash
npm run dev      # Serveur local (port 3000)
npm run build    # Build de production
npm run lint     # ESLint
```

Déploiement automatique sur Vercel depuis la branche `main` → https://avelor.vercel.app

## Stack

- **Framework** : Next.js 14 App Router, TypeScript, React 18
- **CSS** : Tailwind 3.4 (JIT) + classes custom (voir `tailwind.config.js`)
- **Animations** : Framer Motion
- **UI** : Glass morphism (backdrop-blur, ombres glass), polices Playfair Display + Outfit
- **BDD** : Supabase (table `fiches` : token/siret/reponses/company_data/email)
- **Email** : Resend (magic link pour retrouver sa fiche)
- **APIs externes** : INSEE Sirene (données entreprise), BODACC (publications légales), Google Places (avocats locaux)

## Variables d'environnement

Voir `.env.example` — clés nécessaires :
`INSEE_API_KEY`, `GOOGLE_PLACES_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `RESEND_API_KEY`, `RESEND_FROM`, `NEXT_PUBLIC_BASE_URL`

## Architecture

```
app/
  page.tsx                    # Home — saisie SIRET
  questionnaire/              # Questionnaire multi-étapes
  fiche/[token]/              # Fiche personnalisée (dashboard)
  situation/[slug]/           # Pages informatives par situation
  courriers/[slug]/           # Modèles de courriers personnalisés
  outils/                     # 9 calculateurs (ATI, licenciement, prescription…)
  annuaires/                  # 4 annuaires (mandataires, CIP, AGS, TAE)
  accompagnant/               # Parcours « j'accompagne un proche »
  api/fiche/                  # POST création fiche + GET récupération
  api/fiche/send-link/        # Envoi magic link par email
  api/stats/                  # Stats agrégées

components/
  fiche/
    dashboard/                # IdentiteHero, PriorityCards, QuickLinks, SectionNav, SectionHeader, StrategieHero
    layouts/LayoutDashboard   # Layout principal de la fiche
    Bloc*.tsx                 # ~20 blocs (accordéons) : Aides, Strategie, Checklist, PlanAction, Calendrier…
  Questionnaire.tsx           # Composant questionnaire
  SiretInput.tsx              # Input SIRET avec appel INSEE
  Nav.tsx                     # Navigation principale

lib/
  types.ts                    # Types partagés (Reponses, CompanyData, FicheRecord…)
  strategie.ts                # Moteur de stratégie (5 axes : restructurer/sauvegarder/ceder/liquider/rebondir)
  courriers.ts                # Personnalisation des courriers (tone, fragments, pressions)
  secteur.ts                  # 14 secteurs avec santé sectorielle + contacts URSSAF/MSA
  aidesRegionales.ts          # Aides régionales (13 régions + DOM)
  bodacc.ts                   # Détection incohérences BODACC vs situation déclarée
  tone.ts                     # Présets de ton selon l'état moral du dirigeant
  ics.ts                      # Génération fichiers ICS (export calendrier)
  sirene.ts                   # Appel API INSEE Sirene
  supabase.ts                 # Client Supabase
  resend.ts                   # Envoi d'emails
  googlePlaces.ts             # Recherche avocats via Google Places
  organismes.ts               # Organismes d'aide (CCI, CMA, tribunaux…)
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
- **URSSAF** : numéro universel `3957` (sauf MSA agriculture : `36 98`)
- **Commits** : format conventionnel `type(scope): message` en français
- **Print** : classes `no-print` sur les éléments à masquer en impression

## Données clés

- **Reponses** : 9 champs (situation, probleme, effectif, effectifDetail, moral, caution, regime, patrimoine, vente)
- **CompanyData** : données INSEE (siret, nom, formeJuridique, naf, dateCreation, effectif, adresse, codePostal, ville, departement)
- **Stratégie** : 5 axes possibles avec scoring, chacun a titre/verdict/etapes/pourquoi/alternatives
- **PriorityCards** : 10 cartes possibles, top 4 sélectionnées par scoring selon les réponses

## Roadmap

Voir `_plans/roadmap.md` pour l'état d'avancement détaillé.
