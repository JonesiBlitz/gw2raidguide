# GW2 Raid Guide

*(working title — "Raid Compass" is a placeholder)*

**Live site: https://jonesiblitz.github.io/gw2raidguide/**

An unofficial fan site for Guild Wars 2 raids, built around two goals:

1. **Quick Notes** — bullet-point mechanics per boss, meant to be read out loud by
   a commander, not dug out of a wiki paragraph. Photos where a picture explains a
   mechanic faster than text.
2. **Builds & Team Comp** — the recommended 10-player comp per fight, role by role,
   linking out to Snowcrows and (eventually) our own build-template view.
   **Not built yet** — every boss page shows a placeholder for this tab for now.

Navigation is a persistent left sidebar (all 8 wings, expandable to their bosses) so
switching fights never costs more than one click.

## Status

- ✅ Site shell: sidebar nav, boss page (Quick Notes / Builds tabs), light + dark
  mode, footer.
- ✅ Quick Notes written for **Spirit Vale** (Vale Guardian, Gorseval, Sabetha) as a
  proof of concept.
- ⬜ Quick Notes for the other 7 wings (21 bosses) — not written yet. Pages exist in
  the nav and show a "coming soon" placeholder until their `notes.json` is added.
- ⬜ Builds & team comp — placeholder on every page until we design the build data
  model and (maybe) a custom build-template component.
- ⬜ Real screenshots for the `note-figure` placeholders.

## Content sourcing

Quick Notes are written in our own words, cross-referenced against:

- [GW2 Wiki: Raid](https://wiki.guildwars2.com/wiki/Raid)
- [Hardstuck: Raid Guides](https://hardstuck.gg/gw2/guides/raids/)
- [Mukluk Labs: GW2 Raid Guides](https://mukluklabs.com/gw2-raid-guides)

Each boss's `notes.json` lists the specific sources used in its `sources` array.
Raid content occasionally changes (a new wing, a rebalance) — that's what the
"last updated" date on each page is for; see [CLAUDE.md](./CLAUDE.md) for how it's
generated from git history.

## Local preview

No build step — it's plain HTML/CSS/JS. From the repo root:

```bash
npm run serve
```

## Deploy

Push to `main` — `.github/workflows/deploy.yml` builds the last-updated dates from
git history and publishes `src/` to GitHub Pages.
