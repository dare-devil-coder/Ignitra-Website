# Ignitra rebuild

A fresh content-preserving rebuild of https://www.ignitra.co.in/. Stage 1 provides the audit, locked copy, static Next.js foundation and both theme token maps. The current page is a plain content proof, not the finished design.

## Setup

Use Node 24.11.0 and npm. Run npm ci, then npm run dev. For production verification: npm run build, npm run verify-content. npm run preview serves out/ at http://127.0.0.1:4173.

## Checks

- npm run lint — source lint
- npm run typecheck — strict TypeScript
- npm test — verifier mutation tests
- npm run verify-content — actual browser comparison against independent legacy snapshots
- npm run test:visual — foundation screenshots at four widths in both themes
- npm run lighthouse — Lighthouse CI against built static output (final reporting in Stage 4)

## Project map

content/ holds all site copy, observed states, metadata and immutable comparison data. src/lib/content is the sole application access point. src/styles/tokens.css owns the palette and themes. src/lib/theme/bootstrap.ts applies stored/system preference before paint. src/lib/motion contains tokens only until Stage 3. src/components/foundation is deliberately temporary; the Stage 2 model replaces it with sections and primitives. public/assets contains copied local assets and fonts. docs contains the audit, skills, assets, section map, design contract and handoff. tasks contains the staged plan.

## Content and evidence

Never refresh the snapshot to mask a failure. scripts/extract-content.mjs is a one-time audit tool, not a routine build task. All visual state profiles preserve source text transformations as displayText, with authored text retained separately. Do not add visible labels or rearrange sections. Read docs/CONTENT_LOCK.md for the exact verification scope and extension work.

## Deployment

The current build produces out/ using Next.js static export. It can be served by a static host. Preserve the apex-domain canonical and asset paths; GitHub Pages subpath hosting requires an explicit basePath decision. Nothing has been pushed or deployed. Consultation backend parity must be resolved before launch; the original private Server Action cannot be exported from a public page.

No Python tooling or requirements.txt is needed. No runtime environment variable is used by Stage 1, so .env.example is intentionally omitted; add it when the Stage 2 backend is selected.
