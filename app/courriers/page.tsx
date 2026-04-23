import Link from 'next/link';
import { COURRIERS, CATEGORIES } from '@/lib/courriers';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AVELOR · Courriers types',
  description:
    'Modèles de courriers prêts à l\'emploi pour les dirigeants en difficulté.',
};

const COLOR_MAP: Record<string, string> = {
  rouge: 'border-l-rouge',
  jaune: 'border-l-jaune',
  bleu: 'border-l-bleu',
  'bleu-fonce': 'border-l-bleu-fonce',
  navy: 'border-l-navy',
  vert: 'border-l-vert',
};

export default function CourriersPage() {
  const grouped = COURRIERS.reduce(
    (acc, c) => {
      (acc[c.categorie] ??= []).push(c);
      return acc;
    },
    {} as Record<string, typeof COURRIERS>
  );

  const order = ['urssaf', 'impots', 'fournisseurs', 'banque', 'tribunal', 'cci', 'social'];

  return (
    <section className="mx-auto max-w-4xl px-5 pb-24">
      <div className="mb-10 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-bleu-fonce/70">
          12 modèles prêts à l&apos;emploi
        </p>
        <h1 className="mt-2 font-display text-3xl text-navy sm:text-5xl">
          Courriers types
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-navy/70">
          Chaque modèle est pré-rédigé. Remplissez les champs entre
          crochets, imprimez ou copiez, et envoyez. Vous n&apos;avez pas
          besoin d&apos;un avocat pour ces courriers — mais un conseil
          reste toujours utile.
        </p>
      </div>

      <div className="space-y-8">
        {order.map((cat) => {
          const items = grouped[cat];
          if (!items?.length) return null;
          const meta = CATEGORIES[cat];
          return (
            <div key={cat}>
              <h2 className="mb-3 font-display text-xl text-navy">
                {meta.label}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {items.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/courriers/${c.slug}`}
                    className={`glass-soft flex items-start gap-4 border-l-4 ${
                      COLOR_MAP[meta.couleur] ?? 'border-l-bleu'
                    } p-4 transition hover:bg-white`}
                  >
                    <span className="text-2xl" aria-hidden>
                      {c.icone}
                    </span>
                    <div>
                      <p className="font-display text-base text-navy">
                        {c.titre}
                      </p>
                      <p className="mt-1 text-xs text-navy/55">
                        {c.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashed-band mt-10 p-5 text-sm text-navy/70">
        <p>
          Ces modèles sont des bases de travail. Adaptez-les à votre
          situation. En cas de doute, un avocat ou la CCI de votre
          département peut vous aider gratuitement.
        </p>
      </div>
    </section>
  );
}
