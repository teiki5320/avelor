import data from '@/data/organismes.json';
import type { Reponses } from './types';
import type { SectorInfo, Secteur } from './secteur';

interface OrganismeLocal {
  nom: string;
  type: string;
  telephone?: string;
  adresse?: string;
  site?: string;
}

export interface DepartementData {
  code: string;
  nom: string;
  chefLieu: string;
  tribunal: OrganismeLocal;
  cci: OrganismeLocal;
  urssaf: OrganismeLocal;
  sie: OrganismeLocal;
  mandataires?: OrganismeLocal[];
  banqueDeFrance?: OrganismeLocal;
  dreets?: OrganismeLocal;
  ddfip?: OrganismeLocal;
  cma?: OrganismeLocal;
  prefecture?: OrganismeLocal;
  pointJustice?: OrganismeLocal;
  carsat?: OrganismeLocal;
  conciliateur?: OrganismeLocal;
}

const DATA = data as Record<string, DepartementData>;

export function getDepartement(code: string): DepartementData | null {
  return DATA[code] ?? null;
}

export interface OrganismeCard {
  nom: string;
  type: string;
  telephone?: string;
  adresse?: string;
  site?: string;
  badge?: string;
  note?: number;
  avis?: number;
  mapsUrl?: string;
}

export interface GroupeOrganismes {
  cle: string;
  titre: string;
  couleur: string;
  icone: string;
  cartes: OrganismeCard[];
}

