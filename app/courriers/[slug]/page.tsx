'use client';
import { useState, useMemo, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getCourrier, CATEGORIES } from '@/lib/courriers';

function extractFields(text: string): string[] {
  const set = new Set<string>();
  const re = /\{\{([A-Z_]+)\}\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    set.add(m[1]);
  }
  return Array.from(set);
}

const FIELD_LABELS: Record<string, string> = {
  NOM_ENTREPRISE: 'Nom de l\'entreprise',
  SIRET: 'SIRET',
  NOM_DIRIGEANT: 'Nom du dirigeant',
  QUALITE: 'Qualité (gérant, président…)',
  ADRESSE: 'Adresse',
  VILLE: 'Ville',
  DATE: 'Date du courrier',
  DUREE: 'Durée souhaitée (mois)',
  MONTANT: 'Montant (€)',
  TYPE_IMPOT: 'Nature de l\'impôt (TVA, IS…)',
  DATE_ECHEANCE: 'Date d\'échéance initiale',
  RAISON: 'Raison de la difficulté',
  DATE_DEBUT: 'Date de début du plan',
  NUM_FACTURE: 'Numéro de facture',
  DUREE_RELATION: 'Durée de la relation commerciale',
  MONTANT_1: 'Montant 1er versement (€)',
  MONTANT_2: 'Montant 2e versement (€)',
  MONTANT_3: 'Montant solde (€)',
  DATE_1: 'Date 1er versement',
  DATE_2: 'Date 2e versement',
  DATE_3: 'Date solde',
  NOM_ADVERSAIRE: 'Nom de l\'entreprise adverse',
  SIRET_ADVERSAIRE: 'SIRET de l\'entreprise adverse',
  NATURE_DIFFEREND: 'Nature du différend',
  EXPOSE_FAITS: 'Exposé des faits',
  TENTATIVES: 'Tentatives de résolution déjà faites',
  NOM_BANQUE: 'Nom de votre banque',
  AUTRE_MOTIF: 'Autre motif',
  CONSEQUENCES: 'Conséquences pour l\'entreprise',
  NB_SALARIES: 'Nombre de salariés',
  CA: 'Chiffre d\'affaires annuel (€)',
  FORME_JURIDIQUE: 'Forme juridique',
  CAPITAL: 'Capital social (€)',
  DATE_CESSATION: 'Date de cessation des paiements',
  DATE_CREATION: 'Date de création',
  ACTIVITE: 'Activité principale',
  NATURE_DIFFICULTES: 'Nature des difficultés',
  DISPONIBILITES: 'Vos disponibilités',
  DESCRIPTION_DIFFICULTES: 'Description des difficultés',
  LISTE_CREANCIERS: 'Liste des principaux créanciers',
  MISSION_SOUHAITEE: 'Mission souhaitée pour le mandataire',
  OBJECTIF_CONCILIATION: 'Objectif de la conciliation',
  REFERENCE_DETTE: 'Référence de la dette',
  PROPOSITION_ARRANGEMENT: 'Votre proposition d\'arrangement',
  NUM_AFFILIATION: 'Numéro d\'affiliation SSI/CPAM',
  STATUT: 'Statut (indépendant, auto-entrepreneur…)',
  REVENUS: 'Revenus mensuels actuels (€)',
  CHARGES: 'Charges fixes mensuelles (€)',
  SITUATION_FAMILIALE: 'Situation familiale',
  PERSONNES_A_CHARGE: 'Nombre de personnes à charge',
  DESCRIPTION_SITUATION: 'Description de votre situation',
  OBJECTIF_AIDE: 'Ce que l\'aide vous permettrait',
  NUM_MED: 'Numéro de la mise en demeure',
  DATE_MED: 'Date de la mise en demeure',
  MOTIFS_CONTESTATION: 'Motifs de la contestation',
  DATE_FIN: 'Date de fin de la période',
  LISTE_PIECES: 'Liste des pièces justificatives',
};

