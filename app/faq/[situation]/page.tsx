import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface QR {
  q: string;
  r: string;
}

interface FaqCiblee {
  titre: string;
  metaTitle: string;
  metaDesc: string;
  intro: string;
  questions: QR[];
  liensConseilles: { href: string; label: string }[];
}

const FAQ_PAR_SITUATION: Record<string, FaqCiblee> = {
  'urssaf-impayee': {
    titre: 'FAQ — URSSAF impayée : vos questions, nos réponses',
    metaTitle: 'URSSAF impayée : que faire ? Toutes vos questions — AVELOR',
    metaDesc: 'Cotisations URSSAF impayées, mise en demeure, prescription, CCSF : 12 questions et réponses claires pour les dirigeants en difficulté.',
    intro: "Cotisations en retard, lettre recommandée, ATD imminent ? Vous êtes loin d'être seul·e. Voici les 12 questions qui reviennent le plus souvent — sources officielles à l'appui.",
    questions: [
      { q: 'L\'URSSAF peut-elle saisir mon compte bancaire ?', r: 'Oui, via un Avis à Tiers Détenteur (ATD) — devenu Saisie Administrative à Tiers Détenteur (SATD) depuis 2019. C\'est rapide (5 j) et automatique une fois la mise en demeure restée sans effet. Pour bloquer la SATD, négociez un échéancier AVANT, ou contestez via la CRA (Commission de Recours Amiable) dans les 2 mois.' },
      { q: 'Mes cotisations de 2018, sont-elles encore dues ?', r: 'Probablement non. L\'art. L244-3 CSS prescrit les cotisations en 3 ans (5 ans en cas de travail dissimulé). Si vous n\'avez reçu aucune mise en demeure dans ce délai, elles sont prescrites et plus exigibles. À vérifier avec votre expert-comptable ou un avocat.' },
      { q: 'Qu\'est-ce que la CCSF et comment la saisir ?', r: 'La Commission des Chefs de Services Financiers (CCSF) coordonne fisc + Urssaf en un guichet unique. Permet un échelonnement jusqu\'à 36 mois pour les dettes fiscales ET sociales. Saisine via la DDFiP de votre département (formulaire Cerfa 15772). Confidentiel, gratuit.' },
      { q: 'Je suis micro-entrepreneur : puis-je négocier ?', r: 'Oui. Le 3957 prend en charge tous les statuts. Particularités : pas de CCSF (réservée aux entreprises), mais accès direct au Fonds d\'Action Sociale URSSAF (aide d\'urgence, prise en charge partielle). Demande à formuler par écrit, avec justificatifs de baisse d\'activité.' },
      { q: 'L\'URSSAF peut-elle me poursuivre personnellement ?', r: 'Uniquement en cas de manœuvres frauduleuses OU inobservation grave et répétée (art. L243-6-2 CSS) — pas pour une simple difficulté ponctuelle. Le dirigeant peut alors être condamné solidairement avec la société pour les cotisations dues.' },
      { q: 'Je suis en redressement judiciaire : que devient ma dette URSSAF ?', r: 'Elle entre dans le passif et fait l\'objet d\'une déclaration de créance par l\'URSSAF dans les 2 mois suivant la publication. Elle sera traitée comme les autres créances dans le plan de continuation. Les cotisations postérieures au jugement deviennent des créances privilégiées à payer normalement.' },
      { q: 'Le moratoire est-il automatique ?', r: 'Non. Vous devez le demander explicitement, par écrit, en justifiant votre situation (baisse de CA, événement personnel, baisse d\'activité saisonnière). L\'URSSAF répond généralement sous 15 jours. Le moratoire suspend les poursuites pendant sa durée.' },
      { q: 'Et si je ne réponds pas à la mise en demeure ?', r: 'La mise en demeure ouvre 1 mois pour payer ou saisir la CRA. À défaut, une SATD est lancée, puis si toujours impayé, l\'URSSAF peut saisir le tribunal en contrainte (titre exécutoire). Ne jamais laisser pourrir : un simple appel au 3957 permet d\'éviter l\'engrenage.' },
      { q: 'Mes salariés sont-ils impactés par mes dettes URSSAF ?', r: 'Les cotisations salariales prélevées sur leur salaire et non reversées sont une infraction pénale (abus de confiance). Les salariés conservent leurs droits Sécu (CPAM, retraite) sur la base des déclarations faites. Mais en cas de fraude grave, le dirigeant peut être poursuivi pénalement.' },
      { q: 'L\'URSSAF accepte-t-elle des remises gracieuses ?', r: 'Oui, sur les majorations et pénalités (rarement sur le principal). Demande écrite, justifier la bonne foi et la situation. La CRA peut accorder une remise partielle. À combiner avec un échéancier.' },
      { q: 'Je suis en cessation : URSSAF ou tribunal d\'abord ?', r: 'En théorie, la déclaration de cessation au tribunal est prioritaire (45 j max — art. L631-4 C. com.). En pratique, prévenir le 3957 en parallèle évite une SATD qui aggraverait votre trésorerie pendant les 45 j.' },
      { q: 'Une procédure collective efface-t-elle ma dette URSSAF ?', r: 'En liquidation judiciaire avec clôture pour insuffisance d\'actif : oui pour la société, mais pas pour le dirigeant (sauf s\'il a personnellement été poursuivi en L243-6-2). En RJ avec plan : la dette est échelonnée selon le plan. Le rétablissement professionnel (PRP) efface les dettes pro pour un EI sans salariés.' },
    ],
    liensConseilles: [
      { href: '/situation/dettes-urssaf', label: 'Guide complet — Dettes URSSAF' },
      { href: '/courriers/echelonnement-urssaf', label: 'Courrier d\'échelonnement' },
      { href: '/outils/prescription', label: 'Vérificateur de prescription' },
    ],
  },

  'pge-en-difficulte': {
    titre: 'FAQ — PGE en difficulté : restructuration, médiation, alternatives',
    metaTitle: 'PGE en difficulté : restructurer ou pas ? — AVELOR',
    metaDesc: 'Prêt Garanti par l\'État (Covid) en remboursement : restructuration jusqu\'à 10 ans, médiation, conséquences d\'une procédure collective. 10 questions clés.',
    intro: 'Le remboursement de votre PGE pèse sur la trésorerie ? Vous avez plusieurs leviers, mais l\'ordre dans lequel vous les actionnez change tout. Voici les 10 questions essentielles.',
    questions: [
      { q: 'Mon PGE peut-il être étalé au-delà de 6 ans ?', r: 'Oui — depuis le protocole de place du 19 janvier 2022, jusqu\'à 10 ans au total (6 + 4 supplémentaires), sans perte de la garantie d\'État. La banque ne peut pas refuser sans motif sérieux. Demande à formuler par écrit (LRAR).' },
      { q: 'Si je passe en sauvegarde / RJ, je perds la garantie d\'État ?', r: 'Oui — l\'ouverture d\'une procédure collective fait perdre la garantie d\'État pour la banque sur le PGE. La banque devient créancier ordinaire. Conséquence : elle n\'a plus d\'intérêt à négocier amiablement APRÈS le jugement. Donc : restructurez AVANT.' },
      { q: 'Comment saisir la Médiation du crédit ?', r: 'Gratuit, confidentiel : appelez le 3414 ou remplissez le formulaire sur mediateur-credit.banque-france.fr. Le médiateur prend contact avec votre banque sous 48 h, taux de succès > 60 %. À utiliser si la banque refuse ou tarde.' },
      { q: 'Mon banquier peut-il appeler la garantie sans m\'en parler ?', r: 'Non. La banque doit d\'abord vous mettre en demeure formelle, attendre 90 j de défaut, puis poursuivre les co-emprunteurs et cautions avant d\'appeler la garantie. Si elle ne le fait pas, Bpifrance peut refuser la garantie.' },
      { q: 'Le PGE peut-il être renégocié plusieurs fois ?', r: 'Oui en théorie, mais chaque renégociation aboutit à un nouvel échelonnement qui doit rester dans les 10 ans totaux. Au-delà, la garantie d\'État tombe.' },
      { q: 'Je peux différer 12 mois supplémentaires de plus ?', r: 'Oui, le protocole de place autorise un différé total cumulé pouvant aller jusqu\'à 6-12 mois sur les périodes les plus tendues. À négocier avec votre banque, puis en cas de refus avec la Médiation.' },
      { q: 'Le PGE peut-il être effacé en procédure collective ?', r: 'En liquidation : oui pour la part non-garantie de la banque (la banque récupère 70-90 % via la garantie d\'État). En RJ avec plan : il est échelonné selon le plan, l\'État perd alors une partie de sa garantie.' },
      { q: 'Y a-t-il une aide pour les PME post-PGE ?', r: 'Oui — le Prêt Croissance Relance, le Prêt Rebond (10 à 300 k€ sans garantie) et les dispositifs FSE+. La Direction Régionale Bpifrance peut faire un diagnostic gratuit (3247).' },
      { q: 'Suis-je personnellement caution du PGE ?', r: 'En principe non — le PGE est garanti à 70-90 % par l\'État, le reste par la banque. Mais certaines banques ont demandé une caution personnelle pour le différentiel. Vérifier votre contrat. Si caution = vérifier sa proportionnalité (L341-4 C. conso).' },
      { q: 'Mandat ad hoc + PGE : compatible ?', r: 'Excellent combo. Le mandat ad hoc est confidentiel (pas de publication), permet de tout renégocier dans un cadre sécurisé, et préserve la garantie d\'État sur le PGE. Coût : 1 500 à 5 000 €, demandé au tribunal de commerce.' },
    ],
    liensConseilles: [
      { href: '/situation/credit-bancaire', label: 'Guide crédit bancaire' },
      { href: '/aides-personnelles', label: 'Aides financières' },
    ],
  },

  'assignation-tribunal': {
    titre: 'FAQ — Assignation au tribunal : urgence et défense',
    metaTitle: 'Assignation au tribunal : que faire ? — AVELOR',
    metaDesc: 'Vous avez reçu une assignation : audience, défense, aide juridictionnelle, plan de cession. Réponses claires aux 10 questions essentielles.',
    intro: 'Une assignation au tribunal est urgente mais pas désespérée. Voici les 10 questions à se poser ce soir.',
    questions: [
      { q: 'Je n\'ai pas le temps de me défendre. Que se passe-t-il si je ne viens pas ?', r: 'Le tribunal peut juger PAR DÉFAUT — presque toujours en votre défaveur. Représentez-vous (ou faites-vous représenter par un avocat). L\'audience ne dure souvent que 15 minutes.' },
      { q: 'Combien de temps ai-je pour réagir ?', r: 'Variable selon l\'assignation : généralement 15 j minimum entre la signification et l\'audience. Lisez la date d\'audience sur l\'acte. Contactez un avocat AUJOURD\'HUI.' },
      { q: 'Puis-je obtenir un délai supplémentaire ?', r: 'Oui, en demandant un renvoi à l\'audience (argument : préparation du dossier, recherche d\'avocat). Le juge accorde généralement 1 mois.' },
      { q: 'Mon RFR est faible : puis-je avoir un avocat gratuit ?', r: 'Oui via l\'aide juridictionnelle si votre RFR < 19 411 €/an (totale) ou < 25 081 € (partielle). Demande sur service-public.fr — réponse rapide. Voir notre calculateur dédié.' },
      { q: 'L\'assignation peut-elle me faire mettre en liquidation immédiate ?', r: 'Le tribunal examine d\'abord s\'il y a cessation des paiements (L631-1). Si oui, il ouvre une procédure (RJ ou LJ). Si non, il rejette l\'assignation. Préparer : trésorerie, liste créanciers, derniers bilans, justificatifs.' },
      { q: 'Puis-je proposer un plan de cession à l\'audience ?', r: 'Oui — proposer une cession partielle ou totale peut éviter la liquidation pure. Le tribunal préfère sauver l\'activité quand c\'est possible. Préparer un repreneur identifié = atout majeur.' },
      { q: 'Le créancier qui m\'assigne peut-il être condamné aux dépens ?', r: 'Oui, si l\'assignation est manifestement abusive ou non fondée. Le juge peut imposer le paiement des frais à l\'assignant. Argument à soulever par l\'avocat.' },
      { q: 'Que faire des autres créanciers pendant l\'audience ?', r: 'Suspendre les paiements non-essentiels. Ne PAS payer un créancier en priorité (risque de période suspecte = annulation). Continuer à payer les fournisseurs essentiels à l\'activité.' },
      { q: 'Quel est le coût d\'un avocat pour cette audience ?', r: 'Forfait audience : 800-2 000 € HT. Aide juridictionnelle si éligible. Premier RDV souvent gratuit — appelez 2-3 cabinets pour comparer.' },
      { q: 'Si je perds, ai-je un recours ?', r: 'Appel possible sous 10 jours (art. R661-3 C. com.). L\'appel est suspensif sauf exécution provisoire de plein droit. À discuter immédiatement avec l\'avocat.' },
    ],
    liensConseilles: [
      { href: '/outils/aide-juridictionnelle', label: 'Calculateur AJ' },
      { href: '/situation/credit-bancaire', label: 'Guide complet' },
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(FAQ_PAR_SITUATION).map((situation) => ({ situation }));
}

export async function generateMetadata({ params }: { params: { situation: string } }): Promise<Metadata> {
  const data = FAQ_PAR_SITUATION[params.situation];
  if (!data) return {};
  return {
    title: data.metaTitle,
    description: data.metaDesc,
  };
}

export default function FaqCibleePage({ params }: { params: { situation: string } }) {
  const data = FAQ_PAR_SITUATION[params.situation];
  if (!data) return notFound();

  const jsonLdFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.questions.map((qr) => ({
      '@type': 'Question',
      name: qr.q,
      acceptedAnswer: { '@type': 'Answer', text: qr.r },
    })),
  };

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://avelor.vercel.app/' },
      { '@type': 'ListItem', position: 2, name: 'FAQ', item: 'https://avelor.vercel.app/faq' },
      { '@type': 'ListItem', position: 3, name: data.titre },
    ],
  };

  return (
    <section className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />

      <Link href="/faq" className="mb-6 inline-flex items-center gap-2 text-sm text-navy/60 hover:text-navy">
        ← Toutes les FAQ
      </Link>

      <h1 className="font-display text-3xl text-navy sm:text-4xl">{data.titre}</h1>
      <p className="mt-4 max-w-2xl text-base text-navy/70">{data.intro}</p>

      <div className="mt-10 space-y-5">
        {data.questions.map((qr, i) => (
          <details key={i} className="glass-soft rounded-2xl p-5">
            <summary className="cursor-pointer list-none font-display text-base text-navy hover:text-bleu-fonce">
              <span className="mr-2 text-navy/40">{i + 1}.</span>
              {qr.q}
            </summary>
            <p className="mt-3 text-sm text-navy/80">{qr.r}</p>
          </details>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-navy/15 bg-white/60 p-5">
        <p className="font-display text-base text-navy">Pour aller plus loin</p>
        <ul className="mt-3 space-y-1.5 text-sm text-navy/80">
          {data.liensConseilles.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-bleu-fonce hover:underline">
                → {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
