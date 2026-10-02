export function cleanText(value, max) {
  return String(value !== null && value !== void 0 ? value : '').trim().replace(/\s+/gu, ' ').slice(0, max);
}
export function normalizePhone(value) {
  const raw = cleanText(value, 30);
  if (!raw) return '';
  if (/[^0-9+() .-]/u.test(raw)) {
    throw new Error('Utilisez un numéro international, par exemple +243 812 345 678.');
  }
  let phone = raw.replace(/[() .-]/g, '');
  if (phone.startsWith('00')) phone = `+${phone.slice(2)}`;
  if (!/^\+?[1-9][0-9]{7,14}$/.test(phone)) {
    throw new Error('Ajoutez l’indicatif du pays au numéro WhatsApp, par exemple +243 812 345 678.');
  }
  return `+${phone.replace(/^\+/, '')}`;
}
export function randomHex(bytes = 16) {
  const buffer = new Uint8Array(bytes);
  crypto.getRandomValues(buffer);
  return Array.from(buffer, value => value.toString(16).padStart(2, '0')).join('');
}
export async function sha256Hex(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}
export function csvCell(value) {
  const text = String(value !== null && value !== void 0 ? value : '');
  const safe = /^[\s]*[=+@-]/u.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}
