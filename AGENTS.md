# Ignitra rebuild

Read docs/HANDOFF.md first, then docs/SECTION_MAP.md and content/site-content.json before code.

## Stack and scope

Fresh Next.js App Router + strict TypeScript, static export, Tailwind v4 and CSS tokens. GSAP/ScrollTrigger, Lenis and R3F/drei are pinned but not loaded in Stage 1. Legacy source is the public Ignitra URL; evidence in docs/legacy-source is reference only. Never reuse its code/layout or edit a supplied legacy/ folder.

## Commands

Node 24.11.0. Install: npm ci. Dev: npm run dev. Build: npm run build. Preview: npm run preview (127.0.0.1:4173). Lint: npm run lint. Types: npm run typecheck. Tests: npm test. Content: npm run verify-content (build first). Visual: npm run test:visual. Lighthouse: npm run lighthouse (build first). Format: npm run format.

## Content lock

All site copy, labels, accessibility strings, hrefs, alt text, metadata and states come through src/lib/content/index.ts from content/site-content.json. Preserve wording, punctuation, case, duplicates and order. Never edit legacy-snapshot.json or lock.sha256 to make a test pass. Only the icon-only theme toggle label and technical attributes may differ. Run rendered verify-content before every commit. Extend interaction verification in Stage 2; never weaken current checks. No invented copy or claims.

## Design and code

Use docs/DESIGN.md and src/styles/tokens.css. Both themes required; no color literals outside tokens (locked legacy SEO/manifest values are documented exceptions). Keep ember fill exact; use accent-text for light-theme text. Motion tokens in src/lib/motion/tokens.ts. Reduced motion must expose all content. Clean up every animation/event/3D resource. Keep JSON access centralized, use semantic components and small client islands. Avoid new dependencies without purpose. No live form submissions in QA.

## Map

content/: immutable baseline and copy. src/app/: routes. src/components/foundation/: temporary proof renderer, replace in Stage 2. src/components/{ui,sections,layout}/: future UI. src/lib/{content,theme,motion}/: shared contracts. src/styles/: tokens and global CSS. public/assets/: local assets/fonts. scripts/: audit and verification. docs/: evidence, plan and handoff. Future 3D belongs in src/components/scene/ and public/assets/models/.

## Stages and models

1. GPT-6-Astra (High): audit, content lock, scaffold, tokens, documentation.
2. GPT-6.1-Sol: designed UI in both themes, interactions/forms; no scroll motion.
3. GPT-6-Astra (High): motion, scroll, 3D and theme transition.
4. GPT-6.1-Sol: performance, accessibility, browser QA and final report.
   State stage/model at entry, reselect relevant skills each stage, and stop at the model handoff. The runtime may not expose its variant; do not assert an independently verified identity.

## Budgets and Git

Target mobile Lighthouse >=85, LCP <2.5s, CLS <0.1; 60fps desktop scrolling. Lazy-load 3D, cap DPR at 2; use static posters on low-power/reduced-motion devices. Build on build/from-scratch with main retained. Commit verified phases; do not push or deploy without a request. The repository was initialized by the sandbox identity; if necessary use command-scoped git -c safe.directory="D:/My Space/Ignitra Website" rather than changing global configuration.
