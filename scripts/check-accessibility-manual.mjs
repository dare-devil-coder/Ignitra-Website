import { writeFile } from 'node:fs/promises';
import { serve } from './preview.mjs';
import { launchEvidenceBrowser } from './evidence-browser.mjs';
const server = await serve(4479),
  { browser, close } = await launchEvidenceBrowser('manual-accessibility');
const report = [];
try {
  for (const theme of ['dark', 'light']) {
    const context = await browser.newContext({
      viewport: { width: 375, height: 1000 },
      colorScheme: theme,
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4479');
    await page.locator('#hero [data-consultation]').first().click();
    const check = async (state) => {
      const result = await page.evaluate(() => {
        const button = document.querySelector('.service-select');
        const id = button.getAttribute('aria-controls');
        return {
          expanded: button.getAttribute('aria-expanded'),
          controls: id,
          targetExists: !!document.getElementById(id),
          dialogNamed: !!document.querySelector('#consult-title')?.textContent,
          focusInside: document
            .querySelector('.consultation-dialog')
            .contains(document.activeElement),
        };
      });
      report.push({ theme, state, ...result });
    };
    await check('closed-selector');
    await page.screenshot({ path: `docs/after/${theme}-consultation.png` });
    await page.locator('.service-select').click();
    await check('open-selector');
    await page.screenshot({ path: `docs/after/${theme}-service-options.png` });
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await check('selected');
    await page.keyboard.press('Escape');
    await page.locator('.menu-trigger').click();
    await page.screenshot({ path: `docs/after/${theme}-mobile-menu.png` });
    await context.close();
  }
  await writeFile(
    'docs/accessibility-manual-stage4.json',
    JSON.stringify(
      {
        method:
          'Manual DOM/keyboard supplement to axe incomplete ARIA checks. aria-controls points to the listbox when expanded; the collapsed list is conditionally unmounted. Contrast over gradients/top-layer surfaces remains a visual/manual check, not an automatic AA certification.',
        checks: report,
      },
      null,
      2,
    ),
  );
  console.log(report);
} finally {
  await close();
  await new Promise((r) => server.close(r));
}
