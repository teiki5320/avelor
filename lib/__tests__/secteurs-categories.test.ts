import { describe, it, expect, test } from 'vitest';
import { getSectorInfo, type Secteur, type SectorInfo } from '../secteur';
import { getOpcoFromNaf, type Opco } from '../opco';
import type { CompanyData } from '../types';

/**
 * Test paramétré couvrant les 15 catégories de métiers d'Avelor.
 * Pour chaque secteur : un NAF représentatif + des assertions ciblées
 * sur les données métier (label, syndicats clés, soutien, ordres,
 * caisses retraite, OPCO compétent…).
 */

function makeCompany(naf: string, overrides: Partial<CompanyData> = {}): CompanyData {
  return {
    siret: '12345678901234',
    nom: 'Test',
    formeJuridique: 'SARL',
    naf,
    dateCreation: '2015-01-01',
    effectif: '0 salarié',
    adresse: '1 rue de la Paix',
    codePostal: '75001',
    ville: 'Paris',
    departement: '75',
    fetched: true,
    ...overrides,
  };
}

interface SecteurCase {
  cle: Secteur;
  naf: string;
  labelContient: RegExp;
  syndicatsAttendus: string[]; // sous-chaînes présentes dans .syndicats[*].nom
  cotisationOrg?: RegExp;
  soutienAttendu?: RegExp; // sous-chaîne dans .soutien.nom si présent
  ordresAttendus?: string[]; // sigles d'ordres pro requis
  caissesAttendues?: string[]; // sigles de caisses retraite requises
  opcoAttendu?: Opco | Opco[]; // opco(s) admissibles selon le NAF
  forme?: string;
}

