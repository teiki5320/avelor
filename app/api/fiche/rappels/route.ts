import { NextResponse } from 'next/server';
import { getDb, getRappels, setRappels } from '@/lib/db';
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

  if (!getDb()) {
    return NextResponse.json({ error: 'Service indisponible' }, { status: 503 });
  }

  try {
    const existants = await getRappels(token);
    if (!existants) {
      return NextResponse.json({ error: 'Fiche introuvable' }, { status: 404 });
    }

    const rappels: Rappel[] = existants;

    // Anti-abus : une fiche ne peut pas accumuler des rappels sans limite
    // (l'endpoint servirait sinon de canon à spam via le cron quotidien).
    if (rappels.length >= 20) {
      return NextResponse.json(
        { error: 'Nombre maximal de rappels atteint (20)' },
        { status: 429 },
      );
    }

    rappels.push({
      email,
      echeance,
      dateRappel: dateRappel || echeance,
      libelle: libelle || echeance,
      cree_le: new Date().toISOString(),
      envoye: false,
    });

    if (!(await setRappels(token, rappels))) {
      console.error('[POST /api/fiche/rappels] échec de sauvegarde');
      return NextResponse.json({ error: 'Erreur lors de la sauvegarde' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, total: rappels.length });
  } catch (e) {
    console.error('[POST /api/fiche/rappels]', e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
