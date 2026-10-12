// Serves the built site (dist/) for the tests and Lighthouse.
//
//   node scripts/serve.mjs [port]     (default 4322)
//
// A tiny foreground server, so test runners can start and stop it reliably: Astro 7 moves
// `astro preview` into the background when it detects an AI agent or CI environment.
// Text files are gzipped like a real host would, so speed checks stay realistic.

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const port = Number(process.argv[2] ?? 4322);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};
const COMPRESSIBLE = new Set(['.html', '.js', '.css', '.json', '.svg']);

createServer(async (req, res) => {
  try {
    const { pathname } = new URL(req.url, 'http://localhost');
    let path = normalize(join(root, decodeURIComponent(pathname)));
    if (!path.startsWith(root)) throw new Error('Outside dist/');
    if ((await stat(path).catch(() => null))?.isDirectory()) path = join(path, 'index.html');

    let body = await readFile(path);
    const headers = { 'content-type': TYPES[extname(path)] ?? 'application/octet-stream' };
    if (COMPRESSIBLE.has(extname(path)) && /\bgzip\b/.test(req.headers['accept-encoding'] ?? '')) {
      body = gzipSync(body);
      headers['content-encoding'] = 'gzip';
    }
    // Astro fingerprints everything in /_astro/, so it can be cached for good
    headers['cache-control'] = pathname.startsWith('/_astro/') ? 'public, max-age=31536000, immutable' : 'no-cache';
    res.writeHead(200, headers).end(body);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain' }).end('Not found');
  }
}).listen(port, '127.0.0.1', () => console.log(`Serving dist/ at http://127.0.0.1:${port}`));
