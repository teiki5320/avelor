import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import type { Rappel } from '@/lib/types';

interface FicheAvecRappels {
  token: string;
  siret: string;
  rappels: Rappel[];
  company_data: { nom?: string };
}

/**
 * GET /api/cron/rappels
 *
 * Endpoint appelé par un cron Vercel (vercel.json) pour envoyer les rappels
 * email dont la dateRappel est atteinte.
 *
 * Sécurité : vérifie le header Authorization avec CRON_SECRET.
 */
export async function GET(req: Request) {
  /* Vérification du secret cron */
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || req.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const sb = getSupabase();
  if (!sb) {
    return NextResponse.json({ error: 'Service indisponible' }, { status: 503 });
  }

  const aujourdhui = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  try {
    /* Récupérer toutes les fiches qui ont des rappels non vides */
    const { data: fiches, error } = await sb
      .from('fiches')
      .select('token, siret, rappels, company_data')
      .not('rappels', 'is', null);

    if (error) {
      console.error('[CRON rappels] fetch error:', error);
      return NextResponse.json({ error: 'Erreur de lecture' }, { status: 500 });
    }

    if (!fiches || fiches.length === 0) {
      return NextResponse.json({ envoyes: 0, message: 'Aucune fiche avec rappels' });
    }

    let totalEnvoyes = 0;
    const erreurs: string[] = [];

    for (const fiche of fiches as FicheAvecRappels[]) {
      const rappels = fiche.rappels;
      if (!Array.isArray(rappels) || rappels.length === 0) continue;

      let modifie = false;

      for (const rappel of rappels) {
        if (rappel.envoye) continue;

        const dateRappel = rappel.dateRappel?.slice(0, 10);
        if (!dateRappel || dateRappel > aujourdhui) continue;

        /* Envoyer l'email via Resend */
        const envoiOk = await envoyerRappelEmail(rappel, fiche);
        if (envoiOk) {
          rappel.envoye = true;
          modifie = true;
          totalEnvoyes++;
        } else {
          erreurs.push(`Echec envoi pour ${fiche.token} / ${rappel.libelle}`);
        }
      }

      /* Sauvegarder les rappels mis à jour */
      if (modifie) {
        const { error: updateError } = await sb
          .from('fiches')
          .update({ rappels })
          .eq('token', fiche.token);

        if (updateError) {
          erreurs.push(`Echec update pour ${fiche.token}`);
        }
      }
    }

    return NextResponse.json({
      envoyes: totalEnvoyes,
      erreurs: erreurs.length > 0 ? erreurs : undefined,
    });
  } catch (e) {
    console.error('[CRON rappels]', e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

/**
 * Échappe les caractères HTML d'une valeur venue de la base (libellé, échéance,
 * nom d'entreprise) : ces champs sont saisis côté client et seraient sinon
 * injectés tels quels dans le HTML de l'email (phishing depuis le domaine Avelor).
 */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Envoie un email de rappel via Resend.
 */
async function envoyerRappelEmail(
  rappel: Rappel,
  fiche: FicheAvecRappels,
): Promise<boolean> {
  /* Import dynamique pour éviter un crash si Resend n'est pas configuré */
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.warn('[CRON rappels] RESEND_API_KEY manquant, email non envoyé');
    return false;
  }

  const { Resend } = await import('resend');
  const resend = new Resend(resendKey);
  const from = process.env.RESEND_FROM ?? 'AVELOR <onboarding@resend.dev>';
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://avelor.fr';
  const nomEntreprise = escapeHtml(fiche.company_data?.nom ?? 'votre entreprise');
  const libelle = escapeHtml(String(rappel.libelle ?? '').slice(0, 120));
  const echeance = escapeHtml(String(rappel.echeance ?? '').slice(0, 120));
  const lienFiche = `${base}/fiche/${encodeURIComponent(fiche.token)}`;

  try {
    const { error } = await resend.emails.send({
      from,
      to: rappel.email,
      subject: `Rappel AVELOR : ${String(rappel.libelle ?? '').slice(0, 120)}`,
      html: `
<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:32px;color:#0A1628">
  <h1 style="font-family:'Playfair Display',Georgia,serif;font-size:24px;margin:0 0 16px">AVELOR</h1>
  <p style="font-size:16px;line-height:1.6">Bonjour,</p>
  <p style="font-size:16px;line-height:1.6">
    Ceci est un rappel que vous avez programmé pour <strong>${nomEntreprise}</strong> :
  </p>
  <div style="background:#f0f4fa;border-left:4px solid #1E3D82;padding:16px 20px;margin:24px 0;border-radius:0 12px 12px 0">
    <p style="font-size:18px;font-weight:600;margin:0;color:#1E3D82">${libelle}</p>
    <p style="font-size:14px;color:#4A72B8;margin:8px 0 0">Échéance : ${echeance}</p>
  </div>
  <p style="margin:32px 0">
    <a href="${lienFiche}" style="background:#1E3D82;color:white;padding:14px 24px;border-radius:12px;text-decoration:none;font-family:sans-serif">
      Ouvrir ma fiche
    </a>
  </p>
  <p style="font-size:13px;color:#7c8597;margin-top:32px">AVELOR · rappel automatique · vous seul avez ce lien</p>
</div>`,
    });

    if (error) {
      console.error('[CRON rappels] Resend error:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('[CRON rappels] send error:', e);
    return false;
  }
}
