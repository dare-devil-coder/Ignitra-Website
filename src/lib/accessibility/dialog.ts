import type { KeyboardEvent } from 'react';
export function trapDialogTab(event: KeyboardEvent<HTMLDialogElement>) {
  if (event.key !== 'Tab') return;
  const controls = Array.from(
    event.currentTarget.querySelectorAll<HTMLElement>(
      'a[href],button:not(:disabled),input:not(:disabled):not([type="hidden"]),textarea:not(:disabled),[tabindex]',
    ),
  ).filter((e) => e.tabIndex >= 0 && e.getClientRects().length > 0);
  const first = controls[0],
    last = controls.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
}
