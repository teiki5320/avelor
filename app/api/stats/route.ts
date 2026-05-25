import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import type { Reponses } from '@/lib/types';

export const revalidate = 300;

interface FicheRow {
  reponses: Reponses;
  email: string | null;
  created_at: string | null;
}

export async function GET() {
  const sb = getSupabase();
  if (!sb) {
    return NextResponse.json({ count: 0 });
  }
  try {
    /* Récupérer les champs nécessaires pour l'agrégation */
    const { data, count, error } = await sb
      .from('fiches')
      .select('reponses, email, created_at', { count: 'exact' });

    if (error) {
      console.error('[GET /api/stats]', error);
      return NextResponse.json({ count: 0 });
    }

    const fiches = (data ?? []) as FicheRow[];
    const total = count ?? fiches.length;

    /* Agrégation par situation */
    const parSituation: Record<string, number> = {};
    const parProbleme: Record<string, number> = {};
    let avecEmail = 0;
    let derniereFiche: string | null = null;

    for (const f of fiches) {
      const rep = f.reponses;
      if (rep?.situation) {
        parSituation[rep.situation] = (parSituation[rep.situation] ?? 0) + 1;
      }
      if (rep?.probleme) {
        parProbleme[rep.probleme] = (parProbleme[rep.probleme] ?? 0) + 1;
      }
      if (f.email) avecEmail++;
      if (f.created_at && (!derniereFiche || f.created_at > derniereFiche)) {
        derniereFiche = f.created_at;
      }
    }

    return NextResponse.json({
      count: total,
      parSituation,
      parProbleme,
      avecEmail,
      derniereFiche,
    });
  } catch (e) {
    console.error('[GET /api/stats]', e);
    return NextResponse.json({ count: 0 });
  }
}
