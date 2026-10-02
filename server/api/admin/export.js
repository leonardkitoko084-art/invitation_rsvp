import { adminAccessFromHeaders } from '../../auth.js';
import { listResponses } from '../../guestbook.js';
import { csvCell } from '../../text.js';
export const dynamic = 'force-dynamic';
export async function GET(request) {
  const access = await adminAccessFromHeaders(request.headers);
  if (!access.ok) return new Response('Accès administrateur requis.', {
    status: access.reason === 'signed-out' ? 401 : 403
  });
  const rows = await listResponses();
  const csvRows = [['Nom', 'Téléphone', 'Email', 'Présence', 'Préférence de boisson', 'Chanson proposée', 'Message', 'Date', 'Table'], ...rows.map(row => [row.full_name, row.phone, row.backup_phone, row.email, row.attending === 'yes' ? 'Oui' : 'Non', row.drink_preference, row.song_suggestion, row.message, row.updated_at, row.table_name])];
  const content = `\uFEFF${csvRows.map(row => row.map(csvCell).join(';')).join('\r\n')}\r\n`;
  return new Response(content, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="rsvp-${new Date().toISOString().slice(0, 10)}.csv"`,
      'Cache-Control': 'private, no-store'
    }
  });
}
