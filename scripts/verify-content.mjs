import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { launchEvidenceBrowser } from './evidence-browser.mjs';
import { serve } from './preview.mjs';
import { compare } from './content-compare.mjs';
import { verifyInteractions } from './verify-interactions.mjs';
const bytes = await readFile('content/legacy-snapshot.json');
const hash = (await readFile('content/lock.sha256', 'utf8')).trim();
assert.equal(
  createHash('sha256').update(bytes).digest('hex'),
  hash,
  'Immutable legacy snapshot changed',
);
const snapshot = JSON.parse(bytes);
const content = JSON.parse(await readFile('content/site-content.json', 'utf8'));
const records = {
  pages: content.pages,
  states: content.states,
  clientMessages: content.clientMessages,
  accessibility: content.accessibility,
};
assert.equal(
  createHash('sha256').update(JSON.stringify(records)).digest('hex'),
  (await readFile('content/records-lock.sha256', 'utf8')).trim(),
  'Original authored/state/attribute records changed',
);
const allow = JSON.parse(await readFile('content/allowed-diffs.json', 'utf8'));
assert.deepEqual(
  allow.contentDifferences,
  [],
  'Text/content exceptions are forbidden',
);
assert.deepEqual(
  content.pages.map((p) => p.route),
  ['/'],
  'Update route coverage if source evidence establishes another route',
);
assert.deepEqual(
  content.states,
  snapshot.states,
  'Captured interaction content changed',
);
assert.deepEqual(
  content.pages[0].head,
  snapshot.head,
  'SEO source data changed',
);
// Coverage gate: an animation-timed source capture must not hide an entire section.
assert.equal(allow.approvedAttributeCorrections.length, 1);
assert.equal(
  allow.approvedAttributeCorrections[0].selector,
  'input[name="phone"]',
);
assert.equal(allow.approvedAttributeCorrections[0].attribute, 'pattern');
assert.equal(
  allow.approvedAttributeCorrections[0].value,
  content.ui.form.phonePattern,
);
const mainIds = [
  'hero',
  'problem',
  'difference',
  'services',
  'engine',
  'why',
  'start',
  'cta',
];
for (const profile of snapshot.profiles) {
  for (const id of mainIds) {
    const section = content.pages[0].sections.find((s) => s.id === id);
    const observed = profile.sections.find((s) => s.id === id);
    assert.ok(observed?.text.length > 30, 'Empty source section: ' + id);
    for (const item of section.items.filter((i) => /^h[1-6]$/.test(i.kind))) {
      assert.ok(
        observed.text.includes(item.displayText),
        'Source capture missed heading: ' + item.text,
      );
    }
  }
  assert.ok(
    profile.sections.find((s) => s.id === 'engine').text.length > 800,
    'Source capture must include all seven static engine steps',
  );
}

