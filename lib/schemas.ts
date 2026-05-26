import { z } from 'zod';

/**
 * Schéma Zod pour le payload de création de fiche (POST /api/fiche).
 * Les valeurs d'enum correspondent aux types définis dans lib/types.ts.
 */
export const fichePayloadSchema = z.object({
  siret: z.string().regex(/^\d{14}$/, 'Le SIRET doit contenir exactement 14 chiffres'),
  reponses: z.object({
    situation: z.enum(['prevention', 'tresorie', 'redressement', 'assignation']),
    probleme: z.enum(['urssaf', 'fournisseurs', 'banque', 'impots']),
    effectif: z.enum(['independant', 'salaries']),
    effectifDetail: z.string().optional(),
    moral: z.enum(['combatif', 'epuise', 'perdu']),
    caution: z.enum(['oui', 'non', 'ne-sais-pas']).optional(),
    regime: z.enum(['communaute', 'separation', 'non-marie', 'ne-sais-pas']).optional(),
    patrimoine: z.enum(['proprietaire', 'locataire']).optional(),
    vente: z.enum(['oui', 'peut-etre', 'non']).optional(),
  }),
});

/**
 * Schéma Zod pour le payload d'envoi de magic link (POST /api/fiche/send-link).
 */
export const sendLinkPayloadSchema = z.object({
  token: z.string().min(10, 'Le token doit contenir au moins 10 caractères'),
  email: z.string().email('Adresse email invalide'),
});

/**
 * Schéma Zod pour le payload de création de rappel (POST /api/fiche/rappels).
 */
export const rappelPayloadSchema = z.object({
  token: z.string().min(10),
  email: z.string().email(),
  echeance: z.string().min(1),
  dateRappel: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  libelle: z.string().min(1),
});
