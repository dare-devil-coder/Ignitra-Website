---
version: alpha
name: Ignitra
description: Content-preserving cinematic website foundation
colors:
  ink: '#1B1B1B'
  graphite: '#323232'
  cream: '#FFE7D0'
  ember: '#FC6E20'
  bg: '{colors.ink}'
  surface: '{colors.graphite}'
  surface-alt: '{colors.graphite}'
  text: '{colors.cream}'
  text-muted: 'color-mix(in srgb, #FFE7D0 78%, #1B1B1B)'
  primary: '{colors.ember}'
  accent: '{colors.ember}'
  accent-text: '{colors.ember}'
  on-accent: '{colors.ink}'
  inverted-section: '{colors.cream}'
  inverted-text: '{colors.ink}'
typography:
  display:
    fontFamily: Archivo
    fontWeight: 700
    lineHeight: 1
    letterSpacing: -0.02em
  body:
    fontFamily: Inter
    fontWeight: 400
    lineHeight: 1.6
  mono:
    fontFamily: IBM Plex Mono
    fontWeight: 500
rounded:
  card: 1.5rem
  media: 1.75rem
  pill: 999px
spacing:
  space-1: 0.5rem
  space-2: 1rem
  space-3: 1.5rem
  space-4: 2rem
  space-6: 3rem
  space-8: 4rem
---

## Overview

Ignitra's business-growth site retains its rocket identity and existing content within the user's cinematic, spacious visual direction. Let the headline and rocket share the hero; use the growth-engine progression as the main storytelling interaction.

## Colors

Use semantic CSS variables in components. Reserve ember for calls to action, active states and restrained lighting. Use ink text on ember and cream surfaces. Preserve original brand asset pixels and locked SEO values.

## Themes

