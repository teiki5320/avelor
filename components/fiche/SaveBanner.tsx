'use client';
import { useState } from 'react';

interface Props {
  token: string;
}

export default function SaveBanner({ token }: Props) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'err'>('idle');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return;
    setStatus('sending');
    try {
      const res = await fetch('/api/fiche/send-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email }),
      });
      setStatus(res.ok ? 'done' : 'err');
    } catch {
      setStatus('err');
    }
  }

  if (status === 'done') {
    return (
      <div className="dashed-band flex items-center gap-3 p-4 text-sm text-bleu-fonce">
        <span aria-hidden>✉︎</span>
        <span>
          C&apos;est envoyé à <strong>{email}</strong>. Le lien reste valable
          tant que vous en avez besoin.
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="dashed-band p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-navy">
            Sauvegardez votre fiche par email
          </p>
          <p className="text-xs text-navy/55">
            Aucun mot de passe. Nous vous envoyons un lien privé pour la
            retrouver.
          </p>
        </div>
        <div className="flex flex-1 gap-2">
          <input
            type="email"
            required
            placeholder="votre@email.fr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded-full border border-navy/10 bg-white/80 px-4 py-2 text-sm focus:border-bleu focus:outline-none"
          />
          <button
            type="submit"
            disabled={status === 'sending'}
            className="rounded-full bg-bleu-fonce px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {status === 'sending' ? '…' : 'Envoyer'}
          </button>
        </div>
      </div>
      {status === 'err' && (
        <p className="mt-2 text-xs text-rouge">
          Une erreur est survenue — votre fiche reste disponible sur cette page.
        </p>
      )}
    </form>
  );
}
