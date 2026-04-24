import Link from 'next/link';

interface Outil {
  href: string;
  icone: string;
  titre: string;
  description: string;
  source: string;
  badge?: string;
}

const OUTILS: Outil[] = [
  {
    href: '/outils/prescription',
    icone: '⏰',
    titre: 'Vérificateur de prescription',
    description:
      "Saisir une dette → date de prescription. URSSAF 3 ans, fiscal 4 ans, civil 5 ans, baux 1 an.",
    source: 'CSS L244-3, LPF L169, C. civ. 2224',
  },
  {
    href: '/outils/licenciement',
    icone: '📄',
    titre: 'Indemnité de licenciement économique',
    description:
      "Calcul selon ancienneté et salaire brut. Plafond AGS 2025 : 92 736 €.",
    source: 'C. trav. L1234-9, ags-garantie-salaires.org',
  },
  {
    href: '/outils/ati',
    icone: '🪙',
    titre: 'Estimateur ATI (chômage indépendant)',
    description:
      "Éligibilité et montant : 26,30 €/jour pendant 6 mois après cessation involontaire.",
    source: 'francetravail.fr',
  },
  {
    href: '/outils/cout-procedures',
    icone: '⚖️',
    titre: 'Comparateur du coût des procédures',
    description:
      "Mandat ad hoc, conciliation, sauvegarde, RJ : frais de greffe et fourchettes mandataires.",
    source: 'CNAJMJ, décret 85-1389',
  },
  {
    href: '/outils/aide-juridictionnelle',
    icone: '🤝',
    titre: 'Calculateur d\'aide juridictionnelle',
    description:
      "Éligibilité selon revenu fiscal de référence et composition du foyer (plafonds 2025).",
    source: 'Loi 91-647, service-public.fr',
  },
  {
    href: '/outils/acre-arce',
    icone: '🚀',
    titre: 'Vérificateur ACRE / ARCE',
    description:
      "Éligibilité aux dispositifs de rebond après une cessation : exonération de cotisations ou versement en capital.",
    source: 'urssaf.fr, francetravail.fr',
  },
  {
    href: '/outils/calendrier-fiscal',
    icone: '📆',
    titre: 'Calendrier fiscal personnalisé',
    description:
      "Échéances à venir selon votre régime : TVA, IS, CFE, taxe foncière, DSN.",
    source: 'impots.gouv.fr, urssaf.fr',
  },
  {
    href: '/outils/data-room',
    icone: '📦',
    titre: 'Préparateur de data room (cession)',
    description:
      "Checklist officielle des pièces à rassembler pour céder votre entreprise.",
    source: 'Bpifrance Création, CRA',
  },
  {
    href: '/outils/valorisation',
    icone: '💎',
    titre: 'Valorisation indicative',
    description:
      "Multiples sectoriels appliqués à votre EBE et CA. Fourchette pour préparer une cession.",
    source: 'Bpifrance, INSEE Esane',
  },
];

export default function OutilsPage() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-10 sm:py-14">
      <p className="mb-3 text-sm uppercase tracking-[0.2em] text-bleu-fonce/70">
        Calculateurs · annuaires · check-lists
      </p>
      <h1 className="font-display text-3xl text-navy sm:text-5xl">
        Boîte à outils
      </h1>
      <p className="mt-4 max-w-2xl text-base text-navy/70 sm:text-lg">
        Des calculateurs et vérificateurs basés exclusivement sur les
        textes officiels (Code de commerce, Code du travail, sites
        gouvernementaux). Tout ce que vous saisissez reste dans votre
        navigateur.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {OUTILS.map((o) => (
          <Link
            key={o.href}
            href={o.href}
            className="glass-soft block rounded-2xl p-5 transition hover:bg-white"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl" aria-hidden>
                {o.icone}
              </span>
              <div className="flex-1">
                <p className="font-display text-lg text-navy">{o.titre}</p>
                <p className="mt-1 text-sm text-navy/70">{o.description}</p>
                <p className="mt-2 text-[11px] text-navy/45">
                  Source : {o.source}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-navy/10 bg-white/60 p-5 text-sm text-navy/70">
        <p className="font-display text-base text-navy">
          À venir : annuaires officiels
        </p>
        <p className="mt-1">
          Mandataires judiciaires (CNAJMJ), CIP territoriaux, AGS
          régionales, Tribunaux des Activités Économiques (réforme 2025).
        </p>
      </div>
    </section>
  );
}
