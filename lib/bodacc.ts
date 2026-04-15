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

export function computeAlertes(
  bodacc: BodaccItem[],
  infogreffe: BodaccItem[],
  situation: string
): AlerteSignal[] {
  const alertes: AlerteSignal[] = [];

  if (infogreffe.length > 0 || situation === 'redressement' || situation === 'assignation') {
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

  const recent = bodacc.find((b) => {
    if (!b.date) return false;
    const d = new Date(b.date);
    const now = new Date();
    const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
    return diff < 180;
  });

  if (recent) {
    alertes.push({
      niveau: 'jaune',
      titre: 'Annonce récente au BODACC',
      message: `${recent.type} publiée le ${recent.date}. Vérifiez qu'elle reflète votre situation actuelle.`,
      source: 'Bodacc',
    });
  } else {
    alertes.push({
      niveau: 'jaune',
      titre: 'Pas d\'annonce récente',
      message: 'Aucune annonce récente au BODACC — c\'est plutôt bon signe.',
      source: 'Bodacc',
    });
  }

  alertes.push({
    niveau: 'vert',
    titre: 'Vous avez fait le premier pas',
    message:
      'Le simple fait de vous informer aujourd\'hui change la trajectoire. 70 % des dirigeants qui agissent tôt redressent leur entreprise.',
    source: 'APESA · CCI France',
  });

  return alertes.slice(0, 3);
}
