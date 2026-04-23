import AccompagnantQuestionnaire from './AccompagnantQuestionnaire';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AVELOR · J\'accompagne un dirigeant',
  description:
    'Vous êtes proche d\'un dirigeant en difficulté. AVELOR vous aide à comprendre et à l\'accompagner.',
};

export default function AccompagnantPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 pt-4 pb-20">
      <div className="mb-8 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-vert/80">
          Mode accompagnant
        </p>
        <h1 className="mt-2 font-display text-3xl text-navy sm:text-4xl">
          Vous accompagnez un dirigeant
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-navy/70">
          Vous n&apos;êtes pas le dirigeant, mais quelqu&apos;un qui
          veut l&apos;aider. Merci d&apos;être là — c&apos;est déjà
          énorme.
        </p>
      </div>
      <AccompagnantQuestionnaire />
    </section>
  );
}