export function buildOrganismes(
  dep: DepartementData | null,
  reponses: Reponses,
  avocats: OrganismeCard[]
): GroupeOrganismes[] {
  const groups: GroupeOrganismes[] = [];

  // Conseil juridique (violet)
  const juridique: OrganismeCard[] = [...avocats];
  juridique.push({
    nom: 'Expert-comptable CIP',
    type: 'CIP National',
    telephone: 'ciprofessionnels.com',
    site: 'https://www.ciprofessionnels.com',
    badge: 'Gratuit · confidentiel',
  });
  if (reponses.probleme === 'banque' || reponses.probleme === 'fournisseurs') {
    juridique.push({
      nom: 'Notaire',
      type: 'Protection du patrimoine',
      site: 'https://www.notaires.fr',
      badge: 'Si patrimoine concerné',
    });
  }
  groups.push({
    cle: 'juridique',
    titre: 'Conseil juridique',
    couleur: 'violet',
    icone: '⚖️',
    cartes: juridique,
  });

  // Institutionnel (rouge)
  const inst: OrganismeCard[] = [];
  if (dep?.tribunal) {
    inst.push({
      nom: dep.tribunal.nom,
      type: 'Tribunal de commerce',
      telephone: dep.tribunal.telephone,
      adresse: dep.tribunal.adresse,
      site: dep.tribunal.site,
    });
  }
  if (dep?.cci) {
    inst.push({
      nom: dep.cci.nom,
      type: 'CCI',
      telephone: dep.cci.telephone,
      adresse: dep.cci.adresse,
      site: dep.cci.site,
      badge: 'Accompagnement gratuit',
    });
  }
  if (reponses.situation === 'redressement' || reponses.situation === 'assignation') {
    inst.push({
      nom: 'CNAJMJ · Mandataires judiciaires',
      type: 'Annuaire national',
      site: 'https://www.cnajmj.fr',
      badge: 'Mandataires agréés',
    });
  }
  // Conseillers-Entreprises : guichet unique pour les dirigeants en difficulté
  inst.push({
    nom: 'Conseillers-Entreprises',
    type: 'Guichet unique État',
    telephone: '0 806 000 245',
    site: 'https://conseillers-entreprises.service-public.gouv.fr',
    badge: 'Gratuit · confidentiel',
  });
  // Cellules de l'État pour les restructurations
  const isLargeEntreprise =
    reponses.effectif === 'salaries' &&
    !!reponses.effectifDetail &&
    /(\b[4-9]\d{2}\b|\b\d{4,}\b)/.test(reponses.effectifDetail);
  if (isLargeEntreprise) {
    inst.push({
      nom: 'CIRI',
      type: 'Comité Interministériel de Restructuration Industrielle',
      telephone: '01 44 87 72 58',
      site: 'https://www.economie.gouv.fr/ciri',
      badge: 'Entreprises > 400 salariés',
    });
  } else {
    inst.push({
      nom: 'CODEFI',
      type: 'Comité Départemental d\'Examen des Problèmes de Financement',
      site: 'https://www.economie.gouv.fr/codefi',
      badge: 'Via la DDFiP · entreprises < 400 salariés',
    });
  }
  inst.push({
    nom: 'CRP · Commissaire aux Restructurations',
    type: 'Préfecture / DREETS',
    site: 'https://www.economie.gouv.fr',
    badge: 'Saisine via Préfecture',
  });
  groups.push({
    cle: 'institutionnel',
    titre: 'Institutionnel',
    couleur: 'rouge',
    icone: '🏛️',
    cartes: inst,
  });

  // Financier (bleu marine)
  const fin: OrganismeCard[] = [];
  if (reponses.probleme === 'urssaf' && dep?.urssaf) {
    fin.push({
      nom: dep.urssaf.nom,
      type: 'URSSAF',
      telephone: dep.urssaf.telephone ?? '3957',
      site: dep.urssaf.site ?? 'https://www.urssaf.fr',
      badge: 'Échelonnement possible',
    });
  }
  if (reponses.probleme === 'impots' && dep?.sie) {
    fin.push({
      nom: dep.sie.nom,
      type: 'Service des impôts (SIE)',
      telephone: dep.sie.telephone,
      adresse: dep.sie.adresse,
      site: dep.sie.site ?? 'https://www.impots.gouv.fr',
    });
  }
  fin.push({
    nom: 'BPI France',
    type: 'Diagnostic + financement',
    telephone: '3247',
    site: 'https://bpifrance.fr',
    badge: 'Entretien gratuit',
  });
  // Correspondant TPE-PME Banque de France — diagnostic gratuit et confidentiel
  fin.push({
    nom: 'Correspondant TPE-PME Banque de France',
    type: 'Diagnostic financier confidentiel',
    telephone: '34 14',
    site: 'https://entreprises.banque-france.fr',
    badge: 'Gratuit · confidentiel',
  });
  if (reponses.probleme === 'banque' && dep?.banqueDeFrance) {
    fin.push({
      nom: dep.banqueDeFrance.nom,
      type: 'Médiation du crédit',
      telephone: dep.banqueDeFrance.telephone ?? '0810 00 12 10',
      site: 'https://mediateur-credit.banque-france.fr',
      badge: 'Gratuit · confidentiel',
    });
  }
  if (reponses.probleme === 'fournisseurs') {
    fin.push({
      nom: 'Médiateur des entreprises',
      type: 'Différends fournisseurs',
      telephone: '01 53 17 87 40',
      site: 'https://www.economie.gouv.fr/mediateur-des-entreprises',
      badge: 'Gratuit',
    });
  }
  groups.push({
    cle: 'financier',
    titre: 'Financier',
    couleur: 'bleu-fonce',
    icone: '💳',
    cartes: fin,
  });

  // Social (vert)
  const soc: OrganismeCard[] = [];
  if (reponses.effectif === 'salaries') {
    soc.push({
      nom: 'AGS',
      type: 'Garantie des salaires',
      telephone: '01 55 90 27 00',
      site: 'https://www.ags-garantie-salaires.org',
      badge: 'Si salariés',
    });
    if (dep?.dreets) {
      soc.push({
        nom: dep.dreets.nom,
        type: 'DREETS',
        telephone: dep.dreets.telephone,
        site: dep.dreets.site ?? 'https://dreets.gouv.fr',
      });
    } else {
      soc.push({
        nom: 'DREETS de votre région',
        type: 'Accompagnement social',
        site: 'https://dreets.gouv.fr',
      });
    }
  }
  if (reponses.effectif === 'independant') {
    soc.push({
      nom: 'SSI · Sécurité Sociale des Indépendants',
      type: 'Action sociale dirigeants',
      telephone: '3957',
      site: 'https://www.secu-independants.fr',
      badge: 'Aides dédiées indépendants',
    });
    soc.push({
      nom: 'France Travail Indépendants',
      type: 'ATI · Allocation Travailleurs Indépendants',
      telephone: '39 95',
      site: 'https://chomage-independant.francetravail.fr',
      badge: '26,30€/jour · 182 jours max',
    });
  }
  groups.push({
    cle: 'social',
    titre: 'Social',
    couleur: 'vert',
    icone: '🤝',
    cartes: soc,
  });

  return groups;
}

