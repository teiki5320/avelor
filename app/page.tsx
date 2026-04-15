import SiretInput from '@/components/SiretInput';

export default function HomePage() {
  return (
    <section className="mx-auto max-w-3xl px-5 pt-6 pb-20 text-center sm:pt-14">
      <p className="mb-4 text-sm uppercase tracking-[0.2em] text-bleu-fonce/70">
        Gratuit · confidentiel · humain
      </p>
      <h1 className="font-display text-4xl leading-tight text-navy sm:text-6xl">
        Vous êtes dirigeant, <br />
        et quelque chose coince.
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-base text-navy/70 sm:text-lg">
        AVELOR vous aide à y voir clair — en quelques minutes, avec les bons
        interlocuteurs autour de vous. Vous n&apos;avez pas à tout résoudre
        aujourd&apos;hui.
      </p>
      <SiretInput />
      <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-sm text-navy/60">
        <span className="pastille">⏱ 4 minutes</span>
        <span className="pastille">🔒 Anonyme</span>
        <span className="pastille">✉︎ Sauvegarde par email</span>
        <span className="pastille">🤝 Sans jugement</span>
      </div>
      <p className="mt-14 text-sm text-navy/50">
        Si vous vous sentez épuisé·e ou perdu·e, APESA est disponible dès
        aujourd&apos;hui, gratuitement et en confidentialité —{' '}
        <a
          href="https://apesa.fr"
          target="_blank"
          rel="noreferrer"
          className="text-bleu-fonce underline underline-offset-4"
        >
          apesa.fr
        </a>
      </p>
    </section>
  );
}
