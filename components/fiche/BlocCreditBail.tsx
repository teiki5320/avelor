'use client';
import BlocAccordeon from './BlocAccordeon';

/**
 * Bloc dédié au crédit-bail (leasing) et à la location longue durée.
 * Le matériel financé est très répandu (véhicules, machines,
 * équipements) — le bloc s'affiche systématiquement.
 *
 * Couvre la qualification des contrats, le sort du matériel et de
 * l'indemnité de résiliation en procédure collective, et les contacts
 * utiles (ASF — Association française des Sociétés Financières).
 */
export default function BlocCreditBail() {
  return (
    <BlocAccordeon
      icone="🚛"
      titre="Crédit-bail et leasing"
      soustitre="Continuation du contrat, restitution, indemnité de résiliation : ce qui change en procédure"
    >
      <p className="text-sm text-navy/80">
        Véhicules utilitaires, machines, matériel informatique, copieurs :
        une part importante du parc productif est financée en{' '}
        <strong>crédit-bail</strong> ou en <strong>location longue durée
        (LLD)</strong>. En cas de difficulté, le traitement de ces contrats
        obéit à des règles très différentes du simple loyer d&apos;exploitation.
      </p>

      {/* Distinction des contrats */}
      <div className="mt-5 rounded-2xl border border-bleu/30 bg-bleu/5 p-4">
        <p className="font-display text-base text-bleu-fonce">
          Bien distinguer les trois formules
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-navy/80">
          <li>
            <strong>Loyer simple (location classique)</strong> : aucune
            option d&apos;achat. Le matériel reste la propriété du bailleur.
          </li>
          <li>
            <strong>Crédit-bail (leasing)</strong> : contrat encadré par
            les art. <strong>L313-7 et s. du Code monétaire et financier</strong>,
            avec <strong>option d&apos;achat</strong> en fin de contrat
            (valeur résiduelle prédéfinie).
          </li>
          <li>
            <strong>Location longue durée (LLD)</strong> : pas d&apos;option
            d&apos;achat. Souvent assortie de prestations (entretien,
            assurance). Régime juridique de la location civile / commerciale.
          </li>
        </ul>
      </div>

      {/* Continuation du contrat en procédure */}
      <div className="mt-4 rounded-2xl border border-vert/30 bg-vert/5 p-4">
        <p className="font-display text-base text-vert">
          Continuation du contrat en cours
        </p>
        <p className="mt-2 text-sm text-navy/80">
          En sauvegarde, redressement ou liquidation,{' '}
          <strong>l&apos;administrateur judiciaire (ou le liquidateur)
          dispose d&apos;une option</strong> sur les contrats en cours
          (art. <strong>L622-13 C. com.</strong>) :
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-navy/80">
          <li>
            <strong>Poursuivre le contrat</strong> : le crédit-bailleur ne
            peut pas le résilier pour les impayés antérieurs au jugement.
            Les loyers postérieurs deviennent des créances privilégiées.
          </li>
          <li>
            <strong>Renoncer au contrat</strong> : le matériel est restitué,
            l&apos;indemnité de résiliation devient une créance chirographaire
            antérieure (déclarée au passif).
          </li>
        </ul>
        <p className="mt-2 text-sm text-navy/80">
          C&apos;est un levier majeur : un matériel essentiel à
          l&apos;exploitation peut être conservé même en cas d&apos;impayés.
        </p>
      </div>

      {/* Restitution du matériel */}
      <div className="mt-4 rounded-2xl border border-jaune/30 bg-jaune/5 p-4">
        <p className="font-display text-base text-jaune">
          Restitution du matériel
        </p>
        <p className="mt-2 text-sm text-navy/80">
          Le crédit-bailleur reste propriétaire du bien tant que
          l&apos;option d&apos;achat n&apos;est pas levée. En cas de
          résiliation, il peut exiger la restitution. Pour être opposable
          aux autres créanciers en procédure collective, le contrat doit
          être <strong>publié au greffe</strong> (art. R313-4 CMF). À
          défaut, le bailleur perd le droit de revendiquer son matériel,
          qui peut être saisi par les créanciers de l&apos;entreprise.
        </p>
      </div>

      {/* Indemnité de résiliation */}
      <div className="mt-4 rounded-2xl border border-rouge/30 bg-rouge/5 p-4">
        <p className="font-display text-base text-rouge">
          Indemnité de résiliation — souvent négociable
        </p>
        <p className="mt-2 text-sm text-navy/80">
          Les contrats prévoient généralement une indemnité égale à{' '}
          <strong>la totalité des loyers restant à échoir</strong>
          (parfois actualisés), majorée de la valeur résiduelle. Cette
          clause est <strong>jugée comminatoire</strong> par la jurisprudence :
          le juge peut la réduire à de <strong>justes proportions</strong>
          (art. <strong>1231-5 C. civ.</strong>) si elle est manifestement
          excessive par rapport au préjudice réel du bailleur (perte
          financière nette après revente du matériel).
        </p>
        <p className="mt-2 text-sm text-navy/80">
          En procédure collective, l&apos;indemnité constitue une{' '}
          <strong>créance chirographaire</strong> (sans privilège) qui sera
          payée au marc le franc selon les disponibilités. En liquidation,
          elle est très souvent éteinte de fait.
        </p>
      </div>

      {/* Plan de continuation */}
      <div className="mt-4 rounded-2xl border border-navy/15 bg-white/60 p-4">
        <p className="font-display text-base text-navy">
          Plan de continuation incluant le matériel
        </p>
        <p className="mt-2 text-sm text-navy/80">
          Dans le cadre d&apos;un plan de sauvegarde ou de redressement,
          le matériel essentiel peut être <strong>intégré au plan</strong>
          avec rééchelonnement des loyers sur 10 ans maximum (art. L626-18
          C. com.). Le crédit-bailleur ne peut pas s&apos;y opposer si le
          plan préserve sa créance.
        </p>
      </div>

      {/* Contact ASF */}
      <div className="mt-5 rounded-2xl border border-navy/15 bg-white/60 p-4">
        <p className="font-display text-base text-navy">
          ASF — Association française des Sociétés Financières
        </p>
        <p className="mt-1 text-xs text-navy/60">
          Syndicat professionnel des sociétés de crédit-bail. Peut faciliter
          un dialogue avec un membre adhérent en cas de litige.
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <a
            href="tel:0153815151"
            className="rounded-full bg-white/80 px-3 py-1.5 text-navy/80 hover:bg-white"
          >
            ☎ 01 53 81 51 51
          </a>
          <a
            href="https://www.asf-france.com"
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-white/80 px-3 py-1.5 text-bleu-fonce hover:bg-white"
          >
            🌐 asf-france.com
          </a>
        </div>
      </div>

      <p className="mt-5 text-xs text-navy/50">
        Sources : Code monétaire et financier, art. L313-7 à L313-11 ;
        Code de commerce, art. L622-13 (continuation des contrats en cours)
        et L626-18 (plan de continuation) ; Code civil, art. 1231-5
        (réduction des clauses pénales).
      </p>
    </BlocAccordeon>
  );
}
