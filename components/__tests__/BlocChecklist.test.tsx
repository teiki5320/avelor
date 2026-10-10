// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BlocChecklist from '../fiche/BlocChecklist';
import { FicheProvider, type FicheContextType } from '@/lib/FicheContext';
import { getSectorInfo } from '@/lib/secteur';
import type { CompanyData } from '@/lib/types';

function makeContext(naf: string): FicheContextType {
  const company: CompanyData = {
    siret: '12345678901234',
    nom: 'Test',
    formeJuridique: 'SARL',
    naf,
    dateCreation: '2015-01-01',
    effectif: '',
    adresse: '',
    codePostal: '',
    ville: 'Lyon',
    departement: '69',
    fetched: true,
  };
  return {
    token: 'test-token',
    reponses: { situation: 'prevention', probleme: 'urssaf', effectif: 'independant', moral: 'combatif' },
    company,
    sector: getSectorInfo(company),
    alertes: [],
    bodacc: [],
    infogreffe: [],
    groupes: [],
    companyAge: null,
    seuils: { approx: 0, cse: false, obligations50: false },
  };
}

function rendre(naf = '49.41A') {
  return render(
    <FicheProvider value={makeContext(naf)}>
      <BlocChecklist defaultOpen />
    </FicheProvider>,
  );
}

describe('BlocChecklist', () => {
  it('aucun lien imbriqué dans un bouton (HTML valide)', () => {
    const { container } = rendre();
    expect(container.querySelectorAll('button a')).toHaveLength(0);
    expect(container.querySelectorAll('label a').length).toBeGreaterThan(0);
  });

  it('pas de doublon « APESA, APESA »', () => {
    rendre();
    expect(screen.getByText(/Prendre soin de vous \(APESA\)/)).toBeInTheDocument();
    expect(screen.queryByText(/APESA, APESA/)).not.toBeInTheDocument();
  });

  it('cocher une ligne met à jour le compteur', () => {
    rendre();
    const cases = screen.getAllByRole('checkbox');
    expect(cases[0]).not.toBeChecked();
    fireEvent.click(cases[0]);
    expect(cases[0]).toBeChecked();
    expect(screen.getByText(/^1 \//)).toBeInTheDocument();
  });
});
