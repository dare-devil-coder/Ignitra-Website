import { test, expect } from '../fixtures';
for (const theme of ['dark', 'light'] as const) {
  test(
    'desktop motion, pinning, theme continuity and teardown ' + theme,
    async ({ page }) => {
      test.setTimeout(90000);
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.emulateMedia({
        colorScheme: theme,
        reducedMotion: 'no-preference',
      });
      const problems: string[] = [],
        modelRequests: string[] = [];
      page.on('pageerror', (e) => problems.push(e.message));
      page.on('console', (m) => {
        if (['warning', 'error'].includes(m.type())) problems.push(m.text());
      });
      page.on('request', (r) => {
        if (r.url().endsWith('.glb')) modelRequests.push(r.url());
      });
      await page.goto('/');
      await expect(page.locator('body')).toHaveAttribute(
        'data-motion-ready',
        'true',
      );
      await expect(page.locator('[data-scene=hero]')).toHaveClass(
        /scene-ready/,
      );
      await page.waitForTimeout(2000);
      await expect(page.locator('.intro-line')).toHaveCSS('opacity', '0');
      const canvas = await page
        .locator('[data-scene=hero] canvas')
        .elementHandle();
      const requests = modelRequests.length;
      await page.locator('.nav-pill .theme-toggle').click();
      await expect(page.locator('html')).toHaveAttribute(
        'data-theme',
        theme === 'dark' ? 'light' : 'dark',
      );
      await page.waitForTimeout(500);
      expect(await canvas!.evaluate((el) => el.isConnected)).toBe(true);
      expect(modelRequests.length).toBe(requests);
      await page.locator('.nav-pill .theme-toggle').click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'output/stage3/' + theme + '-hero.png' });
      await page.locator('h1').click();
      await page.mouse.move(1200, 450);
      await expect(page.locator('body')).toHaveClass(/cursor-active/);
      await page.mouse.wheel(0, 1800);
      await page.waitForTimeout(1200);
      await expect(page.locator('[data-scene=hero]')).toHaveAttribute(
        'data-scene-active',
        'false',
      );
      expect(
        await page
          .locator('.nav-wrap')
          .evaluate((e) => e.getBoundingClientRect().bottom),
      ).toBeLessThan(0);
      await page.mouse.wheel(0, -180);
      await page.waitForTimeout(700);
      expect(
        await page
          .locator('.nav-wrap')
          .evaluate((e) => e.getBoundingClientRect().top),
      ).toBeGreaterThan(0);
      await page.locator('.nav-links a[href="#engine"]').click();
      await page.waitForTimeout(1800);
      await expect(page).toHaveURL(/#engine$/);
      await expect(page.locator('[data-scene=engine]')).toHaveClass(
        /scene-ready/,
      );
      // The same rail remains at its pinned position while distinct source rows pass.
      const steps = page.locator('.engine-step');
      await steps.nth(2).scrollIntoViewIfNeeded();
      await page.waitForTimeout(1300);
      const a = await page
        .locator('.engine-visual')
        .evaluate((e) => e.getBoundingClientRect().top);
      await page.screenshot({ path: 'output/stage3/' + theme + '-engine.png' });
      await steps.nth(4).scrollIntoViewIfNeeded();
      await page.waitForTimeout(1300);
      const b = await page
        .locator('.engine-visual')
        .evaluate((e) => e.getBoundingClientRect().top);
      expect(Math.abs(a - b)).toBeLessThan(5);
      expect(a).toBeGreaterThan(80);
      expect(a).toBeLessThan(200);
      await page.locator('#why-h').scrollIntoViewIfNeeded();
      await page.waitForTimeout(1200);
      expect(
        await page
          .locator('.engine-visual')
          .evaluate((e) => e.getBoundingClientRect().bottom),
      ).toBeLessThan(0);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await expect(page.locator('body')).not.toHaveAttribute(
        'data-motion-ready',
      );
      await expect(page.locator('.pin-spacer')).toHaveCount(0);
      await expect(page.locator('canvas')).toHaveCount(0);
      await expect(page.locator('.motion-word')).toHaveCount(0);
      for (const heading of await page
        .locator('main h1, main h2, main h3')
        .all())
        await expect(heading).toBeVisible();
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await expect(page.locator('body')).toHaveAttribute(
        'data-motion-ready',
        'true',
      );
      expect(await page.locator('.pin-spacer').count()).toBe(2);
      await page.setViewportSize({ width: 375, height: 900 });
      await expect(page.locator('.pin-spacer')).toHaveCount(0);
      await expect(page.locator('canvas')).toHaveCount(0);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      expect(problems).toEqual([]);
    },
  );
  test(
    'mobile menu, dialog, theme fallback and posters ' + theme,
    async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 900 });
      await page.emulateMedia({
        colorScheme: theme,
        reducedMotion: 'no-preference',
      });
      await page.addInitScript(() =>
        Object.defineProperty(document, 'startViewTransition', {
          value: undefined,
        }),
      );
      await page.goto('/');
      await expect(page.locator('body')).toHaveAttribute(
        'data-motion-ready',
        'true',
      );
      await page.waitForTimeout(2000);
      await expect(page.locator('canvas')).toHaveCount(0);
      await page.locator('.menu-trigger').click();
      await page.locator('#mobile-menu .theme-toggle').click();
      await page.waitForTimeout(500);
      await expect(page.locator('html')).not.toHaveClass(/theme-fading/);
      await page.screenshot({
        path: 'output/stage3/' + theme + '-mobile-menu.png',
      });
      await page.keyboard.press('Escape');
      await expect(page.locator('.menu-trigger')).toBeFocused();
      await page.locator('.hero [data-consultation]').click();
      await expect(page.locator('.consultation-dialog')).toBeVisible();
      for (let i = 0; i < 14; i++) {
        await page.keyboard.press('Tab');
        expect(
          await page
            .locator('.consultation-dialog')
            .evaluate((e) => e.contains(document.activeElement)),
        ).toBe(true);
      }
      await page.keyboard.press('Escape');
      await page.evaluate(() => scrollTo(0, 0));
      await page.waitForTimeout(700);
      await page.screenshot({
        path: 'output/stage3/' + theme + '-mobile.png',
        fullPage: false,
      });
      await expect(page.locator('.pin-spacer')).toHaveCount(0);
    },
  );
}
test('low-power devices do not request 3D, and repeat visits skip intro', async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'deviceMemory', { value: 2 }),
  );
  await page.setViewportSize({ width: 1440, height: 1000 });
  const models: string[] = [];
  page.on('request', (r) => {
    if (r.url().endsWith('.glb')) models.push(r.url());
  });
  await page.goto('/');
  await expect(page.locator('body')).toHaveAttribute(
    'data-motion-ready',
    'true',
  );
  await page.waitForTimeout(2000);
  await expect(page.locator('canvas')).toHaveCount(0);
  expect(
    await page.evaluate(() => sessionStorage.getItem('ignitra-intro-seen')),
  ).toBe('1');
  await page.reload();
  await expect(page.locator('body')).toHaveAttribute(
    'data-motion-ready',
    'true',
  );
  await expect(page.locator('.intro-line')).toHaveCSS('opacity', '0');
  expect(models).toEqual([]);
});
test('model download failure keeps the original poster', async ({ page }) => {
  await page.route('**/*.glb', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'model/gltf-binary',
      body: 'invalid model for local failure test',
    }),
  );
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await page.waitForTimeout(2500);
  await expect(page.locator('[data-scene=hero]')).not.toHaveClass(
    /scene-ready/,
  );
  await expect(page.locator('[data-scene=hero] img:visible')).toHaveCount(1);
  await expect(page.locator('h1')).toBeVisible();
});
test('rapid theme reversal and unavailable WebGL preserve the page', async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(window, 'WebGL2RenderingContext', {
      value: undefined,
    }),
  );
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await expect(page.locator('body')).toHaveAttribute(
    'data-motion-ready',
    'true',
  );
  await page
    .locator('.nav-pill .theme-toggle')
    .evaluate((button: HTMLButtonElement) => {
      button.click();
      button.click();
    });
  await page.waitForTimeout(700);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(page.locator('[data-scene=hero]')).not.toHaveClass(
    /scene-ready/,
  );
  await expect(page.locator('h1')).toBeVisible();
});
