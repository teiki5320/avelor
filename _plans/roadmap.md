# 🗺️ Avelor — Roadmap

> Dernière mise à jour : **2026-07-18**
> Statut global : **production · couverture ~94% · 44 findings de l'audit du 30/05 corrigés**

## 🎯 Vision

Aider les chefs d'entreprise français en difficulté à y voir clair en quelques minutes : une fiche personnalisée à partir de leur SIRET et de 12 questions, des courriers et calculateurs adossés aux textes officiels, et les bons interlocuteurs autour d'eux.

## 🏁 Jalons

### ✅ Fait

#### Infrastructure & qualité
- [x] Plateforme en ligne sur avelor.vercel.app, déployée en continu via Vercel et la branche main
- [x] Stack stable : Next.js 15.5.20 + React 19 + framer-motion 11 (LazyMotion) — 0 vulnérabilité npm audit
- [x] 245 tests Vitest verts (lib + composants React + routes API) + Playwright E2E configuré
- [x] GitHub Actions CI : lint → build → test
- [x] ESLint configuré (next/core-web-vitals)
- [x] Validation Zod sur toutes les routes API (fiche, send-link, rappels)
- [x] Rate limiting middleware (in-memory, à passer Upstash)
- [x] Logs d'erreur sur toutes les API routes
- [x] Error boundaries : error.tsx, global-error.tsx, loading.tsx, not-found.tsx + fiche-specific
- [x] CRON_SECRET vérifié strictement (faille corrigée)
- [x] FicheContext (React Context) câblé sur 18 blocs

#### SEO & accessibilité
- [x] Metadata sur 34 pages, sitemap.xml (37 routes), robots.txt
- [x] JSON-LD : Organization, FAQPage, HowTo (calculateurs), BreadcrumbList
- [x] OG image dynamique (`/api/og`) + Twitter card
- [x] PWA : manifest.json, theme-color, icônes 512/192/favicon
- [x] Skip-to-content, aria-current, focus trap menu, aria-controls accordéons
- [x] Plausible analytics conditionnel (NEXT_PUBLIC_PLAUSIBLE_DOMAIN)

