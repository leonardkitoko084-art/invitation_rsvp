import { adminAccessFromHeaders, sameOriginRequest } from '../../auth.js';
import { assignGuest, bulkAddGuests, deleteGuest, saveGuest } from '../../guestbook.js';
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
    if (action === 'guest') {
      var _form$get, _form$get2, _form$get3, _form$get4;
      const existingId = cleanText(form.get('id'), 40);
      const id = await saveGuest({
        id: existingId,
        name: String((_form$get = form.get('name')) !== null && _form$get !== void 0 ? _form$get : ''),
        phone: String((_form$get2 = form.get('phone')) !== null && _form$get2 !== void 0 ? _form$get2 : ''),
        partySize: String((_form$get3 = form.get('party_size')) !== null && _form$get3 !== void 0 ? _form$get3 : '1'),
        tableId: String((_form$get4 = form.get('table_id')) !== null && _form$get4 !== void 0 ? _form$get4 : '')
      });
      return redirectWith(request, '/admin/guests', existingId ? {
        notice: 'Invité mis à jour.',
        edit: id
      } : {
        notice: 'Invité enregistré.'
      });
    }
    if (action === 'bulk_guests') {
      var _form$get5, _form$get6, _form$get7;
      const added = await bulkAddGuests(String((_form$get5 = form.get('guests')) !== null && _form$get5 !== void 0 ? _form$get5 : ''), String((_form$get6 = form.get('table_id')) !== null && _form$get6 !== void 0 ? _form$get6 : ''), String((_form$get7 = form.get('party_size')) !== null && _form$get7 !== void 0 ? _form$get7 : '1'));
      return redirectWith(request, '/admin/guests', {
        notice: `${added} invité${added > 1 ? 's' : ''} enregistré${added > 1 ? 's' : ''}.`
      });
    }
    if (action === 'assign') {
      var _form$get8, _form$get9;
      await assignGuest(String((_form$get8 = form.get('id')) !== null && _form$get8 !== void 0 ? _form$get8 : ''), String((_form$get9 = form.get('table_id')) !== null && _form$get9 !== void 0 ? _form$get9 : ''));
      return redirectWith(request, '/admin/guests', {
        notice: 'Table de l’invité mise à jour.'
      });
    }
    if (action === 'delete_guest') {
      var _form$get0;
      await deleteGuest(String((_form$get0 = form.get('id')) !== null && _form$get0 !== void 0 ? _form$get0 : ''));
      return redirectWith(request, '/admin/guests', {
        notice: 'Invité et réponse RSVP supprimés.'
      });
    }
    throw new Error('Action inconnue.');
  } catch (error) {
    return redirectWith(request, '/admin/guests', {
      error: error instanceof Error ? error.message : 'Impossible d’enregistrer.'
    });
  }
}
