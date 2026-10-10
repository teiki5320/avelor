import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { FicheRecord } from '@/lib/types';

const getFicheByToken = vi.fn<(token: string) => Promise<FicheRecord | null>>();
const updateFicheEmail = vi.fn<(token: string, email: string) => Promise<boolean>>(async () => true);
const sendMagicLink = vi.fn<(email: string, token: string) => Promise<boolean>>(async () => true);

vi.mock('@/lib/db', () => ({
  getFicheByToken: (t: string) => getFicheByToken(t),
  updateFicheEmail: (t: string, e: string) => updateFicheEmail(t, e),
}));
vi.mock('@/lib/resend', () => ({
  sendMagicLink: (e: string, t: string) => sendMagicLink(e, t),
}));

import { POST } from '@/app/api/fiche/send-link/route';

const TOKEN = 'abcdef0123456789abcdef01';

function fiche(email?: string): FicheRecord {
  return {
    token: TOKEN,
    siret: '12345678901234',
    reponses: { situation: 'prevention', probleme: 'urssaf', effectif: 'independant', moral: 'combatif' },
    company_data: {} as FicheRecord['company_data'],
    email,
  };
}

function requete(body: unknown): Request {
  return new Request('http://localhost/api/fiche/send-link', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('POST /api/fiche/send-link', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renvoie 400 si le corps n’est pas du JSON', async () => {
    const res = await POST(requete('pas du json'));
    expect(res.status).toBe(400);
  });

  it('renvoie 404 pour une fiche inconnue', async () => {
    getFicheByToken.mockResolvedValueOnce(null);
    const res = await POST(requete({ token: TOKEN, email: 'a@exemple.fr' }));
    expect(res.status).toBe(404);
    expect(sendMagicLink).not.toHaveBeenCalled();
  });

  it('enregistre l’adresse et envoie le lien la première fois', async () => {
    getFicheByToken.mockResolvedValueOnce(fiche());
    const res = await POST(requete({ token: TOKEN, email: 'a@exemple.fr' }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ sent: true });
    expect(updateFicheEmail).toHaveBeenCalledWith(TOKEN, 'a@exemple.fr');
    expect(sendMagicLink).toHaveBeenCalledWith('a@exemple.fr', TOKEN);
  });

  it('refuse (409) une adresse différente de celle déjà liée à la fiche', async () => {
    getFicheByToken.mockResolvedValueOnce(fiche('a@exemple.fr'));
    const res = await POST(requete({ token: TOKEN, email: 'victime@exemple.fr' }));
    expect(res.status).toBe(409);
    expect((await res.json()).error).toMatch(/déjà liée/);
    expect(sendMagicLink).not.toHaveBeenCalled();
    expect(updateFicheEmail).not.toHaveBeenCalled();
  });

  it('autorise le renvoi vers la même adresse (casse ignorée)', async () => {
    getFicheByToken.mockResolvedValueOnce(fiche('A@Exemple.fr'));
    const res = await POST(requete({ token: TOKEN, email: 'a@exemple.fr' }));
    expect(res.status).toBe(200);
    expect(sendMagicLink).toHaveBeenCalledOnce();
    expect(updateFicheEmail).not.toHaveBeenCalled();
  });

  it('n’envoie rien si l’adresse ne peut pas être enregistrée (503)', async () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => {});
    getFicheByToken.mockResolvedValueOnce(fiche());
    updateFicheEmail.mockResolvedValueOnce(false);
    const res = await POST(requete({ token: TOKEN, email: 'a@exemple.fr' }));
    expect(res.status).toBe(503);
    expect(sendMagicLink).not.toHaveBeenCalled();
    err.mockRestore();
  });

  it('renvoie sent:false quand l’envoi échoue', async () => {
    getFicheByToken.mockResolvedValueOnce(fiche());
    sendMagicLink.mockResolvedValueOnce(false);
    const res = await POST(requete({ token: TOKEN, email: 'a@exemple.fr' }));
    expect(await res.json()).toEqual({ sent: false });
  });
});
