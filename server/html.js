// Petit sérialiseur HTML natif. Les textes et attributs sont toujours échappés.
export const Fragment = Symbol('fragment');
class Markup { constructor(value) { this.value = value; } }
export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}
function content(value) {
  if (value == null || typeof value === 'boolean') return '';
  if (Array.isArray(value)) return value.map(content).join('');
  return value instanceof Markup ? value.value : escapeHtml(value);
}
const names = { className:'class', htmlFor:'for', tabIndex:'tabindex', autoComplete:'autocomplete', autoFocus:'autofocus', readOnly:'readonly', maxLength:'maxlength', minLength:'minlength', inputMode:'inputmode', strokeWidth:'stroke-width', strokeLinecap:'stroke-linecap', strokeLinejoin:'stroke-linejoin', fetchPriority:'fetchpriority', playsInline:'playsinline', charSet:'charset' };
const booleans = new Set(['hidden','required','readonly','disabled','checked','selected','multiple','autofocus','muted','playsinline','defer']);
const voidTags = new Set(['img','input','br','hr','meta','link','source','area','base','col','embed','param','track','wbr']);
export function html(tag, props = {}) {
  if (tag === Fragment) return new Markup(content(props.children));
  if (typeof tag === 'function') return tag(props);
  let children = content(props.children);
  let attributes = '';
  for (let [name, value] of Object.entries(props)) {
    if (name === 'children' || name === 'key' || name.startsWith('on') || value == null) continue;
    if (name === 'defaultValue') {
      if (tag === 'textarea') { children = escapeHtml(value); continue; }
      if (tag === 'select') {
        children = children.replace(/<option([^>]*)>/g, (match, attrs) => {
          const selected = attrs.match(/value="([^"]*)"/)?.[1] === escapeHtml(value);
          return `<option${attrs}${selected ? ' selected' : ''}>`;
        });
        continue;
      }
      name = 'value';
    }
    if (name === 'style') {
      value = Object.entries(value).map(([key, val]) => {
        const property = key.startsWith('--') ? key : key.replace(/[A-Z]/g, c => '-' + c.toLowerCase());
        const unit = typeof val === 'number' && !['opacity','zIndex','fontWeight','lineHeight','flex','order'].includes(key) && val !== 0 ? 'px' : '';
        return `${property}:${val}${unit}`;
      }).join(';');
    }
    name = names[name] || name;
    if (booleans.has(name)) { if (value) attributes += ` ${name}`; }
    else attributes += ` ${name}="${escapeHtml(value)}"`;
  }
  return new Markup(`<${tag}${attributes}>${voidTags.has(tag) ? '' : children + `</${tag}>`}`);
}
export function RuntimeScript({src}) { return html('script', {src:src.endsWith('/app.js') ? '/script.js' : src}); }
export function render(value) { return content(value); }
