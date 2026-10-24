# Data contract / Contrato de dados

All examples use a versioned JSON object with **version: 1**. Units appear in field names. Strict finite-number, boolean, shape, count and identifier checks live in src/contract.mjs and src/engine.mjs. Invalid input rejects the analysis rather than silently coercing values. Numeric strings are not numbers.

The annotated field descriptions and algorithm-specific limits are in [METHOD.md](METHOD.md). The example catalog lists every versioned input and golden output. Golden files are regression fixtures; independent arithmetic and failure-case tests provide additional checks.

## Interfaces

| Entry                               | Input                                      | Output                                        |
| ----------------------------------- | ------------------------------------------ | --------------------------------------------- |
| analyze(scenario) in src/engine.mjs | Version 1 scenario                         | Core domain result                            |
| study(scenario) in src/insights.mjs | Same scenario                              | Core result plus comparisons/derived insights |
| node cli.mjs INPUT [NEW_OUTPUT]     | JSON file                                  | Core JSON result                              |
| node study.mjs INPUT                | JSON file                                  | Full study JSON                               |
| Browser quick controls              | Selected numeric values or workflow events | Same study calculation in-browser             |

The engine and insight layer never contact a robot. They do not mutate the input. Extra fields are ignored unless the domain explicitly reads them. Public encounter and observation exports deliberately whitelist output fields.

## Public and private inputs

Examples contain synthetic labels only. Anonymize zones before sharing. Do not add names, addresses, faces, health records or precise locations to public fixtures. Browser downloads are local files; review them before sharing. A language benchmark report contains the phrases being evaluated.

## Português

Os exemplos usam JSON na versão 1 e unidades explícitas. Entradas inválidas são recusadas. A função analyze produz o resultado principal; study acrescenta métricas e comparações. Nenhuma das funções envia dados a um robô ou serviço externo. Os arquivos de saída esperada ajudam a detectar regressões, mas não substituem cálculos independentes. Exemplos públicos usam apenas dados fictícios.
