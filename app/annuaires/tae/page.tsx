import Link from 'next/link';

interface TAE {
  ville: string;
  ressort: string;
  competence: string;
}

// Source : décret n° 2024-1225 du 30 décembre 2024 — liste des 12 TAE expérimentaux
// Démarrage : 1er janvier 2025 pour 4 ans
const TAES: TAE[] = [
  { ville: 'Avignon (84)', ressort: 'Vaucluse', competence: 'Procédures amiables et collectives sans distinction d\'activité (sauf libérales réglementées hors de leur ressort).' },
  { ville: 'Auxerre (89)', ressort: 'Yonne', competence: 'Idem' },
  { ville: 'Le Havre (76)', ressort: 'Le Havre / Eure-Maritime', competence: 'Idem' },
  { ville: 'Le Mans (72)', ressort: 'Sarthe', competence: 'Idem' },
  { ville: 'Limoges (87)', ressort: 'Haute-Vienne', competence: 'Idem' },
  { ville: 'Lyon (69)', ressort: 'Rhône (partie commerce de Lyon)', competence: 'Idem' },
  { ville: 'Marseille (13)', ressort: 'Bouches-du-Rhône', competence: 'Idem' },
  { ville: 'Nancy (54)', ressort: 'Meurthe-et-Moselle', competence: 'Idem' },
  { ville: 'Nanterre (92)', ressort: 'Hauts-de-Seine', competence: 'Idem' },
  { ville: 'Paris (75)', ressort: 'Paris', competence: 'Idem' },
  { ville: 'Saint-Brieuc (22)', ressort: 'Côtes-d\'Armor', competence: 'Idem' },
  { ville: 'Versailles (78)', ressort: 'Yvelines', competence: 'Idem' },
];

export default function TaePage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-10">
      <Link href="/annuaires" className="mb-6 inline-flex items-center gap-2 text-sm text-navy/60 hover:text-navy">
        ← Tous les annuaires
      </Link>

      <h1 className="font-display text-3xl text-navy sm:text-4xl">
        Tribunaux des Activités Économiques (TAE)
      </h1>
      <p className="mt-3 text-base text-navy/70">
        La <strong>loi du 20 novembre 2023</strong> (n°2023-1059) crée le
        Tribunal des Activités Économiques pour rassembler en une seule
        juridiction le contentieux des entreprises en difficulté, quel
        que soit leur statut (commerçant, artisan, agriculteur, libéral,
        association). <strong>12 tribunaux</strong> expérimentent ce
        dispositif depuis le <strong>1er janvier 2025</strong>, pour 4 ans.
      </p>

      <div className="mt-6 rounded-2xl border border-bleu/30 bg-bleu/5 p-5 text-sm text-navy">
        <p className="font-display text-base text-bleu-fonce">Ce qui change</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          <li>
            <strong>Avant :</strong> tribunal de commerce pour les commerçants/sociétés, tribunal judiciaire pour les libéraux/agriculteurs/associations.
          </li>
          <li>
            <strong>Avec le TAE :</strong> un seul tribunal traite toutes les procédures (mandat ad hoc, conciliation, sauvegarde, RJ, LJ) <strong>quel que soit le statut</strong>.
          </li>
          <li>
            <strong>Composition :</strong> juges élus + magistrats professionnels (mixte).
          </li>
          <li>
            <strong>Bilan :</strong> évaluation prévue fin 2027 pour décider d&apos;une généralisation.
          </li>
        </ul>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {TAES.map((t) => (
          <div key={t.ville} className="glass-soft rounded-2xl p-4">
            <p className="font-display text-lg text-navy">{t.ville}</p>
            <p className="mt-1 text-sm text-navy/70">Ressort : {t.ressort}</p>
            <p className="mt-2 text-[11px] text-navy/55">{t.competence}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-jaune/30 bg-jaune/5 p-5 text-sm text-navy/80">
        <p className="font-display text-base text-navy">⚠️ Hors de ces ressorts</p>
        <p className="mt-2">
          Si votre département ne figure pas dans la liste, votre
          procédure relève toujours du tribunal de commerce
          (commerçants, sociétés) ou du tribunal judiciaire (libéraux,
          agriculteurs, associations) selon les règles antérieures.
        </p>
      </div>

      <p className="mt-6 text-xs text-navy/50">
        Source : Loi n°2023-1059 du 20 novembre 2023 (art. 26 à 36),
        décret n°2024-1225 du 30 décembre 2024, ministère de la
        Justice — service-public.fr.
      </p>
    </section>
  );
}
