// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProgressTracker, { sectionsAffichees } from '../fiche/ProgressTracker';
import { FicheProvider, type FicheContextType } from '@/lib/FicheContext';
import type { CompanyData } from '@/lib/types';

function makeContext(siret: string, token = 'local'): FicheContextType {
  const company: CompanyData = {
    siret,
    nom: 'Test',
    formeJuridique: 'SARL',
    naf: '62.01Z',
    dateCreation: '2015-01-01',
    effectif: '0 salarié',
    adresse: '',
    codePostal: '75001',
    ville: 'Paris',
    departement: '75',
    fetched: true,
  };
  return {
    token,
    reponses: { situation: 'prevention', probleme: 'urssaf', effectif: 'independant', moral: 'combatif' },
    company,
    sector: {} as never,
    alertes: [],
    bodacc: [],
    infogreffe: [],
    groupes: [],
    companyAge: null,
    seuils: { approx: 0, cse: false, obligations50: false },
  };
}

/** Fiche minimale : 3 blocs affichés, 1 bloc non pertinent (conteneur vide). */
function Fiche({ siret, token = 'local' }: { siret: string; token?: string }) {
  return (
    <FicheProvider value={makeContext(siret, token)}>
      <ProgressTracker token={token} />
      <div data-section="plan-action"><button type="button">Plan</button></div>
      <div data-section="strategie"><button type="button">Stratégie</button></div>
      <div data-section="aides"><button type="button">Aides</button></div>
      <div data-section="pge"></div>
    </FicheProvider>
  );
}

beforeEach(() => {
  localStorage.clear();
});

describe('sectionsAffichees', () => {
  it('ignore les conteneurs vides (bloc non affiché)', () => {
    document.body.innerHTML =
      '<div data-section="a"><p>x</p></div><div data-section="b"></div><div data-section="c"><span></span></div>';
    expect(sectionsAffichees(document)).toEqual(['a', 'c']);
    document.body.innerHTML = '';
  });
});

describe('ProgressTracker', () => {
  it('calcule le total sur les blocs réellement affichés (100 % atteignable)', async () => {
    render(<Fiche siret="11111111100011" />);
    fireEvent.click(screen.getByRole('button', { name: 'Plan' }));
    await screen.findByText(/blocs sur 3/);
    expect(screen.getByText('33 %')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Stratégie' }));
    fireEvent.click(screen.getByRole('button', { name: 'Aides' }));
    await screen.findByText('100 %');
    expect(screen.getByText(/parcouru toutes les sections/)).toBeInTheDocument();
  });

  it('enregistre la progression par SIRET (deux fiches « local » ne se mélangent plus)', async () => {
    const { unmount } = render(<Fiche siret="11111111100011" />);
    fireEvent.click(screen.getByRole('button', { name: 'Plan' }));
    await waitFor(() =>
      expect(localStorage.getItem('solelis_progress_11111111100011')).toBe(JSON.stringify(['plan-action'])),
    );
    unmount();

    render(<Fiche siret="22222222200022" />);
    // Aucune progression pour la seconde entreprise
    await waitFor(() => expect(localStorage.getItem('solelis_progress_22222222200022')).toBe('[]'));
    expect(screen.queryByText(/blocs sur/)).toBeNull();
    expect(localStorage.getItem('solelis_progress_local')).toBeNull();
  });

  it('reprend la progression enregistrée sous l\'ancienne clé par token', async () => {
    localStorage.setItem('solelis_progress_tok123', JSON.stringify(['strategie']));
    render(<Fiche siret="33333333300033" token="tok123" />);
    await screen.findByText(/blocs sur 3/);
    expect(localStorage.getItem('solelis_progress_33333333300033')).toBe(JSON.stringify(['strategie']));
  });
});
