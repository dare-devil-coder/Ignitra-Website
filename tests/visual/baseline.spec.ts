import { test, expect } from '@playwright/test';
for (const theme of ['dark', 'light'] as const)
  for (const width of [375, 768, 1440, 1920])
    test(theme + ' ' + width, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
      await page.goto('/');
      await expect(page.locator('h1:visible')).toHaveCount(1);
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      await page.evaluate(() => document.fonts.ready);
      for (const img of await page.locator('img:visible').all()) {
        await img.scrollIntoViewIfNeeded();
        await expect(img).toHaveJSProperty('complete', true);
        expect(
          await img.evaluate((e: HTMLImageElement) => e.naturalWidth),
        ).toBeGreaterThan(0);
      }
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({
        path: 'output/stage2/' + theme + '-' + width + '.png',
        fullPage: true,
      });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    });
