# Stage 4 performance experiments

All tests use the static export and official Lighthouse 13.5.0. Final medians come from three fresh Chrome processes per device/theme. No concurrent browser/build jobs are intended during the final matrix. Localhost synthetic results are not field Core Web Vitals or a hardware guarantee.

| Attempt | Evidence and decision |
| --- | --- |
| Replace LHCI wrapper | Existing wrapper had 16 development advisories. Current official Lighthouse plus a local budget runner has zero audit advisories. Kept; runtime stack unchanged. |
| Correct measurement harness | A setup tab could retain a live scene; repeated samples could retain state. Discarded those provisional score sets. Each final sample now starts a new Chrome process, prepares only the theme, clears HTTP cache and closes the setup page to about:blank. Desktop uses the official desktop config. |
| Gzip preview responses | HTML is about 91 KB decoded and 16 KB gzipped. Correct gzip negotiation, Content-Length and Vary are implemented. The automation transport exposes x-content-encoding-over-network and decoded byte accounting, so no Lighthouse gain is attributed to gzip. Final-host compression still needs verification. |
| Lossless brand WebP | Original PNG bytes preserved. Three derivatives save 59,252 bytes with unchanged pixels, dimensions and alpha. Kept for exact payload reduction; not presented as a standalone Lighthouse-score gain. Existing WebP posters/cards are already small. |
| Font preload restoration | Next 16.4.3 emits an empty next-font manifest in this export. CSS identifies the same three font files; finalize-export adds missing font hints without changing fonts or copy. A direct mobile experiment improved scores to 95/96, though LCP still reached 2.5–2.7 s. Kept and guarded by real resource tests. |
| Image priority | Decorative hero imagery and both eager navigation theme variants get low fetch priority so fonts can lead. Pixel/content output is unchanged. Included in final measurement; no isolated score claim. |
| Stable touch/mobile hero | The desktop intro remains; mobile/touch no longer splits/hides the critical headline after hydration. Normal section and UI motion remain. Final medians and all samples are in lighthouse/summary.json. Kept only with content/browser checks passing. |

The final budget runner exits nonzero when any profile's median performance is below 85, LCP is at least 2.5 seconds, or CLS is at least 0.1. Report sample ranges as well as medians. Re-run on the final host and real mobile hardware before claiming field performance. No analytics, paid service or user-data collection was added.
