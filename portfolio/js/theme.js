/**
 * theme.js — Dark / Light mode management
 * Reads from localStorage and binds the toggle button.
 */

const STORAGE_KEY = 'mh-portfolio-theme';
const DEFAULT     = 'dark';

export function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEY) || DEFAULT;
  applyTheme(saved);

  // Bind toggle after DOM is ready (called again from main after component load)
  document.addEventListener('click', (e) => {
    if (e.target.closest('#theme-toggle')) toggleTheme();
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEY, theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
}
