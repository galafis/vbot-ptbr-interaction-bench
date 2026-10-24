export function object(v, name) {
  if (!v || typeof v !== 'object' || Array.isArray(v)) throw new Error(name + ': expected object');
  return v;
}
export function number(v, name, min=0, max=Infinity) {
  if (typeof v !== 'number' || !Number.isFinite(v) || v < min || v > max) throw new Error(name + ': invalid finite number');
  return v;
}
export function string(v,name) {
  if(typeof v!=='string'||!v.trim()||v.length>200) throw new Error(name+': invalid string');
  return v;
}
export function array(v,name,max=10000) {
  if(!Array.isArray(v)||v.length>max) throw new Error(name+': invalid array');
  return v;
}
export function boolean(v,name) {
  if(typeof v!=='boolean') throw new Error(name+': expected boolean');
  return v;
}
export function version(s) { object(s,'scenario'); if(s.version!==1) throw new Error('Unsupported scenario version'); }
export const round = n => Math.round(n * 10000) / 10000;
