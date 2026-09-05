import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { fetchSirene } from '@/lib/sirene';
import { saveFiche } from '@/lib/supabase';
import { fichePayloadSchema } from '@/lib/schemas';
import type { Reponses } from '@/lib/types';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = fichePayloadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { siret, reponses } = parsed.data;

    const company_data = await fetchSirene(siret);
    const token = randomUUID().replace(/-/g, '').slice(0, 24);

    const saved = await saveFiche({
      token,
      siret,
      reponses: reponses as Reponses,
      company_data,
    });

    return NextResponse.json({
      token,
      persisted: saved,
      company_data,
      reponses,
    });
  } catch (e) {
    console.error('[POST /api/fiche]', e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
