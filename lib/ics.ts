export interface IcsEvent {
  uid: string;
  title: string;
  description: string;
  date: Date;
  /** Nombre d'heures avant la date pour déclencher le rappel. */
  alarmHoursBefore?: number;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function toIcsDate(d: Date): string {
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    'T' +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    'Z'
  );
}

function escapeText(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
}

export function buildIcs(events: IcsEvent[]): string {
  const lines: string[] = [];
  lines.push('BEGIN:VCALENDAR');
  lines.push('VERSION:2.0');
  lines.push('PRODID:-//Avelor//Rappels juridiques//FR');
  lines.push('CALSCALE:GREGORIAN');
  lines.push('METHOD:PUBLISH');

  for (const e of events) {
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${e.uid}@avelor.fr`);
    lines.push(`DTSTAMP:${toIcsDate(new Date())}`);
    lines.push(`DTSTART:${toIcsDate(e.date)}`);
    const dtEnd = new Date(e.date.getTime() + 60 * 60 * 1000);
    lines.push(`DTEND:${toIcsDate(dtEnd)}`);
    lines.push(`SUMMARY:${escapeText(e.title)}`);
    lines.push(`DESCRIPTION:${escapeText(e.description)}`);
    if (e.alarmHoursBefore && e.alarmHoursBefore > 0) {
      lines.push('BEGIN:VALARM');
      lines.push('ACTION:DISPLAY');
      lines.push(`DESCRIPTION:${escapeText(e.title)}`);
      lines.push(`TRIGGER:-PT${e.alarmHoursBefore}H`);
      lines.push('END:VALARM');
    }
    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

export function downloadIcs(events: IcsEvent[], filename = 'avelor-rappels.ics') {
  const content = buildIcs(events);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
