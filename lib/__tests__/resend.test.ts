import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/* ─── mock resend ─── */

const mockSend = vi.fn();

vi.mock('resend', () => ({
  Resend: class MockResend {
    emails = { send: mockSend };
  },
}));

/* On importe après le mock pour que le module utilise la version mockée */
import { sendMagicLink, sendRappelEmail, nettoyerLibelleRappel, SUJET_RAPPEL } from '../resend';

describe('sendMagicLink', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RESEND_API_KEY = 'test-key-123';
    process.env.NEXT_PUBLIC_BASE_URL = 'https://test.solelis.com';
    process.env.RESEND_FROM = 'Test <test@example.com>';
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('sendMagicLink est une fonction exportée', () => {
    expect(typeof sendMagicLink).toBe('function');
  });

  it('n’envoie rien sans RESEND_FROM (pas de repli onboarding@resend.dev)', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    delete process.env.RESEND_FROM;
    const result = await sendMagicLink('test@example.com', 'abc123');
    expect(result).toBe(false);
    expect(mockSend).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('RESEND_FROM'));
    warn.mockRestore();
  });

  it('utilise une écriture inclusive et le lien APESA de la page /parler', async () => {
    mockSend.mockResolvedValueOnce({ error: null });
    await sendMagicLink('dirigeant@entreprise.fr', 'token-xyz');
    const { html } = mockSend.mock.calls[0][0];
    expect(html).toContain('épuisé·e ou perdu·e');
    expect(html).toContain('vous seul·e avez ce lien');
    expect(html).toContain('href="https://apesa.fr"');
  });

  it('retourne false si RESEND_API_KEY est absente', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    delete process.env.RESEND_API_KEY;
    // Force un nouveau module pour contourner le cache interne
    vi.resetModules();
    const mod = await import('../resend');
    const result = await mod.sendMagicLink('test@example.com', 'abc123');
    expect(result).toBe(false);
    expect(mockSend).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it('appelle Resend.emails.send avec les bons paramètres', async () => {
    mockSend.mockResolvedValueOnce({ error: null });

    const result = await sendMagicLink('dirigeant@entreprise.fr', 'token-xyz');

    expect(result).toBe(true);
    expect(mockSend).toHaveBeenCalledOnce();
    const appel = mockSend.mock.calls[0][0];
    expect(appel.to).toBe('dirigeant@entreprise.fr');
    expect(appel.from).toBe('Test <test@example.com>');
    expect(appel.subject).toContain('Solelis');
    expect(appel.html).toContain('https://test.solelis.com/fiche/token-xyz');
  });

  it('retourne false si Resend renvoie une erreur', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mockSend.mockResolvedValueOnce({ error: { name: 'validation_error', message: 'quota exceeded' } });

    const result = await sendMagicLink('test@example.com', 'token-err');

    expect(result).toBe(false);
    expect(warn).toHaveBeenCalledWith('[resend] envoi refusé :', 'validation_error', 'quota exceeded');
    warn.mockRestore();
  });

  it('retourne false si Resend lance une exception', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mockSend.mockRejectedValueOnce(new Error('network error'));

    const result = await sendMagicLink('test@example.com', 'token-crash');

    expect(result).toBe(false);
    warn.mockRestore();
  });
});

describe('nettoyerLibelleRappel', () => {
  it('retire URL, domaines, e-mails et numéros de téléphone', () => {
    const s = nettoyerLibelleRappel(
      'Payez ici https://evil.example/pay ou www.arnaque.fr, bit.ly/x, ecrire@pirate.io, tél. 06 12 34 56 78 / +33 1 23 45 67 89',
    );
    expect(s).not.toMatch(/https|evil|www|arnaque|bit\.ly|pirate|06 12|\+33|23 45/);
    expect(s).toContain('Payez ici');
  });

  it('conserve une date et un numéro court officiel', () => {
    expect(nettoyerLibelleRappel('URSSAF 3957 avant le 2026-11-15')).toBe('URSSAF 3957 avant le 2026-11-15');
  });

  it('limite à 80 caractères et supprime les retours à la ligne', () => {
    const s = nettoyerLibelleRappel(`ligne 1\nligne 2 ${'a'.repeat(200)}`);
    expect(s.length).toBeLessThanOrEqual(80);
    expect(s).not.toContain('\n');
  });

  it('donne un libellé par défaut si tout a été retiré', () => {
    expect(nettoyerLibelleRappel('https://evil.example')).toBe('Échéance à surveiller');
  });
});

describe('sendRappelEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RESEND_API_KEY = 'test-key-123';
    process.env.RESEND_FROM = 'Test <test@example.com>';
    process.env.NEXT_PUBLIC_BASE_URL = 'https://test.solelis.com';
  });

  it('utilise un sujet fixe qui ne contient jamais le libellé', async () => {
    mockSend.mockResolvedValueOnce({ error: null });
    const ok = await sendRappelEmail({
      to: 'moi@exemple.fr',
      token: 'tok-1',
      libelle: 'Votre compte est bloqué, appelez le 06 12 34 56 78',
      echeance: '2026-11-15',
      nomEntreprise: '<b>ACME</b>',
    });
    expect(ok).toBe(true);
    const appel = mockSend.mock.calls[0][0];
    expect(appel.subject).toBe(SUJET_RAPPEL);
    expect(appel.subject).toBe('Rappel Solelis : une échéance approche');
    expect(appel.html).not.toContain('06 12 34 56 78');
    expect(appel.html).toContain('&lt;b&gt;ACME&lt;/b&gt;');
    expect(appel.html).toContain('https://test.solelis.com/fiche/tok-1');
  });

  it('n’envoie rien sans RESEND_FROM', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    delete process.env.RESEND_FROM;
    const ok = await sendRappelEmail({ to: 'moi@exemple.fr', token: 't', libelle: 'x', echeance: '2026-11-15' });
    expect(ok).toBe(false);
    expect(mockSend).not.toHaveBeenCalled();
    warn.mockRestore();
  });
});
