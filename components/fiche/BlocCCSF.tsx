import type { Reponses, CompanyData } from '@/lib/types';
import BlocAccordeon from './BlocAccordeon';

interface Props {
  reponses: Reponses;
  company: CompanyData;
}

export default function BlocCCSF({ reponses, company }: Props) {
  const pertinent =
    reponses.probleme === 'urssaf' ||
    reponses.probleme === 'impots' ||
    reponses.situation === 'tresorie' ||
    reponses.situation === 'redressement';

  if (!pertinent) return null;

  const dep = company.departement || '';

  return (
    <BlocAccordeon
      icone="🏛️"
      titre="CCSF — un guichet unique pour vos dettes fiscales ET sociales"
      soustitre="Plan d'échelonnement consolidé en une seule demande"
    >
      <p className="text-sm text-navy/80">
        La <strong>Commission des Chefs de Services Financiers</strong>{' '}
        (CCSF) est un dispositif officiel qui permet à une entreprise en
        difficulté d&apos;obtenir un <strong>plan d&apos;apurement
        unique</strong> couvrant à la fois ses dettes fiscales (impôts,
        TVA, IS) ET ses dettes sociales (URSSAF, RSI, retraite,
        Pôle emploi).
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-vert/30 bg-vert/5 p-4">
          <p className="font-display text-sm text-vert">✓ Avantages clés</p>
          <ul className="mt-2 space-y-1 text-sm text-navy/80">
            <li>• Un seul interlocuteur (DDFiP)</li>
            <li>• Échelonnement jusqu&apos;à 36 mois</li>
            <li>• Dettes fiscales + sociales traitées ensemble</li>
            <li>• Suspension des poursuites pendant l&apos;instruction</li>
            <li>• Confidentielle (non publiée)</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-jaune/30 bg-jaune/5 p-4">
          <p className="font-display text-sm text-jaune">⚠️ Conditions</p>
          <ul className="mt-2 space-y-1 text-sm text-navy/80">
            <li>• Entreprise à jour de ses obligations déclaratives</li>
            <li>• Cotisations courantes payées (ou plan accepté)</li>
            <li>• Pas en procédure collective ouverte</li>
            <li>• Difficulté avérée mais activité viable</li>
          </ul>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-bleu/20 bg-bleu/5 p-4">
        <p className="font-display text-base text-navy">
          Comment saisir la CCSF
        </p>
        <ol className="mt-2 space-y-2 text-sm text-navy/80">
          <li>
            <strong>1.</strong> Téléchargez le formulaire CERFA
            n°15772*02 sur <em>impots.gouv.fr</em> ou demandez-le à votre SIE.
          </li>
          <li>
            <strong>2.</strong> Joignez : 3 derniers bilans, situation
            comptable récente, prévisionnel de trésorerie, état du passif
            fiscal et social, plan d&apos;apurement proposé.
          </li>
          <li>
            <strong>3.</strong> Adressez-le à la <strong>DDFiP{dep ? ` du département ${dep}` : ''}</strong>{' '}
            (Direction Départementale des Finances Publiques) — bureau du
            recouvrement amiable.
          </li>
          <li>
            <strong>4.</strong> La CCSF se réunit en moyenne toutes les
            6 semaines. Décision sous 2 à 3 mois.
          </li>
        </ol>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-sm">
        <a
          href="https://www.impots.gouv.fr/professionnel/commission-des-chefs-des-services-financiers-ccsf"
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-white/80 px-3 py-1.5 text-bleu-fonce hover:bg-white"
        >
          🌐 impots.gouv.fr — page officielle CCSF
        </a>
        <a
          href="https://www.economie.gouv.fr/entreprises/commission-chefs-services-financiers-ccsf"
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-white/80 px-3 py-1.5 text-navy/80 hover:bg-white"
        >
          🌐 economie.gouv.fr — guide CCSF
        </a>
      </div>

      <p className="mt-5 text-xs text-navy/50">
        Source : article L611-7 du Code de commerce, decret n°2007-686.
        La CCSF traite environ 4 000 dossiers par an avec un taux
        d&apos;acceptation supérieur à 80 % quand l&apos;entreprise est viable.
      </p>
    </BlocAccordeon>
  );
}
