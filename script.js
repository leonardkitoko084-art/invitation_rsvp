(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!reducedMotion.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, {threshold: 0.08});
    document.querySelectorAll('.cover-source, .monograms, .couple-caption, blockquote, .guest-invitation, .invited-heading, .invitation-paragraph, .date-card, .program-section .gold-heading, .program-group-title, .program-venue, .program-group > .subtle-link, .program-item, .couple-seal, .photo-trio, .rsvp-card, .theme-label, .theme-title, .dress-guide, .dress-heading, .dress-description, .swatches, .welcome-signature, .qr-section, .footer').forEach(element => {
      element.classList.add('reveal');
      observer.observe(element);
    });
  }
  const form = document.getElementById('rsvpForm');
  if (!form) return;
  // L'horodatage doit correspondre à l'ouverture réelle, même dans l'export HTML.
  form.elements.namedItem('loaded_at').value = String(Date.now());
  const params = new URLSearchParams(window.location.search);
  if ((params.has('invitation') || params.has('invitee') || params.has('table')) &&
      !form.elements.namedItem('invitation').value && !document.querySelector('.invalid-invitation')) {
    const warning = document.createElement('p');
    warning.className = 'invalid-invitation';
    warning.setAttribute('role', 'alert');
    warning.textContent = 'Cette invitation ne peut pas être vérifiée dans l’aperçu HTML. Ouvrez le lien sur le serveur pour accéder à votre invitation nominative.';
    document.querySelector('.invited-heading').before(warning);
  }
  const extras = document.querySelector('.attendance-extra-fields');
  const drink = form.elements.namedItem('drink_preference');
  const phone = form.elements.namedItem('backup_phone') || form.elements.namedItem('phone');
  const validatePhone = () => {
    const value = phone.value.trim();
    phone.setCustomValidity(value && (/[^0-9+() .-]/u.test(value) || value.replace(/\D/g, '').length < 6) ? 'Indiquez un numéro de téléphone valide, par exemple +243 812 345 678.' : '');
  };
  phone.addEventListener('input', validatePhone);
  form.addEventListener('input', event => {
    event.target.removeAttribute('aria-invalid');
    document.getElementById('formStatus').textContent = '';
  });
  form.addEventListener('invalid', event => event.target.setAttribute('aria-invalid', 'true'), true);
  const syncAttendance = () => {
    const attending = form.elements.namedItem('attending').value === 'yes';
    extras.hidden = !attending;
    drink.required = attending;
  };
  form.querySelectorAll('input[name="attending"]').forEach(input => input.addEventListener('change', syncAttendance));
  syncAttendance();
  const modal = document.getElementById('successModal');
  const closeButton = modal.querySelector('[data-close-modal]');
  let restoreFocus;
  const closeModal = () => { modal.hidden = true; document.body.classList.remove('modal-open'); restoreFocus?.focus(); };
  closeButton.addEventListener('click', closeModal);
  modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', event => {
    if (modal.hidden) return;
    if (event.key === 'Escape') closeModal();
    if (event.key === 'Tab') { event.preventDefault(); closeButton.focus(); }
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    validatePhone();
    form.classList.add('was-validated');
    if (!form.reportValidity()) return;
    const status = document.getElementById('formStatus');
    const button = form.querySelector('.submit-button');
    if (window.location.protocol === 'file:') {
      status.textContent = 'Pour enregistrer votre réponse, ouvrez cette invitation depuis le serveur JavaScript (npm start).';
      return;
    }
    status.textContent = '';
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    button.textContent = 'Enregistrement en cours…';
    try {
      const res = await fetch('/api/rsvp', {method:'POST', body:new FormData(form), headers:{'Accept':'application/json'}});
      if (!res.headers.get('content-type')?.includes('application/json')) throw new Error('L’enregistrement des RSVP nécessite le serveur JavaScript. Lancez npm start, puis ouvrez http://localhost:5173.');
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.message || 'Impossible d’enregistrer votre réponse. Réessayez.');
      document.getElementById('successMessage').textContent = data.message;
      restoreFocus = button;
      modal.hidden = false;
      document.body.classList.add('modal-open');
      closeButton.focus();
      form.reset();
      form.classList.remove('was-validated');
      form.querySelectorAll('[aria-invalid]').forEach(field => field.removeAttribute('aria-invalid'));
      form.elements.namedItem('loaded_at').value = String(Date.now());
      syncAttendance();
    } catch (error) {
      status.textContent = error.message || 'Impossible d’envoyer la réponse. Réessayez.';
    } finally {
      button.disabled = false;
      button.removeAttribute('aria-busy');
      button.textContent = 'Envoyer ma réponse';
    }
  });
  const context = document.modelContext;
  if (!context?.registerTool) return;
  const lifecycle = new AbortController();
  const keys = ['full_name','backup_phone','attending','drink_preference'];
  try {
    Promise.resolve(context.registerTool({
      name: 'prepare_wedding_rsvp',
      title: 'Préparer une réponse RSVP',
      description: 'Remplit le formulaire de présence pour vérification. N’envoie pas la réponse ; la personne vérifie, accepte l’utilisation de ses informations et clique sur Envoyer ma réponse.',
      inputSchema: {type:'object',properties:{full_name:{type:'string',minLength:2,maxLength:100},backup_phone:{type:'string',minLength:6,maxLength:30},attending:{type:'string',enum:['yes','no']},drink_preference:{type:'string',maxLength:120}},required:['full_name','attending'],additionalProperties:false},
      annotations: {readOnlyHint:false,untrustedContentHint:false},
      execute(input) {
        if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Réponse invalide.');
        if (Object.keys(input).some(key => !keys.includes(key))) throw new Error('Champ non pris en charge.');
        if (typeof input.full_name !== 'string' || input.full_name.trim().length < 2 || input.full_name.length > 100 || (input.backup_phone !== undefined && (typeof input.backup_phone !== 'string' || input.backup_phone.replace(/\D/g, '').length < 6 || input.backup_phone.length > 30 || /[^0-9+() .-]/u.test(input.backup_phone))) || !['yes','no'].includes(input.attending)) throw new Error('Vérifiez le nom, le téléphone et la présence.');
        const limits = {drink_preference:120};
        for (const [key, limit] of Object.entries(limits)) if (input[key] !== undefined && (typeof input[key] !== 'string' || input[key].length > limit)) throw new Error(`Champ invalide : ${key}`);
        if (input.attending === 'yes' && !input.drink_preference?.trim()) throw new Error('Indiquez une préférence de boisson.');
        for (const key of ['full_name']) { const el = form.elements.namedItem(key); if (el.readOnly && input[key] !== el.value) throw new Error('L’identité de cette invitation est fixe.'); }
        for (const key of keys) if (input[key] !== undefined) form.elements.namedItem(key).value = input[key];
        syncAttendance();
        form.scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
        return {status:'ready_for_review',attending:input.attending,submitted:false};
      },
    }, {signal:lifecycle.signal})).catch(() => {});
    window.addEventListener('pagehide', () => lifecycle.abort(), {once:true});
  } catch {}
})();
