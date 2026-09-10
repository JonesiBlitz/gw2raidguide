// Light/dark toggle button behavior. The initial theme (before this module
// even loads) is applied by a small inline script in each page's <head> —
// see index.html / boss.html — so there's no flash of the wrong theme.

const STORAGE_KEY = 'gw2-raid-guide-theme';

function readStored() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStored(value) {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // ignore — private browsing / storage blocked
  }
}

function currentTheme() {
  return (
    readStored() ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  );
}

export function initThemeToggle(buttonEl) {
  if (!buttonEl) return;

  buttonEl.setAttribute('aria-pressed', String(currentTheme() === 'dark'));

  buttonEl.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    writeStored(next);
    document.documentElement.setAttribute('data-theme', next);
    buttonEl.setAttribute('aria-pressed', String(next === 'dark'));
  });
}
