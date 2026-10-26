import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

/** Dedicated ignored profiles avoid Windows temp-directory removal stalls.
 * Test pages still use isolated incognito contexts; no personal profile is opened.
 */
export async function launchEvidenceBrowser(task, args = []) {
  if (!/^[a-z-]+$/.test(task)) throw new Error('Invalid evidence task name');
  const profile = path.resolve('output/browser-profiles', task);
  const artifacts = path.resolve('output/browser-artifacts', task);
  await Promise.all([
    mkdir(profile, { recursive: true }),
    mkdir(artifacts, { recursive: true }),
  ]);
  const owner = await chromium.launchPersistentContext(profile, {
    channel: 'chrome',
    args,
    headless: true,
    artifactsDir: artifacts,
  });
  return { browser: owner.browser(), close: () => owner.close() };
}
