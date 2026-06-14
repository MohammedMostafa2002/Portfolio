/**
 * nav.js — Navigation interactions
 * Handles: scroll progress bar, scrolled state, active link highlighting,
 * mobile hamburger menu, and smooth close on link click.
 */

export function initNav() {
  const nav          = document.getElementById('site-nav');
  const progress     = document.getElementById('scroll-progress');
  const hamburger    = document.getElementById('hamburger');
  const mobileMenu   = document.getElementById('nav-mobile');
  const navLinks     = document.querySelectorAll('[data-section]');

  if (!nav) return;

  // ── Scroll progress + nav shadow ──────────────────────────────
  function onScroll() {
    const scrollY   = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct       = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

    if (progress) progress.style.width = `${pct}%`;
    nav.classList.toggle('scrolled', scrollY > 20);

    // Active section highlight
    highlightActiveSection();
  }

  // ── Active section detection ───────────────────────────────────
  function highlightActiveSection() {
    const sections = ['hero', 'about', 'skills', 'projects', 'contact'];
    let current = 'hero';

    for (const id of sections) {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 120) current = id;
    }

    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }

  // ── Mobile menu ────────────────────────────────────────────────
  function toggleMenu(open) {
    const isOpen = open ?? mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open', !isOpen);
    hamburger.setAttribute('aria-expanded', String(!isOpen));
  }

  hamburger?.addEventListener('click', () => toggleMenu());

  // Close on mobile link click
  mobileMenu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => toggleMenu(true));
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && mobileMenu?.classList.contains('open')) {
      toggleMenu(true);
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu?.classList.contains('open')) {
      toggleMenu(true);
      hamburger?.focus();
    }
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}
