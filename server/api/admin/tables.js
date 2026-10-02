import { adminAccessFromHeaders, sameOriginRequest } from '../../auth.js';
import { addTables, deleteTable, renameTable } from '../../guestbook.js';
import { redirectWith } from '../../http.js';
import { cleanText } from '../../text.js';
export async function POST(request) {
  const access = await adminAccessFromHeaders(request.headers);
  if (!access.ok) return new Response('Accès administrateur requis.', {
    status: access.reason === 'signed-out' ? 401 : 403
  });
  if (!sameOriginRequest(request)) return new Response('Requête non autorisée.', {
    status: 403
  });
  const form = await request.formData();
  const action = cleanText(form.get('action'), 40);
  try {
    if (action === 'tables') {
      var _form$get;
      const added = await addTables(String((_form$get = form.get('names')) !== null && _form$get !== void 0 ? _form$get : ''));
      return redirectWith(request, '/admin/tables', {
        notice: `${added} table${added > 1 ? 's' : ''} enregistrée${added > 1 ? 's' : ''}.`
      });
    }
    if (action === 'rename_table') {
      var _form$get2, _form$get3;
      await renameTable(String((_form$get2 = form.get('id')) !== null && _form$get2 !== void 0 ? _form$get2 : ''), String((_form$get3 = form.get('name')) !== null && _form$get3 !== void 0 ? _form$get3 : ''));
      return redirectWith(request, '/admin/tables', {
        notice: 'Le nom de la table a été mis à jour.'
      });
    }
    if (action === 'delete_table') {
      var _form$get4;
      await deleteTable(String((_form$get4 = form.get('id')) !== null && _form$get4 !== void 0 ? _form$get4 : ''));
      return redirectWith(request, '/admin/tables', {
        notice: 'La table a été supprimée.'
      });
    }
    throw new Error('Action inconnue.');
  } catch (error) {
    return redirectWith(request, '/admin/tables', {
      error: error instanceof Error ? error.message : 'Impossible d’enregistrer les tables.'
    });
  }
}
