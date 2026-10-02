import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { requestContext } from './server/context.js';
import { documentHtml } from './server/document.js';
import { ensureSchema } from './server/database.js';
import { login, logout } from './server/auth.js';
import Invitation from './server/views/invitation.js';
import Privacy from './server/views/privacy.js';
import Dashboard from './server/views/admin-dashboard.js';
import Guests from './server/views/admin-guests.js';
import Tables from './server/views/admin-tables.js';
import Checkin from './server/views/admin-checkin.js';
import * as rsvp from './server/api/rsvp.js';
import * as calendar from './server/api/calendar.js';
import * as guestsApi from './server/api/admin/guests.js';
import * as tablesApi from './server/api/admin/tables.js';
import * as responsesApi from './server/api/admin/responses.js';
import * as checkinApi from './server/api/admin/checkin.js';
import * as exportApi from './server/api/admin/export.js';
const root = fileURLToPath(new URL('./', import.meta.url));
try { process.loadEnvFile(resolve(root, '.env')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
const routes = new Map([
  ['/api/rsvp', rsvp], ['/api/calendar', calendar], ['/api/admin/guests', guestsApi],
  ['/api/admin/tables', tablesApi], ['/api/admin/responses', responsesApi],
  ['/api/admin/checkin', checkinApi], ['/api/admin/export', exportApi],
  ['/api/admin/login', {POST:login}], ['/logout', {POST:logout, GET:logout}]
]);
const adminPages = new Map([
  ['/admin', Dashboard], ['/admin/', Dashboard], ['/admin/index.html', Dashboard],
  ['/admin/guests', Guests], ['/admin/guests.html', Guests],
  ['/admin/tables', Tables], ['/admin/tables.html', Tables],
  ['/admin/checkin', Checkin], ['/admin/checkin.html', Checkin]
]);
const mime = {'.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.otf':'font/otf','.ttf':'font/ttf','.txt':'text/plain; charset=utf-8','.ics':'text/calendar; charset=utf-8'};
function originFor(incoming, server) {
  if (process.env.PUBLIC_URL?.trim()) {
    const configured = new URL(process.env.PUBLIC_URL.trim());
    if (!['http:','https:'].includes(configured.protocol) || configured.pathname !== '/' || configured.username || configured.password) throw new Error('PUBLIC_URL doit être une origine HTTP(S), sans sous-dossier.');
    return configured.origin;
  }
  const host = incoming.headers.host || `localhost:${server.address().port}`;
  const parsed = new URL('http://' + host);
  if (!['localhost','127.0.0.1','[::1]','terminal.local'].includes(parsed.hostname) || parsed.username || parsed.password) {
    const error = new Error('Pour un hébergement distant, configurez PUBLIC_URL.'); error.status = 400; throw error;
  }
  return parsed.origin;
}
async function webRequest(incoming, origin) {
  if (!incoming.url?.startsWith('/') || incoming.url.startsWith('//')) throw new Error('Adresse invalide.');
  const method = incoming.method || 'GET';
  let body;
  if (!['GET','HEAD'].includes(method)) {
    const chunks = []; let length = 0;
    for await (const chunk of incoming) {
      length += chunk.length;
      if (length > 512 * 1024) { const error = new Error('Formulaire trop volumineux.'); error.status = 413; throw error; }
      chunks.push(chunk);
    }
    body = Buffer.concat(chunks);
  }
  return new Request(new URL(incoming.url, origin), {method, headers:incoming.headers, ...(body ? {body} : {})});
}
const htmlResponse = body => new Response(body, {headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'private, no-store'}});
async function dispatch(request) {
  const url = new URL(request.url);
  const path = decodeURIComponent(url.pathname);
  const method = request.method === 'HEAD' ? 'GET' : request.method;
  const api = routes.get(path);
  if (api) return api[method] ? api[method](request) : new Response('Méthode non autorisée.', {status:405, headers:{Allow:Object.keys(api).join(', ')}});
  if (method !== 'GET') return new Response('Méthode non autorisée.', {status:405});
  const params = Promise.resolve(Object.fromEntries(url.searchParams));
  if (path === '/' || path === '/index.html') return htmlResponse(documentHtml(await Invitation({searchParams:params}), {relative:true}));
  if (path === '/privacy' || path === '/privacy.html') return htmlResponse(documentHtml(Privacy(), {relative:true}));
  if (adminPages.has(path)) {
    let body = documentHtml(await adminPages.get(path)({searchParams:params}), {admin:true});
    if (url.searchParams.has('error') && body.includes('class="auth-card"')) {
      const {escapeHtml} = await import('./server/html.js');
      body = body.replace('<h1>Espace organisateur</h1>', `<h1>Espace organisateur</h1><p class="alert error" role="alert">${escapeHtml(url.searchParams.get('error'))}</p>`);
    }
    return htmlResponse(body);
  }
  if (path === '/mariage.ics') return calendar.GET();
  const publicFile = /^\/(?:photos|fonts|assets)\/[a-zA-Z0-9_./-]+$/.test(path) || ['/styles.css','/admin.css','/script.js','/favicon.svg'].includes(path);
  if (!publicFile) return new Response('Page introuvable.', {status:404});
  const file = resolve(root, '.' + path);
  if (!file.startsWith(root) || path.split('/').some(part => part.startsWith('.') || !part && path.includes('//'))) return new Response('Page introuvable.', {status:404});
  try {
    if (!(await stat(file)).isFile()) return new Response('Page introuvable.', {status:404});
    return new Response(await readFile(file), {headers:{'Content-Type':mime[extname(file)] || 'application/octet-stream','Cache-Control':'public, max-age=3600'}});
  } catch (error) { if (error.code === 'ENOENT') return new Response('Page introuvable.', {status:404}); throw error; }
}
export async function startServer({host = process.env.HOST || '127.0.0.1', port = Number(process.env.PORT || 5173)} = {}) {
  await ensureSchema();
  const server = http.createServer(async (incoming, outgoing) => {
    try {
      const origin = originFor(incoming, server);
      const request = await webRequest(incoming, origin);
      const response = await requestContext.run({request, origin, clientIp:incoming.socket.remoteAddress}, () => dispatch(request));
      outgoing.statusCode = response.status;
      for (const [name, value] of response.headers) outgoing.setHeader(name, value);
      outgoing.setHeader('X-Content-Type-Options', 'nosniff');
      outgoing.setHeader('Referrer-Policy', 'no-referrer');
      if (!outgoing.hasHeader('Cache-Control')) outgoing.setHeader('Cache-Control', 'private, no-store');
      if (incoming.method === 'HEAD') outgoing.end(); else outgoing.end(Buffer.from(await response.arrayBuffer()));
    } catch (error) {
      outgoing.statusCode = error.status || 500;
      outgoing.setHeader('Content-Type','application/json; charset=utf-8');
      outgoing.setHeader('Cache-Control','no-store');
      outgoing.end(JSON.stringify({ok:false,message:error.status ? error.message : 'Le serveur ne peut pas traiter cette demande. Réessayez.'}));
      if (!error.status) console.error('Erreur serveur :', error.message);
    }
  });
  await new Promise((resolvePromise, reject) => { server.once('error', reject); server.listen(port, host, resolvePromise); });
  return server;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  const option = name => { const index = args.indexOf(name); return index >= 0 ? args[index + 1] : undefined; };
  const server = await startServer({
    host:option('--host') || process.env.HOST || '127.0.0.1',
    port:Number(option('--port') || process.env.PORT || 5173)
  });
  console.log(`Invitation : http://localhost:${server.address().port}`);
  console.log(`Administration : http://localhost:${server.address().port}/admin/`);
  if (!process.env.ADMIN_PASSWORD_HASH) console.log('Pour activer l’administration : npm run admin:setup, puis relancez le serveur.');
  function stop() { server.close(() => process.exit(0)); }
  process.on('SIGINT', stop); process.on('SIGTERM', stop);
}
