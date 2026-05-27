'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="mx-auto max-w-xl px-5 py-20 text-center">
      <p className="text-4xl">⚠️</p>
      <h1 className="mt-4 font-display text-2xl text-navy">
        Quelque chose s&apos;est mal passé
      </h1>
      <p className="mt-3 text-navy/60">
        Une erreur inattendue est survenue. Vous pouvez réessayer ou revenir à l&apos;accueil.
      </p>
      <div className="mt-8 flex gap-4 justify-center">
        <button
          onClick={reset}
          className="rounded-full border border-navy/20 px-6 py-2 text-sm text-navy hover:bg-navy/5"
        >
          Réessayer
        </button>
        <a
          href="/"
          className="rounded-full bg-bleu-fonce px-6 py-2 text-sm text-white hover:bg-navy"
        >
          Retour à l&apos;accueil
        </a>
      </div>
    </section>
  );
}
