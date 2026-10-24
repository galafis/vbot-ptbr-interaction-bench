import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { analyze } from '../src/engine.mjs';
import { study } from '../src/insights.mjs';
const base = new URL('../examples/', import.meta.url);
const catalog = JSON.parse(readFileSync(new URL('catalog.json', base)));
for (const example of catalog)
  test('documented scenario ' + example.id + ' remains reproducible', () => {
    const input = JSON.parse(readFileSync(new URL(example.file, base)));
    const expected = JSON.parse(readFileSync(new URL(example.expected, base)));
    assert.deepEqual(analyze(input), expected);
    const insights = study(input);
    assert.deepEqual(insights.analysis, expected);
  });
test('catalog has unique examples, bilingual context and valid versioned input', () => {
  assert.equal(catalog.length, 5);
  assert.equal(new Set(catalog.map((c) => c.id)).size, 5);
  for (const e of catalog) {
    assert(e.title.pt && e.title.en && e.context.pt && e.context.en);
    assert.equal(JSON.parse(readFileSync(new URL(e.file, base))).version, 1);
  }
});
