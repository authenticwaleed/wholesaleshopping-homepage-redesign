// Fades sections in as they scroll into view. base.css only hides [data-reveal] when JavaScript runs
// and the visitor hasn't asked for reduced motion, so content is never lost without this script.

const sections = document.querySelectorAll('[data-reveal]');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -5% 0px' },
  );
  sections.forEach((section) => observer.observe(section));
} else {
  sections.forEach((section) => section.classList.add('is-visible'));
}
