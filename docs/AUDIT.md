# Legacy audit

Source: https://www.ignitra.co.in/ (live public page, captured in this workspace). Inspiration: https://www.atomikgrowth.com/.

## Scope and observations

One public homepage was found; navigation uses #main, #services, #engine and #cta. robots.txt and sitemap.xml were copied. No additional public page route is advertised in the source or sitemap. Existing title, meta tags, canonical, OG/Twitter values and ProfessionalService JSON-LD are locked. The old site already uses Next.js, theme-specific PNG logos, Archivo Expanded, Inter, IBM Plex Mono, GSAP, and procedural Three.js visuals.

Eight main sections: hero, problem, difference, services, engine, why, start, CTA. Footer and mobile sticky actions follow. A logo intro and consultation dialog are separate states. The loop changes stage description on selection. The desktop engine changes stages while pinned; reduced motion/mobile displays all seven steps. The brief progresses Pending to Captured/Diagnosed/Recommended/Scoped/Priced. The consultation CTA opens a modal rather than simply following its #cta href.

## Backend limitation

Consultation uses private Next.js Server Action submitConsultation, identified in public client code. Fields: name, email, phone, company, service, message, hidden website honeypot and startedAt timing. Public success/pending/service-validation copy is captured. Server-generated field errors, transport failure messages, destination email/service and validation logic are not publicly available. No real lead was submitted. Do not reuse the deployment-specific action ID as a new-site API. Stage 2 needs the old server source or an approved backend configuration; do not fake success.

## Visual/interaction findings

- Desktop full-page screenshots show a very long blank span around the pinned engine; browser viewport evidence is needed alongside full-page captures to assess animation. The rebuild must use bounded pin durations and retain static fallbacks.
- Mobile is a long dense sequence; use stronger hierarchy and spacing without dropping text or changing order.
- Several small card renders are very dark at their original size. Preserve supplied pixels now; tune scene lighting in Stage 3.
- Desktop hides most engine step copy behind interaction. Reduced-motion baseline explicitly exposes all seven.
- Legacy defaults to dark via its head script rather than following system preference; the requested system-default behavior is a deliberate functional improvement.
- Placeholder/label contrast and all interactive focus states require measured Stage 4 review; no unsupported WCAG compliance claim is made here.

## Reference observations

Atomik was opened and scrolled in a real browser. Captures in reference-screenshots show framed content rails, large dark negative space, a contrasting client band, a compact floating pill nav after scrolling, and image-led service compositions with amber streaks. The hero background media was not visible in the automated capture; do not infer its precise choreography. Transfer spacing, restrained lighting and section pacing only. Ignitra has no client strip, case studies, FAQ, testimonial video or business statistics; none may be added.

## Evidence

legacy-screenshots/{375,768,1440,1920}.png and consultation-1440.png are actual captures. Source HTML and JS/CSS were downloaded solely for content/behavior audit and are excluded from production and Git; manifest hashes retain provenance. Extraction also captures eleven interaction states independently.

## Known content concerns

The postal address contains the original spellings “Devsharnam Appt.”, “Parijati Bunglows” and “B/h”; they are preserved without correction. The “Hover a stage” hint is retained on touch layouts. Footer year is the literal source 2026. No external WhatsApp, phone, email or map action was sent.
