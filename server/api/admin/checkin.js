import { adminAccessFromHeaders, sameOriginRequest } from '../../auth.js';
import { checkInGuest } from '../../guestbook.js';
export async function POST(request) {
  const access = await adminAccessFromHeaders(request.headers);
  if (!access.ok) return Response.json({
    ok: false,
    message: 'Accès administrateur requis.'
  }, {
    status: access.reason === 'signed-out' ? 401 : 403
  });
  if (!sameOriginRequest(request)) return Response.json({
    ok: false,
    message: 'Requête non autorisée.'
  }, {
    status: 403
  });
  const form = await request.formData();
  try {
    var _form$get;
    const result = await checkInGuest(String((_form$get = form.get('token')) !== null && _form$get !== void 0 ? _form$get : ''));
    return Response.json({
      ok: true,
      already_checked_in: result.alreadyCheckedIn,
      checked_in_at: result.checkedInAt,
      name: result.name,
      table: result.table
    });
  } catch (error) {
    return Response.json({
      ok: false,
      message: error instanceof Error ? error.message : 'Invitation introuvable.'
    }, {
      status: 422
    });
  }
}
