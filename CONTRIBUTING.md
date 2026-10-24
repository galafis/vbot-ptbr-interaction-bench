# Contributing · Contribuir

## Reproduce first

Use Node.js 22 or later. Run `npm run check` and `npm run serve`. There are no npm packages to install. Read [the architecture](docs/ARCHITECTURE.md) and [the method](docs/METHOD.md) before changing calculations.

## Useful contributions

- A new synthetic scenario with a clear question, units and independently calculated expectation.
- A domain failure case or reproducible bug with minimal input.
- An improvement to keyboard use, contrast, text clarity or small-screen layout.
- A permitted native-feature observation protocol that distinguishes measurements from assumptions.

## Changes to methods

Preserve the version 1 core contract unless a versioned migration is documented. Tests should check a meaningful independent property or known calculation. Do not merely copy the implementation into a test. Update experiment notes when results change. Keep browser and CLI calculations aligned.

## Data and scope

Use fictional labels. Do not add personal data or proprietary firmware, trajectories or SDK files. Document source licenses. No device interface should be added without documented manufacturer permission. An open SDK is optional for the proposed program; a native-only workflow must remain feasible.

## Português

Antes de contribuir, reproduza os exemplos e rode `npm run check`. Use dados fictícios, documente unidades e acrescente uma verificação independente quando mudar cálculos. Melhorias de acessibilidade, novos cenários e protocolos permitidos de observação são bem-vindos. Não publique dados pessoais ou arquivos proprietários do fabricante.
