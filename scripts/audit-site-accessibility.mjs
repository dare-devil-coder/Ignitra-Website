import { mkdir, writeFile } from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
import { launchEvidenceBrowser } from './evidence-browser.mjs';
import { serve } from './preview.mjs';
const server = await serve(4475),
  { browser, close } = await launchEvidenceBrowser('accessibility');
const report = [];
await mkdir('output/stage4', { recursive: true });
try {
  for (const width of [375, 1440])
    for (const theme of ['dark', 'light']) {
      const context = await browser.newContext({
        viewport: { width, height: 1000 },
        reducedMotion: 'reduce',
        colorScheme: theme,
      });
      await context.addInitScript(
        (theme) => localStorage.setItem('ignitra-theme', theme),
        theme,
      );
      const page = await context.newPage();
      await page.goto('http://127.0.0.1:4475');
      await page.evaluate(() => document.fonts.ready);
      const scan = async (state) => {
        const a = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze();
        report.push({
          width,
          theme,
          state,
          violations: a.violations,
          incomplete: a.incomplete.map((i) => ({
            id: i.id,
            nodes: i.nodes.map((n) => ({
              target: n.target,
              summary: n.failureSummary,
            })),
          })),
        });
        await writeFile(
          'output/stage4/accessibility.json',
          JSON.stringify(report, null, 2),
        );
        console.log(
          `${width}-${theme}-${state}: ${a.violations.length} violations`,
        );
      };
      await scan('page');
      await page.locator('#hero [data-consultation]').first().click();
      await scan('consultation');
      await page.locator('button[role=combobox]').click();
      await scan('service-options');
      await page.keyboard.press('Escape');
      await page.keyboard.press('Escape');
      if (width < 768) {
        await page.locator('.menu-trigger').click();
        await scan('mobile-menu');
      }
      await context.close();
    }
  await writeFile(
    'output/stage4/accessibility.json',
    JSON.stringify(report, null, 2),
  );
  if (report.some((r) => r.violations.length)) process.exitCode = 1;
} finally {
  await close();
  await new Promise((r) => server.close(r));
}
