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
