'use client';
import { useState, useMemo, type ReactNode } from 'react';
import type { Reponses, CompanyData } from '@/lib/types';
import type { SectorInfo, EffectifSeuils } from '@/lib/secteur';
import { scorePriorityCards, scrollToId, type PriorityCardMeta } from '@/lib/priorites';
import PriorityCard from './PriorityCard';

interface Props {
  reponses: Reponses;
  company: CompanyData;
  sector: SectorInfo;
  seuils: EffectifSeuils;
}

function buildExpandedContent(card: PriorityCardMeta, reponses: Reponses): ReactNode {
  switch (card.id) {
    case 'cessation': {
      const ville = (card.extra?.ville as string) ?? 'votre ville';
      return (
        <div className="space-y-3 text-sm text-navy/80">
          <p>
            L&apos;article <strong>L631-4 du Code de commerce</strong>{' '}
            impose au dirigeant de d&eacute;clarer la cessation dans les{' '}
            <strong>45 jours</strong> suivant son constat. Au-del&agrave; :
            action en comblement de passif (L651-2), faillite personnelle
            (L653-1), banqueroute p&eacute;nale (L654-1, jusqu&apos;à 5 ans de
            prison et 75 000 € d&apos;amende).
          </p>
          <ul className="space-y-1.5">
            <li className="flex gap-2"><span className="text-navy/40">→</span>Avocat / mandataire sous 48 h (premier RDV souvent gratuit)</li>
            <li className="flex gap-2"><span className="text-navy/40">→</span>Formulaire <strong>CERFA 10530</strong> sur service-public.fr</li>
            <li className="flex gap-2"><span className="text-navy/40">→</span>Pièces : K-bis &lt; 3 mois, état actif/passif exigible, comptes annuels, trésorerie &lt; 1 mois, liste créanciers</li>
            <li className="flex gap-2"><span className="text-navy/40">→</span>Dépôt au tribunal de commerce{ville !== 'votre ville' ? ` de ${ville}` : ''} (ou TAE si ressort réformé)</li>
          </ul>
          <button type="button" onClick={() => scrollToId('echeances')} className="inline-flex text-sm font-medium text-rouge hover:underline">
            Voir le décompte complet ↓
          </button>
        </div>
      );
    }
    case 'audience':
      return (
        <div className="space-y-3 text-sm text-navy/80">
          <p>
            Une assignation fixe une date et impose des délais stricts. Le
            tribunal peut rendre sa décision <strong>par défaut</strong>{' '}
            si vous ne comparaissez pas — presque toujours en votre
            défaveur. Se présenter (ou se faire représenter) est crucial.
          </p>
          <ul className="space-y-1.5">
            <li className="flex gap-2"><span className="text-navy/40">→</span>Avocat en droit des entreprises en difficulté sous 48 h</li>
            <li className="flex gap-2"><span className="text-navy/40">→</span>Aide juridictionnelle possible si RFR &lt; 19 411 €/an (outil dédié)</li>
            <li className="flex gap-2"><span className="text-navy/40">→</span>Pièces : bilan, trésorerie &lt; 1 mois, liste créanciers, propositions</li>
            <li className="flex gap-2"><span className="text-navy/40">→</span>Réfléchir à la voie : RJ, plan de cession (L642-1), ou LJ</li>
            <li className="flex gap-2"><span className="text-navy/40">→</span>Appel possible sous 10 j (C. com. R661-3)</li>
          </ul>
          <button type="button" onClick={() => scrollToId('echeances')} className="inline-flex text-sm font-medium text-rouge hover:underline">
            Voir la timeline juridique ↓
          </button>
        </div>
      );
    case 'strategie': {
      const verdict = card.extra?.verdict as string | undefined;
      const etapes = (card.extra?.etapes as string[] | undefined) ?? [];
      return (
        <div className="space-y-3 text-sm text-navy/80">
          {verdict && <p>{verdict}</p>}
          <div>
            <p className="font-display text-xs uppercase tracking-wide text-navy/55">Prochaines étapes</p>
            <ol className="mt-1 space-y-1.5">
              {etapes.slice(0, 3).map((e, i) => (
                <li key={i} className="flex gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bleu-fonce text-[10px] font-semibold text-white">
                    {i + 1}
                  </span>
                  <span>{e}</span>
                </li>
              ))}
            </ol>
          </div>
          <button type="button" onClick={() => scrollToId('vue-ensemble')} className="inline-flex text-sm font-medium text-bleu-fonce hover:underline">
            Voir la stratégie complète ↓
          </button>
        </div>
      );
    }
    case 'cautions':
      return (
        <div className="space-y-3 text-sm text-navy/80">
          <p>
            Les cautions personnelles sont <strong>la première source de
            ruine patrimoniale</strong> des dirigeants. Bonne nouvelle :
            une part importante est contestable (disproportion, défaut
            d&apos;information annuelle, vice de forme, durée excessive).
          </p>
          <ul className="space-y-1.5">
            <li className="flex gap-2"><span className="text-navy/40">→</span>Demander copie de chaque acte + fiche d&apos;information patrimoniale signée</li>
            <li className="flex gap-2"><span className="text-navy/40">→</span>Disproportion au jour de la signature : art. <strong>L341-4 C. conso</strong></li>
            <li className="flex gap-2"><span className="text-navy/40">→</span>Information annuelle manquante : déchéance des intérêts (art. L341-6)</li>
            <li className="flex gap-2"><span className="text-navy/40">→</span>Vérifier la durée : beaucoup limitées à 10 ans sans mention expresse</li>
            <li className="flex gap-2"><span className="text-navy/40">→</span>Avocat en droit bancaire — premier RDV souvent gratuit</li>
          </ul>
          <button type="button" onClick={() => scrollToId('patrimoine')} className="inline-flex text-sm font-medium text-jaune hover:underline">
            Lancer l&apos;audit caution ↓
          </button>
        </div>
      );
    case 'tresorerie':
      return (
        <div className="space-y-3 text-sm text-navy/80">
          <p>
            Votre capacité à tenir sur 6 mois détermine la stratégie
            possible. Un prévisionnel propre est aussi <strong>le
            document qui fait accepter</strong> les demandes de délais
            URSSAF / SIE / bailleur.
          </p>
          <ul className="space-y-1.5">
            <li className="flex gap-2"><span className="text-navy/40">→</span>Prévisionnel 6 mois avec votre expert-comptable (2-4 h)</li>
            <li className="flex gap-2"><span className="text-navy/40">→</span><strong>Médiation du crédit</strong> — Banque de France, gratuit, réponse sous 5 j (0810 00 12 10)</li>
            <li className="flex gap-2"><span className="text-navy/40">→</span>Moratoire URSSAF (3957) / SIE (téléprocédure) / bailleur (LRAR)</li>
            <li className="flex gap-2"><span className="text-navy/40">→</span>CCSF si dettes fiscales ET sociales (guichet unique, CERFA 15772*02)</li>
            <li className="flex gap-2"><span className="text-navy/40">→</span>Affacturage / escompte pour accélérer les encaissements</li>
          </ul>
          <button type="button" onClick={() => scrollToId('echeances')} className="inline-flex text-sm font-medium text-jaune hover:underline">
            Projeter ma trésorerie ↓
          </button>
        </div>
      );
    case 'patrimoine':
      return (
        <div className="space-y-3 text-sm text-navy/80">
          <p>
            Votre résidence et vos autres biens sont <strong>différemment
            protégés</strong> selon votre statut (EI vs société), votre
            régime matrimonial et vos cautions. Règle d&apos;or : n&apos;opérez
            <strong> aucun transfert d&apos;actif maintenant</strong> — les
            donations, ventes à proches, changements de régime peuvent
            être annulés (action paulienne, 18 mois avant cessation).
          </p>
          <ul className="space-y-1.5">
            <li className="flex gap-2"><span className="text-navy/40">→</span>EI : résidence principale insaisissable de droit (loi Macron 2015)</li>
            <li className="flex gap-2"><span className="text-navy/40">→</span>Société : déclaration d&apos;insaisissabilité chez notaire (300-500 €)</li>
            <li className="flex gap-2"><span className="text-navy/40">→</span>Assurance-vie avec bénéficiaire : hors succession, difficilement saisissable</li>
            <li className="flex gap-2"><span className="text-navy/40">→</span>Régime communauté : changement possible, mais opposable pour dettes FUTURES seulement</li>
            <li className="flex gap-2"><span className="text-navy/40">→</span>Véhicule en LOA/LLD : reste propriété du loueur, protégé</li>
          </ul>
          <button type="button" onClick={() => scrollToId('patrimoine')} className="inline-flex text-sm font-medium text-jaune hover:underline">
            Voir la cartographie ↓
          </button>
        </div>
      );
    case 'soutien': {
      const sectorSoutien = card.extra?.sectorSoutien as { nom: string; description: string; telephone?: string } | undefined;
      return (
        <div className="space-y-3 text-sm text-navy/80">
          <p>
            Vous n&apos;êtes pas seul·e. <strong>1 dirigeant sur 3</strong>{' '}
            traversant des difficultés présente des symptômes de burn-out
            (étude Amarok 2023). Parler 10 minutes change la trajectoire.
            Toutes ces lignes sont tenues au secret professionnel.
          </p>
          <ul className="space-y-1.5">
            {sectorSoutien && (
              <li className="flex gap-2">
                <span className="text-navy/40">→</span>
                <span>
                  <strong>{sectorSoutien.nom}</strong> — {sectorSoutien.description}
                  {sectorSoutien.telephone && ` · ${sectorSoutien.telephone}`}
                </span>
              </li>
            )}
            <li className="flex gap-2"><span className="text-navy/40">→</span><strong>APESA</strong> — soutien psychologique dirigeants, activable via tribunal de commerce · apesa.fr</li>
            <li className="flex gap-2"><span className="text-navy/40">→</span><strong>3114</strong> — prévention suicide, 24h/24, gratuit, anonyme</li>
            <li className="flex gap-2"><span className="text-navy/40">→</span><strong>60 000 Rebonds</strong> — accompagnement post-liquidation (mentor + groupe de pairs) · 60000rebonds.com</li>
            <li className="flex gap-2"><span className="text-navy/40">→</span><strong>CIP</strong> (~105 antennes) — RDV gratuit confidentiel 1 h avec juriste + comptable + dirigeant · cip-national.fr</li>
          </ul>
        </div>
      );
    }
    case 'aides': {
      const dep = card.extra?.dep as string | undefined;
      const probleme = card.extra?.probleme as string | undefined;
      return (
        <div className="space-y-3 text-sm text-navy/80">
          <p>
            Plusieurs dispositifs nationaux et locaux s&apos;offrent à vous
            selon votre problème. La CCSF (guichet unique fiscal+social) est
            souvent sous-utilisée.
          </p>
          <ul className="space-y-1.5">
            {(probleme === 'urssaf' || probleme === 'impots') && (
              <li className="flex gap-2"><span className="text-navy/40">→</span><strong>CCSF</strong> — échelonnement unique fiscal + social</li>
            )}
            <li className="flex gap-2"><span className="text-navy/40">→</span><strong>BPI Prêt rebond</strong> — 10 à 300 k€, sans garantie</li>
            <li className="flex gap-2"><span className="text-navy/40">→</span><strong>CIP</strong> — RDV gratuit confidentiel dans {dep ? `dép. ${dep}` : 'votre département'}</li>
          </ul>
          <button type="button" onClick={() => scrollToId('aides')} className="inline-flex text-sm font-medium text-bleu-fonce hover:underline">
            Voir toutes les aides ↓
          </button>
        </div>
      );
    }
    case 'bail':
      return (
        <div className="space-y-3 text-sm text-navy/80">
          <p>
            Le loyer pèse souvent 15 à 25 % des charges fixes. Le statut
            des baux commerciaux offre des leviers méconnus.
          </p>
          <ul className="space-y-1.5">
            <li className="flex gap-2"><span className="text-navy/40">→</span>Suspension clause résolutoire (jusqu&apos;à 24 mois)</li>
            <li className="flex gap-2"><span className="text-navy/40">→</span>Résiliation triennale (préavis 6 mois)</li>
            <li className="flex gap-2"><span className="text-navy/40">→</span>Révision triennale à la baisse</li>
          </ul>
          <button type="button" onClick={() => scrollToId('aides')} className="inline-flex text-sm font-medium text-bleu-fonce hover:underline">
            Voir les leviers bail ↓
          </button>
        </div>
      );
    case 'obligations': {
      const obligations50 = card.extra?.obligations50 as boolean | undefined;
      return (
        <div className="space-y-3 text-sm text-navy/80">
          <p>
            Votre effectif déclenche des obligations sociales collectives
            à respecter pendant la période difficile.
          </p>
          <ul className="space-y-1.5">
            <li className="flex gap-2"><span className="text-navy/40">→</span>CSE à informer-consulter (sous peine de délit d&apos;entrave)</li>
            {obligations50 && (
              <li className="flex gap-2"><span className="text-navy/40">→</span>PSE obligatoire si licenciement éco 10+ sur 30 j</li>
            )}
            <li className="flex gap-2"><span className="text-navy/40">→</span>AGS garantit les salaires en procédure collective</li>
          </ul>
          <button type="button" onClick={() => scrollToId('aides')} className="inline-flex text-sm font-medium text-navy hover:underline">
            Voir les obligations détaillées ↓
          </button>
        </div>
      );
    }
    default:
      return null;
  }
}

export default function PriorityCards(props: Props) {
  const cards = useMemo(() => scorePriorityCards(props), [props]);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <PriorityCard
          key={c.id}
          id={c.id}
          icone={c.icone}
          label={c.label}
          valeur={c.valeur}
          detail={c.detail}
          tone={c.tone}
          expandedContent={buildExpandedContent(c, props.reponses)}
          isOpen={expanded === c.id}
          onToggle={() => setExpanded(expanded === c.id ? null : c.id)}
        />
      ))}
    </section>
  );
}