/**
 * Aides personnelles destinées au dirigeant (et non à l'entreprise) :
 * revenus de remplacement, couverture santé, logement, accès au droit…
 * Retourne un groupe indépendant des 4 groupes "entreprise" de buildOrganismes.
 */
export function buildAidesPersonnelles(reponses: Reponses): GroupeOrganismes {
  const cartes: OrganismeCard[] = [];

  // Indépendants : ATI en priorité
  if (reponses.effectif === 'independant') {
    cartes.push({
      nom: 'ATI · Allocation Travailleurs Indépendants',
      type: 'France Travail',
      telephone: '39 95',
      site: 'https://chomage-independant.francetravail.fr',
      badge: '26,30€/jour · 182 jours max',
    });
  }

  // ACRE : exonération de charges 1ère année après rebond
  cartes.push({
    nom: 'ACRE · Aide à la Création/Reprise d\'Entreprise',
    type: 'URSSAF · exonération de charges',
    telephone: '3957',
    site: 'https://www.urssaf.fr',
    badge: 'Rebond après liquidation',
  });

  // ARCE : capital France Travail pour rebondir
  cartes.push({
    nom: 'ARCE · Aide à la Reprise/Création',
    type: 'France Travail · capital',
    telephone: '39 49',
    site: 'https://www.francetravail.fr',
    badge: '60 % des droits chômage versés en capital',
  });

  // CSS : couverture santé
  cartes.push({
    nom: 'CSS · Complémentaire Santé Solidaire',
    type: 'Assurance Maladie',
    telephone: '0 800 17 13 23',
    site: 'https://www.complementaire-sante-solidaire.gouv.fr',
    badge: 'Gratuit ou < 1€/jour',
  });

  // RSA via CAF
  cartes.push({
    nom: 'RSA · Revenu de Solidarité Active',
    type: 'CAF',
    site: 'https://www.caf.fr',
    badge: 'Si ressources < seuil',
  });

  // ASS via France Travail
  cartes.push({
    nom: 'ASS · Allocation de Solidarité Spécifique',
    type: 'France Travail',
    telephone: '39 49',
    site: 'https://www.francetravail.fr',
    badge: '18,17€/jour · fin de droits chômage',
  });

  // APL logement
  cartes.push({
    nom: 'APL · Aide Personnalisée au Logement',
    type: 'CAF',
    site: 'https://www.caf.fr',
    badge: 'Logement principal',
  });

  // Aide juridictionnelle
  cartes.push({
    nom: 'Aide juridictionnelle',
    type: 'Tribunal judiciaire / Tribunal de commerce',
    site: 'https://www.service-public.fr/particuliers/vosdroits/F18074',
    badge: 'Prise en charge des frais d\'avocat',
  });

  return {
    cle: 'aides-personnelles',
    titre: 'Aides personnelles au dirigeant',
    couleur: 'vert',
    icone: '💚',
    cartes,
  };
}

/**
 * Ordres professionnels et caisses de retraite spécifiques selon le secteur
 * (libéral, santé). Retourne null si non pertinent.
 */
export function buildOrdresProfessionnels(
  sector: Pick<SectorInfo, 'secteur' | 'ordresProfessionnels' | 'caissesRetraite'>
): GroupeOrganismes | null {
  if (sector.secteur !== 'liberal' && sector.secteur !== 'sante') {
    return null;
  }
  const cartes: OrganismeCard[] = [];

  for (const ordre of sector.ordresProfessionnels ?? []) {
    cartes.push({
      nom: ordre.nom,
      type: `Ordre · ${ordre.profession}`,
      telephone: ordre.telephone,
      site: ordre.site,
      badge: ordre.note ?? 'Entraide confraternelle',
    });
  }

  for (const caisse of sector.caissesRetraite ?? []) {
    cartes.push({
      nom: `${caisse.caisse} · Action sociale`,
      type: `Caisse de retraite · ${caisse.profession}`,
      telephone: caisse.telephone,
      site: caisse.site,
      badge: 'Aide d\'urgence possible',
    });
  }

  if (cartes.length === 0) return null;

  return {
    cle: 'ordres-professionnels',
    titre: 'Ordres professionnels et caisses',
    couleur: 'violet',
    icone: '🎓',
    cartes,
  };
}

