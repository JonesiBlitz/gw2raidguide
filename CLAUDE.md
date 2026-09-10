# CLAUDE.md

## Git workflow

Work directly on `main` in this repo — no feature branches. Commit and push straight
to `main` when the user asks. This is a solo personal project deploying to GitHub
Pages; there's no PR review process to protect against, so branching just adds
friction.

## Project overview

Pure client-side static site (vanilla JS, ES modules, no build step, no framework) —
a GW2 raid guide: quick commander notes per boss fight, plus team comp/builds later.
Sibling project to `gw2InventoryTracker`; shares its color tokens (gold as secondary
accent) and footer, with GW2's official dragon-logo red as the primary accent.

Deploys to GitHub Pages via `.github/workflows/deploy.yml` on push to `main`. The
deploy workflow also runs `scripts/gen-last-updated.mjs`, which reads git history
(full history — `fetch-depth: 0`) to stamp each boss's Quick Notes with the date of
the commit that last touched it. That generated file (`src/data/last-updated.json`)
is gitignored — regenerate locally with `npm run gen:dates` if you want to preview
the date badges before pushing.

## Content

- `src/data/wings.json` — every raid wing and boss, in order. Source of truth for
  the sidebar nav on every page.
- `src/data/bosses/<slug>/notes.json` — Quick Notes content, one file per boss.
  A boss with no file yet just shows a "coming soon" placeholder — no need to
  pre-create empty files for unwritten bosses.
- Builds & team comp are placeholder-only for now on every boss page
  (`renderBuildsPanel` in `src/app-boss.js`) — no per-boss build data yet.
- Quick Notes content is written from wiki.guildwars2.com, hardstuck.gg, and
  mukluklabs.com, cross-checked against each other, in our own words (not
  copy-pasted) — cite sources in each notes.json's `sources` array.

## Local preview

No build step — just serve `src/` statically:

```bash
npm run serve
```
