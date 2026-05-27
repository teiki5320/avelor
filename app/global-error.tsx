'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body className="flex min-h-screen items-center justify-center bg-[#0A1628] text-white">
        <div className="max-w-md text-center px-6">
          <h1 className="text-2xl font-semibold">Une erreur est survenue</h1>
          <p className="mt-4 text-white/60">
            Nous sommes désolés. Si le problème persiste, contactez-nous.
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <button
              onClick={reset}
              className="rounded-full bg-white/10 px-6 py-2 text-sm hover:bg-white/20"
            >
              Réessayer
            </button>
            <a
              href="/"
              className="rounded-full bg-white px-6 py-2 text-sm text-[#0A1628] hover:bg-white/90"
            >
              Retour à l&apos;accueil
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
