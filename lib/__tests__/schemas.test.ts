import { describe, it, expect } from 'vitest';
import {
  fichePayloadSchema,
  sendLinkPayloadSchema,
  rappelPayloadSchema,
  estDateIsoValide,
  estDateRappelAcceptable,
} from '../schemas';

/* ─── fichePayloadSchema ─── */

describe('fichePayloadSchema', () => {
  const payloadValide = {
    siret: '12345678901234',
    reponses: {
      situation: 'prevention',
      probleme: 'urssaf',
      effectif: 'independant',
      moral: 'combatif',
    },
  };

  it('accepte un payload valide complet', () => {
    const result = fichePayloadSchema.safeParse(payloadValide);
    expect(result.success).toBe(true);
  });

  it('accepte un payload avec tous les champs optionnels', () => {
    const result = fichePayloadSchema.safeParse({
      siret: '98765432101234',
      reponses: {
        situation: 'redressement',
        probleme: 'banque',
        effectif: 'salaries',
        effectifDetail: '10 à 19 salariés',
        moral: 'epuise',
        caution: 'oui',
        regime: 'communaute',
        patrimoine: 'proprietaire',
        vente: 'peut-etre',
      },
    });
    expect(result.success).toBe(true);
  });

  it('accepte les nouveaux champs (PGE, RQTH, conjoint, co-gérants, saisonnalité)', () => {
    const result = fichePayloadSchema.safeParse({
      siret: '12345678901234',
      reponses: {
        situation: 'tresorie',
        probleme: 'banque',
        effectif: 'salaries',
        moral: 'combatif',
        pgeEnCours: 'oui',
        rqth: 'non',
        conjointStatut: 'collaborateur',
        coGerants: 'non',
        saisonnalite: 'oui',
      },
    });
    expect(result.success).toBe(true);
  });

  it('accepte le champ nationalité', () => {
    const result = fichePayloadSchema.safeParse({
      siret: '12345678901234',
      reponses: {
        situation: 'tresorie',
        probleme: 'banque',
        effectif: 'salaries',
        moral: 'combatif',
        nationalite: 'hors-ue',
      },
    });
    expect(result.success).toBe(true);
  });

  it('rejette une nationalité invalide', () => {
    const result = fichePayloadSchema.safeParse({
      siret: '12345678901234',
      reponses: {
        situation: 'prevention',
        probleme: 'urssaf',
        effectif: 'independant',
        moral: 'combatif',
        nationalite: 'apatride',
      },
    });
    expect(result.success).toBe(false);
  });

  it('rejette une valeur invalide sur conjointStatut', () => {
    const result = fichePayloadSchema.safeParse({
      siret: '12345678901234',
      reponses: {
        situation: 'prevention',
        probleme: 'urssaf',
        effectif: 'independant',
        moral: 'combatif',
        conjointStatut: 'inconnu',
      },
    });
    expect(result.success).toBe(false);
  });

  it('rejette un SIRET avec moins de 14 chiffres', () => {
    const result = fichePayloadSchema.safeParse({
      ...payloadValide,
      siret: '1234567890',
    });
    expect(result.success).toBe(false);
  });

  it('rejette un SIRET avec des lettres', () => {
    const result = fichePayloadSchema.safeParse({
      ...payloadValide,
      siret: '1234567890ABCD',
    });
    expect(result.success).toBe(false);
  });

  it('rejette un SIRET trop long', () => {
    const result = fichePayloadSchema.safeParse({
      ...payloadValide,
      siret: '123456789012345',
    });
    expect(result.success).toBe(false);
  });

  it('rejette quand les champs requis de reponses sont manquants', () => {
    const result = fichePayloadSchema.safeParse({
      siret: '12345678901234',
      reponses: {
        probleme: 'urssaf',
      },
    });
    expect(result.success).toBe(false);
  });

  it('rejette une valeur de situation invalide', () => {
    const result = fichePayloadSchema.safeParse({
      siret: '12345678901234',
      reponses: {
        situation: 'inconnu',
        probleme: 'urssaf',
        effectif: 'independant',
        moral: 'combatif',
      },
    });
    expect(result.success).toBe(false);
  });

  it('rejette des champs inconnus dans reponses (strict)', () => {
    const result = fichePayloadSchema.safeParse({
      siret: '12345678901234',
      reponses: {
        situation: 'prevention',
        probleme: 'urssaf',
        effectif: 'independant',
        moral: 'combatif',
        custom: 'value',
      },
    });
    expect(result.success).toBe(false);
  });

  it('rejette un champ inconnu à la racine du payload', () => {
    const result = fichePayloadSchema.safeParse({ ...payloadValide, pirate: 'x'.repeat(10_000) });
    expect(result.success).toBe(false);
  });

  it('rejette un effectifDetail de plus de 100 caractères', () => {
    const result = fichePayloadSchema.safeParse({
      siret: '12345678901234',
      reponses: { ...payloadValide.reponses, effectifDetail: 'x'.repeat(101) },
    });
    expect(result.success).toBe(false);
  });

  it('rejette une valeur libre sur caution / regime / patrimoine / vente', () => {
    for (const champ of ['caution', 'regime', 'patrimoine', 'vente']) {
      const result = fichePayloadSchema.safeParse({
        siret: '12345678901234',
        reponses: { ...payloadValide.reponses, [champ]: 'n’importe quoi' },
      });
      expect(result.success, champ).toBe(false);
    }
  });

  it('accepte toutes les réponses possibles du questionnaire complet', () => {
    const result = fichePayloadSchema.safeParse({
      siret: '12345678901234',
      reponses: {
        situation: 'assignation',
        probleme: 'impots',
        effectif: 'salaries',
        effectifDetail: 'Oui, 5 ou plus',
        moral: 'perdu',
        caution: 'ne-sais-pas',
        regime: 'non-marie',
        patrimoine: 'locataire',
        vente: 'non',
        montantDettes: 'plus-1m',
        ageDirigeant: 'plus-60',
        franchise: 'oui',
        antecedents: 'ne-sais-pas',
        pgeEnCours: 'ne-sais-pas',
        rqth: 'oui',
        conjointStatut: 'sans-conjoint',
        coGerants: 'sans-objet',
        saisonnalite: 'non',
        nationalite: 'sans-reponse',
      },
    });
    expect(result.success).toBe(true);
  });

  it('rejette quand reponses est absent', () => {
    const result = fichePayloadSchema.safeParse({
      siret: '12345678901234',
    });
    expect(result.success).toBe(false);
  });
});

