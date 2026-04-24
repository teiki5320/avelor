interface Props {
  id: string;
  icone: string;
  titre: string;
  sousTitre?: string;
  couleur?: 'bleu' | 'vert' | 'jaune' | 'rouge' | 'navy';
}

const COULEURS: Record<NonNullable<Props['couleur']>, string> = {
  bleu: 'bg-bleu',
  vert: 'bg-vert',
  jaune: 'bg-jaune',
  rouge: 'bg-rouge',
  navy: 'bg-navy',
};

export default function SectionHeader({ id, icone, titre, sousTitre, couleur = 'navy' }: Props) {
  return (
    <div id={id} className="scroll-mt-32 pt-4">
      <div className="flex items-center gap-3">
        <span className={`block h-8 w-1.5 rounded-full ${COULEURS[couleur]}`} aria-hidden />
        <div>
          <h2 className="font-display text-xl text-navy sm:text-2xl">
            <span className="mr-2" aria-hidden>{icone}</span>
            {titre}
          </h2>
          {sousTitre && (
            <p className="text-xs text-navy/55 sm:text-sm">{sousTitre}</p>
          )}
        </div>
      </div>
    </div>
  );
}
