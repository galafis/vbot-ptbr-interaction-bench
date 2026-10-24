import {analyze} from './src/engine.mjs';
const info={"title":"Português Interaction Bench · Bancada de Interação","en":"A small explicit Portuguese phrase interpreter, human-confirmation policy and reproducible benchmark for a future Vbot interaction study.","pt":"Um interpretador explícito de frases em português, política de confirmação humana e avaliação reproduzível para um futuro estudo de interação com Vbot.","scope":"Text-only rule baseline, not speech recognition or Vbot language support. Responses are suggestions for an operator; nothing is sent to the robot."};

const $=id=>document.getElementById(id);
let lang='pt',result=null;
const labels={
 pt:{run:'Analisar cenário',reset:'Restaurar exemplo',download:'Exportar resultado',input:'Cenário fictício (JSON)',output:'Resultado da análise',status:'Protótipo offline · Sem controle do robô',error:'Entrada inválida: ',note:'Dados fictícios. Use controles nativos e somente funções permitidas pelo fabricante. SDK aberto é opcional.'},
 en:{run:'Analyze scenario',reset:'Restore example',download:'Export result',input:'Synthetic scenario (JSON)',output:'Analysis result',status:'Offline prototype · No robot control',error:'Invalid input: ',note:'Synthetic data. Use native controls and manufacturer-permitted features only. An open SDK is optional.'}
};
function translate(){
 document.documentElement.lang=lang==='pt'?'pt-BR':'en';
 $('title').textContent=info.title;$('intro').textContent=info[lang];
 for(const id of ['run','reset','download','input','output','status','note'])$(id).textContent=labels[lang][id];
}
function render(r){
 $('summary').replaceChildren();$('table').replaceChildren();
 let metrics={};
 if(r.observed_s!==undefined)metrics={'Observed / Observado (s)':r.observed_s,'Unknown / Desconhecido (s)':r.unknown_s,'Preference / Preferência (s)':r.preference_match_s};
 if(r.accuracy!==undefined)metrics={'Cases / Casos':r.cases,'Correct / Corretos':r.correct,'Abstentions / Abstenções':r.abstentions};
 if(r.baseline)metrics={'Selected / Selecionados':r.baseline.selected.join(', ')||'—','Energy / Energia (Wh)':r.baseline.energy_wh,'Budget / Orçamento (Wh)':r.baseline.budget_wh};
 if(r.journal)metrics={'State / Estado':r.state,'Recording / Gravação':String(r.recording),'Rejected / Rejeitados':r.rejections.length};
 if(r.findings)metrics={'Review / Revisar':r.review_count,'Findings / Achados':r.findings.length};
 for(const [k,v] of Object.entries(metrics)){const card=document.createElement('article'),a=document.createElement('span'),b=document.createElement('strong');a.textContent=k;b.textContent=v;card.append(a,b);$('summary').append(card);}
 const rows=r.intervals||r.results||r.journal||r.findings||(r.baseline?.item_costs)||[];
 if(rows.length){const keys=Object.keys(rows[0]),head=document.createElement('tr');for(const k of keys){const th=document.createElement('th');th.textContent=k;head.append(th);}$('table').append(head);
 for(const row of rows){const tr=document.createElement('tr');for(const k of keys){const td=document.createElement('td');td.textContent=typeof row[k]==='object'?JSON.stringify(row[k]):String(row[k]);tr.append(td);}$('table').append(tr);}}
 $('raw').textContent=JSON.stringify(r,null,2);$('download').disabled=false;
}
function run(){try{result=analyze(JSON.parse($('scenario').value));$('error').textContent='';render(result);}catch(e){result=null;$('error').textContent=labels[lang].error+e.message;$('summary').replaceChildren();$('table').replaceChildren();$('raw').textContent='';$('download').disabled=true;}}
const baseline=await fetch('./examples/baseline.json').then(r=>r.json());
$('scenario').value=JSON.stringify(baseline,null,2);
$('run').onclick=run;$('reset').onclick=()=>{$('scenario').value=JSON.stringify(baseline,null,2);run();};
$('language').onchange=e=>{lang=e.target.value;translate();run();};
$('download').onclick=()=>{if(!result)return;const url=URL.createObjectURL(new Blob([JSON.stringify(result,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='analysis.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
translate();run();
