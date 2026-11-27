# Orbit Performance (LOVB LA) — handoff notes for Claude

Owner: Nick, sports dietitian. Wants honest, evidence-based answers, detail, and creativity. Staff: Emma Stratmoen (athletic trainer, code ESTR) and Caíque Bothelo (strength coach).

## What this is
- `LA Orbit Nutrition.html`: the whole athlete app, as a single-file HTML/JS PWA. Data is stored in localStorage with the prefix `orb_`.
- `index.html`: generated from it by `python3 scripts/build-pages.py`. Never edit it by hand.
- Live at https://npadu22.github.io/LOVB-LA/ (GitHub Pages) and at the Claude artifact https://claude.ai/artifact/V4P7urrpu8qdDna3TErQ66.
- `scripts/roster-apps-script.gs`: the repo copy of the Apps Script web app bound to the public sheet. The `/exec` URL is in `CONFIG.rosterURL` in the app.

## Release workflow (every change, goes live immediately)
1. Edit `LA Orbit Nutrition.html`. Test with Playwright, which is pre-installed: `require('playwright')`.
2. Republish the artifact above. Use the same URL and don't pass capabilities.
3. Run `python3 scripts/build-pages.py`.
4. Run `git fetch origin claude/new-session-d2qu49`. If the remote has new commits, merge them; never force-push. Then commit and push to `claude/new-session-d2qu49` only.

## Google Sheets
- **Public sheet "I LOVB LA"** is read by the app through gviz CSV. Tab gids are Emma 0, Team 1, How to use 2, Programs 3, Lifts 4, Roster 5, Nutrition 6 and Lists 7 (hidden). Anyone with the link can read it, so never put athlete names, injuries or medical details there.
- **Private sheet "Orbit Staff Data"** must stay Restricted. It has the tabs Recovery, Lifts, Conditioning, Nutrition and Hydration, and the Apps Script writes athlete logs to it.
- gviz drops text values in columns it infers are numeric. Keep the Sets, Reps and Lifts F–I columns formatted as plain TEXT.

## Key behaviours
- **Athlete codes:** first initial + first 3 letters of the last name (`myCode()`). The For column accepts Everyone, positions, codes, or "CODE · Name".
- **Programs:** filtered per row. Rows with a blank For are hidden. Staff accounts see only rows coded to their own initials. **Nutrition posts:** staff see all of them with a "For:" label; athletes see Everyone, their position and their code. The When/Phase order is Anytime, then pre-practice, then post-practice.
- **Reps:** a scheme such as `30/15/15/15` (split on `/` or `,`) shows as one chip per set. Exercises with Track=No get a "Mark done" check.
- **Sharing is automatic** (`SHARE` constant, no opt-out), but only after the athlete ticks the sign-up consent box or taps "I understand" on the one-time screen (`profile.consentAt`; `staffSend` refuses without it). Check-ins, meals, water, lifts and conditioning go to the staff sheet. The cycle tracker, notes and photos never leave the phone.
- **Meal recommendations:** Nutrition tab columns Meal 1-3 name app meals (exact names). Recommended meals get a ★ badge and sort first in the meal plan and Meal prep (`isRec`, `mealFind`, `recMealsHTML`). The dropdown source is Lists!C (a static list): **whenever you add or rename a meal in MEALBANK or MEALPREP, rewrite Lists!C** so the dropdown matches.
- **Learn tab:** Ask the RD (ranked search over FAQ + LESSONS, `askSearch`; unanswered questions go to the staff sheet's Questions tab via `staffSend({t:"ask"})`), Library (lesson tracks + All Q&A), Tools. The old "My path" is gone. To grow the library, add entries to FAQ with a source in `s`.
- **Oral allergy syndrome:** `profile.oas` (raw-safe fruit/veg, never, milks; phone only). `oasCheck` filters MEALBANK by ingredient keys, `oasPrep` adds swaps to MEALPREP. Defaults (`OAS_DEF`) are one athlete's list.
- **Offline:** `sw.js` (repo root) caches the app shell on GitHub Pages; bump `V` in sw.js if you change which files it caches. Not registered inside the Claude artifact.
- **10:30 team snack** uses the `bridge` bank (carbs + 5–15 g protein); pre-sleep defaults to `hp:1` options (30 g+ protein).
- **Translations:** `addT([[en, ja, pt]])` takes exact, trimmed keys. Write any JS generated from Python with `json.dumps(ensure_ascii=False)`.

## Open items
- Athlete handouts live in `handouts/` (see its README to rebuild after app changes). Emma's briefing deck (artifact https://claude.ai/artifact/2oeVbQfHtzvksPiqdtfp5n) is staff-facing and kept out of the repo; its source was only in the session scratchpad.
- Option: stop staff accounts sending data to the staff sheet.
- Ideas not taken up yet: a Team summary tab, higher-protein vegetarian options, and removing "Dose" from Emma deck slide 8.
