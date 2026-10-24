import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createApp } from '../server.mjs';
test('local server serves scenario catalog, styles, insights and docs with MIME types', async () => {
  const server = createApp();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const base = 'http://127.0.0.1:' + server.address().port;
  try {
    for (const [path, mime] of [
      ['/', 'text/html'],
      ['/styles.css', 'text/css'],
      ['/src/insights.mjs', 'text/javascript'],
      ['/examples/catalog.json', 'application/json'],
      ['/docs/DEMO.md', 'text/plain'],
    ]) {
      const r = await fetch(base + path);
      assert.equal(r.status, 200, path);
      assert(r.headers.get('Content-Type').startsWith(mime), path);
    }
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
});
test('local server refuses writes and files outside its explicit public set', async () => {
  const server = createApp();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const base = 'http://127.0.0.1:' + server.address().port;
  try {
    assert.equal(
      (await fetch(base + '/project.json', { method: 'POST', body: 'data' })).status,
      405,
    );
    for (const path of ['/package.json', '/.git/config', '/%2e%2e%2fLICENSE', '/missing.json'])
      assert.equal((await fetch(base + path)).status, 404, path);
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
});
