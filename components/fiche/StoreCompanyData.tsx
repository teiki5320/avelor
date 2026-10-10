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
        'solelis_company',
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
        sessionStorage.setItem('solelis_reponses', JSON.stringify(reponses));
      }
      // Mémorise la dernière fiche pour « Retrouver votre fiche ».
      // Une fiche locale (non enregistrée) ne peut pas être rouverte par lien :
      // on ne la propose pas, et on retire une ancienne entrée « local ».
      if (token === 'local') {
        const ancienne = localStorage.getItem('solelis_last_fiche');
        if (ancienne && JSON.parse(ancienne)?.token === 'local') {
          localStorage.removeItem('solelis_last_fiche');
        }
      } else {
        localStorage.setItem('solelis_last_fiche', JSON.stringify({
          token,
          nom: company.nom,
          siret: company.siret,
          ts: Date.now(),
        }));
      }
    } catch {}
  }, [company, token, reponses]);

  return null;
}
