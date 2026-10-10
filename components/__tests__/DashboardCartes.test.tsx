// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import IdentiteHero from '../fiche/dashboard/IdentiteHero';
import PriorityCard from '../fiche/dashboard/PriorityCard';
import { FicheProvider, type FicheContextType } from '@/lib/FicheContext';
import type { CompanyData } from '@/lib/types';

function makeContext(overrides: Partial<CompanyData>): FicheContextType {
  return {
    token: 'test-token',
    reponses: { situation: 'prevention', probleme: 'urssaf', effectif: 'independant', moral: 'combatif' },
    company: {
      siret: '12345678901234',
      nom: 'Test',
      formeJuridique: '',
      naf: '',
      dateCreation: '',
      effectif: '',
      adresse: '',
      codePostal: '',
      ville: '',
      departement: '',
      fetched: true,
      ...overrides,
    },
    sector: {} as never,
    alertes: [],
    bodacc: [],
    infogreffe: [],
    groupes: [],
    companyAge: null,
    seuils: { approx: 0, cse: false, obligations50: false },
  };
}

describe('IdentiteHero', () => {
  it('n’affiche pas « Dép. » seul quand ville et département sont vides', () => {
    render(
      <FicheProvider value={makeContext({ codePostal: '75001' })}>
        <IdentiteHero />
      </FicheProvider>,
    );
    expect(screen.getByText('75001')).toBeInTheDocument();
    expect(screen.queryByText(/Dép\./)).not.toBeInTheDocument();
  });

  it('affiche le département quand la ville manque', () => {
    render(
      <FicheProvider value={makeContext({ codePostal: '69001', departement: '69' })}>
        <IdentiteHero />
      </FicheProvider>,
    );
    expect(screen.getByText('69001 Dép. 69')).toBeInTheDocument();
  });
});

describe('PriorityCard', () => {
  const props = {
    id: 'test',
    icone: '⚡',
    label: 'Label',
    valeur: 'Valeur',
    detail: 'Détail',
    tone: 'rouge' as const,
    expandedContent: <p>Contenu</p>,
    onToggle: () => {},
  };

  it('fermée : pas d’aria-controls vers un panneau absent', () => {
    render(<PriorityCard {...props} isOpen={false} />);
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-controls');
  });

  it('ouverte : aria-controls vise le panneau rendu', () => {
    const { container } = render(<PriorityCard {...props} isOpen />);
    const cible = screen.getByRole('button').getAttribute('aria-controls');
    expect(cible).toBe('panel-test');
    expect(container.querySelector(`#${cible}`)).not.toBeNull();
  });
});
