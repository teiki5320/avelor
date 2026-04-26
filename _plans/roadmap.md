# 🗺️ Avelor — Roadmap

> Dernière mise à jour : **2026-04-26**
> Statut global : **mature**

## 🎯 Vision

Aider les chefs d'entreprise français en difficulté à y voir clair en quelques minutes : une fiche personnalisée à partir de leur SIRET et de 8 questions, des courriers et calculateurs adossés aux textes officiels, et les bons interlocuteurs autour d'eux.

## 🏁 Jalons

### ✅ Fait

- [x] Plateforme en ligne sur avelor.vercel.app, déployée en continu via Vercel et la branche main
- [x] Questionnaire en 8 étapes (situation, problème, effectif, caution, patrimoine, régime, cession, moral) avec récupération automatique des données SIRET via l'INSEE
- [x] Fiche personnalisée organisée en dashboard avec 4 cartes prioritaires adaptatives (choisies parmi 10 selon le profil) et 6 sections thématiques claires
- [x] Croisement avec les annonces publiques BODACC pour détecter les incohérences entre la situation déclarée et la réalité publiée
- [x] 11 nouveaux blocs juridiques et patrimoniaux : stratégie recommandée, timeline juridique, décompte 45 jours, projection de trésorerie, audit de cautions, cartographie patrimoniale, conséquences personnelles, CCSF, bail commercial, obligations selon l'effectif, rappels exportables au calendrier
- [x] 13 modèles de courriers contextualisés selon la situation et le moral du dirigeant, avec impression PDF propre
- [x] Ton du site et des courriers adapté au moral déclaré (combatif, épuisé, perdu)
- [x] État de santé sectoriel mis en avant dès l'arrivée sur la fiche pour les secteurs en crise (HCR, BTP, agriculture…)
- [x] Aides régionales spécifiques pour les 13 régions métropolitaines et l'Outre-mer
- [x] 9 calculateurs officiels rassemblés sur /outils : prescription des dettes, indemnité de licenciement + AGS, ATI, coût des procédures, aide juridictionnelle, ACRE/ARCE, calendrier fiscal, préparateur de data room, valorisation indicative
- [x] 4 annuaires officiels rassemblés sur /annuaires : délégations AGS, Tribunaux des Activités Économiques 2025, mandataires CNAJMJ, CIP territoriaux
- [x] Page d'accueil refondue avec mention discrète « J'accompagne un proche » qui mène à un parcours dédié sans demander de SIRET
- [x] Audit des informations officielles passé : numéros de téléphone, articles de loi, plafonds 2025 et liens vérifiés
- [x] Sauvegarde de la fiche en base Supabase et envoi du lien magique par email via Resend
- [x] Recherche d'avocats locaux via Google Places intégrée dans le bloc Organismes

### 🔥 En cours

- [ ] Faire tester la fiche par 2 ou 3 vrais dirigeants ou conseillers pour valider la pertinence en condition réelle
- [ ] Compléter les annuaires « starter » : passer de 16 à plusieurs centaines de mandataires CNAJMJ et de 22 à 105 antennes CIP
- [ ] Vérifier le rendu sur iPhone et petit écran (mobile) avant de pousser plus loin

### 📋 À faire

- [ ] Améliorer l'accessibilité du site : navigation clavier, contraste des couleurs, support des lecteurs d'écran
- [ ] Vérifier que toutes les variables d'environnement (Supabase, Resend, Google Places, INSEE) sont bien présentes en production sur Vercel
- [ ] Mettre en place un suivi simple des erreurs en production (Sentry ou équivalent)
- [ ] Mettre en place une mesure d'audience respectueuse de la vie privée (Plausible) pour comprendre quels blocs sont consultés
- [ ] Suivre les indicateurs d'usage : nombre de fiches générées, courriers téléchargés, calculateurs utilisés
- [ ] Préparer la mise à jour des sources datées (plafonds, barèmes 2025 → 2026 le moment venu)

### 💡 Idées

- [ ] Notifications email automatiques avant les échéances clés (45 jours cessation, audience, contestation URSSAF)
- [ ] Compte utilisateur léger pour revenir sur sa fiche dans le temps sans dépendre du lien magique reçu par email
- [ ] FAQ ciblée par situation et secteur, à la fois utile aux visiteurs et bénéfique pour le référencement
- [ ] Mise en relation directe avec un mandataire, un avocat ou un CIP local depuis la fiche, par formulaire qualifié
- [ ] Tracker de progression dans la fiche (« vous avez exploré 6 blocs sur 25 ») pour encourager le retour
- [ ] Application mobile en PWA pour que le dirigeant garde sa fiche dans sa poche
