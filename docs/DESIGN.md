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
