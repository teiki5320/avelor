import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { rappelPayloadSchema } from '@/lib/schemas';
import type { Rappel } from '@/lib/types';

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Corps de requête invalide' }, { status: 400 });
  }

  const result = rappelPayloadSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: 'Données invalides', details: result.error.flatten().fieldErrors }, { status: 400 });
  }

  const { token, email, echeance, dateRappel, libelle } = result.data;

  const sb = getSupabase();
  if (!sb) {
    return NextResponse.json({ error: 'Service indisponible' }, { status: 503 });
  }

  try {
    const { data: fiche, error: fetchError } = await sb
      .from('fiches')
      .select('*')
      .eq('token', token)
      .single();

    if (fetchError || !fiche) {
      return NextResponse.json({ error: 'Fiche introuvable' }, { status: 404 });
    }

    const rappels: Rappel[] = (fiche.rappels as Rappel[]) || [];

    rappels.push({
      email,
      echeance,
      dateRappel: dateRappel || echeance,
      libelle: libelle || echeance,
      cree_le: new Date().toISOString(),
      envoye: false,
    });

    const { error: updateError } = await sb
      .from('fiches')
      .update({ rappels })
      .eq('token', token);

    if (updateError) {
      console.error('[POST /api/fiche/rappels] update error:', updateError);
      return NextResponse.json({ error: 'Erreur lors de la sauvegarde' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, total: rappels.length });
  } catch (e) {
    console.error('[POST /api/fiche/rappels]', e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
