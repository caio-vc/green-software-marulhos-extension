(() => {
  if (
    !['greensoftware.com.br', 'adm.gbdata.srv.br'].includes(location.hostname) ||
    !location.pathname.startsWith('/marulhos/')
  ) {
    return [];
  }

  const tables = {
    registros_reserva_confirmada: 'Reserva confirmada',
    registros_casa: 'Hóspedes na casa',
    registros_dias: 'Check-in próximos 10 dias',
    registros_checkout: 'Check-out do dia',
    registros_noshow: 'No-show'
  };

  function normalize(value) {
    return String(value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toUpperCase();
  }

  function readTotal(rows, label) {
    const row = rows.find((row) => normalize(row.cells[0]?.textContent) === label);
    const value = normalize(row?.cells[row.cells.length - 1]?.textContent);
    return /^\d+$/.test(value) ? Number(value) : null;
  }

  const sections = [];

  for (const [id, title] of Object.entries(tables)) {
    const table = document.getElementById(id);
    if (!table) continue;

    const tableRows = Array.from(table.rows);
    const header = tableRows.find((row) =>
      Array.from(row.cells).some((cell) => normalize(cell.textContent) === 'NUMERO RESERVA')
    );
    if (!header) continue;

    const columns = Array.from(header.cells, (cell) => normalize(cell.textContent));
    const indexes = ['NUMERO RESERVA', 'UNIDADE', 'INSERIDA POR'].map((name) =>
      columns.indexOf(name)
    );
    if (indexes.includes(-1)) continue;

    const rows = [];
    for (const row of tableRows) {
      if (row === header || row.cells.length < columns.length) continue;

      const [reservation, unit, admin] = indexes.map((index) =>
        row.cells[index].textContent.trim()
      );
      if (!/^\d+(?:\s*-\s*HOTEL)?$/i.test(reservation) || !unit) continue;

      rows.push({ reservation, unit, admin });
    }

    sections.push({
      id,
      title,
      rows,
      totalUnits: readTotal(tableRows, 'TOTAL UNIDADES')
    });
  }

  return sections;
})();
