import type { Metadata } from 'next';
import Questionnaire from '@/components/Questionnaire';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Questionnaire — AVELOR',
  description:
    'Répondez à 8 questions simples sur votre situation pour recevoir une fiche personnalisée gratuite avec vos options concrètes.',
};

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<{ siret?: string }>;
}

export default async function QuestionnairePage({ searchParams }: Props) {
  const { siret: rawSiret } = await searchParams;
  const siret = (rawSiret ?? '').replace(/\D/g, '');
  if (!/^\d{14}$/.test(siret)) {
    redirect('/');
  }

  return (
    <section className="pt-4">
      <div className="mx-auto max-w-2xl px-5 pb-6 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-bleu-fonce/70">
          Questionnaire · 8 étapes
        </p>
        <h1 className="mt-2 font-display text-3xl text-navy sm:text-4xl">
          Parlez-nous de votre situation
        </h1>
      </div>
      <Questionnaire siret={siret} />
    </section>
  );
}
