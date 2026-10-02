(() => {
  const toolbar = document.getElementById('tableToolbar');
  const search = document.getElementById('search');
  if (!toolbar || !search) return;
  const rows = Array.from(document.querySelectorAll('#rsvpResponses .response-record[data-attending]'));
  const filters = Array.from(document.querySelectorAll('[data-filter]'));
  const count = document.getElementById('resultCount');
  const empty = document.getElementById('noResults');
  const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('fr');
  const searchable = rows.map(row => ({row, text: normalize(row.textContent)}));
  let selected = 'all';
  const update = () => {
    const query = normalize(search.value.trim());
    let visible = 0;
    searchable.forEach(({row, text}) => {
      const matches = (selected === 'all' || row.dataset.attending === selected) && text.includes(query);
      row.hidden = !matches;
      if (matches) visible++;
    });
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === selected)));
    count.textContent = `${visible} réponse${visible !== 1 ? 's' : ''} sur ${rows.length}`;
    empty.hidden = visible !== 0 || rows.length === 0;
  };
  filters.forEach(button => button.addEventListener('click', () => {
    selected = button.dataset.filter;
    update();
  }));
  search.addEventListener('input', update);
  document.getElementById('resetFilters')?.addEventListener('click', () => {
    search.value = '';
    selected = 'all';
    update();
    search.focus();
  });
  toolbar.hidden = false;
  update();
})();
