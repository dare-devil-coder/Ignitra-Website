import { launchEvidenceBrowser } from './evidence-browser.mjs';
import { mkdir, copyFile, writeFile } from 'node:fs/promises';
const folder = 'docs/stage3-screenshots';
await mkdir(folder, { recursive: true });
const { browser, close } = await launchEvidenceBrowser('motion-capture');
const report = [];
for (const width of [375, 1440])
  for (const theme of ['dark', 'light']) {
    const context = await browser.newContext({
      viewport: { width, height: 1000 },
      colorScheme: theme,
      reducedMotion: 'no-preference',
      ...(width === 1440 && theme === 'dark'
        ? {
            recordVideo: {
              dir: 'output/stage3-video',
              size: { width: 1440, height: 1000 },
            },
          }
        : {}),
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => {
      if (['warning', 'error'].includes(m.type())) errors.push(m.text());
    });
    await page.goto('http://127.0.0.1:4173');
    await page.waitForFunction(
      () => document.body.dataset.motionReady === 'true',
    );
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(2200);
    await page.mouse.move(0, 0);
    await page.screenshot({
      path: folder + '/' + theme + '-' + width + '-hero.png',
    });
    let frame = 0;
    // Actual forward scroll, rather than finishing timelines in test code.
    const height = await page.evaluate(
      () => document.documentElement.scrollHeight,
    );
    for (let y = 0; y < height; y += 700) {
      await page.evaluate((y) => scrollTo(0, y), y);
      await page.waitForTimeout(1100);
      if (width === 1440 && theme === 'dark' && frame++ % 3 === 0)
        await page.screenshot({
          path: folder + '/scroll-' + String(frame).padStart(2, '0') + '.png',
        });
    }
    for (const img of await page.locator('img:visible').all()) {
      await img.scrollIntoViewIfNeeded();
      await img.evaluate((img) => img.decode().catch(() => {}));
    }
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(1400);
    await page.screenshot({
      path: folder + '/' + theme + '-' + width + '-full.png',
      fullPage: true,
    });
    if (width === 1440) {
      await page.locator('.engine-step').nth(3).scrollIntoViewIfNeeded();
      await page.waitForTimeout(1400);
      await page.screenshot({
        path: folder + '/' + theme + '-' + width + '-engine.png',
      });
    }
    report.push({
      width,
      theme,
      errors,
      overflow: await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
    });
    const video = page.video();
    await page.goto('about:blank');
    await context.close();
    if (video) await copyFile(await video.path(), 'docs/stage3-scroll.webm');
    console.log(theme, width, errors.length ? 'ERRORS' : 'PASS');
  }
await writeFile(
  'docs/stage3-capture-report.json',
  JSON.stringify(report, null, 2),
);
await close();
if (report.some((r) => r.errors.length || r.overflow)) process.exitCode = 1;