#### Questionnaire & fiche
- [x] Questionnaire en 17 étapes (8 base + 9 optionnelles : montant dettes, âge, franchise, antécédents, **PGE en cours, RQTH, statut conjoint, co-gérants, saisonnalité**)
- [x] **Moteur stratégie** distingue micro / EI / EIRL / société (`getFormeDetail`) — PRP priorisé pour les personnes physiques uniquement
- [x] **Scoring stratégie enrichi** : PGE en cours favorise restructuration amiable (la procédure collective déclenche l'appel de la garantie d'État, elle ne la fait pas perdre) ; antécédents BODACC poussent vers liquidation / rebond accompagné
- [x] **Mode « perdu » radical** (`ModePerdu`) : 3 infos max si moral === 'perdu' (qui appeler / 1 action semaine / soutien APESA-3114). Bouton « Voir tout » pour ouvrir la fiche complète.
- [x] Fiche personnalisée organisée en dashboard avec 4 cartes prioritaires adaptatives (parmi 10) et 6 sections thématiques
- [x] Croisement avec les annonces BODACC pour détecter les incohérences
- [x] Stratégie sur 5 axes (restructurer, sauvegarder, céder, liquider, rebondir) avec scoring
- [x] Ton du site et des courriers adapté au moral déclaré (combatif, épuisé, perdu)
- [x] État de santé sectoriel mis en avant pour les secteurs en crise (HCR, BTP, agriculture)
- [x] 17 modèles de courriers contextualisés
- [x] 11 calculateurs (prescription, licenciement+AGS, ATI, coût procédures, aide juridictionnelle, ACRE/ARCE, calendrier fiscal, data-room, valorisation, stocks, seuils d'effectif)
- [x] Page FAQ (18 questions), page Témoignages (4 cas anonymisés)

#### Blocs fiche (28 au total)
- [x] BlocStrategie, BlocPlanAction, BlocChecklist, BlocProcedureRecommandee, BlocCessationDecompte (45j), BlocTresorerie, BlocCalendrier, BlocTimeline, BlocRappels, BlocProtectionFamille, BlocAuditCaution, BlocPatrimoine, BlocConsequencesPerso, BlocAides, BlocAidesEtat, BlocPrescription, BlocOrganismes, BlocCCSF, BlocBailCommercial, BlocObligations, BlocSanteSecteur, BlocSoutien (avec caisse spécifique selon NAF), BlocAlertes
- [x] **BlocPGE** : restructuration du prêt garanti État (30% des défaillances 2024-2025)
- [x] **BlocSurendettement** : commission BdF pour micro/EI
- [x] **BlocFranchise** : DIP, royalties, médiation FFF
- [x] **BlocCreditBail** : continuation/restitution/indemnité, ASF
- [x] **BlocSCOP** : reprise par les salariés, CG SCOP, SOCODEN
- [x] **BlocReclassement** : CSP, PSE, congé reclassement, France Travail
- [x] **BlocAPLDR** : Activité Partielle Longue Durée Rebond (loi 14 fév. 2025, décret 11 avril 2025) — successeur APLD Covid
- [x] **BlocPeriodeSuspecte** (autonome) : nullités de droit / facultatives (L632-1 à L632-3), action paulienne (1341-2 C. civ.)
- [x] **BlocConjointCollaborateur** : 3 statuts légaux (salarié, collaborateur, associé) + statut de fait (Cass. com. 2023) + co-gérance solidaire
- [x] **BlocPGE enrichi** : procédure pas-à-pas en 5 étapes pour la restructuration via Médiation du crédit
- [x] **BlocAidesEtat enrichi** : FSE+ 2021-2027, FNE-Formation (en restructuration)
- [x] **BlocAides enrichi** : section dédiée « Leviers de trésorerie immédiats » — affacturage / escompte / Dailly / mobilisation créances publiques distingués
- [x] **BlocPlateformes** : VTC, livraison, services à la personne — ARPE, charte sociale, défense en requalification (couverture VTC : 30% → 75%, plateformes : 10% → 50%)
- [x] **BlocCSP autonome** : extraction du BlocReclassement, procédure pas-à-pas 21 j, indemnité ASP 75%
- [x] **BlocGarantieBPI** : règles de négociation pour les emprunts garantis Bpifrance (ex-OSEO)
- [x] **BlocArretLongueDuree** : impact AGS pour les salariés en arrêt maladie longue durée
- [x] **BlocNationaliteSejour** : impact d'une procédure collective sur le Passeport Talent / carte entrepreneur (dirigeants hors UE)
- [x] **BlocCreditBail enrichi** : 3 cas concrets (camion RJ, photocopieur LJ, pelleteuse non publiée)
- [x] **OPCO par NAF** : nouveau module `lib/opco.ts` (11 OPCO) intégré au BlocReclassement
- [x] **URPS supplémentaires** : Pharmaciens, Sage-femmes, Auxiliaires médicaux, Chirurgiens-dentistes ajoutés à buildOrdresProfessionnels
- [x] **Calculateur valorisation stocks** : nouveau outil `/outils/stocks` (6 natures × 5 voies, taux de réfaction CNAJMJ/CSCPJ)
- [x] **FAQ ciblées par situation** : 3 nouvelles pages (URSSAF impayée, PGE en difficulté, assignation tribunal) avec JSON-LD FAQPage
- [x] **PWA service worker** : `/sw.js` + composant ServiceWorkerRegister, cache-first assets, network-first HTML
- [x] **Tracker de progression visuel** : refonte avec 6 sous-groupes (Agir, Vue d'ensemble, Échéances, Patrimoine, Aides, Ressources), barres individuelles + pastilles "complet"

#### Données enrichies
- [x] **107 territoires couverts** (96 dpts métropole + 11 DOM-TOM)
- [x] **~20 organismes par département** : tribunal, CCI, URSSAF (ou CGSS DOM), SIE, BdF, DREETS, DDFiP, CMA, préfecture, point-justice, CARSAT, conciliateur, ordreMedecins, ordreAvocats, chambreNotaires, ordrePharmaciens, urpsMedecins, urssafRegional, BGE, Initiative France, France Active, MDPH, maisonJustice, solidaritePaysans (agri)
- [x] DOM-TOM enrichis : CGSS (au lieu d'URSSAF), CAFAT (Nouvelle-Calédonie), IEDOM/IEOM, BPI Outre-mer, AFD, LADOM, CCISM/CACIMA/CEM/SERP/DSF
- [x] **15 secteurs** avec santé sectorielle + contacts URSSAF/MSA (ajout pêche : ENIM, CNPMEM)
- [x] Caisses sociales spécifiques : CARMF (médecin), CNBF (avocat), CIPAV (architecte), CAVEC (EC), CRPCEN (notaire), CAVP (pharmacien), CARPV (véto), CARPIMKO (kiné), CARCDSF (dentiste)
- [x] Ordres professionnels : CNB, CSN, OEC, CNOM, ONP
- [x] Aides personnelles : ATI, ACRE, ARCE, CSS, RSA, ASS, APL, aide juridictionnelle
- [x] Dispositifs État : CODEFI, CIRI, CRP, Conseillers-Entreprises (0 806 000 245), BdF TPE-PME (34 14)
- [x] Réseaux spécifiques : femmes (Action'elles, Force Femmes, FCE, Bouge ta Boîte), jeunes (1 jeune 1 mentor, Mission Locale, Adie Créajeunes), seniors (EGEE, ECTI, AGIRabcd), handicap (AGEFIPH, Cap Emploi, FIPHFP, MDPH), psy public (CMP, CUMP, SOS Suicide, 3919)
- [x] Rebond : 60 000 Rebonds, Second Souffle, Re-Création
- [x] Aides régionales spécifiques pour les 13 régions métropolitaines et l'Outre-mer

#### Annuaires
- [x] 4 annuaires officiels : délégations AGS, TAE 2025, mandataires CNAJMJ, CIP territoriaux
- [x] 56 mandataires CNAJMJ, 63 antennes CIP

#### Risques juridiques
- [x] BlocConsequencesPerso enrichi : FICP, FCC, faillite personnelle, interdiction de gérer, banqueroute, **L243-6-2 CSS (recouvrement URSSAF)**, **période suspecte L632-1 à L632-3**, **confusion patrimoine L621-2**, **ordre privilèges liquidation**, **casier B2/B3**, **CRPC banqueroute**

#### Erreur juridique corrigée
- [x] `getJuridiction(company)` : envoie au Tribunal Judiciaire pour libéraux (NAF 69-74), agriculteurs (01-03), santé (86-88) — loi du 22 décembre 2021. TC sinon.

#### Persistance & email
- [x] Sauvegarde de la fiche en base Supabase + RLS configurées
- [x] Envoi du magic link par email via Resend
- [x] API rappels email + cron quotidien Vercel (7h)
- [x] Recherche d'avocats locaux via Google Places intégrée

### 🔥 En cours

- [ ] Faire tester la fiche par 2 ou 3 vrais dirigeants ou conseillers pour valider la pertinence en condition réelle
- [ ] Vérifier le rendu sur iPhone et petit écran (mobile)

---

## 🧭 AUDIT DE COUVERTURE MÉTIER du 18/07/2026 — trous détectés

> Scan programmatique : 88 divisions NAF + 35 métiers précis passés dans le vrai moteur (`getSectorInfo`, `getOpcoFromNaf`, `getJuridiction`). **Filet générique garanti pour tous** (BlocSoutien affiche toujours APESA + 3114, organismes départementaux + CIP + BPI pour tout le monde). Mais des métiers courants n'ont **aucune personnalisation sectorielle**.
>
> ✅ **Correction partielle le 18/07/2026** : points 3 à 6 corrigés (secteur `ess` créé, raffinements pharmacien/vétérinaire/boulanger/auto-école, OPCO étendus, soutien psy explicite dans les 16 secteurs — 255 tests verts). Restent les points 1 (secteur `services` pour la section N) et 2 (secteur `culture-sport` pour la section R), en attente de validation.

### 🔴 PROBLÈMES — métiers sans solution personnalisée (secteur « autre » : 0 syndicat, 0 conseil, 0 aide)
- [ ] **Section NAF N (77-82) orpheline** : location (77), **intérim (78)**, **agences de voyage (79)**, **sécurité privée (80)**, **nettoyage/paysagistes (81)**, soutien administratif (82) → tombés dans « autre » depuis la correction du 18/07 (avant ils étaient mal classés « libéral », maintenant ils n'ont plus rien). Créer un secteur `services` avec : SNES/GES (sécurité), FEP/Monde de la Propreté (propreté), Prism'emploi (intérim), EdV — Entreprises du Voyage + APST (voyage), UNEP (paysage). `lib/secteur.ts:138`
- [ ] **Section NAF R (90-93) orpheline** : artistes (90), musées (91), jeux (92), **sport/salles de sport (93)** → « autre » sans rien. Créer un secteur `culture-sport` : Maison des Artistes/AGESSA, CoSMoS (sport), FNEAPL — l'OPCO AFDAS est déjà bien mappé
- [x] **Associations (94) classées « artisanat »** : corrigé — secteur `ess` créé (UDES, Le Mouvement associatif, ESS France, France Générosités, DLA, France Active, FONJEP) + OPCO 94 → Uniformation

### 🟠 PROBLÈMES — classification sectorielle douteuse (métiers réglementés mal orientés)
- [x] **Pharmacien d'officine (47.73Z) → « commerce »** : corrigé — 47.73 → `sante` (Ordre des pharmaciens, CAVP, MOTS)
- [x] **Vétérinaire (75.00Z) → « libéral »** : corrigé — 75 → `sante` (Vetos-Entraide, CARPV) + OPCO EP
- [x] **Boulanger artisanal (10.71C) → OPCO OCAPIAT** : corrigé — raffinement par classe 10.71 → opco-ep (OCAPIAT conservé pour l'industrie agroalimentaire 10.89 etc.)
- [x] **Auto-école (85.53Z) → Uniformation** : corrigé — 85.53 → opco-mobilites (85.59 formation continue reste Uniformation)

### 🟡 PROBLÈMES — OPCO « non identifié » sur des pans entiers
- [x] **Industrie extractive/énergie/eau/déchets (05-09, 12, 35-39)** : corrigé — mapping OPCO 2i étendu
- [x] **Agences de voyage (79)** : corrigé — OPCO Mobilités (branche tourisme)
- [x] **Associations (94)** : corrigé — Uniformation

### 🟢 AMÉLIORATIONS — soutien psy sectoriel (le fallback APESA/3114 existe partout, mais 65/88 divisions n'ont pas de dispositif dédié)
- [x] Commerce : corrigé — `soutien` = « APESA + réseau CCI »
- [x] Transport : corrigé — `soutien` = « APESA (tous secteurs) » avec description honnête (pas de dispositif propre)
- [x] Libéral : corrigé — `soutien` = « Entraide ordinale + APESA »
- [x] Information/finance/immobilier/éducation/industrie : corrigé — `soutien` = « APESA (tous secteurs) » explicite. Les 16 secteurs ont désormais un `soutien` renseigné (test de non-régression ajouté)

### ✅ CE QUI EST VALIDÉ PAR LE SCAN
- 29/35 métiers précis ont une couverture personnalisée complète (secteur + syndicats + OPCO + juridiction justes)
- Juridictions 100 % correctes (TC pour sociétés commerciales, TJ pour EI libéraux/santé/agri — la correction du 18/07 tient)
- Artisans bien détectés (boulanger, coiffeur, bijoutier, réparateurs → CMA + APESA/CMA Entraide)
- Santé/agri/pêche/BTP/HCR : soutien psy dédié en place (MOTS, Agri'Écoute, Solidarité Marins, APESA+FFB, UMIH Entraide)
- Personne n'est à zéro solution : organismes départementaux, CIP, BPI, APESA + 3114 garantis pour tous

---

## 🔎 AUDIT COMPLET du 30/05/2026 — findings à corriger

> Audit orchestré (7 auditeurs de code + 12 simulations Playwright réelles + vérification adversariale, 85 agents). **Verdict : le parcours va au bout dans les 12 cas, aucun blocage.** Le problème est la fiabilité du contenu juridique. 44 findings confirmés avec preuve.
>
> ✅ **Correction complète le 18/07/2026** : les 44 findings ci-dessous sont corrigés (lint + build + 245 tests Vitest + E2E chromium verts, npm audit à 0 vulnérabilité). Migration Next 15.5.20 + React 19 incluse.

### 🔴 ERREURS — Contenu juridique FAUX (priorité absolue, oriente de mauvaises décisions)
- [x] **Contresens PGE / garantie BPI** : « ouvrir une procédure fait perdre la garantie de l'État » = FAUX (c'est l'inverse, la procédure déclenche l'appel de la garantie). `lib/strategie.ts:88` (+ `scores.sauvegarder -= 1` à supprimer), `BlocPGE.tsx:120`, `BlocGarantieBPI.tsx:82`
- [x] **Mauvais tribunal** : `getJuridiction` ignore la forme juridique → SARL/SAS de conseil (NAF 70) envoyée au TJ au lieu du TC. `lib/strategie.ts:45` — tester la forme d'abord (sociétés commerciales = TC)
- [x] **Axe « Restructurer » recommandé en cessation** avec verdict qui nie la cessation. `lib/strategie.ts:127` — adapter le verdict selon `situation`
- [x] **AGS : plafond faux 24 000 € au lieu de 92 736 €** dans la FAQ. `app/faq/page.tsx:114`
- [x] **Index égalité F/H placé à 250 salariés** (obligatoire dès 50) + **CICE cité comme actif** (supprimé 2019). `lib/secteur.ts:792`
- [x] **OPCO : doublon Uniformation = OPCO Cohésion sociale** (même organisme) + **Opcommerce manquant** ; commerce mal rattaché. `lib/opco.ts:89`
- [x] **Section NAF N** (nettoyage, intérim, sécurité, services admin) classée « Professions libérales ». `lib/secteur.ts:135`
- [x] **CCSF : source légale erronée** (L611-7 = conciliation, pas la CCSF). `BlocCCSF.tsx:147`
- [x] **Cautionnement : art. L341-4 / L341-6 C. conso abrogés** (→ 2300 / 2303 C. civ.). `BlocGarantieBPI.tsx:90`
- [x] **Prescription : délai TVA annoncé à 4 ans au lieu de 3** (confusion reprise/recouvrement). `BlocPrescription.tsx:30`
- [x] **CIRI/CODEFI : bascule à 250 salariés mais textes disent 400.** `BlocAidesEtat.tsx:76`
- [x] **Carte « audience » : tribunal de commerce codé en dur**, contredit `getJuridiction`. `lib/priorites.ts:76`
- [x] **Plafonds AGS étiquetés « 2025 » mais valeurs 2024.** `BlocArretLongueDuree.tsx:80`
- [x] **Carte « bail » promet « 7 dispositifs », le bloc n'en liste que 6.** `lib/priorites.ts:181`

### 🔴 ERREURS — Sécurité
- [x] **`/api/fiche/send-link` = relais d'email ouvert** : aucune vérif d'existence/propriété de la fiche → mails « Votre fiche Avelor » vers victime arbitraire + injection. `send-link/route.ts:22`
- [x] **`/api/fiche/rappels` = phishing** : email/libellé arbitraires poussés dans les rappels cron → mails HTML contrôlés depuis le domaine Avelor. `rappels/route.ts:39`
- [x] **next@14.2.35 : 9 vulnérabilités (6 high)** dont SSRF (CVSS 8.6) + DoS Server Components. `package.json:19`

### 🟠 ERREURS — Bugs techniques
- [x] **Fuite de données entre fiches** : clés localStorage non préfixées par token (`avelor_plan_action`, `avelor_tresorerie`, `avelor_audit_caution`) → 2e SIRET voit les données du 1er. `BlocPlanAction.tsx:78` + 2 autres
- [x] **Hydration mismatch** : `ProgressTracker` lit localStorage dans l'init `useState`. `ProgressTracker.tsx:42`
- [x] **`BlocRappels` ne resync pas la date de cessation** saisie dans le même onglet. `BlocRappels.tsx:39`

### 🟠 ERREURS — Thème sombre / accessibilité cassés (confirmé visuellement)
- [x] **Carte d'identité illisible en sombre** (`from-white/via-white` non piloté par le thème → fond blanc + texte clair). `IdentiteHero.tsx:19`
- [x] **ModePerdu illisible en sombre** (même cause `via-white`). `ModePerdu.tsx:72`
- [x] **Contrastes sous AA en clair** : `text-navy/45` (2.97:1), `/50` (3.46:1) sur textes 10-12px. `Nav.tsx:109`, footer, hints
- [x] **Bouton d'appel vert** (`bg-vert` + `text-white`) = 3.37:1, sous AA. `ModePerdu.tsx:109`
- [x] **Déclaration d'accessibilité inexacte** (affirme « 14px min » et « prefers-reduced-motion » — faux). `accessibilite/page.tsx:41`

### 🟡 ERREURS — Liens cassés & incohérences visibles
- [x] **3 liens internes 404** : `/courriers/urssaf-delai`, `/outils/ccsf`, `/outils/caution`. `app/faq/page.tsx:99,100,139`
- [x] **Médiation du crédit : 2 numéros contradictoires** (3414 vs 0810 00 12 10 selon la page). `PriorityCards.tsx:112`
- [x] **Compteurs faux** : courriers 12 vs 17, glossaire 18 vs 38, outils 9 vs 11. `courriers/page.tsx:48`, `page.tsx:21`, `QuickLinks.tsx:23`
- [x] **Tous les barèmes datés « 2025 » alors qu'on est en 2026.** `outils/licenciement`, etc.
- [x] **URLs préfecture malformées** sur 93 départements (`www.10.gouv.fr` n'existe pas → `aube.gouv.fr`). `data/organismes.json`
- [x] **Fautes d'élision** : « Ordre des médecins du Ain / du Allier ». `data/organismes.json:82`
- [x] **`getFormeDetail` : branche `'micro'` morte** (INSEE renvoie « Entrepreneur individuel »). `lib/strategie.ts:29`

### 🟢 AMÉLIORATIONS issues de l'audit (renforcements, pas des bugs)
- [x] **Résilience réseau** : aucun timeout/AbortController sur INSEE/BODACC/Google Places → fiche SSR peut se figer. Ajouter timeout ~3s + fallback
- [x] **Accessibilité clavier questionnaire** : déplacer le focus vers le nouveau titre + `aria-live` au changement d'étape
- [x] **Nav** : remplacer `role="menu"/menuitem"` par `<nav>` + liste de liens
- [x] **Emojis décoratifs** à masquer (`aria-hidden`) — actuellement vocalisés
- [x] **`prefers-reduced-motion`** : couper les 3 blobs animés en boucle infinie (WCAG 2.2.2)
- [x] **Navigation flèches** dans le menu ThemeToggle (rôle `menuitemradio` annoncé mais non câblé)
- [x] **`ThemeToggle`** : appeler `applyTheme` au montage (sync `meta theme-color`)

---

### 📋 À faire (par priorité)

#### 🔴 CRITIQUE — bloque la qualité du conseil
- [ ] **Tester le site en navigateur réel** (mobile + desktop) sur tout le parcours
- [x] **Mode "perdu" radical** : 3 infos max (qui appeler / 1 action semaine / soutien APESA-3114) — composant `ModePerdu`
- [ ] **Migrer le rate limiting vers Upstash Redis** (in-memory inefficace sur Vercel serverless) — nécessite config externe
- [ ] **Préparer la mise à jour des barèmes 2026** quand publiés (AGS 92 736€, ATI 26,30€/j, aide juridictionnelle)

#### 🟠 IMPORTANT — manques fonctionnels identifiés
- [x] **Question "PGE en cours"** dans le questionnaire (oui/non/ne-sais-pas) + scoring stratégie + carte prioritaire + plan d'action
- [x] **Question "RQTH/handicap"** dans le questionnaire (consentement explicite RGPD) + priorisation AGEFIPH/Cap Emploi + ajout Comète France
- [x] **Question "Conjoint salarié/collaborateur"** dans le questionnaire + bloc dédié (3 statuts + statut de fait)
- [x] **Question "Co-gérants"** dans le questionnaire (solidarité fiscale L267 LPF / L243-6-2 CSS) + carte prioritaire
- [x] **Question "Saisonnalité"** dans le questionnaire — conditionne l'affichage APLD-R
- [x] **Question "Nationalité"** dans le questionnaire — déclenche le bloc Nationalité/Titre de séjour pour les profils hors UE
- [x] **Activité Partielle Longue Durée Rebond (APLD-R)** : nouveau bloc autonome (loi 14 fév. 2025, décret 11 avril 2025)
- [x] **Médiation PGE détaillée** : protocole de place, étalement 10 ans + procédure pas-à-pas en 5 étapes
- [x] **FSE+ (Fonds Social Européen 2021-2027)** : ajouté à BlocAidesEtat (employeurs)
- [x] **AFE → Bpifrance Création** : vérifié, pas de référence obsolète dans le code
- [x] **Distinguer EI/EIRL/Micro** dans le moteur stratégie (`getFormeDetail` → micro/ei/eirl/societe)
- [x] **Bloc Période suspecte** autonome (`BlocPeriodeSuspecte` — nullités de droit, nullités facultatives, action paulienne)
- [x] **Bloc CSP autonome** (`BlocCSP`) : extrait de BlocReclassement, procédure pas-à-pas 21 j
- [x] **Tests E2E Playwright** (parcours SIRET → fiche, calculateurs, FAQ ciblées) — `npm run test:e2e`
- [x] **Plus de tests** : composants React (SiretInput, BlocAccordeon, ModePerdu), routes API (api/fiche), OPCO
- [x] **Adresses postales précises** : 101 DDFiP, 101 Barreaux, 101 Chambres notaires, **101 Chambres d'agriculture** enrichis (métropole + DOM) — sources officielles (28/05/2026)
- [x] **Audit représentants par métier** : 15 secteurs auditésFinance/Information/Education sortis de l'état « critique »
- [x] **Enrichissement secteur finance** : FBF, ASF, AFG, FFA, AGEA, CSCA (avant : 0 syndicat)
- [x] **Enrichissement secteur information/IT** : Numeum, CINOV-IT, France Digitale, Fevad + JEI/CIR (avant : Syntec seul)
- [x] **Enrichissement secteur éducation** : FFP, SYNOFDES, CINOV Formation, Fnogec + recours Qualiopi (avant : 0 syndicat)
- [x] **Enrichissement secteur immobilier** : FNAIM, UNIS, FPI, LCA-FFB, SNPI + alerte carte T/G (avant : FNAIM seul)
- [x] **Enrichissement secteur santé** : FHP, FEHAP, SYNERPA, Vetos-Entraide + 5 nouveaux ordres (vétérinaires, dentistes, infirmiers, kinés, sages-femmes)
- [x] **Enrichissement secteur pêche** : Solidarité Marins, SNSM, AGISM ajoutés (soutien psy maritime spécialisé)
- [x] **Enrichissement secteur HCR** : GHR, SYNHORCAT, HCR Prévoyance/Klesia, Atout France (avant : UMIH+GNI+SNRTC)
- [x] **Enrichissement secteur commerce** : FCD, CGI, CGAD, Procos, Fevad, USPF, Action Cœur de Ville, Petites Villes Demain
- [x] **Enrichissement secteur transport** : Unostra, FNTV, CNPA/Mobilians, CSD déménageurs, TLF + dispositifs décarbonation
- [x] **Enrichissement secteur artisanat** : CAPEB, CGAD, UNEC, CNEC + AGEFICE + cellule prévention CMA + SSI
- [x] **Enrichissement libéral** : CNB, CSN, OEC, CNOA, OGE, CNCJ + caisses CAVOM (géomètres/huissiers), CAVAMAC (agents assurance)
- [x] **Calculateur seuils d'effectif** : 15 seuils (CSE, PSE, participation, AGEFIPH, RPS, BDESE, index égalité, congé reclassement)
- [x] **3 nouvelles FAQ ciblées** : caution-personnelle (10 Q), cessation-paiements (12 Q), rebondir-apres-liquidation (12 Q)
- [x] **Glossaire enrichi** : 20 nouveaux termes (PGE, APLD-R, CCSF, CRP, CIRI, AGS, CSP, PSE, ATI, ACRE/ARCE, FSE+, FNE, Médiation crédit, Médiation entreprises, Conseillers-Entreprises, Période suspecte, Action paulienne, APESA, 60 000 Rebonds, Surendettement)
- [x] **3 courriers** ajoutés : saisine CCSF, restructuration PGE, notification ACPR + APESA + aide juridictionnelle
- [x] **Page Comparatif des 8 procédures** : tableau visuel, 8 critères, aide à la décision
- [x] **Page Obligations du dirigeant** : 6 obligations à faire + 6 à ne pas faire, références légales et sanctions
- [x] **Mentions légales** + **Politique RGPD** : compliance complète, conforme RGPD
- [x] **Robots noindex** sur /fiche/[token] : fiches personnelles non indexées
- [x] **Adresses précises Tribunaux de commerce** : 101 dpts (TC + TAE réforme 2025 + TJ Alsace-Moselle + tribunaux mixtes DOM)
- [x] **Adresses précises URSSAF départementales** : 101 dpts + CGSS DOM + CSSM Mayotte
- [x] **Page Pénalités fiscales** : barème complet (intérêts, majorations 10/40/80 %, manœuvres) + voies de remise
- [x] **Page Médiation vs conciliation** : différences entre médiation crédit/entreprises, mandat ad hoc, conciliation
- [x] **Page Accessibilité** : déclaration RGAA, limitations, voies de recours
- [x] **CSS print enrichi** : @page A4, marges, mode économie d'encre, anti-orphelins
- [x] **Adresses précises CCI + CMA** : 101 dpts chacune (métropole + DOM), adresses + téléphones réels
- [x] **OG image dynamique par page** : /api/og (titre adaptatif + sous-titre + accent par catégorie) + helper lib/og.ts appliqué aux pages SEO clés
- [x] **Mode sombre** : thème complet via variables CSS (couleurs, surfaces, glass, boutons colorés, blobs) — bascule Nav + persistance + anti-FOUC
- [x] **Mode contraste élevé (RGAA AAA)** : panneaux opaques, bordures noires, blur off, textes faibles relevés, focus renforcé
- [x] Thèmes vérifiés visuellement par captures (clair/sombre/contraste) — aucune régression
- [x] **Téléphones DDFiP locaux** : 99/101 numéros directs (2 conservent le 0 809 401 401)
- [x] **Numéros Bâtonniers et Chambres notaires départementales** : 101 chambres notaires avec téléphones directs ; bâtonniers avec adresses (téléphones non publiés sur l'annuaire récap CNB)

#### 🟡 MOYEN — améliorations qualité
- [ ] **Ordres professionnels départementaux** : Bâtonniers locaux, Chambres notaires dép., Conseil dép. Ordre Médecins/Pharmaciens
- [x] **URPS régionaux** : Pharmaciens, Sage-femmes, Auxiliaires médicaux, Chirurgiens-dentistes (sites nationaux fédérateurs)
- [ ] **Syndicats locaux HCR** : UMIH délégations départementales (siège national actuellement)
- [x] **OPCO par NAF** : 11 OPCO (AKTO, ATLAS, OCAPIAT, AFDAS, UNIFORMATION, OPCO EP, OPCO Mobilités, OPCO 2i, OPCO Santé, Cohésion sociale, Constructys) dans `lib/opco.ts`
- [x] **Plateformes (VTC, livreurs)** : BlocPlateformes — ARPE, charte sociale, registre VTC, FNAUT-VTC, défense requalification, ATI/ACRE/ARCE/Adie
- [x] **Antécédents BODACC** : exploités dans le scoring stratégie (récidive → liquidation + rebond accompagné)
- [x] **Crédit-bail / leasing matériel** : BlocCreditBail enrichi avec 3 cas concrets (camion RJ, photocopieur LJ, pelleteuse non publiée)
- [x] **Garantie BPI/OSEO** : nouveau BlocGarantieBPI (règles, marges de négociation, procédure 5 étapes)
- [x] **Action paulienne (1341-2 C. civ.)** : couverte dans le BlocPeriodeSuspecte (encart dédié)
- [x] **Salariés en arrêt longue durée** : nouveau BlocArretLongueDuree (AT/MP, IJ Sécu, prévoyance, inaptitude)
- [x] **Calcul automatique seuil AGS** : vérification — l'outil licenciement somme déjà via `total.totalIndem` / `total.totalAgs` / `total.totalDepasse`
- [x] **Stocks importants — valorisation** : nouveau calculateur `/outils/stocks` avec 6 natures × 5 voies de cession
- [x] **Affacturage / escompte** : nouvelle section dédiée dans BlocAides (affacturage, escompte, Dailly, mobilisation créances publiques BPI)

#### 🟢 NICE-TO-HAVE — backlog
- [ ] Notifications email automatiques avant échéances clés (45 jours cessation, audience, contestation URSSAF)
- [ ] Compte utilisateur léger pour revenir sur sa fiche sans lien magique
- [x] **FAQ ciblée par situation** : 3 pages SEO (URSSAF impayée, PGE en difficulté, assignation tribunal) avec JSON-LD FAQPage
- [ ] Mise en relation directe avec un mandataire, un avocat ou un CIP local depuis la fiche
- [x] **Tracker de progression plus visuel** : 6 sous-groupes avec barres individuelles + pastilles "complet"
- [x] **PWA service worker** : `/sw.js` cache-first assets, network-first HTML, enregistrement conditionnel prod
- [ ] **Migration Next.js 15** : quand framer-motion sera compatible React 19 (corrige 4 vulnérabilités high)
- [x] **Question "Nationalité hors UE"** : nouvelle question + BlocNationaliteSejour (Passeport Talent, carte entrepreneur, OFII)
- [x] **OFII / aide régularisation** : pour dirigeants étrangers — dans BlocNationaliteSejour
- [x] **Vetos-Entraide** : déjà présent dans `lib/organismes.ts` (équivalent APESA pour vétérinaires)
- [x] **Comète France** : ajouté pour les profils RQTH (reconversion handicap)
- [ ] **CarePoint** : reconversion handicap (à compléter)

### 💡 Idées (long terme)

- [ ] Application mobile en PWA installable, fiche dans la poche
- [ ] Notifications push (manifest + service worker)
- [ ] Personnalisation par genre (consentement RGPD)
- [ ] Bot conversationnel (LLM) pour répondre aux questions complexes
- [ ] Intégration avec experts-comptables (lecture comptes pour pré-remplir)
- [ ] Module formation (vidéos courtes des concepts clés)
- [ ] Tableau de bord pour CIP/CCI (vue agrégée de leurs accompagnés)
- [ ] API publique (partenaires CCI, banques, experts-comptables)

## 📊 Couverture estimée par catégorie

| Catégorie | Couverture |
|---|---|
| Procédures collectives métropole | 85% (avec BlocPeriodeSuspecte + APLD-R + distinction micro/EI/EIRL) |
| Organismes départementaux | 90% (après enrichissement métropole) |
| Aides État (CCSF/CODEFI/CIRI/CRP/FSE+/FNE) | 95% |
| Aides personnelles dirigeant (ATI/ARCE/etc.) | 80% |
| Trésorerie immédiate (affacturage/escompte/Dailly) | 85% (nouvelle section dédiée) |
| Soutien psy | 80% (avec CMP/CUMP/SOS Suicide) |
| Risques juridiques dirigeant | 95% (L243-6-2, période suspecte dédiée, action paulienne, CRPC, co-gérance) |
| Santé/libéral (caisses + ordres) | 75% |
| Statut conjoint (salarié/collaborateur/associé/de fait) | 90% (nouveau bloc dédié) |
| Réseaux spécifiques (femmes/jeunes/seniors/handicap) | 75% (avec Comète France et priorisation RQTH) |
| HCR/BTP/Agriculture | 75% |
| Pêche | 70% |
| Transport spécialisé (VTC) | 30% |
| Franchise | 70% (avec BlocFranchise) |
| DOM-TOM | 75% (avec 11 territoires couverts) |
| Plateformes (Uber, Deliveroo) | 10% |
| PGE (restructuration + médiation) | 95% (procédure pas-à-pas) |

**Couverture globale : ~94%**

## 📈 Métriques

- 96 départements métropolitains + 11 DOM-TOM = **107 territoires**
- **~20 organismes par département** (vs 6 initialement)
- **15 secteurs** + **11 OPCO** mappés par NAF
- **37 blocs fiche** (vs 20 au départ : +Plateformes, CSP autonome, GarantieBPI, ArretLongueDuree, NationaliteSejour, APLDR, PeriodeSuspecte, ConjointCollaborateur, etc.)
- **18 questions** dans le questionnaire (vs 8 au départ : +nationalité)
- **222 tests Vitest** + Playwright E2E configuré (vs 0 au départ)
- **12 courriers** types
- **10 calculateurs** officiels (ajout : valorisation stocks)
- **4 annuaires** officiels
- **3 FAQ ciblées** par situation (URSSAF, PGE, assignation) — JSON-LD FAQPage
- **13 cartes prioritaires** scorables (top 4 affichées) — PGE, conjoint, cogerance
- **PWA** : service worker offline-ready avec cache versionné
