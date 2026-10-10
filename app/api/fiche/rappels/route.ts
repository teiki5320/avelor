import { NextResponse } from 'next/server';
import { getDb, getFicheByToken, getRappels, setRappels } from '@/lib/db';
import { rappelPayloadSchema } from '@/lib/schemas';
import { nettoyerLibelleRappel } from '@/lib/resend';
import type { Rappel } from '@/lib/types';

/** Nombre maximal de rappels EN ATTENTE par fiche (les rappels déjà envoyés ne comptent pas). */
const MAX_RAPPELS_EN_ATTENTE = 20;

/**
 * POST /api/fiche/rappels — programme un rappel par e-mail pour une fiche.
 *
 * Anti-relais / anti-hameçonnage :
 * - le rappel part UNIQUEMENT vers l'adresse déjà enregistrée sur la fiche
 *   (via « Sauvegarder ma fiche par e-mail ») — jamais vers une adresse fournie ici ;
 * - le libellé est nettoyé (pas d'URL ni de numéro de téléphone, 80 caractères max)
 *   et n'apparaît jamais dans le sujet de l'e-mail ;
 * - dates réelles, entre aujourd'hui et dans 2 ans.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Corps de requête invalide (JSON attendu)' }, { status: 400 });
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
    const fiche = await getFicheByToken(token);
    if (!fiche) {
      return NextResponse.json({ error: 'Fiche introuvable' }, { status: 404 });
    }

    const emailFiche = fiche.email?.trim();
    if (!emailFiche) {
      return NextResponse.json({ error: 'Enregistrez d\'abord votre e-mail' }, { status: 409 });
    }
    if (email && email.toLowerCase() !== emailFiche.toLowerCase()) {
      return NextResponse.json(
        { error: 'Les rappels sont envoyés uniquement à l\'adresse enregistrée pour cette fiche' },
        { status: 403 },
      );
    }

    const rappels: Rappel[] = (await getRappels(token)) ?? [];

    // Anti-abus : une fiche ne peut pas accumuler des rappels sans limite.
    const enAttente = rappels.filter((r) => !r.envoye && !r.echec).length;
    if (enAttente >= MAX_RAPPELS_EN_ATTENTE) {
      return NextResponse.json(
        { error: `Nombre maximal de rappels en attente atteint (${MAX_RAPPELS_EN_ATTENTE})` },
        { status: 429 },
      );
    }

    rappels.push({
      email: emailFiche,
      echeance,
      dateRappel,
      libelle: nettoyerLibelleRappel(libelle),
      cree_le: new Date().toISOString(),
      envoye: false,
    });

    if (!(await setRappels(token, rappels))) {
      console.error('[POST /api/fiche/rappels] échec de sauvegarde');
      return NextResponse.json({ error: 'Erreur lors de la sauvegarde' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, total: rappels.length, enAttente: enAttente + 1 });
  } catch (e) {
    console.error('[POST /api/fiche/rappels]', e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
