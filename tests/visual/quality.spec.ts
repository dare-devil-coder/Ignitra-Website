import { test, expect } from '../fixtures';
for (const theme of ['dark', 'light'] as const) {
  test(
    'critical resources and heading outline ' + theme,
    async ({ page, request }) => {
      await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
      await page.goto('/');
      const fonts = await page
        .locator('link[rel=preload][as=font]')
        .evaluateAll((nodes) =>
          nodes.map((n) => (n as HTMLLinkElement).getAttribute('href')!),
        );
      expect(new Set(fonts).size).toBe(3);
      for (const font of fonts) {
        const response = await request.get(font);
        expect(response.ok()).toBe(true);
        expect(response.headers()['content-type']).toContain('font/woff2');
      }
      for (const link of await page.locator('.nav-pill a:visible').all()) {
        const box = await link.boundingBox();
        expect(box!.width).toBeGreaterThanOrEqual(44);
        expect(box!.height).toBeGreaterThanOrEqual(44);
      }
      const levels = await page
        .locator('main h1,main h2,main h3')
        .evaluateAll((nodes) => nodes.map((n) => Number(n.tagName[1])));
      expect(levels[0]).toBe(1);
      for (let i = 1; i < levels.length; i++)
        expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
      expect(await page.locator('main').ariaSnapshot()).toContain(
        'Your business has the fuel. We create the spark.',
      );
    },
  );
  test(
    '320 pixel reflow and footer touch targets ' + theme,
    async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 900 });
      await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
      await page.goto('/');
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.locator('footer').scrollIntoViewIfNeeded();
      for (const link of await page.locator('footer a').all()) {
        const box = await link.boundingBox();
        if (box) expect(box.height).toBeGreaterThanOrEqual(44);
      }
      await page.locator('#hero .button-primary').focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('.consultation-dialog')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.locator('#hero .button-primary')).toBeFocused();
    },
  );
  test(
    'stored theme is applied before first frame ' + theme,
    async ({ page }) => {
      await page.emulateMedia({
        colorScheme: theme === 'dark' ? 'light' : 'dark',
        reducedMotion: 'reduce',
      });
      await page.addInitScript((theme) => {
        localStorage.setItem('ignitra-theme', theme);
        requestAnimationFrame(
          () =>
            (document.documentElement.dataset.firstFrameTheme =
              document.documentElement.dataset.theme),
        );
      }, theme);
      await page.goto('/');
      await expect(page.locator('html')).toHaveAttribute(
        'data-first-frame-theme',
        theme,
      );
      await page.reload();
      await expect(page.locator('html')).toHaveAttribute(
        'data-first-frame-theme',
        theme,
      );
    },
  );
}
test('static content stays readable without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 375, height: 900 },
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173');
  await expect(page.locator('main h1')).toBeVisible();
  await expect(page.locator('main h2')).toHaveCount(7);
  for (const h of await page.locator('main h2').all())
    await expect(h).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await context.close();
});
