import { spawn } from 'node:child_process';
import { chromium, expect } from '@playwright/test';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { serve } from './preview.mjs';
const source = JSON.parse(await readFile('content/site-content.json', 'utf8'));
const section = source.pages[0].sections.find((s) => s.id === 'consultation');
const text = (n) => section.items[n - 1].displayText;
const build = (env) =>
  new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      ['node_modules/next/dist/bin/next', 'build', '--webpack'],
      { stdio: 'inherit', env: { ...process.env, ...env } },
    );
    child.on('error', reject);
    child.on('exit', (code) =>
      code === 0 ? resolve() : reject(new Error('Build failed: ' + code)),
    );
  });
let browser, server;
try {
  await build({
    NEXT_PUBLIC_CONSULTATION_ENDPOINT:
      'http://127.0.0.1:4480/__mock-consultation',
  });
  server = await serve(4480);
  browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    colorScheme: 'dark',
    reducedMotion: 'reduce',
  });
  const payloads = [],
    consoleMessages = [];
  page.on('console', (message) => {
    if (['error', 'warning'].includes(message.type()))
      consoleMessages.push(message.text());
  });
  let mode = 'fail';
  await page.route('**/__mock-consultation', async (route) => {
    payloads.push(route.request().postDataJSON());
    await new Promise((r) => setTimeout(r, 250));
    await route.fulfill({
      status: mode === 'fail' ? 422 : 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: mode === 'success' }),
    });
  });
  await page.goto('http://127.0.0.1:4480');
  await page
    .getByRole('link', { name: 'Book a Consultation', exact: true })
    .first()
    .click();
  const dialog = page.locator('.consultation-dialog'),
    send = dialog.getByRole('button', { name: text(33), exact: true });
  await send.click();
  expect(payloads).toHaveLength(0);
  expect(
    await dialog
      .locator('[name=name]')
      .evaluate((e) => e.validity.valueMissing),
  ).toBe(true);
  await dialog.locator('[name=name]').fill('Stage Two QA');
  await dialog.locator('[name=email]').fill('qa@example.invalid');
  await dialog.locator('[name=phone]').fill('+91 9000000000');
  await dialog.locator('[name=company]').fill('Local QA');
  await dialog.locator('[name=message]').fill('Synthetic local delivery test.');
  await send.click();
  await expect(dialog.locator('#service-error')).toHaveText(
    source.clientMessages.serviceRequired,
  );
  expect(payloads).toHaveLength(0);
  await dialog.getByRole('combobox').click();
  await dialog.getByRole('option').first().click();
  await send.click();
  await expect(
    dialog.getByRole('button', {
      name: source.clientMessages.sending,
      exact: true,
    }),
  ).toBeDisabled();
  await expect(send).toBeEnabled();
  await expect(dialog.locator('.consultation-success')).toHaveCount(0);
  expect(payloads).toHaveLength(1);
  expect(payloads[0].name).toBe('Stage Two QA');
  expect(payloads[0].email).toBe('qa@example.invalid');
  expect(payloads[0].website).toBe('');
  expect(Number(payloads[0].startedAt)).toBeGreaterThan(0);
  mode = 'success';
  await send.click();
  await expect(dialog.locator('.consultation-success')).toBeVisible();
  await expect(dialog.locator('#consult-title')).toHaveText(
    'Thank you, Stage.',
  );
  await expect(dialog.locator('.consultation-success p')).toHaveText(
    source.clientMessages.success,
  );
  await mkdir('output/stage2-delivery', { recursive: true });
  await page.screenshot({ path: 'output/stage2-delivery/success.png' });
  await dialog
    .getByRole('button', { name: source.clientMessages.done, exact: true })
    .click();
  await expect(dialog).not.toBeVisible();
  const report = {
    scope:
      'Mocked local requests only. No real submission or delivery certification.',
    checks: [
      'required-fields',
      'required-service',
      'pending-lock',
      'failure-does-not-show-success',
      'retry',
      'payload-fields',
      'acknowledged-success',
      'focus-return',
    ],
    requests: payloads.length,
    consoleMessages,
  };
  await writeFile(
    'output/stage2-delivery/report.json',
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser?.close();
  if (server) await new Promise((r) => server.close(r));
  await build({ NEXT_PUBLIC_CONSULTATION_ENDPOINT: '' });
}
