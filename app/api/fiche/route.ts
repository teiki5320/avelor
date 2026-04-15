import { NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import { fetchSirene } from '@/lib/sirene';
import { saveFiche } from '@/lib/supabase';
import type { Reponses } from '@/lib/types';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const siret: string = (body.siret ?? '').replace(/\D/g, '');
    const reponses = body.reponses as Reponses;

    if (!/^\d{14}$/.test(siret)) {
      return NextResponse.json({ error: 'SIRET invalide' }, { status: 400 });
    }

    const company_data = await fetchSirene(siret);
    const token = uuid().replace(/-/g, '').slice(0, 24);

    const saved = await saveFiche({
      token,
      siret,
      reponses,
      company_data,
    });

    return NextResponse.json({
      token,
      persisted: saved,
      company_data,
      reponses,
    });
  } catch (e) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
