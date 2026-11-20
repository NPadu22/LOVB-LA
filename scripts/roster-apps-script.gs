/**
 * Orbit Performance: sign-up roster.
 * Paste into the Google Sheet: Extensions > Apps Script, replace everything, Save,
 * then Deploy > New deployment > Web app > Execute as: Me, Who has access: Anyone > Deploy.
 * Copy the Web app URL (ends in /exec) into CONFIG.rosterURL in the app.
 *
 * Writes only to the "Roster" tab: code, name, position, jersey, language, dates.
 * One row per phone (matched by a random device ID); profile edits update the same row.
 */
const ROSTER_TAB = 'Roster';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    // Plain text only, short, and never a formula.
    const clean = (v, n) => String(v == null ? '' : v).replace(/[\r\n\t]/g, ' ').trim().slice(0, n).replace(/^[=+\-@]/, "'$&");
    const first = clean(d.first, 40), last = clean(d.last, 40), id = clean(d.id, 40);
    if (!first || !last || !id) return reply({ ok: false });
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
  } finally {
    lock.releaseLock();
  }
}

function reply(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
