import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { load } from 'cheerio';
// Next 16.4's exported font manifest is empty in this checkout. Recover only
// missing resource hints from its emitted CSS, preserving next/font and copy.
const cssFiles = (await readdir('out/_next/static/css')).filter((f) =>
  f.endsWith('.css'),
);
const fonts = new Set();
for (const file of cssFiles) {
  const css = await readFile(path.join('out/_next/static/css', file), 'utf8');
  for (const match of css.matchAll(/url\(([^)]+\.woff2)\)/g)) {
    const url = match[1].replaceAll(/["']/g, '');
    fonts.add(new URL(url, 'http://export/_next/static/css/').pathname);
  }
}
const htmlPath = 'out/index.html';
let html = await readFile(htmlPath, 'utf8');
const $ = load(html);
const existing = new Set(
  $('link[rel=preload][as=font]')
    .map((_, node) => $(node).attr('href'))
    .get(),
);
const hints = [...fonts]
  .filter((url) => !existing.has(url))
  .map(
    (url) =>
      `<link rel="preload" href="${url}" as="font" type="font/woff2" crossorigin="anonymous"/>`,
  )
  .join('');
if (hints) {
  html = html.replace('<head>', '<head>' + hints);
  await writeFile(htmlPath, html);
}
console.log(
  `Verified ${fonts.size} self-hosted font preloads in static export.`,
);
