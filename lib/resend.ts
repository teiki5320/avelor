import { Resend } from 'resend';

let cached: Resend | null = null;

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn('[resend] RESEND_API_KEY absente : e-mail non envoyé');
    return null;
  }
  if (cached) return cached;
  cached = new Resend(key);
  return cached;
}

/**
 * Expéditeur des e-mails. Pas de repli sur une adresse de test (onboarding@resend.dev) :
 * sans RESEND_FROM configurée, on n'envoie rien et on le signale dans les journaux.
 */
function getFrom(): string | null {
  const from = process.env.RESEND_FROM?.trim();
  if (!from) {
    console.warn('[resend] RESEND_FROM absente : e-mail non envoyé');
    return null;
  }
  return from;
}

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL ?? 'https://solelis.com';
}

/** Même adresse que la page /parler (app/parler/page.tsx). */
const APESA_URL = 'https://www.apesa-france.com';

/**
 * Échappe les caractères HTML d'une valeur venue de la base (libellé, échéance,
 * nom d'entreprise) : ces champs sont saisis côté client et seraient sinon
 * injectés tels quels dans le HTML de l'email (phishing depuis le domaine Solelis).
 */
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export const LIBELLE_RAPPEL_MAX = 80;

/**
 * Nettoie le libellé d'un rappel avant de l'afficher dans un e-mail envoyé depuis
 * le domaine Solelis : retire tout ce qui ressemble à une URL, une adresse e-mail
 * ou un numéro de téléphone (anti-hameçonnage), les caractères de contrôle, puis
 * limite à 80 caractères. Le texte retourné n'est PAS échappé (voir escapeHtml).
 */
export function nettoyerLibelleRappel(brut: unknown): string {
  let s = String(brut ?? '');
  // Caractères de contrôle et retours à la ligne
  // eslint-disable-next-line no-control-regex
  s = s.replace(/[\u0000-\u001F\u007F-\u009F]/g, ' ');
  // URL explicites (schéma ou www.)
  s = s.replace(/\b(?:[a-z][a-z0-9+.-]*:\/\/|www\.)\S*/gi, ' ');
  // Adresses e-mail
  s = s.replace(/\S+@\S+/g, ' ');
  // Noms de domaine nus (exemple.com, bit.ly/xyz…)
  s = s.replace(/\b(?:[a-z0-9-]+\.)+[a-z]{2,}\b(?:\/\S*)?/gi, ' ');
  // Numéros de téléphone : 9 chiffres ou plus, séparateurs usuels autorisés
  // (une date AAAA-MM-JJ, 8 chiffres, est conservée).
  s = s.replace(/(?:\+|\b00)?\d(?:[\s.\-/()]*\d){8,}/g, ' ');
  s = s.replace(/\s+/g, ' ').trim();
  if (s.length > LIBELLE_RAPPEL_MAX) {
    s = `${s.slice(0, LIBELLE_RAPPEL_MAX - 1).trimEnd()}…`;
  }
  return s || 'Échéance à surveiller';
}

export async function sendMagicLink(email: string, token: string): Promise<boolean> {
  const resend = getResend();
  if (!resend) return false;
  const from = getFrom();
  if (!from) return false;
  const url = `${getBaseUrl()}/fiche/${encodeURIComponent(token)}`;

  try {
    const { error } = await resend.emails.send({
      from,
      to: email,
      subject: 'Votre fiche Solelis est prête',
      html: `
<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:32px;color:#0A1628">
  <h1 style="font-family:'Playfair Display',Georgia,serif;font-size:28px;margin:0 0 16px">Solelis</h1>
  <p style="font-size:16px;line-height:1.6">Bonjour,</p>
  <p style="font-size:16px;line-height:1.6">Voici le lien vers votre fiche personnelle. Prenez le temps de la lire. Vous n'avez pas à tout résoudre aujourd'hui — commencez par une seule chose.</p>
  <p style="margin:32px 0">
    <a href="${url}" style="background:#1E3D82;color:white;padding:14px 24px;border-radius:12px;text-decoration:none;font-family:sans-serif">Ouvrir ma fiche</a>
  </p>
  <p style="font-size:14px;color:#4A72B8;line-height:1.6">Si vous vous sentez épuisé·e ou perdu·e, APESA est disponible gratuitement et en confidentialité — <a href="${APESA_URL}" style="color:#4A72B8">apesa-france.com</a></p>
  <p style="font-size:13px;color:#7c8597;margin-top:32px">Solelis · fiche confidentielle · vous seul·e avez ce lien</p>
</div>`,
    });
    if (error) {
      // Raison donnée par Resend (domaine non vérifié, adresse refusée…) — jamais la clé.
      console.warn('[resend] envoi refusé :', error.name ?? '', error.message ?? '');
      return false;
    }
    return true;
  } catch (e) {
    console.warn('[resend] échec de la requête', e instanceof Error ? e.message : '');
    return false;
  }
}

export const SUJET_RAPPEL = 'Rappel Solelis : une échéance approche';

export interface RappelEmail {
  to: string;
  token: string;
  libelle: string;
  echeance: string;
  nomEntreprise?: string;
}

/**
 * Envoie l'e-mail d'un rappel programmé. Le sujet est fixe : le libellé saisi
 * par l'utilisateur·rice n'y apparaît jamais ; dans le corps, il est nettoyé
 * (nettoyerLibelleRappel) puis échappé.
 */
export async function sendRappelEmail(rappel: RappelEmail): Promise<boolean> {
  const resend = getResend();
  if (!resend) return false;
  const from = getFrom();
  if (!from) return false;

  const nomEntreprise = escapeHtml(String(rappel.nomEntreprise || 'votre entreprise').slice(0, 120));
  const libelle = escapeHtml(nettoyerLibelleRappel(rappel.libelle));
  const echeance = escapeHtml(String(rappel.echeance ?? '').slice(0, 10));
  const lienFiche = `${getBaseUrl()}/fiche/${encodeURIComponent(rappel.token)}`;

  try {
    const { error } = await resend.emails.send({
      from,
      to: rappel.to,
      subject: SUJET_RAPPEL,
      html: `
<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:32px;color:#0A1628">
  <h1 style="font-family:'Playfair Display',Georgia,serif;font-size:24px;margin:0 0 16px">Solelis</h1>
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
  <p style="font-size:14px;color:#4A72B8;line-height:1.6">Si vous vous sentez épuisé·e ou perdu·e, APESA est disponible gratuitement et en confidentialité — <a href="${APESA_URL}" style="color:#4A72B8">apesa-france.com</a></p>
  <p style="font-size:13px;color:#7c8597;margin-top:32px">Solelis · rappel automatique · vous seul·e avez ce lien</p>
</div>`,
    });

    if (error) {
      console.warn('[resend] rappel refusé :', error.name ?? '', error.message ?? '');
      return false;
    }
    return true;
  } catch (e) {
    console.warn('[resend] échec de la requête (rappel)', e instanceof Error ? e.message : '');
    return false;
  }
}
