# MARKETING — Plan marketing & rémunération

> **Généré le 20/07/2026** par un scan du dépôt (SEO, partage, analytics, monétisation existants).
> Pour le mettre à jour : relancer le prompt de génération dans une session Claude Code.
> Aucun secret dans ce fichier. Statuts : ✅ câblé dans le code · ⬜ à faire.

---

## 1. Positionnement

**Angle** : « Vous n'êtes pas seul·e, et il existe des solutions légales — voici les vôtres, en 5 minutes, gratuitement, sans jugement. »

Avelor est le seul outil qui part du **SIRET réel** (données INSEE/BODACC vivantes) et d'un questionnaire humain (18 questions, dont le moral) pour produire une **fiche personnalisée** : stratégie juridique, courriers prêts à envoyer, organismes de son département, aides de son secteur (18 secteurs), soutien psychologique. Ni un annuaire générique, ni un cabinet payant : un premier pas gratuit et confidentiel.

**Publics** :
1. **Le dirigeant en difficulté** (cœur) — TPE/indépendant, souvent seul, qui cherche à 23h « urssaf dettes que faire ». Ton : direct, déculpabilisant, inclusif (formulations `seul·e`).
2. **Le proche aidant** — conjoint, ami, famille (parcours `/accompagnant` ✅ déjà en place).
3. **Les prescripteurs** — experts-comptables, avocats, CIP, greffes, CCI/CMA, associations (APESA, 60 000 Rebonds…) qui cherchent un outil gratuit à recommander.

**Actif de confiance à protéger** : la gratuité et la confidentialité du parcours dirigeant. Toute rémunération doit s'exercer **sans jamais dégrader** ce cœur (pas de paywall sur la fiche, pas de revente de données — engagement déjà pris dans `/politique-donnees`).

## 2. Rémunération — en phases

