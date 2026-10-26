import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { motion } from './tokens';
import { sceneMotion } from './scene-state';
gsap.registerPlugin(ScrollTrigger);

/** Owns every page-level timeline, observer, listener and ticker subscription. */
export function mountMotion(root: HTMLElement) {
  let disposed = false;
  const cleanups: (() => void)[] = [];
  const q = <T extends HTMLElement>(selector: string) =>
    root.querySelector<T>(selector)!;
  const all = <T extends HTMLElement>(selector: string) => [
    ...root.querySelectorAll<T>(selector),
  ];
  const listen = (target: EventTarget, type: string, fn: EventListener) => {
    target.addEventListener(type, fn);
    cleanups.push(() => target.removeEventListener(type, fn));
  };
  const splitRestores: (() => void)[] = [];
  const split = (heading: HTMLElement) => {
    const original = heading.textContent ?? '';
    const fragment = document.createDocumentFragment();
    for (const word of original.split(/(\s+)/)) {
      if (/^\s+$/.test(word)) {
        fragment.append(document.createTextNode(word));
        continue;
      }
      const mask = document.createElement('span'),
        inner = document.createElement('span');
      mask.className = 'motion-word-mask';
      inner.className = 'motion-word';
      inner.textContent = word;
      mask.append(inner);
      fragment.append(mask);
    }
    heading.replaceChildren(fragment);
    splitRestores.push(() => {
      heading.textContent = original;
    });
    return [...heading.querySelectorAll<HTMLElement>('.motion-word')];
  };
  const ctx = gsap.context(() => {
    const responsive = gsap.matchMedia();
    cleanups.push(() => responsive.revert());
    const introLine = q('.intro-line');
    let firstVisit = false;
    try {
      firstVisit = !sessionStorage.getItem('ignitra-intro-seen');
      sessionStorage.setItem('ignitra-intro-seen', '1');
    } catch {
      /* No storage: skip intro. */
    }
    if (firstVisit && scrollY < 10) {
      gsap
        .timeline()
        .set(introLine, { opacity: 1, scaleX: 0 })
        .to(introLine, { scaleX: 1, duration: 0.6, ease: motion.ease })
        .to(introLine, { opacity: 0, duration: 0.25 });
    }
    // Keep the LCP headline stable on touch/mobile; desktop owns the intro choreography.
    if (matchMedia('(min-width: 768px) and (pointer: fine)').matches) {
      const heroWords = split(q('#hero-h'));
      const heroLines = [...new Set(heroWords.map((w) => w.offsetTop))];
      if (scrollY < innerHeight) {
        gsap
          .timeline({ defaults: { ease: motion.ease } })
          .from(
            heroWords,
            {
              yPercent: 110,
              opacity: 0,
              duration: 1.4,
              stagger: (i) =>
                heroLines.indexOf(heroWords[i].offsetTop) * motion.stagger,
            },
            firstVisit ? 0.2 : 0,
          )
          .from(q('.hero-copy > .eyebrow'), { opacity: 0, duration: 0.6 }, 0)
          .from(
            [q('.hero-intro'), q('.hero .button-row'), q('.hero-visual')],
            {
              y: motion.distance / 2,
              opacity: 0,
              duration: 1,
              stagger: motion.stagger,
            },
            0.4,
          );
      }
    }
    // Already visible content remains visible when scripts load late or restore scroll.
    for (const heading of all<HTMLElement>('.section-header h2, .cta h2')) {
      if (heading.getBoundingClientRect().top < innerHeight * 0.95) continue;
      const words = split(heading);
      const rows = [...new Set(words.map((w) => w.offsetTop))];
      gsap.from(words, {
        yPercent: 110,
        opacity: 0,
        duration: motion.reveal,
        ease: motion.ease,
        stagger: (i) => rows.indexOf(words[i].offsetTop) * motion.stagger,
        scrollTrigger: { trigger: heading, start: 'top 92%', once: true },
      });
    }
    for (const section of all('.section:not(.hero)')) {
      const targets = [
        ...section.querySelectorAll<HTMLElement>(
          '.section-intro, .service-row, .problem-row, .why-card, .start-grid, .compound-row',
        ),
      ];
      const upcoming = targets.filter(
        (el) => el.getBoundingClientRect().top >= innerHeight * 0.95,
      );
      upcoming.forEach((el) => {
        const tween = gsap.from(el, {
          y: motion.distance,
          opacity: 0,
          scale: el.matches('.why-card') ? 0.96 : 1,
          duration: motion.reveal,
          ease: motion.ease,
          paused: true,
          onComplete: () => gsap.set(el, { clearProps: 'transform,opacity' }),
        });
        ScrollTrigger.create({
          trigger: el,
          start: 'top 94%',
          once: true,
          onEnter: () => tween.play(),
        });
        const focus = () => tween.progress(1);
        listen(el, 'focusin', focus);
      });
    }
    for (const img of all('.why-card img')) {
      gsap.from(img, {
        clipPath: 'inset(100% 0 0 0)',
        scale: 1.15,
        duration: 1.05,
        ease: motion.ease,
        clearProps: 'transform,clipPath',
        scrollTrigger: { trigger: img, start: 'top 97%', once: true },
      });
    }
    gsap.fromTo(
      q('.scroll-progress'),
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 0,
          end: 'max',
          scrub: true,
        },
      },
    );
    const nav = q('.nav-wrap');
    const navTo = gsap.quickTo(nav, 'yPercent', {
      duration: 0.3,
      ease: motion.ease,
    });
    let lastY = scrollY;
    let hidden = false;
    const showNav = () => {
      hidden = false;
      navTo(0);
    };
    const navScroll = () => {
      const delta = scrollY - lastY;
      if (Math.abs(delta) < 8) return;
      const shouldHide =
        scrollY >= 140 &&
        delta > 0 &&
        !nav.contains(document.activeElement) &&
        !document.querySelector('dialog[open]');
      if (shouldHide !== hidden) {
        hidden = shouldHide;
        navTo(hidden ? -150 : 0);
      }
      lastY = scrollY;
    };
    listen(window, 'scroll', navScroll);
    listen(nav, 'focusin', showNav);
    responsive.add('(min-width: 1024px) and (pointer: fine)', () => {
      const device = navigator as Navigator & {
        deviceMemory?: number;
        connection?: { saveData?: boolean };
      };
      if (
        device.connection?.saveData ||
        (device.deviceMemory ?? 8) < 4 ||
        navigator.hardwareConcurrency < 4
      )
        return;
      root.classList.add('motion-desktop');
      const lenis = new Lenis({
        lerp: motion.lenisLerp,
        autoRaf: false,
        syncTouch: false,
        anchors: false,
        prevent: (node) => !!node.closest('dialog'),
      });
      const update = () => ScrollTrigger.update();
      lenis.on('scroll', update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      const modalChange = () => {
        if (document.querySelector('dialog[open]')) lenis.stop();
        else lenis.start();
      };
      const modalObserver = new MutationObserver(modalChange);
      root.querySelectorAll('dialog').forEach((dialog) =>
        modalObserver.observe(dialog, {
          attributes: true,
          attributeFilter: ['open'],
        }),
      );
      modalChange();
      // Keep native anchor semantics/history/focus; only ease the scroll itself.
      const anchors = (event: MouseEvent) => {
        if (
          event.defaultPrevented ||
          event.button ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        const link = (event.target as Element).closest<HTMLAnchorElement>(
          'a[href^="#"]',
        );
        if (
          !link ||
          link.hasAttribute('data-consultation') ||
          link.classList.contains('skip-link')
        )
          return;
        const href = link.getAttribute('href')!;
        const target = document.getElementById(href.slice(1));
        if (!target) return;
        event.preventDefault();
        history.pushState(null, '', href);
        lenis.scrollTo(target, {
          offset: -112,
          onComplete: () => {
            const original = target.getAttribute('tabindex');
            target.tabIndex = -1;
            target.focus({ preventScroll: true });
            if (original === null) target.removeAttribute('tabindex');
            else target.setAttribute('tabindex', original);
          },
        });
      };
      root.addEventListener('click', anchors);
      const hero = q('.hero');
      if (innerHeight >= 750)
        gsap.to(sceneMotion, {
          hero: 1,
          ease: 'none',
          scrollTrigger: {
            id: 'hero-flight',
            trigger: hero,
            start: 'top top',
            end: () => '+=' + Math.min(innerHeight * 0.45, 450),
            pin: true,
            scrub: motion.scrub,
            invalidateOnRefresh: true,
          },
        });
      const engine = q('.engine');
      engine.classList.add('motion-engine');
      const rail = q('.engine-visual'),
        steps = q('.engine-steps');
      ScrollTrigger.create({
        id: 'engine-pin',
        trigger: rail,
        start: 'top 140px',
        endTrigger: steps,
        end: 'bottom 65%',
        pin: rail,
        pinSpacing: false,
        invalidateOnRefresh: true,
      });
      gsap.to(sceneMotion, {
        engine: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: steps,
          start: 'top 65%',
          end: 'bottom 65%',
          scrub: motion.scrub,
        },
      });
      gsap.fromTo(
        q('.engine-progress i'),
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: steps,
            start: 'top 65%',
            end: 'bottom 65%',
            scrub: motion.scrub,
          },
        },
      );
      all('.engine-step').forEach((step) =>
        ScrollTrigger.create({
          trigger: step,
          start: 'top 65%',
          end: 'bottom 65%',
          toggleClass: 'engine-step-active',
        }),
      );
      gsap.to(q('.hero-glow'), {
        y: 90,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: motion.scrub,
        },
      });
      const trails = gsap.to(all('.light-trails i'), {
        yPercent: -160,
        xPercent: 30,
        opacity: 0,
        duration: 4,
        stagger: 1.1,
        repeat: -1,
        ease: 'none',
        paused: true,
      });
      const trailObserver = new IntersectionObserver(([entry]) => {
        root.dataset.heroInView = String(entry.isIntersecting);
        if (entry.isIntersecting && !document.hidden) trails.play();
        else trails.pause();
      });
      trailObserver.observe(hero);
      const visibility = () => {
        if (document.hidden) trails.pause();
        else if (root.dataset.heroInView === 'true') trails.play();
      };
      document.addEventListener('visibilitychange', visibility);
      const dot = q('.cursor-dot'),
        ring = q('.cursor-ring');
      const dx = gsap.quickSetter(dot, 'x', 'px'),
        dy = gsap.quickSetter(dot, 'y', 'px');
      const rx = gsap.quickTo(ring, 'x', { duration: 0.35, ease: motion.ease }),
        ry = gsap.quickTo(ring, 'y', { duration: 0.35, ease: motion.ease });
      const sx = gsap.quickTo(sceneMotion, 'pointerX', {
          duration: 0.7,
          ease: motion.ease,
        }),
        sy = gsap.quickTo(sceneMotion, 'pointerY', {
          duration: 0.7,
          ease: motion.ease,
        });
      const magnets = all<HTMLAnchorElement>(
        '.hero .button-primary, .cta .button-primary',
      ).map((el) => ({
        el,
        rect: el.getBoundingClientRect(),
        x: gsap.quickTo(el, 'x', { duration: 0.4, ease: motion.ease }),
        y: gsap.quickTo(el, 'y', { duration: 0.4, ease: motion.ease }),
      }));
      let stale = true;
      const invalidate = () => {
        stale = true;
      };
      const pointer = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') return;
        const modal = !!document.querySelector('dialog[open]');
        root.classList.toggle('cursor-active', !modal);
        dx(event.clientX);
        dy(event.clientY);
        rx(event.clientX);
        ry(event.clientY);
        root.classList.toggle(
          'cursor-interactive',
          !!(event.target as Element).closest(
            'a,button,input,textarea,[tabindex="0"]',
          ),
        );
        sx((event.clientX / innerWidth - 0.5) * 2);
        sy((event.clientY / innerHeight - 0.5) * 2);
        if (stale) {
          magnets.forEach((m) => {
            m.rect = m.el.getBoundingClientRect();
          });
          stale = false;
        }
        magnets.forEach((m) => {
          const rect = m.rect,
            x = event.clientX - rect.left - rect.width / 2,
            y = event.clientY - rect.top - rect.height / 2;
          const near =
            !modal &&
            Math.abs(x) < rect.width / 2 + 80 &&
            Math.abs(y) < rect.height / 2 + 80 &&
            document.activeElement !== m.el;
          m.x(near ? x * 0.08 : 0);
          m.y(near ? y * 0.08 : 0);
        });
      };
      const leave = () => {
        root.classList.remove('cursor-active');
        sx(0);
        sy(0);
        magnets.forEach((m) => {
          m.x(0);
          m.y(0);
        });
      };
      window.addEventListener('pointermove', pointer);
      document.addEventListener('pointerleave', leave);
      window.addEventListener('scroll', invalidate);
      window.addEventListener('resize', invalidate);
      return () => {
        root.classList.remove(
          'motion-desktop',
          'cursor-active',
          'cursor-interactive',
        );
        engine.classList.remove('motion-engine');
        lenis.off('scroll', update);
        gsap.ticker.remove(tick);
        lenis.destroy();
        modalObserver.disconnect();
        trailObserver.disconnect();
        root.removeEventListener('click', anchors);
        window.removeEventListener('pointermove', pointer);
        document.removeEventListener('pointerleave', leave);
        window.removeEventListener('scroll', invalidate);
        window.removeEventListener('resize', invalidate);
        document.removeEventListener('visibilitychange', visibility);
        sceneMotion.hero = 0;
        sceneMotion.engine = 0;
        sceneMotion.pointerX = 0;
        sceneMotion.pointerY = 0;
      };
    });
    // Dynamic loop descriptions can change section height. Only refresh when it actually does.
    let resizeFrame = 0;
    const heights = new WeakMap<Element, number>();
    const resize = new ResizeObserver((entries) => {
      let changed = false;
      entries.forEach((entry) => {
        const height = entry.contentRect.height;
        if (heights.get(entry.target) !== height) {
          changed = true;
          heights.set(entry.target, height);
        }
      });
      if (changed) {
        cancelAnimationFrame(resizeFrame);
        resizeFrame = requestAnimationFrame(() => {
          if (!disposed) ScrollTrigger.refresh();
        });
      }
    });
    all('.section > .container').forEach((el) => resize.observe(el));
    cleanups.push(() => {
      resize.disconnect();
      cancelAnimationFrame(resizeFrame);
    });
    void document.fonts.ready.then(() => {
      if (!disposed) ScrollTrigger.refresh();
    });
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  }, root);
  root.dataset.motionReady = 'true';
  return () => {
    disposed = true;
    cleanups.reverse().forEach((cleanup) => cleanup());
    ctx.revert();
    splitRestores.forEach((restore) => restore());
    delete root.dataset.motionReady;
    delete root.dataset.heroInView;
  };
}
