import { createServer } from 'node:http';
import { readFile, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
const catalog = JSON.parse(
  readFileSync(new URL('./examples/catalog.json', import.meta.url), 'utf8'),
);
const paths = new Set([
  'index.html',
  'styles.css',
  'app.mjs',
  'project.json',
  'README.md',
  'LICENSE',
  'assets/mark.svg',
  'assets/workbench.png',
  'examples/catalog.json',
  'examples/sample-report.html',
  'src/engine.mjs',
  'src/contract.mjs',
  'src/insights.mjs',
  'docs/METHOD.md',
  'docs/VALIDATION.md',
  'docs/VBOT_WORKFLOW.md',
  'docs/STUDY_PLAN.md',
  'docs/DEMO.md',
  'docs/EXPERIMENTS.md',
  'docs/ARCHITECTURE.md',
  'docs/DATA_CONTRACT.md',
]);
for (const example of catalog)
  for (const field of ['file', 'expected']) paths.add('examples/' + example[field]);
const types = {
  html: 'text/html; charset=utf-8',
  css: 'text/css; charset=utf-8',
  mjs: 'text/javascript; charset=utf-8',
  json: 'application/json; charset=utf-8',
  md: 'text/plain; charset=utf-8',
  svg: 'image/svg+xml',
  png: 'image/png',
};
export function createApp() {
  return createServer((req, res) => {
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.writeHead(405, { Allow: 'GET, HEAD' });
      res.end('Method not allowed');
      return;
    }
    let path;
    try {
      path =
        decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname).slice(1) || 'index.html';
    } catch {
      res.writeHead(400);
      res.end('Invalid path');
      return;
    }
    if (!paths.has(path)) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    readFile(new URL(path, import.meta.url), (error, data) => {
      if (error) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      res.writeHead(200, {
        'Content-Type': types[path.split('.').pop()] || 'text/plain; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'no-cache',
      });
      res.end(req.method === 'HEAD' ? undefined : data);
    });
  });
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.argv[2] ?? 8765);
  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    console.error('Invalid port');
    process.exitCode = 1;
  } else {
    const app = createApp();
    app.on('error', (error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
    app.listen(port, '127.0.0.1', () =>
      console.log('Open http://127.0.0.1:' + app.address().port + '; Ctrl+C to stop'),
    );
  }
}
