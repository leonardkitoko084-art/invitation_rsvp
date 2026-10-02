import { ensureSchema } from '../database.js';
import { getInvitationByToken } from '../guestbook.js';
import { cleanText, randomHex, sha256Hex } from '../text.js';
export const dynamic = 'force-dynamic';
function json(message, status, ok = false) {
  return Response.json({
    ok,
    message
  }, {
    status,
    headers: {
      'Cache-Control': 'no-store'
    }
  });
}
function normalizeRsvpPhone(value) {
  const phone = cleanText(value, 30);
  if (phone.replace(/\D/g, '').length < 6 || /[^0-9+() .-]/u.test(phone)) return '';
  return phone;
}
export async function POST(request) {
  var _form$get, _form$get2, _invitation$id, _invitation$table;
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) {
    return json('Requête non autorisée.', 403);
  }
  const form = await request.formData();
  if (cleanText(form.get('website'), 200)) return json('Merci.', 200, true);
  const loadedAt = Number((_form$get = form.get('loaded_at')) !== null && _form$get !== void 0 ? _form$get : 0);
  const elapsed = Date.now() - loadedAt;
  if (!Number.isFinite(loadedAt) || elapsed < 1200 || elapsed > 24 * 60 * 60 * 1000) {
    return json('Rechargez la page puis réessayez.', 429);
  }
  const invitationToken = cleanText(form.get('invitation'), 80).toLowerCase();
  const invitation = invitationToken ? await getInvitationByToken(invitationToken) : null;
  if (invitationToken && !invitation) {
    return json('Invitation invalide. Demandez votre lien aux organisateurs.', 422);
  }
  let fullName = cleanText(form.get('full_name'), 100);
  if (invitation) fullName = invitation.name;
  let phone = normalizeRsvpPhone(String((_form$get2 = form.get('phone')) !== null && _form$get2 !== void 0 ? _form$get2 : ''));
  if (invitation !== null && invitation !== void 0 && invitation.phone) phone = invitation.phone;
  const backupRaw = cleanText(form.get('backup_phone'), 30);
  const backupPhone = backupRaw ? normalizeRsvpPhone(backupRaw) : '';
  if (backupRaw && !backupPhone) return json('Vérifiez le numéro de secours.', 422);
  if (!invitation && !phone) return json('Ouvrez votre lien personnel transmis par les organisateurs pour confirmer votre présence.', 422);
  const email = cleanText(form.get('email'), 120);
  const attending = cleanText(form.get('attending'), 10);
  const consent = cleanText(form.get('consent'), 5) === '1';
  let additionalGuests = invitation ? Math.max(0, invitation.partySize - 1) : 0;
  let guestNames = cleanText(form.get('guest_names'), 300);
  let drinkPreference = cleanText(form.get('drink_preference'), 120);
  const songSuggestion = cleanText(form.get('song_suggestion'), 160);
  const message = cleanText(form.get('message'), 500);
  if (fullName.length < 2 || (!invitation && !phone) || !['yes', 'no'].includes(attending) || !consent) {
    return json('Vérifiez les champs obligatoires.', 422);
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email)) {
    return json('Adresse e-mail invalide.', 422);
  }
  if (attending === 'no') {
    additionalGuests = 0;
    guestNames = '';
    drinkPreference = '';
  } else if (!drinkPreference) {
    return json('Indiquez votre préférence de boisson.', 422);
  }
  const db = await ensureSchema();
  const phoneKey = await sha256Hex(phone.replace(/\D/g, ''));
  const rateKey = invitation ? `inv:${invitation.id}` : `phone:${phoneKey}`;
  const now = Date.now();
  const last = await db.prepare('SELECT last_submit_at FROM rate_limits WHERE key = ?1').bind(rateKey).first();
  if (last && now - Number(last.last_submit_at) < 10000) {
    return json('Envoi trop rapide. Merci de patienter quelques secondes.', 429);
  }
  await db.prepare(`INSERT INTO rate_limits (key, last_submit_at) VALUES (?1, ?2)
       ON CONFLICT(key) DO UPDATE SET last_submit_at = excluded.last_submit_at`).bind(rateKey, now).run();
  const timestamp = new Date().toISOString();
  const id = randomHex(8);
  const invitationId = (_invitation$id = invitation === null || invitation === void 0 ? void 0 : invitation.id) !== null && _invitation$id !== void 0 ? _invitation$id : null;
  const publicKey = invitation ? null : phoneKey;
  const tableName = (_invitation$table = invitation === null || invitation === void 0 ? void 0 : invitation.table) !== null && _invitation$table !== void 0 ? _invitation$table : '';
  try {
    if (invitationId) {
      await db.prepare(`INSERT INTO rsvps (
             id, invitation_id, public_key, full_name, table_name_snapshot, phone, email,
             attending, additional_guests, guest_names, drink_preference, song_suggestion, message, backup_phone, created_at, updated_at
           ) VALUES (?1, ?2, NULL, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?14, ?13, ?13)
           ON CONFLICT(invitation_id) DO UPDATE SET
             full_name = excluded.full_name,
             table_name_snapshot = excluded.table_name_snapshot,
             phone = excluded.phone,
             email = excluded.email,
             attending = excluded.attending,
             additional_guests = excluded.additional_guests,
             guest_names = excluded.guest_names,
             drink_preference = excluded.drink_preference,
             song_suggestion = excluded.song_suggestion,
             message = excluded.message,
             backup_phone = excluded.backup_phone,
             updated_at = excluded.updated_at`).bind(id, invitationId, fullName, tableName, phone, email, attending, additionalGuests, guestNames, drinkPreference, songSuggestion, message, timestamp, backupPhone).run();
    } else {
      await db.prepare(`INSERT INTO rsvps (
             id, invitation_id, public_key, full_name, table_name_snapshot, phone, email,
             attending, additional_guests, guest_names, drink_preference, song_suggestion, message, backup_phone, created_at, updated_at
           ) VALUES (?1, NULL, ?2, ?3, '', ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?13, ?12, ?12)
           ON CONFLICT(public_key) DO UPDATE SET
             full_name = excluded.full_name,
             phone = excluded.phone,
             email = excluded.email,
             attending = excluded.attending,
             additional_guests = excluded.additional_guests,
             guest_names = excluded.guest_names,
             drink_preference = excluded.drink_preference,
             song_suggestion = excluded.song_suggestion,
             message = excluded.message,
             backup_phone = excluded.backup_phone,
             updated_at = excluded.updated_at`).bind(id, publicKey, fullName, phone, email, attending, additionalGuests, guestNames, drinkPreference, songSuggestion, message, timestamp, backupPhone).run();
    }
  } catch {
    return json('Impossible d’enregistrer la réponse pour le moment.', 500);
  }
  return json(attending === 'yes' ? 'Merci ! Votre présence est confirmée.' : 'Merci de nous avoir répondu. Votre absence a bien été enregistrée.', 200, true);
}
