# Ignitra website design and verification report

## Executive summary

Ignitra has a fresh Next.js static-export codebase with responsive dark and light themes, an independently authored compressed rocket, scroll choreography and source-locked content. Stage 4 corrected a dark meta-text contrast failure, small navigation/footer hit areas and missing exported font preloads, and reduced brand image bytes without changing pixels. The website is ready for owner review. Live consultation delivery remains the explicitly deferred pre-launch dependency; production Send stays disabled without an approved endpoint.

The final report is delivered here in Markdown. The requested Design Report DOCX template was inspected but its required render gate could not run successfully in this environment. No unrendered DOCX is claimed as complete; see REPORT_EXPORT.md for tested failure evidence.

## Key findings

### What changed by section

| Original section | Rebuilt behavior and presentation |
| --- | --- |
| Navigation | Floating pill, original anchors and consultation entry, icon-only persistent theme switch, keyboard-operable mobile dialog; minimum 44px hit areas. |
| Hero | Original headline, description and two actions; cinematic desktop intro and lazy themed rocket. Mobile keeps the critical text stable and original poster fallback. |
| Problem | Original six pairs in editorial responsive rows with restrained reveals. |
| Difference | Original partner comparison and seven-state continuous loop; keyboard and pointer selection preserve every state record. |
| Services | Three original disciplines, inclusions and sequence in responsive rows. |
| Growth Engine | All seven original steps in normal reading order, desktop pinned visual rail and bounded scrub, then the existing inverted compounding band. |
| Why Ignitra | Seven original reasons and supporting local images in a responsive grid. |
| Start | Original package contrast and five-step engagement brief; source statuses retained. |
| CTA and consultation | Original consultation and WhatsApp actions, native named dialog, required fields and service selector. Approved phone pattern correction retained. No invented backend or success. |
| Footer and mobile actions | Original contacts, address, legal data, year, links and action order; local theme-aware logos and accessible target sizing. |

### Performance measurements

Three isolated Chrome processes per device/theme, cold HTTP cache, Lighthouse 13.5.0 simulated mobile or official desktop settings. These are localhost lab results, not real-user Core Web Vitals.

| Profile | Performance | Accessibility | Best practices | SEO | Median LCP | Median CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| mobile dark | 96 | 100 | 100 | 100 | 2.17 s | 0.000 |
| mobile light | 97 | 100 | 100 | 100 | 2.17 s | 0.000 |
| desktop dark | 96 | 100 | 100 | 100 | 1.18 s | 0.057 |
| desktop light | 97 | 100 | 100 | 100 | 0.96 s | 0.057 |

All median budgets pass: performance at least 85, LCP below 2.5 seconds and CLS below 0.1. Individual runs vary; one mobile light sample scored 81 and one dark sample had LCP 3.11 seconds. Full samples and HTML/JSON evidence are retained in lighthouse/. After the final navigation hit-area adjustment, a separate one-sample smoke matrix also passed all four budgets in lighthouse-final-smoke/. The final host and physical mobile hardware still need deployment-specific measurement. The automation transport exposes decoded response sizes despite gzip over its network layer; no score improvement is attributed to gzip.

Lossless brand WebP derivatives save 59,252 bytes. Original assets remain unchanged. The rocket is 24,260 bytes with meshopt compression, capped DPR and visibility pausing. Other images were already small WebP files. Fonts remain original self-hosted next/font files with swap; a deterministic, idempotent export finalizer restores missing preload hints. No runtime stack was replaced. The old development-only LHCI wrapper was replaced by official Lighthouse and a local budget runner; the final dependency audit has zero advisories.

### Content and interaction verification

Both immutable baselines and all original content records remain unchanged. Reduced and normal-motion rendered comparisons cover 375/1440 in both themes, original section order, full visible text, hrefs/targets, alt strings, SEO/structured data and real loop/menu/dialog/form/theme states. Both modes passed with zero differences before the final target correction; final post-correction reports are retained as content-verification-stage4-reduced.json and content-verification-stage4-motion.json. No text exception was added.

The full Chrome suite passed 28 tests. Edge passed seven focused compatibility checks. The final navigation hit-area correction passed another seven quality checks in each browser. These cover resources, heading order, 320px reflow, footer/navigation targets, stored/system theme before first frame, storage failures, keyboard dialogs and phone validation, live reduced-motion teardown, pin release, theme continuity and static/model/WebGL/low-power fallbacks. Browser test summaries are in browser-tests-stage4.json. No live consultation was submitted.

