(() => {
  document.addEventListener('submit', (event) => {
    const form = event.target.closest?.('form');
    if (!form) return;
    const confirmation = form.getAttribute('data-confirm');
    if (confirmation && !window.confirm(confirmation || 'Confirmer cette action ?')) {
      event.preventDefault();
      return;
    }
    if (event.defaultPrevented || form.method.toLowerCase() !== 'post') return;
    form.querySelector('.form-feedback')?.remove();
    const feedback = document.createElement('p');
    feedback.className = 'form-feedback progress';
    feedback.setAttribute('role', 'status');
    feedback.textContent = 'Enregistrement en cours…';
    form.appendChild(feedback);
    const button = form.querySelector('button[type="submit"]');
    if (button) {
      button.dataset.originalText = button.textContent;
      button.textContent = 'Enregistrement…';
      button.disabled = true;
      button.setAttribute('aria-busy', 'true');
    }
    window.setTimeout(() => {
      if (!button || document.visibilityState === 'hidden') return;
      button.disabled = false;
      button.removeAttribute('aria-busy');
      button.textContent = button.dataset.originalText || 'Réessayer';
      feedback.className = 'form-feedback error';
      feedback.textContent = 'La page n’a pas répondu. Vérifiez votre connexion puis réessayez.';
    }, 12000);
  });

  document.addEventListener('invalid', (event) => {
    const field = event.target;
    const form = field.form;
    if (!form || form.querySelector('.form-feedback.error')) return;
    const feedback = document.createElement('p');
    feedback.className = 'form-feedback error';
    feedback.setAttribute('role', 'alert');
    feedback.textContent = 'Complétez les champs obligatoires indiqués avant d’enregistrer.';
    form.appendChild(feedback);
  }, true);

  document.addEventListener('input', (event) => {
    event.target.form?.querySelector('.form-feedback.error')?.remove();
  });
})();
