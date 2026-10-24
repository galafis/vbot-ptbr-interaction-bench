import * as engine from './src/engine.mjs';
import { study } from './src/insights.mjs';

const $ = (id) => document.getElementById(id);
const esc = (v) =>
  String(v ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
const [project, catalog] = await Promise.all(
  ['project.json', 'examples/catalog.json'].map((path) =>
    fetch(path).then((r) => {
      if (!r.ok) throw new Error('Unable to load ' + path);
      return r.json();
    }),
  ),
);
const params = new URLSearchParams(location.search);
let lang = params.get('lang') === 'en' ? 'en' : 'pt',
  scenario,
  original,
  result,
  current = catalog[0],
  loadSequence = 0;
const tr = (pt, en) => (lang === 'pt' ? pt : en);
const num = (v, d = 1) =>
  v === null || v === undefined
    ? '—'
    : new Intl.NumberFormat(lang === 'pt' ? 'pt-BR' : 'en', { maximumFractionDigits: d }).format(v);
const pct = (v) => (v === null ? '—' : num(v * 100) + '%');
const words = {
  stop: ['Parar', 'Stop'],
  follow: ['Acompanhar', 'Follow'],
  photo: ['Foto', 'Photo'],
  status: ['Bateria', 'Status'],
  unknown: ['Esclarecer', 'Clarify'],
  too_close: ['Perto demais', 'Too close'],
  too_far: ['Distante demais', 'Too far'],
  pace_exceeded: ['Ritmo excedido', 'Pace exceeded'],
  stop_mismatch: ['Parada desencontrada', 'Stop mismatch'],
  observation_gap: ['Sem observação', 'Unobserved'],
  accept: ['Aceitar convite', 'Accept invitation'],
  decline: ['Recusar convite', 'Decline invitation'],
  pause: ['Pausar', 'Pause'],
  resume: ['Retomar', 'Resume'],
  withdraw: ['Encerrar participação', 'Withdraw'],
  record_grant: ['Permitir gravação', 'Grant recording'],
  record_revoke: ['Revogar gravação', 'Revoke recording'],
  finish: ['Concluir encontro', 'Finish encounter'],
  invited: ['Convidado', 'Invited'],
  active: ['Ativo', 'Active'],
  paused: ['Pausado', 'Paused'],
  ended: ['Encerrado', 'Ended'],
  passage_obstruction: ['Passagem obstruída', 'Passage obstruction'],
  uneven_surface: ['Piso irregular', 'Uneven surface'],
  missing_sign: ['Sinalização ausente', 'Missing sign'],
  other: ['Outra barreira', 'Other barrier'],
  review_queue: ['Para revisão', 'Review queue'],
  needs_evidence: ['Falta evidência', 'Needs evidence'],
  selected: ['Selecionado', 'Selected'],
  payload_with_carrier: ['Carga excedida com suporte', 'Payload with carrier exceeded'],
  energy_priority_tradeoff: ['Fora da seleção ótima', 'Outside optimal selection'],
};
const word = (k) => (words[k] ? words[k][lang === 'pt' ? 0 : 1] : k);
const badge = (text, tone = 'neutral') =>
  '<span class="badge ' + tone + '">' + esc(text) + '</span>';
function field(label, key, value, min = 0, max = '', step = 0.1) {
  return (
    '<label class="field"><span>' +
    esc(label) +
    '</span><div><input type="number" data-field="' +
    key +
    '" value="' +
    value +
    '" min="' +
    min +
    '" ' +
    (max !== '' ? 'max="' + max + '"' : '') +
    ' step="' +
    step +
    '"></div></label>'
  );
}
function title() {
  $('results-jump').textContent = tr('Ver resultado ↓', 'See the result ↓');
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
  document.title = project.short[lang] + ' · Vbot studies';
  document.documentElement.style.setProperty('--accent', project.color);
  $('project-number').textContent = String(project.number).padStart(2, '0');
  $('tag').textContent = project.tag[lang];
  $('hero-title').textContent = project.headline[lang];
  $('hero-description').textContent = project.description[lang];
  $('project-name').textContent = project.short[lang];
  $('docs-link').href = project.source + '#readme';
  $('source-link').href = project.source;
  $('docs-link').textContent = tr('Guia do projeto', 'Project guide');
  $('source-link').textContent = 'GitHub ↗';
  $('language').value = lang;
  $('stage').textContent = tr(
    'Estudo de software · Cenários fictícios',
    'Software study · Synthetic scenarios',
  );
  $('native-note').textContent = tr(
    'Recursos nativos são suficientes para começar. SDK aberto é opcional.',
    'Native features are enough to begin. An open SDK is optional.',
  );
  $('question').textContent = project.question[lang];
  $('example-heading').textContent = tr(
    'Escolha uma história para explorar',
    'Choose a story to explore',
  );
  $('example-hint').textContent = tr(
    'Cinco exemplos. Diferentes perguntas. Resultados reproduzíveis.',
    'Five examples. Different questions. Reproducible results.',
  );
  $('reset').textContent = tr('Restaurar este exemplo', 'Restore this example');
  $('report').textContent = tr('Baixar relatório', 'Download report');
  $('export').textContent = tr('Exportar JSON', 'Export JSON');
  $('csv').textContent = tr('Baixar tabela CSV', 'Download CSV table');
  $('chart-heading').textContent = tr('Leia o cenário', 'Read the scenario');
  $('insight-heading').textContent = tr('O que este resultado mostra', 'What this result shows');
  $('table-heading').textContent = tr('Evidências em detalhe', 'Evidence in detail');
  $('advanced-label').textContent = tr(
    'Modo avançado: editar o cenário',
    'Advanced: edit the scenario',
  );
  $('apply-json').textContent = tr('Aplicar cenário', 'Apply scenario');
  $('scenario-label').textContent = tr('Entrada completa em JSON', 'Complete JSON input');
  $('scope-title').textContent = tr('Como isso se conecta ao Vbot', 'How this connects to Vbot');
  $('scope-text').textContent = tr(
    'Um operador pode usar funções nativas e preencher observações manualmente. Estes resultados descrevem o software e os cenários fictícios; ainda não houve validação física.',
    'An operator can use native functions and enter observations manually. These results describe the software and synthetic scenarios; no physical validation has been performed.',
  );
  $('footer-note').textContent = tr(
    'Proposta independente de Gabriel Demetrios Lafis. Sem parceria anunciada com Vbot ou USP.',
    'Independent proposal by Gabriel Demetrios Lafis. No announced partnership with Vbot or USP.',
  );
  $('scenario-count').textContent = '05';
  $('scenario-count-label').textContent = tr('exemplos para explorar', 'examples to explore');
  $('version-label').textContent = tr('Edição do portfólio', 'Portfolio edition');
  $('example-list').innerHTML = catalog
    .map(
      (c, i) =>
        '<button class="example ' +
        (c.id === current.id ? 'chosen' : '') +
        '" data-example="' +
        c.id +
        '" aria-pressed="' +
        (c.id === current.id) +
        '"><span class="example-number">0' +
        (i + 1) +
        '</span><strong>' +
        esc(c.title[lang]) +
        '</strong><span>' +
        esc(c.context[lang]) +
        '</span></button>',
    )
    .join('');
  $('example-list')
    .querySelectorAll('button')
    .forEach((b) => (b.onclick = () => loadExample(b.dataset.example)));
}
function controls() {
  const n = project.number;
  let html =
    '<div class="panel-title"><span class="eyebrow">' +
    tr('EXPLORE', 'EXPLORE') +
    '</span><h2>' +
    tr('Ajuste a pergunta', 'Adjust the question') +
    '</h2></div>';
  if (n === 1)
    html +=
      field(
        tr('Distância mínima (m)', 'Minimum distance (m)'),
        'preferences.min_distance_m',
        scenario.preferences.min_distance_m,
      ) +
      field(
        tr('Distância máxima (m)', 'Maximum distance (m)'),
        'preferences.max_distance_m',
        scenario.preferences.max_distance_m,
      ) +
      field(
        tr('Ritmo máximo (m/s)', 'Maximum pace (m/s)'),
        'preferences.max_speed_mps',
        scenario.preferences.max_speed_mps,
      ) +
      field(
        tr('Lacuna máxima (s)', 'Maximum observation gap (s)'),
        'preferences.max_gap_s',
        scenario.preferences.max_gap_s,
        0.1,
      );
  if (n === 2)
    html +=
      '<label class="field stacked"><span>' +
      tr('Experimente uma frase', 'Try a phrase') +
      '</span><input id="phrase" type="text" maxlength="200" placeholder="' +
      tr('Ex.: BoBo, me acompanhe', 'E.g. BoBo, me acompanhe') +
      '"></label><button id="try-phrase" class="button primary">' +
      tr('Interpretar texto', 'Interpret text') +
      '</button><div id="phrase-result" class="callout" role="status">' +
      tr(
        'Dicionário explícito. Frases desconhecidas pedem esclarecimento.',
        'Explicit dictionary. Unknown phrases ask for clarification.',
      ) +
      '</div><p class="control-note">' +
      tr(
        'Texto apenas: não reconhece fala e não envia comandos.',
        'Text only: no speech recognition or device commands.',
      ) +
      '</p>';
  if (n === 3)
    html +=
      field(
        tr('Carga inicial (fração)', 'Starting charge (fraction)'),
        'limits.available_fraction',
        scenario.limits.available_fraction,
        0,
        1,
        0.05,
      ) +
      field(
        tr('Reserva (fração)', 'Reserve (fraction)'),
        'limits.reserve_fraction',
        scenario.limits.reserve_fraction,
        0,
        1,
        0.05,
      ) +
      field(
        tr('Carga com suporte (kg)', 'Payload including carrier (kg)'),
        'limits.max_payload_kg',
        scenario.limits.max_payload_kg,
        0.1,
      ) +
      field(
        tr('Massa do suporte (kg)', 'Carrier mass (kg)'),
        'limits.carrier_kg',
        scenario.limits.carrier_kg,
      ) +
      field(
        tr('Consumo base (Wh/m)', 'Base energy cost (Wh/m)'),
        'limits.base_wh_per_m',
        scenario.limits.base_wh_per_m,
        0.001,
        '',
        0.01,
      );
  if (n === 4) {
    html +=
      '<p class="control-note">' +
      tr(
        'Os botões simulam escolhas no fluxo do facilitador. Confira o estado real no aplicativo do fabricante.',
        'Buttons simulate facilitator workflow choices. Verify the actual device state in the manufacturer app.',
      ) +
      '</p><div class="action-grid">';
    const allowed = result?.available_actions ?? [];
    for (const action of [
      'accept',
      'decline',
      'pause',
      'resume',
      'record_grant',
      'record_revoke',
      'withdraw',
      'finish',
    ])
      html +=
        '<button class="button action" data-action="' +
        action +
        '" ' +
        (!allowed.includes(action) ? 'disabled' : '') +
        '>' +
        word(action) +
        '</button>';
    html +=
      '</div><button id="new-session" class="button secondary full">' +
      tr('Começar novo convite', 'Start a new invitation') +
      '</button><button id="undo" class="text-button" ' +
      (!scenario.events.length ? 'disabled' : '') +
      '>' +
      tr('Desfazer última etapa', 'Undo last step') +
      '</button>';
  }
  if (n === 5)
    html +=
      field(
        tr('Visitas independentes mínimas', 'Minimum distinct visits'),
        'min_sessions',
        scenario.min_sessions,
        1,
        1000,
        1,
      ) +
      '<p class="control-note">' +
      tr(
        'A confirmação humana continua obrigatória em qualquer limite de visitas.',
        'Human confirmation remains required at any visit threshold.',
      ) +
      '</p>';
  html +=
    '<p class="control-note">' +
    tr(
      'Alterações são calculadas neste navegador. Nenhum dado é enviado a um servidor de análise.',
      'Changes are calculated in this browser. No data is sent to an analysis server.',
    ) +
    '</p>';
  $('controls').innerHTML = html;
  $('controls')
    .querySelectorAll('[data-field]')
    .forEach(
      (input) =>
        (input.oninput = input.onchange =
          () => {
            const path = input.dataset.field.split('.');
            let target = scenario;
            for (const k of path.slice(0, -1)) target = target[k];
            target[path.at(-1)] = input.valueAsNumber;
            run(false);
          }),
    );
  if (n === 2)
    $('try-phrase').onclick = () => {
      try {
        const r = engine.interpret($('phrase').value);
        $('phrase-result').innerHTML =
          badge(word(r.intent), r.intent === 'unknown' ? 'amber' : 'green') +
          '<p>' +
          tr(
            r.intent === 'stop'
              ? 'O operador deve usar o mecanismo nativo de parada.'
              : r.intent === 'unknown'
                ? 'Peça esclarecimento. A frase não está no dicionário.'
                : 'O operador revisa a função e a permissão antes de agir.',
            r.intent === 'stop'
              ? 'The operator must use the native stop mechanism.'
              : r.intent === 'unknown'
                ? 'Ask for clarification. The phrase is outside the dictionary.'
                : 'The operator reviews the feature and permission before acting.',
          ) +
          '</p>';
      } catch (e) {
        $('phrase-result').textContent = e.message;
      }
    };
  if (n === 4) {
    $('controls')
      .querySelectorAll('[data-action]')
      .forEach(
        (b) =>
          (b.onclick = () => {
            scenario.events.push({ type: b.dataset.action });
            run();
          }),
      );
    $('new-session').onclick = () => {
      scenario.events = [];
      run();
    };
    $('undo').onclick = () => {
      scenario.events.pop();
      run();
    };
  }
}
function metric(label, value, foot) {
  return (
    '<article class="metric"><span>' +
    esc(label) +
    '</span><strong>' +
    esc(value) +
    '</strong><small>' +
    esc(foot) +
    '</small></article>'
  );
}
function table(headers, rows) {
  return (
    '<table><thead><tr>' +
    headers.map((x) => '<th scope="col">' + esc(x) + '</th>').join('') +
    '</tr></thead><tbody>' +
    rows
      .map((row) => '<tr>' + row.map((x) => '<td>' + esc(x) + '</td>').join('') + '</tr>')
      .join('') +
    '</tbody></table>'
  );
}
function lineChart(points, { title, xLabel, yLabel, color = project.color }) {
  const w = 760,
    h = 245,
    l = 50,
    r = 24,
    t = 24,
    b = 45;
  const values = points.map((p) => p.y),
    max = Math.max(1, ...values),
    min = 0;
  const x = (i) => l + (i * (w - l - r)) / Math.max(1, points.length - 1),
    y = (v) => h - b - (v / max) * (h - t - b);
  let marks = '';
  for (let i = 0; i <= 4; i++) {
    const yy = y((max * i) / 4);
    marks +=
      '<line x1="' +
      l +
      '" x2="' +
      (w - r) +
      '" y1="' +
      yy +
      '" y2="' +
      yy +
      '" stroke="#dce5df"/><text x="' +
      (l - 12) +
      '" y="' +
      (yy + 4) +
      '" text-anchor="end">' +
      esc(num((max * i) / 4)) +
      '</text>';
  }
  marks +=
    '<polyline points="' +
    points.map((p, i) => x(i) + ',' + y(p.y)).join(' ') +
    '" fill="none" stroke="' +
    color +
    '" stroke-width="3"/>';
  points.forEach((p, i) => {
    marks +=
      '<circle cx="' +
      x(i) +
      '" cy="' +
      y(p.y) +
      '" r="5" fill="' +
      color +
      '"/><text x="' +
      x(i) +
      '" y="' +
      (h - 22) +
      '" text-anchor="middle">' +
      esc(p.label) +
      '</text>';
  });
  return (
    '<svg viewBox="0 0 ' +
    w +
    ' ' +
    h +
    '" role="img" aria-label="' +
    esc(title) +
    '"><title>' +
    esc(title) +
    '</title><text x="' +
    l +
    '" y="13">' +
    esc(yLabel) +
    '</text>' +
    marks +
    '<text x="' +
    (w - r) +
    '" y="' +
    (h - 2) +
    '" text-anchor="end">' +
    esc(xLabel) +
    '</text></svg>'
  );
}
function followChart(s, r) {
  const rows = r.analysis.intervals,
    start = s.samples[0].t_s,
    total = r.analysis.total_s;
  const w = 760,
    l = 45,
    right = 25,
    usable = w - l - right,
    h = 260,
    top = 28,
    bottom = 190;
  const minY = 0,
    maxY = Math.max(s.preferences.max_distance_m + 0.5, ...s.samples.map((x) => x.distance_m), 1);
  const x = (t) => l + ((t - start) / total) * usable,
    y = (d) => bottom - (d / maxY) * (bottom - top);
  let content =
    '<rect x="' +
    l +
    '" y="' +
    y(s.preferences.max_distance_m) +
    '" width="' +
    usable +
    '" height="' +
    (y(s.preferences.min_distance_m) - y(s.preferences.max_distance_m)) +
    '" fill="#d9ebe2"/>';
  for (let i = 0; i < 5; i++) {
    const v = (maxY * i) / 4,
      yy = y(v);
    content +=
      '<line x1="' +
      l +
      '" x2="' +
      (w - right) +
      '" y1="' +
      yy +
      '" y2="' +
      yy +
      '" stroke="#d7e2dc"/><text x="' +
      (l - 8) +
      '" y="' +
      (yy + 4) +
      '" text-anchor="end">' +
      esc(num(v)) +
      '</text>';
  }
  rows.forEach((row, i) => {
    const x1 = x(row.from_s),
      x2 = x(row.to_s),
      gap = row.reasons.includes('observation_gap'),
      fill = gap ? '#d9dedb' : row.reasons.length ? '#d69a54' : project.color;
    content +=
      '<rect x="' +
      x1 +
      '" y="210" width="' +
      Math.max(1, x2 - x1 - 2) +
      '" height="15" rx="3" fill="' +
      fill +
      '"/>';
    if (gap)
      content +=
        '<rect x="' +
        x1 +
        '" y="' +
        top +
        '" width="' +
        (x2 - x1) +
        '" height="' +
        (bottom - top) +
        '" fill="#edf0ed" opacity=".9"/>';
    else
      content +=
        '<line x1="' +
        x1 +
        '" x2="' +
        x2 +
        '" y1="' +
        y(s.samples[i].distance_m) +
        '" y2="' +
        y(s.samples[i].distance_m) +
        '" stroke="' +
        fill +
        '" stroke-width="3"/><circle cx="' +
        x1 +
        '" cy="' +
        y(s.samples[i].distance_m) +
        '" r="4" fill="' +
        fill +
        '"/>';
  });
  for (let i = 0; i <= 4; i++) {
    const sec = (total * i) / 4;
    content +=
      '<text x="' +
      x(start + sec) +
      '" y="247" text-anchor="middle">' +
      esc(num(start + sec)) +
      ' s</text>';
  }
  return (
    '<svg viewBox="0 0 760 260" role="img" aria-label="' +
    tr('Distância por intervalo observado', 'Distance by observed interval') +
    '"><title>' +
    tr(
      'Distância, faixa escolhida e lacunas de observação',
      'Distance, chosen band and observation gaps',
    ) +
    '</title><text x="' +
    l +
    '" y="13">' +
    tr('distância (m)', 'distance (m)') +
    '</text>' +
    content +
    '</svg><div class="legend"><span><i style="background:#d9ebe2"></i>' +
    tr('Faixa escolhida', 'Chosen band') +
    '</span><span><i style="background:#d69a54"></i>' +
    tr('Revisar', 'Review') +
    '</span><span><i style="background:#d9dedb"></i>' +
    tr('Sem observação', 'Unobserved') +
    '</span></div>'
  );
}
function render() {
  const r = result,
    a = r.analysis,
    n = project.number;
  let metrics = '',
    chart = '',
    insight = '',
    headers = [],
    rows = [],
    extra = '';
  if (n === 1) {
    metrics =
      metric(
        tr('Evidência observada', 'Observed evidence'),
        pct(r.evidence_fraction),
        num(a.observed_s) + ' / ' + num(a.total_s) + ' s',
      ) +
      metric(
        tr('Preferências atendidas', 'Preference match'),
        pct(a.preference_match_fraction),
        tr('sobre o tempo observado', 'of observed time'),
      ) +
      metric(
        tr('Parada para revisar', 'Stop mismatch'),
        num(a.stop_mismatch_s) + ' s',
        tr('registro exige revisão', 'record requires review'),
      ) +
      metric(
        tr('Maior lacuna', 'Longest gap'),
        num(r.longest_gap_s) + ' s',
        tr('sem inferir comportamento', 'no behavior inferred'),
      );
    chart = followChart(scenario, r);
    insight =
      tr('Foram observados ', 'Observed ') +
      num(a.observed_s) +
      tr(' segundos; ', ' seconds; ') +
      num(a.unknown_s) +
      tr(
        ' segundos permanecem desconhecidos. A taxa de preferência usa apenas o tempo observado.',
        ' seconds remain unknown. The preference rate uses observed time only.',
      );
    headers = [
      tr('Intervalo', 'Interval'),
      tr('Duração', 'Duration'),
      tr('Leitura', 'Interpretation'),
    ];
    rows = a.intervals.map((x) => [
      num(x.from_s) + '–' + num(x.to_s) + ' s',
      num(x.duration_s) + ' s',
      x.reasons.length
        ? x.reasons.map(word).join(' · ')
        : tr('Preferências atendidas', 'Preferences matched'),
    ]);
    extra =
      '<h3>' +
      tr('E se a faixa de distância mudar?', 'What if the distance band changes?') +
      '</h3>' +
      table(
        [
          tr('Largura relativa', 'Relative width'),
          tr('Faixa (m)', 'Band (m)'),
          tr('Tempo correspondente', 'Matched time'),
        ],
        r.comparisons.map((x) => [
          num(x.factor) + '×',
          num(x.min_m, 2) + '–' + num(x.max_m, 2),
          num(x.match_s) + ' s',
        ]),
      );
  }
  if (n === 2) {
    metrics =
      metric(
        tr('Frases avaliadas', 'Phrases evaluated'),
        num(a.cases),
        tr('rótulos esperados explícitos', 'explicit expected labels'),
      ) +
      metric(
        tr('Acurácia no cenário', 'Scenario accuracy'),
        pct(a.accuracy),
        tr('não é generalização', 'not generalization'),
      ) +
      metric(
        'Macro F1',
        num(r.macro_f1, 3),
        tr('classes com suporte ou previsão', 'classes with support or predictions'),
      ) +
      metric(
        tr('Abstenções', 'Abstentions'),
        num(a.abstentions),
        tr('pedidos de esclarecimento', 'clarification requests'),
      );
    const max = Math.max(1, ...r.matrix.flat());
    chart =
      '<p class="chart-caption">' +
      tr(
        'Linhas: intenção esperada · Colunas: interpretação',
        'Rows: expected intent · Columns: interpretation',
      ) +
      '</p><div class="matrix" role="table"><span></span>' +
      engineIntents()
        .map((k) => '<strong>' + word(k) + '</strong>')
        .join('') +
      r.matrix
        .map(
          (row, i) =>
            '<strong>' +
            word(engineIntents()[i]) +
            '</strong>' +
            row
              .map(
                (v, j) =>
                  '<span class="matrix-cell ' +
                  (i === j ? 'diagonal' : '') +
                  '" style="--strength:' +
                  v / max +
                  '" title="' +
                  esc(word(engineIntents()[i]) + ' → ' + word(engineIntents()[j])) +
                  '">' +
                  v +
                  '</span>',
              )
              .join(''),
        )
        .join('') +
      '</div>';
    insight =
      tr('A baseline acertou ', 'The baseline matched ') +
      a.correct +
      tr(' de ', ' of ') +
      a.cases +
      tr(
        ' frases. Os exemplos difíceis revelam expressões fora do dicionário; nenhuma frase controla o robô.',
        ' phrases. Difficult examples reveal expressions outside the dictionary; no phrase controls a robot.',
      );
    headers = [
      tr('Frase', 'Phrase'),
      tr('Esperado', 'Expected'),
      tr('Interpretado', 'Interpreted'),
      tr('Resultado', 'Result'),
    ];
    rows = a.results.map((x, i) => [
      scenario.cases[i].text,
      word(x.expected),
      word(x.intent),
      x.correct ? tr('Acerto', 'Match') : tr('Divergência', 'Mismatch'),
    ]);
    extra =
      '<h3>' +
      tr('Qualidade por intenção', 'Per-intent metrics') +
      '</h3>' +
      table(
        [tr('Intenção', 'Intent'), tr('Suporte', 'Support'), 'Precision', 'Recall', 'F1'],
        r.per_intent.map((x) => [
          word(x.intent),
          x.support,
          num(x.precision, 3),
          num(x.recall, 3),
          num(x.f1, 3),
        ]),
      );
  }
  if (n === 3) {
    const b = a.baseline;
    metrics =
      metric(
        tr('Materiais selecionados', 'Selected supplies'),
        num(b.selected.length),
        tr('viagens independentes', 'independent return trips'),
      ) +
      metric(
        tr('Prioridade atendida', 'Priority served'),
        num(b.priority),
        tr('pontos declarados no cenário', 'declared scenario points'),
      ) +
      metric(
        tr('Energia planejada', 'Planned energy'),
        num(b.energy_wh) + ' Wh',
        num(b.budget_wh) + ' Wh ' + tr('disponíveis', 'available'),
      ) +
      metric(
        tr('Reserva preservada', 'Reserved energy'),
        num(b.reserve_wh) + ' Wh',
        num(b.remaining_wh) + ' Wh ' + tr('restantes', 'remaining'),
      );
    chart = lineChart(
      r.sensitivity.map((x) => ({ label: num(x.factor) + '×', y: x.priority })),
      {
        title: tr(
          'Prioridade alcançável por custo energético',
          'Attainable priority by energy cost',
        ),
        xLabel: tr('multiplicador do consumo base', 'base energy-cost multiplier'),
        yLabel: tr('prioridade', 'priority'),
      },
    );
    insight =
      tr('A seleção usa ', 'The selection uses ') +
      num(b.energy_wh) +
      tr(' Wh de um orçamento de ', ' Wh of a ') +
      num(b.budget_wh) +
      tr(
        ' Wh. O peso do suporte entra na carga e no consumo. A curva recalcula a seleção ótima com custos maiores.',
        ' Wh budget. Carrier mass counts toward payload and energy. The curve re-optimizes under higher energy costs.',
      );
    headers = [
      tr('Material', 'Supply'),
      tr('Carga com suporte', 'Payload with carrier'),
      tr('Energia', 'Energy'),
      tr('Decisão', 'Decision'),
    ];
    rows = r.items.map((x) => [
      x.id,
      num(x.total_payload_kg) + ' kg',
      x.energy_wh === null ? '—' : num(x.energy_wh) + ' Wh',
      word(x.reason),
    ]);
    extra =
      '<h3>' +
      tr('Seleção quando o consumo muda', 'Selection as cost changes') +
      '</h3>' +
      table(
        [
          tr('Consumo relativo', 'Relative cost'),
          tr('Prioridade', 'Priority'),
          tr('Seleção', 'Selection'),
        ],
        r.sensitivity.map((x) => [num(x.factor) + '×', x.priority, x.selected.join(', ') || '—']),
      );
  }
  if (n === 4) {
    metrics =
      metric(
        tr('Estado do fluxo', 'Workflow state'),
        word(a.state),
        tr('não mede o estado do robô', 'does not measure robot state'),
      ) +
      metric(
        tr('Permissão de gravação', 'Recording permission'),
        a.recording ? tr('Ativa', 'Active') : tr('Inativa', 'Inactive'),
        tr('decisão separada', 'separate decision'),
      ) +
      metric(
        tr('Pausas aceitas', 'Accepted pauses'),
        num(r.pause_count),
        tr('retomada sem consentimento herdado', 'resume without inherited consent'),
      ) +
      metric(
        tr('Transições rejeitadas', 'Rejected transitions'),
        num(a.rejections.length),
        tr('visíveis no diário', 'visible in the journal'),
      );
    chart =
      '<div class="state-path">' +
      ['invited', 'active', 'paused', 'ended']
        .map(
          (x, i) =>
            '<div class="' +
            (a.state === x ? 'current' : '') +
            '"><span>0' +
            (i + 1) +
            '</span><strong>' +
            word(x) +
            '</strong></div>',
        )
        .join('') +
      '</div><div class="event-track">' +
      (a.journal.length
        ? a.journal
            .map(
              (x) =>
                '<div class="event-dot ' +
                (!x.accepted ? 'rejected' : x.recording ? 'recording' : '') +
                '"><b>' +
                x.sequence +
                '</b><span>' +
                esc(word(x.type)) +
                '</span><small>' +
                esc(word(x.state)) +
                '</small></div>',
            )
            .join('')
        : '<p>' +
          tr(
            'O convite está aberto. Aceitar e recusar são escolhas igualmente disponíveis.',
            'The invitation is open. Accepting and declining are equally available choices.',
          ) +
          '</p>') +
      '</div>';
    insight = tr(
      'Pausar desativa a permissão de gravação neste fluxo. Retomar não a restaura. Encerrar a participação fecha o encontro; um novo encontro começa com outro convite.',
      'Pausing disables recording permission in this workflow. Resuming does not restore it. Withdrawal closes the encounter; a new encounter starts with a new invitation.',
    );
    headers = [
      tr('Etapa', 'Step'),
      tr('Escolha', 'Choice'),
      tr('Aceita', 'Accepted'),
      tr('Estado', 'State'),
      tr('Gravação permitida', 'Recording permitted'),
    ];
    rows = a.journal.map((x) => [
      x.sequence,
      word(x.type),
      x.accepted ? tr('Sim', 'Yes') : tr('Não', 'No'),
      word(x.state),
      x.recording ? tr('Sim', 'Yes') : tr('Não', 'No'),
    ]);
    extra =
      '<div class="callout">' +
      tr(
        'O diário público exclui nomes, notas livres e coordenadas. Sequências não representam tempo nem provam o comportamento do equipamento.',
        'The public journal excludes names, free-text notes and coordinates. Sequences do not represent time or prove equipment behavior.',
      ) +
      '</div>';
  }
  if (n === 5) {
    metrics =
      metric(
        tr('Achados distintos', 'Distinct findings'),
        num(a.findings.length),
        tr('agrupados por zona e tipo', 'grouped by zone and type'),
      ) +
      metric(
        tr('Prontos para revisão', 'Ready for review'),
        num(a.review_count),
        tr('visitas + confirmação humana', 'visits + human confirmation'),
      ) +
      metric(
        tr('Linhas duplicadas', 'Duplicate rows'),
        num(r.duplicate_rows),
        tr('não são novas visitas', 'not new visits'),
      ) +
      metric(
        tr('Sem confirmação', 'Unconfirmed'),
        num(r.unconfirmed_findings),
        tr('ainda precisam de uma pessoa', 'still need a human'),
      );
    chart =
      '<div class="evidence-bars">' +
      (a.findings.length
        ? a.findings
            .map(
              (x) =>
                '<div class="evidence-row"><div><strong>' +
                esc(x.zone) +
                '</strong><span>' +
                esc(word(x.kind)) +
                '</span></div><div class="bar-track"><div style="width:' +
                Math.min(
                  100,
                  (x.distinct_sessions /
                    Math.max(
                      scenario.min_sessions,
                      ...a.findings.map((f) => f.distinct_sessions),
                    )) *
                    100,
                ) +
                '%" class="' +
                (x.status === 'review_queue' ? '' : 'pending') +
                '"></div></div><b>' +
                x.distinct_sessions +
                '</b>' +
                badge(word(x.status), x.status === 'review_queue' ? 'green' : 'amber') +
                '</div>',
            )
            .join('')
        : '<p>' +
          tr('Nenhuma observação neste cenário.', 'No observations in this scenario.') +
          '</p>') +
      '</div><p class="chart-caption">' +
      tr(
        'Comprimento: visitas distintas · A confirmação humana é um critério separado.',
        'Length: distinct visits · Human confirmation is a separate criterion.',
      ) +
      '</p>';
    insight =
      tr('Há ', 'There are ') +
      a.review_count +
      tr(
        ' achados na fila de revisão. Repetir uma linha não cria outra visita, e repetir visitas não substitui a confirmação humana.',
        ' findings in the review queue. Repeating a row does not create a new visit, and repeated visits do not replace human confirmation.',
      );
    headers = [
      tr('Zona', 'Zone'),
      tr('Barreira', 'Barrier'),
      tr('Visitas', 'Visits'),
      tr('Duplicatas', 'Duplicates'),
      tr('Confirmação', 'Confirmation'),
      tr('Situação', 'Status'),
    ];
    rows = a.findings.map((x) => [
      x.zone,
      word(x.kind),
      x.distinct_sessions,
      x.duplicate_rows,
      x.human_confirmed ? tr('Sim', 'Yes') : tr('Não', 'No'),
      word(x.status),
    ]);
    extra =
      '<h3>' +
      tr('Efeito do mínimo de visitas', 'Effect of minimum visits') +
      '</h3>' +
      table(
        [tr('Mínimo de visitas', 'Minimum visits'), tr('Itens para revisão', 'Review items')],
        r.sensitivity.map((x) => [x.min_sessions, x.review_count]),
      );
  }
  $('metrics').innerHTML = metrics;
  $('chart').innerHTML = chart;
  $('insight').textContent = insight;
  $('detail-table').innerHTML = table(headers, rows);
  $('comparison').innerHTML = extra;
  $('context').textContent = current.context[lang];
  $('current-example').textContent = current.title[lang];
  $('scenario-json').value = JSON.stringify(scenario, null, 2);
  return { headers, rows };
}
function engineIntents() {
  return ['stop', 'follow', 'photo', 'status', 'unknown'];
}
function run(rebuildControls = true) {
  try {
    result = study(scenario);
    $('error').textContent = '';
    title();
    render();
    if (rebuildControls) controls();
    ['report', 'export', 'csv'].forEach((id) => ($(id).disabled = false));
  } catch (e) {
    result = null;
    $('error').textContent = tr('Revise os parâmetros: ', 'Review the parameters: ') + e.message;
    for (const id of ['metrics', 'chart', 'detail-table', 'comparison']) $(id).replaceChildren();
    $('insight').textContent = '';
    ['report', 'export', 'csv'].forEach((id) => ($(id).disabled = true));
  }
}
async function loadExample(id) {
  const ticket = ++loadSequence,
    candidate = catalog.find((c) => c.id === id) || catalog[0];
  try {
    const response = await fetch('./examples/' + candidate.file);
    if (!response.ok) throw new Error('Scenario unavailable');
    const data = await response.json();
    if (ticket !== loadSequence) return;
    current = candidate;
    original = structuredClone(data);
    scenario = structuredClone(data);
    run();
  } catch (e) {
    $('error').textContent =
      tr('Não foi possível carregar o exemplo. ', 'Unable to load the example. ') + e.message;
  }
}
function download(content, type, name) {
  const url = URL.createObjectURL(new Blob([content], { type })),
    a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
$('language').onchange = (e) => {
  lang = e.target.value;
  run();
};
$('reset').onclick = () => {
  scenario = structuredClone(original);
  run();
};
$('apply-json').onclick = () => {
  try {
    const data = JSON.parse($('scenario-json').value);
    study(data);
    scenario = data;
    run();
  } catch (e) {
    $('error').textContent = tr('Cenário não aplicado: ', 'Scenario not applied: ') + e.message;
  }
};
$('export').onclick = () => {
  if (result)
    download(JSON.stringify(result, null, 2), 'application/json', project.slug + '-analysis.json');
};
$('csv').onclick = () => {
  if (!result) return;
  const { headers, rows } = render();
  const cell = (x) => {
    const v = String(x);
    return '"' + (/^[=+\-@\t\r]/.test(v) ? "'" : '') + v.replaceAll('"', '""') + '"';
  };
  download(
    '\uFEFF' + [headers, ...rows].map((row) => row.map(cell).join(',')).join('\r\n'),
    'text/csv;charset=utf-8',
    project.slug + '-evidence.csv',
  );
};
$('report').onclick = () => {
  if (!result) return;
  const body =
    '<h1>' +
    esc(project.short[lang]) +
    '</h1><p>' +
    esc(current.title[lang]) +
    '</p><p>' +
    esc(current.context[lang]) +
    '</p><div class="metrics">' +
    $('metrics').innerHTML +
    '</div><h2>' +
    esc($('insight-heading').textContent) +
    '</h2><p>' +
    esc($('insight').textContent) +
    '</p><h2>' +
    esc($('table-heading').textContent) +
    '</h2>' +
    $('detail-table').innerHTML +
    $('comparison').innerHTML +
    '<hr><p>' +
    esc($('scope-text').textContent) +
    '</p><p>' +
    esc($('footer-note').textContent) +
    '</p>';
  download(
    '<!doctype html><html lang="' +
      (lang === 'pt' ? 'pt-BR' : 'en') +
      '"><meta charset="utf-8"><title>' +
      esc(project.short[lang]) +
      '</title><style>body{font:15px/1.6 system-ui;color:#183b3d;max-width:1000px;margin:40px auto;padding:20px}h1{font-size:32px}.metrics{display:flex;gap:22px;flex-wrap:wrap}.metric span,.metric strong,.metric small{display:block}.metric strong{font-size:25px}table{border-collapse:collapse;width:100%;font-size:13px}td,th{padding:10px;border-bottom:1px solid #ccc;text-align:left}h2,h3{break-after:avoid}tr{break-inside:avoid}</style>' +
      body +
      '</html>',
    'text/html',
    project.slug + '-report.html',
  );
};
await loadExample(params.get('example') || catalog[0].id);
