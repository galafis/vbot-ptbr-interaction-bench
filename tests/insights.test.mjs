import test from 'node:test';
import assert from 'node:assert/strict';
import { study } from '../src/insights.mjs';
test('precision, recall and F1 use independent denominators', () => {
  const s = {
    version: 1,
    cases: [
      { id: '1', text: 'me siga', expected: 'follow' },
      { id: '2', text: 'vem comigo', expected: 'follow' },
      { id: '3', text: 'não me siga', expected: 'unknown' },
    ],
  };
  const r = study(s),
    f = r.per_intent.find((x) => x.intent === 'follow');
  assert.equal(f.precision, 1);
  assert.equal(f.recall, 0.5);
  assert.equal(f.f1, 0.6667);
  assert.equal(r.macro_f1, 0.6667);
  assert.equal(r.non_abstention_fraction, 0.3333);
});
test('unsupported labels do not inflate macro F1', () => {
  const r = study({ version: 1, cases: [{ id: '1', text: 'pare', expected: 'stop' }] });
  assert.equal(r.macro_f1, 1);
  assert.equal(r.per_intent.find((x) => x.intent === 'photo').f1, null);
});
test('confusion matrix accounts for every case', () => {
  const r = study({ version: 1, cases: [{ id: '1', text: 'vem comigo', expected: 'follow' }] });
  assert.equal(
    r.matrix.flat().reduce((a, b) => a + b, 0),
    1,
  );
  assert.equal(r.errors[0].predicted, 'unknown');
});
