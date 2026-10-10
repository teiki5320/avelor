'use client';

interface Props {
  companyName: string;
}

/**
 * Ouvre la boîte d'impression du navigateur, d'où l'on peut aussi
 * « Enregistrer au format PDF ». Les blocs repliés sont imprimés en entier
 * grâce aux règles @media print (voir BlocAccordeon et app/globals.css).
 */
export default function ExportPDF({ companyName }: Props) {
  function handlePrint() {
    if (typeof window !== 'undefined') {
      document.title = `Solelis · Fiche ${companyName}`;
      window.print();
    }
  }

  return (
    <div className="no-print flex flex-wrap gap-3">
      <button
        type="button"
        onClick={handlePrint}
        className="btn-ghost"
      >
        <span aria-hidden>🖨️</span> Imprimer / enregistrer en PDF
      </button>
    </div>
  );
}
