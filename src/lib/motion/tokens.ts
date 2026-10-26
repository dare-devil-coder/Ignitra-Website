// Shared timing contract for the lazily loaded Stage 3 motion system.
export const motion = {
  ease: 'power3.out',
  easeInOut: 'power3.inOut',
  micro: 0.25,
  reveal: 0.95,
  intro: 1.8,
  theme: 0.35,
  stagger: 0.08,
  distance: 40,
  scrub: 1,
  lenisLerp: 0.1,
} as const;
