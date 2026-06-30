const { google } = require('googleapis');

const CACHE_TTL_MS = 30 * 60 * 1000;
let cachedKeywords = null;
let cacheTimestamp = 0;

function getAuthClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!email || !privateKey) {
    throw new Error(
      'GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY must be configured'
    );
  }

  return new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
}

function escapeSheetTitle(title) {
  return `'${title.replace(/'/g, "''")}'`;
}

async function resolveRange(sheetsApi, spreadsheetId) {
  const columns = process.env.GOOGLE_SHEETS_COLUMNS || 'A:B';
  const gid = process.env.GOOGLE_SHEETS_GID;

  if (process.env.GOOGLE_SHEETS_RANGE && !gid) {
    return process.env.GOOGLE_SHEETS_RANGE.replace(/^['"]|['"]$/g, '');
  }

  const meta = await sheetsApi.spreadsheets.get({ spreadsheetId });
  const allSheets = meta.data.sheets || [];

  let sheet = null;
  if (gid) {
    sheet = allSheets.find(
      (entry) => String(entry.properties?.sheetId) === String(gid)
    );
  }

  if (!sheet) {
    sheet = allSheets[0];
  }

  if (!sheet?.properties?.title) {
    throw new Error('No sheets found in the spreadsheet');
  }

  const range = `${escapeSheetTitle(sheet.properties.title)}!${columns}`;
  console.log(`Using Google Sheets tab: ${sheet.properties.title} (${range})`);

  return range;
}

function isHeaderRow(keyword) {
  return /^keyword(s)?$/i.test(keyword.trim());
}

function parseKeywords(rows) {
  const allowedPriorities = new Set(['green', 'orange']);
  const hasPriorityColumn = rows.some((row) =>
    allowedPriorities.has(row[1]?.trim().toLowerCase())
  );

  const keywords = [];

  for (const row of rows) {
    const keyword = row[0]?.trim();
    if (!keyword || isHeaderRow(keyword)) continue;

    if (hasPriorityColumn) {
      const priority = row[1]?.trim().toLowerCase();
      if (allowedPriorities.has(priority)) {
        keywords.push(keyword);
      }
    } else {
      keywords.push(keyword);
    }
  }

  return keywords;
}

async function fetchKeywordsFromSheet() {
  const sheetId = process.env.GOOGLE_SHEETS_ID;
  if (!sheetId) {
    throw new Error('GOOGLE_SHEETS_ID must be configured');
  }

  const auth = getAuthClient();
  const sheets = google.sheets({ version: 'v4', auth });
  const range = await resolveRange(sheets, sheetId);

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range,
  });

  const rows = response.data.values || [];
  const keywords = parseKeywords(rows);

  console.log(`Loaded ${keywords.length} keywords from Google Sheets`);

  return keywords;
}

async function getKeywords() {
  try {
    const now = Date.now();

    if (cachedKeywords && now - cacheTimestamp < CACHE_TTL_MS) {
      return cachedKeywords;
    }

    cachedKeywords = await fetchKeywordsFromSheet();
    cacheTimestamp = now;

    return cachedKeywords;
  } catch (error) {
    console.error('Failed to fetch keywords from Google Sheets:', error);
    throw error;
  }
}

module.exports = { getKeywords };
