'use client';
import { useState, useEffect } from 'react';

export default function Compteur() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/stats');
        if (res.ok) {
          const json = await res.json();
          if (typeof json.count === 'number' && json.count > 0) {
            setCount(json.count);
          }
        }
      } catch {}
    }
    load();
  }, []);

  if (count === null || count < 1) return null;

  return (
    <p className="text-xs text-navy/40">
      {count.toLocaleString('fr-FR')} {count === 1 ? 'fiche créée' : 'fiches créées'} sur AVELOR
    </p>
  );
}
