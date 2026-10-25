# Consultation delivery configuration

The user confirmed that the original website source is unavailable. Its public client reveals field names and success/pending copy, but not the private Server Action's implementation, delivery destination, validation errors or failure copy. The new interface is implemented; real delivery is not certified. No request was sent to Ignitra or a third-party live form.

## What the owner needs to supply

An approved form endpoint and its delivery/account configuration. A replacement service must accept the contract below, or its adapter must be implemented and verified before use. The original website's deployment-specific action ID is never called. A static export cannot host its own Next Server Action.

Set NEXT_PUBLIC_CONSULTATION_ENDPOINT in .env.local, then rebuild. This URL is public browser configuration, not a place for a private API secret. The production build currently has no endpoint; Send request stays disabled. Do not enable it against an unapproved URL.

The POST body is JSON with name, email, phone, company, service, message, website (honeypot) and startedAt. Success requires HTTP success plus JSON {"ok":true}. Service uses its exact selected label. Field errors may be a keyed errors object, but original server-generated error text is unavailable: obtain and approve an error catalog/adapter before production. General/network failure text is deliberately not invented; the current adapter never shows success for failed/unacknowledged requests and permits retry. Server validation, spam protection, privacy, CORS and delivery reliability must be provided by the chosen endpoint.

A hosted option can be assessed using [Formspree's JavaScript form documentation](https://help.formspree.io/articles/building-your-form/submit-forms-with-javascript-ajax). No provider/account was created or selected without owner configuration.

## Reproducible local test

Run npm run test:delivery. It builds with a loopback-only endpoint, intercepts every submission in Playwright, tests required fields/service, pending lock, failure without false success, retry, payload and acknowledged success, then rebuilds with an empty endpoint in finally. It uses reserved example.invalid data. The expected mocked 422 appears as a browser resource error in its report; normal-page tests have no console errors/warnings. If the command is forcibly killed, run npm run build with NEXT_PUBLIC_CONSULTATION_ENDPOINT unset before using out/.

## Approved correction

The original phone pattern was invalid under the browser's Unicode-v regex rules. The user approved correcting it on 2026-10-25. The exact correction is in content/allowed-diffs.json; original source evidence remains locked. Valid/invalid phone tests pass without the former regex console error.

## User-approved deferral

The user explicitly instructed “Defer delivery; hand off to Stage 3.” Delivery configuration and verification are deferred until before launch. Stage 3 may proceed after its model handoff; this decision does not enable Send request or certify delivery.
