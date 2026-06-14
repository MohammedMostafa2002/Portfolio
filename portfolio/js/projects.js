/**
 * projects.js — Client-side project filtering
 * Filters project cards by category tag with smooth transitions.
 */

export function initProjects() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.project-card');
  const emptyState = document.getElementById('projects-empty');
  const grid       = document.getElementById('projects-grid');

  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter cards
      let visibleCount = 0;

      cards.forEach(card => {
        const categories = card.dataset.categories?.split(' ') ?? [];
        const matches    = filter === 'all' || categories.includes(filter);

        if (matches) {
          card.classList.remove('hidden');
          card.removeAttribute('aria-hidden');
          visibleCount++;
        } else {
          card.classList.add('hidden');
          card.setAttribute('aria-hidden', 'true');
        }
      });

      // Toggle empty state
      if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
      }

      // Re-trigger reveal for newly visible cards
      setTimeout(() => {
        cards.forEach(card => {
          if (!card.classList.contains('hidden') && !card.classList.contains('visible')) {
            card.classList.add('visible');
          }
        });
      }, 50);
    });
  });
}
