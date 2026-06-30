function parseTableRow(line) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

function isTableSeparator(line) {
  return /^\|?[\s\-:|]+\|?$/.test(line.trim());
}

function renderTable(rows) {
  const dataRows = rows.filter((row) => !isTableSeparator(row));
  if (dataRows.length === 0) return '';

  const parsed = dataRows.map(parseTableRow);
  const [header, ...body] = parsed;

  let html =
    '<table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:480px">';
  html += '<thead><tr>';
  for (const cell of header) {
    html += `<th style="text-align:center">${cell}</th>`;
  }
  html += '</tr></thead><tbody>';

  for (const row of body) {
    html += '<tr>';
    for (const cell of row) {
      html += `<td style="text-align:center">${cell}</td>`;
    }
    html += '</tr>';
  }

  html += '</tbody></table>';
  return html;
}

function isAllCapsHeadline(line) {
  const letters = line.replace(/[^A-Za-z]/g, '');
  return letters.length >= 8 && line === line.toUpperCase();
}

function formatFeatureLine(line) {
  const colonIndex = line.indexOf(':');
  if (colonIndex <= 0) return null;

  const label = line.slice(0, colonIndex + 1).trim();
  const text = line.slice(colonIndex + 1).trim();
  if (!text || label.length > 60) return null;

  return `<p><strong>${label}</strong> ${text}</p>`;
}

function descriptionToHtml(description) {
  const lines = description.split('\n');
  const parts = [];
  let tableBuffer = [];

  function flushTable() {
    if (tableBuffer.length) {
      parts.push(renderTable(tableBuffer));
      tableBuffer = [];
    }
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushTable();
      continue;
    }

    if (trimmed.startsWith('|')) {
      tableBuffer.push(trimmed);
      continue;
    }

    flushTable();

    if (/^WHY YOU'?LL LOVE IT$/i.test(trimmed) || /^SIZE CHART \(IN\)$/i.test(trimmed)) {
      parts.push(`<p><strong>${trimmed.toUpperCase()}</strong></p>`);
      continue;
    }

    const featureLine = formatFeatureLine(trimmed);
    if (featureLine) {
      parts.push(featureLine);
      continue;
    }

    if (isAllCapsHeadline(trimmed)) {
      parts.push(`<p><strong>${trimmed}</strong></p>`);
      continue;
    }

    parts.push(`<p>${trimmed}</p>`);
  }

  flushTable();
  return parts.join('');
}

module.exports = { descriptionToHtml };
