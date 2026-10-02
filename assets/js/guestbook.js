(() => {
  const alert = document.querySelector('.alert');
  if (alert) {
    window.setTimeout(() => {
      alert.classList.add('dismissed');
      window.setTimeout(() => { alert.hidden = true; }, 250);
    }, 4000);
    const url = new URL(window.location.href);
    url.searchParams.delete('notice');
    url.searchParams.delete('error');
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  }

  const search = document.getElementById('directorySearch');
  if (!search) return;
  const label = document.querySelector('[data-directory-search-label]');
  const records = Array.from(document.querySelectorAll('[data-guest-search]'));
  const count = document.getElementById('directoryCount');
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('fr');
  search.addEventListener('input', () => {
    const query = normalize(search.value.trim());
    let visible = 0;
    records.forEach(record => {
      record.hidden = !normalize(record.dataset.guestSearch).includes(query);
      if (!record.hidden) visible++;
    });
    count.textContent = visible ? `${visible} invité(s) affiché(s) sur ${records.length}.` : 'Aucun invité ne correspond à cette recherche.';
  });
  label.hidden = false;
})();
