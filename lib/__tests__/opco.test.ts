import { describe, it, expect } from 'vitest';
import { getOpcoFromNaf, OPCO_DATA } from '../opco';

describe('getOpcoFromNaf', () => {
  it('renvoie OCAPIAT pour l\'agriculture', () => {
    expect(getOpcoFromNaf('01.11Z').cle).toBe('ocapiat');
    expect(getOpcoFromNaf('03.11Z').cle).toBe('ocapiat');
  });

  it('renvoie Constructys pour le BTP', () => {
    expect(getOpcoFromNaf('41.20A').cle).toBe('opco-construction');
    expect(getOpcoFromNaf('43.91A').cle).toBe('opco-construction');
  });

  it('renvoie OPCO 2i pour l\'industrie', () => {
    expect(getOpcoFromNaf('13.10Z').cle).toBe('opco-2i');
    expect(getOpcoFromNaf('25.62A').cle).toBe('opco-2i');
  });

  it('renvoie OPCO Mobilités pour le transport', () => {
    expect(getOpcoFromNaf('49.32Z').cle).toBe('opco-mobilites'); // taxis/VTC
    expect(getOpcoFromNaf('45.20A').cle).toBe('opco-mobilites'); // garage auto
  });

  it('renvoie AKTO pour l\'HCR', () => {
    expect(getOpcoFromNaf('56.10A').cle).toBe('akto'); // restaurant
    expect(getOpcoFromNaf('55.20Z').cle).toBe('akto'); // hôtel
  });

  it('renvoie OPCO Santé pour la santé humaine', () => {
    expect(getOpcoFromNaf('86.10Z').cle).toBe('opco-sante');
    expect(getOpcoFromNaf('87.30A').cle).toBe('opco-sante');
  });

  it('renvoie ATLAS pour les services financiers', () => {
    expect(getOpcoFromNaf('64.19Z').cle).toBe('atlas'); // banque
    expect(getOpcoFromNaf('65.11Z').cle).toBe('atlas'); // assurance
  });

  it('renvoie AFDAS pour la culture/médias', () => {
    expect(getOpcoFromNaf('59.11A').cle).toBe('afdas'); // prod cinéma
    expect(getOpcoFromNaf('90.01Z').cle).toBe('afdas'); // arts spectacle
  });

  it('renvoie OPCO EP pour l\'artisanat de proximité', () => {
    expect(getOpcoFromNaf('96.02A').cle).toBe('opco-ep'); // coiffure
    expect(getOpcoFromNaf('95.21Z').cle).toBe('opco-ep'); // réparation
  });

  it('renvoie un OPCO valide même pour un NAF inconnu', () => {
    const opco = getOpcoFromNaf('99.99Z');
    expect(opco).toBeDefined();
    expect(opco.cle).toBe('autre');
  });

  it('tolère les codes NAF mal formattés', () => {
    expect(() => getOpcoFromNaf('')).not.toThrow();
    expect(() => getOpcoFromNaf('XX')).not.toThrow();
    expect(() => getOpcoFromNaf('4520')).not.toThrow();
  });

  it('expose OPCO_DATA avec les 12 OPCO', () => {
    const cles = Object.keys(OPCO_DATA);
    expect(cles).toHaveLength(12);
    expect(cles).toContain('akto');
    expect(cles).toContain('afdas');
    expect(cles).toContain('autre');
  });
});
