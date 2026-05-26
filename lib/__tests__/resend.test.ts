import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/* ─── mock resend ─── */

const mockSend = vi.fn();

vi.mock('resend', () => ({
  Resend: class MockResend {
    emails = { send: mockSend };
  },
}));

/* On importe après le mock pour que le module utilise la version mockée */
import { sendMagicLink } from '../resend';

describe('sendMagicLink', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RESEND_API_KEY = 'test-key-123';
    process.env.NEXT_PUBLIC_BASE_URL = 'https://test.avelor.fr';
    process.env.RESEND_FROM = 'Test <test@example.com>';
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('sendMagicLink est une fonction exportée', () => {
    expect(typeof sendMagicLink).toBe('function');
  });

  it('retourne false si RESEND_API_KEY est absente', async () => {
    delete process.env.RESEND_API_KEY;
    // Force un nouveau module pour contourner le cache interne
    vi.resetModules();
    const mod = await import('../resend');
    const result = await mod.sendMagicLink('test@example.com', 'abc123');
    expect(result).toBe(false);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('appelle Resend.emails.send avec les bons paramètres', async () => {
    mockSend.mockResolvedValueOnce({ error: null });

    const result = await sendMagicLink('dirigeant@entreprise.fr', 'token-xyz');

    expect(result).toBe(true);
    expect(mockSend).toHaveBeenCalledOnce();
    const appel = mockSend.mock.calls[0][0];
    expect(appel.to).toBe('dirigeant@entreprise.fr');
    expect(appel.from).toBe('Test <test@example.com>');
    expect(appel.subject).toContain('AVELOR');
    expect(appel.html).toContain('https://test.avelor.fr/fiche/token-xyz');
  });

  it('retourne false si Resend renvoie une erreur', async () => {
    mockSend.mockResolvedValueOnce({ error: { message: 'quota exceeded' } });

    const result = await sendMagicLink('test@example.com', 'token-err');

    expect(result).toBe(false);
  });

  it('retourne false si Resend lance une exception', async () => {
    mockSend.mockRejectedValueOnce(new Error('network error'));

    const result = await sendMagicLink('test@example.com', 'token-crash');

    expect(result).toBe(false);
  });
});
