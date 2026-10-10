'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface LastFiche {
  token: string;
  nom: string;
  siret: string;
  ts: number;
}

export default function RetourFiche() {
  const [fiche, setFiche] = useState<LastFiche | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('solelis_last_fiche');
      if (raw) {
        const parsed = JSON.parse(raw) as LastFiche;
        // Une fiche « local » n'a pas été enregistrée : aucun lien ne permet de
        // la rouvrir. On ne propose que les vraies fiches (token valide).
        if (!/^[A-Za-z0-9_-]{10,64}$/.test(String(parsed?.token ?? ''))) {
          localStorage.removeItem('solelis_last_fiche');
          return;
        }
        const age = Date.now() - (parsed.ts || 0);
        if (age < 30 * 24 * 60 * 60 * 1000) {
          setFiche(parsed);
        }
      }
    } catch {}
  }, []);

  if (!fiche) return null;

  return (
    <div className="dashed-band mx-auto mt-8 max-w-xl p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-navy">
            Retrouver votre fiche
          </p>
          <p className="text-xs text-navy/55">
            {fiche.nom} · {fiche.siret}
          </p>
        </div>
        <Link
          href={`/fiche/${fiche.token}`}
          className="shrink-0 rounded-full bg-bleu-fonce px-4 py-2 text-sm font-medium text-white"
        >
          Ouvrir →
        </Link>
      </div>
    </div>
  );
}
