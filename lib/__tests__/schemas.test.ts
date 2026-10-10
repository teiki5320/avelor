import { describe, it, expect } from 'vitest';
import { fichePayloadSchema, sendLinkPayloadSchema } from '../schemas';

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

  it('accepte des champs supplémentaires dans reponses (passthrough)', () => {
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
