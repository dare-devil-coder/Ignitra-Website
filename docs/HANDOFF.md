# Handoff — Stage 1 complete

## Read first

AGENTS.md, docs/SECTION_MAP.md, content/site-content.json, docs/CONTENT_LOCK.md and tasks/plan.md. User-selected model: GPT-6-Astra / High; runtime variant is not independently exposed. Stage 1 is validated. Switch to GPT-6.1-Sol and begin Stage 2 only when the user requests it.

## Completed

Audited https://www.ignitra.co.in/ as content source and https://www.atomikgrowth.com/ as visual inspiration only. Captured four legacy full-page screenshots plus consultation and reference screenshots. Extracted ordered public copy/links/alts/meta/JSON-LD and eleven observed interaction states. Copied local assets and existing font files; OFL family licenses included. Created a fresh Next.js App Router static-export foundation with strict TypeScript, Tailwind v4 and semantic dark/light tokens. The current / is a plain content ledger, deliberately not the Stage 2 layout.

Final optimized static build, ESLint, strict TypeScript, formatting, six verifier mutation tests and eight foundation screenshot tests passed. Rendered verify-content passed at 375 and 1440 in both themes with zero differences, including canonical/manifest/icon metadata. Design schema lint has zero errors and zero warnings; all supported token categories exported. See docs/VERIFICATION.md and docs/content-verification-stage1.json.

Screenshot review exposed incomplete visibility in the first source capture despite a passing comparison. Its original snapshot/hash are archived unchanged in docs/initial-capture. A new independent live audit visited every heading and waited for visibility; authored text arrays were identical. The corrected baseline includes every section heading and all seven engine stages in all four profiles. The verifier now rejects incomplete section coverage. No copy exception was added.

## Current file map

- src/app: one homepage and root head/font setup.
- src/components/foundation/ContentLedger.tsx: temporary flat content renderer; replace with reusable components in Stage 2. It does not implement menu, loop selection or form submission.
- src/lib/content/index.ts: sole app content/asset lookup.
- src/lib/theme/bootstrap.ts: stored/system theme before paint. Toggle interaction is Stage 2.
- src/lib/motion/tokens.ts: tokens only; no GSAP/Lenis/Three imported into runtime yet.
- src/styles: global proof styling and all palette/theme/motion variables.
- content/site-content.json: authored and displayed text, state records, attributes, source metadata.
- content/legacy-snapshot.json + lock.sha256: independent immutable evidence; never regenerate to make tests pass.
- content/asset-manifest.json: original URLs, hashes, sizes, licenses and dimensions.
- public/assets: local logos, posters, fonts and licenses. Root public files preserve original SEO assets/robots/sitemap/manifest.
- scripts/verify-content.mjs: actual browser comparison of body/section text, order, href/target, visible alt text, SEO and data integrity.
- tests: mutation tests and four-width/two-theme foundation screenshots.
- docs: source inventory, section/asset maps, skills, design, audit and screenshots. foundation-screenshots contains eight Stage 1 proof captures, not final UI evidence. Raw public legacy JS/CSS/HTML are excluded from Git and production.
- tasks/plan.md: exact remaining stage work and effect applicability.

## Decisions

Use the requested Next stack, not a port of the legacy code. Stage 1 includes only a minimal renderer to make its mandatory rendered verification gate possible. Preserve Archivo Expanded, Inter and IBM Plex Mono. Keep literal source 2026 and address spellings. There is procedural rocket geometry on the old site but no reusable GLB; author the new model in Stage 3 and retain posters. No fabricated FAQ, stats, client strip or extra pages.

Measured contrast: body dark 9.18:1, body light 6.87:1, light accent text 5.07:1, ink on ember 6.06:1. Exact ember on cream is 2.38:1; an ink keyline supplements the required ember focus outline in light mode. CSS tokens retain only the four base colors plus permitted derivatives. Original asset pixels and locked SEO black values are intentionally preserved.

## Known issues and dependencies

1. Private consultation Server Action source, delivery configuration and server-generated errors cannot be recovered from the public client. No real submission was made. Get the old backend source or approved endpoint/service configuration before Stage 2 functional completion. Never replay its build-specific action ID or fake success.
2. The verifier currently covers the static reduced-motion baseline; Stage 2 must compare rendered menu/dialog/loop states against the stored independent state evidence. Do not treat state JSON equality as interaction QA.
3. Lighthouse CI has transitive development-tool advisories (16 on initial audit). Production-only npm audit reports zero vulnerabilities. Review/replace compatible tool dependencies in Stage 4; do not use npm audit fix --force blindly.
4. Superdesign login failed writing its user configuration directory during the original sandbox session; no canvas or credits used. Its workflow stopped. The requested Design Report template is deferred until Stage 4 results exist.
5. Windows sandbox setup failed; reviewed require_escalated workspace operations are working. A previous auto-review usage-limit failure was temporary and no denied operation was bypassed. The Git repo belongs to the sandbox user; use command-scoped safe.directory as noted in AGENTS. main is retained at 9c687cf; work is on build/from-scratch. The audit/content/assets commit is ad77597; the following foundation commit includes this handoff. Run git log -3 --oneline to get its final ID. Nothing was pushed or deployed.
6. Some legacy card renders are dark and the pinned engine produces a large empty span in full-page captures. Do not reproduce those defects. Final visual, motion, Lighthouse and accessibility QA are not complete.

## Exact commands

Node 24.11.0. Run from D:/My Space/Ignitra Website:

```powershell
npm ci
npm run dev
# Production validation (separate terminal after stopping dev if needed):
npm run build
npm run lint
npm run typecheck
npm test
npm run verify-content
npm run test:visual
npm run preview
# Stage 4:
npm run lighthouse
```

Dev: http://127.0.0.1:3000. Preview: http://127.0.0.1:4173. The verifier starts its own loopback static server on 4473. Playwright uses installed Chrome (channel chrome); on other machines install Chrome or explicitly configure a Playwright Chromium channel. Screenshot scratch: output/foundation; verifier report: output/verification/content-report.json. Use a writable npm cache if the user-global cache is restricted: $env:npm_config_cache=Join-Path (Get-Location) '.npm-cache'.

No Python or requirements.txt. No runtime environment variables in Stage 1; .env.example is deferred until the backend actually uses variables. No remote, CI or deployment was created.

## Next action

After the user switches to GPT-6.1-Sol and requests Stage 2, re-inventory and reselect skills, read the required files, then follow tasks/plan.md Stage 2. Build the full responsive layout and both themes from the JSON, replace the proof renderer, and add menu/dialog/loop/theme interaction verification. Do not add scroll choreography until Stage 3. Backend source/config is required before claiming consultation delivery parity; independent layout work can proceed.
