import { mkdir, writeFile, copyFile } from 'node:fs/promises';
import { serve } from './preview.mjs';
import { launchEvidenceBrowser } from './evidence-browser.mjs';
const server = await serve(4478),
  { browser, close } = await launchEvidenceBrowser('scroll-performance');
await mkdir('output/final-video', { recursive: true });
await mkdir('docs/after/frames', { recursive: true });
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: 'no-preference',
    colorScheme: 'dark',
    recordVideo: {
      dir: 'output/final-video',
      size: { width: 1440, height: 1000 },
    },
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4478');
  await page.waitForFunction(
    () => document.body.dataset.motionReady === 'true',
  );
  await page.waitForTimeout(2500);
  await page.evaluate(() => {
    window.__scrollSample = {
      frames: [],
      longTasks: [],
      start: performance.now(),
      running: true,
      hardwareConcurrency: navigator.hardwareConcurrency,
    };
    let last = performance.now();
    const sample = (now) => {
      if (!window.__scrollSample.running) return;
      window.__scrollSample.frames.push(now - last);
      last = now;
      requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
    try {
      new PerformanceObserver((list) =>
        window.__scrollSample.longTasks.push(
          ...list.getEntries().map((e) => e.duration),
        ),
      ).observe({ type: 'longtask', buffered: false });
    } catch {}
  });
  let count = 0;
  for (let i = 0; i < 90; i++) {
    await page.mouse.wheel(0, 190);
    await page.waitForTimeout(120);
    if (i % 15 === 0)
      await page.screenshot({
        path: `docs/after/frames/scroll-${String(++count).padStart(2, '0')}.png`,
      });
    if (
      await page.evaluate(
        () =>
          scrollY + innerHeight >= document.documentElement.scrollHeight - 2,
      )
    )
      break;
  }
  const report = await page.evaluate(() => {
    const s = window.__scrollSample;
    s.running = false;
    const sorted = [...s.frames].sort((a, b) => a - b),
      duration = performance.now() - s.start;
    return {
      hardwareConcurrency: s.hardwareConcurrency,
      duration,
      frames: s.frames.length,
      averageFps: (s.frames.length * 1000) / duration,
      p95FrameMs: sorted[Math.floor(sorted.length * 0.95)],
      framesOver33ms: s.frames.filter((f) => f > 33.4).length,
      longTasks: s.longTasks,
    };
  });
  await writeFile(
    'docs/after/scroll-performance.json',
    JSON.stringify(
      {
        method:
          'Headless Chrome on the current Windows host, normal motion, 1440x1000, real wheel scrolling while recording video and six screenshots; includes automation overhead. Not a device or field guarantee.',
        ...report,
      },
      null,
      2,
    ),
  );
  const video = page.video();
  await page.goto('about:blank');
  await context.close();
  await copyFile(await video.path(), 'docs/after/scroll.webm');
  console.log(report);
} finally {
  await close();
  await new Promise((r) => server.close(r));
}
