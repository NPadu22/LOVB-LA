# Athlete handouts

Source files and PDFs for the athlete-facing guides. The staff briefing for Emma is kept out of this public repo.

| File | What it is |
|---|---|
| `Orbit-Performance-Athlete-Guide.pdf` | 14-slide athlete guide (built from `athlete.html`) |
| `Orbit-Performance-Athlete-Quick-Guide.pdf`, `-JA.pdf`, `Orbit-Performance-Guia-Rapido-PT-BR.pdf` | Two-page quick guides (built by `build_guides.py`) |

## Rebuild after an app change

Run these from this folder (Playwright is pre-installed in Claude Code cloud sessions):

1. `node shots.js && node shots-v2.js` and `LG=en node shots-guide.js` (repeat with `LG=ja` and `LG=pt`). These retake the app screenshots into `img/`.
2. `node topdf-athlete.js`. This rebuilds the athlete guide PDF and checks that nothing overflows a slide.
3. `python3 build_guides.py && node topdf-guides.js`. This rebuilds the three quick guides and checks for overflow.

The screenshot scripts load `../LA Orbit Nutrition.html` relative to this folder.
