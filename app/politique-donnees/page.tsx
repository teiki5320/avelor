import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Politique de protection des données — AVELOR',
  description: 'Comment Avelor protège vos données personnelles : RGPD, base légale, durée, vos droits.',
  robots: { index: true, follow: true },
};

export default function PolitiqueDonneesPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
      <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-navy/60 hover:text-navy">
        ← Accueil
      </Link>

      <h1 className="font-display text-3xl text-navy sm:text-4xl">Politique de protection des données</h1>
      <p className="mt-3 text-sm text-navy/60">Conforme au RGPD (UE 2016/679) — mise à jour 28 mai 2026</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-navy/80">

        <section className="rounded-2xl border border-vert/30 bg-vert/5 p-5">
          <p className="font-display text-base text-vert">L&apos;essentiel</p>
          <ul className="mt-3 space-y-2 text-navy/80">
            <li><strong>Aucun cookie publicitaire</strong>, aucun traceur tiers</li>
            <li>Vos réponses au questionnaire et votre fiche sont <strong>stockées chez Supabase (UE)</strong> derrière un token aléatoire (24 caractères)</li>
            <li>L&apos;<strong>email n&apos;est demandé que pour vous envoyer un lien magique</strong> de retour vers votre fiche — pas de mailing, pas de partage</li>
            <li>Vous pouvez <strong>demander la suppression</strong> de votre fiche à tout moment</li>
            <li>Aucune donnée n&apos;est <strong>transférée hors UE</strong> sauf via Vercel (hébergement, USA) pour l&apos;exécution technique</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg text-navy">1. Données collectées</h2>
          <p className="mt-2">
            Avelor ne collecte que les données strictement nécessaires à la production de votre fiche personnalisée :
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><strong>SIRET</strong> de votre entreprise (saisie obligatoire)</li>
            <li><strong>Réponses au questionnaire</strong> (situation, problème, effectif, moral, statut conjoint, nationalité, etc.) — toutes optionnelles sauf 4 champs de base</li>
            <li><strong>Données entreprise INSEE</strong> récupérées via l&apos;API publique Sirene (nom, NAF, forme juridique, effectif déclaré, adresse postale)</li>
            <li><strong>Email</strong> uniquement si vous souhaitez recevoir le lien magique vers votre fiche</li>
            <li><strong>Token aléatoire</strong> de 24 caractères qui identifie votre fiche, sans information personnelle</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg text-navy">2. Données NON collectées</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Pas de nom, prénom, date de naissance, adresse personnelle</li>
            <li>Pas de numéro de téléphone</li>
            <li>Pas de RIB, IBAN, numéro de compte</li>
            <li>Pas de pièces d&apos;identité</li>
            <li>Pas de données fiscales personnelles</li>
            <li>Pas de traceurs publicitaires ni de profilage</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg text-navy">3. Base légale et finalités</h2>
          <p className="mt-2">
            Le traitement repose sur votre <strong>consentement explicite</strong> (art. 6.1.a RGPD) lors de la
            saisie du questionnaire, et sur <strong>l&apos;intérêt légitime</strong> de l&apos;éditeur pour fournir
            le service (art. 6.1.f RGPD).
          </p>
          <p className="mt-2">Les finalités sont strictement limitées à :</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Produire votre fiche personnalisée</li>
            <li>Vous renvoyer un lien magique pour retrouver votre fiche (si email fourni)</li>
            <li>Vous envoyer des rappels que vous avez explicitement demandés</li>
            <li>Mesurer l&apos;usage du site de manière agrégée (Plausible Analytics, sans cookie ni profilage)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg text-navy">4. Conservation des données</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><strong>Fiche personnalisée</strong> : conservée 24 mois après votre dernière connexion. Suppression automatique au-delà.</li>
            <li><strong>Email associé à un lien magique</strong> : 24 mois.</li>
            <li><strong>Logs serveur</strong> : 90 jours (à des fins de sécurité et de diagnostic).</li>
            <li><strong>Statistiques agrégées Plausible</strong> : indéfiniment, sans données identifiantes.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg text-navy">5. Vos droits (RGPD)</h2>
          <p className="mt-2">Vous disposez à tout moment des droits suivants :</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><strong>Droit d&apos;accès</strong> : obtenir copie des données vous concernant</li>
            <li><strong>Droit de rectification</strong> : corriger des données inexactes</li>
            <li><strong>Droit à l&apos;effacement</strong> (« droit à l&apos;oubli ») : demander la suppression de votre fiche</li>
            <li><strong>Droit à la limitation</strong> du traitement</li>
            <li><strong>Droit d&apos;opposition</strong> au traitement</li>
            <li><strong>Droit à la portabilité</strong> : récupérer vos données dans un format structuré</li>
          </ul>
          <p className="mt-3">
            Pour exercer ces droits, écrivez à{' '}
            <a href="mailto:contact@avelor.vercel.app" className="text-bleu-fonce underline">contact@avelor.vercel.app</a>
            {' '}en précisant votre token de fiche (visible dans l&apos;URL : <code>/fiche/XXXX</code>).
            Réponse sous 30 jours.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-navy">6. Sous-traitants et destinataires</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><strong>Vercel Inc.</strong> (USA) : hébergement de l&apos;application — transfert UE→USA encadré par les Clauses Contractuelles Types européennes (CCT)</li>
            <li><strong>Supabase Inc.</strong> (UE - eu-central-1) : base de données fiches</li>
            <li><strong>Resend</strong> (UE) : envoi du lien magique et des rappels par email</li>
            <li><strong>Plausible Analytics</strong> (UE) : statistiques d&apos;usage agrégées</li>
            <li><strong>INSEE / API Sirene</strong> : récupération des données publiques d&apos;entreprise (en lecture uniquement)</li>
            <li><strong>Google Places API</strong> : recherche d&apos;avocats à proximité (les recherches transitent par Google sans donnée personnelle directe)</li>
          </ul>
          <p className="mt-3">
            Aucune donnée n&apos;est revendue à des partenaires marketing ou publicitaires.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-navy">7. Sécurité</h2>
          <p className="mt-2">
            Les données sont protégées par les mesures techniques et organisationnelles suivantes :
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Chiffrement en transit (HTTPS / TLS 1.3)</li>
            <li>Chiffrement au repos (Supabase, Vercel)</li>
            <li>Accès à la base limité à l&apos;application via service role key</li>
            <li>Tokens aléatoires (24 caractères) non devinables</li>
            <li>Validation Zod sur toutes les entrées utilisateur</li>
            <li>Rate limiting sur les routes API</li>
            <li>Audit régulier des dépendances (npm audit)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg text-navy">8. Réclamation CNIL</h2>
          <p className="mt-2">
            En cas de difficulté à exercer vos droits, vous pouvez introduire une réclamation auprès de la
            <strong> CNIL</strong> (Commission Nationale de l&apos;Informatique et des Libertés) :
            3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07 — <a href="https://www.cnil.fr" target="_blank" rel="noreferrer" className="text-bleu-fonce underline">www.cnil.fr</a>
          </p>
        </section>

      </div>
    </section>
  );
}
