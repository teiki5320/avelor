import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Comment en parler à vos proches · AVELOR',
  description:
    'Des phrases concrètes pour ouvrir la conversation avec votre conjoint, un ami, votre associé ou vos enfants.',
};

interface Section {
  title: string;
  phrases: string[];
}

const sections: Section[] = [
  {
    title: 'À votre conjoint·e',
    phrases: [
      'J’ai besoin de te parler de quelque chose qui me pèse. Ce n’est pas grave, mais je ne veux plus le porter seul·e.',
      'La boîte traverse un moment difficile. Je ne te demande pas de solution — juste d’être là.',
      'J’ai du mal à dormir en ce moment. C’est lié au travail. Je voulais que tu saches.',
    ],
  },
  {
    title: 'À un ami proche',
    phrases: [
      'Si je suis un peu absent·e en ce moment, c’est parce que j’ai des soucis avec l’entreprise. On peut en parler si tu veux.',
      'J’aurais besoin d’un regard extérieur. Pas de conseils, juste une oreille.',
    ],
  },
  {
    title: 'À votre associé·e',
    phrases: [
      'Il faut qu’on se pose pour regarder les chiffres ensemble. J’ai besoin qu’on soit lucides — pas inquiets, lucides.',
      'Je pense qu’on devrait demander un avis extérieur. Pas parce qu’on a échoué, mais pour anticiper.',
    ],
  },
  {
    title: 'À vos enfants (si grands)',
    phrases: [
      'Le travail de papa / maman est un peu compliqué en ce moment. Ce n’est pas votre faute, et on s’en occupe.',
      'Parfois les adultes aussi ont des moments difficiles. Je voulais que vous sachiez que je fais ce qu’il faut.',
    ],
  },
];

export default function PrôchesPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 pt-6 pb-20 sm:pt-14">
      <div className="text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-bleu-fonce/70">
          Guide pratique
        </p>
        <h1 className="font-display text-3xl leading-tight text-navy sm:text-5xl">
          Comment en parler à vos proches
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-navy/70 sm:text-lg">
          Beaucoup de dirigeants portent la difficulté seul·e·s. Voici quelques
          phrases qui peuvent ouvrir la conversation — sans dramatiser, sans
          minimiser.
        </p>
      </div>

      <div className="mt-12 space-y-10">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="font-display text-xl text-navy sm:text-2xl">
              {section.title}
            </h2>
            <div className="mt-4 space-y-4">
              {section.phrases.map((phrase, i) => (
                <blockquote
                  key={i}
                  className="glass-soft relative rounded-2xl py-5 pl-7 pr-6 sm:pl-8 sm:pr-8"
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-3 top-3 text-2xl leading-none text-bleu/30 sm:left-4"
                  >
                    “
                  </span>
                  <p className="italic leading-relaxed text-navy/80 sm:text-lg">
                    {phrase}
                  </p>
                </blockquote>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="glass card-top-line mt-16 p-8 text-center sm:p-10">
        <p className="text-lg leading-relaxed text-navy sm:text-xl">
          Vous n&apos;avez pas à tout dire.<br />
          Un mot suffit pour ne plus porter seul·e.
        </p>
      </div>
    </section>
  );
}
