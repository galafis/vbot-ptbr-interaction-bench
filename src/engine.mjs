import {array,string,version,object,round} from './contract.mjs';
export function normalize(text) {
  string(text,'text');
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu,' ').replace(/\s+/g,' ').trim().replace(/^(bobo|vbot) /,'');
}
const dictionary={
  stop:['pare','parar','parou','fique parado'],
  follow:['me acompanhe','me siga','siga comigo'],
  photo:['tire uma foto','tirar foto'],
  status:['mostre a bateria','qual a bateria','status']
};
export function interpret(text) {
  const normalized=normalize(text);
  const intent=Object.entries(dictionary).find(([,phrases])=>phrases.includes(normalized))?.[0]??'unknown';
  return {intent,operator_action:intent==='stop'?'use_native_stop_now':intent==='unknown'?'clarify':'review_native_feature',
    confirmation_required:intent!=='stop',device_command:null,normalized};
}
export function analyze(s) {
  version(s); const cases=array(s.cases,'cases',1000); if(!cases.length) throw new Error('Empty benchmark');
  const allowed=[...Object.keys(dictionary),'unknown'],ids=new Set(),confusion={}; let correct=0,abstentions=0;
  const results=cases.map(c=>{
    object(c,'case'); string(c.id,'id'); if(ids.has(c.id))throw new Error('Duplicate case id');ids.add(c.id);
    if(!allowed.includes(c.expected))throw new Error('Unknown expected label');
    const result=interpret(c.text); const key=c.expected+' -> '+result.intent;
    confusion[key]=(confusion[key]??0)+1; correct+=Number(result.intent===c.expected);
    abstentions+=Number(result.intent==='unknown');
    return {id:c.id,expected:c.expected,...result,correct:result.intent===c.expected};
  });
  return {mode:'text_rule_baseline',cases:cases.length,correct,accuracy:round(correct/cases.length),
    abstentions,confusion,results,notice:'Curated text cases only; not a speech or language-support claim.'};
}
