'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CLE_FICHE_LOCALE, poserCookieFicheLocale, type FicheLocaleData } from '@/lib/ficheLocale';

/** Clé de garde : évite une boucle de rechargements si le serveur ne lit pas le cookie. */
const CLE_ESSAI = `${CLE_FICHE_LOCALE}_essai`;
const DELAI_ESSAI_MS = 15_000;

type Etat = 'chargement' | 'absente';

/**
 * Affiché par /fiche/local quand le serveur n'a pas (ou plus) les données de la
 * fiche locale : relit sessionStorage (onglet courant), repose le cookie court
 * puis recharge la page pour que le serveur affiche la fiche. Rien ne passe dans l'URL.
 */
export default function FicheLocale() {
  const [etat, setEtat] = useState<Etat>('chargement');

  useEffect(() => {
    try {
      const brut = sessionStorage.getItem(CLE_FICHE_LOCALE);
      // Contrôle de forme seulement : le serveur valide le contenu avec le schéma.
      const data = brut ? (JSON.parse(brut) as FicheLocaleData) : null;
      if (!data || typeof data.siret !== 'string' || !data.reponses || typeof data.reponses !== 'object') {
        setEtat('absente');
        return;
      }
      const dernierEssai = Number(sessionStorage.getItem(CLE_ESSAI) ?? 0);
      if (Date.now() - dernierEssai < DELAI_ESSAI_MS) {
        // Déjà tenté à l'instant : cookies bloqués ou données refusées par le serveur.
        setEtat('absente');
        return;
      }
      sessionStorage.setItem(CLE_ESSAI, String(Date.now()));
      poserCookieFicheLocale(data);
      window.location.reload();
    } catch {
      setEtat('absente');
    }
  }, []);

  if (etat === 'chargement') {
    return (
      <section className="mx-auto max-w-xl px-5 py-20 text-center" aria-busy="true">
        <p className="text-sm text-navy/60" role="status">Chargement de votre fiche…</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-xl px-5 py-20 text-center">
      <h1 className="font-display text-2xl text-navy">Cette fiche n&apos;est plus disponible</h1>
      <p className="mt-4 text-navy/65">
        Elle n&apos;avait pas pu être enregistrée sur nos serveurs : elle restait visible
        uniquement dans l&apos;onglet où vous l&apos;aviez créée. Vous pouvez refaire le
        questionnaire, cela prend quelques minutes.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex min-h-[44px] items-center rounded-full bg-bleu-fonce px-6 py-3 text-white"
      >
        Refaire le questionnaire
      </Link>
    </section>
  );
}
