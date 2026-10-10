import { NextResponse } from 'next/server';
import { sendMagicLink } from '@/lib/resend';
import { getFicheByToken, updateFicheEmail } from '@/lib/db';
import { sendLinkPayloadSchema } from '@/lib/schemas';

export const runtime = 'nodejs';

/**
 * POST /api/fiche/send-link — envoie le lien privé de la fiche par e-mail.
 *
 * Anti-relais (choix documenté) : la limite « 3 envois par fiche et par 24 h »
 * demanderait de stocker un compteur, donc de modifier le schéma D1. On a préféré
 * une règle sans nouvelle colonne :
 * - une fiche est liée à UNE seule adresse : la première adresse enregistrée ;
 *   une adresse différente est refusée (409). L'endpoint ne peut donc plus servir
 *   à écrire à n'importe qui en boucle avec un même token ;
 * - le renvoi vers la même adresse reste possible (lien perdu), mais il est limité
 *   par le rate limiting du middleware (par IP).
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Corps de requête invalide (JSON attendu)' }, { status: 400 });
  }

  try {
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
    // Solelis » à n'importe quelle adresse avec un token arbitraire.
    const fiche = await getFicheByToken(token);
    if (!fiche) {
      return NextResponse.json({ error: 'Fiche introuvable' }, { status: 404 });
    }

    const emailEnregistre = fiche.email?.trim();
    if (emailEnregistre) {
      if (emailEnregistre.toLowerCase() !== email.toLowerCase()) {
        return NextResponse.json(
          { error: 'Cette fiche est déjà liée à une adresse e-mail' },
          { status: 409 },
        );
      }
    } else if (!(await updateFicheEmail(token, email))) {
      // Sans adresse enregistrée, la protection ci-dessus ne jouerait pas : on n'envoie rien.
      console.error('[POST /api/fiche/send-link] échec de l\'enregistrement de l\'adresse');
      return NextResponse.json({ error: 'Service indisponible', sent: false }, { status: 503 });
    }

    const ok = await sendMagicLink(email, token);

    return NextResponse.json({ sent: ok });
  } catch (e) {
    console.error('[POST /api/fiche/send-link]', e);
    return NextResponse.json({ error: 'Erreur' }, { status: 500 });
  }
}
