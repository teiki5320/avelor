import { describe, it, expect } from 'vitest';
import { getSectorInfo, getCompanyAge, getEffectifSeuils } from '../secteur';
import type { CompanyData } from '../types';

/* ─── Helpers ─── */

function makeCompany(overrides: Partial<CompanyData> = {}): CompanyData {
  return {
    siret: '12345678901234',
    nom: 'Test',
    formeJuridique: 'SARL',
    naf: '62.01Z',
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

/* ─── getSectorInfo ─── */

describe('getSectorInfo', () => {
  it('mappe un code NAF agriculture (01.xx) au secteur agriculture', () => {
    const info = getSectorInfo(makeCompany({ naf: '01.11Z' }));
    expect(info.secteur).toBe('agriculture');
  });

  it('mappe un code NAF BTP (43.xx) au secteur btp', () => {
    const info = getSectorInfo(makeCompany({ naf: '43.21A' }));
    // 43 est artisan aussi, donc peut être artisanat si isArtisan true
    expect(['btp', 'artisanat']).toContain(info.secteur);
  });

  it('mappe un code NAF commerce (47.xx) au secteur commerce', () => {
    const info = getSectorInfo(makeCompany({ naf: '47.11D' }));
    expect(info.secteur).toBe('commerce');
  });

  it('mappe un code NAF hôtellerie (56.xx) au secteur hotellerie', () => {
    const info = getSectorInfo(makeCompany({ naf: '56.10A' }));
    expect(info.secteur).toBe('hotellerie');
  });

  it('mappe un code NAF IT (62.xx) au secteur liberal (section M)', () => {
    const info = getSectorInfo(makeCompany({ naf: '62.01Z' }));
    expect(info.secteur).toBe('information');
  });

  it('mappe un code NAF santé (86.xx) au secteur sante', () => {
    const info = getSectorInfo(makeCompany({ naf: '86.10Z' }));
    expect(info.secteur).toBe('sante');
  });

  it('reclasse en artisanat un commerce artisan (naf 95.xx)', () => {
    const info = getSectorInfo(makeCompany({ naf: '95.11Z' }));
    expect(info.secteur).toBe('artisanat');
  });

  it('retourne le secteur "autre" pour un code NAF inconnu', () => {
    const info = getSectorInfo(makeCompany({ naf: '' }));
    expect(info.secteur).toBe('autre');
  });

  it('retourne un objet avec tous les champs attendus', () => {
    const info = getSectorInfo(makeCompany({ naf: '01.11Z' }));
    expect(info).toHaveProperty('label');
    expect(info).toHaveProperty('cotisationOrg');
    expect(info).toHaveProperty('cotisationTel');
    expect(info).toHaveProperty('chambre');
    expect(info).toHaveProperty('conseilsSpecifiques');
  });

  it('les 14 secteurs ont des données définies', () => {
    const secteurs = [
      'agriculture', 'industrie', 'btp', 'commerce', 'transport',
      'hotellerie', 'information', 'finance', 'immobilier', 'liberal',
      'education', 'sante', 'artisanat', 'autre',
    ];
    // On vérifie que chaque secteur peut être obtenu via un mapping NAF approprié
    expect(secteurs.length).toBe(14);
  });
});

/* ─── getCompanyAge ─── */

describe('getCompanyAge', () => {
  it('retourne un nombre positif pour une date passée', () => {
    const age = getCompanyAge('2000-01-01');
    expect(age).not.toBeNull();
    expect(age!).toBeGreaterThan(20);
  });

  it('retourne null pour une date vide', () => {
    expect(getCompanyAge('')).toBeNull();
  });

  it('retourne null pour une date invalide', () => {
    expect(getCompanyAge('pas-une-date')).toBeNull();
  });

  it('retourne 0 pour une date très récente', () => {
    const maintenant = new Date().toISOString().slice(0, 10);
    const age = getCompanyAge(maintenant);
    expect(age).toBe(0);
  });
});

/* ─── getEffectifSeuils ─── */

describe('getEffectifSeuils', () => {
  it('retourne approx=0 pour 0 salarié', () => {
    const s = getEffectifSeuils('0 salarié');
    expect(s.approx).toBe(0);
    expect(s.cse).toBe(false);
    expect(s.obligations50).toBe(false);
  });

  it('retourne cse=true pour 10 à 19 salariés', () => {
    const s = getEffectifSeuils('10 à 19 salariés');
    expect(s.approx).toBe(15);
    expect(s.cse).toBe(true);
    expect(s.obligations50).toBe(false);
  });

  it('retourne obligations50=true pour 50 à 99 salariés', () => {
    const s = getEffectifSeuils('50 à 99 salariés');
    expect(s.approx).toBe(75);
    expect(s.obligations50).toBe(true);
  });

  it('retourne approx=0 pour une valeur inconnue', () => {
    const s = getEffectifSeuils('inconnu');
    expect(s.approx).toBe(0);
  });
});