/* ─── sendLinkPayloadSchema ─── */

describe('sendLinkPayloadSchema', () => {
  it('accepte un payload valide', () => {
    const result = sendLinkPayloadSchema.safeParse({
      token: 'abcdefghij1234567890',
      email: 'test@example.com',
    });
    expect(result.success).toBe(true);
  });

  it('rejette un email invalide', () => {
    const result = sendLinkPayloadSchema.safeParse({
      token: 'abcdefghij1234567890',
      email: 'pas-un-email',
    });
    expect(result.success).toBe(false);
  });

  it('rejette un token trop court', () => {
    const result = sendLinkPayloadSchema.safeParse({
      token: 'abc',
      email: 'test@example.com',
    });
    expect(result.success).toBe(false);
  });

  it('rejette quand email est absent', () => {
    const result = sendLinkPayloadSchema.safeParse({
      token: 'abcdefghij1234567890',
    });
    expect(result.success).toBe(false);
  });
});

/* ─── dates de rappel ─── */

describe('estDateIsoValide', () => {
  it('accepte une vraie date', () => {
    expect(estDateIsoValide('2026-02-28')).toBe(true);
    expect(estDateIsoValide('2028-02-29')).toBe(true);
  });

  it('refuse les dates qui n’existent pas ou mal formées', () => {
    expect(estDateIsoValide('2026-99-99')).toBe(false);
    expect(estDateIsoValide('2026-02-30')).toBe(false);
    expect(estDateIsoValide('2027-02-29')).toBe(false);
    expect(estDateIsoValide('26-01-01')).toBe(false);
    expect(estDateIsoValide('2026-1-1')).toBe(false);
  });
});

describe('estDateRappelAcceptable', () => {
  const maintenant = new Date('2026-10-10T12:00:00Z');

  it('accepte aujourd’hui et une date proche', () => {
    expect(estDateRappelAcceptable('2026-10-10', maintenant)).toBe(true);
    expect(estDateRappelAcceptable('2027-03-01', maintenant)).toBe(true);
  });

  it('refuse une date passée', () => {
    expect(estDateRappelAcceptable('2026-10-09', maintenant)).toBe(false);
  });

  it('refuse une date à plus de 2 ans', () => {
    expect(estDateRappelAcceptable('2029-01-01', maintenant)).toBe(false);
  });
});

/* ─── rappelPayloadSchema ─── */

describe('rappelPayloadSchema', () => {
  function dansNJours(n: number): string {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
  }

  const valide = {
    token: 'abcdefghij1234567890',
    echeance: dansNJours(30),
    dateRappel: dansNJours(20),
    libelle: 'Déclaration de cessation des paiements',
  };

  it('accepte un rappel valide sans email (adresse de la fiche utilisée)', () => {
    expect(rappelPayloadSchema.safeParse(valide).success).toBe(true);
  });

  it('refuse une date impossible', () => {
    expect(rappelPayloadSchema.safeParse({ ...valide, dateRappel: '2026-99-99' }).success).toBe(false);
  });

  it('refuse une date passée ou trop lointaine', () => {
    expect(rappelPayloadSchema.safeParse({ ...valide, dateRappel: dansNJours(-1) }).success).toBe(false);
    expect(rappelPayloadSchema.safeParse({ ...valide, echeance: dansNJours(800) }).success).toBe(false);
  });

  it('refuse un libellé de plus de 80 caractères', () => {
    expect(rappelPayloadSchema.safeParse({ ...valide, libelle: 'x'.repeat(81) }).success).toBe(false);
  });

  it('refuse un champ inconnu', () => {
    expect(rappelPayloadSchema.safeParse({ ...valide, html: '<a>' }).success).toBe(false);
  });
});
