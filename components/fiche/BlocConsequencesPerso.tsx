import type { Reponses } from '@/lib/types';
import BlocAccordeon from './BlocAccordeon';

interface Props {
  reponses: Reponses;
}

interface Section {
  icone: string;
  titre: string;
  intro: string;
  points: { label: string; valeur: string }[];
  actions?: string[];
  sources: string[];
  liens?: { label: string; url: string }[];
}

const SECTIONS: Section[] = [
  {
    icone: '🏦',
    titre: 'FICP et FCC — inscriptions Banque de France (personnes physiques)',
    intro:
      "Deux fichiers tenus par la Banque de France recensent les incidents de paiement. Une inscription n'est pas une sanction mais une information aux établissements bancaires.",
    points: [
      { label: 'FICP', valeur: 'Fichier des Incidents de remboursement de Crédits aux Particuliers. Inscription en cas de 2 mensualités impayées (crédit à la conso) ou de 60 jours d\'impayé (crédit immobilier).' },
      { label: 'FCC', valeur: "Fichier Central des Chèques. Inscription en cas de chèque sans provision non régularisé ou de retrait de carte bancaire pour usage abusif." },
      { label: 'Durée FICP', valeur: '5 ans maximum (levée possible avant si régularisation + notification par le créancier).' },
      { label: 'Durée FCC', valeur: "5 ans pour chèques ; 2 ans pour cartes. Levée immédiate après régularisation." },
      { label: 'Vos droits', valeur: "Accès gratuit à vos données (agence BDF ou particuliers.banque-france.fr). Droit de rectification." },
    ],
    actions: [
      "Consultez votre dossier : compte particulier gratuit sur particuliers.banque-france.fr",
      "En cas d'erreur, demandez rectification par courrier à la BDF avec justificatifs",
      "Après régularisation, vérifiez que le créancier a bien notifié la BDF (obligation légale)",
    ],
    sources: [
      'Code de la consommation art. L751-1 et s. (FICP)',
      'Code monétaire et financier art. L131-73 (FCC)',
    ],
    liens: [
      { label: 'Espace personnel BDF', url: 'https://particuliers.banque-france.fr' },
    ],
  },
  {
    icone: '📊',
    titre: 'Cotation Banque de France (entreprises)',
    intro:
      "La cotation est un indicateur de la capacité de l'entreprise à honorer ses engagements financiers. Elle est communiquée aux banques et influence fortement l'accès au crédit.",
    points: [
      { label: 'Échelle', valeur: '3++ (excellente) à 9 (incapacité à honorer) ; P si procédure collective ouverte ; 0 si aucune info.' },
      { label: 'Mise à jour', valeur: 'Au moins annuelle, ou suite à un événement significatif (dépôt des comptes, incident, jugement).' },
      { label: "Seuil d'alerte", valeur: "Passage à 6 et en dessous : l'accès au crédit devient très difficile. 7 signale un risque élevé." },
      { label: 'Votre droit', valeur: "Vous avez le droit de connaître votre cote, les motifs de la cotation, et de la contester via un entretien avec la BDF." },
    ],
    actions: [
      "Demandez un entretien gratuit avec votre analyste BDF (indiquez vos éléments d'amélioration)",
      "Déposez systématiquement vos comptes annuels : l'absence de dépôt dégrade mécaniquement la cote",
      "Communiquez tout élément positif (contrats, restructuration, recapitalisation)",
    ],
    sources: [
      'Banque de France — « Cotation des entreprises »',
      'Règlement BCE 2014/1374 (crédits éligibles à la BCE)',
    ],
    liens: [
      { label: 'entreprises.banque-france.fr', url: 'https://entreprises.banque-france.fr' },
    ],
  },
  {
    icone: '⚖️',
    titre: "Responsabilité personnelle du dirigeant : ce qui peut être déclenché",
    intro:
      "Plusieurs mécanismes juridiques peuvent engager votre patrimoine ou vos droits de gestion à l'issue d'une procédure. En connaître les contours aide à les éviter.",
    points: [
      { label: 'Action en responsabilité pour insuffisance d\'actif (ex-« comblement de passif »)', valeur: "Peut viser le dirigeant ayant commis une faute de gestion ayant contribué à l'insuffisance d'actif. Condamnation à payer tout ou partie du passif. Prescription : 3 ans à compter du jugement de liquidation." },
      { label: 'Faillite personnelle', valeur: "Interdiction de diriger toute entreprise pendant 15 ans max. Déclenchée pour fautes graves : poursuite abusive d'activité, détournement d'actif, comptabilité fictive." },
      { label: 'Interdiction de gérer', valeur: "Sanction plus large (jusqu'à 15 ans) pour manquements de bonne foi moins graves que la faillite personnelle (défaut de déclaration dans les 45 j, absence de coopération avec le mandataire)." },
      { label: 'Banqueroute (pénal)', valeur: "Délit passible de 5 ans de prison et 75 000 € d'amende. Suppose une procédure collective ET un comportement frauduleux (détournement, faux en écritures, augmentation frauduleuse du passif)." },
      { label: 'Dettes sociales / fiscales', valeur: "L'administration peut engager la responsabilité solidaire du dirigeant (L267 LPF, L244-1 CSS) en cas de manœuvres frauduleuses ou d'inobservation grave et répétée." },
    ],
    actions: [
      "Déclarez la cessation des paiements dans les 45 jours — c'est la première protection",
      "Coopérez pleinement avec le mandataire et le juge-commissaire",
      "Conservez une comptabilité à jour et sincère jusqu'au bout",
      "Ne préférez aucun créancier pendant la période suspecte (18 mois avant cessation)",
      "Ne dissimulez pas de biens : l'inventaire est vérifié, les conséquences sont pénales",
    ],
    sources: [
      'C. com. art. L651-2 (insuffisance d\'actif)',
      'C. com. art. L653-1 à L653-11 (faillite personnelle / interdiction de gérer)',
      'C. com. art. L654-1 à L654-6 (banqueroute)',
      'LPF art. L267 (dettes fiscales) ; CSS art. L244-1 (dettes sociales)',
    ],
  },
];

