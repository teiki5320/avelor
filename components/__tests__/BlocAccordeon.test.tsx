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

  it('place le bouton dans un titre <h3>', () => {
    render(
      <BlocAccordeon icone="🔧" titre="Titre accessible">
        <p>Contenu</p>
      </BlocAccordeon>
    );
    const heading = screen.getByRole('heading', { level: 3, name: /Titre accessible/ });
    expect(heading.querySelector('button')).not.toBeNull();
  });

  it('la région contrôlée existe toujours, masquée (hidden) quand le bloc est fermé', () => {
    const { container } = render(
      <BlocAccordeon icone="🔧" titre="Test">
        <p>Contenu imprimable</p>
      </BlocAccordeon>
    );
    const button = screen.getByRole('button', { name: /Test/ });
    const panel = container.querySelector(`#${button.getAttribute('aria-controls')}`);
    expect(panel).not.toBeNull();
    expect(panel).toHaveAttribute('hidden');
    expect(panel).toHaveAttribute('aria-labelledby', button.id);
    // Le contenu est dans le DOM (imprimé via @media print) même fermé
    expect(panel!.textContent).toContain('Contenu imprimable');

    fireEvent.click(button);
    expect(panel).not.toHaveAttribute('hidden');
    expect(screen.getByRole('region', { name: /Test/ })).toBeInTheDocument();

    fireEvent.click(button);
    expect(panel).toHaveAttribute('hidden');
  });

  it('génère des identifiants uniques pour deux blocs de même titre', () => {
    render(
      <>
        <BlocAccordeon icone="🔧" titre="Doublon"><p>A</p></BlocAccordeon>
        <BlocAccordeon icone="🔧" titre="Doublon"><p>B</p></BlocAccordeon>
      </>
    );
    const [b1, b2] = screen.getAllByRole('button', { name: /Doublon/ });
    expect(b1.getAttribute('aria-controls')).not.toBe(b2.getAttribute('aria-controls'));
  });
});
