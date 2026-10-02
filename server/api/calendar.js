import { siteConfig } from '../../site-config.js';
function escapeIcs(value) {
  return value.replace(/\\/g, '\\\\').replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\r?\n/g, '\\n');
}
function toIcsUtc(date) {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}
export async function GET() {
  const stamp = toIcsUtc(new Date());
  const events = [{
    date: siteConfig.event.ceremonyDateIso,
    venue: siteConfig.venues[0],
    description: 'Mise en place à 09h30. Bénédiction nuptiale à 10h00. Extension La Borne.'
  }, {
    date: siteConfig.event.dateIso,
    venue: siteConfig.venues[1],
    description: `Mise en place à ${siteConfig.event.arrivalTime}. Entrée des mariés à ${siteConfig.event.entryTime}. Vestimentaire : ${siteConfig.dressCode.description}`
  }];
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//LEO DESIGN//RSVP//FR', ...events.flatMap(event => ['BEGIN:VEVENT', `UID:${crypto.randomUUID()}@leo-rsvp`, `DTSTAMP:${stamp}`, `DTSTART:${toIcsUtc(new Date(event.date))}`, `SUMMARY:${escapeIcs(`${event.venue.label} — ${siteConfig.couple.names}`)}`, `DESCRIPTION:${escapeIcs(event.description)}`, `LOCATION:${escapeIcs(`${event.venue.name}, ${event.venue.address}`)}`, 'END:VEVENT']), 'END:VCALENDAR', ''].join('\r\n');
  return new Response(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="mariage.ics"',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
