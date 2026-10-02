import { siteConfig } from '../site-config.js';

export function googleCalendarLink(phase) {
  const ceremony = phase === 'ceremony';
  const venue = siteConfig.venues[ceremony ? 0 : 1];
  const date = new Date(ceremony ? siteConfig.event.ceremonyDateIso : siteConfig.event.dateIso)
    .toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  const url = new URL('https://calendar.google.com/calendar/r/eventedit');
  url.search = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${venue.label} — ${siteConfig.couple.names}`,
    dates: `${date}/${date}`,
    ctz: siteConfig.timezone,
    location: [venue.name, venue.extension, venue.address].filter(Boolean).join(', '),
    details: ceremony
      ? 'Mise en place à 09h30. Bénédiction nuptiale à 10h00.'
      : `Mise en place à ${siteConfig.event.arrivalTime}. Entrée des mariés à ${siteConfig.event.entryTime}. Dress code : ${siteConfig.dressCode.colors.map(color => color.name).join(', ')}.`
  }).toString();
  return url.href;
}
