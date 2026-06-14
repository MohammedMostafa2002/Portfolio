/**
 * hero.js — Typing animation for hero title
 * Cycles through an array of role titles with a realistic
 * type / pause / erase effect.
 */

const TITLES = [
  'Full Stack .NET Developer',
  'Backend Engineer',
  'AI / GenAI Builder',
  'ASP.NET Core Specialist',
];

const TYPE_SPEED   = 60;   // ms per character typed
const ERASE_SPEED  = 35;   // ms per character erased
const PAUSE_AFTER  = 1800; // ms to pause at end of word
const PAUSE_BEFORE = 400;  // ms to pause before retyping

export function initHero() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  let titleIdx = 0;
  let charIdx  = 0;
  let erasing  = false;

  function tick() {
    const current = TITLES[titleIdx];

    if (!erasing) {
      // Typing forward
      charIdx++;
      el.textContent = current.slice(0, charIdx);

      if (charIdx === current.length) {
        // Finished typing — pause then erase
        erasing = true;
        setTimeout(tick, PAUSE_AFTER);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    } else {
      // Erasing
      charIdx--;
      el.textContent = current.slice(0, charIdx);

      if (charIdx === 0) {
        // Finished erasing — move to next title
        erasing  = false;
        titleIdx = (titleIdx + 1) % TITLES.length;
        setTimeout(tick, PAUSE_BEFORE);
        return;
      }
      setTimeout(tick, ERASE_SPEED);
    }
  }

  // Small initial delay so the animation starts after the fade-in
  setTimeout(tick, 800);
}
