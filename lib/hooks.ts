'use client';
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initial: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  // Lecture différée au montage : lire localStorage dans l'init useState
  // rendrait le premier rendu client différent du HTML serveur (hydration
  // mismatch). On rend d'abord la valeur par défaut, puis on recharge.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) setState(JSON.parse(stored));
    } catch {
      // JSON invalide ou storage inaccessible — on garde la valeur par défaut
    }
    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // quota exceeded or storage disabled — silently ignore
    }
  }, [key, state, hydrated]);

  return [state, setState];
}
