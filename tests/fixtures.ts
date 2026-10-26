import { test as base, expect, type Browser } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
/** Keep test profiles/artifacts in ignored workspace directories. Windows can
 * stall deleting Playwright's default temp profile after assertions pass. */
export const test = base.extend<{}, { browser: Browser }>({
  browser: [
    async ({ playwright, headless, launchOptions }, use, worker) => {
      const channel = process.env.BROWSER_CHANNEL || 'chrome';
      const profile = path.resolve(
        'output/test-profiles',
        channel + '-' + worker.workerIndex,
      );
      const artifactsDir = path.resolve(
        'output/test-artifacts',
        channel + '-' + worker.workerIndex,
      );
      await Promise.all([
        mkdir(profile, { recursive: true }),
        mkdir(artifactsDir, { recursive: true }),
      ]);
      const owner = await playwright.chromium.launchPersistentContext(profile, {
        ...launchOptions,
        channel,
        headless,
        artifactsDir,
      });
      try {
        await use(owner.browser()!);
      } finally {
        await owner.close();
      }
    },
    { scope: 'worker' },
  ],
});
export { expect };
