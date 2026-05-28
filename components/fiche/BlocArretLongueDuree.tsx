'use client';
import { useFiche } from '@/lib/FicheContext';
import BlocAccordeon from './BlocAccordeon';

/**
 * Bloc dédié au traitement des salariés en arrêt maladie longue durée
 * en cas de procédure collective. La couverture AGS est différenciée :
 * pendant l'arrêt, l'AGS ne garantit pas l'indemnisation maladie (qui
 * vient de la Sécu et de la prévoyance), mais le contrat de travail
 * reste actif et certains droits demeurent.
 *
 * S'affiche pour les employeurs (effectif === 'salaries') confrontés
 * à un risque de procédure (situation autre que prévention) — c'est
 * souvent un point oublié dans le décompte des coûts.
 */
export default function BlocArretLongueDuree() {
  const { reponses } = useFiche();
  if (reponses.effectif !== 'salaries') return null;
  if (reponses.situation === 'prevention') return null;

  return (
    <BlocAccordeon
      icone="🏥"
      titre="Salariés en arrêt maladie longue durée — impact AGS spécifique"
      soustitre="Couverture AGS, IJ Sécu, prévoyance, inaptitude : un cas à traiter à part"
    >
      <p className="text-sm text-navy/80">
        Un salarié en arrêt maladie longue durée (&gt; 30 j) au moment
        de l&apos;ouverture d&apos;une procédure collective conserve son
        contrat de travail, mais la <strong>couverture financière est
        partagée</strong> entre l&apos;AGS, la Sécurité sociale et la
        prévoyance d&apos;entreprise. C&apos;est un point souvent
        sous-estimé qui peut peser lourd sur la trésorerie résiduelle.
      </p>

      {/* IJ et complément */}
      <div className="mt-5 rounded-2xl border border-bleu/30 bg-bleu/5 p-4">
        <p className="font-display text-base text-bleu-fonce">
          Ce que touche le salarié pendant l&apos;arrêt
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-navy/80">
          <li>
            <strong>Indemnités journalières Sécu (CPAM)</strong> : 50 %
            du salaire journalier de base (plafond 1,8 SMIC) à partir
            du 4e jour. Versées directement au salarié.
          </li>
          <li>
            <strong>Complément employeur</strong> (loi de mensualisation,
            art. L1226-1 C. trav.) : 90 % puis 66 % du salaire brut, sous
            conditions d&apos;ancienneté. À payer par l&apos;employeur sauf
            subrogation à la prévoyance.
          </li>
          <li>
            <strong>Prévoyance d&apos;entreprise</strong> : couvre souvent
            le complément au-delà de l&apos;obligation légale.
            <strong> Vérifiez les conditions de maintien</strong> en cas
            de procédure collective.
          </li>
        </ul>
      </div>

      {/* AGS : ce qu'elle couvre / ne couvre pas */}
      <div className="mt-4 rounded-2xl border border-jaune/30 bg-jaune/5 p-4">
        <p className="font-display text-base text-jaune">
          Couverture AGS pour un salarié en arrêt longue durée
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-navy/80">
          <li>
            <strong>AGS ne garantit PAS</strong> les IJ Sécu (versées
            directement par la CPAM) ni le complément prévoyance (versé
            par l&apos;organisme prévoyance).
          </li>
          <li>
            <strong>AGS garantit</strong> les compléments employeur dus
            au titre du complément légal de salaire (art. L1226-1
            mensualisation), si l&apos;employeur défaillant ne peut plus
            les payer.
          </li>
          <li>
            <strong>Plafonds AGS 2025</strong> : 61 824 € (entreprise &lt;
            6 mois), 77 280 € (6 mois à 2 ans), 92 736 € (au-delà).
          </li>
          <li>
            <strong>Délai de versement</strong> : l&apos;AGS verse sous
            15 jours après transmission par le mandataire — un salarié
            en arrêt long peut donc rester sans complément pendant
            plusieurs semaines.
          </li>
        </ul>
      </div>

      {/* Préavis et indemnités */}
      <div className="mt-4 rounded-2xl border border-rouge/30 bg-rouge/5 p-4">
        <p className="font-display text-base text-rouge">
          ⚠️ Licenciement d&apos;un salarié en arrêt : précautions
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-navy/80">
          <li>
            <strong>Interdiction de licencier</strong> pour un motif lié
            à l&apos;état de santé (art. L1132-1 C. trav.) — discrimination
            avec nullité du licenciement.
          </li>
          <li>
            <strong>En revanche</strong>, le licenciement économique pour
            motif réel (suppression de poste, RJ/LJ) est possible même
            si le salarié est en arrêt — il n&apos;est pas protégé en tant
            que tel par son arrêt.
          </li>
          <li>
            <strong>Procédure</strong> identique aux autres salariés :
            entretien préalable (LRAR si arrêt empêche présence physique),
            CSP, indemnité de licenciement.
          </li>
          <li>
            <strong>Préavis</strong> : suspendu pendant l&apos;arrêt
            (Cass. soc. 1995). Si le salarié reprend en cours de préavis,
            il termine ; sinon, il est payé en indemnité compensatrice.
          </li>
          <li>
            <strong>Inaptitude post-arrêt</strong> : si la médecine du
            travail constate une inaptitude à l&apos;issue de l&apos;arrêt,
            une procédure d&apos;inaptitude doit être suivie
            (reclassement préalable, sauf dispense pour inaptitude
            d&apos;origine non-professionnelle ouvrant droit à indemnité
            spéciale doublée).
          </li>
        </ul>
      </div>

      {/* AT/MP particulier */}
      <div className="mt-4 rounded-2xl border border-bleu/30 bg-bleu/5 p-4">
        <p className="font-display text-base text-bleu-fonce">
          Cas spécifique : arrêt suite à AT ou maladie professionnelle
        </p>
        <p className="mt-2 text-sm text-navy/80">
          Un salarié en arrêt suite à un accident du travail ou une
          maladie professionnelle bénéficie d&apos;une <strong>protection
          renforcée contre le licenciement</strong> (art. L1226-9 C.
          trav.). Le licenciement n&apos;est possible qu&apos;en cas de :
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-navy/80">
          <li>Faute grave non liée à l&apos;arrêt</li>
          <li>
            <strong>Impossibilité de maintenir le contrat pour un motif
            étranger à l&apos;accident</strong> (cessation totale
            d&apos;activité, RJ/LJ avec disparition du poste)
          </li>
        </ul>
        <p className="mt-2 text-sm text-navy/80">
          <strong>Indemnité spéciale doublée</strong> en cas de
          licenciement post-AT/MP (art. L1226-14). À budgéter dans le
          coût de la procédure.
        </p>
      </div>

      {/* Coordonnées */}
      <div className="mt-5 rounded-2xl border border-navy/15 bg-white/60 p-4">
        <p className="font-display text-base text-navy">Contacts utiles</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium text-navy">AGS — garantie salaires</p>
            <div className="mt-1 flex flex-wrap gap-2 text-sm">
              <a href="tel:0155902700" className="rounded-full bg-white/80 px-3 py-1 text-navy/80 hover:bg-white">☎ 01 55 90 27 00</a>
              <a
                href="https://www.ags-garantie-salaires.org"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-white/80 px-3 py-1 text-bleu-fonce hover:bg-white"
              >
                🌐 ags-garantie-salaires.org
              </a>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-navy">Médecine du travail — pour avis d&apos;inaptitude</p>
            <div className="mt-1 flex flex-wrap gap-2 text-sm">
              <a
                href="https://www.presanse.fr/annuaire-services-de-prevention/"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-white/80 px-3 py-1 text-bleu-fonce hover:bg-white"
              >
                🌐 Trouver mon SPST
              </a>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-5 text-xs text-navy/50">
        Sources : C. trav. art. L1132-1 (non-discrimination), L1226-1
        (complément mensualisation), L1226-9 à L1226-15 (AT/MP) ;
        décret-loi 19 janv. 1978 sur la mensualisation ; ags-garantie-
        salaires.org (plafonds 2025) ; jurisprudence Cass. soc. sur la
        suspension du préavis.
      </p>
    </BlocAccordeon>
  );
}
