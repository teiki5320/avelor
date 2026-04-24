'use client';
import { useState, useMemo, type ReactNode } from 'react';
import type { Reponses, CompanyData } from '@/lib/types';
import type { SectorInfo, EffectifSeuils } from '@/lib/secteur';
import { resolveStrategie, AXE_META } from '@/lib/strategie';

interface Props {
  reponses: Reponses;
  company: CompanyData;
  sector: SectorInfo;
  seuils: EffectifSeuils;
}

type Tone = 'rouge' | 'jaune' | 'bleu' | 'vert' | 'navy';

interface PriorityCard {
  id: string;
  icone: string;
  label: string;
  valeur: string;
  detail: string;
  tone: Tone;
  scrollTo?: string;
  expandedContent: ReactNode;
  score: number;
}

const TONES: Record<Tone, { bg: string; border: string; accent: string; text: string; hover: string }> = {
  rouge: { bg: 'bg-rouge/5', border: 'border-rouge/30', accent: 'bg-rouge', text: 'text-rouge', hover: 'hover:bg-rouge/10' },
  jaune: { bg: 'bg-jaune/10', border: 'border-jaune/40', accent: 'bg-jaune', text: 'text-jaune', hover: 'hover:bg-jaune/15' },
  bleu: { bg: 'bg-bleu/5', border: 'border-bleu/30', accent: 'bg-bleu-fonce', text: 'text-bleu-fonce', hover: 'hover:bg-bleu/10' },
  vert: { bg: 'bg-vert/5', border: 'border-vert/30', accent: 'bg-vert', text: 'text-vert', hover: 'hover:bg-vert/10' },
  navy: { bg: 'bg-white/70', border: 'border-navy/15', accent: 'bg-navy', text: 'text-navy', hover: 'hover:bg-white' },
};

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 140;
  window.scrollTo({ top, behavior: 'smooth' });
}

