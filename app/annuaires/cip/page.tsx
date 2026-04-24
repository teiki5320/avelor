import Link from 'next/link';

interface CIP {
  region: string;
  ville: string;
  permanenceFrequence: string;
  contact: string;
}

// Source : cip-national.fr — extraits indicatifs au 2025
// 105 antennes au total : la liste complète et à jour est sur cip-national.fr
const CIP_PRINCIPAUX: CIP[] = [
  { region: 'Île-de-France', ville: 'Paris', permanenceFrequence: '2 fois/semaine', contact: 'CIP Paris (TC Paris)' },
  { region: 'Île-de-France', ville: 'Nanterre', permanenceFrequence: '1 fois/semaine', contact: 'CIP Hauts-de-Seine' },
  { region: 'Auvergne-Rhône-Alpes', ville: 'Lyon', permanenceFrequence: '1 fois/semaine', contact: 'CIP Rhône' },
  { region: 'Auvergne-Rhône-Alpes', ville: 'Grenoble', permanenceFrequence: '1 fois/mois', contact: 'CIP Isère' },
  { region: 'Auvergne-Rhône-Alpes', ville: 'Saint-Étienne', permanenceFrequence: '1 fois/mois', contact: 'CIP Loire' },
  { region: 'Provence-Alpes-Côte d\'Azur', ville: 'Marseille', permanenceFrequence: '2 fois/mois', contact: 'CIP Bouches-du-Rhône' },
  { region: 'Provence-Alpes-Côte d\'Azur', ville: 'Nice', permanenceFrequence: '1 fois/mois', contact: 'CIP Alpes-Maritimes' },
  { region: 'Occitanie', ville: 'Toulouse', permanenceFrequence: '1 fois/semaine', contact: 'CIP Haute-Garonne' },
  { region: 'Occitanie', ville: 'Montpellier', permanenceFrequence: '1 fois/mois', contact: 'CIP Hérault' },
  { region: 'Nouvelle-Aquitaine', ville: 'Bordeaux', permanenceFrequence: '1 fois/semaine', contact: 'CIP Gironde' },
  { region: 'Nouvelle-Aquitaine', ville: 'Limoges', permanenceFrequence: '1 fois/mois', contact: 'CIP Haute-Vienne' },
  { region: 'Pays de la Loire', ville: 'Nantes', permanenceFrequence: '1 fois/semaine', contact: 'CIP Loire-Atlantique' },
  { region: 'Pays de la Loire', ville: 'Angers', permanenceFrequence: '1 fois/mois', contact: 'CIP Maine-et-Loire' },
  { region: 'Bretagne', ville: 'Rennes', permanenceFrequence: '1 fois/mois', contact: 'CIP Ille-et-Vilaine' },
  { region: 'Hauts-de-France', ville: 'Lille', permanenceFrequence: '1 fois/semaine', contact: 'CIP Nord' },
  { region: 'Grand Est', ville: 'Strasbourg', permanenceFrequence: '1 fois/mois', contact: 'CIP Bas-Rhin' },
  { region: 'Grand Est', ville: 'Nancy', permanenceFrequence: '1 fois/mois', contact: 'CIP Meurthe-et-Moselle' },
  { region: 'Grand Est', ville: 'Reims', permanenceFrequence: '1 fois/mois', contact: 'CIP Marne' },
  { region: 'Bourgogne-Franche-Comté', ville: 'Dijon', permanenceFrequence: '1 fois/mois', contact: 'CIP Côte-d\'Or' },
  { region: 'Centre-Val de Loire', ville: 'Tours', permanenceFrequence: '1 fois/mois', contact: 'CIP Indre-et-Loire' },
  { region: 'Normandie', ville: 'Rouen', permanenceFrequence: '1 fois/mois', contact: 'CIP Seine-Maritime' },
  { region: 'Normandie', ville: 'Caen', permanenceFrequence: '1 fois/mois', contact: 'CIP Calvados' },
];

export default function CipPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-10">
      <Link href="/annuaires" className="mb-6 inline-flex items-center gap-2 text-sm text-navy/60 hover:text-navy">
        ← Tous les annuaires
      </Link>

      <h1 className="font-display text-3xl text-navy sm:text-4xl">
        CIP — Centres d&apos;Information sur la Prévention
      </h1>
      <p className="mt-3 text-base text-navy/70">
        Le CIP est un dispositif national d&apos;<strong>accompagnement
        gratuit, confidentiel et sans rendez-vous</strong> pour les chefs
        d&apos;entreprise en difficulté. Les permanences sont assurées par
        des bénévoles : anciens chefs d&apos;entreprise, avocats,
        experts-comptables et juges consulaires honoraires.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="glass-soft rounded-2xl p-4 text-center">
          <p className="font-display text-2xl text-navy">100 %</p>
          <p className="mt-1 text-xs text-navy/65">Gratuit</p>
        </div>
        <div className="glass-soft rounded-2xl p-4 text-center">
          <p className="font-display text-2xl text-navy">100 %</p>
          <p className="mt-1 text-xs text-navy/65">Confidentiel</p>
        </div>
        <div className="glass-soft rounded-2xl p-4 text-center">
          <p className="font-display text-2xl text-navy">~ 105</p>
          <p className="mt-1 text-xs text-navy/65">Antennes en France</p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-bleu/30 bg-bleu/5 p-5 text-sm text-navy">
        <p className="font-display text-base text-bleu-fonce">
          Comment se déroule un RDV CIP
        </p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          <li>RDV de <strong>1 heure</strong> en moyenne</li>
          <li>Une équipe de 3 bénévoles vous reçoit (juriste, comptable, dirigeant)</li>
          <li>Diagnostic de votre situation, orientation vers les bons interlocuteurs</li>
          <li>Aucun engagement, aucun coût, secret professionnel des intervenants</li>
        </ul>
      </div>

      <div className="mt-8">
        <p className="mb-3 text-sm text-navy/55">
          Sélection indicative (22 antennes) :
        </p>
        <div className="space-y-3">
          {CIP_PRINCIPAUX.map((c, i) => (
            <div key={i} className="glass-soft rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-base text-navy">{c.contact}</p>
                  <p className="mt-1 text-sm text-navy/70">
                    <strong>{c.ville}</strong> · région {c.region}
                  </p>
                </div>
                <span className="pastille shrink-0 text-[10px]">{c.permanenceFrequence}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-jaune/30 bg-jaune/5 p-5 text-sm text-navy/80">
        <p className="font-display text-base text-navy">
          Pour trouver l&apos;antenne CIP la plus proche
        </p>
        <p className="mt-2">
          Consultez l&apos;annuaire officiel et prenez RDV en ligne ou
          par téléphone. Les permanences se tiennent en général au
          tribunal de commerce, à la CCI ou la CMA de votre ville.
        </p>
        <a
          href="https://www.cip-national.fr"
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex rounded-full bg-bleu-fonce px-4 py-2 text-sm font-medium text-white hover:bg-navy"
        >
          🌐 cip-national.fr — toutes les antennes
        </a>
      </div>

      <p className="mt-6 text-xs text-navy/50">
        Source : Centre d&apos;Information sur la Prévention des
        difficultés des entreprises (CIP National). Cadre :
        association loi 1901 reconnue d&apos;intérêt général,
        partenaire du ministère de la Justice et du ministère de
        l&apos;Économie.
      </p>
    </section>
  );
}
