import { getSupabase } from '@/lib/supabase';

export default async function Compteur() {
  let count = 0;
  const sb = getSupabase();
  if (sb) {
    try {
      const { count: c } = await sb
        .from('fiches')
        .select('*', { count: 'exact', head: true });
      count = c ?? 0;
    } catch {}
  }

  if (count < 1) return null;

  return (
    <p className="text-xs text-navy/40">
      {count.toLocaleString('fr-FR')} {count === 1 ? 'fiche créée' : 'fiches créées'} sur AVELOR
    </p>
  );
}
