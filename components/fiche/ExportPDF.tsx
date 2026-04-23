'use client';

interface Props {
  companyName: string;
}

export default function ExportPDF({ companyName }: Props) {
  function handlePrint() {
    if (typeof window !== 'undefined') {
      document.title = `AVELOR · Fiche ${companyName}`;
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
        📄 Télécharger en PDF
      </button>
    </div>
  );
}