const CAS: SecteurCase[] = [
  {
    cle: 'agriculture',
    naf: '01.11Z', // Céréales et oléagineux
    labelContient: /agricult/i,
    syndicatsAttendus: ['FNSEA', 'Jeunes Agriculteurs', 'Coordination Rurale'],
    cotisationOrg: /MSA/,
    soutienAttendu: /Agri.?Écoute/i,
    opcoAttendu: 'ocapiat',
  },
  {
    cle: 'peche',
    naf: '03.11Z', // Pêche en mer
    labelContient: /pêche/i,
    syndicatsAttendus: ['CNPMEM', 'Solidarité Marins', 'SNSM'],
    cotisationOrg: /ENIM/,
    soutienAttendu: /Solidarité Marins/i,
    caissesAttendues: ['ENIM'],
    opcoAttendu: 'ocapiat',
  },
  {
    cle: 'industrie',
    naf: '20.13B', // Fabrication d'autres produits chimiques inorganiques
    labelContient: /industrie/i,
    syndicatsAttendus: ['MEDEF', 'France Industrie'],
    opcoAttendu: 'opco-2i',
  },
  {
    cle: 'btp',
    naf: '41.20A', // Construction de maisons individuelles
    labelContient: /Bâtiment|BTP|Travaux/i,
    syndicatsAttendus: ['FFB', 'CAPEB', 'FNTP'],
    opcoAttendu: 'opco-construction',
  },
  {
    cle: 'commerce',
    naf: '47.11D', // Supermarchés
    labelContient: /commerce/i,
    syndicatsAttendus: ['CdCF', 'FCD', 'CGI'],
    opcoAttendu: 'opcommerce', // 47 → L'Opcommerce (OPCO du commerce)
  },
  {
    cle: 'transport',
    naf: '49.32Z', // Taxis/VTC
    labelContient: /transport/i,
    syndicatsAttendus: ['FNTR', 'OTRE', 'Mobilians'],
    opcoAttendu: 'opco-mobilites',
  },
  {
    cle: 'hotellerie',
    naf: '56.10A', // Restauration traditionnelle
    labelContient: /Hôtellerie|Restauration/i,
    syndicatsAttendus: ['UMIH', 'GNI', 'GHR'],
    opcoAttendu: 'akto',
  },
  {
    cle: 'information',
    naf: '62.01Z', // Programmation informatique
    labelContient: /Numérique|IT|information/i,
    syndicatsAttendus: ['Numeum', 'CINOV-IT', 'France Digitale'],
    opcoAttendu: ['akto', 'atlas'], // 62 → AKTO/ATLAS selon nos règles
  },
  {
    cle: 'finance',
    naf: '64.19Z', // Autres intermédiations monétaires
    labelContient: /Finance|Assurance/i,
    syndicatsAttendus: ['FBF', 'ASF', 'AFG'],
    opcoAttendu: 'atlas',
  },
  {
    cle: 'immobilier',
    naf: '68.31Z', // Agences immobilières
    labelContient: /immobilier/i,
    syndicatsAttendus: ['FNAIM', 'UNIS', 'FPI'],
    opcoAttendu: 'opco-ep',
  },
  {
    cle: 'liberal',
    naf: '69.10Z', // Activités juridiques
    labelContient: /libéral/i,
    syndicatsAttendus: ['UNAPL', 'CNB', 'OEC', 'AGEA'],
    caissesAttendues: ['CNBF', 'CRPCEN', 'CAVOM', 'CAVAMAC'],
    opcoAttendu: 'atlas',
  },
  {
    cle: 'education',
    naf: '85.59A', // Formation continue d'adultes
    labelContient: /Éducation|Formation/i,
    syndicatsAttendus: ['FFP', 'SYNOFDES', 'CINOV Formation'],
    opcoAttendu: 'uniformation',
  },
  {
    cle: 'sante',
    naf: '86.21Z', // Activité des médecins généralistes
    labelContient: /Santé/i,
    syndicatsAttendus: ['FHP', 'FEHAP', 'Vetos-Entraide'],
    soutienAttendu: /MOTS/i,
    ordresAttendus: ['CARMF'], // au moins l'ordre/caisse médecin présent
    caissesAttendues: ['CARMF', 'CARPV', 'CARPIMKO'],
    opcoAttendu: 'opco-sante',
  },
  {
    cle: 'artisanat',
    naf: '96.02A', // Coiffure
    labelContient: /Artisanat/i,
    syndicatsAttendus: ['CMA France', 'U2P', 'CAPEB', 'UNEC'],
    opcoAttendu: 'opco-ep',
  },
  {
    cle: 'autre',
    naf: '', // NAF vide → fallback "autre"
    labelContient: /Autre/i,
    syndicatsAttendus: [],
    opcoAttendu: 'autre',
  },
];

