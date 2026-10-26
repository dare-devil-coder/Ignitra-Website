# Changelog

## Stage 1 — Foundation

- Audited the supplied live website and preserved its exact public copy, order, links, assets, metadata and observed states.
- Added a fresh typed Next.js static-export foundation, both theme token maps and before-paint theme selection.
- Added an independent rendered-content gate, immutable snapshot, mutation tests and visual/Lighthouse tooling.
- Documented the remaining consultation-backend dependency and the Stage 2/3/4 plan.
- Corrected an incomplete initial source-visibility capture through a separate live audit; retained original evidence and added completeness guards.
- Validated build/lint/types/format, six mutation tests, eight foundation captures and four zero-diff rendered profiles.

## Stage 2 — UI and client interactions

- Replaced the proof renderer with eight responsive section compositions, reusable primitives, navigation/mobile menu and footer in both themes.
- Added persistent icon theme controls, native consultation/menu dialogs, keyboard focus wrapping, loop selection and the consultation service listbox.
- Preserved all original authored/state/attribute records; added a separate records hash and actual interaction comparisons.
- Corrected only the malformed phone pattern with explicit user authorization. No copy was changed.
- Verified fourteen browser tests, six mutation tests, build/lint/types/format and four zero-diff content profiles. Independent UI reviewer disposition: ship at UI scope.
- Consultation delivery remains disabled until the owner supplies an approved replacement endpoint; user confirmed original source is unavailable.
- User explicitly deferred live consultation delivery until before launch and approved the Stage 3 handoff; Stage 2 closed with that dependency documented.

## Stage 3 — Motion, scroll and 3D

- Added a lazy GSAP/Lenis lifecycle, bounded hero/engine pinning, masked heading and section/image reveals, page progress, cursor/magnetic controls and motion feedback.
- Independently authored a 24 KB meshopt rocket with theme-aware lighting, desktop policy, offscreen pause, error fallbacks and resource cleanup. Retained original posters and all locked content.
- Added circular View Transitions theme switching, plain color fallback and reduced-motion instant switching.
- Added normal-motion content checks and browser lifecycle/fallback regression tests. Corrected navigation threshold behavior exposed by testing; verifier now awaits settled interaction animations without relaxing comparisons.
- Documented the compatible Three 0.182.0 pin and every implemented/skipped effect. Live consultation delivery remains deferred until before launch.
