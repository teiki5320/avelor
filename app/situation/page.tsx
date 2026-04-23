import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AVELOR · Situations d\'entreprise en difficulté',
  description: 'Guides pratiques pour chaque type de difficulté : URSSAF, fournisseurs, banque, impôts.',
};

const SITUATIONS = [
  { slug: 'dettes-urssaf', titre: 'Dettes URSSAF', desc: 'Échelonnement, prescription, contestation', icone: '🏛️', couleur: 'border-l-rouge' },
  { slug: 'dettes-fournisseurs', titre: 'Dettes fournisseurs', desc: 'Négociation amiable, médiation', icone: '🤝', couleur: 'border-l-bleu' },
  { slug: 'credit-bancaire', titre: 'Crédit bancaire', desc: 'Médiation du crédit, découvert, prêt refusé', icone: '🏦', couleur: 'border-l-bleu-fonce' },
  { slug: 'impots-impayes', titre: 'Impôts impayés', desc: 'Délais de paiement, CCSF, remise gracieuse', icone: '📋', couleur: 'border-l-jaune' },
];

export default function SituationsPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 pb-24">
      <div className="mb-10 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-bleu-fonce/70">Guides pratiques</p>
        <h1 className="mt-2 font-display text-3xl text-navy sm:text-5xl">Quelle est votre situation ?</h1>
        <p className="mx-auto mt-4 max-w-xl text-navy/70">
          Chaque situation a ses solutions. Cliquez sur celle qui vous concerne pour voir vos options concrètes.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {SITUATIONS.map((s) => (
          <Link key={s.slug} href={`/situation/${s.slug}`} className={`glass-soft flex items-start gap-4 border-l-4 ${s.couleur} p-5 transition hover:bg-white`}>
            <span className="text-2xl" aria-hidden>{s.icone}</span>
            <div>
              <p className="font-display text-lg text-navy">{s.titre}</p>
              <p className="mt-1 text-sm text-navy/55">{s.desc}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link href="/" className="btn-primary">Commencer le diagnostic AVELOR →</Link>
      </div>
    </section>
  );
}
