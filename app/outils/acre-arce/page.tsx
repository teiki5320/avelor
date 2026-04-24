'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';

// ACRE : Aide aux Créateurs et Repreneurs d'Entreprise
// Source : urssaf.fr / art. L131-6-4 CSS + décret 2019-1215
// Exonération partielle des cotisations de sécurité sociale pendant 12 mois.
// Conditions d'éligibilité (au moins l'une) :
// - Demandeur d'emploi indemnisé ou non indemnisé (inscrit depuis ≥ 6 mois dans les 18 derniers mois)
// - Bénéficiaire de l'ARE / RSA / ASS
// - 18-25 ans (ou < 30 si handicap)
// - Licencié d'une entreprise en RJ / LJ
// - Contrat d'appui au projet d'entreprise (CAPE)
// - Création en QPV
// Exonération :
// - Plafonnée à 30 852 €/an (1 PASS 2025 entier pour microEs, dégressive selon revenu pro)
// - Pour entreprises normales : exo totale cotisations (hors CSG/CRDS, retraite compl., CPF, FNAL, etc.)

// ARCE : Aide à la Reprise ou Création d'Entreprise
// Source : francetravail.fr / art. R5141-2 C. trav.
// Versement en capital de 60 % du reliquat des droits ARE
// Conditions :
// - Être bénéficiaire de l'ARE
// - Avoir obtenu l'ACRE
// - Créer ou reprendre une entreprise

const PASS_2025 = 47100;

type Statut =
  | 'demandeur-indemnise'
  | 'demandeur-6mois'
  | 'rsa-ass'
  | 'jeune-25'
  | 'licencie-rjlj'
  | 'cape'
  | 'qpv'
  | 'aucun';

function formatEuros(n: number): string {
  return Math.round(n).toLocaleString('fr-FR') + ' €';
}

