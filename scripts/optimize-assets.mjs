import sharp from 'sharp';
import { writeFile, stat } from 'node:fs/promises';
const files = [
  'ignitra-logo-primary-silver',
  'ignitra-logo-flat-on-light',
  'ignitra-spark',
];
const mapping = {},
  report = [];
for (const name of files) {
  const input = `public/assets/${name}.png`,
    output = `public/assets/${name}.webp`;
  await sharp(input).webp({ lossless: true, effort: 6 }).toFile(output);
  mapping[`/assets/${name}.png`] = `/assets/${name}.webp`;
  report.push({
    input,
    output,
    before: (await stat(input)).size,
    after: (await stat(output)).size,
    mode: 'Lossless WebP, original dimensions and alpha',
  });
}
await writeFile(
  'src/lib/content/optimized-assets.json',
  JSON.stringify(mapping, null, 2) + '\n',
);
await writeFile(
  'docs/asset-optimization-stage4.json',
  JSON.stringify(report, null, 2),
);
console.log(report);
