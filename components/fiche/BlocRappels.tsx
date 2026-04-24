'use client';
import { useState, useMemo, useEffect } from 'react';
import type { Reponses } from '@/lib/types';
import { buildIcs, downloadIcs, type IcsEvent } from '@/lib/ics';
import BlocAccordeon from './BlocAccordeon';

interface Props {
  reponses: Reponses;
}

interface Echeance {
  cle: string;
  titre: string;
  joursAvantAjd: number; // peut être négatif si futur
  description: string;
  source: string;
  baseDate: Date;
}

function addDays(d: Date, n: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + n);
  out.setHours(9, 0, 0, 0);
  return out;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function daysBetween(from: Date, to: Date): number {
  return Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}

export default function BlocRappels({ reponses }: Props) {
  const [dateCessation, setDateCessation] = useState<string>('');
  const [dateAssignation, setDateAssignation] = useState<string>('');
  const [dateMiseDemeure, setDateMiseDemeure] = useState<string>('');
  const [dateJugement, setDateJugement] = useState<string>('');

  // Tente de récupérer la date de cessation déjà saisie dans BlocCessationDecompte
  useEffect(() => {
    try {
      const stored = localStorage.getItem('avelor_cessation_date');
      if (stored) setDateCessation(stored);
    } catch {}
  }, []);

  const echeances = useMemo<Echeance[]>(() => {
    const items: Echeance[] = [];

    if (dateCessation) {
      const d = new Date(dateCessation);
      if (!isNaN(d.getTime())) {
        const jLimit = addDays(d, 45);
        items.push({
          cle: 'cessation-45j',
          titre: 'Déclaration de cessation des paiements — dernier jour',
          joursAvantAjd: daysBetween(new Date(), jLimit),
          description: "Article L631-4 du Code de commerce : obligation de déclarer dans les 45 jours à peine de sanctions (L651-2, L653-1, L654-1 et s.).",
          source: 'C. com. L631-4',
          baseDate: jLimit,
        });
        const jAlerte10 = addDays(d, 35);
        items.push({
          cle: 'cessation-alerte-10j',
          titre: 'Plus que 10 jours pour déclarer la cessation',
          joursAvantAjd: daysBetween(new Date(), jAlerte10),
          description: "Rappel anticipé : prendre RDV avec un avocat ou un mandataire immédiatement.",
          source: 'C. com. L631-4',
          baseDate: jAlerte10,
        });
      }
    }

    if (dateAssignation) {
      const d = new Date(dateAssignation);
      if (!isNaN(d.getTime())) {
        items.push({
          cle: 'audience-jour',
          titre: "Audience au tribunal — assignation",
          joursAvantAjd: daysBetween(new Date(), d),
          description: "Date de comparution indiquée sur l'assignation. Présentez-vous ou faites-vous représenter (avocat).",
          source: 'Code de procédure civile',
          baseDate: d,
        });
        const prepJ7 = addDays(d, -7);
        items.push({
          cle: 'audience-prep',
          titre: "Préparer l'audience (J-7)",
          joursAvantAjd: daysBetween(new Date(), prepJ7),
          description: "Finaliser vos pièces : bilan, trésorerie, liste des créanciers, propositions d'apurement.",
          source: 'Organisation',
          baseDate: prepJ7,
        });
      }
    }

    if (dateMiseDemeure) {
      const d = new Date(dateMiseDemeure);
      if (!isNaN(d.getTime())) {
        const limit = addDays(d, 60); // 2 mois
        items.push({
          cle: 'contestation-urssaf',
          titre: 'Contestation URSSAF — délai de 2 mois',
          joursAvantAjd: daysBetween(new Date(), limit),
          description: "Article R142-1 CSS : 2 mois pour saisir la Commission de Recours Amiable (CRA) à compter de la réception de la mise en demeure.",
          source: 'CSS R142-1',
          baseDate: limit,
        });
      }
    }

    if (dateJugement) {
      const d = new Date(dateJugement);
      if (!isNaN(d.getTime())) {
        const appelTC = addDays(d, 10);
        items.push({
          cle: 'appel-jugement',
          titre: "Appel d'un jugement du tribunal de commerce",
          joursAvantAjd: daysBetween(new Date(), appelTC),
          description: "Délai d'appel : 10 jours à compter du prononcé du jugement en matière de procédure collective (C. com. R661-3).",
          source: 'C. com. R661-3',
          baseDate: appelTC,
        });
      }
    }

    // Trier par date croissante
    items.sort((a, b) => a.baseDate.getTime() - b.baseDate.getTime());
    return items;
  }, [dateCessation, dateAssignation, dateMiseDemeure, dateJugement]);

  function exportIcs() {
    const events: IcsEvent[] = echeances.map((e) => ({
      uid: `${e.cle}-${e.baseDate.getTime()}`,
      title: e.titre,
      description: `${e.description}\n\nSource : ${e.source}\n\nGénéré par AVELOR.`,
      date: e.baseDate,
      alarmHoursBefore: 48,
    }));
    if (events.length === 0) return;
    downloadIcs(events, 'avelor-rappels.ics');
  }

  function copyGoogleLink() {
    if (echeances.length === 0) return;
    const ics = buildIcs(
      echeances.map((e) => ({
        uid: `${e.cle}-${e.baseDate.getTime()}`,
        title: e.titre,
        description: e.description,
        date: e.baseDate,
        alarmHoursBefore: 48,
      }))
    );
    navigator.clipboard?.writeText(ics).catch(() => {});
  }

  const pertinent =
    reponses.situation === 'redressement' ||
    reponses.situation === 'assignation' ||
    reponses.situation === 'tresorie' ||
    reponses.probleme === 'urssaf';

  if (!pertinent) return null;

  return (
    <BlocAccordeon
      icone="🔔"
      titre="Rappels d'échéances — export calendrier"
      soustitre={
        echeances.length > 0
          ? `${echeances.length} échéance${echeances.length > 1 ? 's' : ''} identifiée${echeances.length > 1 ? 's' : ''}`
          : "Renseignez vos dates-clés pour générer un calendrier"
      }
    >
      <p className="mb-4 text-sm text-navy/80">
        Saisissez les dates qui s&apos;appliquent à votre situation.
        Avelor calcule les échéances légales à partir des textes
        officiels et génère un fichier <strong>.ics</strong> que vous
        pouvez importer dans Google Agenda, Apple Calendrier, Outlook ou
        tout autre agenda — avec un rappel 48 h avant.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm text-navy">
          Date de cessation des paiements
          <input
            type="date"
            value={dateCessation}
            onChange={(e) => setDateCessation(e.target.value)}
            className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2 text-sm"
          />
          <span className="mt-1 block text-[10px] text-navy/55">
            Déclenche les rappels des 45 jours légaux.
          </span>
        </label>
        <label className="block text-sm text-navy">
          Date d&apos;audience (assignation reçue)
          <input
            type="date"
            value={dateAssignation}
            onChange={(e) => setDateAssignation(e.target.value)}
            className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2 text-sm"
          />
          <span className="mt-1 block text-[10px] text-navy/55">
            Date indiquée sur l&apos;assignation. Ajoute un rappel J-7.
          </span>
        </label>
        <label className="block text-sm text-navy">
          Date de mise en demeure URSSAF reçue
          <input
            type="date"
            value={dateMiseDemeure}
            onChange={(e) => setDateMiseDemeure(e.target.value)}
            className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2 text-sm"
          />
          <span className="mt-1 block text-[10px] text-navy/55">
            Pour le délai de contestation de 2 mois (CRA).
          </span>
        </label>
        <label className="block text-sm text-navy">
          Date d&apos;un jugement à contester
          <input
            type="date"
            value={dateJugement}
            onChange={(e) => setDateJugement(e.target.value)}
            className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2 text-sm"
          />
          <span className="mt-1 block text-[10px] text-navy/55">
            Délai d&apos;appel : 10 jours (C. com. R661-3).
          </span>
        </label>
      </div>

      {echeances.length > 0 && (
        <div className="mt-5 rounded-2xl border border-bleu/20 bg-bleu/5 p-4">
          <p className="font-display text-base text-navy">
            {echeances.length} rappel{echeances.length > 1 ? 's' : ''} à venir
          </p>
          <ol className="mt-3 space-y-2 text-sm">
            {echeances.map((e) => (
              <li key={e.cle} className="rounded-xl bg-white/80 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-navy">{e.titre}</p>
                    <p className="mt-0.5 text-xs text-navy/65">{e.description}</p>
                  </div>
                  <span className="shrink-0 text-xs text-navy/55 text-right">
                    <strong>{formatDate(e.baseDate)}</strong>
                    <br />
                    {e.joursAvantAjd > 0 ? `dans ${e.joursAvantAjd} j` : e.joursAvantAjd === 0 ? "aujourd'hui" : `il y a ${Math.abs(e.joursAvantAjd)} j`}
                  </span>
                </div>
                <p className="mt-1 text-[10px] text-navy/45">Source : {e.source}</p>
              </li>
            ))}
          </ol>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={exportIcs}
              className="rounded-full bg-bleu-fonce px-4 py-2 text-sm font-medium text-white hover:bg-navy"
            >
              📅 Télécharger le calendrier (.ics)
            </button>
            <button
              type="button"
              onClick={copyGoogleLink}
              className="rounded-full border border-navy/20 bg-white px-4 py-2 text-sm text-navy/80 hover:bg-white/90"
            >
              📋 Copier l&apos;ICS
            </button>
          </div>
          <p className="mt-2 text-[11px] text-navy/55">
            Importez le fichier dans Google Agenda (Paramètres → Importer)
            ou double-cliquez dessus sur Mac/Windows pour l&apos;ouvrir
            dans votre calendrier. Un rappel s&apos;activera 48 h avant
            chaque échéance.
          </p>
        </div>
      )}

      <p className="mt-5 text-xs text-navy/50">
        Les dates saisies restent uniquement dans votre navigateur.
        Aucune donnée n&apos;est envoyée. Sources légales : C. com.
        L631-4, R661-3 ; CSS R142-1.
      </p>
    </BlocAccordeon>
  );
}
