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
}).passthrough();

export const fichePayloadSchema = z.object({
  siret: z.string().regex(/^\d{14}$/, 'Le SIRET doit contenir exactement 14 chiffres'),
  reponses: reponsesSchema,
  companyData: z.record(z.string(), z.unknown()).optional(),
});

export const sendLinkPayloadSchema = z.object({
  token: z.string().min(10, 'Le token doit contenir au moins 10 caractères'),
  email: z.string().email('Adresse email invalide'),
});

export const rappelPayloadSchema = z.object({
  token: z.string().min(10),
  email: z.string().email(),
  echeance: z.string().min(1),
  dateRappel: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  libelle: z.string().min(1),
});
