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
