// Shared sidebar navigation, built from data/wings.json — a single source of
// truth so every page (home, every boss page) shows the same wing/boss list
// without hand-duplicating it. Keeps the whole raid list one click away.

export async function loadWings() {
  const res = await fetch('data/wings.json');
  if (!res.ok) throw new Error(`Failed to load wings.json: ${res.status}`);
  return res.json();
}

/**
 * Renders the sidebar into #sidebar-wings. The wing containing
 * `currentBossSlug` (if any) starts expanded with that boss highlighted.
 */
export async function renderSidebar(currentBossSlug) {
  const container = document.getElementById('sidebar-wings');
  if (!container) return;

  let wings;
  try {
    wings = await loadWings();
  } catch (err) {
    container.textContent = 'Could not load the raid list.';
    console.error(err);
    return;
  }

  container.innerHTML = '';

  for (const wing of wings) {
    const hasCurrent = wing.bosses.some((b) => b.slug === currentBossSlug);

    const group = document.createElement('div');
    group.className = 'wing-group';

    const head = document.createElement('button');
    head.type = 'button';
    head.className = 'wing-head';
    head.setAttribute('aria-expanded', String(hasCurrent));

    const label = document.createElement('span');
    label.textContent = wing.name;
    const count = document.createElement('span');
    count.className = 'count';
    count.textContent = hasCurrent ? '▾' : `▸ ${wing.bosses.length}`;
    head.append(label, count);

    const list = document.createElement('div');
    list.className = 'boss-list';
    list.hidden = !hasCurrent;

    for (const boss of wing.bosses) {
      const a = document.createElement('a');
      a.href = `boss.html?boss=${encodeURIComponent(boss.slug)}`;
      a.textContent = boss.name;
      if (boss.type === 'event') a.classList.add('event');
      if (boss.slug === currentBossSlug) a.classList.add('active');
      list.appendChild(a);
    }

    head.addEventListener('click', () => {
      const expanded = head.getAttribute('aria-expanded') === 'true';
      head.setAttribute('aria-expanded', String(!expanded));
      list.hidden = expanded;
      count.textContent = expanded ? `▸ ${wing.bosses.length}` : '▾';
    });

    group.append(head, list);
    container.appendChild(group);
  }
}
