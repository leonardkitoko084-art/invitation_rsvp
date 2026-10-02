import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { hashPassword } from '../server/auth.js';
const file = fileURLToPath(new URL('../.env', import.meta.url));
let existing = existsSync(file) ? readFileSync(file, 'utf8') : 'HOST=127.0.0.1\nPORT=5173\nPUBLIC_URL=\n';
if (/^ADMIN_PASSWORD_HASH=.+/m.test(existing)) {
  console.log('Un mot de passe est déjà configuré. Pour le remplacer, retirez la ligne ADMIN_PASSWORD_HASH de .env puis relancez cette commande.');
  process.exit(0);
}
const password = randomBytes(18).toString('base64url');
const setting = 'ADMIN_PASSWORD_HASH=' + hashPassword(password);
existing = /^ADMIN_PASSWORD_HASH=.*$/m.test(existing) ? existing.replace(/^ADMIN_PASSWORD_HASH=.*$/m, setting) : existing.trimEnd() + '\n' + setting + '\n';
writeFileSync(file, existing, {mode:0o600});
console.log('Administration configurée. Conservez ce mot de passe dans un gestionnaire de mots de passe :');
console.log(password);
console.log('Lancez npm start, puis ouvrez http://localhost:5173/admin/.');
console.log('Le fichier .env contient uniquement l’empreinte du mot de passe. Ne le publiez pas.');
