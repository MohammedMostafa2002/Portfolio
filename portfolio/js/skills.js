/**
 * skills.js — Animate skill progress bars when they enter the viewport
 * Uses IntersectionObserver so bars only fill once visible.
 */

export function initSkills() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Instantly fill all bars
    document.querySelectorAll('.skill-fill').forEach(bar => bar.classList.add('animated'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Stagger each bar within the group
          const bars = entry.target.querySelectorAll('.skill-fill');
          bars.forEach((bar, i) => {
            setTimeout(() => bar.classList.add('animated'), i * 120);
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  document.querySelectorAll('.skill-group').forEach(group => observer.observe(group));
}
