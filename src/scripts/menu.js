// Menus: opens the mobile drawer, and adds keyboard and touch behaviour to the desktop mega menu
// (which opens on hover and keyboard focus with CSS alone).

import { openDialog, setupDialog } from './dialogs.js';
import './tabs.js'; // department tabs inside the drawer

const drawer = document.getElementById('menu');
if (drawer) setupDialog(drawer);

document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-open-menu]');
  if (trigger) openDialog(drawer, trigger);
});

const nav = document.querySelector('.nav');
if (nav) {
  // Mega menu photos are only fetched the first time their menu opens
  const loadPhotos = (event) => {
    const item = event.target.closest?.('.nav__item.has-mega');
    for (const img of item?.querySelectorAll('img[data-src]') ?? []) {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    }
  };
  nav.addEventListener('pointerover', loadPhotos);
  nav.addEventListener('focusin', loadPhotos);

  const closeAll = () => nav.querySelectorAll('.nav__item.is-open').forEach((item) => item.classList.remove('is-open'));

  // Esc closes an open mega menu and returns focus to its top link
  nav.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const item = event.target.closest('.nav__item.has-mega');
    if (!item) return;
    item.classList.remove('is-open');
    item.classList.add('is-dismissed');
    item.querySelector('.nav__link').focus();
  });
  nav.addEventListener('focusout', (event) => {
    const item = event.target.closest('.nav__item');
    if (item && !item.contains(event.relatedTarget)) item.classList.remove('is-dismissed');
  });
  nav.addEventListener('pointerleave', () => nav.querySelectorAll('.is-dismissed').forEach((i) => i.classList.remove('is-dismissed')));

  // Touch screens wide enough for the desktop menu (e.g. tablets): first tap opens, second tap follows the link
  nav.addEventListener('click', (event) => {
    const link = event.target.closest('.nav__item.has-mega > .nav__link');
    if (!link || !matchMedia('(hover: none)').matches) return;
    const item = link.parentElement;
    if (item.classList.contains('is-open')) return;
    event.preventDefault();
    closeAll();
    item.classList.add('is-open');
  });
  document.addEventListener('click', (event) => {
    if (!nav.contains(event.target)) closeAll();
  });
}
