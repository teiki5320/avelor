import type { Reponses, CompanyData } from '@/lib/types';
import type { SectorInfo } from '@/lib/secteur';
import { getChambreLabel } from '@/lib/secteur';
import BlocAccordeon from './BlocAccordeon';

interface Props {
  reponses: Reponses;
  company: CompanyData;
  sector: SectorInfo;
}

interface Jalon {
  delai: string;
  date: string;
  texte: string;
  urgence?: 'rouge' | 'jaune' | 'vert';
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
}

function addDays(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

function buildJalons(r: Reponses, c: CompanyData, s: SectorInfo): Jalon[] {
  const jalons: Jalon[] = [];
  const now = new Date();
  const ville = c.ville || 'votre ville';
  const dep = c.departement || '';

  if (r.moral === 'epuise' || r.moral === 'perdu') {
    jalons.push({
      delai: 'Dès aujourd\'hui',
      date: formatDate(now),
      texte: 'Appeler APESA — gratuit et confidentiel (apesa.fr)',
      urgence: 'vert',
    });
  }
  if (r.situation === 'assignation') {
    jalons.push({
      delai: 'Urgent',
      date: formatDate(now),
      texte: 'Consulter un avocat immédiatement — les délais sont courts',
      urgence: 'rouge',
    });
  }
  if (r.probleme === 'urssaf') {
    jalons.push({
      delai: 'Avant le ' + formatDate(addDays(7)),
      date: formatDate(addDays(7)),
      texte: `Contacter ${s.cotisationOrg}${dep ? ` (${dep})` : ''} pour demander un échelonnement · ${s.cotisationTel}`,
      urgence: 'jaune',
    });
  }
  if (r.probleme === 'impots') {
    jalons.push({
      delai: 'Avant le ' + formatDate(addDays(7)),
      date: formatDate(addDays(7)),
      texte: `Contacter le SIE${ville !== 'votre ville' ? ` de ${ville}` : ''} pour demander un délai`,
      urgence: 'jaune',
    });
  }

  jalons.push({
    delai: 'Aujourd\'hui',
    date: formatDate(now),
    texte: `Contacter la ${s.chambre}${dep ? ` (${dep})` : ''} — accompagnement gratuit et confidentiel`,
  });
  jalons.push({
    delai: 'Avant le ' + formatDate(addDays(15)),
    date: formatDate(addDays(15)),
    texte: 'Faire le point avec votre expert-comptable',
  });
  jalons.push({
    delai: 'Avant le ' + formatDate(addDays(30)),
    date: formatDate(addDays(30)),
    texte: `Consulter un avocat${ville !== 'votre ville' ? ` à ${ville}` : ''} si la situation n'a pas évolué`,
  });
  jalons.push({
    delai: formatDate(addDays(45)),
    date: formatDate(addDays(45)),
    texte: 'Délai légal maximum pour déclarer la cessation des paiements — à ne pas dépasser',
    urgence: 'rouge',
  });

  return jalons;
}

const PUCE: Record<NonNullable<Jalon['urgence']>, string> = {
  rouge: 'border-rouge/40 bg-rouge/5 text-rouge',
  jaune: 'border-jaune/40 bg-jaune/5 text-jaune',
  vert: 'border-vert/40 bg-vert/5 text-vert',
};

export default function BlocCalendrier({ reponses, company, sector }: Props) {
  const jalons = buildJalons(reponses, company, sector);
  return (
    <BlocAccordeon
      icone="📅"
      titre={`Calendrier d'urgence${company.nom !== 'Votre entreprise' ? ` · ${company.nom}` : ''}`}
      soustitre="Dates réelles calculées à partir d'aujourd'hui"
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
