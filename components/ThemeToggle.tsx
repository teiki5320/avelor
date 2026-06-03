'use client';
import { useEffect, useState } from 'react';

type Theme = 'clair' | 'sombre' | 'contraste';

const THEMES: { value: Theme; label: string; icone: string; attr: string }[] = [
  { value: 'clair', label: 'Clair', icone: '☀️', attr: '' },
  { value: 'sombre', label: 'Sombre', icone: '🌙', attr: 'dark' },
  { value: 'contraste', label: 'Contraste élevé', icone: '◐', attr: 'contrast' },
];

const STORAGE_KEY = 'avelor_theme';

function applyTheme(theme: Theme) {
  const def = THEMES.find((t) => t.value === theme) ?? THEMES[0];
  const root = document.documentElement;
  if (def.attr) root.setAttribute('data-theme', def.attr);
  else root.removeAttribute('data-theme');
  // Met à jour la couleur de barre (mobile)
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute(
      'content',
      def.attr === 'dark' ? '#0A1220' : def.attr === 'contrast' ? '#ffffff' : '#1E3D82',
    );
  }
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('clair');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (saved && THEMES.some((t) => t.value === saved)) setTheme(saved);
    } catch {}
  }, []);

  // Fermeture au clavier (Escape) tant que le menu est ouvert.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  function choose(t: Theme) {
    setTheme(t);
    setOpen(false);
    applyTheme(t);
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {}
  }

  const current = THEMES.find((t) => t.value === theme) ?? THEMES[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Apparence : ${current.label}. Changer de thème`}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-navy/15 bg-white/70 text-base transition hover:bg-white"
      >
        <span aria-hidden>{current.icone}</span>
      </button>
      {open && (
        <>
          {/* Overlay de fermeture : invisible, mais on lui donne un fond
              légèrement teinté + curseur pointer pour signaler au moins
              visuellement que le clic ferme le menu. Z-index inférieur
              au menu pour ne pas intercepter les clics du menu lui-même. */}
          <button
            type="button"
            aria-label="Fermer le menu de thème"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-pointer bg-navy/[0.02]"
          />
          <div
            role="menu"
            aria-label="Choix du thème"
            className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-navy/10 bg-white/95 p-1 shadow-glass backdrop-blur-xl"
          >
            {THEMES.map((t) => (
              <button
                key={t.value}
                type="button"
                role="menuitemradio"
                aria-checked={theme === t.value}
                onClick={() => choose(t.value)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition hover:bg-navy/5 ${
                  theme === t.value ? 'font-medium text-navy' : 'text-navy/70'
                }`}
              >
                <span aria-hidden className="text-base">{t.icone}</span>
                <span className="flex-1">{t.label}</span>
                {theme === t.value && <span aria-hidden className="text-bleu-fonce">✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
