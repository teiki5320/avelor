import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

interface RappelPayload {
  token: string;
  email: string;
  echeance: string;
  dateRappel: string;
  libelle: string;
}

interface Rappel {
  email: string;
  echeance: string;
  dateRappel: string;
  libelle: string;
  cree_le: string;
  envoye?: boolean;
}

export async function POST(req: Request) {
  let body: RappelPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Corps de requête invalide' }, { status: 400 });
  }

  const { token, email, echeance, dateRappel, libelle } = body;

  if (!token || !email || !echeance) {
    return NextResponse.json({ error: 'Champs manquants (token, email, echeance requis)' }, { status: 400 });
  }

  /* Validation basique email */
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Adresse email invalide' }, { status: 400 });
  }

  /* Validation date */
  const dateObj = new Date(dateRappel || echeance);
  if (isNaN(dateObj.getTime())) {
    return NextResponse.json({ error: 'Date invalide' }, { status: 400 });
  }

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
