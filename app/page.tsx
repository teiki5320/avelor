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
  { href: '/accompagnant', icone: '🤝', label: 'J\'accompagne', desc: 'Pour les proches' },
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
