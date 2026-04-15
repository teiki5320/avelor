import type { AlerteSignal, BodaccItem } from './types';

const BODACC_BASE = 'https://bodacc-datadila.opendatasoft.com/api/v2';

export async function fetchBodacc(siret: string): Promise<BodaccItem[]> {
  try {
    const url = `${BODACC_BASE}/catalog/datasets/annonces-commerciales/records?where=registre%20like%20%22${siret}%22&limit=10&order_by=dateparution%20desc`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json: any = await res.json();
    const records: any[] = json?.records ?? [];
    return records.map((r) => {
      const rec = r.record?.fields ?? r;
      return {
        type: rec.familleavis_lib ?? rec.familleavis ?? 'Annonce',
        date: rec.dateparution ?? '',
        tribunal: rec.tribunal ?? undefined,
        description:
          rec.listepersonnes?.personne?.[0]?.denomination ??
          rec.typeannonce_lib ??
          rec.jugement ??
          undefined,
      } as BodaccItem;
    });
  } catch {
    return [];
  }
}

export async function fetchInfogreffeSignals(siret: string): Promise<BodaccItem[]> {
  // Infogreffe public endpoint is limited; we use Bodacc's judicial category as a proxy.
  try {
    const url = `${BODACC_BASE}/catalog/datasets/annonces-commerciales/records?where=registre%20like%20%22${siret}%22%20and%20familleavis_lib%20like%20%22procedure%20collective%22&limit=5&order_by=dateparution%20desc`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json: any = await res.json();
    const records: any[] = json?.records ?? [];
    return records.map((r) => {
      const rec = r.record?.fields ?? r;
      return {
        type: rec.familleavis_lib ?? 'Procédure',
        date: rec.dateparution ?? '',
        tribunal: rec.tribunal,
        description: rec.jugement ?? rec.typeannonce_lib,
      } as BodaccItem;
    });
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