| Token                 | Dark                                     | Light                                    |
| --------------------- | ---------------------------------------- | ---------------------------------------- |
| bg                    | #1B1B1B                                  | #FFE7D0                                  |
| surface               | #323232                                  | color-mix(in srgb, #FFE7D0 50%, white)   |
| surface-alt           | #323232                                  | color-mix(in srgb, #FFE7D0 95%, #FC6E20) |
| text                  | #FFE7D0                                  | #1B1B1B                                  |
| text-muted            | color-mix(in srgb, #FFE7D0 78%, #1B1B1B) | color-mix(in srgb, #1B1B1B 75%, #FFE7D0) |
| accent                | #FC6E20                                  | #FC6E20                                  |
| accent-text           | #FC6E20                                  | color-mix(in srgb, #FC6E20 58%, #1B1B1B) |
| on-accent             | #1B1B1B                                  | #1B1B1B                                  |
| inverted-section      | #FFE7D0                                  | #1B1B1B                                  |
| inverted-text         | #1B1B1B                                  | #FFE7D0                                  |
| shadow                | 0 12px 32px ink at 40%                   | 0 12px 32px ink at 12%                   |
| glow-opacity          | 0.15                                     | 0.06                                     |
| grain-opacity / blend | 0.035 / soft-light                       | 0.02 / multiply                          |
| media-overlay         | transparent to ink                       | transparent to cream                     |

Choose the light logo on light surfaces and the silver logo on dark surfaces. Keep canvases transparent and change lighting without reloading geometry. Follow the system preference until the visitor makes a stored choice.

## Typography

Preserve Archivo Expanded for display, Inter for prose, and IBM Plex Mono for the existing labels. Self-host all fonts with swap. Keep copy in its authored order; wrap with CSS rather than inserting words or changing punctuation.

## Layout

Use one responsive grid and shared container. Let services and reasons form distinct compositions within the same system. Make the compounding-effect region the single dramatic inverted band; retain its existing location inside the engine section.

## Elevation & Depth

Use warm ink shadows and theme-specific restrained ember glows. Floating navigation uses a translucent semantic surface; provide a solid fallback for reduced transparency and increased contrast.

## Shapes

Apply the shared card and media radii; reserve pills for navigation and actions. Keep the original rocket proportions and use local posters while live rendering is unavailable.

## Components

Keep the ember focus outline and add the ink keyline in light mode for non-text contrast. Keep keyboard focus visible, menu and consultation focus trapped only while open, and restore focus to the trigger on close. Interactive motion starts from its current state and remains interruptible. Reduced motion disables scrub, pinning, cursor effects and the intro, and shows the entire growth-engine sequence.

## Do's and Don'ts

Do read all copy through the content module. Do preserve the section order and exact contact destinations. Do not add testimonials, pricing packages, client strips, FAQ or count-up claims absent from Ignitra. Do not copy Atomik content, assets or source. Do not import any public legacy code into production.

## Runtime Tokens

| Role                                                               | CSS/JS contract                                            |
| ------------------------------------------------------------------ | ---------------------------------------------------------- |
| Display size                                                       | clamp(3rem, 7vw, 9rem)                                     |
| Section heading                                                    | clamp(2rem, 4vw, 4.5rem)                                   |
| Body size                                                          | clamp(1rem, 1.2vw, 1.125rem)                               |
| Container / grid / measure                                         | 80rem / 12 columns / 65ch                                  |
| Side gutter                                                        | clamp(1rem, 4vw, 3rem)                                     |
| Section spacing                                                    | clamp(5rem, 12vw, 10rem)                                   |
| Durations: micro / reveal / intro / theme                          | 0.25s / 0.95s / 1.8s / 0.35s                               |
| Easing: CSS out / GSAP out / GSAP in-out                           | cubic-bezier(0.16, 1, 0.3, 1) / power3.out / power3.inOut  |
| Stagger / reveal distance / scrub / Lenis lerp                     | 0.08s / 40px / 1 / 0.1                                     |
| Z-index: content / nav / progress / menu / dialog / intro / cursor | 1 / 30 / 40 / 50 / 60 / 70 / 80                            |
| Reduced motion                                                     | durations and displacement 0; no pin/scrub/parallax/cursor |

## Stage 2 implementation — 2026-10-25

The static homepage now applies this existing world through shared content, container, section, heading, link/button and card primitives. The eight main sections retain their source order. The desktop hero uses a twelve-column grid, with copy spanning eight columns and theme-specific rocket media spanning four; mobile stacks both across the available width. Floating pill navigation, editorial problem/service rows, a seven-stage selectable loop, seven fully visible engine steps, the single inverted compounding band, an asymmetric reasons grid, engagement brief, CTA and large wordmark footer are implemented in both themes.

Archivo Expanded, Inter and IBM Plex Mono remain the display, body and label families. The shared display token remains available; the homepage h1 uses a narrower role-specific clamp in globals.css to accommodate the locked headline. Generic hover, border, backdrop, inverted-border, section-band, shadow and CTA-lighting primitives extend the semantic token layer without adding palette colors. Ember fill stays exact; light-theme accent text uses accent-text.

Navigation and consultation use native modal dialogs, explicit Tab wrapping and focus restoration. The inline service listbox retains every option hint and supports arrows, Home/End, Enter/Space and Escape. Theme bootstrap runs before paint; the icon toggle persists a choice and tolerates unavailable storage. Static content remains visible with reduced motion; scroll choreography, live 3D and the circular theme reveal remain Stage 3 work. See [DESIGN_STAGE2_REVIEW.md](DESIGN_STAGE2_REVIEW.md) for implementation evidence, the approved phone-pattern correction and delivery/QA limits. This addendum preserves the governing schema and visual identity.

## Stage 3 implementation â€” 2026-10-25

Motion now extends the existing cinematic rocket identity without replacing the palette, type ramp, content hierarchy or static layout. Headings reveal by visual line while preserving source whitespace; supporting rows and media reveal once. Eligible desktop devices receive a bounded hero hold and a pinned rocket rail beside the seven engine steps. Every step stays in document order, and the rail releases before the existing inverted compounding band. The intro is a short, non-blocking, first-session progress line; source indices are not animated as invented statistics.

The lazy motion runtime owns scroll timelines, responsive contexts, listeners and cleanup. Lenis, the additive pointer ring, restrained trails/grain and magnetic primary actions are desktop enhancements; touch and constrained devices keep native scrolling. The independently authored compressed rocket uses palette-driven materials, transparent canvases and capped DPR. Original theme posters and their locked alternative text remain the fallback. Theme changes update the existing scene and reveal the new palette from the icon control, with color-transition and immediate reduced-motion alternatives.

The existing timing tokens remain authoritative. Reduced motion exposes the static content and disables pinning, smoothing, scene rendering and pointer effects, including when the preference changes during the session. Keyboard focus keeps navigation visible, reveals focused content and remains independent of decorative effects. This append preserves the incumbent schema and token values; it does not regenerate the root pointer or sidecar. See [MOTION.md](MOTION.md) for implementation details and [DESIGN_STAGE3_REVIEW.md](DESIGN_STAGE3_REVIEW.md) for evidence and limits. Stage 4 still owns measured performance and comprehensive accessibility/browser QA; consultation delivery remains deferred and disabled without an approved endpoint.