(() => {
  const badgeClass = 'marulhos-lock-badge';
  let settings = { showLocks: false, units: {} };
  let pending;
  let revision = 0;

  function normalize(text) {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim().toUpperCase();
  }

  function findUnit(label) {
    // Procura a unidade no bloco da reserva, sem usar números de hóspedes ou de reservas.
    for (let block = label.parentElement; block && block !== document.body; block = block.parentElement) {
      const units = new Set();
      for (const field of block.querySelectorAll('select, input, #s2id_locacao_unidade .select2-chosen')) {
        if (field.matches('input') && !/unidade|apartamento|\buh\b/i.test(
          `${field.id} ${field.name} ${field.getAttribute('aria-label') || ''}`
        )) continue;
        const values = field.matches('select')
          ? [field.selectedOptions[0]?.textContent || '', field.value]
          : [field.matches('input') ? field.value : field.textContent];
        const unit = values.map(LockData.normalizeUnit).find(LockData.isValidUnit);
        if (unit) units.add(unit);
      }
      if (units.size === 1) return [...units][0];
      if (units.size > 1) return null;
    }
    return null;
  }

  function render() {
    const active = new Set();
    if (settings.showLocks) {
      const labels = document.querySelectorAll('label, strong, b, span, div, p, small');
      for (const label of labels) {
        if (normalize(label.textContent).replace(/:$/, '').trim() !== 'CHAVES PERMITIDAS') continue;
        if ([...label.children].some((child) =>
          normalize(child.textContent).replace(/:$/, '').trim() === 'CHAVES PERMITIDAS'
        )) continue;
        const unit = findUnit(label);
        if (!unit) continue;
        let badge = label.nextElementSibling;
        if (!badge?.classList.contains(badgeClass)) {
          badge = document.createElement('span');
          badge.className = badgeClass;
          badge.setAttribute('role', 'status');
          label.after(badge);
        }
        const approximation = settings.units[unit] === true;
        const text = approximation ? 'APROXIMAR' : 'INSERIR';
        if (badge.textContent !== text) badge.textContent = text;
        const type = approximation ? 'approximation' : 'insertion';
        if (badge.dataset.type !== type) badge.dataset.type = type;
        const title = `Fechadura da unidade ${unit}: ${text.toLowerCase()}`;
        if (badge.title !== title) badge.title = title;
        active.add(badge);
      }
    }
    for (const badge of document.querySelectorAll(`.${badgeClass}`)) {
      if (!active.has(badge)) badge.remove();
    }
  }

  function scheduleRender() {
    if (pending) return;
    pending = setTimeout(() => {
      pending = null;
      render();
    }, 80);
  }

  async function loadSettings() {
    const current = ++revision;
    try {
      const loaded = await LockData.load();
      if (current !== revision) return;
      settings = loaded;
    } catch (error) {
      if (current !== revision) return;
      settings = { showLocks: false, units: {} };
      console.warn('Marulhos: não foi possível carregar as fechaduras.', error);
    }
    scheduleRender();
  }

  new MutationObserver(scheduleRender).observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['value', 'selected']
  });
  document.addEventListener('change', scheduleRender);
  document.addEventListener('input', scheduleRender);
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && (changes.showLocks || changes.lockOverrides)) loadSettings();
  });
  loadSettings();
})();
