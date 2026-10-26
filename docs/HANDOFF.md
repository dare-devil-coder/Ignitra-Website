# Handoff — Stage 4 QA in progress

## Read first

Read AGENTS.md, this file, docs/SECTION_MAP.md and content/site-content.json before code. Then read docs/MOTION.md, docs/CONTENT_LOCK.md, docs/DESIGN.md, docs/CONSULTATION.md and tasks/plan.md. Stage 3 was requested on GPT-6-Astra / High; runtime variant is not independently exposed. Next stage is Stage 4 on GPT-6.1-Sol, only after user handoff.

## Done

Stage 1 audit/content lock/scaffold and Stage 2 responsive UI/interactions remain intact. Stage 3 adds lazy GSAP/ScrollTrigger and Lenis, masked heading/section/image reveals, bounded hero hold and engine rail pinning, page progress, additive fine-pointer cursor, magnetic hero/final primary CTAs, menu/dialog/loop feedback, hero glow/trails and theme-tuned grain. A newly authored 24,260-byte meshopt GLB provides the original rocket signature without porting legacy geometry/code. Eligible desktops get transparent R3F canvases; mobile/low-power/reduced-motion/unavailable WebGL/model failure get original theme posters. Intersection/document visibility pauses rendering; cleanup disposes scene resources. Theme transitions use circular View Transitions, a color fallback and instant reduced-motion changes without resetting scene/scroll state.

All source copy, order, links, alt strings, metadata, original fonts and accessibility records remain unchanged. Both immutable hashes and the phone-pattern exception remain exactly as Stage 2. The scene's clipped semantic posters retain original alt attributes and layout dimensions. No count-up statistics, marquee, FAQ or route transitions were fabricated: see the full 17-effect applicability list in MOTION.md.

## Verification

See VERIFICATION_STAGE3.md, UI_REVIEW_STAGE3.md, DESIGN_STAGE3_REVIEW.md, content-verification-stage3-reduced.json, content-verification-stage3-motion.json and stage3-capture-report.json. Build/lint/types/format and six mutation tests passed; all 21 browser tests passed. Reduced and normal motion comparisons have zero differences across four profiles plus actual interactions. Independent visual finish reviewer: ship, no material visual fixes at reviewed scope. No Lighthouse, 60fps or full accessibility certification is claimed yet.

The standalone scripts hit a Windows temp-profile removal stall after passing their assertions. scripts/evidence-browser.mjs now uses dedicated output/browser-profiles/<task> and output/browser-artifacts/<task> directories with a persistent owner context; website tests still use isolated incognito contexts. The smoke close and both final content-verification modes exited cleanly with code 0. Do not reopen personal Chrome profiles or weaken comparisons to bypass cleanup.

## Decisions and known limits

- Three/@types are pinned to 0.182.0: R3F 9.8.2 still uses Clock, which warns in >=0.183. No warning suppression/vendor patch. Production audit has zero advisories; existing 16 dev-only LHCI advisories remain Stage 4 review.
- No public legacy GLB existed. scripts/build-rocket.mjs is independent authored geometry; regenerate with npm run build:rocket. Exact final-toolchain regeneration was checked. Local untextured geometry needs no texture conversion.
- One scoped runtime owns teardown; responsive matchMedia and live reduced-motion changes revert pinning, styles, listeners and split wrappers. Avoid duplicate tickers or independent ScrollTrigger owners.
- Desktop eligibility is a practical heuristic, not a measured performance guarantee. DPR max 1.5; renderer pauses offscreen/hidden. Keep Stage 4's measurements honest.
- Full-page captures can exercise the supported poster path; use separate hero/engine viewport captures to assess live 3D. Capture scripts scroll/settle real reveals before full-page images.
- Original postal spellings, year and touch-visible hover hint remain locked. No source-content corrections beyond the approved phone pattern.

## Deferred launch dependency

