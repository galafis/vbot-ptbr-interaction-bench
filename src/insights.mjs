import { analyze } from './engine.mjs';
import { round } from './contract.mjs';
export const intents = ['stop', 'follow', 'photo', 'status', 'unknown'];
export function study(s) {
  const analysis = analyze(s);
  const matrix = intents.map((expected) =>
    intents.map((predicted) => analysis.confusion[expected + ' -> ' + predicted] ?? 0),
  );
  const per_intent = intents.map((intent, i) => {
    const tp = matrix[i][i],
      support = matrix[i].reduce((a, b) => a + b, 0),
      predicted = matrix.reduce((n, row) => n + row[i], 0);
    const precision = predicted ? tp / predicted : null,
      recall = support ? tp / support : null;
    const f1 = support || predicted ? (2 * tp) / (support + predicted) : null;
    return {
      intent,
      support,
      predicted,
      precision: precision === null ? null : round(precision),
      recall: recall === null ? null : round(recall),
      f1: f1 === null ? null : round(f1),
    };
  });
  const active = per_intent.filter((x) => x.f1 !== null);
  return {
    analysis,
    matrix,
    per_intent,
    macro_f1: active.length ? round(active.reduce((n, x) => n + x.f1, 0) / active.length) : null,
    non_abstention_fraction: round((analysis.cases - analysis.abstentions) / analysis.cases),
    errors: analysis.results
      .filter((r) => !r.correct)
      .map((r) => ({ id: r.id, expected: r.expected, predicted: r.intent })),
  };
}