export default function AcreArcePage() {
  const [statut, setStatut] = useState<Statut>('aucun');
  const [microEntreprise, setMicroEntreprise] = useState(false);
  const [aAre, setAAre] = useState(false);
  const [areReliquatMensuel, setAreReliquatMensuel] = useState(0);
  const [areMoisRestants, setAreMoisRestants] = useState(0);
  const [revenuPrevisionnel, setRevenuPrevisionnel] = useState(20000);

  const acreEligible = statut !== 'aucun';

  const exoneration = useMemo(() => {
    if (!acreEligible) return { montant: 0, detail: '' };
    if (microEntreprise) {
      // Micro : réduction dégressive sur cotisations, calcul simplifié
      // Taux forfaitaire env. 50 % des cotisations pour la première année
      const caBase = Math.max(0, revenuPrevisionnel);
      return {
        montant: Math.round(caBase * 0.11), // exo ~11 % du CA (estimation)
        detail: "Micro-entreprise : taux de cotisations divisé par 2 environ la 1re année.",
      };
    }
    // Normal : exo totale des cotisations personnelles jusqu'au plafond
    const assiette = Math.min(revenuPrevisionnel, PASS_2025);
    return {
      montant: Math.round(assiette * 0.45), // taux moyen ~45 %
      detail: `Exonération quasi totale des cotisations personnelles pendant 12 mois sur la part < 1 PASS (${formatEuros(PASS_2025)}).`,
    };
  }, [acreEligible, microEntreprise, revenuPrevisionnel]);

  const arceMontant = useMemo(() => {
    if (!aAre || !acreEligible) return 0;
    const reliquatTotal = areReliquatMensuel * areMoisRestants;
    return Math.round(reliquatTotal * 0.6);
  }, [aAre, acreEligible, areReliquatMensuel, areMoisRestants]);

  const STATUTS: { value: Statut; label: string; description: string }[] = [
    { value: 'demandeur-indemnise', label: 'Demandeur d\'emploi indemnisé (ARE)', description: 'Inscrit à France Travail, indemnisé' },
    { value: 'demandeur-6mois', label: 'Demandeur d\'emploi inscrit ≥ 6 mois', description: 'Non indemnisé mais inscrit sur les 18 derniers mois' },
    { value: 'rsa-ass', label: 'Bénéficiaire du RSA ou ASS', description: 'Ou CSS, PPA' },
    { value: 'jeune-25', label: 'Jeune de 18 à 25 ans (ou < 30 ans si handicap)', description: '' },
    { value: 'licencie-rjlj', label: 'Licencié d\'une entreprise en RJ ou LJ', description: 'Repreneur de la même entreprise' },
    { value: 'cape', label: 'Contrat d\'Appui au Projet d\'Entreprise (CAPE)', description: '' },
    { value: 'qpv', label: 'Création dans un Quartier Prioritaire de la Ville (QPV)', description: '' },
    { value: 'aucun', label: 'Aucun de ces cas', description: '' },
  ];

  return (
    <section className="mx-auto max-w-3xl px-5 py-10">
      <Link href="/outils" className="mb-6 inline-flex items-center gap-2 text-sm text-navy/60 hover:text-navy">
        ← Tous les outils
      </Link>

      <h1 className="font-display text-3xl text-navy sm:text-4xl">
        Vérificateur ACRE & ARCE
      </h1>
      <p className="mt-3 text-base text-navy/70">
        Deux dispositifs cumulables pour rebondir après une cessation :
        l&apos;<strong>ACRE</strong> (exonération de cotisations sociales pendant
        12 mois) et l&apos;<strong>ARCE</strong> (versement en capital de 60 % de
        l&apos;ARE restante).
      </p>

      <div className="glass mt-8 space-y-5 p-6 sm:p-8">
        <div>
          <p className="mb-2 font-display text-base text-navy">
            1️⃣ Votre situation correspond-elle à un cas d&apos;éligibilité ACRE ?
          </p>
          <div className="space-y-2">
            {STATUTS.map((s) => (
              <label
                key={s.value}
                className={`flex cursor-pointer items-start gap-2 rounded-lg border p-3 text-sm ${
                  statut === s.value ? 'border-bleu bg-bleu/5' : 'border-navy/10 bg-white/60'
                }`}
              >
                <input
                  type="radio"
                  name="statut"
                  value={s.value}
                  checked={statut === s.value}
                  onChange={() => setStatut(s.value)}
                  className="mt-0.5"
                />
                <div>
                  <p className="font-medium text-navy">{s.label}</p>
                  {s.description && (
                    <p className="mt-0.5 text-[11px] text-navy/55">{s.description}</p>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        <label className="block text-sm text-navy">
          <input
            type="checkbox"
            checked={microEntreprise}
            onChange={(e) => setMicroEntreprise(e.target.checked)}
            className="mr-2 h-4 w-4"
          />
          Je crée en micro-entreprise (auto-entrepreneur)
        </label>

        <label className="block text-sm text-navy">
          Revenu prévisionnel de la 1re année (€)
          <input
            type="number"
            min={0}
            value={revenuPrevisionnel}
            onChange={(e) => setRevenuPrevisionnel(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2"
          />
        </label>

        <div className="border-t border-navy/10 pt-4">
          <p className="mb-2 font-display text-base text-navy">
            2️⃣ Êtes-vous bénéficiaire de l&apos;ARE (pour l&apos;ARCE) ?
          </p>
          <label className="block text-sm text-navy">
            <input
              type="checkbox"
              checked={aAre}
              onChange={(e) => setAAre(e.target.checked)}
              className="mr-2 h-4 w-4"
            />
            Oui, je perçois ou je vais percevoir l&apos;ARE (allocation de retour à l&apos;emploi)
          </label>

          {aAre && (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="block text-sm text-navy">
                Montant mensuel ARE (€)
                <input
                  type="number"
                  min={0}
                  value={areReliquatMensuel}
                  onChange={(e) => setAreReliquatMensuel(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2"
                />
              </label>
              <label className="block text-sm text-navy">
                Mois de droits restants
                <input
                  type="number"
                  min={0}
                  value={areMoisRestants}
                  onChange={(e) => setAreMoisRestants(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2"
                />
              </label>
            </div>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div
            className={`rounded-2xl border p-5 ${
              acreEligible ? 'border-vert/30 bg-vert/10' : 'border-navy/10 bg-white/60'
            }`}
          >
            <p className="font-display text-lg text-navy">
              ACRE — {acreEligible ? 'éligible ✓' : 'non éligible'}
            </p>
            {acreEligible ? (
              <>
                <p className="mt-2 text-sm text-navy/80">{exoneration.detail}</p>
                <p className="mt-3 text-2xl font-display text-vert">
                  ~ {formatEuros(exoneration.montant)} économisés
                </p>
                <p className="mt-1 text-[11px] text-navy/55">
                  Estimation sur 12 mois. Le montant exact dépend du statut juridique et du revenu réel.
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm text-navy/70">
                Aucun critère d&apos;éligibilité rempli pour l&apos;ACRE.
              </p>
            )}
          </div>

          <div
            className={`rounded-2xl border p-5 ${
              aAre && acreEligible ? 'border-vert/30 bg-vert/10' : 'border-navy/10 bg-white/60'
            }`}
          >
            <p className="font-display text-lg text-navy">
              ARCE — {aAre && acreEligible ? 'éligible ✓' : 'non éligible'}
            </p>
            {aAre && acreEligible ? (
              <>
                <p className="mt-2 text-sm text-navy/80">
                  60 % du reliquat ARE versé en capital (2 tranches : 50 % à la création + 50 % 6 mois après).
                </p>
                <p className="mt-3 text-2xl font-display text-vert">
                  ~ {formatEuros(arceMontant)}
                </p>
                <p className="mt-1 text-[11px] text-navy/55">
                  En contrepartie, l&apos;ARE mensuelle est interrompue.
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm text-navy/70">
                L&apos;ARCE suppose l&apos;ACRE et le bénéfice de l&apos;ARE.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-navy/10 bg-white/60 p-5 text-sm text-navy/75">
        <p className="font-display text-base text-navy">Démarches</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          <li>
            <strong>ACRE</strong> : demande automatique pour les
            micro-entrepreneurs via formulaire URSSAF ; pour les autres,
            demande à l&apos;URSSAF dans les 45 jours suivant la création.
            <a href="https://www.urssaf.fr/portail/home/utile-et-pratique/aide-aux-createurs-dentreprise.html" target="_blank" rel="noreferrer" className="ml-1 text-bleu-fonce underline">urssaf.fr</a>
          </li>
          <li>
            <strong>ARCE</strong> : demande à France Travail avec
            justificatif de création et attestation d&apos;ACRE.
            <a href="https://www.francetravail.fr" target="_blank" rel="noreferrer" className="ml-1 text-bleu-fonce underline">francetravail.fr</a>
          </li>
          <li>
            <strong>Alternative</strong> à l&apos;ARCE : maintien de l&apos;ARE
            cumulée avec les revenus d&apos;activité (souvent plus avantageux sur la durée).
          </li>
        </ul>
      </div>

      <p className="mt-6 text-xs text-navy/50">
        Sources : Code de la Sécurité sociale art. L131-6-4 ; décret
        n°2019-1215 (ACRE) ; Code du travail art. R5141-2 (ARCE) ;
        urssaf.fr et francetravail.fr. PASS 2025 : 47 100 €.
      </p>
    </section>
  );
}