/**
 * Réseaux d'accompagnement et de soutien : BGE (créateurs/repreneurs),
 * AGEFIPH (handicap), conciliateurs de justice, médecine du travail…
 */
export function buildSoutien(reponses: Reponses): GroupeOrganismes {
  const cartes: OrganismeCard[] = [];

  cartes.push({
    nom: 'BGE · Boutiques de Gestion',
    type: 'Accompagnement créateurs/repreneurs',
    telephone: '01 43 55 03 03',
    site: 'https://www.bge.asso.fr',
    badge: 'Rebond et reconversion',
  });

  cartes.push({
    nom: 'AGEFIPH',
    type: 'Handicap au travail',
    telephone: '0 800 11 10 09',
    site: 'https://www.agefiph.fr',
    badge: 'Salariés ou dirigeant en situation de handicap',
  });

  cartes.push({
    nom: 'Conciliateur de justice',
    type: 'Règlement amiable des litiges',
    site: 'https://www.conciliateurs.fr',
    badge: 'Saisine via mairie · gratuit',
  });

  if (reponses.effectif === 'salaries') {
    cartes.push({
      nom: 'Médecine du travail · SIST',
      type: 'Service de santé au travail',
      site: 'https://www.presanse.fr',
      badge: 'Selon votre région',
    });
  }

  // Crédit-bail / leasing : ASF pour négocier les contrats
  if (reponses.probleme === 'fournisseurs' || reponses.probleme === 'banque') {
    cartes.push({
      nom: 'ASF · Association française des Sociétés Financières',
      type: 'Crédit-bail / leasing',
      site: 'https://www.asf-france.com',
      badge: 'Négocier un contrat de leasing',
    });
  }

  return {
    cle: 'soutien',
    titre: 'Soutien et accompagnement',
    couleur: 'bleu',
    icone: '🤲',
    cartes,
  };
}

/**
 * Réseaux d'accompagnement spécifiques selon le profil du dirigeant :
 * femmes, jeunes, seniors, handicap, soutien psy, reprise après liquidation,
 * et entraide sectorielle (marin-pêcheur, vétérinaire…). Retourne plusieurs
 * groupes possibles (chacun affiché comme une section indépendante).
 */
