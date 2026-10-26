import { mkdir, writeFile, copyFile } from 'node:fs/promises';
import { launchEvidenceBrowser } from './evidence-browser.mjs';
import { serve } from './preview.mjs';
const server = await serve(4476),
  { browser, close } = await launchEvidenceBrowser('final-captures');
await mkdir('docs/after', { recursive: true });
const report = [];
try {
  for (const width of [360, 375, 768, 1024, 1440, 1920])
    for (const theme of ['dark', 'light']) {
      const context = await browser.newContext({
        viewport: { width, height: 1000 },
        colorScheme: theme,
        reducedMotion: 'no-preference',
      });
      await context.addInitScript((theme) => {
        try {
          localStorage.setItem('ignitra-theme', theme);
          sessionStorage.setItem('ignitra-intro-seen', '1');
        } catch {
          /* The final about:blank cleanup has no storage origin. */
        }
      }, theme);
      const page = await context.newPage(),
        errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      page.on('console', (m) => {
        if (['warning', 'error'].includes(m.type())) errors.push(m.text());
      });
      await page.goto('http://127.0.0.1:4476', { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(
        () => document.body.dataset.motionReady === 'true',
      );
      await page.waitForTimeout(1800);
      if ([375, 1440].includes(width))
        await page.screenshot({
          path: `docs/after/${theme}-${width}-hero.png`,
        });
      for (const target of await page
        .locator(
          'main h2,.service-row,.problem-row,.why-card,.start-grid,.compound-row,.engine-step',
        )
        .all()) {
        await target.scrollIntoViewIfNeeded();
        await page.waitForTimeout(90);
      }
      await page.waitForTimeout(1200);
      for (const img of await page.locator('img:visible').all())
        await img.evaluate((img) => img.decode().catch(() => {}));
      await page.evaluate(() => scrollTo(0, 0));
      await page.waitForTimeout(1400);
      if ([375, 768, 1440, 1920].includes(width))
        await page.screenshot({
          path: `docs/after/${theme}-${width}.png`,
          fullPage: true,
        });
      const layout = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        headings: [...document.querySelectorAll('main h1,main h2,main h3')]
          .filter(
            (e) =>
              e.getBoundingClientRect().right > innerWidth + 1 ||
              e.getBoundingClientRect().left < -1,
          )
          .map((e) => e.id || e.textContent),
        smallTargets: [...document.querySelectorAll('button,a')]
          .filter((e) => {
            const r = e.getBoundingClientRect(),
              s = getComputedStyle(e);
            return (
              r.width &&
              r.height &&
              s.visibility !== 'hidden' &&
              (r.height < 44 || r.width < 44)
            );
          })
          .map((e) => ({ text: e.textContent?.trim(), class: e.className })),
      }));
      report.push({ width, theme, errors, ...layout });
      console.log(
        `${width}-${theme}: ${errors.length} console issues; overflow=${layout.overflow}`,
      );
      await page.goto('about:blank');
      await context.close();
    }
  await writeFile(
    'docs/after/capture-report.json',
    JSON.stringify(report, null, 2),
  );
  if (
    report.some(
      (r) =>
        r.errors.length ||
        r.overflow ||
        r.headings.length ||
        r.smallTargets.length,
    )
  )
    process.exitCode = 1;
} finally {
  await close();
  await new Promise((r) => server.close(r));
}