export default function BlocConsequencesPerso({ reponses }: Props) {
  // Pertinent pour tout le monde — le dirigeant doit connaître ces mécanismes.
  // On ouvre par défaut si situation à risque.
  const defaultOpen = reponses.situation === 'redressement' || reponses.situation === 'assignation';

  return (
    <BlocAccordeon
      icone="🔒"
      titre="Conséquences personnelles à connaître"
      soustitre="Fichiers BDF, cotation, responsabilité — sources officielles"
      defaultOpen={defaultOpen}
    >
      <p className="mb-4 text-sm text-navy/80">
        Trois mécanismes peuvent affecter durablement votre patrimoine,
        votre capacité à emprunter ou à gérer une entreprise. Les
        connaître permet de les anticiper — et le plus souvent, de les
        éviter.
      </p>

      <div className="space-y-5">
        {SECTIONS.map((s) => (
          <section
            key={s.titre}
            className="rounded-2xl border border-navy/10 bg-white/70 p-5"
          >
            <p className="font-display text-lg text-navy">
              <span className="mr-2" aria-hidden>{s.icone}</span>
              {s.titre}
            </p>
            <p className="mt-2 text-sm text-navy/75">{s.intro}</p>

            <dl className="mt-4 space-y-2 text-sm">
              {s.points.map((p) => (
                <div key={p.label} className="rounded-xl bg-white/60 p-3">
                  <dt className="font-medium text-navy">{p.label}</dt>
                  <dd className="mt-1 text-navy/75">{p.valeur}</dd>
                </div>
              ))}
            </dl>

            {s.actions && s.actions.length > 0 && (
              <div className="mt-4">
                <p className="font-display text-sm text-navy">Ce que vous pouvez faire</p>
                <ul className="mt-2 space-y-1 text-sm text-navy/80">
                  {s.actions.map((a, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-navy/40">→</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {s.liens && s.liens.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                {s.liens.map((l) => (
                  <a
                    key={l.url}
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-white/80 px-3 py-1.5 text-bleu-fonce hover:bg-white"
                  >
                    🌐 {l.label}
                  </a>
                ))}
              </div>
            )}

            <p className="mt-4 border-t border-navy/10 pt-3 text-[11px] text-navy/55">
              <strong>Sources :</strong> {s.sources.join(' · ')}
            </p>
          </section>
        ))}
      </div>

      <p className="mt-5 text-xs text-navy/50">
        Ces informations sont générales. L&apos;appréciation de votre
        situation particulière par un avocat peut être utile — la
        plupart proposent un premier RDV gratuit.
      </p>
    </BlocAccordeon>
  );
}
