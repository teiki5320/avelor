// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import RetourFiche from '../RetourFiche';
import StoreCompanyData from '../fiche/StoreCompanyData';
import type { CompanyData } from '@/lib/types';

afterEach(() => {
  cleanup();
  localStorage.clear();
});

const company = { nom: 'ACME', siret: '12345678901234' } as CompanyData;

describe('RetourFiche', () => {
  it('propose la dernière fiche enregistrée', () => {
    localStorage.setItem('solelis_last_fiche', JSON.stringify({ token: 'abcdef0123456789abcdef01', nom: 'ACME', siret: '1', ts: Date.now() }));
    render(<RetourFiche />);
    expect(screen.getByRole('link', { name: /Ouvrir/ })).toHaveAttribute('href', '/fiche/abcdef0123456789abcdef01');
  });

  it('ne propose pas une fiche locale (non enregistrée) et nettoie l’entrée', () => {
    localStorage.setItem('solelis_last_fiche', JSON.stringify({ token: 'local', nom: 'ACME', siret: '1', ts: Date.now() }));
    render(<RetourFiche />);
    expect(screen.queryByRole('link', { name: /Ouvrir/ })).not.toBeInTheDocument();
    expect(localStorage.getItem('solelis_last_fiche')).toBeNull();
  });
});

describe('StoreCompanyData', () => {
  it('ne mémorise pas une fiche locale comme « dernière fiche »', () => {
    render(<StoreCompanyData company={company} token="local" />);
    expect(localStorage.getItem('solelis_last_fiche')).toBeNull();
  });

  it('mémorise une fiche enregistrée', () => {
    render(<StoreCompanyData company={company} token="abcdef0123456789abcdef01" />);
    expect(JSON.parse(localStorage.getItem('solelis_last_fiche') ?? '{}').token).toBe('abcdef0123456789abcdef01');
  });
});
