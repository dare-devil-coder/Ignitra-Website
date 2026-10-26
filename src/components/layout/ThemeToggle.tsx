'use client';
import { switchTheme } from '@/lib/theme/transition';

import { useSyncExternalStore } from 'react';
import { themeLabels } from '@/lib/content';
const subscribe = (callback: () => void) => {
  window.addEventListener('ignitra-theme-change', callback);
  return () => window.removeEventListener('ignitra-theme-change', callback);
};
const snapshot = () => document.documentElement.dataset.theme === 'light';
export function ThemeToggle() {
  const light = useSyncExternalStore(subscribe, snapshot, () => false);
  return (
    <button
      type="button"
      className="icon-button theme-toggle"
      aria-label={light ? themeLabels.dark : themeLabels.light}
      title={light ? themeLabels.dark : themeLabels.light}
      aria-pressed={light}
      onClick={(event) => switchTheme(event.currentTarget)}
    >
      <svg
        aria-hidden="true"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        {light ? (
          <path d="M20.4 14.5A8.5 8.5 0 0 1 9.5 3.6a8.5 8.5 0 1 0 10.9 10.9Z" />
        ) : (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5" />
          </>
        )}
      </svg>
    </button>
  );
}
