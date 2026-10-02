import { ensureSchema } from './database.js';
import { cleanText, normalizePhone, randomHex } from './text.js';
export async function getInvitationByToken(token) {
  if (!token || !/^[a-f0-9]{64}$/i.test(token)) return null;
  const db = await ensureSchema();
  const row = await db.prepare(`SELECT g.id, g.name, g.phone, g.party_size, g.token, g.created_at, t.name AS table_name
       FROM guests g
       JOIN wedding_tables t ON t.id = g.table_id
       WHERE g.token = ?1
       LIMIT 1`).bind(token.toLowerCase()).first();
  return row ? {
    id: row.id,
    name: row.name,
    table: row.table_name,
    phone: row.phone,
    partySize: Number(row.party_size || 1),
    token: row.token,
    createdAt: row.created_at
  } : null;
}
export async function listTables() {
  var _result$results;
  const db = await ensureSchema();
  const result = await db.prepare('SELECT id, name, created_at FROM wedding_tables ORDER BY name COLLATE NOCASE').all();
  return (_result$results = result.results) !== null && _result$results !== void 0 ? _result$results : [];
}
export async function listGuests() {
  var _result$results2;
  const db = await ensureSchema();
  const result = await db.prepare(`SELECT g.id, g.name, g.phone, g.party_size, g.table_id, g.token, g.created_at, g.checked_in_at, t.name AS table_name
       FROM guests g
       LEFT JOIN wedding_tables t ON t.id = g.table_id
       ORDER BY g.created_at DESC`).all();
  return (_result$results2 = result.results) !== null && _result$results2 !== void 0 ? _result$results2 : [];
}
export async function listResponses() {
  var _result$results3;
  const db = await ensureSchema();
  const result = await db.prepare(`SELECT r.id, r.invitation_id, r.public_key, r.full_name,
              COALESCE(t.name, r.table_name_snapshot, '') AS table_name,
              r.phone, r.backup_phone, r.email, r.attending, r.additional_guests, r.guest_names,
              r.drink_preference, r.song_suggestion, r.message, r.created_at, r.updated_at
       FROM rsvps r
       LEFT JOIN guests g ON g.id = r.invitation_id
       LEFT JOIN wedding_tables t ON t.id = g.table_id
       ORDER BY r.updated_at DESC`).all();
  return (_result$results3 = result.results) !== null && _result$results3 !== void 0 ? _result$results3 : [];
}
export async function addTables(rawNames) {
  const names = rawNames.split(/\r?\n/u).map(name => cleanText(name, 60)).filter(Boolean);
  if (!names.length) throw new Error('Indiquez au moins une table.');
  if (names.length > 200) throw new Error('Ajoutez au maximum 200 tables à la fois.');
  const db = await ensureSchema();
  let added = 0;
  for (const name of names) {
    const exists = await db.prepare('SELECT id FROM wedding_tables WHERE name = ?1 COLLATE NOCASE').bind(name).first();
    if (exists) continue;
    await db.prepare('INSERT INTO wedding_tables (id, name, created_at) VALUES (?1, ?2, ?3)').bind(`T${randomHex(8)}`, name, new Date().toISOString()).run();
    added += 1;
  }
  if (!added) throw new Error('Toutes ces tables sont déjà enregistrées.');
  return added;
}
export async function renameTable(idRaw, nameRaw) {
  const id = cleanText(idRaw, 40);
  const name = cleanText(nameRaw, 60);
  if (!id || !name) throw new Error('Table ou nom invalide.');
  const db = await ensureSchema();
  const duplicate = await db.prepare('SELECT id FROM wedding_tables WHERE name = ?1 COLLATE NOCASE AND id <> ?2').bind(name, id).first();
  if (duplicate) throw new Error('Ce nom de table existe déjà.');
  const result = await db.prepare('UPDATE wedding_tables SET name = ?1 WHERE id = ?2').bind(name, id).run();
  if (!result.meta.changes) throw new Error('Table introuvable.');
}
export async function deleteTable(idRaw) {
  const id = cleanText(idRaw, 40);
  const db = await ensureSchema();
  const guest = await db.prepare('SELECT id FROM guests WHERE table_id = ?1 LIMIT 1').bind(id).first();
  if (guest) throw new Error('Cette table contient encore des invités. Affectez-les ailleurs avant de la supprimer.');
  const result = await db.prepare('DELETE FROM wedding_tables WHERE id = ?1').bind(id).run();
  if (!result.meta.changes) throw new Error('Table introuvable.');
}
async function requireTable(tableId) {
  const db = await ensureSchema();
  const table = await db.prepare('SELECT id FROM wedding_tables WHERE id = ?1').bind(tableId).first();
  if (!table) throw new Error('Choisissez une table enregistrée.');
}
export async function saveGuest(input) {
  var _input$id, _input$name, _input$phone, _input$partySize, _input$tableId;
  const id = cleanText((_input$id = input.id) !== null && _input$id !== void 0 ? _input$id : '', 40);
  const name = cleanText((_input$name = input.name) !== null && _input$name !== void 0 ? _input$name : '', 100);
  const phone = normalizePhone((_input$phone = input.phone) !== null && _input$phone !== void 0 ? _input$phone : '');
  const partySize = Math.min(20, Math.max(1, Number.parseInt(String((_input$partySize = input.partySize) !== null && _input$partySize !== void 0 ? _input$partySize : '1'), 10) || 1));
  const tableId = cleanText((_input$tableId = input.tableId) !== null && _input$tableId !== void 0 ? _input$tableId : '', 40);
  if (!name) throw new Error('Indiquez le nom de l’invité.');
  if (!tableId) throw new Error('Sélectionnez une table.');
  await requireTable(tableId);
  const db = await ensureSchema();
  if (id) {
    const existing = await db.prepare('SELECT token FROM guests WHERE id = ?1').bind(id).first();
    if (!existing) throw new Error('Invité introuvable.');
    await db.prepare('UPDATE guests SET name = ?1, phone = ?2, party_size = ?3, table_id = ?4 WHERE id = ?5').bind(name, phone, partySize, tableId, id).run();
    return id;
  }
  const guestId = randomHex(8).toUpperCase();
  await db.prepare('INSERT INTO guests (id, name, phone, party_size, table_id, token, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)').bind(guestId, name, phone, partySize, tableId, randomHex(32), new Date().toISOString()).run();
  return guestId;
}
export async function bulkAddGuests(rawGuests, tableIdRaw, partySizeRaw) {
  const tableId = cleanText(tableIdRaw, 40);
  const partySize = Math.min(20, Math.max(1, Number.parseInt(cleanText(partySizeRaw, 3) || '1', 10) || 1));
  if (!tableId) throw new Error('Sélectionnez une table.');
  await requireTable(tableId);
  const lines = rawGuests.split(/\r?\n/u).filter(line => line.trim());
  if (!lines.length) throw new Error('Ajoutez au moins un invité.');
  if (lines.length > 200) throw new Error('Ajoutez au maximum 200 invités à la fois.');
  const db = await ensureSchema();
  let added = 0;
  for (const line of lines) {
    var _parts$;
    const parts = line.split(';');
    if (parts.length > 2) throw new Error('Format attendu : Nom ; Téléphone (facultatif), un invité par ligne.');
    const name = cleanText(parts[0], 100);
    const phone = normalizePhone((_parts$ = parts[1]) !== null && _parts$ !== void 0 ? _parts$ : '');
    if (!name) throw new Error('Chaque invité doit avoir un nom.');
    const duplicate = await db.prepare('SELECT id FROM guests WHERE name = ?1 AND phone = ?2 LIMIT 1').bind(name, phone).first();
    if (duplicate) continue;
    await db.prepare('INSERT INTO guests (id, name, phone, party_size, table_id, token, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)').bind(randomHex(8).toUpperCase(), name, phone, partySize, tableId, randomHex(32), new Date().toISOString()).run();
    added += 1;
  }
  if (!added) throw new Error('Aucun nouvel invité à ajouter. Vérifiez les doublons.');
  return added;
}
export async function assignGuest(idRaw, tableIdRaw) {
  const id = cleanText(idRaw, 40);
  const tableId = cleanText(tableIdRaw, 40);
  if (!id || !tableId) throw new Error('Invité ou table invalide.');
  await requireTable(tableId);
  const db = await ensureSchema();
  const result = await db.prepare('UPDATE guests SET table_id = ?1 WHERE id = ?2').bind(tableId, id).run();
  if (!result.meta.changes) throw new Error('Invité introuvable.');
}
export async function deleteGuest(idRaw) {
  const id = cleanText(idRaw, 40);
  if (!id) throw new Error('Invité invalide.');
  const db = await ensureSchema();
  await db.batch([db.prepare('DELETE FROM rsvps WHERE invitation_id = ?1').bind(id), db.prepare('DELETE FROM guests WHERE id = ?1').bind(id)]);
}
export async function deleteResponse(idRaw) {
  const id = cleanText(idRaw, 40);
  const db = await ensureSchema();
  const result = await db.prepare('DELETE FROM rsvps WHERE id = ?1').bind(id).run();
  if (!result.meta.changes) throw new Error('Réponse introuvable.');
}
export async function checkInGuest(tokenRaw) {
  var _current$checked_in_a;
  let token = cleanText(tokenRaw, 500);
  try {
    var _URL$searchParams$get;
    token = (_URL$searchParams$get = new URL(token).searchParams.get('invitation')) !== null && _URL$searchParams$get !== void 0 ? _URL$searchParams$get : token;
  } catch {
    // The scanner may provide the token directly.
  }
  token = cleanText(token, 64).toLowerCase();
  if (!/^[a-f0-9]{64}$/i.test(token)) throw new Error('QR Code invalide ou invitation introuvable.');
  const db = await ensureSchema();
  const guest = await db.prepare(`SELECT g.id, g.name, g.checked_in_at, t.name AS table_name
       FROM guests g
       JOIN wedding_tables t ON t.id = g.table_id
       WHERE g.token = ?1
       LIMIT 1`).bind(token).first();
  if (!guest) throw new Error('QR Code invalide ou invitation introuvable.');
  if (guest.checked_in_at) {
    return {
      name: guest.name,
      table: guest.table_name,
      checkedInAt: guest.checked_in_at,
      alreadyCheckedIn: true
    };
  }
  const checkedInAt = new Date().toISOString();
  const result = await db.prepare(`UPDATE guests SET checked_in_at = ?1 WHERE id = ?2 AND checked_in_at = ''`).bind(checkedInAt, guest.id).run();
  if (result.meta.changes) {
    return {
      name: guest.name,
      table: guest.table_name,
      checkedInAt,
      alreadyCheckedIn: false
    };
  }
  const current = await db.prepare('SELECT checked_in_at FROM guests WHERE id = ?1').bind(guest.id).first();
  return {
    name: guest.name,
    table: guest.table_name,
    checkedInAt: (_current$checked_in_a = current === null || current === void 0 ? void 0 : current.checked_in_at) !== null && _current$checked_in_a !== void 0 ? _current$checked_in_a : checkedInAt,
    alreadyCheckedIn: true
  };
}
