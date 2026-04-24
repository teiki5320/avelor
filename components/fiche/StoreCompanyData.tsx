'use client';
import { useEffect } from 'react';
import type { CompanyData, Reponses } from '@/lib/types';

interface Props {
  company: CompanyData;
  token: string;
  reponses?: Reponses;
}

export default function StoreCompanyData({ company, token, reponses }: Props) {
  useEffect(() => {
    try {
      sessionStorage.setItem(
        'avelor_company',
        JSON.stringify({
          NOM_ENTREPRISE: company.nom,
          SIRET: company.siret,
          ADRESSE: [company.adresse, company.codePostal, company.ville].filter(Boolean).join(', '),
          VILLE: company.ville,
          NOM_DIRIGEANT: '',
          FORME_JURIDIQUE: company.formeJuridique,
          DATE_CREATION: company.dateCreation,
          ACTIVITE: company.nafLabel || company.naf,
        })
      );
      if (reponses) {
        sessionStorage.setItem('avelor_reponses', JSON.stringify(reponses));
      }
      // Store last fiche token for "Retrouver ma fiche"
      localStorage.setItem('avelor_last_fiche', JSON.stringify({
        token,
        nom: company.nom,
        siret: company.siret,
        ts: Date.now(),
      }));
    } catch {}
  }, [company, token, reponses]);

  return null;
}
