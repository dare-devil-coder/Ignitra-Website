import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { gzipSync } from 'node:zlib';
const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.glb': 'model/gltf-binary',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.webmanifest': 'application/manifest+json',
  '.txt': 'text/plain',
};
export function serve(port = 4173) {
  const root = path.resolve('out');
  const server = createServer(async (req, res) => {
    try {
      let pathname = decodeURIComponent(
        new URL(req.url, 'http://localhost').pathname,
      );
      let file = path.resolve(root, '.' + pathname);
      if (file !== root && !file.startsWith(root + path.sep)) {
        res.writeHead(403).end();
        return;
      }
      if ((await stat(file).catch(() => null))?.isDirectory())
        file = path.join(file, 'index.html');
      const bytes = await readFile(file);
      const compress =
        /\bgzip\b/.test(' ' + (req.headers['accept-encoding'] || '')) &&
        /\.(html|css|js|json|svg|xml|txt)$/.test(file);
      const body = compress ? gzipSync(bytes) : bytes;
      res.writeHead(200, {
        ...(compress ? { 'Content-Encoding': 'gzip' } : {}),
        Vary: 'Accept-Encoding',
        'Content-Length': body.length,
        'Content-Type': types[path.extname(file)] || 'application/octet-stream',
        'Cache-Control': 'no-store',
      });
      res.end(body);
    } catch {
      res.writeHead(404).end();
    }
  });
  return new Promise((resolve, reject) => {
    server.on('error', reject);
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  await serve();
  console.log('Static preview: http://127.0.0.1:4173');
}
