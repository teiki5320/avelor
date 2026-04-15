import { Resend } from 'resend';

let cached: Resend | null = null;

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (cached) return cached;
  cached = new Resend(key);
  return cached;
}

export async function sendMagicLink(email: string, token: string): Promise<boolean> {
  const resend = getResend();
  if (!resend) return false;
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://avelor.fr';
  const url = `${base}/fiche/${token}`;

  try {
    const { error } = await resend.emails.send({
      from: 'AVELOR <bonjour@avelor.fr>',
      to: email,
      subject: 'Votre fiche AVELOR est prête',
      html: `
<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:32px;color:#0A1628">
  <h1 style="font-family:'Playfair Display',Georgia,serif;font-size:28px;margin:0 0 16px">AVELOR</h1>
  <p style="font-size:16px;line-height:1.6">Bonjour,</p>
  <p style="font-size:16px;line-height:1.6">Voici le lien vers votre fiche personnelle. Prenez le temps de la lire. Vous n'avez pas à tout résoudre aujourd'hui — commencez par une seule chose.</p>
  <p style="margin:32px 0">
    <a href="${url}" style="background:#1E3D82;color:white;padding:14px 24px;border-radius:12px;text-decoration:none;font-family:sans-serif">Ouvrir ma fiche</a>
  </p>
  <p style="font-size:14px;color:#4A72B8;line-height:1.6">Si vous vous sentez épuisé ou perdu, APESA est disponible gratuitement et en confidentialité — <a href="https://apesa.fr" style="color:#4A72B8">apesa.fr</a></p>
  <p style="font-size:13px;color:#7c8597;margin-top:32px">AVELOR · fiche confidentielle · vous seul avez ce lien</p>
</div>`,
    });
    return !error;
  } catch {
    return false;
  }
}
