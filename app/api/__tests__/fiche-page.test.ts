import { describe, it, expect, vi, beforeEach } from 'vitest';

const getFicheByToken = vi.fn(async (_t: string) => null);
let valeurCookie: string | undefined;

vi.mock('@/lib/db', () => ({
  getFicheByToken: (t: string) => getFicheByToken(t),
  getFicheByTokenMemo: (t: string) => getFicheByToken(t),
}));
vi.mock('@/lib/sirene', () => ({
  fetchSirene: vi.fn(async (siret: string) => ({ siret, nom: 'ACME', departement: '75', ville: 'Paris' })),
}));
vi.mock('next/headers', () => ({
  cookies: async () => ({
    get: (nom: string) => (nom === 'solelis_fiche_locale' && valeurCookie ? { value: valeurCookie } : undefined),
  }),
}));

import FichePage from '@/app/fiche/[token]/page';
import FicheTokenLayout from '@/app/fiche/[token]/layout';

function props(token: string, d?: string) {
  return { params: Promise.resolve({ token }), searchParams: Promise.resolve(d ? { d } : {}) };
}

/** notFound() de Next lève une erreur dont le digest porte le code 404. */
async function attendre404(p: Promise<unknown>) {
  await expect(p).rejects.toMatchObject({ digest: expect.stringContaining('404') });
}

describe('page /fiche/[token]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    valeurCookie = undefined;
  });

  it('fiche inconnue : notFound() remonte jusqu’à Next (vrai 404)', async () => {
    await attendre404(FichePage(props('abcdef0123456789abcdef01')));
    expect(getFicheByToken).toHaveBeenCalledWith('abcdef0123456789abcdef01');
  });

  it('token mal formé : 404 sans interroger la base', async () => {
    await attendre404(FichePage(props('../../etc')));
    expect(getFicheByToken).not.toHaveBeenCalled();
  });

  it('/fiche/local sans données : rend le composant client qui relit l’onglet', async () => {
    const rendu = (await FichePage(props('local'))) as { type: { name?: string } };
    expect(rendu.type.name).toBe('FicheLocale');
  });

  it('/fiche/local?d= avec des réponses hors schéma : pas de fiche rendue', async () => {
    const d = Buffer.from(JSON.stringify({ siret: '12345678901234', reponses: { situation: 'x' } })).toString('base64');
    const rendu = (await FichePage(props('local', d))) as { type: { name?: string } };
    expect(rendu.type.name).toBe('FicheLocale');
  });
});

describe('layout /fiche/[token] (avant la frontière de chargement)', () => {
  const layout = (token: string) =>
    FicheTokenLayout({ children: 'contenu', params: Promise.resolve({ token }) });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('token inconnu : 404 avant tout streaming', async () => {
    await attendre404(layout('abcdef0123456789abcdef01'));
  });

  it('token mal formé : 404 sans interroger la base', async () => {
    await attendre404(layout('../../etc'));
    expect(getFicheByToken).not.toHaveBeenCalled();
  });

  it('fiche existante : rend la page', async () => {
    getFicheByToken.mockResolvedValueOnce({ token: 'x' } as never);
    expect(await layout('abcdef0123456789abcdef01')).toBe('contenu');
  });

  it('« local » : laissé à la page', async () => {
    expect(await layout('local')).toBe('contenu');
    expect(getFicheByToken).not.toHaveBeenCalled();
  });
});
