'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

interface Entree<T> {
  /** Clé à laquelle appartient la valeur. */
  cle: string;
  valeur: T;
  /** Vrai une fois la valeur relue depuis localStorage pour cette clé. */
  chargee: boolean;
}

export function useLocalStorage<T>(key: string, initial: T): [T, (value: T | ((prev: T) => T)) => void] {
  // La valeur initiale peut être un littéral recréé à chaque rendu ([] , {}) :
  // on la mémorise pour ne pas relancer les effets.
  const initialRef = useRef(initial);
  initialRef.current = initial;

  // La valeur est rattachée à sa clé : quand la clé change, l'ancienne
  // valeur n'est jamais réécrite sous la nouvelle clé.
  const [entree, setEntree] = useState<Entree<T>>({ cle: key, valeur: initial, chargee: false });

  // Lecture différée au montage (et à chaque changement de clé) : lire
  // localStorage dans l'init useState rendrait le premier rendu client
  // différent du HTML serveur (hydration mismatch).
  useEffect(() => {
    let valeur = initialRef.current;
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) valeur = JSON.parse(stored) as T;
    } catch {
      // JSON invalide ou storage inaccessible — on garde la valeur par défaut
    }
    setEntree({ cle: key, valeur, chargee: true });
  }, [key]);

  // Écriture uniquement pour la clé courante et après relecture.
  useEffect(() => {
    if (!entree.chargee || entree.cle !== key) return;
    try {
      localStorage.setItem(key, JSON.stringify(entree.valeur));
    } catch {
      // quota exceeded or storage disabled — silently ignore
    }
  }, [key, entree]);

  const setValeur = useCallback(
    (value: T | ((prev: T) => T)) => {
      setEntree((prev) => {
        // Mise à jour pendant un changement de clé : on part de la valeur initiale
        const base = prev.cle === key ? prev.valeur : initialRef.current;
        const valeur =
          typeof value === 'function' ? (value as (p: T) => T)(base) : value;
        return { cle: key, valeur, chargee: prev.cle === key ? prev.chargee : false };
      });
    },
    [key],
  );

  // Tant que la nouvelle clé n'est pas relue, on rend la valeur initiale
  // (et non celle de l'ancienne clé).
  const valeur = entree.cle === key ? entree.valeur : initial;
  return [valeur, setValeur];
}
