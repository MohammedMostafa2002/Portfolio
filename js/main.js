/**
 * main.js — Entry point
 * Orchestrates component loading and initializes all modules.
 */

import { initTheme }    from './theme.js';
import { initNav }      from './nav.js';
import { initHero }     from './hero.js';
import { initReveal }   from './reveal.js';
import { initSkills }   from './skills.js';
import { initProjects } from './projects.js';
import { initContact }  from './contact.js';
import { initProfile }  from './profile.js';
import { initApiPlayground } from './api-playground.js';

/** Fetch and inject an HTML component into a target element */
async function loadComponent(url, targetId) {
  try {
    const res  = await fetch(`${url}?t=${Date.now()}`);
    if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
    const html = await res.text();
    const el   = document.getElementById(targetId);
    if (el) el.innerHTML = html;
  } catch (err) {
    console.error('[Portfolio] Component load error:', err);
  }
}

/** Boot sequence */
async function init() {
  // 1. Apply saved theme ASAP to avoid flash
  initTheme();

  // 2. Load all components in parallel
  await Promise.all([
    loadComponent('components/nav.html',     'nav-root'),
    loadComponent('components/hero.html',    'hero-root'),
    loadComponent('components/about.html',   'about-root'),
    loadComponent('components/skills.html',  'skills-root'),
    loadComponent('components/projects.html','projects-root'),
    loadComponent('components/contact.html', 'contact-root'),
  ]);

  // 3. Set footer year
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 4. Init all interactive modules (DOM is ready)
  initNav();
  initHero();
  initReveal();
  initSkills();
  initProjects();
  initContact();
  initProfile();
  initApiPlayground();
}

init();
