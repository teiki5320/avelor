import { NextResponse } from 'next/server';
import { getDb, lignesStats } from '@/lib/db';

// Lue à chaque appel (la base n'existe qu'au moment de l'exécution), mise en cache 5 min.
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!getDb()) {
    return NextResponse.json({ count: 0 });
  }
  try {
    /* Récupérer les champs nécessaires pour l'agrégation */
    const fiches = await lignesStats();
    const total = fiches.length;

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
    }, { headers: { 'Cache-Control': 'public, s-maxage=300' } });
  } catch (e) {
    console.error('[GET /api/stats]', e);
    return NextResponse.json({ count: 0 });
  }
}
