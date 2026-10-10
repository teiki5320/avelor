import { describe, it, expect } from 'vitest';
import { lireCookieFicheLocale, lireParametreD, validerFicheLocale } from '../ficheLocaleServeur';

const reponses = { situation: 'prevention', probleme: 'urssaf', effectif: 'independant', moral: 'combatif' };

describe('validerFicheLocale', () => {
  it('accepte des données valides et nettoie le SIRET', () => {
    expect(validerFicheLocale({ siret: '123 456 789 01234', reponses })).toEqual({
      siret: '12345678901234',
      reponses,
    });
  });

  it('refuse des réponses hors schéma', () => {
    expect(validerFicheLocale({ siret: '12345678901234', reponses: { ...reponses, moral: 'inconnu' } })).toBeNull();
    expect(validerFicheLocale({ siret: '12345678901234', reponses: { ...reponses, script: '<x>' } })).toBeNull();
    expect(validerFicheLocale({ siret: '123', reponses })).toBeNull();
    expect(validerFicheLocale(null)).toBeNull();
  });
});

describe('lireCookieFicheLocale', () => {
  it('lit la valeur encodée posée par le navigateur', () => {
    const valeur = encodeURIComponent(JSON.stringify({ siret: '12345678901234', reponses }));
    expect(lireCookieFicheLocale(valeur)?.siret).toBe('12345678901234');
  });

  it('renvoie null pour une valeur absente ou corrompue', () => {
    expect(lireCookieFicheLocale(undefined)).toBeNull();
    expect(lireCookieFicheLocale('%E0%A4%A')).toBeNull();
    expect(lireCookieFicheLocale('pas-du-json')).toBeNull();
  });
});

describe('lireParametreD (anciens liens ?d=)', () => {
  it('reste compatible avec le base64 des anciens liens', () => {
    const d = Buffer.from(JSON.stringify({ siret: '12345678901234', reponses })).toString('base64');
    expect(lireParametreD(d)?.reponses.situation).toBe('prevention');
  });

  it('tolère un « + » relu comme une espace', () => {
    const d = Buffer.from(JSON.stringify({ siret: '12345678901234', reponses: { ...reponses, effectifDetail: '>>>?' } })).toString('base64');
    expect(d).toContain('+');
    expect(lireParametreD(d.replace(/\+/g, ' '))?.siret).toBe('12345678901234');
  });

  it('valide les réponses avec le schéma', () => {
    const d = Buffer.from(JSON.stringify({ siret: '12345678901234', reponses: { situation: 'x' } })).toString('base64');
    expect(lireParametreD(d)).toBeNull();
  });
});
