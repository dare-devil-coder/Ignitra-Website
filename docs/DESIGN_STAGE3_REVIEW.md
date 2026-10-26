# Stage 3 implementation review — 2026-10-25

Stage 3 target: GPT-6-Astra / High; the runtime variant is not independently exposed. This review records implemented motion within the existing user-pinned Ignitra world. It does not certify live consultation delivery, final accessibility or performance budgets.

## System compatibility

The four-color palette, semantic dark/light roles, exact ember fill, light-theme accent-text, Archivo Expanded / Inter / IBM Plex Mono families and existing type scale remain the governing system. Motion uses the existing CSS and TypeScript timing contracts. No replacement identity, content section or type role was introduced. The eight-section reading order and single inverted compounding band remain intact.

The static page is the baseline. The lazy MotionRoot entry respects live reduced-motion changes; the GSAP context restores transforms and split heading text and removes its scroll, pointer, observer and ticker resources. Heading splitting retains whitespace and groups delays by visual line. Once-only content reveals finish immediately when a descendant receives focus. These are enhancements to existing semantic content, not separate animated copies.

## Implemented choices

- The rocket connects the hero to the seven-step engine. Fine-pointer desktops at least 1024px wide, without save-data or reported low hardware capacity, receive the richer motion. A tall-desktop hero hold is bounded to the smaller of 450px or 45% viewport height. The engine pins only its visual rail, leaving all seven steps in normal reading order and releasing before the compounding band.
- Lenis uses the existing lerp token and GSAP ticker. Dialogs stop page smoothing and retain native internal scrolling. Anchor destinations/history and focus are preserved. Navigation returns on upward scrolling and keyboard focus. Touch and constrained devices retain native page scrolling.
- The non-text intro line is session-skipped and never blocks input. The page progress line, desktop grain/trails, additive pointer ring, bounded magnetic primary actions and image wipes support the rocket sequence. The native cursor remains visible. No count-up metrics, marquee, FAQ or route wipe was fabricated for content that does not exist.
- RocketIsland adds WebGL2 and reduced-motion checks to desktop eligibility, waits for first visibility, then keeps the scene across scrolling and theme changes. Its frame loop pauses outside the observed region and when the document is hidden. The renderer uses transparent canvases, DPR 1–1.5 and palette-driven materials/lights, without shadows or postprocessing. The existing poster stays in the layout and accessibility tree, visually clipped only after scene readiness; model/context failures restore it. Loaded geometry/materials, including late loads, are disposed on teardown.
- Theme changes use a circular View Transition from the triggering control, a token-color transition when unsupported, and an immediate switch for reduced motion. Repeated changes supersede pending transitions. Scene materials update without rebuilding the scroll lifecycle or reloading geometry.

## Evidence checked

Inspected AGENTS.md, PRODUCT.md, docs/HANDOFF.md, SECTION_MAP.md, structured content, DESIGN.md, MOTION.md, the existing Stage 2 design review, CSS/motion tokens, motion.css, MotionRoot, runtime.ts, RocketIsland, RocketCanvas, theme/transition.ts and package.json. Three and its types are pinned to 0.182.0; MOTION.md records the R3F compatibility reason and the independently authored meshopt asset workflow.

The persisted content-verification-stage3-reduced.json records four passing profiles at 375 and 1440px in both themes, all listed loop/menu/dialog/form/theme interactions and an empty differences array. The persisted stage3-capture-report.json records the same four viewport/theme combinations with no captured console errors and no overflow. Still images and a scroll recording are present under docs/stage3-screenshots and docs/stage3-scroll.webm; this documenter pass inspected source and reports, not every image or video frame.

The parent validation workflow reports 21 browser tests passed and deterministic regeneration of the 24,260-byte rocket asset. The subsequent parent-run animated-content report records zero differences across all four profiles and the same interactions; the separate final gate also checks clean process shutdown. The capture report is bounded evidence, not a Lighthouse score, frame-rate measurement or full assistive-technology audit.

## Boundaries and remaining work

Only docs/DESIGN.md was extended and this review added. The governing frontmatter, existing additional headings, root DESIGN.md pointer and .impeccable/design.json were preserved. Their pre-existing schema differences were not repaired or promoted into a new schema. Source-authored small section labels remain locked content obligations; this review does not canonize them as a decorative-label pattern.

Consultation delivery was explicitly deferred by the user. Production sending stays disabled without an approved NEXT_PUBLIC_CONSULTATION_ENDPOINT; no delivery parity or live test is claimed. Stage 4 owns measured mobile Lighthouse/LCP/CLS and desktop scrolling performance, comprehensive accessibility and cross-browser QA, remaining development dependency advisories and final evidence. Current desktop eligibility is a fallback heuristic, not proof that every eligible device meets the performance target.
