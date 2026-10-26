# Ignitra rebuild

A fresh content-preserving rebuild of https://www.ignitra.co.in/. Stage 3 adds bounded scroll choreography, a local compressed rocket scene and theme transitions to the responsive homepage. Consultation delivery requires an approved endpoint before launch.

## Setup

Use Node 24.11.0 and npm. Run npm ci, then npm run dev. For production verification: npm run build, npm run verify-content. npm run preview serves out/ at http://127.0.0.1:4173.

## Checks

- npm run lint — source lint
- npm run typecheck — strict TypeScript
- npm test — verifier mutation tests
- npm run verify-content — actual browser comparison against independent legacy snapshots
- npm run test:visual — browser checks and screenshots in both themes
- npm run test:motion — motion, theme continuity, pin release and fallback browser checks
- node scripts/verify-content.mjs --motion — the unchanged content gate after real scroll reveals settle
- npm run build:rocket — regenerate the independently authored compressed GLB
- node scripts/capture-motion.mjs — Stage 3 screenshots/video against the running preview
- npm run test:delivery — temporary endpoint build, intercepted local submission tests, then restore the endpoint-free production build
- npm run lighthouse — official Lighthouse 13.5.0, three isolated samples per device/theme and enforced budgets

## Project map

content/ holds all site copy, observed states, metadata and immutable comparison data. src/lib/content is the sole application access point. src/styles/tokens.css owns the palette and themes. src/lib/theme/bootstrap.ts applies stored/system preference before paint. src/lib/motion owns the lazy GSAP/Lenis runtime, shared scene channels and timing tokens. src/components/scene owns the gated R3F renderer. See docs/MOTION.md for lifecycle and fallbacks. src/components/{ui,sections,layout} owns the built interface; the temporary proof renderer has been removed. public/assets contains copied local assets and fonts. docs contains the audit, skills, assets, section map, design contract and handoff. tasks contains the staged plan.

## Content and evidence

Never refresh the snapshot to mask a failure. scripts/extract-content.mjs is a one-time audit tool, not a routine build task. All visual state profiles preserve source text transformations as displayText, with authored text retained separately. Do not add visible labels or rearrange sections. Read docs/CONTENT_LOCK.md for the exact verification scope and extension work.

## Deployment

The current build produces out/ using Next.js static export. It can be served by a static host. Preserve the apex-domain canonical and asset paths; GitHub Pages subpath hosting requires an explicit basePath decision. Nothing has been pushed or deployed. Consultation backend parity must be resolved before launch; the original private Server Action cannot be exported from a public page.

No Python website tooling or requirements.txt is needed. The installed document renderer was probed for report export only; it is not a production or project dependency. Copy .env.example to .env.local and set NEXT_PUBLIC_CONSULTATION_ENDPOINT only after an approved endpoint is available. An empty value keeps Send request disabled. See docs/CONSULTATION.md for the contract and local-only test.

Stage 4 tools: npm run build:assets regenerates lossless brand derivatives; npm run test:a11y audits real page/form/menu states; npm run capture:final captures all requested widths; node scripts/capture-scroll-performance.mjs records wheel scrolling and frame timing. These scripts manage their own local servers. The Lighthouse runner uses 4474/4481 and must run without concurrent browser/build workloads. Preview supports gzip; the current automation transport may expose decompressed payload sizes, so deployment measurements must be repeated on the final host.
