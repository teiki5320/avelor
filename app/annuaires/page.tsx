import Link from 'next/link';

const ANNUAIRES = [
  {
    href: '/annuaires/ags',
    icone: '👥',
    titre: 'AGS — Délégations régionales',
    description: '13 délégations couvrant tout le territoire. Garantie des salaires en cas de procédure collective.',
    source: 'ags-garantie-salaires.org',
  },
  {
    href: '/annuaires/tae',
    icone: '🏛️',
    titre: 'Tribunaux des Activités Économiques (TAE)',
    description: '12 tribunaux expérimentent depuis le 1er janvier 2025 le traitement unifié des entreprises en difficulté (réforme).',
    source: 'Loi 2023-1059, decret 2024-1225',
  },
  {
    href: '/annuaires/mandataires',
    icone: '⚖️',
    titre: 'Mandataires judiciaires',
    description: 'Liste indicative des mandataires inscrits CNAJMJ par département.',
    source: 'cnajmj.fr',
  },
  {
    href: '/annuaires/cip',
    icone: '🤝',
    titre: 'CIP territoriaux (Centres d\'Information sur la Prévention)',
    description: 'Antennes proposant un RDV gratuit et confidentiel avec d\'anciens chefs d\'entreprise et professionnels bénévoles.',
    source: 'cip-national.fr',
  },
];

export default function AnnuairesPage() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-10 sm:py-14">
      <p className="mb-3 text-sm uppercase tracking-[0.2em] text-bleu-fonce/70">
        Sources officielles · gratuit et confidentiel
      </p>
      <h1 className="font-display text-3xl text-navy sm:text-5xl">
        Annuaires officiels
      </h1>
      <p className="mt-4 max-w-2xl text-base text-navy/70 sm:text-lg">
        Pour vous orienter vers les bons interlocuteurs : organismes
        publics, ordres professionnels et antennes spécialisées dans
        l&apos;accompagnement des entreprises en difficulté.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {ANNUAIRES.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="glass-soft block rounded-2xl p-5 transition hover:bg-white"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl" aria-hidden>{a.icone}</span>
              <div className="flex-1">
                <p className="font-display text-lg text-navy">{a.titre}</p>
                <p className="mt-1 text-sm text-navy/70">{a.description}</p>
                <p className="mt-2 text-[11px] text-navy/45">Source : {a.source}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
