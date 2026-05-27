import { z } from 'zod';

export const fichePayloadSchema = z.object({
  siret: z.string().regex(/^\d{14}$/, 'Le SIRET doit contenir exactement 14 chiffres'),
  reponses: z.record(z.string(), z.unknown()),
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
