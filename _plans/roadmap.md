# 🗺️ Avelor — Roadmap

> Dernière mise à jour : **2026-05-27**
> Statut global : **production · couverture ~78%**

## 🎯 Vision

Aider les chefs d'entreprise français en difficulté à y voir clair en quelques minutes : une fiche personnalisée à partir de leur SIRET et de 12 questions, des courriers et calculateurs adossés aux textes officiels, et les bons interlocuteurs autour d'eux.

## 🏁 Jalons

### ✅ Fait

#### Infrastructure & qualité
- [x] Plateforme en ligne sur avelor.vercel.app, déployée en continu via Vercel et la branche main
- [x] Stack stable : Next.js 14.2.35 + React 18 + framer-motion 11 (LazyMotion)
- [x] 173 tests Vitest verts (lib/__tests__)
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
- [x] Questionnaire en 12 étapes (8 base + 4 optionnelles : montant dettes, âge, franchise, antécédents)
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
- [ ] **Mode "perdu" radical** : limiter à 3 infos max (qui appeler / 1 action semaine / "on reprend demain")
- [ ] **Migrer le rate limiting vers Upstash Redis** (in-memory inefficace sur Vercel serverless)
- [ ] **Préparer la mise à jour des barèmes 2026** quand publiés (AGS 92 736€, ATI 26,30€/j, aide juridictionnelle)

#### 🟠 IMPORTANT — manques fonctionnels identifiés
- [ ] **Question "PGE en cours"** dans le questionnaire (oui/non)
- [ ] **Question "RQTH/handicap"** dans le questionnaire (consentement explicite RGPD)
- [ ] **Question "Conjoint salarié/collaborateur"** dans le questionnaire
- [ ] **Question "Co-gérants"** dans le questionnaire (solidarité fiscale)
- [ ] **Question "Saisonnalité"** dans le questionnaire (impact activité partielle)
- [ ] **Activité Partielle Longue Durée Rebond (APLD-R)** : nouveau dispositif 2025 — créer bloc
- [ ] **Médiation PGE détaillée** : protocole de place, étalement 10 ans
- [ ] **FSE+ (Fonds Social Européen 2021-2027)** : aides restructurations sociales
- [ ] **AFE → Bpifrance Création** : corriger la référence AFE (fusionné depuis 2019)
- [ ] **Adresses postales précises** dans data/organismes.json (actuellement chef-lieu générique)
- [ ] **Téléphones DDFiP locaux** (numéro 0 809 401 401 partout, à affiner)
- [ ] **Numéros Bâtonniers et Chambres notaires départementales** (sites génériques actuellement)
- [ ] **Distinguer EI/EIRL/Micro** dans le moteur stratégie (procédures différentes)
- [ ] **Bloc CSP autonome** si BlocReclassement reste léger
- [ ] **Bloc Période suspecte** autonome (actuellement dans BlocConsequencesPerso)
- [ ] **Tests E2E Playwright** (parcours complet SIRET → fiche)
- [ ] **Plus de tests** : composants React, routes API, bodacc edge cases

#### 🟡 MOYEN — améliorations qualité
- [ ] **Ordres professionnels départementaux** : Bâtonniers locaux, Chambres notaires dép., Conseil dép. Ordre Médecins/Pharmaciens
- [ ] **URPS régionaux** : Pharmaciens, Sage-femmes, Auxiliaires médicaux (médecins déjà fait)
- [ ] **Syndicats locaux HCR** : UMIH délégations départementales (siège national actuellement)
- [ ] **OPCO par NAF** : AKTO (HCR), ATLAS, OCAPIAT (agri), AFDAS, UNIFORMATION, OPCO EP, OPCO MOBILITÉS
- [ ] **Plateformes (VTC, livreurs)** : statut spécifique, DGCCRF, registre VTC, FNAUT-VTC
- [ ] **Antécédents BODACC** : exploiter `reponses.antecedents` pour adapter la stratégie (récidive = plus dur)
- [ ] **Crédit-bail / leasing matériel** : déjà BlocCreditBail, enrichir avec exemples
- [ ] **Garantie BPI/OSEO** : règles négociation si emprunt garanti
- [ ] **Action paulienne (1341-2 C. civ.)** : ajout dans BlocConsequencesPerso (mentionnée brièvement)
- [ ] **Salariés en arrêt longue durée** : impact AGS différent
- [ ] **Calcul automatique seuil AGS** par salarié (calculateur affiché mais ne somme pas)
- [ ] **Stocks importants** : valorisation possible si commerçant
- [ ] **Affacturage / escompte** : distinguer du crédit fournisseur

#### 🟢 NICE-TO-HAVE — backlog
- [ ] Notifications email automatiques avant échéances clés (45 jours cessation, audience, contestation URSSAF)
- [ ] Compte utilisateur léger pour revenir sur sa fiche sans lien magique
- [ ] FAQ ciblée par situation et secteur (utile + SEO)
- [ ] Mise en relation directe avec un mandataire, un avocat ou un CIP local depuis la fiche
- [ ] Tracker de progression plus visuel (« vous avez exploré 6 blocs sur 28 »)
- [ ] PWA mobile : améliorer le service worker pour mode offline
- [ ] **Migration Next.js 15** : quand framer-motion sera compatible React 19 (corrige 4 vulnérabilités high)
- [ ] **Question "Nationalité hors UE"** : impact titre de séjour (Passeport Talent retiré si liquidation)
- [ ] **OFII / aide régularisation** : pour dirigeants étrangers
- [ ] **Vetos-Entraide** : équivalent APESA pour vétérinaires
- [ ] **CarePoint, Comète France** : reconversion handicap

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
| Procédures collectives métropole | 80% |
| Organismes départementaux | 90% (après enrichissement métropole) |
| Aides État (CCSF/CODEFI/CIRI/CRP) | 90% |
| Aides personnelles dirigeant (ATI/ARCE/etc.) | 80% |
| Soutien psy | 80% (avec CMP/CUMP/SOS Suicide) |
| Risques juridiques dirigeant | 90% (avec L243-6-2, période suspecte, CRPC) |
| Santé/libéral (caisses + ordres) | 75% |
| Réseaux spécifiques (femmes/jeunes/seniors/handicap) | 70% |
| HCR/BTP/Agriculture | 75% |
| Pêche | 70% (nouveau) |
| Transport spécialisé (VTC) | 30% |
| Franchise | 70% (avec BlocFranchise) |
| DOM-TOM | 75% (avec 11 territoires couverts) |
| Plateformes (Uber, Deliveroo) | 10% |

**Couverture globale : ~78%**

## 📈 Métriques

- 96 départements métropolitains + 11 DOM-TOM = **107 territoires**
- **~20 organismes par département** (vs 6 initialement)
- **15 secteurs** (vs 14)
- **28 blocs fiche** (vs 20)
- **12 questions** dans le questionnaire (vs 8)
- **173 tests** Vitest (vs 0 au départ)
- **12 courriers** types
- **9 calculateurs** officiels
- **4 annuaires** officiels
