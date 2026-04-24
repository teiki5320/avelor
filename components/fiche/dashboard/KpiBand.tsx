import type { Reponses, CompanyData } from '@/lib/types';
import type { SectorInfo, EffectifSeuils } from '@/lib/secteur';

interface Props {
  reponses: Reponses;
  company: CompanyData;
  sector: SectorInfo;
  seuils: EffectifSeuils;
}

interface Kpi {
  icone: string;
  label: string;
  valeur: string;
  detail: string;
  tone: 'rouge' | 'jaune' | 'bleu' | 'vert' | 'navy';
}

const TONES: Record<Kpi['tone'], { bg: string; border: string; accent: string; text: string }> = {
  rouge: { bg: 'bg-rouge/10', border: 'border-rouge/30', accent: 'bg-rouge', text: 'text-rouge' },
  jaune: { bg: 'bg-jaune/15', border: 'border-jaune/40', accent: 'bg-jaune', text: 'text-jaune' },
  bleu: { bg: 'bg-bleu/10', border: 'border-bleu/30', accent: 'bg-bleu-fonce', text: 'text-bleu-fonce' },
  vert: { bg: 'bg-vert/10', border: 'border-vert/30', accent: 'bg-vert', text: 'text-vert' },
  navy: { bg: 'bg-navy/5', border: 'border-navy/20', accent: 'bg-navy', text: 'text-navy' },
};

function buildKpis({ reponses, company, sector, seuils }: Props): Kpi[] {
  const kpis: Kpi[] = [];

  // 1. Niveau de priorité
  if (reponses.situation === 'assignation') {
    kpis.push({
      icone: '🚨',
      label: 'Priorité',
      valeur: 'Urgence critique',
      detail: 'Audience fixée · consulter un avocat sous 48 h',
      tone: 'rouge',
    });
  } else if (reponses.situation === 'redressement') {
    kpis.push({
      icone: '⏰',
      label: 'Priorité',
      valeur: '45 jours',
      detail: 'Délai légal pour déclarer la cessation',
      tone: 'jaune',
    });
  } else if (reponses.situation === 'tresorie') {
    kpis.push({
      icone: '📉',
      label: 'Priorité',
      valeur: 'Tension identifiée',
      detail: 'Agir tôt évite la cessation',
      tone: 'jaune',
    });
  } else {
    kpis.push({
      icone: '🛡️',
      label: 'Priorité',
      valeur: 'Prévention',
      detail: 'Le bon moment pour anticiper',
      tone: 'vert',
    });
  }

  // 2. Cap stratégique (label simple)
  const cap = (() => {
    if (reponses.vente === 'oui') return { v: 'Céder', d: 'Vente envisagée' };
    if (reponses.situation === 'redressement') return { v: 'Liquider', d: 'Sortie propre à préparer' };
    if (reponses.situation === 'assignation') return { v: 'Défendre', d: 'Audience à venir' };
    if (reponses.situation === 'tresorie') return { v: 'Sauvegarder', d: 'Protection judiciaire' };
    return { v: 'Restructurer', d: 'Négociation amiable' };
  })();
  kpis.push({
    icone: '🎯',
    label: 'Cap',
    valeur: cap.v,
    detail: cap.d,
    tone: 'bleu',
  });

  // 3. Effectif
  if (reponses.effectif === 'independant') {
    kpis.push({
      icone: '👤',
      label: 'Équipe',
      valeur: 'Seul·e',
      detail: 'Statut indépendant',
      tone: 'navy',
    });
  } else {
    kpis.push({
      icone: '👥',
      label: 'Équipe',
      valeur: `~ ${seuils.approx} sal.`,
      detail: seuils.obligations50
        ? 'Obligations 50+ (PSE, CSE+)'
        : seuils.cse
        ? 'Seuil CSE atteint'
        : 'Règles simples',
      tone: 'navy',
    });
  }

  // 4. État du secteur
  const sante = sector.santeSecteur;
  if (sante?.niveau === 'crise') {
    kpis.push({
      icone: '🔴',
      label: 'Secteur',
      valeur: 'En crise',
      detail: sector.label,
      tone: 'rouge',
    });
  } else if (sante?.niveau === 'tendu') {
    kpis.push({
      icone: '🟠',
      label: 'Secteur',
      valeur: 'Tendu',
      detail: sector.label,
      tone: 'jaune',
    });
  } else {
    kpis.push({
      icone: '🟢',
      label: 'Secteur',
      valeur: 'Stable',
      detail: sector.label,
      tone: 'vert',
    });
  }

  return kpis;
}

export default function KpiBand(props: Props) {
  const kpis = buildKpis(props);
  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((k, i) => {
        const t = TONES[k.tone];
        return (
          <div
            key={i}
            className={`relative overflow-hidden rounded-2xl border p-5 ${t.bg} ${t.border}`}
          >
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${t.accent}`} aria-hidden />
            <div className="flex items-start justify-between gap-2">
              <span className="text-2xl leading-none" aria-hidden>
                {k.icone}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-navy/50">
                {k.label}
              </span>
            </div>
            <p className={`mt-3 font-display text-2xl leading-tight ${t.text} sm:text-3xl`}>
              {k.valeur}
            </p>
            <p className="mt-1 text-xs text-navy/65">{k.detail}</p>
          </div>
        );
      })}
    </section>
  );
}
