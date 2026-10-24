# Method and contract · Método e contrato

## Input / Entrada

Every scenario is a JSON object with `version: 1`. Numeric strings, non-finite numbers and truthy substitutes for booleans are refused. The engine does not modify input. Extra fields are ignored; use synthetic data in public examples.

cases: 1..1000 objects; unique nonempty id; nonempty text up to 200 characters; expected in stop/follow/photo/status/unknown. All matching uses complete normalized phrases, with optional BoBo/Vbot prefix.

## Algorithm / Algoritmo

Normalize accents and punctuation; match entire phrases from a declared dictionary. Unknown, negated and compound phrases abstain. Stop requests require the operator to use the manufacturer's stop mechanism; parsing is never an emergency stop.

## Independent calculation / Cálculo independente

Baseline: six curated cases, six expected classifications and two abstentions. This is a correctness fixture, not evidence of generalization. The held-out test 'vem comigo' deliberately abstains, showing the dictionary's coverage limit.

## Interpretation / Interpretação

Text-only rule baseline, not speech recognition or Vbot language support. Responses are suggestions for an operator; nothing is sent to the robot.

PT: A entrada usa JSON na versão 1. As unidades estão nos nomes dos campos. Erros de contrato interrompem a análise. Campos adicionais não viram evidência. A implementação e os exemplos não demonstram desempenho do robô nem benefício social já validado.

## Derived benchmark metrics in v0.2

The confusion matrix uses expected intents as rows and predicted intents as columns. For each intent, support is its row total, predicted count its column total and true positives its diagonal entry.

- Precision = TP / predicted_count; null when there are no predictions.
- Recall = TP / support; null when there is no expected support.
- F1 = 2 \* TP / (support + predicted_count); null when both counts are zero.
- Macro F1 averages F1 only across labels with support or predictions, including unknown where present.
- Non-abstention fraction = (case_count - unknown_predictions) / case_count.

The label unknown is an expected class for negated, unsupported or compound requests in selected fixtures. Correct unknown predictions can increase accuracy; read abstention and known-intent errors alongside it. The held-out fixture deliberately demonstrates poor dictionary coverage. These are authored tests, not a sampled population or a speech benchmark.

The exact dictionary is fixed in src/engine.mjs. The sandbox uses the same interpret function. It never sends commands. A stop interpretation instructs the operator to use the real native stop mechanism; it is not an emergency-stop implementation.

PT: Leia a matriz e as abstenções junto da acurácia. A classe unknown pode estar correta; isso não demonstra cobertura ampla da linguagem. Métricas sem denominador ficam nulas. O exemplo difícil existe para expor limitações.
