import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { FicheRecord, Rappel } from '@/lib/types';
import type { FicheAvecRappels } from '@/lib/db';
import type { RappelEmail } from '@/lib/resend';

const fichesAvecRappels = vi.fn<() => Promise<FicheAvecRappels[]>>();
const getFicheByToken = vi.fn<(token: string) => Promise<FicheRecord | null>>();
const setRappels = vi.fn<(token: string, r: Rappel[]) => Promise<boolean>>(async () => true);
const sendRappelEmail = vi.fn<(r: RappelEmail) => Promise<boolean>>(async () => true);

vi.mock('@/lib/db', () => ({
  getDb: () => ({}),
  fichesAvecRappels: () => fichesAvecRappels(),
  getFicheByToken: (t: string) => getFicheByToken(t),
  setRappels: (t: string, r: Rappel[]) => setRappels(t, r),
}));
vi.mock('@/lib/resend', () => ({
  sendRappelEmail: (r: RappelEmail) => sendRappelEmail(r),
}));

import { GET } from '@/app/api/cron/rappels/route';

const TOKEN = 'abcdef0123456789abcdef01';
const hier = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);

function rappel(partiel: Partial<Rappel> = {}): Rappel {
  return {
    email: 'moi@exemple.fr',
    echeance: hier,
    dateRappel: hier,
    libelle: 'TVA',
    cree_le: '2026-01-01T00:00:00Z',
    envoye: false,
    ...partiel,
  };
}

function ficheAvec(rappels: Rappel[]): FicheAvecRappels {
  return {
    token: TOKEN,
    siret: '12345678901234',
    rappels,
    company_data: { nom: 'ACME' } as FicheAvecRappels['company_data'],
  };
}

function requete(): Request {
  return new Request('http://localhost/api/cron/rappels', { headers: { authorization: 'Bearer secret' } });
}

describe('GET /api/cron/rappels', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sendRappelEmail.mockResolvedValue(true);
    process.env.CRON_SECRET = 'secret';
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    getFicheByToken.mockResolvedValue({
      token: TOKEN,
      siret: '12345678901234',
      reponses: {} as FicheRecord['reponses'],
      company_data: {} as FicheRecord['company_data'],
      email: 'moi@exemple.fr',
    });
  });
  afterEach(() => {
    delete process.env.CRON_SECRET;
    vi.restoreAllMocks();
  });

  it('refuse sans le bon secret', async () => {
    const res = await GET(new Request('http://localhost/api/cron/rappels'));
    expect(res.status).toBe(401);
  });

  it('envoie les rappels dus, les marque envoyés et journalise le bilan', async () => {
    const r = rappel();
    fichesAvecRappels.mockResolvedValueOnce([ficheAvec([r])]);
    const res = await GET(requete());
    expect(await res.json()).toMatchObject({ envoyes: 1, echecs: 0 });
    expect(r.envoye).toBe(true);
    expect(setRappels).toHaveBeenCalledOnce();
    expect(sendRappelEmail).toHaveBeenCalledWith(expect.objectContaining({ to: 'moi@exemple.fr', token: TOKEN }));
    expect(console.info).toHaveBeenCalledWith(expect.stringContaining('1 envoyé(s)'));
  });

  it('compte les tentatives et abandonne après 3 échecs', async () => {
    sendRappelEmail.mockResolvedValue(false);
    const r = rappel({ tentatives: 1 });
    fichesAvecRappels.mockResolvedValue([ficheAvec([r])]);

    await GET(requete());
    expect(r.tentatives).toBe(2);
    expect(r.echec).toBeUndefined();

    await GET(requete());
    expect(r.tentatives).toBe(3);
    expect(r.echec).toBe(true);

    sendRappelEmail.mockClear();
    await GET(requete());
    expect(sendRappelEmail).not.toHaveBeenCalled();
  });

  it('n’envoie pas un rappel dont l’adresse diffère de celle de la fiche', async () => {
    const r = rappel({ email: 'victime@exemple.fr' });
    fichesAvecRappels.mockResolvedValueOnce([ficheAvec([r])]);
    const res = await GET(requete());
    expect(sendRappelEmail).not.toHaveBeenCalled();
    expect(r.echec).toBe(true);
    expect((await res.json()).abandonnes).toBe(1);
  });

  it('ignore les rappels futurs', async () => {
    const plusTard = new Date(Date.now() + 2 * 86_400_000).toISOString().slice(0, 10);
    fichesAvecRappels.mockResolvedValueOnce([ficheAvec([rappel({ dateRappel: plusTard })])]);
    await GET(requete());
    expect(sendRappelEmail).not.toHaveBeenCalled();
    expect(setRappels).not.toHaveBeenCalled();
  });
});
