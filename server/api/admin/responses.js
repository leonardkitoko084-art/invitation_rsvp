import { adminAccessFromHeaders, sameOriginRequest } from '../../auth.js';
import { deleteResponse } from '../../guestbook.js';
import { redirectWith } from '../../http.js';
export async function POST(request) {
  const access = await adminAccessFromHeaders(request.headers);
  if (!access.ok) return new Response('Accès administrateur requis.', {
    status: access.reason === 'signed-out' ? 401 : 403
  });
  if (!sameOriginRequest(request)) return new Response('Requête non autorisée.', {
    status: 403
  });
  const form = await request.formData();
  try {
    var _form$get;
    await deleteResponse(String((_form$get = form.get('id')) !== null && _form$get !== void 0 ? _form$get : ''));
    return redirectWith(request, '/admin', {
      notice: 'La réponse a été supprimée. L’invité et son invitation sont conservés.'
    });
  } catch (error) {
    return redirectWith(request, '/admin', {
      error: error instanceof Error ? error.message : 'Impossible de supprimer la réponse.'
    });
  }
}
