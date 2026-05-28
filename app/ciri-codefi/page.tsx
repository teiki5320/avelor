import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'CIRI vs CODEFI : quel dispositif pour ma taille ? — AVELOR',
  description: 'CIRI (Comité Interministériel de Restructuration Industrielle) et CODEFI (Comité Départemental) : conditions, saisine, accompagnement État pour entreprises en difficulté.',
  robots: { index: true, follow: true },
};

export default function CiriCodefiPage() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-10 sm:py-14">
      <Link href="/aides" className="mb-6 inline-flex items-center gap-2 text-sm text-navy/60 hover:text-navy">
        ← Aides
      </Link>

      <h1 className="font-display text-3xl text-navy sm:text-4xl">
        CIRI / CODEFI : l&apos;accompagnement de l&apos;État
      </h1>
      <p className="mt-4 max-w-2xl text-base text-navy/70">
        Deux dispositifs gratuits et confidentiels de l&apos;État pour les entreprises en difficulté, organisés
        selon votre taille. CRP (Commissaire aux Restructurations) en région.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {/* CODEFI */}
        <article className="glass card-top-line p-6">
          <div className="flex items-start gap-3">
            <span className="text-3xl">🏛️</span>
            <div>
              <h2 className="font-display text-xl text-navy">CODEFI</h2>
              <p className="mt-1 text-xs text-navy/55">Comité Départemental d&apos;Examen des problèmes de Financement</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-navy/80">
            Cellule départementale pilotée par le préfet et le directeur de la DDFiP. Coordonne les créanciers
            publics (URSSAF, fisc) et privés (banques) pour les <strong>entreprises de moins de 400 salariés</strong>.
          </p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-3"><dt className="text-navy/55">Cible</dt><dd className="font-medium text-navy">&lt; 400 salariés</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-navy/55">Saisine</dt><dd className="font-medium text-navy">Via Préfecture ou DDFiP</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-navy/55">Confidentialité</dt><dd className="font-medium text-navy">Totale</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-navy/55">Coût</dt><dd className="font-medium text-navy">Gratuit</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-navy/55">Délai</dt><dd className="font-medium text-navy">1ère réunion sous 30 j</dd></div>
          </dl>
          <p className="mt-4 text-sm text-navy/80">
            <strong>Ce que peut faire le CODEFI :</strong> négocier un plan d&apos;apurement global, débloquer
            les délais URSSAF/fisc, faciliter le dialogue avec les banques, vérifier l&apos;éligibilité aux aides
            publiques.
          </p>
          <p className="mt-3 text-xs text-navy/60">
            <strong>Référence :</strong> Décret n° 82-307 du 5 avril 1982. Confidentialité couverte par le secret professionnel des agents publics (LPF L103).
          </p>
        </article>

        {/* CIRI */}
        <article className="glass card-top-line p-6">
          <div className="flex items-start gap-3">
            <span className="text-3xl">🇫🇷</span>
            <div>
              <h2 className="font-display text-xl text-navy">CIRI</h2>
              <p className="mt-1 text-xs text-navy/55">Comité Interministériel de Restructuration Industrielle</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-navy/80">
            Cellule interministérielle de Bercy. Coordonne l&apos;État (Trésor, DGFiP, URSSAF), les banques
            et les créanciers pour les <strong>grandes entreprises et ETI stratégiques</strong>.
          </p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-3"><dt className="text-navy/55">Cible</dt><dd className="font-medium text-navy">≥ 400 salariés ou stratégique ≥ 250</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-navy/55">Saisine</dt><dd className="font-medium text-navy">DG Trésor / contact direct</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-navy/55">Confidentialité</dt><dd className="font-medium text-navy">Totale</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-navy/55">Coût</dt><dd className="font-medium text-navy">Gratuit</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-navy/55">Téléphone</dt><dd className="font-medium text-navy">01 44 87 72 58</dd></div>
          </dl>
          <p className="mt-4 text-sm text-navy/80">
            <strong>Ce que peut faire le CIRI :</strong> coordination ÉTAT/banques/créanciers privés sur des
            dossiers de retournement complexes (PSE, cession partielle, transformation), médiation à très haut
            niveau, mobilisation de prêts FDES (Fonds de Développement Économique et Social).
          </p>
          <p className="mt-3 text-xs text-navy/60">
            <strong>Référence :</strong> Décret n° 82-307 modifié. Site officiel : economie.gouv.fr/ciri.
          </p>
        </article>
      </div>

      {/* CRP */}
      <article className="glass card-top-line mt-8 p-6">
        <div className="flex items-start gap-3">
          <span className="text-3xl">🗺️</span>
          <div>
            <h2 className="font-display text-xl text-navy">CRP — Commissaire aux Restructurations et à la Prévention</h2>
            <p className="mt-1 text-xs text-navy/55">Représentant de l&apos;État en région (DREETS / Préfecture)</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-navy/80">
          <strong>13 CRP territoriaux</strong> répartis sur les régions de France. Le CRP intervient en amont d&apos;une
          procédure collective publique pour les entreprises en difficulté, quelle que soit la taille. Particulièrement
          utile pour les ETI et PME stratégiques régionalement.
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-navy/80">
          <li>Coordination des créanciers publics et privés (banques, fournisseurs)</li>
          <li>Mobilisation des dispositifs régionaux (BPI, FEDER, aides régionales)</li>
          <li>Médiation avec les donneurs d&apos;ordre publics</li>
          <li>Confidentialité totale, gratuit</li>
        </ul>
        <p className="mt-3 text-sm text-navy/80">
          <strong>Saisine :</strong> via la DREETS de votre région ou le préfet. Site officiel :{' '}
          <a href="https://www.economie.gouv.fr/entreprises/commissaires-restructurations-prevention" target="_blank" rel="noreferrer" className="text-bleu-fonce underline">
            economie.gouv.fr/commissaires-restructurations
          </a>.
        </p>
      </article>

      {/* Comparaison rapide */}
      <div className="mt-10 rounded-2xl border border-bleu/30 bg-bleu/5 p-6">
        <h2 className="font-display text-xl text-bleu-fonce">Comment choisir</h2>
        <ul className="mt-4 space-y-2 text-sm text-navy/80">
          <li>
            <strong>TPE / PME &lt; 400 salariés</strong> → CODEFI (départemental)
          </li>
          <li>
            <strong>PME / ETI ≥ 400 salariés, ou ≥ 250 sal stratégique national</strong> → CIRI (national)
          </li>
          <li>
            <strong>ETI / activité critique régionalement</strong> → CRP (régional, complémentaire)
          </li>
          <li>
            <strong>Vous ne savez pas par où commencer</strong> → Conseillers-Entreprises (0 806 000 245), guichet unique
            qui vous oriente vers le bon dispositif
          </li>
        </ul>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/procedures-comparaison" className="rounded-full border border-navy/15 bg-white/80 px-4 py-2 text-sm text-navy/80 hover:bg-white">
          Comparatif des procédures
        </Link>
        <Link href="/aides" className="rounded-full border border-navy/15 bg-white/80 px-4 py-2 text-sm text-navy/80 hover:bg-white">
          Toutes les aides
        </Link>
        <Link href="/glossaire" className="rounded-full border border-navy/15 bg-white/80 px-4 py-2 text-sm text-navy/80 hover:bg-white">
          Glossaire
        </Link>
      </div>
    </section>
  );
}
