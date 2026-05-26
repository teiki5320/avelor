// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../hooks';

/* ─── mock localStorage ─── */

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

beforeEach(() => {
  localStorageMock.clear();
});

/* ─── useLocalStorage ─── */

describe('useLocalStorage', () => {
  it('retourne la valeur initiale si rien en localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 42));
    expect(result.current[0]).toBe(42);
  });

  it('retourne la valeur initiale pour un objet', () => {
    const initial = { nom: 'Avelor', actif: true };
    const { result } = renderHook(() => useLocalStorage('obj-key', initial));
    expect(result.current[0]).toEqual(initial);
  });

  it('persiste la valeur en localStorage après un setState', async () => {
    const { result } = renderHook(() => useLocalStorage('persist-key', 'initial'));

    await act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
    expect(localStorageMock.getItem('persist-key')).toBe(JSON.stringify('updated'));
  });

  it('restaure la valeur depuis localStorage au montage', () => {
    localStorageMock.setItem('restore-key', JSON.stringify('stored-value'));

    const { result } = renderHook(() => useLocalStorage('restore-key', 'default'));
    expect(result.current[0]).toBe('stored-value');
  });

  it('restaure un objet depuis localStorage au montage', () => {
    const stored = { etape: 3, fini: false };
    localStorageMock.setItem('obj-restore', JSON.stringify(stored));

    const { result } = renderHook(() => useLocalStorage('obj-restore', { etape: 1, fini: true }));
    expect(result.current[0]).toEqual(stored);
  });

  it('accepte un updater fonctionnel', async () => {
    const { result } = renderHook(() => useLocalStorage('counter', 10));

    await act(() => {
      result.current[1]((prev) => prev + 5);
    });

    expect(result.current[0]).toBe(15);
  });

  it('retourne la valeur initiale si le JSON en localStorage est invalide', () => {
    localStorageMock.setItem('bad-json', '{invalid');

    const { result } = renderHook(() => useLocalStorage('bad-json', 'fallback'));
    expect(result.current[0]).toBe('fallback');
  });
});
