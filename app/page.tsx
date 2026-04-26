import Link from 'next/link';
import SiretInput from '@/components/SiretInput';
import RetourFiche from '@/components/RetourFiche';

const RESSOURCES = [
  { href: '/courriers', icone: '✉️', label: 'Courriers types', desc: '12 modèles prêts à l\'emploi' },
  { href: '/aides', icone: '💶', label: 'Aides entreprise', desc: 'Toutes les aides existantes' },
  { href: '/aides-personnelles', icone: '🧑', label: 'Droits personnels', desc: 'ATI, CSS, aide juridictionnelle…' },
  { href: '/proteger-famille', icone: '🏠', label: 'Protéger ma famille', desc: 'Résidence, conjoint, cautions' },
  { href: '/vendre', icone: '🔑', label: 'Vendre / Céder', desc: 'Cession, location-gérance…' },
  { href: '/procedures', icone: '⚖️', label: 'Procédures', desc: 'Tableau comparatif clair' },
  { href: '/rebond', icone: '🚀', label: 'Rebondir', desc: 'Recréer après une liquidation' },
  { href: '/glossaire', icone: '📖', label: 'Glossaire', desc: '19 termes expliqués simplement' },
  { href: '/outils', icone: '🧮', label: 'Boîte à outils', desc: 'Calculateurs et vérificateurs officiels' },
  { href: '/annuaires', icone: '📇', label: 'Annuaires officiels', desc: 'AGS, TAE, mandataires, CIP…' },
  { href: '/parler', icone: '📞', label: 'Parler à quelqu\'un', desc: 'Numéros gratuits 24/7' },
];

export default function HomePage() {
  return (
    <section className="mx-auto max-w-3xl px-5 pt-6 pb-20 text-center sm:pt-14">
      <p className="mb-4 text-sm uppercase tracking-[0.2em] text-bleu-fonce/70">
        Gratuit · confidentiel · humain
      </p>
      <h1 className="font-display text-4xl leading-tight text-navy sm:text-6xl">
        Vous êtes dirigeant, <br />
        et quelque chose coince.
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-base text-navy/70 sm:text-lg">
        AVELOR vous aide à y voir clair — en quelques minutes, avec les bons
        interlocuteurs autour de vous. Vous n&apos;avez pas à tout résoudre
        aujourd&apos;hui.
      </p>
      <SiretInput />
      <RetourFiche />
      <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-sm text-navy/60">
        <span className="pastille">⏱ 4 minutes</span>
        <span className="pastille">🔒 Anonyme</span>
        <span className="pastille">✉︎ Sauvegarde par email</span>
        <span className="pastille">🤝 Sans jugement</span>
      </div>

      {/* Bandeau dédié pour les accompagnants */}
      <Link
        href="/accompagnant"
        className="group mt-10 block overflow-hidden rounded-3xl border border-vert/30 bg-gradient-to-br from-vert/10 via-white/60 to-vert/15 p-6 text-left shadow-sm transition hover:shadow-md sm:mt-12 sm:p-8"
      >
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/70 text-3xl shadow-sm sm:h-20 sm:w-20 sm:text-4xl"
            aria-hidden
          >
            🤝
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-vert">
              Vous accompagnez un proche ?
            </p>
            <h2 className="mt-1 font-display text-xl text-navy sm:text-2xl">
              Conjoint, associé, ami, salarié, expert… cette voie est pour vous.
            </h2>
            <p className="mt-2 text-sm text-navy/75 sm:text-base">
              Pas besoin du SIRET. Trois questions pour comprendre la situation
              et vous orienter vers les bonnes ressources : APESA, 3114, CCI,
              guides pour ouvrir le dialogue, soutien aux proches.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 self-start rounded-full bg-vert px-5 py-3 text-sm font-medium text-white shadow-sm transition group-hover:translate-x-1 sm:self-center">
            Démarrer mon parcours
            <span aria-hidden>→</span>
          </span>
        </div>
      </Link>

      <div className="mt-16">
        <h2 className="font-display text-2xl text-navy">
          Ressources gratuites
        </h2>
        <p className="mt-2 text-sm text-navy/60">
          Même sans SIRET, vous pouvez accéder à ces outils.
        </p>
        <div className="mt-6 grid gap-3 text-left sm:grid-cols-2 lg:grid-cols-3">
          {RESSOURCES.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className="glass-soft flex items-start gap-3 p-4 transition hover:bg-white"
            >
              <span className="mt-0.5 text-xl" aria-hidden>{r.icone}</span>
              <div>
                <p className="font-display text-base text-navy">{r.label}</p>
                <p className="mt-0.5 text-xs text-navy/55">{r.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <p className="mt-14 text-sm text-navy/50">
        Si vous vous sentez épuisé·e ou perdu·e, APESA est disponible dès
        aujourd&apos;hui, gratuitement et en confidentialité —{' '}
        <a
          href="https://apesa.fr"
          target="_blank"
          rel="noreferrer"
          className="text-bleu-fonce underline underline-offset-4"
        >
          apesa.fr
        </a>
      </p>
    </section>
  );
}
