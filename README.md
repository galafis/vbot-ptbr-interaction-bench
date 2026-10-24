# Português Interaction Bench · Bancada de Interação

[English](#english) · [Português](#português)

[![Checks](https://github.com/galafis/vbot-ptbr-interaction-bench/actions/workflows/checks.yml/badge.svg)](https://github.com/galafis/vbot-ptbr-interaction-bench/actions/workflows/checks.yml)

## English

A small explicit Portuguese phrase interpreter, human-confirmation policy and reproducible benchmark for a future Vbot interaction study.

**Status: working offline software prototype, synthetic examples, no physical validation.** Built specifically to investigate Vbot companion use within the capabilities the manufacturer permits. A standard unit without an open SDK is welcome.

### Try it

Node.js 22 or later. No packages, robot, account or API key required. After cloning, computation runs offline.

```sh
git clone https://github.com/galafis/vbot-ptbr-interaction-bench.git
cd vbot-ptbr-interaction-bench
npm test
npm run demo
npm run serve
```

Open `http://127.0.0.1:8765` for the English/Portuguese workbench. Edit the synthetic scenario, run the same engine used by the CLI and export the result. The server binds only to your own computer. Ctrl+C stops it. Use one workbench at a time on port 8765.

```sh
node cli.mjs examples/baseline.json new-result.json
```

Existing output files are refused. Exit 1 means invalid input or an I/O failure; exit 0 means analysis completed, including review findings. Do not infer suitability from the exit code.

### Implemented method

Normalize accents and punctuation; match entire phrases from a declared dictionary. Unknown, negated and compound phrases abstain. Stop requests require the operator to use the manufacturer's stop mechanism; parsing is never an emergency stop.

### Worked example

Baseline: six curated cases, six expected classifications and two abstentions. This is a correctness fixture, not evidence of generalization. The held-out test 'vem comigo' deliberately abstains, showing the dictionary's coverage limit.

### Vbot relationship and limits

Text-only rule baseline, not speech recognition or Vbot language support. Responses are suggestions for an operator; nothing is sent to the robot.

We can use native features, the official app and manually recorded observations. SDK access is optional; no bypass, reverse engineering or unsupported modification is planned. [Permitted workflow](docs/VBOT_WORKFLOW.md).

```mermaid
flowchart LR
  A[Native feature / Recurso nativo] --> B[Operator observation / Observação]
  B --> C[Validated scenario / Cenário validado]
  C --> D[Offline analysis / Análise offline]
  D --> E[Human review / Revisão humana]
```

## Português

Um interpretador explícito de frases em português, política de confirmação humana e avaliação reproduzível para um futuro estudo de interação com Vbot.

**Estado: protótipo funcional de software offline, exemplos fictícios, sem validação física.** Focado no estudo do Vbot conforme as capacidades permitidas pelo fabricante. Uma unidade comum sem SDK aberto é suficiente para iniciar.

### Experimentar

Execute os comandos acima com Node.js 22 ou superior. Não é necessário instalar dependências. Abra a bancada local e selecione Português. Edite o cenário, recalcule e exporte o resultado. Os testes e a linha de comando usam o mesmo motor da interface.

Baseline de regras textuais; não é reconhecimento de fala nem demonstra suporte nativo a português no Vbot. Nenhum comando é enviado ao robô.

Podemos trabalhar com funções nativas, aplicativo oficial e observações manuais. Acesso por SDK é opcional. Veja o [fluxo permitido](docs/VBOT_WORKFLOW.md) e a [validação](docs/VALIDATION.md). Os resultados demonstram comportamento do software; benefícios sociais e desempenho físico ainda precisam ser estudados.

## Documentation · Documentação

- [Input contract and method · Contrato e método](docs/METHOD.md)
- [Validation and reproducibility · Validação](docs/VALIDATION.md)
- [Vbot workflow · Fluxo Vbot](docs/VBOT_WORKFLOW.md)
- [Study plan · Plano de estudo](docs/STUDY_PLAN.md)
- [Synthetic input · Entrada fictícia](examples/baseline.json)
- [Expected output · Saída esperada](examples/expected.json)

Independent work by [Gabriel Demetrios Lafis](https://www.linkedin.com/in/gabriel-demetrios-lafis/) · [Existing robotics portfolio](https://github.com/galafis#robotics). Vbot is a third-party product/brand; this repository is not an official SDK or vendor endorsement.
