import type { Reponses, CompanyData } from '@/lib/types';
import BlocAccordeon from './BlocAccordeon';

interface Props {
  reponses: Reponses;
  company: CompanyData;
  companyAge: number | null;
  seuils: { cse: boolean; obligations50: boolean };
}

interface Alerte {
  texte: string;
  detail: string;
  urgence: 'info' | 'attention';
}

function buildAlertes(r: Reponses, age: number | null, seuils: { cse: boolean; obligations50: boolean }): Alerte[] {
  const alertes: Alerte[] = [];

  if (r.probleme === 'urssaf') {
    alertes.push({
      texte: 'Les cotisations URSSAF se prescrivent par 3 ans',
      detail:
        'Si vous avez des dettes URSSAF datant de plus de 3 ans, elles sont potentiellement prescrites. Vérifiez les dates exactes avec un avocat — cela pourrait réduire significativement votre dette.',
      urgence: 'attention',
    });
    alertes.push({
      texte: 'Vous avez 2 mois pour contester une mise en demeure URSSAF',
      detail:
        'À compter de la réception de la mise en demeure, vous disposez de 2 mois pour saisir la Commission de Recours Amiable (CRA). Passé ce délai, la contestation est beaucoup plus difficile.',
      urgence: 'attention',
    });
  }

  if (r.probleme === 'impots') {
    alertes.push({
      texte: 'Les dettes fiscales se prescrivent généralement par 4 ans',
      detail:
        'Le délai de reprise de l\'administration fiscale est de 3 ans pour l\'impôt sur le revenu et l\'IS, et de 4 ans pour la TVA (à partir de l\'année suivant celle au titre de laquelle l\'impôt est dû).',
      urgence: 'info',
    });
  }

  if (r.situation === 'redressement' || r.situation === 'assignation') {
    alertes.push({
      texte: 'Vous avez 45 jours pour déclarer la cessation des paiements',
      detail:
        'L\'article L631-4 du Code de commerce impose de déclarer la cessation des paiements dans les 45 jours. Ne pas le faire peut engager votre responsabilité personnelle.',
      urgence: 'attention',
    });
  }

  if (r.situation === 'assignation') {
    alertes.push({
      texte: 'Respectez les délais de comparution du tribunal',
      detail:
        'Une assignation devant le tribunal de commerce contient une date de comparution. Si vous ne vous présentez pas et ne vous faites pas représenter, un jugement peut être rendu par défaut — souvent en votre défaveur.',
      urgence: 'attention',
    });
  }

  if (r.effectif === 'salaries') {
    alertes.push({
      texte: 'Les salaires ont un super-privilège',
      detail:
        'En cas de procédure collective, les 60 derniers jours de salaires sont garantis par l\'AGS et bénéficient d\'un super-privilège. Vos salariés seront payés — mais vous devez déclarer rapidement.',
      urgence: 'info',
    });
  }

  if (age !== null && age < 2) {
    alertes.push({
      texte: 'Votre entreprise a moins de 2 ans — des protections spécifiques existent',
      detail:
        'Les entreprises de moins de 2 ans peuvent bénéficier de dispositifs spécifiques : exonérations ACRE, prêts d\'honneur BPI France, et certaines procédures (sauvegarde) sont plus favorables aux jeunes entreprises.',
      urgence: 'info',
    });
  }

  if (seuils.cse) {
    alertes.push({
      texte: 'Avec 11+ salariés, le CSE doit être informé en cas de difficulté',
      detail:
        'Le Code du travail impose d\'informer le CSE en cas de difficulté économique. Ne pas le faire peut engager votre responsabilité. C\'est aussi un allié : le CSE peut déclencher un droit d\'alerte économique.',
      urgence: 'attention',
    });
  }

  if (seuils.obligations50) {
    alertes.push({
      texte: 'Avec 50+ salariés, des obligations renforcées s\'appliquent',
      detail:
        'PSE (Plan de Sauvegarde de l\'Emploi) obligatoire en cas de licenciement économique de 10+ salariés sur 30 jours. Le CSE doit être consulté avec un expert-comptable.',
      urgence: 'attention',
    });
  }

  alertes.push({
    texte: 'Un mandat ad hoc peut être demandé à tout moment',
    detail:
      'Tant que vous n\'êtes pas en cessation des paiements depuis plus de 45 jours, vous pouvez demander un mandat ad hoc. C\'est confidentiel, peu coûteux, et souvent très efficace.',
    urgence: 'info',
  });

  return alertes;
}

export default function BlocPrescription({ reponses, companyAge, seuils }: Props) {
  const alertes = buildAlertes(reponses, companyAge, seuils);

  return (
    <BlocAccordeon
      icone="⏰"
      titre="Délais et prescriptions"
      soustitre="Ce que la loi prévoit — à vérifier avec un avocat"
    >
      <div className="space-y-3">
        {alertes.map((a, i) => (
          <div
            key={i}
            className={`rounded-2xl border p-4 ${
              a.urgence === 'attention'
                ? 'border-jaune/30 bg-jaune/5'
                : 'border-navy/10 bg-white/60'
            }`}
          >
            <p className="font-medium text-navy">
              {a.urgence === 'attention' && (
                <span className="mr-2 text-jaune" aria-hidden>⚠️</span>
              )}
              {a.texte}
            </p>
            <p className="mt-2 text-sm text-navy/70">{a.detail}</p>
          </div>
        ))}
      </div>
      <p className="mt-5 text-xs text-navy/50">
        Ces informations sont générales. Les délais exacts dépendent de
        votre situation. Un avocat peut les vérifier gratuitement lors
        d&apos;une première consultation.
      </p>
    </BlocAccordeon>
  );
}