assert.deepEqual(
  content.accessibility,
  snapshot.accessibility,
  'Source accessible labels changed',
);
const withMotion = process.argv.includes('--motion');
let server;
let browser;
let closeBrowser;
const report = {
  stage: 3,
  motion: withMotion,
  scope:
    'Real rendered mobile/desktop in both themes against independent legacy profiles. Includes rendered menu/dialog/loop/form-attribute/theme interaction checks; motion flag controls the preference.',
  approvedAttributeCorrections: allow.approvedAttributeCorrections,
  checks: [],
  diffs: [],
};
try {
  const arg = process.argv.indexOf('--url');
  let base = arg >= 0 ? process.argv[arg + 1] : null;
  if (!base) {
    server = await serve(4473);
    base = 'http://127.0.0.1:4473';
  }
  ({ browser, close: closeBrowser } = await launchEvidenceBrowser('content'));
  for (const profile of snapshot.profiles) {
    const context = await browser.newContext({
      viewport: { width: profile.width, height: 1000 },
      reducedMotion: withMotion ? 'no-preference' : 'reduce',
      colorScheme: profile.theme,
    });
    await context.addInitScript((theme) => {
      if (!localStorage.getItem('ignitra-theme'))
        localStorage.setItem('ignitra-theme', theme);
    }, profile.theme);
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    if (withMotion) {
      await page.waitForFunction(
        () => document.body.dataset.motionReady === 'true',
      );
      // Settle every real reveal while reading the complete page in source order.
      for (const target of await page
        .locator(
          'main h1, main h2, .service-row, .problem-row, .why-card, .start-grid, .compound-row, .engine-step',
        )
        .all()) {
        await target.scrollIntoViewIfNeeded();
        await page.waitForTimeout(1100);
      }
      await page.evaluate(() => scrollTo(0, 0));
      await page.waitForTimeout(1500);
    }
    const actual = await page.evaluate(() => {
      const norm = (s) => s.replace(/\s+/g, ' ').trim();
      const visible = (e) => {
        for (let a = e; a; a = a.parentElement) {
          const s = getComputedStyle(a);
          if (
            s.display === 'none' ||
            s.visibility === 'hidden' ||
            Number(s.opacity) === 0 ||
            a.hidden
          )
            return false;
        }
        return true;
      };
      const text = (e) => {
        const w = document.createTreeWalker(e, NodeFilter.SHOW_TEXT);
        let n;
        const result = [];
        while ((n = w.nextNode()))
          if (
            !n.parentElement.closest('script,style,noscript') &&
            visible(n.parentElement) &&
            norm(n.textContent)
          )
            result.push(norm(n.textContent));
        return result.join(' ');
      };
      const section = (e) => ({
        id: e.dataset.contentSection,
        text: text(e),
        links: [...e.querySelectorAll('a')].filter(visible).map((a) => ({
          text: norm(a.textContent),
          href: a.getAttribute('href'),
          target: a.getAttribute('target'),
        })),
        images: [...e.querySelectorAll('img')]
          .filter(visible)
          .map((i) => i.getAttribute('alt')),
      });
      return {
        sections: [...document.querySelectorAll('[data-content-section]')].map(
          section,
        ),
        bodyText: text(document.body),
        title: document.title,
        lang: document.documentElement.lang,
        meta: [...document.head.querySelectorAll('meta')]
          .filter(
            (e) =>
              !['charset', 'viewport', 'next-size-adjust'].includes(
                e.getAttribute('name') ||
                  (e.getAttribute('charset') && 'charset'),
              ),
          )
          .map((e) =>
            Object.fromEntries([...e.attributes].map((a) => [a.name, a.value])),
          ),
        headLinks: [
          ...document.head.querySelectorAll(
            'link[rel=canonical],link[rel=manifest],link[rel=icon],link[rel=apple-touch-icon]',
          ),
        ].map((e) =>
          Object.fromEntries([...e.attributes].map((a) => [a.name, a.value])),
        ),
        structuredData: [
          ...document.querySelectorAll('script[type="application/ld+json"]'),
        ].map((e) => JSON.parse(e.textContent)),
        overflow: document.documentElement.scrollWidth > innerWidth,
      };
    });
    const expected = {
      sections: profile.sections,
      bodyText: profile.sections
        .map((s) => s.text)
        .filter(Boolean)
        .join(' '),
      title: snapshot.head.title,
      lang: snapshot.head.lang,
      meta: snapshot.head.meta.filter(
        (m) => !m.charset && m.name !== 'viewport',
      ),
      headLinks: snapshot.head.links,
      structuredData: snapshot.head.structuredData,
      overflow: false,
    };
    const diffs = compare(expected, actual);
    if (errors.length) diffs.push({ key: 'pageerrors', actual: errors });
    report.checks.push({
      width: profile.width,
      theme: profile.theme,
      result: diffs.length ? 'FAIL' : 'PASS',
    });
    report.diffs.push(
      ...diffs.map((d) => ({
        profile: profile.width + '-' + profile.theme,
        ...d,
      })),
    );
    if (!diffs.length) {
      try {
        report.checks.at(-1).interactions = await verifyInteractions(
          page,
          snapshot,
          profile,
          allow,
        );
      } catch (error) {
        report.diffs.push({
          profile: profile.width + '-' + profile.theme,
          key: 'interactions',
          message: error.message,
        });
        report.checks.at(-1).result = 'FAIL';
      }
    }
    console.log(
      profile.width + '-' + profile.theme + ': ' + report.checks.at(-1).result,
    );
    await page.goto('about:blank');
    await context.close();
  }
  await mkdir('output/verification', { recursive: true });
  await writeFile(
    'output/verification/content-report.json',
    JSON.stringify(report, null, 2),
  );
  console.log(
    JSON.stringify(
      {
        checks: report.checks,
        differences: report.diffs.length,
        details: 'output/verification/content-report.json',
      },
      null,
      2,
    ),
  );
  if (report.diffs.length) process.exitCode = 1;
} finally {
  await closeBrowser?.();
  await new Promise((resolve) => (server ? server.close(resolve) : resolve()));
}
