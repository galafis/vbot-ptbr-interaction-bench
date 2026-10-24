# Guided walkthrough · Guia de exploração

## English

### Start with a concrete question

Which phrases does an explicit dictionary understand, and where does it abstain?

1. Open [the featured example](https://galafis.github.io/vbot-ptbr-interaction-bench/?lang=en&example=everyday-requests).
2. Read the short scenario description and the four result cards.
3. The expected starting result is **12/16 correct · 4 abstentions**.
4. Read the graphic together with the explanation. Unknown, rejected or unconfirmed values are useful evidence rather than something to hide.
5. Use the guided controls. Restore the example to recover the original assumptions.
6. Switch to another story in the five-card example selector. Compare the table in [EXPERIMENTS](EXPERIMENTS.md).
7. Download an HTML report for a self-contained, printable copy; download CSV for the visible evidence table; download JSON for the complete calculated study. These files stay on your computer until you choose to share them.

### Go deeper

1. A deliberately small, inspectable Portuguese phrase dictionary and full-string matching.
2. A live text sandbox that explains the operator's next step without issuing commands.
3. A confusion matrix, per-intent precision/recall/F1 and supported-class macro F1.
4. Known phrases, normalization, negation/compound cases and a difficult held-out fixture.
5. Visible abstentions and errors, including examples where the dictionary performs poorly.

For full scenario changes, open **Advanced: edit the scenario**. Applying invalid JSON or invalid domain data reports an error instead of accepting the changes. Local guided changes recompute through the same domain implementation used by the command line.

### Accessibility and small screens

All primary controls have labels, buttons work by keyboard and the layout adapts to a narrow screen. Charts have accessible titles and adjacent explanations/tables. Colors support text labels rather than replacing them. These implementation choices do not establish conformance certification or a completed screen-reader audit.

## Português

Abra [o exemplo em português](https://galafis.github.io/vbot-ptbr-interaction-bench/?lang=pt&example=everyday-requests), leia a descrição e os quatro indicadores. O resultado inicial é **12/16 acertos · 4 abstenções**.

Examine o gráfico e a explicação, ajuste um controle e use **Restaurar este exemplo** para recuperar a hipótese inicial. Selecione outro cenário para comparar. Os botões baixam relatório HTML imprimível, tabela CSV ou análise JSON. O modo avançado fica recolhido para que o estudo possa ser explorado sem editar código.

As alterações são cálculos de software e não ações sobre o robô. A execução com hardware usará apenas funções e práticas permitidas pelo fabricante.
