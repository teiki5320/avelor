import type { Reponses, CompanyData } from '@/lib/types';
import type { SectorInfo } from '@/lib/secteur';
import BlocAccordeon from './BlocAccordeon';

interface Props {
  reponses: Reponses;
  company: CompanyData;
  sector: SectorInfo;
}

function isEI(forme: string): boolean {
  return /individuel|ei|eirl|micro|auto/i.test(forme);
}

export default function BlocProtectionFamille({ reponses, company, sector }: Props) {
  const ei = isEI(company.formeJuridique);
  const aCaution = reponses.caution === 'oui' || reponses.caution === 'ne-sais-pas';
  const proprietaire = reponses.patrimoine === 'proprietaire';
  const communaute = reponses.regime === 'communaute' || reponses.regime === 'ne-sais-pas';
  const marie = reponses.regime !== 'non-marie';

  const items: { titre: string; texte: string; urgence?: 'rouge' | 'jaune' | 'vert' }[] = [];

  if (proprietaire && ei) {
    items.push({
      titre: 'Votre résidence est automatiquement protégée',
      texte: "En tant qu’entrepreneur individuel, votre résidence principale est insaisissable par les créanciers professionnels depuis la loi Macron 2015. Aucune démarche nécessaire.",
      urgence: 'vert',
    });
  } else if (proprietaire && !ei) {
    items.push({
      titre: 'Votre résidence n’est PAS automatiquement protégée',
      texte: `En tant que dirigeant de ${company.formeJuridique || 'société'}, votre résidence principale n’est pas protégée automatiquement. Consultez un notaire pour une déclaration d’insaisissabilité sur vos autres biens immobiliers.`,
      urgence: aCaution ? 'rouge' : 'jaune',
    });
  }

  if (aCaution) {
    items.push({
      titre: 'Vos cautions personnelles méritent une vérification',
      texte: "Une caution peut être contestée si elle était disproportionnée par rapport à vos revenus et patrimoine au moment de la signature (art. 2297 Code civil). Faites vérifier TOUTES vos cautions par un avocat  -  beaucoup sont contestables.",
      urgence: 'rouge',
    });
  }

  if (marie && communaute) {
    items.push({
      titre: 'Régime de communauté : votre conjoint·e est exposé·e',
      texte: "En communauté de biens, les biens communs peuvent être saisis pour payer les dettes de l’entreprise. Un changement vers la séparation de biens est possible (notaire, 1 500-3 000 €) mais doit être fait AVANT les difficultés, sous peine d’annulation par un juge.",
      urgence: 'jaune',
    });
  } else if (marie && reponses.regime === 'separation') {
    items.push({
      titre: 'Séparation de biens : votre conjoint·e est protégé·e',
      texte: "Sous réserve que votre conjoint·e n’ait pas co-signé de caution, ses biens personnels sont protégés. C’est une bonne situation.",
      urgence: 'vert',
    });
  }

  if (reponses.situation === 'redressement' || reponses.situation === 'assignation') {
    items.push({
      titre: 'Ne transférez pas d’actifs maintenant',
      texte: "Tout transfert de patrimoine (donation aux enfants, vente à un proche) réalisé dans les 18 mois précédant la cessation des paiements peut être annulé par le tribunal (action paulienne). Attendez les conseils d’un avocat.",
      urgence: 'rouge',
    });
  }

  items.push({
    titre: 'Vos dettes ne se transmettent pas',
    texte: "Les dettes professionnelles sont les vôtres, pas celles de votre famille. Vos proches ne peuvent pas en hériter contre leur volonté.",
  });

  if (items.length === 0) return null;

  return (
    <BlocAccordeon
      icone="🏠"
      titre="Protection de votre famille"
      soustitre={`Adapté à votre situation · ${company.formeJuridique || 'votre statut'}`}
    >
      <div className="space-y-3">
        {items.map((item, i) => (
          <div
            key={i}
            className={`rounded-2xl border p-4 ${
              item.urgence === 'rouge' ? 'border-rouge/30 bg-rouge/5' :
              item.urgence === 'jaune' ? 'border-jaune/30 bg-jaune/5' :
              item.urgence === 'vert' ? 'border-vert/30 bg-vert/5' :
              'border-navy/10 bg-white/60'
            }`}
          >
            <p className="font-medium text-navy">{item.titre}</p>
            <p className="mt-2 text-sm text-navy/70">{item.texte}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-2 text-xs">
        <a href="/proteger-famille" className="rounded-full bg-white/80 px-3 py-1 text-bleu-fonce hover:bg-white">
          Guide complet : protéger ma famille →
        </a>
        <a href="https://www.notaires.fr" target="_blank" rel="noreferrer" className="rounded-full bg-white/80 px-3 py-1 text-navy/70 hover:bg-white">
          Trouver un notaire →
        </a>
      </div>
    </BlocAccordeon>
  );
}
