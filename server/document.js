import { siteConfig } from '../site-config.js';
import { render, escapeHtml } from './html.js';
export function documentHtml(body, {admin = false, relative = false, depth = 0} = {}) {
  let markup = render(body);
  // Chemins HTML explicites, également compatibles avec l'aperçu par double-clic.
  markup = markup.replace(/href="\/admin\/guests(?=[?#"])/g, 'href="/admin/guests.html')
    .replace(/href="\/admin\/tables(?=[?#"])/g, 'href="/admin/tables.html')
    .replace(/href="\/admin\/checkin(?=[?#"])/g, 'href="/admin/checkin.html')
    .replace(/href="\/admin(?=[?#"])/g, 'href="/admin/index.html')
    .replaceAll('href="/"', 'href="/index.html"')
    .replaceAll('href="/privacy"', 'href="/privacy.html"')
    .replaceAll('href="/api/calendar"', 'href="/mariage.ics" download');
  if (admin) markup += '<script src="/assets/js/admin-forms.js"></script>';
  const style = `--bg:${siteConfig.theme.background};--surface:${siteConfig.theme.surface};--gold:${siteConfig.theme.gold};--gold-soft:${siteConfig.theme.goldSoft};--text:${siteConfig.theme.text};--muted:${siteConfig.theme.muted}`;
  let result = `<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>${escapeHtml(admin ? 'Espace organisateur — ' + siteConfig.couple.names : siteConfig.siteTitle)}</title>\n<meta name="description" content="${escapeHtml('Invitation officielle au mariage de ' + siteConfig.couple.names + '. Confirmez votre présence en ligne.')}">\n<link rel="icon" href="/favicon.svg" type="image/svg+xml">\n<link rel="stylesheet" href="/${admin ? 'admin.css' : 'styles.css'}">\n</head>\n<body data-event-date="${escapeHtml(siteConfig.event.dateIso)}" style="${style}">\n${markup}\n</body>\n</html>\n`;
  if (relative) {
    const prefix = depth ? '../'.repeat(depth) : './';
    result = result.replace(/(href|src|action)="\/(?!\/)/g, (_, attr) => `${attr}="${prefix}`);
  }
  return result;
}
