# Ignitra rebuild

A fresh content-preserving rebuild of https://www.ignitra.co.in/. Stage 2 implements the responsive homepage and client interactions in both themes. Scroll choreography and live 3D are planned for Stage 3. Consultation delivery requires an approved endpoint before launch.

## Setup

Use Node 24.11.0 and npm. Run npm ci, then npm run dev. For production verification: npm run build, npm run verify-content. npm run preview serves out/ at http://127.0.0.1:4173.

## Checks

- npm run lint — source lint
- npm run typecheck — strict TypeScript
- npm test — verifier mutation tests
- npm run verify-content — actual browser comparison against independent legacy snapshots
- npm run test:visual — foundation screenshots at four widths in both themes
- npm run test:delivery — temporary endpoint build, intercepted local submission tests, then restore the endpoint-free production build
- npm run lighthouse — Lighthouse CI against built static output (final reporting in Stage 4)

## Project map

content/ holds all site copy, observed states, metadata and immutable comparison data. src/lib/content is the sole application access point. src/styles/tokens.css owns the palette and themes. src/lib/theme/bootstrap.ts applies stored/system preference before paint. src/lib/motion contains tokens only until Stage 3. src/components/{ui,sections,layout} owns the built interface; the temporary proof renderer has been removed. public/assets contains copied local assets and fonts. docs contains the audit, skills, assets, section map, design contract and handoff. tasks contains the staged plan.

## Content and evidence

Never refresh the snapshot to mask a failure. scripts/extract-content.mjs is a one-time audit tool, not a routine build task. All visual state profiles preserve source text transformations as displayText, with authored text retained separately. Do not add visible labels or rearrange sections. Read docs/CONTENT_LOCK.md for the exact verification scope and extension work.

## Deployment

The current build produces out/ using Next.js static export. It can be served by a static host. Preserve the apex-domain canonical and asset paths; GitHub Pages subpath hosting requires an explicit basePath decision. Nothing has been pushed or deployed. Consultation backend parity must be resolved before launch; the original private Server Action cannot be exported from a public page.

No Python tooling or requirements.txt is needed. Copy .env.example to .env.local and set NEXT_PUBLIC_CONSULTATION_ENDPOINT only after an approved endpoint is available. An empty value keeps Send request disabled. See docs/CONSULTATION.md for the contract and local-only test.
