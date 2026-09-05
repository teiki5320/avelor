import { NextResponse } from 'next/server';
import { sendMagicLink } from '@/lib/resend';
import { getFicheByToken, updateFicheEmail } from '@/lib/supabase';
import { sendLinkPayloadSchema } from '@/lib/schemas';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = sendLinkPayloadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { token, email } = parsed.data;

    // Anti-relais : n'envoyer d'email que si le token correspond à une fiche réelle.
    // Sans cette vérification, l'endpoint permet d'envoyer des emails « Votre fiche
    // Avelor » à n'importe quelle adresse avec un token arbitraire.
    const fiche = await getFicheByToken(token);
    if (!fiche) {
      return NextResponse.json({ error: 'Fiche introuvable' }, { status: 404 });
    }

    await updateFicheEmail(token, email);
    const ok = await sendMagicLink(email, token);

    return NextResponse.json({ sent: ok });
  } catch (e) {
    console.error('[POST /api/fiche/send-link]', e);
    return NextResponse.json({ error: 'Erreur' }, { status: 500 });
  }
}
