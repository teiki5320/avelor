import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AVELOR · Témoignages',
  description: 'Des dirigeants racontent comment ils ont traversé la difficulté.',
};

interface Temoignage {
  prenom: string;
  situation: string;
  secteur: string;
  annee: string;
  texte: string;
  issue: string;
}

const TEMOIGNAGES: Temoignage[] = [
  {
    prenom: 'Nous cherchons des témoignages',
    situation: '',
    secteur: '',
    annee: '',
    texte:
      'AVELOR souhaite publier ici de vrais témoignages de dirigeants qui ont traversé des difficultés — et qui acceptent de partager leur expérience pour aider d\'autres dirigeants. Chaque témoignage serait anonymisé si vous le souhaitez. Si vous avez vécu cette épreuve et que vous êtes prêt·e à en parler, contactez-nous.',
    issue: '',
  },
];

export default function TemoignagesPage() {
  const hasReal = TEMOIGNAGES.length > 1 || TEMOIGNAGES[0].situation !== '';

  return (
    <section className="mx-auto max-w-3xl px-5 pb-24">
      <div className="mb-10 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-bleu-fonce/70">
          Histoires vraies
        </p>
        <h1 className="mt-2 font-display text-3xl text-navy sm:text-5xl">
          Ils sont passés par là
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-navy/70">
          Ces dirigeants ont traversé la difficulté. Leur parcours montre
          qu&apos;il y a toujours un chemin — même quand on ne le voit plus.
        </p>
      </div>

      {!hasReal && (
        <div className="glass card-top-line p-8 text-center">
          <p className="font-display text-xl text-navy">
            Cet espace attend vos histoires
          </p>
          <p className="mx-auto mt-4 max-w-md text-sm text-navy/70">
            AVELOR ne publie aucun faux témoignage. Nous cherchons des
            dirigeants qui ont traversé la difficulté et qui acceptent de
            partager leur expérience — pour montrer aux autres qu&apos;on
            peut s&apos;en sortir.
          </p>
          <p className="mt-4 text-sm text-navy/70">
            Votre témoignage peut être{' '}
            <strong>anonyme</strong>, <strong>sous prénom</strong> ou{' '}
            <strong>avec votre nom</strong> — comme vous préférez.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="mailto:contact@avelor.fr?subject=Témoignage AVELOR"
              className="btn-primary"
            >
              ✉️ Partager mon histoire
            </a>
            <Link href="/parler" className="btn-ghost">
              📞 Parler à quelqu&apos;un d&apos;abord
            </Link>
          </div>
          <p className="mt-6 text-xs text-navy/45">
            Chaque témoignage est relu avec vous avant publication.
            Rien n&apos;est publié sans votre accord écrit.
          </p>
        </div>
      )}

      {hasReal && (
        <div className="space-y-6">
          {TEMOIGNAGES.filter((t) => t.situation).map((t, i) => (
            <article key={i} className="glass card-top-line p-6 sm:p-8">
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="pastille">{t.secteur}</span>
                <span className="pastille">{t.situation}</span>
                <span className="pastille">{t.annee}</span>
              </div>
              <p className="font-display text-xl text-navy">{t.prenom}</p>
              <blockquote className="mt-4 border-l-2 border-bleu/30 pl-4 text-sm italic text-navy/80">
                “{t.texte}”
              </blockquote>
              {t.issue && (
                <p className="mt-4 rounded-xl bg-vert/10 px-4 py-3 text-sm text-vert">
                  Issue : {t.issue}
                </p>
              )}
            </article>
          ))}
        </div>
      )}

      <div className="dashed-band mt-10 p-5 text-center text-sm text-navy/70">
        <p>
          Vous êtes passé·e par là et vous voulez aider d&apos;autres
          dirigeants ? Votre témoignage compte — même quelques phrases.
        </p>
        <a
          href="mailto:contact@avelor.fr?subject=Témoignage AVELOR"
          className="mt-3 inline-flex text-bleu-fonce underline underline-offset-4"
        >
          Écrire à AVELOR →
        </a>
      </div>
    </section>
  );
}
