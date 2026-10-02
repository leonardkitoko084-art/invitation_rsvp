import test, {before, after} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, readFileSync, rmSync, readdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {DatabaseSync} from 'node:sqlite';
import {hashPassword} from '../server/auth.js';
import {closeDatabase} from '../server/database.js';
import {startServer} from '../server.js';
const root = fileURLToPath(new URL('../', import.meta.url));
const temp = mkdtempSync(join(tmpdir(), 'leo-rsvp-test-'));
const previous = {file:process.env.DATA_FILE, password:process.env.ADMIN_PASSWORD_HASH, url:process.env.PUBLIC_URL};
let server, origin, cookie, guest, tableId;
before(async () => {
  process.env.DATA_FILE = join(temp, 'test.sqlite');
  process.env.ADMIN_PASSWORD_HASH = hashPassword('mot-de-passe-du-test-uniquement');
  delete process.env.PUBLIC_URL;
  server = await startServer({port:0});
  origin = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  await new Promise(resolve => server.close(resolve));
  closeDatabase();
  rmSync(temp, {recursive:true, force:true});
  for (const [key,value] of Object.entries({DATA_FILE:previous.file, ADMIN_PASSWORD_HASH:previous.password, PUBLIC_URL:previous.url})) {
    if (value === undefined) delete process.env[key]; else process.env[key] = value;
  }
});
function post(path, values, {authenticated = true, requestOrigin = origin} = {}) {
  const form = new FormData();
  for (const [key, value] of Object.entries(values)) form.set(key, String(value));
  return fetch(origin + path, {method:'POST',body:form,redirect:'manual',headers:{Origin:requestOrigin,...(authenticated && cookie ? {Cookie:cookie} : {})}});
}
function data() { return new DatabaseSync(process.env.DATA_FILE); }
test('HTML complet, ressources et calendrier ; les fichiers internes restent privés', async () => {
  const response = await fetch(origin + '/'); assert.equal(response.status,200);
  const html = await response.text();
  assert.match(html, /Grace WAKEZO/); assert.match(html, /Esther KHONDE/);
  assert.match(html, /class="invitation-paper"/);
  assert.deepEqual([...html.matchAll(/<time>(.*?)<\/time>/g)].map(m => m[1]), ['09h30','10h00','19h30','20h30']);
  assert.equal((html.match(/class="program-item"/g) || []).length,4);
  assert.doesNotMatch(html, /\[object Object\]|react\/jsx-runtime|__NEXT_DATA__/);
  for (const file of ['styles.css','script.js','fonts/NimbusSansNarrow-Regular.otf','fonts/NimbusSansNarrow-Bold.otf','fonts/Z003-MediumItalic.otf','assets/images/botanical-border.png','assets/icons/costume.png','assets/icons/robe-de-mariee.png','photos/couple-bouquet.png','photos/couple-face-a-face.png','photos/couple-complice.png']) {
    const asset = await fetch(origin + '/' + file); assert.equal(asset.status,200,file);
    assert.ok((await asset.arrayBuffer()).byteLength > 0,file);
  }
  for (const path of ['/.env','/server.js','/site-config.js','/server/database.js','/data/rsvp.sqlite','/VERSION_SOURCE.json']) assert.equal((await fetch(origin + path)).status,404,path);
  const ics = await (await fetch(origin + '/mariage.ics')).text();
  assert.equal((ics.match(/BEGIN:VEVENT/g) || []).length,2);
  assert.match(ics, /DTSTART:20261017T083000Z/); assert.match(ics, /DTSTART:20261017T183000Z/);
  assert.doesNotMatch(ics,/DTEND/);
  assert.equal((await fetch(origin + '/privacy.html')).status,200);
});
test('Administration protégée, tables, invitations nominatives et sélection de table', async () => {
  assert.notEqual((await fetch(origin + '/api/admin/export')).status,200);
  assert.equal((await post('/api/admin/tables',{action:'tables',names:'Table Test'},{authenticated:false})).status,401);
  assert.equal((await post('/api/admin/login',{password:'invalide'},{authenticated:false})).status,303);
  const login = await post('/api/admin/login',{password:'mot-de-passe-du-test-uniquement'},{authenticated:false});
  assert.equal(login.status,303);
  assert.match(login.headers.get('set-cookie'),/HttpOnly/); assert.match(login.headers.get('set-cookie'),/SameSite=Strict/);
  cookie = login.headers.get('set-cookie').split(';')[0];
  const forged = await fetch(origin + '/api/admin/export', {headers:{'oai-authenticated-user-email':'organisateur@example.com'}});
  assert.notEqual(forged.status,200);
  assert.equal((await post('/api/admin/tables',{action:'tables',names:'Table Test\nAutre Table'})).status,303);
  const db = data(); const tables = db.prepare('SELECT * FROM wedding_tables ORDER BY name').all(); assert.equal(tables.length,2);
  tableId = tables.find(t => t.name === 'Table Test').id; db.close();
  assert.equal((await post('/api/admin/guests',{action:'guest',name:'Invité Test Conversion',phone:'+243812000000',table_id:tableId,party_size:3})).status,303);
  const db2 = data(); guest = db2.prepare('SELECT * FROM guests').get(); db2.close();
  assert.equal(guest.party_size,3); assert.match(guest.token,/^[a-f0-9]{64}$/);
  const html = await (await fetch(origin + '/?invitation=' + guest.token)).text();
  assert.match(html,/Invité Test Conversion/); assert.match(html,/Invitation valable pour 3 personnes/); assert.match(html,/Votre QR code/);
  assert.match(html, /name="full_name"[^>]*readonly/);
  const invalid = await (await fetch(origin + '/?invitation=invalide&invitee=Faux')).text(); assert.match(invalid,/Cette invitation ne peut pas être vérifiée/); assert.doesNotMatch(invalid,/guest-name">Faux/);
  const edit = await (await fetch(origin + '/admin/guests.html?edit=' + guest.id,{headers:{Cookie:cookie}})).text();
  assert.ok(edit.includes(`<option value="${tableId}" selected>`));
  assert.match(edit,/wa.me\//);
  for (const path of ['/admin/index.html','/admin/tables.html','/admin/guests.html','/admin/checkin.html']) assert.equal((await fetch(origin + path,{headers:{Cookie:cookie}})).status,200,path);
  const csrf = await post('/api/admin/tables',{action:'tables',names:'Interdit'},{requestOrigin:'https://autre.example'}); assert.equal(csrf.status,403);
});
test('RSVP réellement persistés, validation, contrôle d’entrée, CSV et déconnexion', async () => {
  const values = {invitation:guest.token,loaded_at:Date.now()-2000,full_name:'Faux nom',phone:'+243812000000',email:'',attending:'yes',consent:'1',drink_preference:'Eau',song_suggestion:'Une chanson',message:'Test de conversion'};
  let response = await post('/api/rsvp',{...values,consent:''},{authenticated:false}); assert.equal(response.status,422);
  response = await post('/api/rsvp',{...values,drink_preference:''},{authenticated:false}); assert.equal(response.status,422);
  response = await post('/api/rsvp',values,{authenticated:false}); assert.equal(response.status,200); assert.equal((await response.json()).ok,true);
  let db = data(); let row = db.prepare('SELECT * FROM rsvps').get();
  assert.equal(row.full_name,guest.name); assert.equal(row.additional_guests,2); assert.equal(row.drink_preference,'Eau');
  assert.equal((await post('/api/rsvp',values,{authenticated:false})).status,429);
  db.prepare('UPDATE rate_limits SET last_submit_at=0').run(); db.close();
  response = await post('/api/rsvp',{...values,attending:'no'},{authenticated:false}); assert.equal(response.status,200);
  db=data(); row=db.prepare('SELECT * FROM rsvps').get(); assert.equal(row.attending,'no'); assert.equal(row.additional_guests,0); assert.equal(row.drink_preference,''); assert.equal(db.prepare('SELECT COUNT(*) AS n FROM rsvps').get().n,1); db.close();
  response = await post('/api/admin/checkin',{token:origin+'/?invitation='+guest.token}); assert.equal((await response.json()).already_checked_in,false);
  response = await post('/api/admin/checkin',{token:guest.token}); assert.equal((await response.json()).already_checked_in,true);
  const csv = await fetch(origin + '/api/admin/export',{headers:{Cookie:cookie}}); assert.equal(csv.status,200); assert.match(await csv.text(),/Invité Test Conversion/);
  const html = await (await fetch(origin + '/admin/',{headers:{Cookie:cookie}})).text(); assert.match(html,/Test de conversion/); assert.match(html,/Une chanson/);
  assert.equal((await post('/api/admin/responses',{id:row.id})).status,303);
  db=data(); assert.equal(db.prepare('SELECT COUNT(*) AS n FROM rsvps').get().n,0); assert.equal(db.prepare('SELECT COUNT(*) AS n FROM guests').get().n,1); db.close();
  await new Promise(resolve => server.close(resolve)); closeDatabase();
  server = await startServer({port:0}); origin = `http://127.0.0.1:${server.address().port}`;
  const restored = await (await fetch(origin + '/?invitation=' + guest.token)).text(); assert.match(restored,/Invité Test Conversion/);
  assert.equal((await post('/logout',{})).status,303);
  assert.notEqual((await fetch(origin + '/api/admin/export',{headers:{Cookie:cookie}})).status,200);
});
test('L’export contient uniquement des sources HTML, CSS et JavaScript et ouvre les liens locaux', () => {
  const html = readFileSync(join(root,'index.html'),'utf8');
  assert.match(html,/href="\.\/styles.css"/); assert.match(html,/src="\.\/script.js"/); assert.match(html,/href="\.\/privacy.html"/);
  assert.match(html,/href="https:\/\/calendar.google.com\/calendar\/r\/eventedit\?/);
  const scan = directory => readdirSync(directory,{withFileTypes:true}).flatMap(entry => entry.isDirectory() && entry.name !== 'data' ? scan(join(directory,entry.name)) : entry.isFile() ? [join(directory,entry.name)] : []);
  assert.equal(scan(root).filter(name => /\.tsx?$/.test(name)).length,0);
  const pkg = JSON.parse(readFileSync(join(root,'package.json'),'utf8')); assert.equal(Object.keys(pkg.dependencies || {}).length,0);
});

test('Invitation nominative préremplie et numéro de secours facultatif conservé séparément', async () => {
  const html = await (await fetch(origin + '/?invitation=' + guest.token)).text();
  assert.match(html, /name="full_name"[^>]*value="Invité Test Conversion"[^>]*readonly/);
  assert.match(html, /<details class="backup-phone-option">/);
  assert.doesNotMatch(html, /name="phone"/);
  assert.match(html, /name="backup_phone"/);
  const values = {invitation:guest.token, loaded_at:Date.now()-2000, full_name:'Nom falsifié', attending:'yes', consent:'1', drink_preference:'Eau'};
  let db = data(); db.prepare('UPDATE rate_limits SET last_submit_at=0').run(); db.close();
  const invalid = await post('/api/rsvp', {...values, backup_phone:'++++++'}, {authenticated:false});
  assert.equal(invalid.status, 422);
  const saved = await post('/api/rsvp', {...values, backup_phone:'+243900000000'}, {authenticated:false});
  assert.equal(saved.status, 200);
  db = data(); let row = db.prepare('SELECT * FROM rsvps WHERE invitation_id=?').get(guest.id);
  assert.equal(row.full_name, guest.name);
  assert.equal(row.phone, guest.phone);
  assert.equal(row.backup_phone, '+243900000000');
  db.prepare('UPDATE guests SET phone=? WHERE id=?').run('', guest.id);
  db.prepare('UPDATE rate_limits SET last_submit_at=0').run(); db.close();
  assert.equal((await post('/api/rsvp', values, {authenticated:false})).status, 200);
  db = data(); row = db.prepare('SELECT * FROM rsvps WHERE invitation_id=?').get(guest.id);
  assert.equal(row.phone, ''); assert.equal(row.backup_phone, ''); db.close();
});
