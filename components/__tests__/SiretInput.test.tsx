// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SiretInput from '../SiretInput';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
}));

describe('SiretInput', () => {
  it('rend un champ de saisie SIRET', () => {
    render(<SiretInput />);
    const input = screen.getByLabelText(/SIRET/i);
    expect(input).toBeInTheDocument();
  });

  it('refuse les caractères non numériques (filtrage par formatSiret)', () => {
    render(<SiretInput />);
    const input = screen.getByLabelText(/SIRET/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'abc123def456' } });
    expect(input.value).toMatch(/^[\d ]*$/);
  });

  it('formate avec des espaces (groupes de 3 chiffres)', () => {
    render(<SiretInput />);
    const input = screen.getByLabelText(/SIRET/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '12345678901234' } });
    expect(input.value.replace(/\s/g, '')).toBe('12345678901234');
    expect(input.value).toContain(' ');
  });

  it('affiche un message d\'erreur si le SIRET est trop court à la soumission', () => {
    render(<SiretInput />);
    const input = screen.getByLabelText(/SIRET/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '12345' } });
    const form = input.closest('form')!;
    fireEvent.submit(form);
    expect(screen.getByText(/14 chiffres/i)).toBeInTheDocument();
  });
});
