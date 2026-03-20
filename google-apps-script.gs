const SHEET_DAYS = 'Days';
const SHEET_SETS = 'Sets';

const DAYS_HEADERS = ['Date', 'Session', 'Exercises', 'Sets', 'Total Volume', 'Best Set'];
const SETS_HEADERS = ['Date', 'Session', 'Exercise', 'Exercise ID', 'Primary Muscle', 'Secondary Muscle', 'Set', 'Reps', 'Weight', 'RPE', 'Done', 'Notes', 'Volume'];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    const token = PropertiesService.getScriptProperties().getProperty('SYNC_TOKEN');
    if (token && data.token !== token) {
      return json_({ ok: false, error: 'Unauthorized' });
    }

    if (!data.sheetId) {
      return json_({ ok: false, error: 'Missing sheetId' });
    }

    const ss = SpreadsheetApp.openById(data.sheetId);
    const daysSheet = getOrCreate_(ss, SHEET_DAYS, DAYS_HEADERS);
    const setsSheet = getOrCreate_(ss, SHEET_SETS, SETS_HEADERS);

    if (data.action === 'test') {
      return json_({ ok: true });
    }

    if (data.action === 'pullAll') {
      const days = fetchRows_(daysSheet);
      const sets = fetchRows_(setsSheet);
      return json_({ ok: true, days, sets });
    }

    if (data.action === 'syncAll') {
      handleSyncAll_(daysSheet, setsSheet, data.days || []);
      return json_({ ok: true });
    }

    if (data.action === 'syncDay') {
      handleSyncDay_(daysSheet, setsSheet, data.date, data.rowsDays || [], data.rowsSets || []);
      return json_({ ok: true });
    }

    return json_({ ok: false, error: 'Unknown action' });
  } catch (error) {
    return json_({ ok: false, error: String(error) });
  }
}

function handleSyncAll_(daysSheet, setsSheet, days) {
  resetSheet_(daysSheet, DAYS_HEADERS);
  resetSheet_(setsSheet, SETS_HEADERS);

  const allDayRows = [];
  const allSetRows = [];

  days.forEach(day => {
    if (Array.isArray(day.rowsDays)) allDayRows.push(...day.rowsDays);
    if (Array.isArray(day.rowsSets)) allSetRows.push(...day.rowsSets);
  });

  appendRows_(daysSheet, allDayRows);
  appendRows_(setsSheet, allSetRows);
}

function handleSyncDay_(daysSheet, setsSheet, date, rowsDays, rowsSets) {
  if (date) {
    deleteRowsByDate_(daysSheet, date);
    deleteRowsByDate_(setsSheet, date);
  }

  appendRows_(daysSheet, rowsDays);
  appendRows_(setsSheet, rowsSets);
}

function getOrCreate_(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }

  const lastRow = sheet.getLastRow();
  if (lastRow === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  } else {
    // Keep headers in sync when columns evolve (for example new muscle columns).
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }

  return sheet;
}

function resetSheet_(sheet, headers) {
  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
}

function deleteRowsByDate_(sheet, date) {
  const values = sheet.getDataRange().getValues();
  const target = normalizeDate_(date);
  for (let i = values.length - 1; i >= 1; i--) {
    if (normalizeDate_(values[i][0]) === target) {
      sheet.deleteRow(i + 1);
    }
  }
}

function appendRows_(sheet, rows) {
  if (!rows || !rows.length) return;
  const startRow = sheet.getLastRow() + 1;
  sheet.getRange(startRow, 1, rows.length, rows[0].length).setValues(rows);
}

function fetchRows_(sheet) {
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];
  return values.slice(1);
}

function normalizeDate_(value) {
  if (!value) return '';
  if (Object.prototype.toString.call(value) === '[object Date]') {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  const raw = String(value).trim();
  if (raw.indexOf('T') > -1) {
    const date = new Date(raw);
    if (!isNaN(date.getTime())) return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  return raw.slice(0, 10);
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
