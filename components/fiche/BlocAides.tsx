import type { Reponses, CompanyData } from '@/lib/types';
import type { SectorInfo } from '@/lib/secteur';
import BlocAccordeon from './BlocAccordeon';

interface Props {
  reponses: Reponses;
  company: CompanyData;
  sector: SectorInfo;
}

interface Aide {
  nom: string;
  description: string;
  telephone?: string;
  site?: string;
  badge?: string;
  condition?: string;
}

function isEI(forme: string): boolean {
  return /individuel|ei|eirl|micro|auto/i.test(forme);
}

function buildAides(r: Reponses, c: CompanyData, s: SectorInfo): { titre: string; aides: Aide[] }[] {
  const sections: { titre: string; aides: Aide[] }[] = [];
  const dep = c.departement || '';
  const ville = c.ville || '';
  const ei = isEI(c.formeJuridique);

  // Section 1: Aides liées au problème principal
  const specifiques: Aide[] = [];
  if (r.probleme === 'urssaf') {
    specifiques.push({
      nom: 'Échelonnement URSSAF',
      description: `Demandez un échéancier auprès de l'URSSAF ${dep ? `de votre département (${dep})` : ''}. Les cotisations de plus de 3 ans sont potentiellement prescrites.`,
      telephone: '36 98',
      site: 'https://www.urssaf.fr',
      badge: 'Prioritaire pour vous',
    });
    specifiques.push({
      nom: 'Fonds d\'action sociale URSSAF',
      description: 'Prise en charge partielle de cotisations en cas de difficulté avérée.',
      site: 'https://www.urssaf.fr',
    });
  }
  if (r.probleme === 'impots') {
    specifiques.push({
      nom: `Service des impôts des entreprises${ville ? ` de ${ville}` : ''}`,
      description: 'Demande de délai de paiement, échelonnement ou remise gracieuse. En cas de gêne exceptionnelle, l\'administration peut réduire l\'impôt dû.',
      site: 'https://www.impots.gouv.fr',
      badge: 'Prioritaire pour vous',
    });
    specifiques.push({
      nom: 'CCSF · Commission des chefs de services financiers',
      description: 'Échelonnement global de toutes vos dettes fiscales ET sociales en une seule demande. Un seul interlocuteur.',
      site: 'https://www.impots.gouv.fr',
      badge: 'Guichet unique',
    });
  }
  if (r.probleme === 'banque') {
    specifiques.push({
      nom: `Médiation du crédit${dep ? ` · Banque de France (${dep})` : ''}`,
      description: 'Gratuit et confidentiel. Le médiateur contacte votre banque et négocie pour vous. Taux de succès élevé.',
      telephone: '0810 00 12 10',
      site: 'https://mediateur-credit.banque-france.fr',
      badge: 'Prioritaire pour vous',
    });
  }
  if (r.probleme === 'fournisseurs') {
    specifiques.push({
      nom: 'Médiateur des entreprises',
      description: 'Différend avec un fournisseur ou client ? Le médiateur obtient un accord dans 75 % des cas. Gratuit.',
      telephone: '01 53 17 87 40',
      site: 'https://www.economie.gouv.fr/mediateur-des-entreprises',
      badge: 'Prioritaire pour vous',
    });
  }
  if (specifiques.length) {
    sections.push({ titre: `Pour votre situation (${r.probleme === 'urssaf' ? 'URSSAF' : r.probleme === 'impots' ? 'impôts' : r.probleme === 'banque' ? 'banque' : 'fournisseurs'})`, aides: specifiques });
  }

  // Section 2: Aides selon le statut
  const statut: Aide[] = [];
  if (r.effectif === 'independant' || ei) {
    statut.push({
      nom: 'CPAM / SSI · Action sociale',
      description: `Aide financière d'urgence pour indépendants (jusqu'à 3 000 €). Vous êtes ${ei ? 'entrepreneur individuel' : 'indépendant'} — vous y avez droit.`,
      telephone: '36 46',
      site: 'https://www.secu-independants.fr',
      badge: 'Gratuit',
    });
    statut.push({
      nom: 'RSA / ASS',
      description: 'Si votre revenu d\'activité est nul ou très faible, vous pouvez cumuler RSA et activité professionnelle.',
      site: 'https://www.caf.fr',
    });
  }
  if (r.effectif === 'salaries') {
    statut.push({
      nom: 'Activité partielle',
      description: `Indemnisation de vos salariés si baisse d'activité. Votre entreprise ${c.nom !== 'Votre entreprise' ? `(${c.nom}) ` : ''}peut en bénéficier.`,
      site: 'https://activitepartielle.emploi.gouv.fr',
      badge: 'Si baisse d\'activité',
    });
    statut.push({
      nom: 'AGS · Garantie des salaires',
      description: 'En cas de redressement ou liquidation, les salaires sont garantis par l\'AGS.',
      telephone: '01 55 90 27 00',
      site: 'https://www.ags-garantie-salaires.org',
    });
    statut.push({
      nom: 'FNE-Formation',
      description: 'Financement de formations pour vos salariés pendant la période de difficulté.',
      site: 'https://travail-emploi.gouv.fr',
    });
  }
  if (statut.length) {
    sections.push({ titre: r.effectif === 'independant' ? 'Pour les indépendants' : 'Pour les employeurs', aides: statut });
  }

  // Section 3: Aides sectorielles
  if (s.aidesSpecifiques.length > 0) {
    const sectorielles: Aide[] = s.aidesSpecifiques.map((a) => ({
      nom: a.nom,
      description: a.description,
      site: a.site,
      badge: a.badge ?? `Spécifique ${s.label}`,
    }));
    sections.push({ titre: `Aides ${s.label}`, aides: sectorielles });
  }

  // Section 4: Aides nationales (toujours)
  const nationales: Aide[] = [
    {
      nom: 'BPI France · Prêt rebond',
      description: `Prêt sans garantie de 10 000 à 300 000 € pour TPE/PME en difficulté${c.nom !== 'Votre entreprise' ? `. ${c.nom} peut être éligible.` : '.'}`,
      telephone: '3247',
      site: 'https://bpifrance.fr',
      badge: 'Entretien gratuit',
    },
  ];
  nationales.push({
    nom: 'CODEFI',
    description: `Comité départemental d'aide aux entreprises en difficulté de financement${dep ? ` (${dep})` : ''}. Peut négocier avec vos créanciers.`,
    site: 'https://www.economie.gouv.fr',
    badge: '< 400 salariés',
  });
  nationales.push({
    nom: 'CIP · Centre d\'Information sur la Prévention',
    description: 'Rendez-vous gratuit et confidentiel avec d\'anciens chefs d\'entreprise, avocats et comptables bénévoles.',
    site: 'https://www.cip-national.fr',
    badge: 'Gratuit · confidentiel',
  });
  nationales.push({
    nom: 'ADIE · Micro-crédit',
    description: 'Prêts jusqu\'à 17 000 € sur 5 ans. Accessible même si vous êtes interdit bancaire ou fiché FICP.',
    telephone: '0 969 328 110',
    site: 'https://www.adie.org',
    badge: 'Même interdit bancaire',
  });
  nationales.push({
    nom: 'France Active · Garanties de prêts',
    description: 'Garantit jusqu\'à 65 % d\'un prêt bancaire, réduisant le risque pour la banque. Accompagnement inclus.',
    site: 'https://www.franceactive.org',
  });
  sections.push({ titre: 'Aides nationales', aides: nationales });

  // Aides personnelles du dirigeant
  const personnelles: Aide[] = [
    {
      nom: 'ATI · Allocation Travailleurs Indépendants',
      description: 'Chômage spécifique indépendants : 592 à 789 €/mois pendant 6 mois après cessation involontaire.',
      site: 'https://chomage-independant.francetravail.fr',
      badge: '6 mois',
    },
    {
      nom: 'CSS · Complémentaire Santé Solidaire',
      description: 'Mutuelle gratuite si vos revenus ont fortement baissé (< 10 166 €/an).',
      telephone: '3646',
      site: 'https://www.complementaire-sante-solidaire.gouv.fr',
      badge: 'Gratuit',
    },
    {
      nom: 'Aide juridictionnelle',
      description: 'Avocat et frais de justice pris en charge si revenus < 12 957 €/an. Pour vos procédures personnelles.',
      site: 'https://www.service-public.fr',
      badge: 'Sous conditions',
    },
    {
      nom: 'Droit au compte · Banque de France',
      description: 'Si toutes les banques refusent de vous ouvrir un compte, la Banque de France en désigne une obligatoirement.',
      site: 'https://www.banque-france.fr',
      badge: 'Droit légal',
    },
  ];
  sections.push({ titre: 'Aides personnelles du dirigeant', aides: personnelles });

  // Aides locales
  const chambreLabel = s.chambre === 'CMA' ? 'Chambre de Métiers' : s.chambre === 'CA' ? 'Chambre d\'agriculture' : 'CCI';
  const regionales: Aide[] = [
    {
      nom: `${chambreLabel}${dep ? ` (${dep})` : ''}`,
      description: `Accompagnement gratuit et confidentiel pour les entreprises en difficulté${ville ? ` dans la région de ${ville}` : ''}.`,
      site: s.chambre === 'CMA' ? 'https://www.artisanat.fr' : s.chambre === 'CA' ? 'https://chambres-agriculture.fr' : 'https://www.cci.fr',
      badge: 'Gratuit · local',
    },
  ];
  if (r.probleme === 'urssaf' || r.probleme === 'impots') {
    regionales.push({
      nom: 'Médiateur national de l\'énergie',
      description: 'Si vos factures d\'énergie aggravent la situation. Gratuit pour les TPE (< 10 salariés, CA < 2 M€).',
      site: 'https://www.energie-mediateur.fr',
      badge: 'TPE uniquement',
    });
  }
  sections.push({ titre: `Aides locales${dep ? ` · département ${dep}` : ''}`, aides: regionales });

  return sections;
}

