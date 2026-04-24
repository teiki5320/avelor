import type { SectorInfo } from '@/lib/secteur';

interface Props {
  sector: SectorInfo;
}

const STYLES: Record<'crise' | 'tendu', { border: string; bg: string; icon: string }> = {
  crise: {
    border: 'border-rouge/30',
    bg: 'bg-rouge/5',
    icon: '🔴',
  },
  tendu: {
    border: 'border-jaune/40',
    bg: 'bg-jaune/10',
    icon: '🟠',
  },
};

export default function BlocSanteSecteur({ sector }: Props) {
  const sante = sector.santeSecteur;
  if (!sante || sante.niveau === 'normal') return null;

  const style = STYLES[sante.niveau];

  return (
    <div
      role="note"
      className={`rounded-2xl border p-5 text-sm text-navy ${style.border} ${style.bg}`}
    >
      <p className="font-display text-base text-navy sm:text-lg">
        {style.icon} {sante.titre}
      </p>
      <p className="mt-2 text-navy/80">{sante.message}</p>
      {sante.ressource && (
        <a
          href={sante.ressource.url}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex text-sm font-medium text-bleu-fonce underline underline-offset-4"
        >
          {sante.ressource.label} →
        </a>
      )}
      <p className="mt-3 text-xs text-navy/50">
        Cette indication n'est pas un jugement sur votre entreprise, mais un
        rappel que beaucoup de confrères du secteur traversent une période
        similaire — et que des dispositifs ciblés existent.
      </p>
    </div>
  );
}
