(() => {
  const get = (id) => document.getElementById(id);
  let settings;

  function showUnits() {
    const units = Object.keys(settings.units).filter((unit) => settings.units[unit]).sort();
    get('approximationUnits').textContent = units.length ? units.join(', ') : 'Nenhuma unidade.';
  }

  async function saveVisibility() {
    try {
      await chrome.storage.local.set({ showLocks: get('showLocks').checked });
      get('lockStatus').textContent = '';
    } catch {
      get('showLocks').checked = !get('showLocks').checked;
      get('lockStatus').textContent = 'Não foi possível salvar a visualização de fechadura.';
    }
  }

  async function saveUnits(included) {
    const units = [...new Set(
      get('lockUnit').value.split(',').map(LockData.normalizeUnit).filter(Boolean)
    )];
    if (!units.length) {
      get('lockStatus').textContent = 'Informe pelo menos uma unidade, como 306A ou BGL01.';
      return;
    }
    const invalid = units.filter((unit) => !LockData.isValidUnit(unit));
    if (invalid.length) {
      get('lockStatus').textContent = `Confira: ${invalid.join(', ')}. Use o formato 306A ou BGL01.`;
      return;
    }
    get('lockFields').disabled = true;
    try {
      const current = await LockData.load();
      const changes = Object.fromEntries(units.map((unit) => [unit, included]));
      const overrides = { ...current.overrides, ...changes };
      await chrome.storage.local.set({ lockOverrides: overrides });
      settings = { ...current, units: { ...current.units, ...changes }, overrides };
      get('lockUnit').value = '';
      showUnits();
      get('lockStatus').textContent = `${included ? 'Adicionadas' : 'Removidas'}: ${units.join(', ')}.`;
    } catch {
      get('lockStatus').textContent = 'Não foi possível atualizar a lista. Tente novamente.';
    } finally {
      get('lockFields').disabled = false;
    }
  }

  async function init() {
    try {
      settings = await LockData.load();
      get('showLocks').checked = settings.showLocks;
      showUnits();
      get('lockFields').disabled = false;
    } catch {
      get('lockStatus').textContent = 'Não foi possível carregar as fechaduras. Reabra a extensão para tentar novamente.';
      return;
    }
    get('showLocks').addEventListener('change', saveVisibility);
    get('lockForm').addEventListener('submit', (event) => {
      event.preventDefault();
      saveUnits(true);
    });
    get('removeLock').addEventListener('click', () => saveUnits(false));
    get('lockUnit').addEventListener('input', () => {
      get('lockStatus').textContent = '';
    });
  }

  init();
})();
