import { renderSidebar, loadWings } from './nav.js';
import { initThemeToggle } from './theme.js';

renderSidebar(null);
initThemeToggle(document.getElementById('theme-toggle'));

const chipRow = document.getElementById('wing-chips');
if (chipRow) {
  loadWings()
    .then((wings) => {
      chipRow.innerHTML = '';
      for (const wing of wings) {
        const a = document.createElement('a');
        a.className = 'chip';
        a.href = `boss.html?boss=${encodeURIComponent(wing.bosses[0].slug)}`;
        a.textContent = wing.name;
        chipRow.appendChild(a);
      }
    })
    .catch((err) => {
      chipRow.textContent = 'Could not load the wing list.';
      console.error(err);
    });
}
