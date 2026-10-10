import { describe, it, expect } from 'vitest';
import { ogMeta } from '../og';
import sitemap from '../../app/sitemap';
import robots from '../../app/robots';
import { COURRIERS } from '../courriers';

describe('ogMeta', () => {
  it('sans chemin : ni canonique ni og:url', () => {
    const m = ogMeta({ titre: 'Titre', description: 'Desc' });
    expect(m.alternates).toBeUndefined();
    expect((m.openGraph as { url?: string }).url).toBeUndefined();
    expect((m.openGraph as { locale?: string }).locale).toBe('fr_FR');
  });

  it('avec chemin : canonique et og:url', () => {
    const m = ogMeta({ titre: 'Titre', description: 'Desc', chemin: '/courriers/x' });
    expect(m.alternates?.canonical).toBe('/courriers/x');
    expect((m.openGraph as { url?: string }).url).toBe('/courriers/x');
  });
});

describe('sitemap', () => {
  const urls = sitemap().map((e) => e.url);

  it('contient les 17 courriers', () => {
    for (const c of COURRIERS) expect(urls).toContain(`https://solelis.com/courriers/${c.slug}`);
  });

  it('exclut /questionnaire et utilise une date fixe', () => {
    expect(urls).not.toContain('https://solelis.com/questionnaire');
    const dates = new Set(sitemap().map((e) => String(e.lastModified)));
    expect(dates.size).toBe(1);
  });
});

describe('robots', () => {
  it('autorise /api/og mais bloque /api/ et /fiche/', () => {
    const r = robots().rules as { allow: string[]; disallow: string[] };
    expect(r.allow).toContain('/api/og');
    expect(r.disallow).toEqual(expect.arrayContaining(['/api/', '/fiche/']));
  });
});