describe('Catégories de métiers : couverture complète des 15 secteurs', () => {
  // Sanity check : on couvre bien les 15 secteurs définis
  it('couvre exactement les 15 secteurs définis par lib/secteur.ts', () => {
    const cles = new Set(CAS.map((c) => c.cle));
    const attendus: Secteur[] = [
      'agriculture', 'peche', 'industrie', 'btp', 'commerce', 'transport',
      'hotellerie', 'information', 'finance', 'immobilier', 'liberal',
      'education', 'sante', 'artisanat', 'autre',
    ];
    expect(cles.size).toBe(15);
    for (const s of attendus) expect(cles.has(s)).toBe(true);
  });

  // Test paramétré : 1 test par secteur avec assertions ciblées
  test.each(CAS)('Secteur "$cle" (NAF $naf)', (c) => {
    const info: SectorInfo = getSectorInfo(makeCompany(c.naf, c.forme ? { formeJuridique: c.forme } : {}));

    // 1. Le NAF est mappé au bon secteur
    expect(info.secteur).toBe(c.cle);

    // 2. Le label est défini et cohérent
    expect(info.label).toBeTruthy();
    expect(info.label).toMatch(c.labelContient);

    // 3. Les syndicats clés attendus sont présents (sauf "autre")
    const nomsSyndicats = info.syndicats.map((s) => s.nom).join(' | ');
    for (const sigle of c.syndicatsAttendus) {
      expect(nomsSyndicats, `${c.cle} attend "${sigle}" parmi: ${nomsSyndicats}`).toContain(sigle);
    }

    // 4. L'organisme de cotisation est correct quand spécifique
    if (c.cotisationOrg) {
      expect(info.cotisationOrg).toMatch(c.cotisationOrg);
    } else {
      // Par défaut : URSSAF
      expect(info.cotisationOrg).toMatch(/URSSAF/);
    }

    // 5. Le soutien sectoriel spécifique est présent si attendu
    if (c.soutienAttendu) {
      expect(info.soutien?.nom ?? '').toMatch(c.soutienAttendu);
    }

    // 6. Les caisses de retraite spécifiques sont présentes
    if (c.caissesAttendues && c.caissesAttendues.length > 0) {
      const caisses = (info.caissesRetraite ?? []).map((k) => k.caisse).join(' | ');
      for (const sig of c.caissesAttendues) {
        expect(caisses, `${c.cle} attend caisse "${sig}" parmi: ${caisses}`).toContain(sig);
      }
    }

    // 7. Les ordres pro / caisses incluent les sigles attendus
    if (c.ordresAttendus && c.ordresAttendus.length > 0) {
      const tout = [
        ...(info.ordresProfessionnels ?? []).map((o) => o.nom),
        ...(info.caissesRetraite ?? []).map((k) => k.caisse),
      ].join(' | ');
      for (const sig of c.ordresAttendus) {
        expect(tout, `${c.cle} attend ordre/caisse "${sig}" parmi: ${tout}`).toContain(sig);
      }
    }

    // 8. La chambre consulaire est définie (CCI / CMA / CA)
    expect(['CCI', 'CMA', 'CA']).toContain(info.chambre);

    // 9. Au moins un conseil spécifique est défini (sauf "autre")
    if (c.cle !== 'autre') {
      expect(info.conseilsSpecifiques.length).toBeGreaterThan(0);
    }

    // 10. Le CSP est systématiquement présent dans les obligations licenciement
    expect(
      (info.obligationsLicenciement ?? []).some((o) => o.sigle === 'CSP'),
      `${c.cle} doit avoir le CSP injecté`,
    ).toBe(true);

    // 11. L'OPCO mappé via le NAF est cohérent (sauf "autre" qui peut tomber dans "autre")
    if (c.naf) {
      const opco = getOpcoFromNaf(c.naf);
      const attendus = Array.isArray(c.opcoAttendu) ? c.opcoAttendu : c.opcoAttendu ? [c.opcoAttendu] : [];
      if (attendus.length > 0) {
        expect(attendus, `${c.cle} (NAF ${c.naf}) → OPCO=${opco.cle}, attendu ∈ ${JSON.stringify(attendus)}`)
          .toContain(opco.cle);
      }
    }
  });
});

describe('Catégories de métiers : règles spéciales de classement', () => {
  it('NAF 03.xx force le secteur "peche" même si on est en section A (agriculture)', () => {
    expect(getSectorInfo(makeCompany('03.11Z')).secteur).toBe('peche');
    expect(getSectorInfo(makeCompany('03.22Z')).secteur).toBe('peche');
  });

  it('NAF 95.xx / 96.xx (services aux ménages) classe en artisanat', () => {
    expect(getSectorInfo(makeCompany('95.11Z')).secteur).toBe('artisanat');
    expect(getSectorInfo(makeCompany('96.02A')).secteur).toBe('artisanat');
  });

  it('Forme juridique "artisan" reclasse industrie/commerce en artisanat', () => {
    // NAF 47.xx (commerce) avec forme contenant "artisan" → artisanat
    const info = getSectorInfo(makeCompany('47.78Z', { formeJuridique: 'EI artisan' }));
    expect(info.secteur).toBe('artisanat');
  });

  it('"autre" est retourné pour un NAF vide ou inconnu', () => {
    expect(getSectorInfo(makeCompany('')).secteur).toBe('autre');
    expect(getSectorInfo(makeCompany('99.99Z')).secteur).toBe('autre');
  });
});