export function buildReseauxSpecifiques(
  reponses: Reponses,
  sector?: Pick<SectorInfo, 'secteur'>
): GroupeOrganismes[] {
  const groupes: GroupeOrganismes[] = [];
  const age = reponses.ageDirigeant;

  // ----- Femmes dirigeantes (réseaux mixtes-femmes affichés systématiquement
  // car le questionnaire ne renseigne pas le genre ; Force Femmes ajouté si >45 ans)
  const femmes: OrganismeCard[] = [
    {
      nom: "Action'elles",
      type: 'Réseau · femmes entrepreneures',
      site: 'https://www.action-elles.fr',
      badge: 'Accompagnement gratuit',
    },
    {
      nom: 'Bouge ta Boîte',
      type: 'Réseau business · femmes',
      site: 'https://www.bougetaboite.com',
      badge: 'Cercles locaux',
    },
    {
      nom: "Femmes Chefs d'Entreprise (FCE France)",
      type: 'Réseau national',
      site: 'https://www.fcefrance.com',
      badge: 'Entraide entre dirigeantes',
    },
    {
      nom: 'Garantie Égalité Femmes (ex-FGIF)',
      type: 'France Active · garantie de prêt',
      site: 'https://www.franceactive.org',
      badge: 'Garantie jusqu\'à 80 % du prêt',
    },
  ];
  if (age === 'plus-60' || age === '50-60') {
    femmes.push({
      nom: 'Force Femmes',
      type: 'Femmes > 45 ans · accompagnement emploi/création',
      telephone: '01 44 51 03 53',
      site: 'https://www.forcefemmes.com',
      badge: 'Gratuit · > 45 ans',
    });
  }
  groupes.push({
    cle: 'reseaux-femmes',
    titre: 'Réseaux femmes dirigeantes',
    couleur: 'violet',
    icone: '👩‍💼',
    cartes: femmes,
  });

  // ----- Jeunes dirigeants (< 25 ans)
  if (age === 'moins-25') {
    groupes.push({
      cle: 'reseaux-jeunes',
      titre: 'Réseaux jeunes dirigeants',
      couleur: 'bleu',
      icone: '🌱',
      cartes: [
        {
          nom: '1 jeune 1 mentor',
          type: 'Mentorat · 16-30 ans',
          telephone: '0 800 712 712',
          site: 'https://www.1jeune1mentor.fr',
          badge: 'Gratuit · numéro vert',
        },
        {
          nom: 'Mission Locale',
          type: 'Accompagnement < 26 ans',
          site: 'https://www.unml.info',
          badge: 'Réseau national · gratuit',
        },
        {
          nom: 'France Active Jeunes',
          type: 'Financement solidaire',
          site: 'https://www.franceactive.org',
          badge: 'Prêts d\'honneur, garanties',
        },
        {
          nom: 'Adie Créajeunes',
          type: 'Microcrédit + accompagnement',
          telephone: '0 969 328 110',
          site: 'https://www.adie.org',
          badge: 'Spécial < 32 ans',
        },
        {
          nom: 'CitésLab',
          type: 'Quartiers prioritaires (QPV)',
          site: 'https://www.citeslab.fr',
          badge: 'Si vous habitez un QPV',
        },
      ],
    });
  }

  // ----- Seniors (50-60 ou plus-60) : entraide bénévole d'anciens dirigeants
  if (age === 'plus-60' || age === '50-60') {
    groupes.push({
      cle: 'reseaux-seniors',
      titre: 'Réseaux seniors et entraide bénévole',
      couleur: 'bleu-fonce',
      icone: '🧓',
      cartes: [
        {
          nom: "EGEE · Entente des Générations pour l'Emploi",
          type: 'Anciens dirigeants bénévoles',
          telephone: '01 47 05 57 71',
          site: 'https://www.egee.asso.fr',
          badge: 'Conseil gratuit · présentiel',
        },
        {
          nom: 'ECTI · Experts retraités',
          type: 'Échanges et Consultations Techniques Internationaux',
          telephone: '01 53 41 80 80',
          site: 'https://www.ecti.org',
          badge: 'Mission de conseil',
        },
        {
          nom: 'AGIRabcd',
          type: 'Retraités bénévoles · accompagnement',
          site: 'https://www.agirabcd.org',
          badge: 'Délégations départementales',
        },
        {
          nom: 'Réseau Entreprendre Repreneurs',
          type: 'Cession et transmission',
          site: 'https://www.reseau-entreprendre.org',
          badge: 'Si vous envisagez de céder',
        },
      ],
    });
  }

  // ----- Handicap : toujours affiché (le questionnaire ne demande pas la RQTH)
  groupes.push({
    cle: 'reseaux-handicap',
    titre: 'Handicap et accessibilité',
    couleur: 'vert',
    icone: '♿',
    cartes: [
      {
        nom: 'AGEFIPH',
        type: 'Secteur privé · handicap au travail',
        telephone: '0 800 11 10 09',
        site: 'https://www.agefiph.fr',
        badge: 'Aides dirigeant et salariés',
      },
      {
        nom: 'Cap Emploi',
        type: 'Réseau spécialisé handicap',
        site: 'https://www.capemploi.com',
        badge: 'Accompagnement gratuit',
      },
      {
        nom: 'FIPHFP',
        type: 'Secteur public · handicap',
        site: 'https://www.fiphfp.fr',
        badge: 'Pour les agents publics',
      },
      {
        nom: 'MDPH',
        type: 'Maison Départementale des Personnes Handicapées',
        site: 'https://www.mdph.fr',
        badge: 'RQTH, AAH, PCH',
      },
    ],
  });

  // ----- Soutien psy public renforcé (si moral fragile)
  if (reponses.moral === 'perdu' || reponses.moral === 'epuise') {
    groupes.push({
      cle: 'reseaux-psy',
      titre: 'Soutien psychologique — dispositifs publics',
      couleur: 'rouge',
      icone: '💚',
      cartes: [
        {
          nom: 'CMP · Centre Médico-Psychologique',
          type: 'Suivi gratuit · par département',
          site: 'https://www.service-public.fr/particuliers/vosdroits/F12368',
          badge: 'Secteur public · sans avance',
        },
        {
          nom: 'CUMP · Cellule d\'Urgence Médico-Psychologique',
          type: 'Choc aigu · activation via SAMU',
          telephone: '15',
          site: 'https://www.santepubliquefrance.fr',
          badge: 'Pour situation de crise',
        },
        {
          nom: 'SAMU + Psy Centre 15',
          type: 'Urgence psychiatrique',
          telephone: '15',
          badge: '24h/24 · gratuit',
        },
        {
          nom: 'SOS Suicide Phénix',
          type: 'Écoute · prévention suicide',
          telephone: '01 40 44 46 45',
          site: 'https://www.sos-suicide-phenix.org',
          badge: 'Tous les jours · gratuit',
        },
        {
          nom: 'Suicide Écoute',
          type: 'Ligne d\'écoute · 24h/24',
          telephone: '01 45 39 40 00',
          site: 'https://suicide-ecoute.fr',
          badge: 'Bénévoles formés',
        },
        {
          nom: '3114 · Numéro national de prévention du suicide',
          type: 'Professionnels de santé',
          telephone: '3114',
          site: 'https://3114.fr',
          badge: '24h/24 · gratuit · confidentiel',
        },
        {
          nom: '3919 · Violences faites aux femmes',
          type: 'Si applicable · écoute et orientation',
          telephone: '3919',
          site: 'https://www.solidaritefemmes.org',
          badge: 'Anonyme · 24h/24',
        },
      ],
    });
  }

  // ----- Reprise après liquidation (toujours utile à connaître)
  groupes.push({
    cle: 'reseaux-rebond',
    titre: 'Rebond après liquidation',
    couleur: 'jaune',
    icone: '🔄',
    cartes: [
      {
        nom: '60 000 Rebonds',
        type: 'Accompagnement post-liquidation',
        site: 'https://www.60000rebonds.com',
        badge: 'Bénévoles · 2 ans de suivi',
      },
      {
        nom: 'Second Souffle',
        type: 'Entraide dirigeants en rebond',
        site: 'https://second-souffle.com',
        badge: 'Communauté + ateliers',
      },
      {
        nom: 'Re-Création',
        type: 'Rebond entrepreneurial',
        site: 'https://www.re-creation.org',
        badge: 'Accompagnement gratuit',
      },
    ],
  });

  // ----- Pêche : entraide sectorielle spécifique
  const secteur: Secteur | undefined = sector?.secteur;
  if (secteur === 'peche') {
    groupes.push({
      cle: 'reseaux-peche',
      titre: 'Entraide marins-pêcheurs',
      couleur: 'bleu-fonce',
      icone: '⚓',
      cartes: [
        {
          nom: 'Solidarité Marins',
          type: 'Société Nationale de Sauvetage en Mer · volet social',
          site: 'https://www.snsm.org',
          badge: 'Aide aux familles de marins',
        },
        {
          nom: 'Société de Secours des Marins (SSM)',
          type: 'Action sociale · ENIM',
          site: 'https://www.enim.eu',
          badge: 'Aides d\'urgence',
        },
      ],
    });
  }

  // ----- Vétérinaires (libéral / santé) : Vetos-Entraide
  if (secteur === 'liberal' || secteur === 'sante') {
    groupes.push({
      cle: 'reseaux-veto',
      titre: 'Entraide vétérinaires (si applicable)',
      couleur: 'violet',
      icone: '🐾',
      cartes: [
        {
          nom: 'Vetos-Entraide',
          type: 'Vétérinaires en difficulté · équivalent APESA',
          site: 'https://www.vetos-entraide.com',
          badge: 'Écoute par des confrères · gratuit',
        },
      ],
    });
  }

  return groupes;
}
