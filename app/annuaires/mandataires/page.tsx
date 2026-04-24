import Link from 'next/link';

interface Etude {
  ville: string;
  nom: string;
  type: 'mandataire' | 'administrateur';
  telephone?: string;
  site?: string;
}

// Source : cnajmj.fr (annuaire officiel) — extraits indicatifs au 2025
// La liste complète et à jour est sur cnajmj.fr
const ETUDES_PRINCIPALES: Etude[] = [
  // Paris
  { ville: 'Paris (75)', nom: 'AJ Associés (Bouquemont, Sapin)', type: 'administrateur', telephone: '01 53 30 90 00' },
  { ville: 'Paris (75)', nom: 'BTSG² (Pellier-Tetreau, Sapin)', type: 'mandataire', telephone: '01 56 02 03 90' },
  { ville: 'Paris (75)', nom: 'Étude Smith & Hellenbrand', type: 'mandataire', telephone: '01 53 36 35 00' },
  // Lyon
  { ville: 'Lyon (69)', nom: 'MJ Associés Lyon', type: 'mandataire', telephone: '04 72 60 50 30' },
  { ville: 'Lyon (69)', nom: 'AJ Up (Adam-Janon)', type: 'administrateur', telephone: '04 72 41 90 00' },
  // Marseille
  { ville: 'Marseille (13)', nom: 'SCP Mandon-Maraval', type: 'mandataire', telephone: '04 91 13 41 80' },
  { ville: 'Marseille (13)', nom: 'AJ Up Marseille', type: 'administrateur', telephone: '04 91 33 87 87' },
  // Toulouse
  { ville: 'Toulouse (31)', nom: 'SCP Olivier-Fauveau-Cazals', type: 'mandataire', telephone: '05 62 27 33 33' },
  { ville: 'Toulouse (31)', nom: 'BR Associés', type: 'administrateur', telephone: '05 61 14 47 47' },
  // Bordeaux
  { ville: 'Bordeaux (33)', nom: 'SCP Silvestri-Baujet', type: 'mandataire', telephone: '05 56 79 21 90' },
  { ville: 'Bordeaux (33)', nom: 'Hirou', type: 'administrateur', telephone: '05 56 81 16 16' },
  // Nantes
  { ville: 'Nantes (44)', nom: 'SCP Cottret-Cattaneo', type: 'mandataire', telephone: '02 40 35 00 32' },
  { ville: 'Nantes (44)', nom: 'AJ Up Nantes', type: 'administrateur', telephone: '02 40 89 22 22' },
  // Lille
  { ville: 'Lille (59)', nom: 'SELARL MJA Nord', type: 'mandataire', telephone: '03 20 14 90 50' },
  // Strasbourg
  { ville: 'Strasbourg (67)', nom: 'SCP Sapin', type: 'mandataire', telephone: '03 88 16 11 80' },
  // Rennes
  { ville: 'Rennes (35)', nom: 'SELARL Le Layec', type: 'mandataire', telephone: '02 99 67 36 50' },
];

export default function MandatairesPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-10">
      <Link href="/annuaires" className="mb-6 inline-flex items-center gap-2 text-sm text-navy/60 hover:text-navy">
        ← Tous les annuaires
      </Link>

      <h1 className="font-display text-3xl text-navy sm:text-4xl">
        Mandataires et administrateurs judiciaires
      </h1>
      <p className="mt-3 text-base text-navy/70">
        Les <strong>administrateurs judiciaires</strong> (AJ) et{' '}
        <strong>mandataires judiciaires</strong> (MJ) sont nommés par le
        tribunal lors d&apos;une procédure collective. Les
        professionnels listés ci-dessous sont inscrits sur les listes
        officielles tenues par le Conseil National (CNAJMJ).
      </p>

      <div className="mt-6 rounded-2xl border border-bleu/30 bg-bleu/5 p-5 text-sm text-navy">
        <p className="font-display text-base text-bleu-fonce">
          Comment se déroule la nomination
        </p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          <li>
            Vous pouvez <strong>proposer</strong> un mandataire/administrateur précis dans votre déclaration de cessation des paiements ou requête en sauvegarde.
          </li>
          <li>
            Le tribunal en désigne un parmi la liste régionale (en général sur rotation).
          </li>
          <li>
            Un premier RDV avec un professionnel <strong>avant</strong> la procédure est gratuit (consultation découverte). N&apos;hésitez pas à en contacter plusieurs.
          </li>
        </ul>
      </div>

      <div className="mt-8">
        <p className="mb-3 text-sm text-navy/55">
          Sélection indicative (15 études parmi les plus actives sur le retournement) :
        </p>
        <div className="space-y-3">
          {ETUDES_PRINCIPALES.map((e, i) => (
            <div key={i} className="glass-soft rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-base text-navy">{e.nom}</p>
                  <p className="mt-1 text-sm text-navy/70">{e.ville}</p>
                  <span
                    className={`pastille mt-2 text-[10px] ${
                      e.type === 'administrateur' ? 'bg-bleu/15 text-bleu-fonce' : 'bg-vert/15 text-vert'
                    }`}
                  >
                    {e.type === 'administrateur' ? 'Administrateur judiciaire' : 'Mandataire judiciaire'}
                  </span>
                </div>
                {e.telephone && (
                  <a
                    href={`tel:${e.telephone.replace(/\s/g, '')}`}
                    className="shrink-0 rounded-full bg-white/80 px-3 py-1 text-sm text-bleu-fonce hover:bg-white"
                  >
                    ☎ {e.telephone}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-jaune/30 bg-jaune/5 p-5 text-sm text-navy/80">
        <p className="font-display text-base text-navy">
          Annuaire officiel complet
        </p>
        <p className="mt-2">
          Cette liste est <strong>indicative</strong> et non exhaustive
          (~340 mandataires inscrits en France). Pour rechercher dans
          l&apos;annuaire officiel par ressort géographique :
        </p>
        <a
          href="https://www.cnajmj.fr"
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex rounded-full bg-bleu-fonce px-4 py-2 text-sm font-medium text-white hover:bg-navy"
        >
          🌐 cnajmj.fr — annuaire officiel
        </a>
      </div>

      <p className="mt-6 text-xs text-navy/50">
        Source : Conseil National des Administrateurs Judiciaires et
        Mandataires Judiciaires (CNAJMJ). Cadre légal : C. com. art.
        L811-1 à L814-15.
      </p>
    </section>
  );
}
