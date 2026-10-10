import { NextResponse } from 'next/server';
import { compterFiches } from '@/lib/db';

// Lu à l'exécution (la base n'existe pas au build) ; mis en cache 5 min par worker.ts.
export const dynamic = 'force-dynamic';

/** Compteur public : uniquement le nombre de fiches créées (aucun détail sur leur contenu). */
export async function GET() {
  try {
    return NextResponse.json({ count: await compterFiches() });
  } catch (e) {
    console.error('[GET /api/stats]', e);
    return NextResponse.json({ count: 0 });
  }
}
