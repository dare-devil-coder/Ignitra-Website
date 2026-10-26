import { test, expect } from '../fixtures';
for (const theme of ['dark', 'light'] as const) {
  test(
    'system theme, before-paint and storage failure ' + theme,
    async ({ page }) => {
      const problems: string[] = [];
      page.on('pageerror', (e) => problems.push(e.message));
      page.on('console', (m) => {
        if (['warning', 'error'].includes(m.type())) problems.push(m.text());
      });
      await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
      await page.addInitScript(() => {
        Object.defineProperty(Storage.prototype, 'getItem', {
          value: () => {
            throw new DOMException('Blocked');
          },
        });
        Object.defineProperty(Storage.prototype, 'setItem', {
          value: () => {
            throw new DOMException('Blocked');
          },
        });
        requestAnimationFrame(() => {
          document.documentElement.dataset.firstFrameTheme =
            document.documentElement.dataset.theme;
        });
      });
      await page.goto('/');
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      await expect(page.locator('html')).toHaveAttribute(
        'data-first-frame-theme',
        theme,
      );
      await page.locator('.nav-pill .theme-toggle').click();
      await expect(page.locator('html')).toHaveAttribute(
        'data-theme',
        theme === 'dark' ? 'light' : 'dark',
      );
      expect(problems).toEqual([]);
    },
  );
  for (const width of [360, 1024])
    test(
      'content and keyboard bounds ' + theme + ' ' + width,
      async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.emulateMedia({
          colorScheme: theme,
          reducedMotion: 'reduce',
        });
        await page.goto('/');
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        await page.keyboard.press('Tab');
        await expect(page.locator('.skip-link')).toBeFocused();
        await page.keyboard.press('Enter');
        await expect(page.locator('main')).toBeFocused();
        await page
          .getByRole('link', { name: 'Book a Consultation', exact: true })
          .first()
          .click();
        const dialog = page.locator('.consultation-dialog');
        const phone = dialog.locator('[name=phone]');
        await phone.fill('abcdefg');
        expect(
          await phone.evaluate((e: HTMLInputElement) => e.checkValidity()),
        ).toBe(false);
        await phone.fill('+91 9000000000');
        expect(
          await phone.evaluate((e: HTMLInputElement) => e.checkValidity()),
        ).toBe(true);
        await expect(dialog).toBeVisible();
        for (let i = 0; i < 18; i++) {
          await page.keyboard.press('Tab');
          expect(
            await dialog.evaluate((e) => e.contains(document.activeElement)),
          ).toBe(true);
        }
        await page.keyboard.press('Escape');
        await expect(dialog).not.toBeVisible();
      },
    );
}
