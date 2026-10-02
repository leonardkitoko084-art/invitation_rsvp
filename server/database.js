import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
let connection;
let adapter;
function database() {
  if (adapter) return adapter;
  const file = process.env.DATA_FILE || resolve(root, 'data/rsvp.sqlite');
  if (file !== ':memory:') mkdirSync(dirname(resolve(file)), {recursive:true});
  connection = new DatabaseSync(file);
  connection.exec('PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;');
  connection.exec('CREATE TABLE IF NOT EXISTS _migrations (name TEXT PRIMARY KEY);');
  const migrations = fileURLToPath(new URL('./migrations/', import.meta.url));
  for (const name of readdirSync(migrations).filter(n => n.endsWith('.sql')).sort()) {
    if (connection.prepare('SELECT name FROM _migrations WHERE name = ?').get(name)) continue;
    connection.exec('BEGIN IMMEDIATE');
    try {
      connection.exec(readFileSync(resolve(migrations, name), 'utf8'));
      connection.prepare('INSERT INTO _migrations (name) VALUES (?)').run(name);
      connection.exec('COMMIT');
    } catch (error) { connection.exec('ROLLBACK'); throw error; }
  }
  connection.exec(`CREATE TABLE IF NOT EXISTS admin_sessions (token_hash TEXT PRIMARY KEY, expires_at INTEGER NOT NULL);`);
  function prepare(sql, values = []) {
    const indexes = [...new Set([...sql.matchAll(/\?(\d+)/g)].map(match => Number(match[1])))];
    const converted = sql.replace(/\?(\d+)/g, (_, index) => '$p' + index);
    function execute(method) {
      const statement = connection.prepare(converted);
      if (!indexes.length) return statement[method](...values);
      const bound = Object.fromEntries(indexes.map(index => ['$p' + index, values[index - 1] ?? null]));
      return statement[method](bound);
    }
    return {
      bind(...bound) { return prepare(sql, bound); },
      async first() { return execute('get') ?? null; },
      async all() { return {results:execute('all')}; },
      async run() { const result = execute('run'); return {meta:{changes:Number(result.changes)}}; },
      runSync() { return execute('run'); }
    };
  }
  adapter = { prepare, async batch(statements) {
    connection.exec('BEGIN IMMEDIATE');
    try { const results = statements.map(statement => statement.runSync()); connection.exec('COMMIT'); return results; }
    catch (error) { connection.exec('ROLLBACK'); throw error; }
  }};
  return adapter;
}
export async function ensureSchema() { return database(); }
export function closeDatabase() { connection?.close(); adapter = undefined; connection = undefined; }
