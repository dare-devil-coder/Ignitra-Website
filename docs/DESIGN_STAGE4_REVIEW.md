# Stage 4 design review — 2026-10-26

Disposition: ship at the independent static visual-finish scope recorded in [UI_REVIEW_STAGE4.md](UI_REVIEW_STAGE4.md). This documentation pass records an existing-world refinement, not a new concept, full accessibility certification or launch authorization. Stage 4's requested model is GPT-6.1-Sol; runtime identity was not independently verified.

## Direction and ownership

PRODUCT.md, docs/DESIGN.md and docs/MOTION.md govern. No separate QUALITY BAR, approved comp or concept seed was supplied. The pinned ink/graphite/cream/ember palette, original Archivo Expanded/Inter/IBM Plex Mono, theme-aware logos, rocket identity, content order, dark/light themes and reduced-motion baseline remain authoritative.

This pass read AGENTS.md, HANDOFF.md, SECTION_MAP.md, the content inventory, FINAL_REPORT.md, UI_REVIEW_STAGE4.md, runtime tokens/global styles, motion runtime, image-priority components, optimized-asset mapping and export finalizer. It updates only the existing Stage 4 addendum in docs/DESIGN.md and this review. Root DESIGN.md remains the pointer; frontmatter, accepted schema, token primitives and .impeccable/design.json are preserved. No source-content or lock changes are authorized here.

## Recorded refinements

| Refinement | Evidence and preserved contract |
| --- | --- |
| Dark secondary labels | `--text-meta` changes from 60% to 63% cream mixed with ink to address the measured graphite contrast failure. The four palette primitives and light-theme accent-text distinction remain. |
| Navigation and footer targets | Navigation anchors/logo and footer links retain their enlarged hit areas, including minimum 44px heights. Text, hrefs and visible hierarchy remain locked. |
| Brand loading | Three lossless WebP derivatives are selected through the technical optimized-assets mapping; original images remain unchanged. The recorded byte saving is 59,252. |
| Font loading | The export finalizer recovers missing font preloads from emitted CSS, adding only absent hints. Original next/font families and swap remain. |
| Hero entry | Initial hero splitting/timeline is restricted to at least 768px with a fine pointer. Mobile/touch text stays visible during hydration; desktop choreography, later section reveals and reduced-motion cleanup remain. |

## Evidence checked

The independent finish reviewer opened all eight final full pages at 375/768/1440/1920 in both themes plus the hero, consultation, service-options and mobile-menu stills. Its written verdict is ship with no material visual fixes. This documentation pass read that review; it did not independently reopen those screenshots or watch scroll video.

- `after/capture-report.json` records twelve width/theme profiles at 360/375/768/1024/1440/1920, without console errors, overflow, heading overflow or undersized detected targets.
- `browser-tests-stage4.json` records 28 Chrome and seven focused Edge passes, then seven final target-quality passes in each browser, with zero unexpected, skipped or flaky results.
- `content-verification-stage4-reduced.json` and `content-verification-stage4-motion.json` each contain four PASS profiles. The parent confirmed the final animated process exited 0 with empty differences. Both immutable comparisons and the approved phone-pattern-only exception remain; no additional copy exception was introduced.
- `accessibility-stage4.json` retains fourteen axe state scans with zero violations and 22 incomplete rule groups. `accessibility-manual-stage4.json` supplements named-dialog, focus containment and expanded-listbox checks; it explicitly retains unresolved automated contrast limitations over layered/top-layer surfaces.
- `lighthouse/summary.json` records three fresh Chrome samples per device/theme. Median performance is 96/97 for dark/light on mobile and desktop; mobile LCP is 2.17s with CLS 0, desktop LCP 1.18s/0.96s with CLS 0.057. All median budgets pass. Variability remains visible, including a mobile score of 81 and one dark LCP of 3.11s.
- `lighthouse-final-smoke/summary.json` records one post-target-adjustment sample per device/theme; all four pass the configured performance, LCP and CLS thresholds. This is a smoke check, not a replacement three-sample matrix.

## Limits and remaining launch work

The finish verdict covers the supplied still images. No scroll recording or frame-timing evidence was viewed in this documentation pass; no 60fps or physical-device guarantee follows from it. Localhost Lighthouse is synthetic lab evidence, not field Core Web Vitals. Safari/WebKit, Firefox, physical devices and real NVDA/VoiceOver testing are not certified. Zero axe violations and Lighthouse accessibility 100 do not resolve the retained incomplete groups or constitute full WCAG certification.

Consultation delivery remains explicitly deferred. Without an approved endpoint, production Send stays disabled; no live submission, backend parity or delivery success is claimed. The complete report is Markdown in FINAL_REPORT.md. REPORT_EXPORT.md records the missing/stalled DOCX render path; no unrendered DOCX is presented as complete.

The static ship disposition does not authorize push or deployment. Preserve the content gates and fallbacks while closing the approved consultation service and deployment-specific verification before launch.

## Documentation validation

The Stage 4 change is confined to prose; existing DESIGN.md frontmatter and all prior accepted decisions remain unchanged. The original token lint/export evidence is retained in VERIFICATION.md. The prescribed offline lint attempt (`npx --offline @google/design.md lint docs/DESIGN.md`) returned ENOTCACHED. Lint, compatibility export and CLI diff were therefore not rerun; no package was downloaded or added. A direct before/after comparison confirms that the frontmatter and every byte before the existing Stage 4 addendum are unchanged.
