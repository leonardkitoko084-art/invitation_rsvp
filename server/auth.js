import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { context } from './context.js';
import { ensureSchema } from './database.js';
const COOKIE = 'leo_rsvp_session';
const SESSION_SECONDS = 12 * 60 * 60;
const hash = value => createHash('sha256').update(value).digest('hex');
export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  return `scrypt$${salt}$${scryptSync(password, salt, 64).toString('hex')}`;
}
function verifyPassword(password) {
  const [algorithm, salt, stored] = (process.env.ADMIN_PASSWORD_HASH || '').split('$');
  if (algorithm !== 'scrypt' || !/^[a-f0-9]{32}$/.test(salt ?? '') || !/^[a-f0-9]{128}$/.test(stored ?? '') || password.length > 1000) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(stored, 'hex');
  return timingSafeEqual(candidate, expected);
}
function tokenFrom(headers) {
  const entry = (headers.get('cookie') || '').split(';').map(s => s.trim()).find(s => s.startsWith(COOKIE + '='));
  const value = entry?.slice(COOKIE.length + 1) ?? '';
  return /^[a-f0-9]{64}$/.test(value) ? value : '';
}
export async function adminAccessFromHeaders(headers) {
  if (!process.env.ADMIN_PASSWORD_HASH) return {ok:false, reason:'not-configured'};
  const token = tokenFrom(headers);
  if (!token) return {ok:false, reason:'signed-out'};
  const db = await ensureSchema();
  const session = await db.prepare('SELECT expires_at FROM admin_sessions WHERE token_hash = ?1').bind(hash(token)).first();
  if (!session || Number(session.expires_at) < Date.now()) return {ok:false, reason:'signed-out'};
  return {ok:true, identity:{email:'', fullName:'Organisateur'}};
}
export async function currentAdminAccess() { return adminAccessFromHeaders(context().request?.headers ?? new Headers()); }
export function sameOriginRequest(request) {
  const origin = request.headers.get('origin');
  return !origin || origin === new URL(request.url).origin;
}
const attempts = new Map();
function cookie(value, maxAge, request) {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return `${COOKIE}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`;
}
function redirect(path, request, setCookie) {
  return new Response(null, {status:303, headers:{Location:new URL(path, request.url).href, 'Cache-Control':'private, no-store', ...(setCookie ? {'Set-Cookie':setCookie} : {})}});
}
export async function login(request) {
  if (!sameOriginRequest(request)) return new Response('Requête non autorisée.', {status:403});
  if (!process.env.ADMIN_PASSWORD_HASH) return redirect('/admin/?error=Configurez%20le%20mot%20de%20passe%20avec%20npm%20run%20admin%3Asetup.', request);
  const now = Date.now();
  for (const [key, entry] of attempts) if (now - entry.since > 10 * 60 * 1000) attempts.delete(key);
  const key = context().clientIp || 'local';
  const entry = attempts.get(key) || {since:now, count:0};
  if (entry.count >= 8) return new Response('Trop de tentatives. Réessayez dans 10 minutes.', {status:429});
  entry.count++; attempts.set(key, entry);
  const form = await request.formData();
  if (!verifyPassword(String(form.get('password') ?? ''))) return redirect('/admin/?error=Mot%20de%20passe%20incorrect.', request);
  attempts.delete(key);
  const token = randomBytes(32).toString('hex');
  const db = await ensureSchema();
  await db.prepare('DELETE FROM admin_sessions WHERE expires_at < ?1').bind(now).run();
  await db.prepare('INSERT INTO admin_sessions (token_hash, expires_at) VALUES (?1, ?2)').bind(hash(token), now + SESSION_SECONDS * 1000).run();
  return redirect('/admin/', request, cookie(token, SESSION_SECONDS, request));
}
export async function logout(request) {
  if (!sameOriginRequest(request)) return new Response('Requête non autorisée.', {status:403});
  const token = tokenFrom(request.headers);
  if (token) { const db = await ensureSchema(); await db.prepare('DELETE FROM admin_sessions WHERE token_hash = ?1').bind(hash(token)).run(); }
  return redirect(new URL(request.url).searchParams.get('return_to') === '/' ? '/' : '/admin/', request, cookie('', 0, request));
}
