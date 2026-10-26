'use client';
import dynamic from 'next/dynamic';
import { Component, useEffect, useRef, useState, type ReactNode } from 'react';
class SceneBoundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
const RocketCanvas = dynamic(() => import('./RocketCanvas'), { ssr: false });
export function RocketIsland({
  children,
  variant,
  className = '',
}: {
  children: ReactNode;
  variant: 'hero' | 'engine';
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const media = matchMedia(
      '(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    );
    const device = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean };
    };
    let visible = false;
    const update = () => {
      const eligible =
        media.matches &&
        typeof WebGL2RenderingContext !== 'undefined' &&
        !device.connection?.saveData &&
        (device.deviceMemory ?? 8) >= 4 &&
        navigator.hardwareConcurrency >= 4;
      setEnabled(eligible);
      setActive(eligible && visible && !document.hidden);
      if (!eligible) setReady(false);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        update();
      },
      { rootMargin: '120px' },
    );
    observer.observe(host.current!);
    media.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);
    update();
    return () => {
      observer.disconnect();
      media.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', update);
    };
  }, []);
  // Once first visible, retain one scene across scrolling and theme changes.
  const [visited, setVisited] = useState(false);
  useEffect(() => {
    if (active) {
      const id = requestAnimationFrame(() => setVisited(true));
      return () => cancelAnimationFrame(id);
    }
  }, [active]);
  return (
    <div
      ref={host}
      className={
        'rocket-stage ' + className + (ready && enabled ? ' scene-ready' : '')
      }
      data-scene={variant}
      data-scene-active={active}
    >
      {children}
      {enabled && visited && (
        <SceneBoundary onFailure={() => setReady(false)}>
          <RocketCanvas
            variant={variant}
            active={active}
            onReady={() => setReady(true)}
            onFailure={() => setReady(false)}
          />
        </SceneBoundary>
      )}
    </div>
  );
}
