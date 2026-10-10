import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { middleware, config } from '@/middleware';

function requete(chemin: string, ip?: string, method = 'GET'): NextRequest {
  const headers: Record<string, string> = {};
  if (ip) headers['cf-connecting-ip'] = ip;
  return new NextRequest(`http://localhost${chemin}`, { method, headers });
}

describe('middleware — rate limiting', () => {
  it('couvre les fiches en plus des API', () => {
    expect(config.matcher).toContain('/fiche/:path*');
  });

  it('limite l’affichage des fiches à 30 requêtes par minute et par IP', () => {
    const ip = '203.0.113.10';
    for (let i = 0; i < 30; i++) {
      expect(middleware(requete('/fiche/abcdef0123456789abcdef01', ip)).status).not.toBe(429);
    }
    const bloque = middleware(requete('/fiche/abcdef0123456789abcdef01', ip));
    expect(bloque.status).toBe(429);
    expect(bloque.headers.get('content-type')).toContain('text/html');
    // Une autre IP n'est pas affectée
    expect(middleware(requete('/fiche/abcdef0123456789abcdef01', '203.0.113.11')).status).not.toBe(429);
  });

  it('sans IP identifiable, ne compte pas (pas de clé « unknown » partagée)', () => {
    for (let i = 0; i < 50; i++) {
      expect(middleware(requete('/api/fiche/send-link', undefined, 'POST')).status).not.toBe(429);
    }
  });

  it('limite send-link à 5 par minute pour une IP', () => {
    const ip = '203.0.113.20';
    for (let i = 0; i < 5; i++) {
      expect(middleware(requete('/api/fiche/send-link', ip, 'POST')).status).not.toBe(429);
    }
    expect(middleware(requete('/api/fiche/send-link', ip, 'POST')).status).toBe(429);
  });
});
