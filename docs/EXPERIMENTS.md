# Reproducible experiments · Experimentos reproduzíveis

All examples are synthetic, deterministic and versioned. The visible interface, command-line engine and expected files share the same input. Each example asks a different question; some intentionally show limited evidence or poor language coverage.

### First six requests / Primeiros seis pedidos

A small deterministic fixture with known and negated requests.

Uma pequena verificação determinística com pedidos conhecidos e negados.

- Input: [examples/baseline.json](../examples/baseline.json)
- Expected core output: [examples/expected.json](../examples/expected.json)
- Reproduced result: **6/6 correct · 2 abstentions**

```sh
node cli.mjs examples/baseline.json
node study.mjs examples/baseline.json
```

### Everyday requests / Pedidos do cotidiano

Declared dictionary variants and phrases it does not cover.

Variações previstas no dicionário e frases que ele ainda não cobre.

- Input: [examples/everyday-requests.json](../examples/everyday-requests.json)
- Expected core output: [examples/everyday-requests.expected.json](../examples/everyday-requests.expected.json)
- Reproduced result: **12/16 correct · 4 abstentions**

```sh
node cli.mjs examples/everyday-requests.json
node study.mjs examples/everyday-requests.json
```

### Negation and compound requests / Negação e pedidos compostos

Unrecognized requests should ask for clarification.

Pedidos não reconhecidos devem pedir esclarecimento.

- Input: [examples/negation-and-compounds.json](../examples/negation-and-compounds.json)
- Expected core output: [examples/negation-and-compounds.expected.json](../examples/negation-and-compounds.expected.json)
- Reproduced result: **9/10 correct · 8 abstentions**

```sh
node cli.mjs examples/negation-and-compounds.json
node study.mjs examples/negation-and-compounds.json
```

### Accents and punctuation / Acentos e pontuação

Test normalization with explicit expected labels.

Teste a normalização mantendo os rótulos esperados explícitos.

- Input: [examples/normalization.json](../examples/normalization.json)
- Expected core output: [examples/normalization.expected.json](../examples/normalization.expected.json)
- Reproduced result: **9/10 correct · 2 abstentions**

```sh
node cli.mjs examples/normalization.json
node study.mjs examples/normalization.json
```

### Beyond the dictionary / Fora do dicionário

A deliberately difficult fixture separates example correctness from generalization.

Uma avaliação deliberadamente difícil evita confundir acerto no exemplo com generalização.

- Input: [examples/held-out-phrases.json](../examples/held-out-phrases.json)
- Expected core output: [examples/held-out-phrases.expected.json](../examples/held-out-phrases.expected.json)
- Reproduced result: **2/10 correct · 10 abstentions**

```sh
node cli.mjs examples/held-out-phrases.json
node study.mjs examples/held-out-phrases.json
```

## What the checks establish

`npm run check` runs 19 tests and checks all five expected-output files. Domain/insight tests include independently derived cases and invariants. Golden expected files detect regressions; they are generated reference outputs, not independent scientific validation. Browser presentation is reviewed separately.

## What remains open

No physical Vbot trial was performed. Native feature behavior, battery/load response, participant experience and public benefit remain to be evaluated on a specific device under an authorized plan. Documentation and reproducibility make those future questions reviewable; they do not answer them.

## Português

Os cinco cenários são fictícios e reproduzíveis. Cada um explicita uma pergunta e o arquivo de resultado esperado. Os testes incluem casos com cálculos independentes e invariantes; as saídas de referência detectam regressões. Resultados em software não substituem medições físicas ou avaliação de benefício social.
