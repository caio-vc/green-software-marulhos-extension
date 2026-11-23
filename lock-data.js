const LockData = (() => {
  let defaults;

  function normalizeUnit(value) {
    return value.trim().toUpperCase();
  }

  function isValidUnit(unit) {
    return /^(?:\d{3}[A-Z]|[A-Z]{3}\d+)$/.test(unit);
  }

  async function load() {
    defaults ??= fetch(chrome.runtime.getURL('locks.json')).then((response) => {
      if (!response.ok) throw new Error('Não foi possível carregar os tipos de fechadura.');
      return response.json();
    });
    const [data, settings] = await Promise.all([
      defaults,
      chrome.storage.local.get(['showLocks', 'lockOverrides'])
    ]);
    const overrides = Object.fromEntries(
      Object.entries(settings.lockOverrides || {}).filter(
        ([unit, value]) => isValidUnit(unit) && typeof value === 'boolean'
      )
    );
    return {
      showLocks: settings.showLocks === true,
      units: {
        ...Object.fromEntries(data.approximationUnits.map((unit) => [unit, true])),
        ...overrides
      },
      overrides
    };
  }

  return { normalizeUnit, isValidUnit, load };
})();
