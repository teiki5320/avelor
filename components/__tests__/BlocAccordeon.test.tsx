// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BlocAccordeon from '../fiche/BlocAccordeon';

describe('BlocAccordeon', () => {
  it('rend le titre et le sous-titre', () => {
    render(
      <BlocAccordeon icone="🔧" titre="Mon titre" soustitre="Mon sous-titre">
        <p>Contenu</p>
      </BlocAccordeon>
    );
    expect(screen.getByText('Mon titre')).toBeInTheDocument();
    expect(screen.getByText('Mon sous-titre')).toBeInTheDocument();
  });

  it('démarre fermé par défaut', () => {
    render(
      <BlocAccordeon icone="🔧" titre="Test">
        <p data-testid="content">Contenu caché</p>
      </BlocAccordeon>
    );
    const button = screen.getByRole('button', { name: /Test/ });
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('s\'ouvre quand on clique sur le header', () => {
    render(
      <BlocAccordeon icone="🔧" titre="Test">
        <p>Contenu</p>
      </BlocAccordeon>
    );
    const button = screen.getByRole('button', { name: /Test/ });
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('s\'ouvre par défaut si defaultOpen', () => {
    render(
      <BlocAccordeon icone="🔧" titre="Test" defaultOpen>
        <p>Contenu</p>
      </BlocAccordeon>
    );
    const button = screen.getByRole('button', { name: /Test/ });
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('a un id de panel valide et aria-controls cohérent', () => {
    render(
      <BlocAccordeon icone="🔧" titre="Mon titre avec accents éàç">
        <p>Contenu</p>
      </BlocAccordeon>
    );
    const button = screen.getByRole('button');
    const panelId = button.getAttribute('aria-controls');
    expect(panelId).toBeTruthy();
    expect(panelId).toMatch(/^panel-/);
  });
});