function buildCards({ reponses, company, sector, seuils }: Props): PriorityCard[] {
  const cards: PriorityCard[] = [];
  const ville = company.ville || 'votre ville';
  const dep = company.departement;

  // 1. Délai 45 jours cessation — TOP PRIORITY si redressement/assignation
  if (reponses.situation === 'redressement' || reponses.situation === 'assignation') {
    const score = reponses.situation === 'assignation' ? 11 : 10;
    cards.push({
      id: 'cessation',
      icone: '⏰',
      label: 'Délai légal',
      valeur: '45 jours',
      detail: 'Pour déclarer la cessation des paiements',
      tone: 'rouge',
      scrollTo: 'echeances',
      score,
      expandedContent: (
        <div className="space-y-3 text-sm text-navy/80">
          <p>
            L&apos;article <strong>L631-4 du Code de commerce</strong>{' '}
            impose au dirigeant de déclarer la cessation dans les{' '}
            <strong>45 jours</strong> suivant son constat. Au-delà :
            action en comblement de passif (L651-2), faillite personnelle
            (L653-1), banqueroute pénale (L654-1, jusqu&apos;à 5 ans de
            prison et 75 000 € d&apos;amende).
          </p>
          <ul className="space-y-1.5">
            <li className="flex gap-2"><span className="text-navy/40">→</span>Avocat / mandataire sous 48 h (premier RDV souvent gratuit)</li>
            <li className="flex gap-2"><span className="text-navy/40">→</span>Formulaire <strong>CERFA 10530</strong> sur service-public.fr</li>
            <li className="flex gap-2"><span className="text-navy/40">→</span>Pièces : K-bis &lt; 3 mois, état actif/passif exigible, comptes annuels, trésorerie &lt; 1 mois, liste créanciers</li>
            <li className="flex gap-2"><span className="text-navy/40">→</span>Dépôt au tribunal de commerce{ville !== 'votre ville' ? ` de ${ville}` : ''} (ou TAE si ressort réformé)</li>
          </ul>
          <button
            type="button"
            onClick={() => scrollToId('echeances')}
            className="inline-flex text-sm font-medium text-rouge hover:underline"
          >
            Voir le décompte complet ↓
          </button>
        </div>
      ),
    });
  }

  // 2. Audience à préparer (si assignation)
  if (reponses.situation === 'assignation') {
    cards.push({
      id: 'audience',
      icone: '⚖️',
      label: 'Audience',
      valeur: 'À préparer',
      detail: `Tribunal de commerce · ${ville}`,
      tone: 'rouge',
      scrollTo: 'echeances',
      score: 10,
      expandedContent: (
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
          <button
            type="button"
            onClick={() => scrollToId('echeances')}
            className="inline-flex text-sm font-medium text-rouge hover:underline"
          >
            Voir la timeline juridique ↓
          </button>
        </div>
      ),
    });
  }

  // 3. Stratégie recommandée
  const strat = resolveStrategie(reponses, company);
  if (strat) {
    const meta = AXE_META[strat.main.axe];
    cards.push({
      id: 'strategie',
      icone: meta.icone,
      label: 'Votre cap',
      valeur: meta.label,
      detail: strat.main.titre,
      tone: 'bleu',
      scrollTo: 'vue-ensemble',
      score: 8,
      expandedContent: (
        <div className="space-y-3 text-sm text-navy/80">
          <p>{strat.main.verdict}</p>
          <div>
            <p className="font-display text-xs uppercase tracking-wide text-navy/55">Prochaines étapes</p>
            <ol className="mt-1 space-y-1.5">
              {strat.main.etapes.slice(0, 3).map((e, i) => (
                <li key={i} className="flex gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bleu-fonce text-[10px] font-semibold text-white">
                    {i + 1}
                  </span>
                  <span>{e}</span>
                </li>
              ))}
            </ol>
          </div>
          <button
            type="button"
            onClick={() => scrollToId('vue-ensemble')}
            className="inline-flex text-sm font-medium text-bleu-fonce hover:underline"
          >
            Voir la stratégie complète ↓
          </button>
        </div>
      ),
    });
  }

  // 4. Cautions personnelles à auditer
  if (reponses.caution === 'oui') {
    cards.push({
      id: 'cautions',
      icone: '🛡️',
      label: 'Cautions',
      valeur: 'À auditer',
      detail: 'Risque patrimonial personnel',
      tone: 'jaune',
      scrollTo: 'patrimoine',
      score: 9,
      expandedContent: (
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
          <button
            type="button"
            onClick={() => scrollToId('patrimoine')}
            className="inline-flex text-sm font-medium text-jaune hover:underline"
          >
            Lancer l&apos;audit caution ↓
          </button>
        </div>
      ),
    });
  }

  // 5. Trésorerie — pertinent si tresorie, banque, ou redressement
  if (reponses.situation === 'tresorie' || reponses.situation === 'redressement' || reponses.probleme === 'banque') {
    cards.push({
      id: 'tresorerie',
      icone: '📊',
      label: 'Trésorerie',
      valeur: 'À projeter',
      detail: 'Horizon 6 mois',
      tone: 'jaune',
      scrollTo: 'echeances',
      score: 7,
      expandedContent: (
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
          <button
            type="button"
            onClick={() => scrollToId('echeances')}
            className="inline-flex text-sm font-medium text-jaune hover:underline"
          >
            Projeter ma trésorerie ↓
          </button>
        </div>
      ),
    });
  }

  // 6. Patrimoine — si propriétaire + régime à risque
  if (reponses.patrimoine === 'proprietaire') {
    const score = reponses.caution === 'oui' ? 7 : 5;
    cards.push({
      id: 'patrimoine',
      icone: '🏠',
      label: 'Patrimoine',
      valeur: 'Propriétaire',
      detail: reponses.regime === 'separation' ? 'Conjoint protégé' : reponses.regime === 'communaute' ? 'Conjoint exposé' : 'À analyser',
      tone: 'jaune',
      scrollTo: 'patrimoine',
      score,
      expandedContent: (
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
          <button
            type="button"
            onClick={() => scrollToId('patrimoine')}
            className="inline-flex text-sm font-medium text-jaune hover:underline"
          >
            Voir la cartographie ↓
          </button>
        </div>
      ),
    });
  }

  // 7. Soutien humain (toujours pertinent, score plus haut si moral fragile)
  const moralFragile = reponses.moral === 'epuise' || reponses.moral === 'perdu';
  cards.push({
    id: 'soutien',
    icone: '🤝',
    label: 'Soutien',
    valeur: 'Gratuit · 24h/24',
    detail: sector.soutien ? sector.soutien.nom : 'APESA · 3114',
    tone: 'vert',
    scrollTo: 'vue-ensemble',
    score: moralFragile ? 9 : 4,
    expandedContent: (
      <div className="space-y-3 text-sm text-navy/80">
        <p>
          Vous n&apos;êtes pas seul·e. <strong>1 dirigeant sur 3</strong>{' '}
          traversant des difficultés présente des symptômes de burn-out
          (étude Amarok 2023). Parler 10 minutes change la trajectoire.
          Toutes ces lignes sont tenues au secret professionnel.
        </p>
        <ul className="space-y-1.5">
          {sector.soutien && (
            <li className="flex gap-2">
              <span className="text-navy/40">→</span>
              <span>
                <strong>{sector.soutien.nom}</strong> — {sector.soutien.description}
                {sector.soutien.telephone && ` · ${sector.soutien.telephone}`}
              </span>
            </li>
          )}
          <li className="flex gap-2"><span className="text-navy/40">→</span><strong>APESA</strong> — soutien psychologique dirigeants, activable via tribunal de commerce · apesa.fr</li>
          <li className="flex gap-2"><span className="text-navy/40">→</span><strong>3114</strong> — prévention suicide, 24h/24, gratuit, anonyme</li>
          <li className="flex gap-2"><span className="text-navy/40">→</span><strong>60 000 Rebonds</strong> — accompagnement post-liquidation (mentor + groupe de pairs) · 60000rebonds.com</li>
          <li className="flex gap-2"><span className="text-navy/40">→</span><strong>CIP</strong> (~105 antennes) — RDV gratuit confidentiel 1 h avec juriste + comptable + dirigeant · cip-national.fr</li>
        </ul>
      </div>
    ),
  });

  // 8. Aides disponibles (score plus haut selon problème)
  const scoreAides = reponses.probleme === 'urssaf' || reponses.probleme === 'impots' ? 6 : 4;
  cards.push({
    id: 'aides',
    icone: '💶',
    label: 'Aides',
    valeur: 'Disponibles',
    detail: reponses.probleme === 'urssaf' ? 'URSSAF + CCSF + BPI' : reponses.probleme === 'impots' ? 'SIE + CCSF + CODEFI' : reponses.probleme === 'banque' ? 'Médiation crédit' : 'Plusieurs leviers',
    tone: 'bleu',
    scrollTo: 'aides',
    score: scoreAides,
    expandedContent: (
      <div className="space-y-3 text-sm text-navy/80">
        <p>
          Plusieurs dispositifs nationaux et locaux s&apos;offrent à vous
          selon votre problème. La CCSF (guichet unique fiscal+social) est
          souvent sous-utilisée.
        </p>
        <ul className="space-y-1.5">
          {(reponses.probleme === 'urssaf' || reponses.probleme === 'impots') && (
            <li className="flex gap-2"><span className="text-navy/40">→</span><strong>CCSF</strong> — échelonnement unique fiscal + social</li>
          )}
          <li className="flex gap-2"><span className="text-navy/40">→</span><strong>BPI Prêt rebond</strong> — 10 à 300 k€, sans garantie</li>
          <li className="flex gap-2"><span className="text-navy/40">→</span><strong>CIP</strong> — RDV gratuit confidentiel dans {dep ? `dép. ${dep}` : 'votre département'}</li>
        </ul>
        <button
          type="button"
          onClick={() => scrollToId('aides')}
          className="inline-flex text-sm font-medium text-bleu-fonce hover:underline"
        >
          Voir toutes les aides ↓
        </button>
      </div>
    ),
  });

  // 9. Bail commercial (si secteur avec local)
  const secteursBail = ['hotellerie', 'commerce', 'artisanat', 'liberal', 'sante'];
  if (secteursBail.includes(sector.secteur)) {
    cards.push({
      id: 'bail',
      icone: '🔑',
      label: 'Bail commercial',
      valeur: 'Leviers dispo',
      detail: '7 dispositifs légaux',
      tone: 'bleu',
      scrollTo: 'aides',
      score: 5,
      expandedContent: (
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
          <button
            type="button"
            onClick={() => scrollToId('aides')}
            className="inline-flex text-sm font-medium text-bleu-fonce hover:underline"
          >
            Voir les leviers bail ↓
          </button>
        </div>
      ),
    });
  }

  // 10. Obligations effectif (si salariés)
  if (reponses.effectif === 'salaries' && seuils.approx >= 11) {
    cards.push({
      id: 'obligations',
      icone: '📐',
      label: 'Obligations',
      valeur: `${seuils.approx}+ salariés`,
      detail: seuils.obligations50 ? 'CSE + PSE + participation' : 'CSE requis',
      tone: 'navy',
      scrollTo: 'aides',
      score: 4,
      expandedContent: (
        <div className="space-y-3 text-sm text-navy/80">
          <p>
            Votre effectif déclenche des obligations sociales collectives
            à respecter pendant la période difficile.
          </p>
          <ul className="space-y-1.5">
            <li className="flex gap-2"><span className="text-navy/40">→</span>CSE à informer-consulter (sous peine de délit d&apos;entrave)</li>
            {seuils.obligations50 && (
              <li className="flex gap-2"><span className="text-navy/40">→</span>PSE obligatoire si licenciement éco 10+ sur 30 j</li>
            )}
            <li className="flex gap-2"><span className="text-navy/40">→</span>AGS garantit les salaires en procédure collective</li>
          </ul>
          <button
            type="button"
            onClick={() => scrollToId('aides')}
            className="inline-flex text-sm font-medium text-navy hover:underline"
          >
            Voir les obligations détaillées ↓
          </button>
        </div>
      ),
    });
  }

  return cards.sort((a, b) => b.score - a.score).slice(0, 4);
}

