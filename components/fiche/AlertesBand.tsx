import type { AlerteSignal } from '@/lib/types';

interface Props {
  alertes: AlerteSignal[];
}

const STYLES: Record<AlerteSignal['niveau'], string> = {
  rouge: 'bg-rouge/10 border-rouge/30 text-rouge',
  jaune: 'bg-jaune/10 border-jaune/30 text-jaune',
  vert: 'bg-vert/10 border-vert/30 text-vert',
};

const DOTS: Record<AlerteSignal['niveau'], string> = {
  rouge: 'bg-rouge',
  jaune: 'bg-jaune',
  vert: 'bg-vert',
};

export default function AlertesBand({ alertes }: Props) {
  if (!alertes.length) return null;
  return (
    <section className="grid gap-3 sm:grid-cols-3">
      {alertes.map((a, i) => (
        <div
          key={i}
          className={`glass-soft border p-4 text-sm ${STYLES[a.niveau]}`}
        >
          <div className="flex items-center gap-2 font-semibold">
            <span className={`h-2 w-2 rounded-full ${DOTS[a.niveau]}`} />
            <span>{a.titre}</span>
          </div>
          <p className="mt-1.5 text-navy/80">{a.message}</p>
          <p className="mt-2 text-xs text-navy/45">Source · {a.source}</p>
        </div>
      ))}
    </section>
  );
}
