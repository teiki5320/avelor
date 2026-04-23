import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Confidentialité · AVELOR',
  description:
    'Notre charte de confidentialité, en mots simples. Vos données ne sont jamais vendues.',
};

const engagements = [
  'Vos données ne sont jamais vendues. À personne. Jamais.',
  'Votre fiche n’est visible que par vous — et uniquement si vous avez le lien.',
  'Nous ne partageons rien avec l’État, les impôts, l’URSSAF ou votre banque.',
  'Aucun compte n’est créé sans votre accord.',
  'Vous pouvez supprimer votre fiche à tout moment.',
  'AVELOR est un outil d’aide — pas un fichier, pas un registre.',
];

export default function ConfidentialitePage() {
  return (
    <section className="mx-auto max-w-3xl px-5 pt-6 pb-20 sm:pt-14">
      <div className="text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-bleu-fonce/70">
          Transparence
        </p>
        <h1 className="font-display text-3xl leading-tight text-navy sm:text-5xl">
          Charte de confidentialité
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-navy/70 sm:text-lg">
          Pas de jargon juridique. Voici exactement ce que nous faisons — et ne
          faisons pas — avec vos informations.
        </p>
      </div>

      <div className="mt-12 space-y-5">
        {engagements.map((text, i) => (
          <div
            key={i}
            className="glass card-top-line flex items-start gap-5 p-6 sm:p-8"
          >
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-vert/15 text-sm font-semibold text-vert">
              {i + 1}
            </span>
            <p className="text-lg leading-relaxed text-navy sm:text-xl">
              {text}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <div className="glass-soft mx-auto max-w-md rounded-2xl p-8">
          <p className="text-base text-navy/70">
            Questions ? Écrivez-nous à{' '}
            <a
              href="mailto:contact@avelor.fr"
              className="font-medium text-bleu-fonce underline underline-offset-4"
            >
              contact@avelor.fr
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
