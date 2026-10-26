import { motion } from '@/lib/motion/tokens';
let active: ViewTransition | undefined;
let requested: string | undefined;
let fallbackTimer: ReturnType<typeof setTimeout> | undefined;
export function switchTheme(button: HTMLElement) {
  const root = document.documentElement;
  const next = (requested ?? root.dataset.theme) === 'light' ? 'dark' : 'light';
  requested = next;
  const apply = () => {
    root.dataset.theme = next;
    root.style.colorScheme = next;
    try {
      localStorage.setItem('ignitra-theme', next);
    } catch {}
    window.dispatchEvent(new Event('ignitra-theme-change'));
  };
  active?.skipTransition();
  clearTimeout(fallbackTimer);
  root.classList.remove('theme-fading');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    apply();
    requested = undefined;
    return;
  }
  if (!document.startViewTransition) {
    root.classList.add('theme-fading');
    apply();
    requested = undefined;
    fallbackTimer = setTimeout(
      () => root.classList.remove('theme-fading'),
      motion.theme * 1000,
    );
    return;
  }
  const rect = button.getBoundingClientRect(),
    x = rect.left + rect.width / 2,
    y = rect.top + rect.height / 2;
  const radius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  );
  const transition = document.startViewTransition(apply);
  active = transition;
  void transition.ready
    .then(() => {
      root.animate(
        {
          clipPath: [
            'circle(0px at ' + x + 'px ' + y + 'px)',
            'circle(' + radius + 'px at ' + x + 'px ' + y + 'px)',
          ],
        },
        {
          duration: motion.theme * 1000,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          pseudoElement: '::view-transition-new(root)',
        },
      );
    })
    .catch(() => {
      /* Superseded transitions still apply the requested theme. */
    });
  void transition.finished
    .finally(() => {
      if (active === transition) {
        active = undefined;
        requested = undefined;
      }
    })
    .catch(() => {});
}