export default function CourrierDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const template = getCourrier(slug);
  const textRef = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const merged: Record<string, string> = {};
    try {
      const stored = sessionStorage.getItem('avelor_company');
      if (stored) Object.assign(merged, JSON.parse(stored));
    } catch {}
    try {
      const url = new URL(window.location.href);
      const prefill = url.searchParams.get('prefill');
      if (prefill) Object.assign(merged, JSON.parse(decodeURIComponent(prefill)));
    } catch {}
    merged.DATE = merged.DATE || new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    if (Object.keys(merged).length > 0) {
      setValues((prev) => ({ ...merged, ...prev }));
    }
  }, []);

  const allFields = useMemo(
    () => template ? extractFields(template.objet + '\n' + template.corps) : [],
    [template]
  );

  if (!template) {
    return (
      <section className="mx-auto max-w-2xl px-5 py-20 text-center">
        <h1 className="font-display text-3xl text-navy">Modèle introuvable</h1>
        <Link href="/courriers" className="btn-ghost mt-6 inline-flex">
          ← Tous les modèles
        </Link>
      </section>
    );
  }

  function rendered(text: string): string {
    return text.replace(/\{\{([A-Z_]+)\}\}/g, (_, key) => {
      const v = values[key];
      return v ? v : `[${FIELD_LABELS[key] ?? key}]`;
    });
  }

  async function handleCopy() {
    if (!template) return;
    const text = `Objet : ${rendered(template.objet)}\n\n${rendered(template.corps)}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }

  function handlePrint() {
    window.print();
  }

  const meta = template ? CATEGORIES[template.categorie] : undefined;

  return (
    <section className="mx-auto max-w-4xl px-5 pb-24">
      <Link
        href="/courriers"
        className="mb-6 inline-flex items-center gap-2 text-sm text-navy/60 hover:text-navy"
      >
        ← Tous les modèles
      </Link>

      <div className="mb-8">
        <span className="pastille mb-3 inline-flex">
          {template.icone} {meta?.label}
        </span>
        <h1 className="font-display text-2xl text-navy sm:text-4xl">
          {template.titre}
        </h1>
        <p className="mt-2 text-navy/60">
          Destinataire : {template.destinataire}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Fields column */}
        <div className="space-y-3 lg:col-span-2">
          <h2 className="font-display text-lg text-navy">
            Vos informations
          </h2>
          <p className="text-xs text-navy/50">
            Remplissez les champs ci-dessous — le courrier se met à jour
            automatiquement.
          </p>
          <div className="space-y-2">
            {allFields.map((f) => (
              <div key={f}>
                <label
                  htmlFor={f}
                  className="mb-1 block text-xs font-medium text-navy/70"
                >
                  {FIELD_LABELS[f] ?? f}
                </label>
                {(f.includes('DESCRIPTION') ||
                  f.includes('EXPOSE') ||
                  f.includes('TENTATIVES') ||
                  f.includes('LISTE') ||
                  f.includes('MOTIFS') ||
                  f.includes('PROPOSITION') ||
                  f.includes('MISSION') ||
                  f.includes('OBJECTIF') ||
                  f.includes('CONSEQUENCES')) ? (
                  <textarea
                    id={f}
                    rows={3}
                    value={values[f] ?? ''}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [f]: e.target.value }))
                    }
                    className="w-full rounded-xl border border-navy/10 bg-white/80 px-3 py-2 text-sm focus:border-bleu focus:outline-none"
                    placeholder={FIELD_LABELS[f] ?? f}
                  />
                ) : (
                  <input
                    id={f}
                    type="text"
                    value={values[f] ?? ''}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [f]: e.target.value }))
                    }
                    className="w-full rounded-xl border border-navy/10 bg-white/80 px-3 py-2 text-sm focus:border-bleu focus:outline-none"
                    placeholder={FIELD_LABELS[f] ?? f}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Preview column */}
        <div className="lg:col-span-3">
          <div className="glass card-top-line p-6 sm:p-8">
            <p className="mb-6 text-sm font-medium text-bleu-fonce">
              Objet : {rendered(template.objet)}
            </p>
            <div
              ref={textRef}
              className="whitespace-pre-wrap text-sm leading-relaxed text-navy/90"
            >
              {rendered(template.corps)}
            </div>
          </div>

          <div className="no-print mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleCopy}
              className="btn-primary"
            >
              {copied ? '✓ Copié !' : '📋 Copier le texte'}
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="btn-ghost"
            >
              📄 Imprimer / PDF
            </button>
          </div>
        </div>
      </div>

      <div className="dashed-band mt-8 p-5 text-sm text-navy/70">
        <p>
          Ce modèle est une base de travail. Adaptez-le à votre situation.
          Pour les courriers au tribunal, un avocat peut vous aider à le
          vérifier.
        </p>
      </div>
    </section>
  );
}
