import type { Reponses } from '@/lib/types';
import BlocAccordeon from './BlocAccordeon';

interface Props {
  reponses: Reponses;
}

interface Jalon {
  delai: string;
  texte: string;
  urgence?: 'rouge' | 'jaune' | 'vert';
}

function buildJalons(r: Reponses): Jalon[] {
  const jalons: Jalon[] = [];

  if (r.moral === 'epuise' || r.moral === 'perdu') {
    jalons.push({
      delai: 'Dès aujourd\'hui',
      texte: 'Appeler APESA — gratuit et confidentiel (apesa.fr)',
      urgence: 'vert',
    });
  }
  if (r.situation === 'assignation') {
    jalons.push({
      delai: 'Urgent',
      texte: 'Consulter un avocat immédiatement — les délais sont courts',
      urgence: 'rouge',
    });
  }
  if (r.probleme === 'urssaf') {
    jalons.push({
      delai: 'Dans 7 jours',
      texte: 'Contacter l\'URSSAF pour demander un échelonnement',
      urgence: 'jaune',
    });
  }

  jalons.push({
    delai: 'Aujourd\'hui',
    texte: 'Contacter la CCI — accompagnement gratuit et confidentiel',
  });
  jalons.push({
    delai: 'Dans 15 jours',
    texte: 'Faire le point avec votre expert-comptable',
  });
  jalons.push({
    delai: 'Dans 30 jours',
    texte: 'Consulter un avocat si la situation n\'a pas évolué',
  });
  jalons.push({
    delai: 'Dans 45 jours',
    texte:
      'Délai légal maximum pour déclarer la cessation des paiements — à ne pas dépasser',
    urgence: 'rouge',
  });

  return jalons;
}

const PUCE: Record<NonNullable<Jalon['urgence']>, string> = {
  rouge: 'border-rouge/40 bg-rouge/5 text-rouge',
  jaune: 'border-jaune/40 bg-jaune/5 text-jaune',
  vert: 'border-vert/40 bg-vert/5 text-vert',
};

export default function BlocCalendrier({ reponses }: Props) {
  const jalons = buildJalons(reponses);
  return (
    <BlocAccordeon
      icone="📅"
      titre="Calendrier d'urgence"
      soustitre="Un cap, étape par étape — sans pression"
    >
      <ol className="space-y-3">
        {jalons.map((j, i) => (
          <li
            key={i}
            className={`flex items-start gap-4 rounded-2xl border bg-white/60 p-4 ${
              j.urgence ? PUCE[j.urgence] : 'border-navy/10 text-navy'
            }`}
          >
            <span className="shrink-0 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold tracking-wide">
              {j.delai}
            </span>
            <p className="text-sm text-navy/80 sm:text-base">{j.texte}</p>
          </li>
        ))}
      </ol>
      <p className="mt-5 text-xs text-navy/50">
        La loi (C. com. art. L631-4) impose de déclarer la cessation des
        paiements dans les 45 jours qui suivent — ce délai est le seul qui soit
        strictement légal.
      </p>
    </BlocAccordeon>
  );
}
