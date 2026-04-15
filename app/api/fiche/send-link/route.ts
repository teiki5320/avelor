import { NextResponse } from 'next/server';
import { sendMagicLink } from '@/lib/resend';
import { updateFicheEmail } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { token, email } = await req.json();
    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'Token manquant' }, { status: 400 });
    }
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 });
    }

    await updateFicheEmail(token, email);
    const ok = await sendMagicLink(email, token);

    return NextResponse.json({ sent: ok });
  } catch {
    return NextResponse.json({ error: 'Erreur' }, { status: 500 });
  }
}
