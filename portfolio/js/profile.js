/**
 * profile.js — Hero profile photo interactions
 * Canvas particles (rAF + IntersectionObserver) + cursor proximity (rAF throttled)
 */

export function initProfile() {
  const container = document.querySelector('.profile-frame-container');
  if (!container) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas  = container.querySelector('.profile-particle-canvas');

  if (!reduced && canvas) initCanvasParticles(canvas, container);
  if (reduced) return;

  const hero     = document.getElementById('hero');
  const glow     = container.querySelector('.profile-glow');
  const frags    = container.querySelectorAll('.frag');
  const hexInner = container.querySelector('.profile-hex-inner');
  const waveform = container.querySelector('.profile-waveform');
  const layer    = container.querySelector('.profile-particles');

  if (!hero) return;

  let mouseX = 0, mouseY = 0, inside = false, scheduled = false, timer = null;

  function tick() {
    scheduled = false;
    const rect = container.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const nx = Math.max(0, Math.min(1, (mouseX - rect.left) / rect.width));
    const ny = Math.max(0, Math.min(1, (mouseY - rect.top) / rect.height));
    const proximity = Math.max(0, 1 - Math.hypot(mouseX - cx, mouseY - cy) / (Math.max(window.innerWidth, window.innerHeight) * 0.4));

    container.style.setProperty('--mx', nx.toFixed(3));
    container.style.setProperty('--my', ny.toFixed(3));

    const px = ((nx - 0.5) * 6).toFixed(1);
    const py = ((ny - 0.5) * 6).toFixed(1);

    if (glow) {
      glow.style.opacity = (0.35 + proximity * 0.55).toFixed(2);
      glow.style.transform = `translate(${px}px, ${py}px)`;
    }
    if (hexInner) {
      hexInner.style.transform = `translate(${px}px, ${py}px) scale(${1 + proximity * 0.02})`;
    }
    if (waveform) {
      waveform.style.setProperty('--wave-duration', `${(1.8 - proximity * 0.9).toFixed(2)}s`);
      waveform.style.opacity = (0.5 + proximity * 0.4).toFixed(2);
    }
    frags.forEach((f, i) => {
      const d = (i % 3 + 1) * 0.5;
      f.style.transform = `translate(${px * d}px, ${py * d}px)`;
    });
  }

  function onMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (inside && !scheduled) {
      scheduled = true;
      requestAnimationFrame(tick);
    }
  }

  function reset() {
    container.style.setProperty('--mx', '0.5');
    container.style.setProperty('--my', '0.5');
    if (glow) { glow.style.opacity = ''; glow.style.transform = ''; }
    if (hexInner) hexInner.style.transform = '';
    if (waveform) { waveform.style.removeProperty('--wave-duration'); waveform.style.opacity = ''; }
    frags.forEach(f => { f.style.transform = ''; });
  }

  hero.addEventListener('mouseenter', () => { inside = true; });
  hero.addEventListener('mousemove', onMove, { passive: true });
  hero.addEventListener('mouseleave', () => { inside = false; reset(); });

  if (!layer) return;
  container.addEventListener('mouseenter', () => { timer = setInterval(() => spawnParticle(layer), 400); });
  container.addEventListener('mouseleave', () => { if (timer) clearInterval(timer); });
}

function initCanvasParticles(canvas, container) {
  const ctx = canvas.getContext('2d');
  let pts = [], raf = null, visible = false, accent = '#4F8EF7';

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function seed() {
    pts = Array.from({ length: 18 }, () => ({
      x: Math.random() * canvas.clientWidth,
      y: Math.random() * canvas.clientHeight,
      r: 1 + Math.random() * 2,
      vy: 0.3 + Math.random() * 0.5,
      a: 0.15 + Math.random() * 0.4,
    }));
  }

  function loop() {
    if (!visible) { raf = null; return; }
    const w = canvas.clientWidth, h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);
    for (const p of pts) {
      p.y -= p.vy;
      if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w; }
      ctx.globalAlpha = p.a;
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(loop);
  }

  function start() {
    if (raf) return;
    accent = getComputedStyle(container).getPropertyValue('--accent').trim() || accent;
    resize(); seed();
    raf = requestAnimationFrame(loop);
  }

  function stop() { if (raf) cancelAnimationFrame(raf); raf = null; }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop(); }, { threshold: 0.1 }).observe(container);
}

function spawnParticle(layer) {
  const p = document.createElement('span');
  p.classList.add('particle', 'particle--live');
  const size = 2 + Math.random() * 3;
  const dur = 2 + Math.random() * 2;
  p.style.cssText = `left:${Math.random()*100}%;top:${60+Math.random()*40}%;--p-size:${size}px;--p-dur:${dur}s;--p-dx:${(Math.random()-0.5)*40}px;--p-dy:-${30+Math.random()*50}px;width:${size}px;height:${size}px;animation:particleDrift ${dur}s ease-in-out forwards;`;
  layer.appendChild(p);
  setTimeout(() => p.remove(), dur * 1000 + 100);
}
