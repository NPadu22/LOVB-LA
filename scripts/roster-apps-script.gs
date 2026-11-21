/**
 * Orbit Performance: sign-up roster + opt-in staff data.
 *
 * Paste into the PUBLIC announcements sheet: Extensions > Apps Script, replace everything, Save.
 * Then Deploy > Manage deployments > pencil > Version: New version > Deploy (the /exec URL stays the same).
 *
 * Roster rows go to the "Roster" tab of this (public) sheet: name, position, jersey, language only.
 * Readiness, lifts and conditioning that an athlete CHOOSES to share go to a separate PRIVATE sheet:
 *   1. Create a new Google Sheet (e.g. "Orbit staff data"). Keep General access = Restricted.
 *      Share it only with the staff who should see it.
 *   2. Paste its ID (the long part between /d/ and /edit) or its full link into STAFF_SHEET_ID below.
 * Tabs and headers in the private sheet are created automatically.
 */
const ROSTER_TAB = 'Roster';
const STAFF_SHEET_ID = 'PASTE_PRIVATE_SHEET_ID_HERE';

const STAFF_TABS = {
  Readiness: ['Date', 'Code', 'Name', 'Position', 'Readiness (1-5)', 'Sleep (h)', 'Sleep quality', 'Soreness', 'Energy', 'Mood', 'Stress', 'Updated', 'Key'],
  Lifts: ['Date', 'Code', 'Name', 'Position', 'Exercise', 'Weight', 'Unit', 'Reps', 'Est. 1RM', 'Logged', 'Set ID'],
  Conditioning: ['Date', 'Code', 'Name', 'Position', 'Session', 'RPE (1-10)', 'Minutes', 'Load (RPE x min)', 'Logged', 'Key']
};

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const id = clean(d.id, 40);
    if (!id) return reply({ ok: false });
    const t = clean(d.t, 10) || 'roster';
    if (t === 'roster') return roster(d, id);
    if (STAFF_SHEET_ID.indexOf('PASTE_') === 0) return reply({ ok: false, error: 'staff sheet not set' });
    const ss = SpreadsheetApp.openById(staffSheetId());
    const who = [clean(d.code, 8).toUpperCase(), clean(d.name, 80), clean(d.position, 30)];
    const date = clean(d.date, 10);
    const now = new Date();
    if (t === 'ready') {
      const row = [date].concat(who, [num(d.score), clean(d.sleepH, 3), num(d.sleepQ), num(d.sore), num(d.energy), num(d.mood), num(d.stress), now, id + '|' + date]);
      upsert(tab(ss, 'Readiness'), row, 12);
    } else if (t === 'lift') {
      const row = [date].concat(who, [clean(d.ex, 60), num(d.w), clean(d.u, 3), num(d.r), num(d.e1rm), now, clean(d.setId, 40)]);
      upsert(tab(ss, 'Lifts'), row, 10);
    } else if (t === 'liftdel') {
      remove(tab(ss, 'Lifts'), clean(d.setId, 40), 10);
    } else if (t === 'cond') {
      const s = clean(d.session, 30);
      const row = [date].concat(who, [s, num(d.rpe), num(d.min), num(d.load), now, id + '|' + date + '|' + s]);
      upsert(tab(ss, 'Conditioning'), row, 9);
    } else if (t === 'conddel') {
      remove(tab(ss, 'Conditioning'), id + '|' + date + '|' + clean(d.session, 30), 9);
    }
    return reply({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

function roster(d, id) {
  const first = clean(d.first, 40), last = clean(d.last, 40);
  if (!first || !last) return reply({ ok: false });
  const row = [clean(d.code, 8).toUpperCase(), first, last, clean(d.position, 30), clean(d.num, 3), clean(d.lang, 5)];
  const sh = SpreadsheetApp.getActive().getSheetByName(ROSTER_TAB);
  const now = new Date();
  const vals = sh.getDataRange().getValues();
  for (let i = 1; i < vals.length; i++) {
    if (String(vals[i][8]) === id) {
      sh.getRange(i + 1, 1, 1, 6).setValues([row]);
      sh.getRange(i + 1, 8).setValue(now);
      return reply({ ok: true, updated: true });
    }
  }
  sh.appendRow(row.concat([now, now, id]));
  return reply({ ok: true });
}

// Accepts either the bare ID or a full Google Sheets link.
function staffSheetId() { const m = String(STAFF_SHEET_ID).match(/\/d\/([a-zA-Z0-9_-]+)/); return m ? m[1] : String(STAFF_SHEET_ID).trim(); }

// Plain text only, short, and never a formula.
function clean(v, n) { return String(v == null ? '' : v).replace(/[\r\n\t]/g, ' ').trim().slice(0, n).replace(/^[=+\-@]/, "'$&"); }
function num(v) { const x = Number(v); return isFinite(x) ? x : ''; }

function tab(ss, name) {
  let sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.appendRow(STAFF_TABS[name]); sh.setFrozenRows(1); sh.getRange(1, 1, 1, STAFF_TABS[name].length).setFontWeight('bold'); }
  return sh;
}
function upsert(sh, row, keyCol) {
  const vals = sh.getDataRange().getValues();
  for (let i = 1; i < vals.length; i++) {
    if (String(vals[i][keyCol]) === String(row[keyCol])) { sh.getRange(i + 1, 1, 1, row.length).setValues([row]); return; }
  }
  sh.appendRow(row);
}
function remove(sh, key, keyCol) {
  const vals = sh.getDataRange().getValues();
  for (let i = vals.length - 1; i >= 1; i--) if (String(vals[i][keyCol]) === String(key)) sh.deleteRow(i + 1);
}
function reply(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
