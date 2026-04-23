import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Parler à quelqu\'un — maintenant · AVELOR',
  description:
    'Numéros gratuits et confidentiels pour les dirigeants en difficulté. APESA, 3114, CCI, SOS Amitié.',
};

const contacts = [
  {
    name: 'APESA',
    phone: '08 05 65 50 50',
    tel: '0805655050',
    description:
      'Psychologues formés à la souffrance des dirigeants · Gratuit · Confidentiel',
    url: 'https://apesa.fr',
    urlLabel: 'apesa.fr',
    color: 'bg-bleu/10 text-bleu-fonce',
  },
  {
    name: '3114',
    phone: '3114',
    tel: '3114',
    description:
      'Numéro national de prévention du suicide · 24h/24 · Gratuit',
    url: null,
    urlLabel: null,
    color: 'bg-rouge/10 text-rouge',
  },
  {
    name: 'CCI "Entreprise en difficulté"',
    phone: '0 820 012 112',
    tel: '+33820012112',
    description: 'Premier rendez-vous gratuit avec un conseiller',
    url: null,
    urlLabel: null,
    color: 'bg-jaune/10 text-jaune',
  },
  {
    name: 'SOS Amitié',
    phone: '09 72 39 40 50',
    tel: '+33972394050',
    description: 'Écoute anonyme · 24h/24',
    url: null,
    urlLabel: null,
    color: 'bg-vert/10 text-vert',
  },
];

export default function ParlerPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 pt-6 pb-20 sm:pt-14">
      <div className="text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-bleu-fonce/70">
          Vous n&apos;êtes pas seul·e
        </p>
        <h1 className="font-display text-3xl leading-tight text-navy sm:text-5xl">
          Parler à quelqu&apos;un — maintenant
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-navy/70 sm:text-lg">
          Vous n&apos;avez pas besoin de tout expliquer. Décrochez, c&apos;est tout.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {contacts.map((c) => (
          <article
            key={c.name}
            className="glass card-top-line flex flex-col items-center p-8 text-center"
          >
            <span
              className={`inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide ${c.color}`}
            >
              {c.name}
            </span>

            <a
              href={`tel:${c.tel}`}
              className="btn-primary mt-6 w-full text-xl tracking-wide sm:text-2xl"
            >
              <span aria-hidden="true" className="mr-1">📞</span>
              {c.phone}
            </a>

            <p className="mt-4 text-sm leading-relaxed text-navy/70">
              {c.description}
            </p>

            {c.url && (
              <a
                href={c.url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 text-sm text-bleu-fonce underline underline-offset-4"
              >
                {c.urlLabel}
              </a>
            )}
          </article>
        ))}
      </div>

      <p className="mt-14 text-center text-base text-navy/60 sm:text-lg">
        Ces services sont gratuits et confidentiels.<br />
        Personne ne vous jugera.
      </p>
    </section>
  );
}
