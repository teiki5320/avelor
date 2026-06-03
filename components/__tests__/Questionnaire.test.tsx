// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import Questionnaire from '../Questionnaire';

// Mocks Next + fetch + redirection
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
}));

const originalLocation = window.location;
beforeEach(() => {
  vi.useFakeTimers();
  // @ts-ignore
  delete (window as any).location;
  (window as any).location = { href: '' };
  vi.stubGlobal('fetch', vi.fn(async () => ({
    json: async () => ({ token: 'tok123', persisted: true }),
  })));
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  (window as any).location = originalLocation;
  cleanup();
  localStorage.clear();
});

describe('Questionnaire — anti double-clic', () => {
  it('le double-clic rapide sur un choix ne saute pas l\'étape suivante', async () => {
    render(<Questionnaire siret="12345678901234" />);
    // On est à l'étape 1 (situation)
    expect(screen.getByText(/Étape 1 sur 18/)).toBeInTheDocument();

    // Le premier choix : "Je sens que ça se dégrade"
    const choix = screen.getAllByRole('button').filter((b) => /Je sens que ça se dégrade/i.test(b.getAttribute('aria-label') ?? ''));
    expect(choix.length).toBeGreaterThan(0);

    // Double-clic rapide (avant l'expiration du setTimeout)
    fireEvent.click(choix[0]);
    fireEvent.click(choix[0]); // 2e clic dans la fenêtre de 280 ms

    // Avance le temps après les 280 ms du setTimeout
    act(() => { vi.advanceTimersByTime(300); });

    // On doit être à l'étape 2 (et pas étape 3 — pas de saut)
    expect(screen.getByText(/Étape 2 sur 18/)).toBeInTheDocument();
  });

  it('les boutons-choix sont désactivés pendant la transition', () => {
    render(<Questionnaire siret="12345678901234" />);
    const choix = screen.getAllByRole('button').filter((b) => /Je sens que ça se dégrade/i.test(b.getAttribute('aria-label') ?? ''));
    fireEvent.click(choix[0]);
    // Immédiatement après le clic, avant les 280 ms, tous les boutons-choix sont disabled
    const tousChoix = screen.getAllByRole('button').filter((b) => b.getAttribute('aria-label'));
    const disabled = tousChoix.filter((b) => (b as HTMLButtonElement).disabled);
    expect(disabled.length).toBeGreaterThan(0);
  });

  it('le clic sur le bouton « Précédent » fonctionne après une transition', () => {
    render(<Questionnaire siret="12345678901234" />);
    const choix = screen.getAllByRole('button').filter((b) => /Je sens que ça se dégrade/i.test(b.getAttribute('aria-label') ?? ''));
    fireEvent.click(choix[0]);
    act(() => { vi.advanceTimersByTime(300); });
    expect(screen.getByText(/Étape 2 sur 18/)).toBeInTheDocument();

    const prev = screen.getByRole('button', { name: /Précédent/i });
    fireEvent.click(prev);
    expect(screen.getByText(/Étape 1 sur 18/)).toBeInTheDocument();
  });
});
