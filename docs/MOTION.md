# Stage 3 motion contract

## Focal sequence
The rocket carries the transition from potential to a seven-step Growth Engine. A short hero hold (at most 450px / 45% viewport on tall, fine-pointer desktops) rotates and raises the independently authored rocket. In the engine, a separate rocket rail stays at 140px while all seven original rows remain in normal reading order. A scrubbed progress line and active-row underline connect the scene to the current step. The rail releases before the compounding band. No full-page empty pin span or horizontal reading order is introduced.

## Lifecycle and fallback
MotionRoot dynamically imports src/lib/motion/runtime.ts only with no reduced-motion preference. One scoped GSAP context owns timelines, ScrollTriggers and responsive matchMedia contexts. The returned cleanup removes listeners, ResizeObserver/IntersectionObserver subscriptions, Lenis's ticker, inline animation styles and split-word wrappers. The reduced-motion preference can change live. The default server-rendered page is visible without scripts.

Lenis uses lerp 0.1 on eligible fine-pointer desktops, synchronized with the GSAP ticker. Dialogs stop page smoothing and retain native internal scrolling. Anchors preserve href, history and focus. Touch and constrained devices keep native scrolling. Navigation hides on downward scrolling, returns on upward scrolling, and stays visible for keyboard focus.

RocketIsland gates the 3D chunk by viewport >=1024px, fine pointer, no reduced motion, WebGL2 API, no save-data, >=4 reported cores and >=4GB memory when available. Original theme posters remain in the DOM with unchanged alt attributes. When the scene is ready, the poster is visually clipped while retaining its semantic presence and reserved layout box. Model failure or WebGL initialization failure keeps/restores the poster. The renderer uses transparent clear alpha, no remote environment, DPR 1–1.5 and no shadows or postprocessing. Intersection and document visibility pause the frame loop. Geometry/materials are disposed on unmount, including late loads. Theme events change existing materials/lights without recreating the canvas or loading the GLB again.

## Timing and supporting effects
The unchanged motion token module supplies 0.25s feedback, 0.95s reveals, 1.8s intro budget, 0.35s theme transition, 0.08s line staggering, 40px reveal distance and scrub 1. Heading words retain exact source text/whitespace; equal visual rows share delays. A thin non-text intro line runs only on the first session visit at the top; it never blocks interaction. Card/image reveals, a bounded hero glow, sparse trails, 3px page progress, pointer dot/ring and magnetic primary hero/CTA controls support the focal sequence. No native cursor is hidden. Menu/dialog/loop transitions preserve immediate input and focus.

Theme changes reveal the new view through a circle originating at the icon control. Unsupported browsers get a 0.35s token-color transition; reduced motion switches immediately. Repeated clicks supersede pending transitions. No scroll context depends on theme state. Static generated grain and glow opacity use existing dark/light tokens; low-power/mobile paths omit grain, trails, cursor and heavy parallax.

## Applicability of the requested effects
1. Intro: implemented, non-text and session-skipped.
2. Hero: masked line-group rise, independent live rocket, idle float/turn and pointer tilt under six degrees, ember lighting and restrained trails.
3. Smooth scroll: Lenis on eligible desktop; native touch/low-power/reduced motion.
4. 3D storytelling: bounded hero hold and pinned engine rail, scrub 1; all rows preserved.
5. Reveals: headings, paragraphs, service/problem rows, cards and image wipes.
6. Parallax: bounded hero glow; disabled on reduced/mobile/low-power paths.
7. Count-up: intentionally skipped. Numbers are source step indices, telephone/address/company/year identifiers, not statistics.
8. Marquee: skipped, no client/logo strip exists.
9. Pinned showcase: engine rail; no horizontal section needed.
10. Page progress: 3px ember line.
11. Cursor: additive dot/ring for eligible fine pointers, off in dialogs/touch/reduced motion.
12. Magnetic buttons: hero and final primary CTA, bounded 80px neighborhood.
13. Hover: fill sweep/glow, existing card lift/image scale, footer link underline, nav dot.
14. Accordion: skipped, source has no FAQ/accordion. Existing loop uses a short state transition.
15. Route wipe: skipped, one public route. Anchor scrolling remains functional.
16. Texture: generated 96px ink-alpha grain, theme opacity/blend tokens.
17. Light break: existing single compounding band, inverted in light theme, unchanged content.

## Dependencies and reproducibility
The legacy scene has no public GLB. scripts/build-rocket.mjs independently constructs low-poly geometry using Three, exports glTF, and deduplicates/prunes/meshopt-compresses it with pinned @gltf-transform packages. No textures need WebP conversion. The output is 24,260 bytes, down from 119,500 bytes. Runtime materials use CSS palette values. Run npm run build:rocket only to regenerate this owned asset; never import legacy scene code.

Three and @types/three are pinned to 0.182.0 because the pinned/latest R3F 9.8.2 uses Clock, deprecated with a console warning in Three >=0.183. This compatibility pin avoids hiding warnings or patching vendor code. The production dependency audit reported zero advisories; the existing dev-only LHCI advisories remain Stage 4 work.

Official integration references: [Lenis](https://github.com/darkroomengineering/lenis), [R3F rendering performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance), [View Transitions](https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition).

## Verification commands
Build first: npm run build. Run npm run verify-content for unchanged reduced-motion baseline and interactions; node scripts/verify-content.mjs --motion runs the same comparisons after scrolling and settling real reveals. npm run test:motion checks lifecycle/pinning/theme/fallback behavior. node scripts/capture-motion.mjs captures the motion evidence against npm run preview. Final device performance/Lighthouse, full accessibility QA and final screenshots belong to Stage 4.
