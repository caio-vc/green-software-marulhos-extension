const get = (id) => document.getElementById(id);
let sections = [];

function normalize(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
}

function classify(rows) {
  const admins = get('admins').value.split('\n').map(normalize).filter(Boolean);
  return rows.map((row) => {
    const hotel =
      /\bHOTEL\b/.test(normalize(row.reservation)) ||
      (get('useAdmin').checked && admins.includes(normalize(row.admin)));
    return {
      ...row,
      group: hotel && normalize(row.unit) !== 'CONDOMINIO' ? 'hotel' : 'condominio'
    };
  });
}

function countUnits(rows) {
  return new Set(rows.map((row) => normalize(row.unit))).size;
}

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function option(value, text) {
  const node = element('option', text);
  node.value = value;
  return node;
}

function renderOccupancy() {
  const confirmed = sections.filter((section) => section.id === 'registros_reserva_confirmada');
  const inHouse = sections.filter((section) => section.id === 'registros_casa');
  if (confirmed.length !== 1 || inHouse.length !== 1) {
    get('occupancyResult').textContent = 'Carregue as reservas confirmadas e os hóspedes na casa.';
    return;
  }
  const condominium = (section) =>
    classify(section.rows).filter((row) => row.group === 'condominio');
  const arriving = countUnits(condominium(confirmed[0]));
  const staying = countUnits(condominium(inHouse[0]));
  const percentage = (((arriving + staying) * 100) / 225).toLocaleString('pt-BR', {
    maximumFractionDigits: 2
  });
  get('occupancyResult').textContent =
    `${percentage}% (${arriving} confirmadas + ${staying} na casa)`;
}

function render() {
  const section = sections.find((section) => section.key === get('section').value);
  if (!section) return;
  renderOccupancy();

  const selectedAdmin = get('admin').value;
  const rows = classify(section.rows).filter(
    (row) =>
      (get('group').value === 'all' || row.group === get('group').value) &&
      (selectedAdmin === '' || `admin:${row.admin}` === selectedAdmin)
  );

  get('cards').replaceChildren();
  for (const group of ['hotel', 'condominio']) {
    const matching = rows.filter((row) => row.group === group);
    const card = element('div', undefined, `card ${group}`);
    card.append(
      element('span', group === 'hotel' ? 'Hotel' : 'Condomínio'),
      element('strong', String(countUnits(matching))),
      element('span', `${matching.length} reservas`)
    );
    get('cards').append(card);
  }

  get('rows').replaceChildren();
  for (const row of rows) {
    const tr = element('tr');
    const group = element('td');
    group.append(
      element('span', row.group === 'hotel' ? 'Hotel' : 'Condomínio', `tag ${row.group}`)
    );
    tr.append(
      element('td', row.reservation),
      element('td', row.unit),
      group,
      element('td', row.admin)
    );
    get('rows').append(tr);
  }
  if (!rows.length) {
    const tr = element('tr');
    const td = element('td', 'Nenhuma reserva para este filtro.');
    td.colSpan = 4;
    tr.append(td);
    get('rows').append(tr);
  }
  get('info').textContent =
    section.totalUnits !== null && section.totalUnits !== section.rows.length
      ? `O site informa ${section.totalUnits} unidades, foram lidas ${section.rows.length}.`
      : '';
}

function updateAdmins() {
  const previous = get('admin').value;
  const section = sections.find((section) => section.key === get('section').value);
  const admins = [...new Set(section.rows.map((row) => row.admin))].sort((a, b) =>
    a.localeCompare(b, 'pt-BR')
  );
  get('admin').replaceChildren(
    option('', 'Todas'),
    ...admins.map((admin) => option(`admin:${admin}`, admin || '(Não informada)'))
  );
  if ([...get('admin').options].some((option) => option.value === previous))
    get('admin').value = previous;
  render();
}

async function scan() {
  get('scan').disabled = true;
  get('controls').hidden = true;
  get('occupancy').hidden = true;
  get('status').textContent = 'Lendo…';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const url = new URL(tab?.url || 'about:blank');
    if (
    !['greensoftware.com.br', 'adm.gbdata.srv.br'].includes(url.hostname) ||
    !url.pathname.startsWith('/marulhos/')
  ) {
      throw new Error('Acesse o Green Software do Marulhos para utilizar.');
    }
    const frames = await chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      files: ['scan.js']
    });
    sections = frames.flatMap((frame) =>
      (frame.result || []).map((section) => ({
        ...section,
        key: `${frame.frameId}:${section.id}`
      }))
    );
    if (!sections.length) throw new Error('Acesse o dashboard de locações em reservas e aguarde carregar.');
    get('section').replaceChildren(
      ...sections.map((section) => option(section.key, section.title))
    );
    updateAdmins();
    get('controls').hidden = false;
    get('occupancy').hidden = false;
    get('status').textContent = '';
  } catch (error) {
    sections = [];
    get('status').textContent = error.message || 'Não foi possível ler a página.';
  } finally {
    get('scan').disabled = false;
  }
}

async function saveSettings() {
  render();
  try {
    await chrome.storage.local.set({
      useAdmin: get('useAdmin').checked,
      admins: get('admins').value
    });
    get('status').textContent = '';
  } catch {
    get('status').textContent = 'Não foi possível salvar a configuração.';
  }
}

async function init() {
  get('scan').disabled = true;
  try {
    const settings = await chrome.storage.local.get(['useAdmin', 'admins']);
    if (typeof settings.useAdmin === 'boolean') get('useAdmin').checked = settings.useAdmin;
    if (typeof settings.admins === 'string') get('admins').value = settings.admins;
  } catch {
    get('status').textContent = 'Não foi possível carregar a configuração salva.';
  }
  get('scan').disabled = false;
  get('scan').addEventListener('click', scan);
  get('section').addEventListener('change', updateAdmins);
  for (const id of ['group', 'admin']) get(id).addEventListener('change', render);
  for (const id of ['useAdmin', 'admins']) get(id).addEventListener('change', saveSettings);
  get('gear').addEventListener('click', () => {
    get('config').hidden = !get('config').hidden;
    get('gear').setAttribute('aria-expanded', String(!get('config').hidden));
  });
}

init();
