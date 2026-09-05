import { z } from 'zod';

const reponsesSchema = z.object({
  situation: z.enum(['prevention', 'tresorie', 'redressement', 'assignation']),
  probleme: z.enum(['urssaf', 'fournisseurs', 'banque', 'impots']),
  effectif: z.enum(['independant', 'salaries']),
  effectifDetail: z.string().optional(),
  moral: z.enum(['combatif', 'epuise', 'perdu']),
  caution: z.string().optional(),
  regime: z.string().optional(),
  patrimoine: z.string().optional(),
  vente: z.string().optional(),
  montantDettes: z.enum(['moins-10k', '10k-50k', '50k-200k', '200k-1m', 'plus-1m']).optional(),
  ageDirigeant: z.enum(['moins-25', '25-50', '50-60', 'plus-60']).optional(),
  franchise: z.enum(['oui', 'non']).optional(),
  antecedents: z.enum(['oui', 'non', 'ne-sais-pas']).optional(),
  pgeEnCours: z.enum(['oui', 'non', 'ne-sais-pas']).optional(),
  rqth: z.enum(['oui', 'non']).optional(),
  conjointStatut: z.enum(['salarie', 'collaborateur', 'associe', 'aucun', 'sans-conjoint']).optional(),
  coGerants: z.enum(['oui', 'non', 'sans-objet']).optional(),
  saisonnalite: z.enum(['oui', 'non']).optional(),
  nationalite: z.enum(['fr-ue-eee-suisse', 'hors-ue', 'sans-reponse']).optional(),
}).passthrough();

export const fichePayloadSchema = z.object({
  siret: z.string().regex(/^\d{14}$/, 'Le SIRET doit contenir exactement 14 chiffres'),
  reponses: reponsesSchema,
  companyData: z.record(z.string(), z.unknown()).optional(),
});

/** Token de fiche : hex généré par uuid() (24 car.) — on tolère 10-64 alphanum pour d'anciens formats */
const tokenSchema = z
  .string()
  .regex(/^[A-Za-z0-9_-]{10,64}$/, 'Token invalide');

export const sendLinkPayloadSchema = z.object({
  token: tokenSchema,
  email: z.string().email('Adresse email invalide').max(254),
});

export const rappelPayloadSchema = z.object({
  token: tokenSchema,
  email: z.string().email().max(254),
  echeance: z.string().min(1).max(120),
  dateRappel: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  libelle: z.string().min(1).max(120),
});
