# Stage 3 verification

## Completed checks

- Optimized Next.js static build, strict TypeScript, ESLint and formatting passed.
- Six immutable-comparison mutation tests passed.
- Twenty-one Playwright browser tests passed: eight baseline viewports/themes, six theme/keyboard/phone checks and seven motion/pinning/theme/fallback checks. The last UI-only correction restored the poster edge mask on WebGL failure and was confirmed in the final captures.
- Both reduced-motion and animated content assertions pass all four profiles (375/1440, dark/light), with every captured loop/menu/dialog/form/theme interaction. No snapshot, authored-record lock, content string or allow-list was changed. Final clean-exit reports are retained separately.
- Final motion captures record no console errors/warnings and no horizontal overflow at 375/1440 in both themes. Full-page, hero, engine, menu and scroll-frame evidence is in stage3-screenshots; the scroll recording is stage3-scroll.webm.
- Impeccable mechanical scan ran once and returned an empty findings array. Independent finish reviewer: ship at the documented image/code scope. Separate design documentation pass completed.
- Palette search found color literals only in tokens.css. Production dependency audit: zero vulnerabilities. Existing dev-only LHCI advisories remain Stage 4 work.
- Re-running build:rocket with the final pinned toolchain reproduced the GLB hash exactly: 24,260 bytes from 119,500 bytes uncompressed.

## Corrections established by evidence

Chrome tests caught a nav threshold bug and verified the fix. Animated content verification originally sampled delayed menu items too early and tried to click hidden navigation; it now awaits finite interaction animations and scrolls the nav back into view, retaining all comparisons. Rapid toggles preserve the latest requested theme. The unavailable-WebGL and invalid-model paths preserve the original poster. Dark full-page capture also exercises the poster fallback; separate viewport captures establish live 3D appearance.

Standalone scripts initially completed assertions but stalled during temporary-profile removal on Windows. A function-only diagnostic identified filesystem chmod/unlink cleanup, after browser work. Dedicated project-owned profiles and artifact directories under ignored output/ avoid automatic temporary-profile deletion; actual test pages remain isolated incognito contexts. No personal Chrome profile is used. The owned-profile smoke test and both final content-verification modes exited cleanly with code 0. Earlier stuck task processes were identified by command line and terminated; reports were not presented as successful process exits.

## Limits

The scroll frame sequence was inspected for sequence/pin release and content continuity; screenshots do not prove 60fps. Stage 4 must measure Lighthouse, LCP, CLS, device/frame performance, complete accessibility/cross-browser checks, final screenshots at all requested widths and the final design report. This stage did not submit a live consultation, publish or deploy. Send remains disabled until an approved endpoint is configured and verified.
