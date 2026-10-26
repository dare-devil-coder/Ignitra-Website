'use client';
import { trapDialogTab } from '@/lib/accessibility/dialog';
import { useEffect, useRef } from 'react';
import { accessible, asset, item, state } from '@/lib/content';
import { ContentLink } from '@/components/ui/Primitives';
import { ThemeToggle } from './ThemeToggle';
export function Navigation() {
  const menu = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const close = () => menu.current?.close();
  useEffect(() => {
    const media = matchMedia('(min-width:768px)');
    const listener = () => {
      if (media.matches) menu.current?.close();
    };
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);
  const logo = item('navigation', 1),
    menuState = state('mobile-menu'),
    menuClose = menuState.items[2];
  return (
    <>
      <header data-content-section="navigation" className="nav-wrap">
        <nav
          className="nav-pill"
          aria-label={accessible('navigation', 'aria-label', 1)}
        >
          <a
            href={logo.attributes?.href}
            aria-label={logo.attributes?.['aria-label']}
            className="nav-logo"
          >
            {logo.images?.map((img, i) => (
              <img
                key={img.source}
                src={asset(img.source)}
                alt={img.alt}
                decoding="async"
                fetchPriority="low"
                width="160"
                height="28"
                className={i === 0 ? 'only-dark' : 'only-light'}
              />
            ))}
          </a>
          <div className="nav-links">
            {[2, 3, 4].map((n) => (
              <ContentLink key={n} section="navigation" n={n} />
            ))}
          </div>
          <ContentLink
            section="navigation"
            n={5}
            className="button button-primary nav-cta"
          />
          <ThemeToggle />
          <button
            ref={trigger}
            type="button"
            className="icon-button menu-trigger"
            aria-label={item('navigation', 7).attributes?.['aria-label']}
            aria-haspopup="dialog"
            onClick={() => menu.current?.showModal()}
          >
            <svg
              aria-hidden="true"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M3 8h18M3 16h18" />
            </svg>
          </button>
        </nav>
      </header>
      <dialog
        onKeyDown={trapDialogTab}
        ref={menu}
        id="mobile-menu"
        className="mobile-menu"
        aria-label={accessible('navigation', 'aria-label', 1)}
        onClose={() => trigger.current?.focus()}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <div className="mobile-menu-inner">
          <div className="menu-top">
            {menuState.items.slice(0, 2).map((img, i) => (
              <img
                key={i}
                src={asset(img.source!)}
                alt={img.attributes?.alt}
                decoding="async"
                fetchPriority="low"
                width="160"
                height="28"
                className={i === 0 ? 'only-dark' : 'only-light'}
              />
            ))}
            <button
              type="button"
              className="icon-button"
              aria-label={menuClose.attributes?.['aria-label']}
              onClick={close}
            >
              {menuClose.displayText}
            </button>
          </div>
          <div className="mobile-menu-links">
            {menuState.items.slice(3, 6).map((r, i) => (
              <a key={i} href={r.attributes?.href} onClick={close}>
                {r.displayText}
              </a>
            ))}
          </div>
          <p className="eyebrow">{menuState.items[6].displayText}</p>
          <ThemeToggle />
        </div>
      </dialog>
    </>
  );
}
