export function redirectWith(request, path, values) {
  const url = new URL(path, request.url);
  for (const [key, value] of Object.entries(values)) {
    if (value) url.searchParams.set(key, value);
  }
  return Response.redirect(url, 303);
}
