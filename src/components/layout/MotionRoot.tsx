'use client';
import { useEffect } from 'react';
export function MotionRoot() {
  useEffect(() => {
    let dispose: (() => void) | undefined;
    let generation = 0;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      const current = ++generation;
      dispose?.();
      dispose = undefined;
      if (media.matches) return;
      void import('@/lib/motion/runtime')
        .then(({ mountMotion }) => {
          if (current === generation) dispose = mountMotion(document.body);
        })
        .catch(() => {
          /* Progressive enhancement: the static page remains visible. */
        });
    };
    update();
    media.addEventListener('change', update);
    return () => {
      generation++;
      dispose?.();
      media.removeEventListener('change', update);
    };
  }, []);
  return (
    <div className="motion-decoration" aria-hidden="true">
      <div className="scroll-progress" />
      <div className="intro-line" />
      <div className="film-grain" />
      <div className="cursor-dot" />
      <div className="cursor-ring" />
    </div>
  );
}
