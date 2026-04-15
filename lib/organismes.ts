import data from '@/data/organismes.json';
import type { Reponses } from './types';

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
      telephone: dep.urssaf.telephone ?? '36 98',
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
      telephone: '36 98',
      site: 'https://www.secu-independants.fr',
      badge: 'Aides dédiées indépendants',
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
