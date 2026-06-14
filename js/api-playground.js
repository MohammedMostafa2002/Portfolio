/**
 * api-playground.js — Interactive .NET Minimal API demo
 */

const LOAD_MS = 1100;
const LINE_MS = 75;
const COOLDOWN = 3500;

export function initApiPlayground() {
  const root = document.getElementById('api-playground');
  if (!root) return;

  const btn    = root.querySelector('.api-send-btn');
  const loader = root.querySelector('.api-loader');
  const json   = root.querySelector('.api-json');
  const status = root.querySelector('.api-status-badge');
  const lines  = root.querySelectorAll('.json-line');

  if (!btn || !loader || !json || !status) return;

  let busy = false, last = 0, timers = [];

  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  function reset() {
    clearTimers();
    json.classList.remove('is-visible');
    lines.forEach(l => l.classList.remove('is-visible'));
    status.textContent = '—';
    status.className = 'api-status-badge';
  }

  async function run(force = false) {
    if (busy) return;
    const now = Date.now();
    if (!force && now - last < COOLDOWN && root.dataset.done === '1') return;

    busy = true;
    last = now;
    root.dataset.done = '1';
    reset();

    loader.classList.add('is-active');
    loader.setAttribute('aria-hidden', 'false');
    status.textContent = '…';
    status.classList.add('is-pending');
    btn.classList.add('is-sending');

    await new Promise(r => setTimeout(r, LOAD_MS));

    loader.classList.remove('is-active');
    loader.setAttribute('aria-hidden', 'true');
    status.textContent = '200 OK';
    status.className = 'api-status-badge is-success';
    json.classList.add('is-visible');

    lines.forEach((line, i) => {
      timers.push(setTimeout(() => line.classList.add('is-visible'), i * LINE_MS));
    });

    btn.classList.remove('is-sending');
    busy = false;
  }

  btn.addEventListener('click', () => run(true));
  root.addEventListener('mouseenter', () => {
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) run(false);
  });

  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && root.dataset.done !== '1') run(false);
  }, { threshold: 0.45 }).observe(root);
}
