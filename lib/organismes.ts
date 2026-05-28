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
