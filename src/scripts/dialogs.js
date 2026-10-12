// Shared behaviour for the page's <dialog> panels (menu, search, bag, Quick Add).
// showModal() gives us focus trapping, Esc to close and an inert page behind for free;
// this adds closing on a backdrop click or any [data-close] button, and returns focus afterwards.

const triggers = new WeakMap();

export function openDialog(dialog, trigger = document.activeElement) {
  if (!dialog || dialog.open) return;
  triggers.set(dialog, trigger);
  dialog.showModal();
}

export function closeDialog(dialog) {
  if (dialog?.open) dialog.close();
}

export function setupDialog(dialog) {
  if (!dialog || dialog.dataset.ready) return;
  dialog.dataset.ready = 'true';

  dialog.addEventListener('click', (event) => {
    // The dialog element itself only receives clicks outside its inner panel, i.e. on the backdrop.
    if (event.target === dialog || event.target.closest('[data-close]')) closeDialog(dialog);
  });

  dialog.addEventListener('close', () => {
    const trigger = triggers.get(dialog);
    if (trigger?.isConnected) trigger.focus({ preventScroll: true });
  });
}

export const escapeHtml = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
