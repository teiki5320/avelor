import { notFound } from 'next/navigation';
import { getFicheByTokenMemo } from '@/lib/db';
import { tokenSchema } from '@/lib/schemas';

/**
 * Vérifie l'existence de la fiche AVANT la frontière de chargement
 * (loading.tsx de ce segment) : une fois le streaming commencé, le statut
 * HTTP est figé à 200. Ici, notFound() renvoie encore un vrai 404 pour un
 * token inconnu. La lecture est partagée avec la page (React cache).
 * « local » (fiche non enregistrée) est laissé à la page.
 */
export default async function FicheTokenLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  if (token !== 'local') {
    const valide = tokenSchema.safeParse(token).success;
    if (!valide || !(await getFicheByTokenMemo(token))) notFound();
  }
  return children;
}