| Phase | Modèle | Détail | Statut |
|---|---|---|---|
| 0 | **Gratuit intégral** | Positionnement actuel, assumé dans les mentions légales (« projet d'accompagnement gratuit »). Coûts quasi nuls (Vercel/Supabase/Resend en free tier) | ✅ |
| 1 | **Soutien non marchand** | Subventions & appels à projets (France Num, Bpifrance, fondations — Entreprendre, MMA des Entrepreneurs du Futur), mécénat de compétences, prix/concours ESS | ⬜ |
| 2 | **B2B prescripteurs** | Offre « conseiller » : tableau de bord multi-fiches pour experts-comptables / CIP / associations, marque blanche pour CCI-CMA, licence annuelle. Le dirigeant final ne paie jamais | ⬜ |
| 3 | **Partenariats qualifiés** | Mise en relation vers des professionnels vérifiés (avocats, mandataires ad hoc) avec rémunération à l'apport **affichée et transparente**. ⚠️ Encadrement déontologique strict (démarchage juridique réglementé) — à valider avec un avocat avant toute mise en œuvre | ⬜ |
| 4 | **Affiliation éthique** | Uniquement des outils réellement utiles au rebond (logiciels de facturation/compta, assurance pro, banques pro) avec mention explicite du lien d'affiliation. Jamais dans le parcours de crise (fiche), seulement dans les pages « rebond » | ⬜ |
| — | **Exclusions** | Pas de publicité display, pas de paywall sur la fiche, pas de vente de leads non consentis, pas de données revendues | ✅ (par design) |

## 3. SEO / ASO

Le produit est un site + PWA (`manifest.json` + icônes ✅) — pas de présence sur les stores à ce jour.

**Référencement web (l'équivalent ASO du projet)** :
- ✅ 48 pages avec métadonnées dédiées, `sitemap.ts`, `robots.ts`, JSON-LD (site + FAQPage), image Open Graph dynamique (`/api/og`)
- ✅ ~50 pages de contenu long-tail : 17 modèles de courriers, 11 calculateurs, 4 annuaires, FAQ, glossaire, 4 pages situation, témoignages
- **Mots-clés visés** (intention de crise, concurrence faible, requêtes réelles) :
  - « dettes urssaf que faire », « impossible de payer l'urssaf »
  - « procédure collective démarches », « redressement judiciaire dirigeant »
  - « cessation de paiements 45 jours », « déclarer cessation de paiements »
  - « caution personnelle dirigeant dettes », « liquidation judiciaire et maison »
  - « aide dirigeant entreprise en difficulté », « qui appeler entreprise en difficulté »
  - Longue traîne sectorielle : « boulangerie en difficulté aides », « restaurant dettes urssaf », « artisan BTP redressement »…
- ⬜ Vérifier l'indexation dans Google Search Console après le passage au domaine définitif
- ⬜ Pages piliers « [situation] + [département] » ou « + [métier] » (le moteur 18 secteurs × 107 territoires le permet déjà)

**Stores (si un jour pertinent)** :
- ⬜ Publier la PWA sur le Play Store via TWA (coût quasi nul) — titre : « Avelor — entreprise en difficulté » ; description axée gratuité/confidentialité
- ⬜ Captures d'écran : parcours SIRET → fiche (mode clair + sombre), bloc « qui appeler », calculateurs
- ⬜ Notes/avis : solliciter les avis **uniquement** auprès des utilisateurs revenus en mode « rebond » (jamais en pleine crise)

## 4. Canaux d'acquisition

| Canal | Détail | Statut |
|---|---|---|
| SEO organique | Base technique en place (voir §3) ; c'est le canal n°1 naturel vu les requêtes de crise | ✅ base / ⬜ suivi |
| Prescripteurs institutionnels | Faire référencer Avelor par : CIP nationaux/locaux, greffes des TC, CCI/CMA, URSSAF (page « difficultés »), APESA, 60 000 Rebonds, Second Souffle. Un seul lien depuis un .gouv.fr ou une CCI vaut des mois de SEO | ⬜ |
| Experts-comptables & avocats | Kit prescripteur : une page `/pro` + flyer PDF + email type « orientez vos clients en difficulté » | ⬜ |
| LinkedIn | Seul réseau pertinent : posts pédagogiques (les 45 jours, la caution, le PGE…), témoignages anonymisés. Créer la page entreprise + 2 posts/semaine | ⬜ |
| Partage in-app | Aucun bouton de partage aujourd'hui. Ajouter « Envoyer cette fiche à un proche » (magic link existant ✅) et « Partager cet outil » sur les calculateurs (`navigator.share`) | ⬜ |
| Presse spécialisée | Les Échos Entrepreneurs, BFM Business, La Tribune, presse pro sectorielle (Le Bâtiment, L'Hôtellerie-Restauration…) — angle : « l'outil gratuit qui oriente les dirigeants en difficulté » + chiffres du compteur | ⬜ |
| Newsletter | Inexistante. Peu prioritaire pour le public en crise (one-shot par nature) ; pertinente pour les **prescripteurs** (actualité juridique mensuelle) | ⬜ |
| Annuaires & backlinks | les-aides.fr, aides-entreprises.fr, annuaires CCI, wikis entrepreneuriat | ⬜ |
| SEA (Google Ads) | Déconseillé au lancement : coût/clic élevé sur ces requêtes, budget nul. Possible plus tard via Google Ad Grants **si** structure associative | ⬜ |
| Réseaux sociaux grand public | Instagram/TikTok/Facebook : non pertinents pour ce public/ton — volontairement exclus | — |

## 5. Calendrier saisonnier

Les difficultés d'entreprise ont une saisonnalité réelle — caler contenus et campagnes dessus :

| Période | Événement | Action |
|---|---|---|
| Janvier | Trésorerie post-fêtes, vœux, bonnes résolutions | Push « faire le point » ; posts bilan/rebond |
| 15 mars & 15 juin | Acomptes IS + échéances URSSAF trimestrielles | Contenus « impossible de payer l'échéance » la semaine précédente |
| Avril–juin | Clôtures & dépôts des comptes, AG | Kit prescripteur vers experts-comptables (leur pic de contact client) |
| Septembre | Rentrée, reprise des impayés d'été (HCR, tourisme, saisonniers) | Campagne sectorielle HCR/commerce |
| Novembre–décembre | CFE (15 déc.), épuisement de fin d'année | Mise en avant du volet soutien psy (APESA, 3114) — communication sobre |
| Toute l'année | Publications BODACC du lundi/jeudi | Le bloc alertes BODACC ✅ est un angle presse récurrent |

## 6. KPIs à suivre

| KPI | Source | Statut |
|---|---|---|
| Fiches créées (total + par semaine) | `/api/stats` + Compteur | ✅ |
| Visiteurs, sources de trafic, pages d'entrée | Plausible — branché dans le code, **compte à souscrire** | ⬜ |
| Taux de complétion du questionnaire (étape 1 → fiche) | Événements Plausible à poser | ⬜ |
| Emails magic link envoyés / ouverts | Dashboard Resend | ✅ |
| Rappels programmés (engagement) | Table `fiches` (champ rappels) | ✅ données / ⬜ requête |
| Positions SEO sur 10 mots-clés cibles | Search Console (après domaine définitif) | ⬜ |
| Backlinks institutionnels obtenus | Suivi manuel (tableur) | ⬜ |
| Partages de fiche à un proche | À instrumenter avec le bouton partage | ⬜ |
| Retours qualitatifs | Témoignages ✅ (4 anonymisés) + retours des testeurs réels | ⬜ tests en cours |

## 7. Prochaines actions, dans l'ordre

1. ⬜ **Mettre en ligne sur le domaine définitif** (préalable à tout le reste — plan : `_plans/roadmap.md` § MISE EN LIGNE)
2. ⬜ **Activer la mesure** : souscrire Plausible (ou activer Vercel Analytics) + déclarer le site dans Google Search Console
3. ⬜ **Ajouter le partage** : bouton « Envoyer à un proche » sur la fiche + partage natif sur les calculateurs
4. ⬜ **Créer la page `/pro`** (kit prescripteur) et le PDF associé
5. ⬜ **Contacter 10 prescripteurs** : 3 CIP, 2 CCI, 2 associations (APESA, 60 000 Rebonds), 3 experts-comptables — objectif : 3 référencements/backlinks
6. ⬜ **Ouvrir la page LinkedIn** et tenir 2 posts/semaine pendant 8 semaines (réutiliser le contenu des blocs/FAQ)
7. ⬜ **Presse** : 1 communiqué quand le compteur atteint un chiffre rond + 1 angle saisonnier (voir §5)
8. ⬜ **Explorer la phase 1 de rémunération** (subventions/fondations) une fois les premiers chiffres d'usage disponibles
9. ⬜ **Étudier l'offre B2B prescripteurs** (phase 2) si ≥ 5 prescripteurs actifs le demandent
