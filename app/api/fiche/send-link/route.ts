import { NextResponse } from 'next/server';
import { sendMagicLink } from '@/lib/resend';
import { updateFicheEmail } from '@/lib/supabase';
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

    await updateFicheEmail(token, email);
    const ok = await sendMagicLink(email, token);

    return NextResponse.json({ sent: ok });
  } catch (e) {
    console.error('[POST /api/fiche/send-link]', e);
    return NextResponse.json({ error: 'Erreur' }, { status: 500 });
  }
}