The user confirmed no original source/backend is available and explicitly said “Defer delivery; hand off to Stage 3.” No approved replacement endpoint exists. Production Send remains disabled with an empty NEXT_PUBLIC_CONSULTATION_ENDPOINT. This does not block Stage 4, but real sending is unimplemented. Before launch obtain an approved endpoint/service, its error catalog/spam/CORS/privacy configuration, implement its adapter as needed and verify real delivery only with explicit authorization for a live test. Do not fake success or replay the old deployment-specific Server Action. See CONSULTATION.md. No live lead was sent.

## File map

- src/app: static homepage composition and unchanged locked SEO/font root.
- src/components/{ui,sections,layout}: Stage 2 UI plus MotionRoot and theme control wiring.
- src/components/scene: gated RocketIsland, error boundary and RocketCanvas with theme lighting/resource cleanup.
- src/lib/motion: tokens, scene numeric channels and scoped GSAP/Lenis runtime.
- src/lib/theme: before-paint bootstrap and circular/fallback theme transition.
- src/lib/content: sole typed JSON copy/attribute access. src/lib/accessibility: dialog focus trap.
- src/styles: palette/timing tokens, static globals and motion.css.
- public/assets/models/ignitra-rocket.glb: owned compressed model. public/assets/grain.png: owned ink-alpha texture. Other assets/fonts are unchanged source copies.
- scripts/evidence-browser.mjs: owned browser profile helper. verify-content.mjs and verify-interactions.mjs: unchanged comparisons plus normal-motion settling. build-rocket.mjs: asset generation. capture-motion.mjs: stage evidence. test-delivery.mjs: local intercepted delivery QA.
- tests/visual/motion.spec.ts: seven motion lifecycle/pin/theme/fallback tests; existing baseline/theme tests preserved.
- content: locked records/baselines/hashes and approved phone-only technical exception.
- docs/stage3-screenshots + stage3-scroll.webm: current motion evidence. docs/after is reserved for final Stage 4 captures. Historical source and Stage 1/2 evidence remain.

## Exact commands

Node 24.11.0, cwd D:/My Space/Ignitra Website:

    npm ci
    npm run dev
    npm run build
    npm run preview
    npm run lint
    npm run typecheck
    npm run format:check
    npm test
    npm run verify-content
    node scripts/verify-content.mjs --motion
    npm run test:visual
    npm run test:motion
    node scripts/capture-motion.mjs
    npm run build:rocket
    npm run test:delivery
    npm run lighthouse

Dev: http://127.0.0.1:3000. Preview: http://127.0.0.1:4173. Content gate starts its own 4473 server. Motion capture requires preview; browser tests manage/reuse preview. Both verification modes need a current build; run them sequentially because they share port/profile/report. Capture uses a separate profile. npm run test:delivery builds with intercepted loopback endpoint4480 then restores the endpoint-free build; if interrupted unset NEXT_PUBLIC_CONSULTATION_ENDPOINT and rebuild. No live form submissions in QA. Lighthouse belongs to Stage 4 after its dev-dependency review. No Python/requirements.txt is needed.

## Git and next action

Branch build/from-scratch; main retained at 9c687cf. Stage 1 ad77597/c2a1809; Stage 2 d712dd0/3e434f8. Stage 3 is complete and committed with its verification evidence. Get its ID with git log -1 --oneline. Use command-scoped safe.directory per AGENTS.md; never change global Git config. No remote/push/deployment requested or performed.

Stage 4 is active on GPT-6.1-Sol. Skills reselected and loaded (SKILLS_USED.md). LHCI was replaced by official Lighthouse 13.5.0, removing all development advisories. Lossless brand WebP derivatives, a slight dark meta-text contrast correction, 44px footer targets, static mobile hero entry and emitted-font preload restoration are implemented. Current build succeeded. Final isolated Lighthouse matrix is running; final content/browser/accessibility/capture gates and final report still need closing. No source content or locks changed. Report DOCX rendering is blocked: packaged renderer needs absent LibreOffice; native Word automation stalled; an official renderer download could not complete. Deliver a complete Markdown report and explicitly document the DOCX export limitation unless a renderer becomes available. Do not deliver an unrendered DOCX.
