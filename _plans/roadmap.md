# 🗺️ Avelor — Roadmap

> Dernière mise à jour : **2026-05-28**
> Statut global : **production · couverture ~94%**

## 🎯 Vision

Aider les chefs d'entreprise français en difficulté à y voir clair en quelques minutes : une fiche personnalisée à partir de leur SIRET et de 12 questions, des courriers et calculateurs adossés aux textes officiels, et les bons interlocuteurs autour d'eux.

## 🏁 Jalons

### ✅ Fait

#### Infrastructure & qualité
- [x] Plateforme en ligne sur avelor.vercel.app, déployée en continu via Vercel et la branche main
- [x] Stack stable : Next.js 14.2.35 + React 18 + framer-motion 11 (LazyMotion)
- [x] 222 tests Vitest verts (lib + composants React + routes API) + Playwright E2E configuré
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
- [x] **Scoring stratégie enrichi** : PGE en cours favorise restructuration amiable et pénalise sauvegarde (perte garantie État) ; antécédents BODACC poussent vers liquidation / rebond accompagné
- [x] **Mode « perdu » radical** (`ModePerdu`) : 3 infos max si moral === 'perdu' (qui appeler / 1 action semaine / soutien APESA-3114). Bouton « Voir tout » pour ouvrir la fiche complète.
- [x] Fiche personnalisée organisée en dashboard avec 4 cartes prioritaires adaptatives (parmi 10) et 6 sections thématiques
- [x] Croisement avec les annonces BODACC pour détecter les incohérences
- [x] Stratégie sur 5 axes (restructurer, sauvegarder, céder, liquider, rebondir) avec scoring
- [x] Ton du site et des courriers adapté au moral déclaré (combatif, épuisé, perdu)
- [x] État de santé sectoriel mis en avant pour les secteurs en crise (HCR, BTP, agriculture)
- [x] 12 modèles de courriers contextualisés
- [x] 9 calculateurs (prescription, licenciement+AGS, ATI, coût procédures, aide juridictionnelle, ACRE/ARCE, calendrier fiscal, data-room, valorisation)
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
