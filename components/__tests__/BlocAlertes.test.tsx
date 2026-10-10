// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BlocAlertes from '../fiche/BlocAlertes';
import { FicheProvider, type FicheContextType } from '@/lib/FicheContext';
import type { BodaccItem, CompanyData } from '@/lib/types';

function makeContext(
  bodacc: BodaccItem[],
  bodaccIndisponible: boolean,
): FicheContextType {
  const company: CompanyData = {
    siret: '12345678901234',
    nom: 'Test',
    formeJuridique: 'SARL',
    naf: '62.01Z',
    dateCreation: '2015-01-01',
    effectif: '',
    adresse: '',
    codePostal: '',
    ville: '',
    departement: '',
    fetched: true,
  };
  return {
    token: 'test-token',
    reponses: { situation: 'prevention', probleme: 'urssaf', effectif: 'independant', moral: 'combatif' },
    company,
    sector: {} as never,
    alertes: [],
    bodacc,
    infogreffe: [],
    bodaccIndisponible,
    groupes: [],
    companyAge: null,
    seuils: { approx: 0, cse: false, obligations50: false },
  };
}

describe('BlocAlertes', () => {
  it('ne dit pas « plutôt bon signe » quand le BODACC n’a pas répondu', () => {
    render(
      <FicheProvider value={makeContext([], true)}>
        <BlocAlertes />
      </FicheProvider>,
    );
    expect(screen.getByText('Vérification impossible pour le moment')).toBeInTheDocument();
    expect(screen.queryByText(/plutôt bon signe/)).not.toBeInTheDocument();
  });

  it('garde le message rassurant quand le BODACC a répondu sans annonce', () => {
    render(
      <FicheProvider value={makeContext([], false)}>
        <BlocAlertes />
      </FicheProvider>,
    );
    expect(screen.getByText(/plutôt bon signe/)).toBeInTheDocument();
  });

  it('affiche les annonces trouvées', () => {
    const annonce: BodaccItem = { type: 'Procédures collectives', date: '2026-01-10' };
    render(
      <FicheProvider value={makeContext([annonce], false)}>
        <BlocAlertes />
      </FicheProvider>,
    );
    expect(screen.getByText('1 signaux publics')).toBeInTheDocument();
  });
});
