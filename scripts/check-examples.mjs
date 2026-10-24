import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { analyze } from '../src/engine.mjs';
import { study } from '../src/insights.mjs';
const base = new URL('../examples/', import.meta.url);
const catalog = JSON.parse(readFileSync(new URL('catalog.json', base)));
for (const example of catalog) {
  const scenario = JSON.parse(readFileSync(new URL(example.file, base)));
  const expected = JSON.parse(readFileSync(new URL(example.expected, base)));
  assert.deepEqual(analyze(scenario), expected, example.id);
  const serialized = JSON.stringify(study(scenario));
  assert(!serialized.includes('NaN'));
  assert(!serialized.includes('Infinity'));
  console.log('PASS ' + example.id);
}