### Accessibility and responsive evidence

Fourteen axe scans across both themes, mobile/desktop page, consultation, service options and mobile menu report zero violations. The original 4.41:1 dark meta-text failure was corrected by changing its semantic mix from 60% to 63% cream. Source words and fonts are unchanged. The automated tool retained 22 incomplete rule groups, mainly contrast over layered/top-layer surfaces and conditionally mounted listbox references. Direct keyboard/DOM checks confirm a named dialog, focus containment and an existing controlled listbox when expanded. Those incomplete records remain visible; this is not full WCAG or assistive-technology certification.

Final responsive captures cover 360/375/768/1024/1440/1920 in both themes. Full-page deliverables at 375/768/1440/1920 and representative hero/menu/form states are in after/. Capture diagnostics check console errors/warnings, horizontal overflow, heading bounds and target dimensions. The before references remain in legacy-screenshots/. Original section order and content presence are also enforced independently by the content gate. Safari/WebKit, Firefox, real NVDA/VoiceOver and physical-device testing are not claimed.

### Motion and effect applicability

Implemented: short non-text session intro; desktop masked hero/rocket idle and pointer tilt; Lenis on eligible desktop; bounded hero hold and pinned engine rail; section/card/image reveals; restrained glow parallax; pinned showcase progress; 3px page progress; additive fine-pointer cursor; magnetic primary actions; hover feedback; theme-aware grain; existing inverted contrast band; mobile-menu/dialog/loop feedback; circular theme reveal with color fallback. Mobile/touch hero text stays visible for loading performance.

Skipped with source-grounded reasons: count-ups (numbers are step indices, year/contact/legal identifiers), marquee (no strip), FAQ accordion (no FAQ), route wipe (one route). No sections or statistics were invented. Reduced motion disables intro/parallax/scrub/cursor/3D and exposes all content; original posters and native scrolling cover constrained devices. Every effect is mapped in MOTION.md.

## Implications

The content lock, responsive layout and measured median loading budgets are satisfied at the recorded lab scope. A Lighthouse accessibility score of 100 and zero axe violations do not replace real assistive-technology testing. A scroll recording or frame sample does not prove 60fps on every mid-range device. The separate scroll timing report and independent visual review state their exact scope.

Consultation delivery parity is not implemented because no original backend or approved replacement endpoint is available. The user explicitly deferred it. Production sending remains disabled; no copied deployment-specific server action is used. This dependency must be closed before launch.

## Recommendations

Review the final screenshots and local production preview. Before launch, configure and test the approved consultation service, then repeat Lighthouse and device/assistive-technology checks on the actual static host. Keep content verification before commits and preserve the theme, low-power and reduced-motion fallbacks. Do not update baselines to mask failures.

No push or deployment was requested or performed. Branch is build/from-scratch with main retained. Stage commits and the final commit are available through git log. See HANDOFF.md for exact commands and folder ownership.

## Appendix

Evidence: PERFORMANCE.md; browser-tests-stage4.json; accessibility-stage4.json; accessibility-manual-stage4.json; both content-verification-stage4 reports; after/capture-report.json; after/scroll-performance.json and scroll.webm; lighthouse/summary.json; lighthouse-final-smoke/summary.json; dependency-audit-stage4.json; UI_REVIEW_STAGE4.md. Source/asset provenance remains in ASSETS.md and the frozen asset manifest.

Build and checks: npm ci; npm run build; npm run preview; npm run lint; npm run typecheck; npm run format:check; npm test; npm run verify-content; node scripts/verify-content.mjs --motion; npm run test:visual; npm run test:a11y; npm run lighthouse; npm run capture:final; node scripts/capture-scroll-performance.mjs. Run Lighthouse without concurrent browser/build jobs. Use BROWSER_CHANNEL=msedge for the focused Edge suite. No Python website tooling or requirements.txt was added; only the installed document capability was probed for report export.

## Things I need from you

- Before launch: an approved consultation endpoint/service and its server-error, spam, CORS and privacy requirements. Delivery remains disabled until configured and verified.
- For the requested DOCX export: a working LibreOffice renderer or responsive Word automation. REPORT_EXPORT.md records the missing renderer, stalled native attempt and timed-out bounded download. The complete content report is available here.
- Optional editorial approval: original postal spellings, year and the touch-visible “Hover a stage” wording were preserved exactly. No silent corrections were made.
