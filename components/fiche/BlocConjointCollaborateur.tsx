'use client';
import { useFiche } from '@/lib/FicheContext';
import BlocAccordeon from './BlocAccordeon';

/**
 * Bloc dédié au statut du conjoint dans l'entreprise.
 * S'affiche dès que l'utilisateur a renseigné un statut conjoint
 * (sauf 'sans-conjoint' ou champ non rempli).
 *
 * Couvre les 3 statuts légaux (salarié, collaborateur, associé) plus
 * le cas « aucun rôle » (où on alerte sur le risque de requalification
 * en collaborateur de fait si participation effective).
 */
export default function BlocConjointCollaborateur() {
  const { reponses } = useFiche();
  const statut = reponses.conjointStatut;
  if (!statut || statut === 'sans-conjoint') return null;

  return (
    <BlocAccordeon
      icone="👫"
      titre="Statut du conjoint — droits, risques et protections"
      soustitre="Trois statuts légaux ; un statut de fait reconnu par la jurisprudence"
    >
      <p className="text-sm text-navy/80">
        Le conjoint du chef d&apos;entreprise qui participe régulièrement
        à l&apos;activité <strong>doit obligatoirement choisir un statut</strong>{' '}
        (loi du 2 août 2005, art. L121-4 C. com.) : salarié, collaborateur
        ou associé. À défaut, la jurisprudence reconnaît un{' '}
        <strong>statut de conjoint collaborateur de fait</strong> ouvrant
        droit à indemnisation.
      </p>

      {statut === 'salarie' && (
        <div className="mt-5 rounded-2xl border border-vert/30 bg-vert/5 p-4">
          <p className="font-display text-base text-vert">Conjoint salarié</p>
          <p className="mt-2 text-sm text-navy/80">
            Statut le plus protecteur. Le conjoint est lié par un contrat
            de travail, perçoit un salaire et bénéficie des mêmes droits
            qu&apos;un salarié classique.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-navy/80">
            <li>
              <strong>Protection AGS</strong> en cas de procédure
              collective — salaires garantis jusqu&apos;à 6 PASS (≈ 278 k€
              en 2025).
            </li>
            <li>
              <strong>Droits chômage</strong> à France Travail si
              licenciement économique (attention : la subordination réelle
              doit être démontrée — un conjoint co-gérant ne peut pas
              être salarié).
            </li>
            <li>
              <strong>CSP obligatoire</strong> si licenciement éco — votre
              conjoint y a droit comme tout salarié (75 % salaire brut, 12 mois).
            </li>
            <li>
              <strong>Cotisations</strong> : régime général (URSSAF + retraite
              salariés). Plus protecteur, mais plus coûteux que le statut
              collaborateur.
            </li>
            <li>
              <strong>Attention</strong> : France Travail vérifie strictement
              la réalité du lien de subordination. Pour les couples
              co-gérants, l&apos;allocation peut être refusée.
            </li>
          </ul>
        </div>
      )}

      {statut === 'collaborateur' && (
        <div className="mt-5 rounded-2xl border border-jaune/30 bg-jaune/5 p-4">
          <p className="font-display text-base text-jaune">Conjoint collaborateur</p>
          <p className="mt-2 text-sm text-navy/80">
            Statut intermédiaire (loi PACTE 2019 + loi du 14 fév. 2022).
            Le conjoint participe sans rémunération mais est{' '}
            <strong>inscrit au RCS / RM</strong> et cotise pour sa
            retraite et la prévoyance.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-navy/80">
            <li>
              <strong>Durée limitée à 5 ans cumulés</strong> (loi 14 fév.
              2022) — au-delà, basculement obligatoire en salarié ou
              associé. Vérifiez si vous approchez de la limite.
            </li>
            <li>
              <strong>Pas d&apos;AGS</strong> ni d&apos;allocation chômage
              (pas de contrat de travail).
            </li>
            <li>
              <strong>Pouvoirs de gestion</strong> : peut accomplir des
              actes d&apos;administration courante au nom de l&apos;entreprise
              (commandes, factures), engageant solidairement le chef
              d&apos;entreprise.
            </li>
            <li>
              <strong>Cotisations</strong> à l&apos;URSSAF (TI) ou à la
              MSA, sur une assiette forfaitaire ou réelle au choix.
              Calculées sur le revenu professionnel du chef d&apos;entreprise.
            </li>
            <li>
              <strong>En procédure collective</strong> : les droits
              acquis du conjoint collaborateur restent valables (retraite,
              IJ maladie) mais il n&apos;y a pas d&apos;indemnisation
              spécifique. Mobilisez l&apos;ATI si vous y êtes éligible.
            </li>
          </ul>
        </div>
      )}

      {statut === 'associe' && (
        <div className="mt-5 rounded-2xl border border-bleu/30 bg-bleu/5 p-4">
          <p className="font-display text-base text-bleu-fonce">Conjoint associé</p>
          <p className="mt-2 text-sm text-navy/80">
            Le conjoint détient des parts sociales ou actions et participe
            à l&apos;activité. Statut courant en SARL/SAS familiales.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-navy/80">
            <li>
              <strong>Responsabilité limitée</strong> aux apports (sauf
              caution personnelle, garantie ou faute de gestion).
            </li>
            <li>
              <strong>Co-gérant</strong> possible : si oui, statut TNS
              (cotisations indépendants) si gérant majoritaire, sinon
              assimilé salarié (sans chômage).
            </li>
            <li>
              <strong>Risque en cessation</strong> : si votre conjoint est
              co-gérant ET la justice retient une <strong>solidarité de
              gestion</strong>, l&apos;action en comblement de passif
              (L651-2) peut le viser à titre personnel. La preuve
              d&apos;une participation effective à la décision fautive
              est nécessaire.
            </li>
            <li>
              <strong>Dividendes</strong> : suspendus en procédure
              collective, et déjà perçus peuvent être réclamés s&apos;ils
              relèvent de la période suspecte (L632-1).
            </li>
          </ul>
        </div>
      )}

      {statut === 'aucun' && (
        <div className="mt-5 rounded-2xl border border-jaune/30 bg-jaune/5 p-4">
          <p className="font-display text-base text-jaune">
            Conjoint sans statut déclaré — attention au statut de fait
          </p>
          <p className="mt-2 text-sm text-navy/80">
            Si votre conjoint participe régulièrement à l&apos;activité{' '}
            <strong>sans statut déclaré</strong>, vous êtes en infraction
            (art. L121-4 C. com.) et il/elle peut faire reconnaître un{' '}
            <strong>statut de collaborateur de fait</strong> en cas de
            séparation, divorce ou décès — avec indemnisation
            rétroactive (Cass. com. n° 21-19.387, 8 fév. 2023).
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-navy/80">
            <li>
              <strong>Si participation effective</strong> (tenue caisse,
              relation clients, comptabilité…) : <strong>régularisez</strong>{' '}
              dès que possible — formulaire P0/P2 selon la situation.
            </li>
            <li>
              <strong>Sanction</strong> : le conjoint est présumé
              collaborateur s&apos;il participe sans rémunération.
            </li>
            <li>
              <strong>En procédure</strong>, l&apos;action en
              reconnaissance peut bloquer la clôture si elle est engagée
              avant.
            </li>
          </ul>
        </div>
      )}

      {/* Section transversale : co-gérance */}
      {reponses.coGerants === 'oui' && (
        <div className="mt-4 rounded-2xl border border-rouge/30 bg-rouge/5 p-4">
          <p className="font-display text-base text-rouge">
            ⚠️ Co-gérance déclarée — solidarité fiscale et sociale
          </p>
          <p className="mt-2 text-sm text-navy/80">
            Vous avez indiqué être plusieurs gérants. <strong>Tous les
            co-gérants sont solidairement responsables</strong> :
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-navy/80">
            <li>
              <strong>Solidarité fiscale</strong> (art. L267 LPF) : en cas
              de manœuvres frauduleuses, le SIE peut poursuivre n&apos;importe
              lequel des co-gérants pour la totalité de la dette fiscale
              de la société.
            </li>
            <li>
              <strong>Solidarité sociale</strong> (art. L243-6-2 CSS) :
              idem URSSAF pour les cotisations en cas d&apos;inobservation
              grave et répétée.
            </li>
            <li>
              <strong>Insuffisance d&apos;actif</strong> (art. L651-2 C.
              com.) : l&apos;action en comblement peut viser chaque
              co-gérant selon sa part dans la faute.
            </li>
          </ul>
          <p className="mt-3 text-sm text-navy/80">
            <strong>Action protectrice</strong> : faites établir un{' '}
            <strong>procès-verbal de répartition des fonctions</strong>{' '}
            (gérance technique, financière, commerciale…). Cela permet
            de démontrer qu&apos;un co-gérant n&apos;était pas en charge
            du domaine où la faute a été commise.
          </p>
        </div>
      )}

      <p className="mt-5 text-xs text-navy/50">
        Sources : C. com. art. L121-4 à L121-8 (statut du conjoint) ;
        loi n° 2005-882 du 2 août 2005 ; loi PACTE n° 2019-486 du 22
        mai 2019 ; loi n° 2022-172 du 14 février 2022 (limite 5 ans
        conjoint collaborateur) ; LPF art. L267 ; CSS art. L243-6-2 ;
        Cass. com. n° 21-19.387 du 8 fév. 2023 (collaborateur de fait).
      </p>
    </BlocAccordeon>
  );
}
