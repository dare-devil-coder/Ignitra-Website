import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/lr-desktop-config.js';
import { launchEvidenceBrowser } from './evidence-browser.mjs';
import { serve } from './preview.mjs';

const runs = Number(process.env.LIGHTHOUSE_RUNS || 3);
if (!Number.isInteger(runs) || runs < 1 || runs > 5)
  throw new Error('LIGHTHOUSE_RUNS must be 1 through 5');
const output = path.resolve(process.env.LIGHTHOUSE_OUTPUT || 'docs/lighthouse');
await mkdir(output, { recursive: true });
const server = await serve(4474);
const results = [];
const formFactors = process.argv.includes('--mobile')
  ? ['mobile']
  : ['mobile', 'desktop'];
try {
  for (const formFactor of formFactors)
    for (const theme of ['dark', 'light'])
      for (let run = 1; run <= runs; run++) {
        const { browser, close } = await launchEvidenceBrowser(
          'lighthouse-' +
            formFactor +
            '-' +
            theme +
            '-' +
            String.fromCharCode(96 + run),
          ['--remote-debugging-port=4481'],
        );
        try {
          const page = await browser.newPage();
          await page.goto('http://127.0.0.1:4474');
          await page.evaluate(
            (theme) => localStorage.setItem('ignitra-theme', theme),
            theme,
          );
          await page.goto('about:blank');
          const session = await page.context().newCDPSession(page);
          await session.send('Network.clearBrowserCache');
          const flags = {
            port: 4481,
            logLevel: 'error',
            output: ['json', 'html'],
            disableStorageReset: true,
            onlyCategories: [
              'performance',
              'accessibility',
              'best-practices',
              'seo',
            ],
          };

          const result = await lighthouse(
            'http://127.0.0.1:4474',
            flags,
            formFactor === 'desktop' ? desktopConfig : undefined,
          );
          if (!result || result.lhr.runtimeError)
            throw new Error(JSON.stringify(result?.lhr.runtimeError));
          const stem = `${formFactor}-${theme}-${run}`;
          await writeFile(path.join(output, stem + '.json'), result.report[0]);
          await writeFile(path.join(output, stem + '.html'), result.report[1]);
          const lhr = result.lhr;
          const record = {
            formFactor,
            theme,
            run,
            lighthouseVersion: lhr.lighthouseVersion,
            userAgent: lhr.userAgent,
            fetchTime: lhr.fetchTime,
            scores: Object.fromEntries(
              Object.entries(lhr.categories).map(([k, v]) => [
                k,
                Math.round(v.score * 100),
              ]),
            ),
            lcp: lhr.audits['largest-contentful-paint'].numericValue,
            cls: lhr.audits['cumulative-layout-shift'].numericValue,
            tbt: lhr.audits['total-blocking-time'].numericValue,
            warnings: lhr.runWarnings,
          };
          results.push(record);
          console.log(JSON.stringify(record));
          await page.close();
        } finally {
          await close();
        }
      }
  const median = (values) =>
    [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
  const summaries = [];
  for (const formFactor of formFactors)
    for (const theme of ['dark', 'light']) {
      const group = results.filter(
        (r) => r.formFactor === formFactor && r.theme === theme,
      );
      summaries.push({
        formFactor,
        theme,
        runs: group.length,
        performance: median(group.map((r) => r.scores.performance)),
        accessibility: median(group.map((r) => r.scores.accessibility)),
        bestPractices: median(group.map((r) => r.scores['best-practices'])),
        seo: median(group.map((r) => r.scores.seo)),
        lcp: median(group.map((r) => r.lcp)),
        cls: median(group.map((r) => r.cls)),
        tbt: median(group.map((r) => r.tbt)),
      });
    }
  await writeFile(
    path.join(output, 'summary.json'),
    JSON.stringify(
      {
        method:
          'Fresh Chrome process per sample, cold HTTP cache, persisted theme only, Lighthouse default simulated mobile or desktop throttling; localhost static export. Synthetic lab evidence, not field data.',
        results,
        summaries,
      },
      null,
      2,
    ),
  );
  if (
    summaries.some((s) => s.performance < 85 || s.lcp >= 2500 || s.cls >= 0.1)
  )
    process.exitCode = 1;
} finally {
  await new Promise((resolve) => server.close(resolve));
}
