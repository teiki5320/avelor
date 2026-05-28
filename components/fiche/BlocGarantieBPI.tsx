'use client';
import { useFiche } from '@/lib/FicheContext';
import BlocAccordeon from './BlocAccordeon';

/**
 * Bloc dédié aux emprunts garantis par Bpifrance (ex-OSEO Garantie).
 * À ne pas confondre avec le PGE (couvert par BlocPGE).
 *
 * Concerne tout prêt bancaire dont une part (souvent 40 à 70 %) est
 * garantie par Bpifrance — courant en TPE/PME, notamment pour
 * création, croissance, transmission, innovation.
 *
 * S'affiche dès qu'il y a une tension bancaire (probleme === 'banque'
 * ou situation === 'tresorie').
 */
export default function BlocGarantieBPI() {
  const { reponses } = useFiche();
  const pertinent =
    reponses.probleme === 'banque' || reponses.situation === 'tresorie';
  if (!pertinent) return null;

  return (
    <BlocAccordeon
      icone="🤝"
      titre="Emprunt garanti Bpifrance — comprendre vos marges de négociation"
      soustitre="Tout prêt avec garantie BPI (hors PGE) : règles, leviers, médiation"
    >
      <p className="text-sm text-navy/80">
        Si votre banque a obtenu une <strong>garantie Bpifrance</strong>{' '}
        (ex-OSEO) sur tout ou partie de votre prêt, elle est partiellement
        protégée contre votre défaillance. Cela <strong>change la
        dynamique de négociation</strong> : la banque a moins à perdre,
        mais la garantie elle-même obéit à des règles strictes qui
        peuvent jouer en votre faveur.
      </p>

      {/* Comment ça marche */}
      <div className="mt-5 rounded-2xl border border-bleu/30 bg-bleu/5 p-4">
        <p className="font-display text-base text-bleu-fonce">
          Comment fonctionne la garantie BPI
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-navy/80">
          <li>
            La garantie est <strong>plafonnée</strong> (souvent 40 à
            70 % du capital restant dû selon le dispositif).
          </li>
          <li>
            Elle est <strong>activée à des conditions strictes</strong> :
            mise en demeure formelle, défaut prolongé (généralement 90 j),
            mise en œuvre des poursuites contre les co-emprunteurs et
            cautions.
          </li>
          <li>
            La banque <strong>doit prouver</strong> qu&apos;elle a fait
            toutes les diligences. Une garantie trop facilement activée
            peut être refusée par Bpifrance.
          </li>
          <li>
            Bpifrance se subroge ensuite dans les droits de la banque
            pour récupérer les sommes versées auprès de vous (sauf si
            procédure collective qui efface ce recours).
          </li>
        </ul>
      </div>

      {/* Marges de négociation */}
      <div className="mt-4 rounded-2xl border border-vert/30 bg-vert/5 p-4">
        <p className="font-display text-base text-vert">Vos marges de négociation</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-navy/80">
          <li>
            <strong>La banque préfère négocier qu&apos;activer la garantie</strong> :
            l&apos;activation est longue, lourde administrativement,
            partielle. Beaucoup préfèrent un réaménagement amiable.
          </li>
          <li>
            <strong>Demandez explicitement un moratoire</strong> de 6 à
            12 mois sans pénalité — la convention de garantie BPI
            l&apos;autorise sans perte de couverture (à vérifier sur
            votre dispositif spécifique).
          </li>
          <li>
            <strong>Une procédure collective fait perdre la garantie</strong>{' '}
            de la même manière que le PGE — donc à éviter quand c&apos;est
            possible, ou à anticiper avec un mandat ad hoc / conciliation
            (confidentiels).
          </li>
          <li>
            <strong>Caution personnelle BPI</strong> : si vous avez signé
            une caution personnelle pour la part NON garantie, vérifiez
            sa proportionnalité (art. L341-4 C. conso) et l&apos;information
            annuelle (art. L341-6). Beaucoup sont contestables.
          </li>
        </ul>
      </div>

      {/* Cas particuliers */}
      <div className="mt-4 rounded-2xl border border-jaune/30 bg-jaune/5 p-4">
        <p className="font-display text-base text-jaune">
          Dispositifs BPI courants en TPE/PME
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-navy/80">
          <li>
            <strong>Garantie Création</strong> (jusqu&apos;à 70 %) : prêt
            création/reprise.
          </li>
          <li>
            <strong>Garantie Développement</strong> (40 à 60 %) :
            croissance, investissement.
          </li>
          <li>
            <strong>Garantie Transmission</strong> (jusqu&apos;à 50 %) :
            rachat de fonds ou de parts.
          </li>
          <li>
            <strong>Garantie Innovation</strong> (60 à 80 %) : projets
            R&amp;D, innovation.
          </li>
          <li>
            <strong>Prêt Croissance</strong> ou <strong>Prêt Rebond</strong>{' '}
            : prêts directs BPI (10 à 300 k€ sans garantie) — différents
            de la garantie sur prêt bancaire.
          </li>
        </ul>
      </div>

      {/* Procédure */}
      <div className="mt-4 rounded-2xl border border-navy/15 bg-white/60 p-4">
        <p className="font-display text-base text-navy">Procédure recommandée</p>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-navy/80">
          <li>
            <strong>Identifier la garantie</strong> dans votre contrat
            de prêt (mention obligatoire — souvent dans les conditions
            particulières).
          </li>
          <li>
            <strong>Contacter votre conseiller bancaire</strong> en LRAR
            pour demander un réaménagement (moratoire, allongement,
            différé). Sous 15 jours, la banque doit répondre par écrit.
          </li>
          <li>
            <strong>En parallèle, appeler Bpifrance Direction Régionale</strong>{' '}
            (3247) — leur conseiller risque pourra confirmer si la banque
            est tenue d&apos;accepter le réaménagement.
          </li>
          <li>
            <strong>Si refus</strong> : saisir la Médiation du crédit
            (3414, gratuit, confidentiel, sous 5 jours). Le médiateur
            obtient un accord dans plus de 60 % des cas.
          </li>
          <li>
            <strong>Mandat ad hoc</strong> si la situation est plus
            grave : permet de tout renégocier dans un cadre confidentiel
            (homologué tribunal commerce) sans déclencher la procédure
            collective.
          </li>
        </ol>
      </div>

      {/* Contacts */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-navy/15 bg-white/60 p-4">
          <p className="font-display text-base text-navy">Bpifrance Direction Régionale</p>
          <p className="mt-1 text-xs text-navy/60">Conseil sur le statut de votre garantie</p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <a href="tel:3247" className="rounded-full bg-white/80 px-3 py-1.5 text-navy/80 hover:bg-white">☎ 32 47</a>
            <a
              href="https://www.bpifrance.fr/contactez-nous"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white/80 px-3 py-1.5 text-bleu-fonce hover:bg-white"
            >
              🌐 bpifrance.fr/contactez-nous
            </a>
          </div>
        </div>
        <div className="rounded-2xl border border-navy/15 bg-white/60 p-4">
          <p className="font-display text-base text-navy">Médiation du crédit BdF</p>
          <p className="mt-1 text-xs text-navy/60">Gratuit, confidentiel, taux succès &gt; 60 %</p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <a href="tel:3414" className="rounded-full bg-white/80 px-3 py-1.5 text-navy/80 hover:bg-white">☎ 34 14</a>
            <a
              href="https://mediateur-credit.banque-france.fr"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white/80 px-3 py-1.5 text-bleu-fonce hover:bg-white"
            >
              🌐 mediateur-credit.banque-france.fr
            </a>
          </div>
        </div>
      </div>

      <p className="mt-5 text-xs text-navy/50">
        Sources : Bpifrance — conditions générales des garanties ;
        Médiation du crédit aux entreprises ; C. mon. fin. art. L313-1
        et s. ; jurisprudence Cass. com. sur la subrogation du garant.
      </p>
    </BlocAccordeon>
  );
}
