/**
 * reveal.js — Scroll-triggered fade-in animations
 * Uses IntersectionObserver for performance.
 * Respects prefers-reduced-motion.
 */

export function initReveal() {
  // Honour reduced-motion preference — elements are already visible via CSS
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger delay for siblings
          const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
          const idx      = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${idx * 70}ms`;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
