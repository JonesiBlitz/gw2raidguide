import { renderSidebar, loadWings, initMobileNav } from './nav.js';
import { initThemeToggle } from './theme.js';

initThemeToggle(document.getElementById('theme-toggle'));
initMobileNav();

const params = new URLSearchParams(location.search);
const slug = params.get('boss');
const main = document.getElementById('boss-main');

function formatDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

async function fetchJson(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function renderNotFound() {
  main.innerHTML = `
    <div class="placeholder-panel">
      <strong>Boss not found</strong>
      Pick a boss from the list on the left.
    </div>
  `;
}

function renderSections(sections) {
  return sections
    .map(
      (s) => `
      <div class="note-section">
        <div style="flex:1;">
          <h4>${s.heading}</h4>
          <ul>${s.bullets.map((b) => `<li>${b}</li>`).join('')}</ul>
        </div>
        ${s.image ? `<div class="note-figure">IMG — ${s.image}</div>` : ''}
      </div>
    `
    )
    .join('');
}

function renderSources(notes) {
  return notes.sources && notes.sources.length
    ? `<div style="font-size:0.72rem; color:var(--muted);">
        Sources: ${notes.sources
          .map((s) => `<a href="${s.url}" target="_blank" rel="noopener">${s.label}</a>`)
          .join(' · ')}
      </div>`
    : '';
}

function renderNotesPanel(notes, bossName, mode) {
  if (!notes) {
    return `
      <div class="placeholder-panel">
        <strong>Quick notes coming soon</strong>
        We haven't written up ${bossName} yet — check back soon.
      </div>
    `;
  }

  if (mode === 'cm') {
    if (!notes.cmSections || !notes.cmSections.length) {
      return `
        <div class="placeholder-panel">
          <strong>Challenge Mote notes coming soon</strong>
          We haven't written up ${bossName}'s CM differences yet — check back soon.
        </div>
      `;
    }
    return renderSections(notes.cmSections) + renderSources(notes);
  }

  return renderSections(notes.sections) + renderSources(notes);
}

function renderBuildsPanel(bossName) {
  return `
    <div class="placeholder-panel">
      <strong>Builds &amp; team comp coming soon</strong>
      We're launching with Quick Notes first — recommended builds for ${bossName} will follow, likely linking out to Snowcrows plus our own build-template view.
    </div>
  `;
}

async function init() {
  if (!slug) {
    renderNotFound();
    return;
  }

  const wings = await loadWings();
  let wing = null;
  let boss = null;
  let bossIndex = -1;
  for (const w of wings) {
    const i = w.bosses.findIndex((b) => b.slug === slug);
    if (i !== -1) {
      wing = w;
      boss = w.bosses[i];
      bossIndex = i;
      break;
    }
  }

  renderSidebar(slug);

  if (!boss) {
    renderNotFound();
    return;
  }

  document.title = `${boss.name} — GW2 Raid Guide`;

  const [notes, lastUpdated] = await Promise.all([
    fetchJson(`data/bosses/${slug}/notes.json`),
    fetchJson('data/last-updated.json'),
  ]);

  const notesDate = lastUpdated ? formatDate(lastUpdated[`${slug}/notes`]) : null;

  const moteRow = notes && notes.hasChallengeMote
    ? `
      <div class="mote-row">
        <button class="mote active" data-mode="normal" type="button">Normal</button>
        <button class="mote cm" data-mode="cm" type="button">Challenge Mote</button>
      </div>
    `
    : '';

  main.innerHTML = `
    <div class="boss-header">
      <div>
        <div class="boss-eyebrow">${wing.name} — Boss ${bossIndex + 1} of ${wing.bosses.length}</div>
        <div class="boss-title">${boss.name}</div>
        ${notesDate ? `<div class="last-updated">Notes last updated <strong>${notesDate}</strong></div>` : ''}
      </div>
      ${moteRow}
    </div>

    <div class="tabs">
      <button class="tab-btn active" data-tab="notes" type="button">Quick Notes</button>
      <button class="tab-btn" data-tab="builds" type="button">Builds &amp; Team Comp</button>
    </div>

    <div class="tab-panel" data-panel="notes">${renderNotesPanel(notes, boss.name, 'normal')}</div>
    <div class="tab-panel" data-panel="builds" hidden>${renderBuildsPanel(boss.name)}</div>
  `;

  const tabButtons = main.querySelectorAll('.tab-btn');
  const panels = main.querySelectorAll('.tab-panel');
  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabButtons.forEach((b) => b.classList.toggle('active', b === btn));
      panels.forEach((p) => {
        p.hidden = p.dataset.panel !== btn.dataset.tab;
      });
    });
  });

  const moteButtons = main.querySelectorAll('.mote');
  const notesPanel = main.querySelector('.tab-panel[data-panel="notes"]');
  moteButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) return;
      moteButtons.forEach((b) => b.classList.toggle('active', b === btn));
      notesPanel.innerHTML = renderNotesPanel(notes, boss.name, btn.dataset.mode);
    });
  });
}

init();
