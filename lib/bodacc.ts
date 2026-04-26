import type { AlerteSignal, BodaccItem } from './types';

const BODACC_BASE = 'https://bodacc-datadila.opendatasoft.com/api/v2';

// BODACC indexes by SIREN (9 first digits of the SIRET).
function siren(siret: string): string {
  return siret.replace(/\D/g, '').slice(0, 9);
}

function mapRecord(rec: any): BodaccItem {
  return {
    type:
      rec.familleavis_lib ??
      rec.familleavis ??
      rec.typeavis_lib ??
      rec.typeavis ??
      'Annonce',
    date: rec.dateparution ?? '',
    tribunal: rec.tribunal ?? rec.tribunal_lib ?? undefined,
    description:
      rec.listepersonnes?.personne?.[0]?.denomination ??
      rec.commercant ??
      rec.jugement ??
      rec.typeannonce_lib ??
      undefined,
  };
}

export async function fetchBodacc(siret: string): Promise<BodaccItem[]> {
  const sn = siren(siret);
  if (!sn) return [];
  const where = encodeURIComponent(`siren = "${sn}"`);
  try {
    const url = `${BODACC_BASE}/catalog/datasets/annonces-commerciales/records?where=${where}&limit=10&order_by=dateparution%20desc`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json: any = await res.json();
    const records: any[] = json?.records ?? [];
    return records.map((r) => mapRecord(r.record?.fields ?? r));
  } catch {
    return [];
  }
}

export async function fetchInfogreffeSignals(
  siret: string
): Promise<BodaccItem[]> {
  // Infogreffe public endpoint is limited; we use Bodacc judicial annonces as a proxy.
  const sn = siren(siret);
  if (!sn) return [];
  const where = encodeURIComponent(
    `siren = "${sn}" AND familleavis_lib like "procedure"`
  );
  try {
    const url = `${BODACC_BASE}/catalog/datasets/annonces-commerciales/records?where=${where}&limit=5&order_by=dateparution%20desc`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json: any = await res.json();
    const records: any[] = json?.records ?? [];
    return records.map((r) => mapRecord(r.record?.fields ?? r));
  } catch {
    return [];
  }
}

function daysSince(date: string): number | null {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  return (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24);
}

/**
 * Compare la situation déclarée par le dirigeant et les annonces BODACC/Infogreffe.
 * Une incohérence signale au dirigeant un décalage à clarifier.
 */
export function detectIncoherenceBodacc(
  bodacc: BodaccItem[],
  infogreffe: BodaccItem[],
  situation: string
): AlerteSignal | null {
  const hasProcedure = infogreffe.length > 0;

  // Cas 1 : le dirigeant dit "prévention" mais une procédure collective est publiée.
  if (situation === 'prevention' && hasProcedure) {
    return {
      niveau: 'rouge',
      titre: 'Une procédure est déjà publiée',
      message: `Une procédure apparaît au BODACC (${infogreffe[0].date}), alors que vous indiquez être en prévention. Vérifiez urgemment votre situation avec votre avocat ou le greffe — il peut s'agir d'une procédure ancienne non clôturée ou d'un décalage à lever.`,
      source: 'Bodacc · vos réponses',
    };
  }

  // Cas 2 : assignation déclarée mais rien au BODACC depuis 6 mois.
  if (situation === 'assignation') {
    const recentJuridique = bodacc.find((b) => {
      const age = daysSince(b.date);
      return age !== null && age < 180 && /procédure|jugement|assignation|redressement|liquid/i.test(b.type);
    });
    if (!recentJuridique) {
      return {
        niveau: 'jaune',
        titre: "Assignation pas encore publiée au BODACC",
        message:
          "Vous indiquez avoir reçu une assignation, mais aucune annonce récente n'apparaît au BODACC. C'est normal : la publication intervient après jugement. Préparez dès maintenant vos pièces (bilan, trésorerie, liste des créanciers).",
        source: 'Bodacc · vos réponses',
      };
    }
  }

  // Cas 3 : redressement déclaré mais rien publié.
  if (situation === 'redressement' && infogreffe.length === 0) {
    return {
      niveau: 'jaune',
      titre: "Aucune procédure publique détectée",
      message:
        "Vous indiquez être en cessation de paiements. Si la déclaration a été déposée, elle n'est pas encore publiée. Rappel : l'article L631-4 impose de déclarer dans les 45 jours.",
      source: 'Bodacc · vos réponses',
    };
  }

  // Cas 4 : BODACC ancien (> 6 mois) avec situation déclarée non critique → rappel.
  if (bodacc.length > 0 && !hasProcedure && situation !== 'assignation') {
    const mostRecent = bodacc[0];
    const age = daysSince(mostRecent.date);
    if (age !== null && age > 365) {
      return {
        niveau: 'vert',
        titre: 'Dernière annonce BODACC ancienne',
        message: `Votre dernière annonce au BODACC date de ${mostRecent.date} — plus d'un an. Rien d'alarmant côté publications publiques.`,
        source: 'Bodacc',
      };
    }
  }

  return null;
}

export function computeAlertes(
  bodacc: BodaccItem[],
  infogreffe: BodaccItem[],
  situation: string
): AlerteSignal[] {
  const alertes: AlerteSignal[] = [];

  // Priorité 1 : incohérence BODACC ↔ situation déclarée.
  const incoherence = detectIncoherenceBodacc(bodacc, infogreffe, situation);
  if (incoherence) alertes.push(incoherence);

  if (infogreffe.length > 0 || situation === 'redressement' || situation === 'assignation') {
    // Évite de doublonner si l'incohérence a déjà couvert le sujet.
    const dejaSignale = alertes.some((a) => a.titre.startsWith('Une procédure') || a.titre.startsWith('Aucune procédure'));
    if (!dejaSignale) {
      alertes.push({
        niveau: 'rouge',
        titre: 'Procédure détectée',
        message:
          infogreffe.length > 0
            ? `Une procédure collective apparaît dans les annonces publiques (${infogreffe[0].date}).`
            : 'Vos réponses indiquent une procédure en cours. Un accompagnement urgent est recommandé.',
        source: infogreffe.length ? 'Bodacc / Infogreffe' : 'Vos réponses',
      });
    }
  }

  const recent = bodacc.find((b) => {
    const age = daysSince(b.date);
    return age !== null && age < 180;
  });

  if (recent) {
    alertes.push({
      niveau: 'jaune',
      titre: 'Annonce récente au BODACC',
      message: `${recent.type} publiée le ${recent.date}. Vérifiez qu'elle reflète votre situation actuelle.`,
      source: 'Bodacc',
    });
  } else if (!alertes.some((a) => a.source.startsWith('Bodacc'))) {
    alertes.push({
      niveau: 'jaune',
      titre: "Pas d'annonce récente",
      message: "Aucune annonce récente au BODACC — c'est plutôt bon signe.",
      source: 'Bodacc',
    });
  }

  alertes.push({
    niveau: 'vert',
    titre: 'Vous avez fait le premier pas',
    message:
      "Le simple fait de vous informer aujourd'hui change la trajectoire. Les dispositifs amiables (mandat ad hoc, conciliation) aboutissent dans la grande majorité des cas quand ils sont engagés tôt — avant la cessation des paiements.",
    source: 'CIP National · CCI France',
  });

  return alertes.slice(0, 3);
}
