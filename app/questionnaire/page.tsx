import Questionnaire from '@/components/Questionnaire';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: { siret?: string };
}

export default function QuestionnairePage({ searchParams }: Props) {
  const siret = (searchParams.siret ?? '').replace(/\D/g, '');
  if (!/^\d{14}$/.test(siret)) {
    redirect('/');
  }

  return (
    <section className="pt-4">
      <div className="mx-auto max-w-2xl px-5 pb-6 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-bleu-fonce/70">
          Questionnaire · 4 étapes
        </p>
        <h1 className="mt-2 font-display text-3xl text-navy sm:text-4xl">
          Parlez-nous de votre situation
        </h1>
      </div>
      <Questionnaire siret={siret} />
    </section>
  );
}
