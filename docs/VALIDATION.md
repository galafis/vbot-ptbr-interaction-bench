# Validation · Validação

Run `npm test` and `npm run demo` with Node.js 22+. Tests include a hand-derived expected result, invalid inputs and domain failure cases. `tests/engine.test.mjs` defines each assertion. CI runs the same checks on Node 22 and 24; inspect the actual Actions run before claiming remote success.

`examples/expected.json` is the reproducible output for `examples/baseline.json`; it is also checked against the engine. There is no stochastic model or external service.

Physical tests performed: **none**. Hardware, native language support, sensor accuracy, stopping response, cloud behavior and social outcomes have not been validated. No Vbot unit was available when this software was created.

PT: Execute os comandos para reproduzir os resultados. Os testes verificam cálculos, falhas e limites de entrada. A integração contínua está configurada para duas versões do Node; o resultado remoto deve ser consultado em Actions. Não houve teste físico. A evidência é de software com dados fictícios.