export default function PriorityCards(props: Props) {
  const cards = useMemo(() => buildCards(props), [props]);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => {
        const t = TONES[c.tone];
        const isOpen = expanded === c.id;
        return (
          <div
            key={c.id}
            className={`relative overflow-hidden rounded-2xl border transition-all duration-200 ${t.bg} ${t.border} ${
              isOpen ? 'ring-2 ring-navy/15 sm:col-span-2 lg:col-span-4' : ''
            }`}
          >
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${t.accent}`} aria-hidden />

            {/* Zone d'en-tête cliquable */}
            <button
              type="button"
              onClick={() => setExpanded(isOpen ? null : c.id)}
              className={`w-full p-4 text-left transition ${t.hover}`}
              aria-expanded={isOpen}
              aria-controls={`panel-${c.id}`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-2xl leading-none" aria-hidden>{c.icone}</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-navy/50">
                  {c.label}
                </span>
              </div>
              <p className={`mt-3 font-display text-xl leading-tight ${t.text} sm:text-2xl`}>
                {c.valeur}
              </p>
              <p className="mt-1 text-xs text-navy/65">{c.detail}</p>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-navy/50">
                <span>{isOpen ? 'Replier' : 'Voir plus'}</span>
                <span aria-hidden className={`transition ${isOpen ? 'rotate-180' : ''}`}>↓</span>
              </div>
            </button>

            {/* Contenu détaillé — s'intègre dans la carte qui s'agrandit */}
            {isOpen && (
              <div
                id={`panel-${c.id}`}
                role="region"
                className="border-t border-navy/10 bg-white/40 px-5 pb-5 pt-4"
              >
                {c.expandedContent}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
