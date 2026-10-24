# Validation record · Registro de validação

## Automated checks

- Node.js 22 and 24 in GitHub Actions; inspect the actual run for remote status.
- 19 tests: domain rules, derived insights, five golden examples, bilingual catalog, CLI behavior and local HTTP server behavior.
- `npm run check` also checks browser-script syntax and reproduces every catalog output.
- The core version 1 baseline output remains compatible with the first release.

## Independent evidence

Existing hand-derived arithmetic and failure cases remain in tests/engine.test.mjs. New insight cases verify denominators, state/permission behavior, corroboration or sensitivity invariants as appropriate to the domain. Expected-output files are regression fixtures rather than independent correctness proofs.

## Browser review

The release is reviewed for scenario switching, guided controls, language switching, malformed advanced input, report exports and a narrow layout. The repository screenshot is captured from the actual local workbench, not a product mockup. UI review is separate from Node tests.

## Boundaries

No physical robot test has been performed. No clinical, mobility-guidance, emergency-response or accessibility certification is claimed. A standard Vbot without an open SDK is welcome for future native-feature observations. University or participant involvement requires the appropriate authorization.

## Português

A validação automatizada reúne 19 testes, cinco exemplos e verificação da sintaxe da interface. Casos de domínio independentes complementam as saídas esperadas de regressão. A interface é revisada separadamente. Ainda não houve teste físico com Vbot nem validação dos benefícios sociais propostos.
