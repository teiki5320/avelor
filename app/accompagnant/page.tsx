import AccompagnantQuestionnaire from './AccompagnantQuestionnaire';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AVELOR · J\'accompagne un dirigeant',
  description:
    'Vous êtes proche d\'un dirigeant en difficulté. AVELOR vous aide à comprendre et à l\'accompagner.',
};

const urgences = [
  {
    nom: 'APESA',
    telephone: '08 05 65 50 50',
    tel: '0805655050',
    description: 'Psychologues · Gratuit · Confidentiel',
    couleur: 'bg-bleu/10 text-bleu-fonce',
  },
  {
    nom: '3114',
    telephone: '3114',
    tel: '3114',
    description: 'Prévention du suicide · 24h/24',
    couleur: 'bg-rouge/10 text-rouge',
  },
  {
    nom: 'CCI',
    telephone: '0 820 012 112',
    tel: '+33820012112',
    description: 'Conseiller entreprise · Gratuit',
    couleur: 'bg-jaune/10 text-jaune',
  },
  {
    nom: 'Conseillers-Entreprises',
    telephone: '0 806 000 245',
    tel: '0806000245',
    description: 'Service public · Rappel sous 5 jours',
    couleur: 'bg-vert/10 text-vert',
  },
];

export default function AccompagnantPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 pt-4 pb-20">
      <div className="mb-8 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-vert/80">
          Aux côtés d&apos;un dirigeant
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

      {/* Bandeau d'urgence */}
      <div className="mb-10 rounded-2xl border border-rouge/20 bg-rouge/5 p-5 sm:p-6">
        <p className="text-center text-sm font-medium text-navy/80">
          Si vous êtes inquiet·e pour sa sécurité, n&apos;attendez pas :
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {urgences.map((u) => (
            <a
              key={u.nom}
              href={`tel:${u.tel}`}
              className="glass flex flex-col items-center rounded-2xl p-4 text-center transition hover:shadow-lg"
            >
              <span
                className={`inline-block rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wide ${u.couleur}`}
              >
                {u.nom}
              </span>
              <span className="mt-3 font-display text-xl font-bold tracking-wide text-navy sm:text-2xl">
                {u.telephone}
              </span>
              <span className="mt-1 text-xs text-navy/60">
                {u.description}
              </span>
            </a>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-navy/50">
          Ces services sont gratuits et confidentiels.
        </p>
      </div>

      <AccompagnantQuestionnaire />
    </section>
  );
}
