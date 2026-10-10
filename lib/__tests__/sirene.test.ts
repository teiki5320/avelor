import { describe, it, expect } from 'vitest';
import { formatForme } from '../sirene';
import { getJuridiction, getFormeDetail } from '../strategie';
import type { CompanyData } from '../types';

function company(formeJuridique: string, naf = '47.11Z'): CompanyData {
  return {
    siret: '12345678900012',
    nom: 'Test',
    formeJuridique,
    naf,
    dateCreation: '2015-01-01',
    effectif: '0 salarié',
    adresse: '',
    codePostal: '75001',
    ville: 'Paris',
    departement: '75',
    fetched: true,
  };
}

/* ─── Catégories juridiques INSEE ─── */

describe('formatForme (catégories juridiques INSEE)', () => {
  it('libelle correctement les codes courants (nomenclature INSEE niveau III)', () => {
    expect(formatForme('1000')).toBe('Entrepreneur individuel');
    expect(formatForme('5499')).toBe('SARL'); // et non SAS
    expect(formatForme('5710')).toBe('SAS / SASU');
    expect(formatForme('5202')).toBe('Société en nom collectif (SNC)');
    expect(formatForme('5307')).toBe('Société en commandite simple coopérative'); // et non SNC
    expect(formatForme('5585')).toContain('SELAFA'); // et non SCP
    expect(formatForme('5485')).toContain('SELARL');
    expect(formatForme('6540')).toBe('Société civile immobilière (SCI)');
    expect(formatForme('6598')).toContain('EARL');
    expect(formatForme('9220')).toBe('Association déclarée');
  });

  it('se replie sur la catégorie de niveau II (2 premiers chiffres)', () => {
    expect(formatForme('5460')).toBe('SARL');
    expect(formatForme('5599')).toBe('Société anonyme (SA)');
    expect(formatForme('5699')).toBe('Société anonyme (SA)');
    expect(formatForme('6599')).toBe('Société civile');
    expect(formatForme('6539')).toBe('Société civile');
    expect(formatForme('9260')).toBe('Association');
    expect(formatForme('9900')).toBe('Autre personne morale de droit privé');
  });

  it('reconnaît les SCP (6561 à 6578)', () => {
    expect(formatForme('6561')).toBe('Société civile professionnelle (SCP)');
    expect(formatForme('6571')).toBe('Société civile professionnelle (SCP)');
  });

  it('gère les codes absents ou inconnus', () => {
    expect(formatForme(undefined)).toBe('Non renseignée');
    expect(formatForme('')).toBe('Non renseignée');
    expect(formatForme('0000')).toBe('Catégorie juridique 0000');
  });

  it('aucune forme sociétaire ou associative n\'est classée comme EI', () => {
    for (const code of ['5202', '5306', '5499', '5485', '5599', '5710', '5785', '5800', '6220', '6540', '6585', '6598', '9220', '9224', '9300']) {
      expect(getFormeDetail(formatForme(code))).toBe('societe');
    }
    expect(getFormeDetail(formatForme('1000'))).toBe('ei');
  });
});

/* ─── Impact sur la juridiction compétente (TC / TJ) ─── */

describe('getJuridiction selon la catégorie juridique INSEE', () => {
  it('sociétés commerciales par la forme → tribunal de commerce, même en NAF libéral', () => {
    for (const code of ['5202', '5306', '5308', '5499', '5599', '5699', '5710', '5800']) {
      expect(getJuridiction(company(formatForme(code), '70.22Z'))).toBe('TC');
    }
  });

  it('5499 (SARL) reste au TC — l\'ancien libellé « SAS » aussi, mais « SA » seul n\'était pas reconnu', () => {
    expect(getJuridiction(company('SA', '70.22Z'))).toBe('TC');
  });

  it('sociétés civiles, agricoles, associations, fondations → tribunal judiciaire', () => {
    for (const code of ['6540', '6585', '6589', '6597', '6598', '6533', '6317', '6316', '6599', '9220', '9260', '9300', '9100']) {
      expect(getJuridiction(company(formatForme(code), '47.11Z'))).toBe('TJ');
    }
  });

  it('SEL (exercice libéral) → tribunal de commerce (choix existant du moteur)', () => {
    for (const code of ['5385', '5485', '5585', '5685', '5785']) {
      expect(getJuridiction(company(formatForme(code), '69.10Z'))).toBe('TC');
    }
  });

  it('entrepreneur individuel → selon le NAF', () => {
    expect(getJuridiction(company(formatForme('1000'), '69.10Z'))).toBe('TJ');
    expect(getJuridiction(company(formatForme('1000'), '01.11Z'))).toBe('TJ');
    expect(getJuridiction(company(formatForme('1000'), '47.11Z'))).toBe('TC');
  });
});
