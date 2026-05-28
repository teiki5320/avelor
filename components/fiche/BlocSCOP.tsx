'use client';
import { useFiche } from '@/lib/FicheContext';
import BlocAccordeon from './BlocAccordeon';

/**
 * Bloc dédié à la reprise de l'entreprise par les salariés en SCOP
 * (Société Coopérative et Participative). Option souvent méconnue
 * mais structurée par tout un écosystème : CG SCOP, SOCODEN, Unions
 * régionales.
 *
 * S'affiche pour les employeurs en redressement ou en tension de
 * trésorerie — les deux situations où une reprise par les salariés
 * peut sauver l'activité et les emplois.
 */
export default function BlocSCOP() {
  const { reponses } = useFiche();

  const pertinent =
    reponses.effectif === 'salaries' &&
    (reponses.situation === 'redressement' || reponses.situation === 'tresorie');

  if (!pertinent) return null;

  return (
    <BlocAccordeon
      icone="🤝"
      titre="Reprise par les salariés (SCOP)"
      soustitre="Sauvegarder l'emploi et le savoir-faire en transmettant à votre équipe"
    >
      <p className="text-sm text-navy/80">
        La <strong>SCOP — Société Coopérative et Participative</strong> est
        une forme de société dans laquelle les salariés sont associés
        majoritaires (au moins 51 % du capital et 65 % des droits de vote).
        C&apos;est une option <strong>très méconnue</strong> qui permet de
        sauver une entreprise en difficulté en la transmettant à son équipe,
        avec un accompagnement gratuit et des financements dédiés.
      </p>

      {/* Avantages */}
      <div className="mt-5 rounded-2xl border border-vert/30 bg-vert/5 p-4">
        <p className="font-display text-base text-vert">
          Pourquoi une SCOP en cas de difficulté ?
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-navy/80">
          <li>
            <strong>Maintien de l&apos;emploi</strong> et du savoir-faire :
            les salariés connaissent déjà l&apos;activité.
          </li>
          <li>
            <strong>Le dirigeant peut rester</strong> : devenir salarié-associé
            ou conserver une fonction de gérant pendant la transition.
          </li>
          <li>
            <strong>Reprise possible en plan de cession</strong> dans le
            cadre d&apos;un redressement judiciaire (offre concurrente
            recevable).
          </li>
          <li>
            <strong>Financements dédiés</strong> via SOCODEN, BPI, banques
            coopératives (Crédit Coopératif, Crédit Mutuel).
          </li>
          <li>
            <strong>Fiscalité avantageuse</strong> : exonération d&apos;IS sur
            la part bénéficiaire distribuée aux salariés.
          </li>
        </ul>
      </div>

      {/* Conditions */}
      <div className="mt-4 rounded-2xl border border-bleu/30 bg-bleu/5 p-4">
        <p className="font-display text-base text-bleu-fonce">
          Conditions de constitution
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-navy/80">
          <li>
            <strong>Adhésion volontaire</strong> des salariés (au moins 2
            associés pour une SARL coopérative, 7 pour une SA).
          </li>
          <li>
            <strong>Capital minimum</strong> : 30 € pour une SARL,
            18 500 € pour une SA. Chaque associé apporte au moins la valeur
            d&apos;une part sociale.
          </li>
          <li>
            <strong>Gouvernance démocratique</strong> : « 1 personne = 1 voix »
            en assemblée générale, indépendamment du capital détenu.
          </li>
          <li>
            <strong>Réserves impartageables</strong> : au moins 16 % des
            bénéfices doivent alimenter les fonds propres de la coopérative.
          </li>
        </ul>
      </div>

      {/* SCIC */}
      <div className="mt-4 rounded-2xl border border-jaune/30 bg-jaune/5 p-4">
        <p className="font-display text-base text-jaune">
          Variante : la SCIC (Société Coopérative d&apos;Intérêt Collectif)
        </p>
        <p className="mt-2 text-sm text-navy/80">
          La <strong>SCIC</strong> ouvre le sociétariat à d&apos;autres parties
          prenantes : collectivités locales, clients, fournisseurs,
          bénévoles. Pertinente si votre activité a une{' '}
          <strong>utilité sociale ou territoriale</strong> (ex : dernier
          commerce d&apos;un village, service à la personne, culture). La
          collectivité locale peut entrer au capital jusqu&apos;à 50 %.
        </p>
      </div>

      {/* Contacts */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-navy/15 bg-white/60 p-4">
          <p className="font-display text-base text-navy">
            CG SCOP — Confédération Générale des SCOP
          </p>
          <p className="mt-1 text-xs text-navy/60">
            Tête de réseau nationale, étude de faisabilité gratuite
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <a
              href="tel:0144854700"
              className="rounded-full bg-white/80 px-3 py-1.5 text-navy/80 hover:bg-white"
            >
              ☎ 01 44 85 47 00
            </a>
            <a
              href="https://www.les-scop.coop"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white/80 px-3 py-1.5 text-bleu-fonce hover:bg-white"
            >
              🌐 les-scop.coop
            </a>
          </div>
        </div>
        <div className="rounded-2xl border border-navy/15 bg-white/60 p-4">
          <p className="font-display text-base text-navy">
            SOCODEN — Fonds de garantie des SCOP
          </p>
          <p className="mt-1 text-xs text-navy/60">
            Prêt participatif pour renforcer les fonds propres au moment
            de la transmission
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <a
              href="https://www.les-scop.coop/outils-financiers"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white/80 px-3 py-1.5 text-bleu-fonce hover:bg-white"
            >
              🌐 les-scop.coop/outils-financiers
            </a>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-navy/15 bg-white/60 p-4">
        <p className="font-display text-base text-navy">
          Union régionale des SCOP
        </p>
        <p className="mt-1 text-xs text-navy/60">
          13 unions régionales en métropole + outre-mer. Accompagnement
          gratuit : étude de faisabilité, montage juridique, plan de
          financement, formation des futurs associés.
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <a
            href="https://www.les-scop.coop/contactez-nous"
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-white/80 px-3 py-1.5 text-bleu-fonce hover:bg-white"
          >
            🌐 Trouver mon union régionale
          </a>
        </div>
      </div>

      <p className="mt-5 text-xs text-navy/50">
        Sources : loi n° 78-763 du 19 juillet 1978 portant statut des
        sociétés coopératives et participatives ; loi n° 2014-856 du 31
        juillet 2014 relative à l&apos;économie sociale et solidaire ;
        Confédération Générale des SCOP (CG SCOP).
      </p>
    </BlocAccordeon>
  );
}
