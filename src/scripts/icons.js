// The few icons that browser scripts draw themselves (same Lucide shapes as components/Icon.astro).

const svg = (body, size = 20) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;

export const icons = {
  plus: svg('<path d="M5 12h14"/><path d="M12 5v14"/>', 18),
  minus: svg('<path d="M5 12h14"/>', 18),
  close: svg('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>', 18),
  arrowRight: svg('<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>', 16),
};
