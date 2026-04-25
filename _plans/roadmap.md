# 🗺️ Avelor — Roadmap

> Dernière mise à jour : **2026-04-25**
> Statut global : **actif**

## 🎯 Vision

Aider les chefs d'entreprise français en difficulté à y voir clair en quelques minutes : une fiche personnalisée à partir de leur SIRET et de 8 questions, des courriers et calculateurs adossés aux textes officiels, et les bons interlocuteurs autour d'eux.

## 🏁 Jalons

### ✅ Fait

- [x] Plateforme en ligne sur avelor.vercel.app, déployée en continu via Vercel et la branche main
- [x] Questionnaire en 8 étapes (situation, problème, effectif, caution, patrimoine, régime, cession, moral) avec récupération automatique des données SIRET via l'INSEE
- [x] Fiche personnalisée organisée en dashboard (identité, 4 cartes prioritaires adaptatives, sections Agir / Vue d'ensemble / Échéances / Patrimoine / Aides / Ressources)
- [x] Croisement avec les annonces publiques BODACC pour détecter les incohérences entre la situation déclarée et la réalité publiée
- [x] 25 blocs juridiques et patrimoniaux (stratégie recommandée, décompte des 45 jours, projection de trésorerie, audit de cautions, cartographie patrimoniale, conséquences personnelles, bail commercial, CCSF, obligations selon l'effectif…)
- [x] 13 modèles de courriers personnalisés selon la situation et le moral du dirigeant, avec impression PDF propre
- [x] 9 calculateurs adossés aux textes officiels (prescription des dettes, indemnité de licenciement + AGS, ATI, aide juridictionnelle, ACRE/ARCE, calendrier fiscal, coût des procédures, préparateur de data room, valorisation indicative)
- [x] 4 annuaires officiels (délégations AGS, Tribunaux des Activités Économiques 2025, mandataires CNAJMJ, CIP territoriaux)
- [x] Export d'un fichier .ics pour importer les échéances clés (45 jours, audience, contestation URSSAF, appel) dans Google Agenda, Apple Calendrier ou Outlook
- [x] Aides régionales par département pour les 13 régions métropolitaines et l'Outre-mer
- [x] Sauvegarde de la fiche en base Supabase et envoi du lien magique par email via Resend
- [x] Recherche d'avocats locaux via Google Places intégrée dans le bloc Organismes

### 🔥 En cours

- [ ] Recueillir les retours de 2 ou 3 vrais dirigeants pour valider la pertinence de la fiche en condition réelle
- [ ] Vérifier le rendu de la refonte dashboard sur mobile et tablette, la barre de navigation sticky et le comportement des cartes qui s'agrandissent
- [ ] Stabiliser le contenu des cartes prioritaires (numéros officiels, citations légales) après les derniers ajustements

### 📋 À faire

- [ ] Mettre en place une mesure d'audience simple (Plausible ou équivalent) pour savoir quels blocs sont consultés et où les visiteurs décrochent
- [ ] Compléter les annuaires « starter » : passer de 16 à plusieurs centaines de mandataires CNAJMJ et de 22 à 105 antennes CIP
- [ ] Brancher un suivi des erreurs runtime (Sentry ou équivalent) pour ne plus voler à l'aveugle en production
- [ ] Activer de vraies notifications email automatiques avant les échéances clés (45 jours cessation, audience, contestation URSSAF)
- [ ] Faire relire la partie juridique par un professionnel (avocat ou mandataire) pour fiabiliser les sources et ajuster les formulations
- [ ] Publier des pages SEO ciblées par situation (URSSAF, fournisseurs, banque) pour capter la recherche organique
- [ ] Améliorer l'accessibilité (navigation clavier, contraste, lecteurs d'écran) sur la fiche et les outils
- [ ] Mettre en place un compte utilisateur léger pour permettre de revenir sur sa fiche dans le temps sans dépendre du lien magique

### 💡 Idées

- [ ] Mise en relation qualifiée avec un mandataire, un avocat ou un CIP local depuis la fiche, par formulaire envoyé en email
- [ ] Connexion FranceConnect + impôts.gouv pour récupérer automatiquement le passif fiscal et social du dirigeant
- [ ] Espace « accompagnant » plus poussé pour les proches d'un dirigeant en difficulté, avec une version filtrée de la fiche
- [ ] Application mobile (PWA d'abord) pour que le dirigeant garde sa fiche dans sa poche
- [ ] Programme partenaire avec CCI, mandataires bénévoles et experts-comptables qui peuvent référer leurs clients
- [ ] Modèle économique freemium ou licence B2B (CCI, cabinets d'expertise comptable) pour rendre le projet pérenne
