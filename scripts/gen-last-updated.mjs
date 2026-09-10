#!/usr/bin/env node
// Writes src/data/last-updated.json, mapping "<boss-slug>/<notes|builds>" to
// the ISO date of the last git commit that touched that content file.
//
// Run this before every deploy (see .github/workflows/deploy.yml, which
// checks out full history with fetch-depth: 0 so the dates are accurate) and
// optionally before local preview: `npm run gen:dates`.
//
// Files with no commit history yet (not committed) are simply omitted —
// app-boss.js treats a missing date as "no badge," not an error.

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const bossesDir = path.join(root, 'src', 'data', 'bosses');
const outFile = path.join(root, 'src', 'data', 'last-updated.json');

function lastCommitDate(relativePath) {
  try {
    const iso = execFileSync('git', ['log', '-1', '--format=%cI', '--', relativePath], {
      cwd: root,
      encoding: 'utf8',
    }).trim();
    return iso || null;
  } catch {
    return null;
  }
}

const out = {};

if (existsSync(bossesDir)) {
  for (const slug of readdirSync(bossesDir)) {
    const dir = path.join(bossesDir, slug);
    if (!statSync(dir).isDirectory()) continue;

    for (const kind of ['notes', 'builds']) {
      const file = path.join(dir, `${kind}.json`);
      if (!existsSync(file)) continue;
      const rel = path.relative(root, file).split(path.sep).join('/');
      const date = lastCommitDate(rel);
      if (date) out[`${slug}/${kind}`] = date;
    }
  }
}

writeFileSync(outFile, JSON.stringify(out, null, 2) + '\n');
console.log(`Wrote src/data/last-updated.json (${Object.keys(out).length} entries)`);
