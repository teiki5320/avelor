import { describe, it, expect } from 'vitest';
import { caisseFromNaf } from '../fiche/BlocSoutien';
import { getSectorInfo } from '@/lib/secteur';
import type { CompanyData } from '@/lib/types';

function caissesPour(naf: string) {
  const company: CompanyData = {
    siret: '12345678901234',
    nom: 'Test',
    formeJuridique: 'SARL',
    naf,
    dateCreation: '',
    effectif: '',
    adresse: '',
    codePostal: '',
    ville: '',
    departement: '',
    fetched: true,
  };
  return getSectorInfo(company).caissesRetraite;
}

const caisse = (naf: string) => caisseFromNaf(naf, caissesPour(naf))?.caisse ?? null;

describe('caisseFromNaf', () => {
  it('ne devine pas la caisse des activités juridiques (avocat, notaire, commissaire de justice)', () => {
    expect(caisse('69.10Z')).toBeNull();
  });

  it('expert-comptable → CAVEC, architecte → CIPAV', () => {
    expect(caisse('69.20Z')).toBe('CAVEC');
    expect(caisse('71.11Z')).toBe('CIPAV');
  });

  it('conseil (70) et activités spécialisées (74) : plus de « CIPAV par défaut »', () => {
    expect(caisse('70.22Z')).toBeNull();
    expect(caisse('74.90B')).toBeNull();
    expect(caisse('74.10Z')).toBeNull();
  });

  it('santé : médecin, dentiste, vétérinaire', () => {
    expect(caisse('86.21Z')).toBe('CARMF');
    expect(caisse('86.23Z')).toBe('CARCDSF');
    expect(caisse('75.00Z')).toBe('CARPV');
  });
});
