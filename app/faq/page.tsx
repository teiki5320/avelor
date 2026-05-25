import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Questions fréquentes · AVELOR',
  description:
    'Réponses aux questions les plus courantes sur la cessation des paiements, les procédures collectives, les dettes, la protection personnelle et le rebond.',
};

interface QuestionReponse {
  question: string;
  reponse: string;
  liens?: { href: string; label: string; externe?: boolean }[];
}

interface SectionFAQ {
  titre: string;
  id: string;
  questions: QuestionReponse[];
}

const SECTIONS: SectionFAQ[] = [
  {
    titre: 'Cessation des paiements',
    id: 'cessation',
    questions: [
      {
        question: 'Qu&apos;est-ce que la cessation des paiements exactement ?',
        reponse:
          'La cessation des paiements est définie par l&apos;article L631-1 du Code de commerce : c&apos;est l&apos;impossibilité de faire face au passif exigible avec l&apos;actif disponible. Concrètement, vous ne pouvez plus payer vos dettes échues (URSSAF, fournisseurs, impôts, loyer) avec votre trésorerie et vos créances clients encaissables immédiatement. Ce n&apos;est pas un simple découvert bancaire — c&apos;est une situation juridique précise, constatée à une date donnée.',
        liens: [
          { href: '/outils/prescription', label: 'Calculateur de délais' },
        ],
      },
      {
        question: 'Quel est le délai pour la déclarer ?',
        reponse:
          'Vous disposez de 45 jours maximum après la date de cessation des paiements pour la déclarer au greffe du tribunal de commerce (article L631-4 du Code de commerce). Ce délai court à partir du moment où vous ne pouvez plus payer vos dettes échues — pas à partir du moment où vous en prenez conscience. La déclaration se fait via le formulaire Cerfa n°10530, accompagné des documents comptables.',
        liens: [
          { href: '/courriers', label: 'Modèles de courriers' },
        ],
      },
      {
        question: 'Que se passe-t-il si je ne la déclare pas à temps ?',
        reponse:
          'Le non-respect du délai de 45 jours expose le dirigeant à une interdiction de gérer (article L653-8 du Code de commerce), pouvant aller jusqu&apos;à 15 ans. Le tribunal peut aussi remonter la date de cessation des paiements jusqu&apos;à 18 mois en arrière (période suspecte), ce qui annule certains paiements et garanties consentis pendant cette période. En cas de faute de gestion avérée, une action en responsabilité pour insuffisance d&apos;actif est possible (article L651-2).',
      },
      {
        question: 'Puis-je continuer à diriger mon entreprise ?',
        reponse:
          'Cela dépend de la procédure ouverte. En sauvegarde, vous restez aux commandes avec l&apos;assistance d&apos;un administrateur. En redressement judiciaire, le tribunal détermine si vous administrez seul ou avec un administrateur (article L631-12). En liquidation judiciaire, vous perdez la gestion : un liquidateur est nommé pour réaliser les actifs et payer les créanciers (article L641-9).',
        liens: [
          { href: '/procedures', label: 'Comparer les procédures' },
        ],
      },
    ],
  },
  {
    titre: 'Procédures collectives',
    id: 'procedures',
    questions: [
      {
        question: 'Quelle est la différence entre sauvegarde et redressement ?',
        reponse:
          'La différence fondamentale est le timing. La sauvegarde (article L620-1) est ouverte avant la cessation des paiements : l&apos;entreprise a des difficultés qu&apos;elle ne peut surmonter seule, mais elle peut encore payer ses dettes. Le redressement (article L631-1) intervient après la cessation des paiements. Dans les deux cas, les poursuites individuelles sont suspendues et un plan d&apos;apurement sur 10 ans maximum peut être adopté. Avantage clé de la sauvegarde : le dirigeant reste toujours aux commandes.',
        liens: [
          { href: '/procedures', label: 'Tableau comparatif des procédures' },
        ],
      },
      {
        question: 'Combien coûte une procédure collective ?',
        reponse:
          'Les frais de justice (greffe) sont modestes : quelques centaines d&apos;euros pour le dépôt. Le coût principal vient des honoraires des mandataires de justice (administrateur, mandataire judiciaire), fixés par décret (R663-1 et suivants du Code de commerce) selon un barème proportionnel au chiffre d&apos;affaires et au nombre de salariés. Comptez environ 3 000 à 10 000 euros pour une petite entreprise. L&apos;aide juridictionnelle est possible si vos revenus personnels sont faibles.',
      },
      {
        question: 'Combien de temps dure un redressement judiciaire ?',
        reponse:
          'La période d&apos;observation initiale est de 6 mois, renouvelable une fois (article L631-7). En tout, elle ne peut excéder 18 mois. Pendant cette période, le tribunal évalue si l&apos;entreprise est viable. Si oui, un plan de redressement est adopté (apurement des dettes sur 10 ans maximum). Si non, la liquidation judiciaire est prononcée.',
      },
      {
        question: 'Puis-je choisir mon mandataire judiciaire ?',
        reponse:
          'Non, c&apos;est le tribunal qui désigne le mandataire judiciaire et l&apos;administrateur judiciaire (articles L621-4 et L631-9 du Code de commerce). Cependant, vous pouvez suggérer un nom au tribunal, qui reste libre de sa décision. Vous pouvez aussi demander le remplacement d&apos;un mandataire en cas de difficulté (article L621-7).',
        liens: [
          { href: '/annuaires/mandataires', label: 'Annuaire des mandataires' },
        ],
      },
    ],
  },
  {
    titre: 'Dettes et créanciers',
    id: 'dettes',
    questions: [
      {
        question: 'Puis-je négocier directement avec l&apos;URSSAF ?',
        reponse:
          'Oui. Vous pouvez demander des délais de paiement directement à l&apos;URSSAF (numéro 3957) ou via la Commission des chefs de services financiers (CCSF) de votre département, qui regroupe tous les créanciers publics (URSSAF, impôts, douanes). La CCSF peut accorder un plan d&apos;échelonnement sur 12 à 36 mois. L&apos;URSSAF peut aussi accorder une remise partielle des majorations de retard (article L243-5 du Code de la sécurité sociale).',
        liens: [
          { href: '/courriers/urssaf-delai', label: 'Modèle courrier URSSAF' },
          { href: '/outils/ccsf', label: 'Simulateur CCSF' },
        ],
      },
      {
        question: 'Mes dettes personnelles sont-elles concernées ?',
        reponse:
          'Si vous êtes en société (SARL, SAS, SA), vos dettes personnelles sont en principe séparées de celles de l&apos;entreprise — c&apos;est le principe de la personnalité morale. Exceptions : les cautions personnelles que vous avez signées, les comptes courants d&apos;associé, et les cas de faute de gestion (action en comblement de passif, article L651-2). Si vous êtes entrepreneur individuel, la loi du 14 février 2022 protège désormais votre patrimoine personnel de plein droit (article L526-22 du Code de commerce).',
        liens: [
          { href: '/proteger-famille', label: 'Protéger famille et patrimoine' },
        ],
      },
      {
        question: 'Que couvre la garantie AGS pour mes salariés ?',
        reponse:
          'L&apos;AGS (Association pour la gestion du régime de Garantie des créances des Salariés) avance les salaires, indemnités de licenciement, préavis et congés payés impayés en cas de procédure collective. Les plafonds sont fixés par décret : le plafond 6 couvre jusqu&apos;à 6 fois le plafond mensuel de la Sécurité sociale (soit environ 24 000 euros en 2024). La demande est faite par le mandataire judiciaire, pas par le dirigeant.',
        liens: [
          { href: '/annuaires/ags', label: 'Contacts AGS' },
          { href: '/outils/licenciement', label: 'Calculateur indemnités' },
        ],
      },
    ],
  },
  {
    titre: 'Protection personnelle',
    id: 'protection',
    questions: [
      {
        question: 'Ma résidence principale est-elle saisissable ?',
        reponse:
          'Depuis la loi Macron du 6 août 2015 (article L526-1 du Code de commerce), la résidence principale de l&apos;entrepreneur individuel est insaisissable de plein droit pour les dettes professionnelles — aucune déclaration notariée n&apos;est nécessaire. Pour les dirigeants de société, la résidence est protégée sauf si vous avez consenti une hypothèque ou un cautionnement réel. Attention : cette protection ne joue pas pour les dettes fiscales et sociales en cas de fraude.',
        liens: [
          { href: '/proteger-famille', label: 'Protection du patrimoine' },
        ],
      },
      {
        question: 'Ma caution personnelle peut-elle être annulée ?',
        reponse:
          'Une caution personnelle peut être contestée dans plusieurs cas : si elle est disproportionnée par rapport à vos revenus et patrimoine au moment de la signature (article L332-1 du Code de la consommation), si la banque ne vous a pas averti de la défaillance du débiteur principal (obligation d&apos;information annuelle, article L333-2), ou si les conditions de mise en jeu ne sont pas respectées. Un avocat peut analyser votre acte de cautionnement pour identifier des failles.',
        liens: [
          { href: '/outils/caution', label: 'Audit caution en ligne' },
        ],
      },
      {
        question: 'Quelles sont mes aides personnelles (ATI, RSA) ?',
        reponse:
          'L&apos;ATI (Allocation des travailleurs indépendants) est versée par France Travail (ex-Pôle emploi) aux indépendants dont l&apos;entreprise a fait l&apos;objet d&apos;une liquidation judiciaire ou d&apos;un redressement avec plan de cession totale. Elle est d&apos;environ 800 euros par mois pendant 6 mois (décret n°2019-796). Le RSA est accessible sous conditions de ressources. La CSS (Complémentaire santé solidaire) couvre vos frais de santé. APESA propose un soutien psychologique gratuit et confidentiel.',
        liens: [
          { href: '/aides-personnelles', label: 'Toutes les aides personnelles' },
          { href: '/outils/ati', label: 'Simulateur ATI' },
          { href: '/parler', label: 'Numéros d&apos;écoute gratuits' },
        ],
      },
    ],
  },
  {
    titre: 'Rebondir après',
    id: 'rebond',
    questions: [
      {
        question: 'Puis-je recréer une entreprise après une liquidation ?',
        reponse:
          'Oui, sauf si le tribunal a prononcé une interdiction de gérer (article L653-8 du Code de commerce), ce qui est réservé aux cas de faute de gestion grave. Après clôture de la liquidation, vous êtes libre de recréer une entreprise immédiatement. La loi du 14 février 2022 a renforcé le droit au rebond : les dettes professionnelles de l&apos;entrepreneur individuel sont effacées à la clôture pour insuffisance d&apos;actif. Pour les dirigeants de société, la clôture met fin à la procédure mais pas nécessairement aux cautions personnelles.',
        liens: [
          { href: '/rebond', label: 'Guide du rebond' },
        ],
      },
      {
        question: 'Quelles aides existent pour repartir (ACRE, ARCE) ?',
        reponse:
          'L&apos;ACRE (Aide aux créateurs et repreneurs d&apos;entreprise) offre une exonération partielle de cotisations sociales pendant 12 mois. L&apos;ARCE (Aide à la reprise ou à la création d&apos;entreprise) permet de percevoir 60 % de ses droits ARE restants en deux versements pour capitaliser le projet. Le prêt d&apos;honneur (Initiative France, Réseau Entreprendre) va de 2 000 à 50 000 euros à taux zéro. 60 000 Rebonds accompagne gratuitement les entrepreneurs après une liquidation. BPI France propose un prêt rebond jusqu&apos;à 50 000 euros.',
        liens: [
          { href: '/rebond', label: 'Guide complet du rebond' },
          { href: '/aides', label: 'Toutes les aides entreprise' },
        ],
      },
      {
        question: 'Combien de temps faut-il pour se relancer ?',
        reponse:
          'Il n&apos;y a pas de délai légal d&apos;attente (sauf interdiction de gérer). En pratique, les entrepreneurs qui rebondissent mettent en moyenne 12 à 24 mois entre la clôture de la liquidation et la création d&apos;une nouvelle activité. L&apos;accompagnement par des réseaux spécialisés (60 000 Rebonds, BGE, CCI) réduit significativement ce délai. Le plus important est de prendre le temps de tirer les enseignements de l&apos;expérience précédente et de se faire accompagner psychologiquement si besoin (APESA, associations de pairs).',
        liens: [
          { href: '/parler', label: 'Parler à quelqu&apos;un' },
          { href: '/accompagnant', label: 'J&apos;accompagne un proche' },
        ],
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <main id="contenu-principal" className="mx-auto max-w-3xl px-5 pb-24 pt-28 sm:pt-32">
      <h1 className="font-display text-3xl text-navy sm:text-4xl">
        Questions fréquentes
      </h1>
      <p className="mt-3 text-base text-navy/60 sm:text-lg">
        Les réponses aux questions que se posent les dirigeants en difficulté,
        avec les sources juridiques. Cette page ne remplace pas un conseil
        personnalisé.
      </p>

      {/* Sommaire */}
      <nav className="mt-8 glass-soft rounded-2xl p-5" aria-label="Sommaire FAQ">
        <p className="text-sm font-medium text-navy/50 uppercase tracking-wide">
          Sommaire
        </p>
        <ul className="mt-3 space-y-1.5">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="text-sm text-bleu hover:text-bleu-fonce transition"
              >
                {s.titre}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Sections */}
      {SECTIONS.map((section) => (
        <section key={section.id} id={section.id} className="mt-12">
          <h2 className="font-display text-xl text-navy sm:text-2xl">
            {section.titre}
          </h2>

          <div className="mt-5 space-y-3">
            {section.questions.map((qr, i) => (
              <details
                key={i}
                className="glass-soft rounded-2xl group"
              >
                <summary className="cursor-pointer select-none list-none px-6 py-4 text-navy font-medium hover:bg-navy/5 rounded-2xl transition [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-4">
                    <span className="text-sm sm:text-base">{qr.question}</span>
                    <span
                      className="shrink-0 text-navy/40 transition-transform group-open:rotate-45"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </span>
                </summary>
                <div className="border-t border-navy/5 px-6 py-5">
                  <p className="text-sm leading-relaxed text-navy/75 sm:text-base">
                    {qr.reponse}
                  </p>
                  {qr.liens && qr.liens.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {qr.liens.map((lien) =>
                        lien.externe ? (
                          <a
                            key={lien.href}
                            href={lien.href}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg bg-bleu/10 px-3 py-1.5 text-xs font-medium text-bleu transition hover:bg-bleu/20"
                          >
                            {lien.label}
                          </a>
                        ) : (
                          <Link
                            key={lien.href}
                            href={lien.href}
                            className="inline-flex items-center gap-1 rounded-lg bg-bleu/10 px-3 py-1.5 text-xs font-medium text-bleu transition hover:bg-bleu/20"
                          >
                            {lien.label}
                          </Link>
                        )
                      )}
                    </div>
                  )}
                </div>
              </details>
            ))}
          </div>
        </section>
      ))}

      {/* Bloc de renvoi */}
      <div className="mt-16 glass-soft rounded-2xl p-6 text-center">
        <p className="font-display text-lg text-navy">
          Vous ne trouvez pas la réponse à votre question ?
        </p>
        <p className="mt-2 text-sm text-navy/60">
          Créez votre fiche personnalisée en 2 minutes pour obtenir des réponses
          adaptées à votre situation.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-xl bg-bleu-fonce px-6 py-3 text-sm font-medium text-white transition hover:bg-bleu-fonce/90"
        >
          Commencer
        </Link>
      </div>
    </main>
  );
}
