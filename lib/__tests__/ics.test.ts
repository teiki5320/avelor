import { describe, it, expect } from 'vitest';
import { buildIcs } from '../ics';
import type { IcsEvent } from '../ics';

/* ─── buildIcs ─── */

describe('buildIcs', () => {
  const evenementBasique: IcsEvent = {
    uid: 'test-uid-001',
    title: 'Déclaration cessation des paiements',
    description: 'Déposer la déclaration au tribunal de commerce',
    date: new Date('2025-03-15T10:00:00Z'),
  };

  it('génère un fichier ICS avec les balises VCALENDAR', () => {
    const ics = buildIcs([evenementBasique]);
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('END:VCALENDAR');
  });

  it('contient la version et le prodid', () => {
    const ics = buildIcs([evenementBasique]);
    expect(ics).toContain('VERSION:2.0');
    expect(ics).toContain('PRODID:-//Avelor//Rappels juridiques//FR');
  });

  it('génère un VEVENT par événement', () => {
    const ics = buildIcs([evenementBasique]);
    expect(ics).toContain('BEGIN:VEVENT');
    expect(ics).toContain('END:VEVENT');
  });

  it('contient l\'UID, le SUMMARY et la DESCRIPTION', () => {
    const ics = buildIcs([evenementBasique]);
    expect(ics).toContain('UID:test-uid-001@avelor.fr');
    expect(ics).toContain('SUMMARY:');
    expect(ics).toContain('DESCRIPTION:');
  });

  it('contient DTSTART et DTEND', () => {
    const ics = buildIcs([evenementBasique]);
    expect(ics).toContain('DTSTART:20250315T100000Z');
    expect(ics).toContain('DTEND:20250315T110000Z');
  });

  it('gère plusieurs événements', () => {
    const events: IcsEvent[] = [
      evenementBasique,
      {
        uid: 'test-uid-002',
        title: 'RDV avocat',
        description: 'Consultation initiale',
        date: new Date('2025-04-01T14:00:00Z'),
      },
    ];
    const ics = buildIcs(events);
    const veventCount = (ics.match(/BEGIN:VEVENT/g) || []).length;
    expect(veventCount).toBe(2);
  });

  it('ajoute une VALARM quand alarmHoursBefore est défini', () => {
    const eventAvecAlarme: IcsEvent = {
      ...evenementBasique,
      alarmHoursBefore: 24,
    };
    const ics = buildIcs([eventAvecAlarme]);
    expect(ics).toContain('BEGIN:VALARM');
    expect(ics).toContain('TRIGGER:-PT24H');
    expect(ics).toContain('END:VALARM');
  });

  it('n\'ajoute pas de VALARM sans alarmHoursBefore', () => {
    const ics = buildIcs([evenementBasique]);
    expect(ics).not.toContain('BEGIN:VALARM');
  });

  it('retourne un calendrier vide valide pour une liste vide', () => {
    const ics = buildIcs([]);
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('END:VCALENDAR');
    expect(ics).not.toContain('BEGIN:VEVENT');
  });

  it('échappe les caractères spéciaux dans le titre', () => {
    const event: IcsEvent = {
      uid: 'special',
      title: 'Test, avec; des\\caractères',
      description: 'Desc\navec retour',
      date: new Date('2025-01-01T00:00:00Z'),
    };
    const ics = buildIcs([event]);
    expect(ics).toContain('SUMMARY:Test\\, avec\\; des\\\\caractères');
    expect(ics).toContain('DESCRIPTION:Desc\\navec retour');
  });
});
