# Ignitra rebuild

Read docs/HANDOFF.md first, then docs/SECTION_MAP.md and content/site-content.json before code.

## Stack and scope

Fresh Next.js App Router + strict TypeScript, static export, Tailwind v4 and CSS tokens. GSAP/ScrollTrigger and Lenis load lazily for motion; R3F and a meshopt GLB load only on eligible desktop devices. Three is compatibility-pinned to 0.182.0 (see docs/MOTION.md). Legacy source is the public Ignitra URL; evidence in docs/legacy-source is reference only. Never reuse its code/layout or edit a supplied legacy/ folder.

## Commands

Node 24.11.0. Install: npm ci. Dev: npm run dev. Build: npm run build. Preview: npm run preview (127.0.0.1:4173). Lint: npm run lint. Types: npm run typecheck. Tests: npm test. Content: npm run verify-content (build first). Visual: npm run test:visual. Lighthouse: npm run lighthouse (build first). Format: npm run format.

## Content lock

All site copy, labels, accessibility strings, hrefs, alt text, metadata and states come through src/lib/content/index.ts from content/site-content.json. Preserve wording, punctuation, case, duplicates and order. Never edit legacy-snapshot.json or lock.sha256 to make a test pass. Only the icon-only theme toggle label and technical attributes may differ. Run rendered verify-content before every commit. Extend interaction verification in Stage 2; never weaken current checks. No invented copy or claims.

## Design and code

Use docs/DESIGN.md and src/styles/tokens.css. Both themes required; no color literals outside tokens (locked legacy SEO/manifest values are documented exceptions). Keep ember fill exact; use accent-text for light-theme text. Motion tokens in src/lib/motion/tokens.ts. Reduced motion must expose all content. Clean up every animation/event/3D resource. Keep JSON access centralized, use semantic components and small client islands. Avoid new dependencies without purpose. No live form submissions in QA.

## Map

content/: immutable baseline and copy. src/app/: routes. src/components/{ui,sections,layout}/: implemented responsive UI; the temporary proof renderer was removed in Stage 2. src/lib/{content,theme,motion}/: shared contracts. src/styles/: tokens and global CSS. public/assets/: local assets/fonts. scripts/: audit and verification. docs/: evidence, plan and handoff. 3D lives in src/components/scene/ and public/assets/models/. src/lib/motion/runtime.ts owns scroll lifecycle; src/styles/motion.css owns supporting effects; src/lib/theme/transition.ts owns theme reveal.

## Stages and models

1. GPT-6-Astra (High): audit, content lock, scaffold, tokens, documentation.
2. GPT-6.1-Sol: designed UI in both themes, interactions/forms; no scroll motion.
3. GPT-6-Astra (High): motion, scroll, 3D and theme transition.
4. GPT-6.1-Sol: performance, accessibility, browser QA and final report.
   State stage/model at entry, reselect relevant skills each stage, and stop at the model handoff. The runtime may not expose its variant; do not assert an independently verified identity.

## Budgets and Git

Target mobile Lighthouse >=85, LCP <2.5s, CLS <0.1; 60fps desktop scrolling. Lazy-load 3D, cap DPR at 2; use static posters on low-power/reduced-motion devices. Build on build/from-scratch with main retained. Commit verified phases; do not push or deploy without a request. The repository was initialized by the sandbox identity; if necessary use command-scoped git -c safe.directory="D:/My Space/Ignitra Website" rather than changing global configuration.

Stage 2 correction: the user explicitly approved fixing the malformed phone pattern on 2026-10-25. The exact original/new attribute pair is in content/allowed-diffs.json; source evidence stays unchanged. Original authored/state/attribute records are additionally frozen by content/records-lock.sha256. Never alter either lock to pass a check. Production consultation delivery needs an approved NEXT_PUBLIC_CONSULTATION_ENDPOINT; no endpoint means disabled Send request. npm run test:delivery uses intercepted local requests and restores the disabled production build.

Stage handoff: user explicitly approved “Defer delivery; hand off to Stage 3.” Stage 2 is closed; consultation endpoint/error/delivery work is a pre-launch dependency. It does not block Stage 3 motion work. Keep live sending disabled until configured and verified; do not claim delivery parity.

Stage 3 checks: npm run test:motion; node scripts/verify-content.mjs --motion (build first, same immutable comparisons after real reveals settle); node scripts/capture-motion.mjs against the running preview. npm run build:rocket regenerates the owned compressed asset. Never weaken the reduced-motion baseline. Final performance/Lighthouse and comprehensive accessibility QA remain Stage 4.
