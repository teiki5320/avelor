import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Mentions légales — AVELOR',
  description: 'Mentions légales de la plateforme Avelor : éditeur, hébergeur, contact, propriété intellectuelle.',
  robots: { index: true, follow: true },
};

export default function MentionsLegalesPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
      <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-navy/60 hover:text-navy">
        ← Accueil
      </Link>

      <h1 className="font-display text-3xl text-navy sm:text-4xl">Mentions légales</h1>
      <p className="mt-3 text-sm text-navy/60">Dernière mise à jour : 28 mai 2026</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-navy/80">

        <section>
          <h2 className="font-display text-lg text-navy">1. Éditeur du site</h2>
          <p className="mt-2">
            Le présent site <strong>avelor.vercel.app</strong> est édité dans le cadre d&apos;un projet d&apos;accompagnement gratuit
            des dirigeants d&apos;entreprise en difficulté. Pour toute demande relative à l&apos;édition du site,
            contactez : <a href="mailto:contact@avelor.vercel.app" className="text-bleu-fonce underline">contact@avelor.vercel.app</a>.
          </p>
          <p className="mt-2">
            Avelor n&apos;est ni un cabinet d&apos;avocat, ni un mandataire judiciaire, ni un expert-comptable.
            Il s&apos;agit d&apos;un outil d&apos;information et d&apos;orientation, qui ne se substitue en aucun cas
            à un conseil personnalisé.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-navy">2. Hébergeur</h2>
          <p className="mt-2">
            Le site est hébergé par <strong>Vercel Inc.</strong> · 340 S Lemon Ave #4133, Walnut, CA 91789, USA ·{' '}
            <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-bleu-fonce underline">vercel.com</a>
          </p>
          <p className="mt-2">
            La base de données utilisateurs est hébergée par <strong>Supabase Inc.</strong> dans l&apos;Union européenne
            (zone <code>eu-central-1</code>).
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-navy">3. Propriété intellectuelle</h2>
          <p className="mt-2">
            L&apos;ensemble des contenus du site (textes, illustrations, calculateurs, modèles de courriers, données
            structurées) sont protégés par le Code de la propriété intellectuelle.
          </p>
          <p className="mt-2">
            Toute reproduction, représentation ou diffusion totale ou partielle nécessite une autorisation préalable.
            L&apos;usage personnel et l&apos;impression de votre fiche personnalisée sont libres.
          </p>
          <p className="mt-2">
            Les marques, logos et signes distinctifs des organismes cités (URSSAF, BPI, CCSF, etc.) restent
            la propriété de leurs détenteurs respectifs.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-navy">4. Sources et fiabilité des informations</h2>
          <p className="mt-2">
            Toutes les informations juridiques publiées sur Avelor sont issues de sources officielles :
            Code de commerce, Code du travail, Code de la sécurité sociale, sites .gouv.fr, INSEE, BODACC, etc.
            Les références aux articles de loi sont systématiquement citées.
          </p>
          <p className="mt-2">
            Les coordonnées des organismes (DDFiP, barreaux, chambres notaires, chambres d&apos;agriculture)
            sont collectées via des annuaires publics et vérifiées périodiquement. Pour une garantie absolue
            d&apos;exactitude, vérifiez systématiquement auprès du site officiel de l&apos;organisme avant tout
            envoi de courrier ou de pièce.
          </p>
          <p className="mt-2">
            Les fourchettes de coûts, multiples sectoriels et taux de réfaction issus de la pratique des
            mandataires/commissaires-priseurs sont <strong>indicatifs</strong> et non opposables.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-navy">5. Limitation de responsabilité</h2>
          <p className="mt-2">
            Avelor met à disposition des informations pour orienter les dirigeants. <strong>Ces informations ne
            constituent en aucun cas un conseil juridique, fiscal ou comptable personnalisé.</strong>
          </p>
          <p className="mt-2">
            Aucune décision de procédure collective (sauvegarde, redressement, liquidation, mandat ad hoc,
            conciliation, PRP) ne doit être prise sans l&apos;avis préalable d&apos;un avocat, d&apos;un mandataire
            judiciaire et/ou d&apos;un expert-comptable.
          </p>
          <p className="mt-2">
            L&apos;éditeur ne saurait être tenu responsable des conséquences d&apos;une décision prise sur la base
            des informations publiées sans validation par un professionnel qualifié.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-navy">6. Liens externes</h2>
          <p className="mt-2">
            Avelor contient des liens vers des sites externes (administrations, syndicats, fédérations,
            outils tiers). Ces liens sont fournis à titre indicatif. L&apos;éditeur n&apos;est pas responsable
            du contenu, de la disponibilité ou de la sécurité de ces sites externes.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-navy">7. Cookies et données personnelles</h2>
          <p className="mt-2">
            Avelor utilise uniquement les cookies techniques strictement nécessaires au fonctionnement du
            site (session, sauvegarde locale de votre fiche). Aucun cookie publicitaire ni traceur tiers
            n&apos;est déposé.
          </p>
          <p className="mt-2">
            Les statistiques d&apos;usage agrégées sont collectées via Plausible Analytics, conforme RGPD,
            sans cookie et sans données personnelles identifiantes.
          </p>
          <p className="mt-2">
            Pour le détail du traitement des données personnelles (RGPD), consultez la{' '}
            <Link href="/politique-donnees" className="text-bleu-fonce underline">politique de protection des données</Link>.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-navy">8. Droit applicable et juridiction</h2>
          <p className="mt-2">
            Le présent site est soumis au droit français. Tout litige relatif à son utilisation relève de
            la compétence des tribunaux français.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-navy">9. Contact</h2>
          <p className="mt-2">
            Pour toute question, demande de rectification ou signalement d&apos;information erronée :
            <a href="mailto:contact@avelor.vercel.app" className="text-bleu-fonce underline ml-1">contact@avelor.vercel.app</a>
          </p>
        </section>
      </div>
    </section>
  );
}
