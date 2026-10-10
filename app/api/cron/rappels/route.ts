import { NextResponse } from 'next/server';
import { fichesAvecRappels, getDb, getFicheByToken, setRappels } from '@/lib/db';
import { sendRappelEmail } from '@/lib/resend';

/** Après ce nombre d'échecs d'envoi, un rappel est marqué en échec et n'est plus retenté. */
const MAX_TENTATIVES = 3;

/** Identifiant court pour les journaux : le token complet donne accès à la fiche. */
function tokenCourt(token: string): string {
  return `${token.slice(0, 6)}…`;
}

/**
 * GET /api/cron/rappels
 *
 * Endpoint appelé chaque jour par le Cron Trigger Cloudflare (worker.ts) pour envoyer les rappels
 * email dont la dateRappel est atteinte.
 *
 * Sécurité : vérifie le header Authorization avec CRON_SECRET. Un rappel n'est envoyé qu'à
 * l'adresse actuellement enregistrée sur la fiche (protège aussi contre d'anciens rappels
 * programmés vers une autre adresse).
 */
export async function GET(req: Request) {
  /* Vérification du secret cron */
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || req.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  if (!getDb()) {
    return NextResponse.json({ error: 'Service indisponible' }, { status: 503 });
  }

  const aujourdhui = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  try {
    /* Récupérer toutes les fiches qui ont des rappels non vides */
    const fiches = await fichesAvecRappels();

    let envoyes = 0;
    let echecs = 0;
    let abandonnes = 0;
    const erreurs: string[] = [];

    for (const fiche of fiches) {
      const rappels = fiche.rappels;
      if (!Array.isArray(rappels) || rappels.length === 0) continue;

      const dus = rappels.filter((r) => {
        if (r.envoye || r.echec) return false;
        const date = r.dateRappel?.slice(0, 10);
        return !!date && date <= aujourdhui;
      });
      if (dus.length === 0) continue;

      // Adresse actuelle de la fiche : seule destination autorisée.
      const detail = await getFicheByToken(fiche.token);
      const emailFiche = detail?.email?.trim().toLowerCase();

      for (const rappel of dus) {
        const destinataireOk = !!emailFiche && rappel.email?.trim().toLowerCase() === emailFiche;
        const envoiOk = destinataireOk && (await sendRappelEmail({
          to: rappel.email,
          token: fiche.token,
          libelle: rappel.libelle,
          echeance: rappel.echeance,
          nomEntreprise: fiche.company_data?.nom,
        }));

        if (envoiOk) {
          rappel.envoye = true;
          envoyes++;
          continue;
        }

        echecs++;
        rappel.tentatives = (rappel.tentatives ?? 0) + 1;
        // Destinataire non conforme : inutile de réessayer.
        if (!destinataireOk || rappel.tentatives >= MAX_TENTATIVES) {
          rappel.echec = true;
          abandonnes++;
        }
        erreurs.push(
          `${destinataireOk ? 'échec envoi' : 'destinataire refusé'} pour ${tokenCourt(fiche.token)} (tentative ${rappel.tentatives})`,
        );
      }

      /* Sauvegarder les rappels mis à jour (envoyés, tentatives, échecs) */
      if (!(await setRappels(fiche.token, rappels))) {
        erreurs.push(`échec de mise à jour pour ${tokenCourt(fiche.token)}`);
      }
    }

    console.info(`[CRON rappels] ${envoyes} envoyé(s), ${echecs} échec(s), ${abandonnes} abandonné(s)`);
    if (erreurs.length > 0) {
      console.warn('[CRON rappels] détails :', erreurs.join(' ; '));
    }

    return NextResponse.json({
      envoyes,
      echecs,
      abandonnes,
      erreurs: erreurs.length > 0 ? erreurs : undefined,
    });
  } catch (e) {
    console.error('[CRON rappels]', e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
