// Tabbed product rows: standard ARIA tabs (click, arrow keys, Home/End) plus desktop scroll arrows.

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

for (const root of document.querySelectorAll('[data-tabs]')) {
  const tabs = [...root.querySelectorAll('[role="tab"]')];

  const select = (tab, moveFocus = false) => {
    for (const t of tabs) {
      const selected = t === tab;
      t.setAttribute('aria-selected', String(selected));
      t.tabIndex = selected ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !selected;
    }
    if (moveFocus) tab.focus();
    tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  };

  root.querySelector('[role="tablist"]').addEventListener('click', (event) => {
    const tab = event.target.closest('[role="tab"]');
    if (tab) select(tab);
  });

  root.querySelector('[role="tablist"]').addEventListener('keydown', (event) => {
    const current = tabs.indexOf(document.activeElement);
    if (current < 0) return;
    const next = { ArrowRight: current + 1, ArrowLeft: current - 1, Home: 0, End: tabs.length - 1 }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    select(tabs[(next + tabs.length) % tabs.length], true);
  });

  const scrollRail = (direction) => {
    const rail = root.querySelector('[role="tabpanel"]:not([hidden]) [data-rail]');
    rail?.scrollBy({ left: direction * rail.clientWidth * 0.9, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
  };
  root.querySelector('[data-rail-prev]')?.addEventListener('click', () => scrollRail(-1));
  root.querySelector('[data-rail-next]')?.addEventListener('click', () => scrollRail(1));
}
