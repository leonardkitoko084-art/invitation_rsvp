import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import Invitation from '../server/views/invitation.js';
import Privacy from '../server/views/privacy.js';
import Dashboard from '../server/views/admin-dashboard.js';
import { documentHtml } from '../server/document.js';
import { GET as calendar } from '../server/api/calendar.js';
const root = fileURLToPath(new URL('../', import.meta.url));
writeFileSync(root + 'index.html', documentHtml(await Invitation({searchParams:Promise.resolve({})}), {relative:true}));
writeFileSync(root + 'privacy.html', documentHtml(Privacy(), {relative:true}));
mkdirSync(root + 'admin', {recursive:true});
for (const name of ['index', 'guests', 'tables', 'checkin']) {
  writeFileSync(root + `admin/${name}.html`, documentHtml(await Dashboard({searchParams:Promise.resolve({})}), {admin:true, relative:true, depth:1}));
}
writeFileSync(root + 'mariage.ics', await (await calendar()).text());
console.log('HTML et calendrier exportés. Les RSVP et l’administration nécessitent le serveur JavaScript.');