export default function BlocAides({ reponses, company, sector }: Props) {
  const sections = buildAides(reponses, company, sector);
  const total = sections.reduce((n, s) => n + s.aides.length, 0);

  return (
    <BlocAccordeon
      icone="💶"
      titre="Aides financières pour votre situation"
      soustitre={`${total} aides identifiées pour ${company.nom !== 'Votre entreprise' ? company.nom : 'votre entreprise'}`}
    >
      <div className="space-y-6">
        {sections.map((s) => (
          <div key={s.titre}>
            <h3 className="mb-3 font-display text-base text-navy">{s.titre}</h3>
            <div className="space-y-2">
              {s.aides.map((a, i) => (
                <div
                  key={i}
                  className="glass-soft flex items-start justify-between gap-3 p-4"
                >
                  <div className="flex-1">
                    <div className="flex items-start gap-2">
                      <p className="font-medium text-navy">{a.nom}</p>
                      {a.badge && (
                        <span className="pastille shrink-0 text-[10px]">{a.badge}</span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-navy/70">{a.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      {a.telephone && (
                        <a
                          href={`tel:${a.telephone.replace(/\s/g, '')}`}
                          className="rounded-full bg-white/80 px-3 py-1 text-navy/80 hover:bg-white"
                        >
                          ☎ {a.telephone}
                        </a>
                      )}
                      {a.site && (
                        <a
                          href={a.site}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full bg-white/80 px-3 py-1 text-navy/80 hover:bg-white"
                        >
                          🌐 {(() => { try { return new URL(a.site).hostname.replace('www.', ''); } catch { return a.nom; } })()}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-5 text-xs text-navy/50">
        Ces aides sont filtrées selon votre situation ({company.formeJuridique}, département {company.departement}). Vérifiez les conditions directement auprès de chaque organisme.
      </p>
    </BlocAccordeon>
  );
}
