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

  async function saveUnit(included) {
    const unit = LockData.normalizeUnit(get('lockUnit').value);
    if (!LockData.isValidUnit(unit)) {
      get('lockStatus').textContent = 'Informe a unidade no formato 306A ou BGL01.';
      return;
    }
    get('lockFields').disabled = true;
    try {
      const current = await LockData.load();
      const overrides = { ...current.overrides, [unit]: included };
      await chrome.storage.local.set({ lockOverrides: overrides });
      settings = { ...current, units: { ...current.units, [unit]: included }, overrides };
      get('lockUnit').value = '';
      showUnits();
      get('lockStatus').textContent = included
        ? `${unit} adicionada à lista de Aproximar.`
        : `${unit} removida da lista.`;
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
      saveUnit(true);
    });
    get('removeLock').addEventListener('click', () => saveUnit(false));
    get('lockUnit').addEventListener('input', () => {
      get('lockStatus').textContent = '';
    });
  }

  init();
})();
