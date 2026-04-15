'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

function formatSiret(v: string): string {
  const digits = v.replace(/\D/g, '').slice(0, 14);
  return digits.replace(/(.{3})(?=.)/g, '$1 ').trim();
}

export default function SiretInput() {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clean = value.replace(/\s/g, '');
  const isValid = /^\d{14}$/.test(clean);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) {
      setError('Un SIRET contient 14 chiffres.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      sessionStorage.setItem('avelor_siret', clean);
    } catch {
      // ignore
    }
    router.push(`/questionnaire?siret=${clean}`);
  }

  return (
    <motion.form
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="glass card-top-line mx-auto mt-10 max-w-xl p-6 sm:p-8"
    >
      <label
        htmlFor="siret"
        className="block text-sm font-medium text-navy/70"
      >
        Votre numéro SIRET
      </label>
      <input
        id="siret"
        name="siret"
        inputMode="numeric"
        autoComplete="off"
        value={value}
        onChange={(e) => {
          setValue(formatSiret(e.target.value));
          setError(null);
        }}
        placeholder="123 456 789 00012"
        className="mt-3 w-full rounded-2xl border border-navy/10 bg-white/70 px-5 py-4 text-lg tracking-wider placeholder:text-navy/30 focus:border-bleu focus:outline-none"
      />
      {error && (
        <p className="mt-2 text-sm text-rouge" role="alert">
          {error}
        </p>
      )}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-navy/50">
          Vos données restent privées. Aucun compte n&apos;est créé.
        </p>
        <button
          type="submit"
          disabled={!isValid || loading}
          className="btn-primary"
        >
          {loading ? 'Chargement…' : 'Commencer'}
          {!loading && <span aria-hidden>→</span>}
        </button>
      </div>
    </motion.form>
  );
}
