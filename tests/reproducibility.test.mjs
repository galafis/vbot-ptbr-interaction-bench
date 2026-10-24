import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,rmSync,writeFileSync} from 'node:fs';import {tmpdir} from 'node:os';import {join} from 'node:path';import {spawnSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
import {analyze} from '../src/engine.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
test('versioned example output matches the engine',()=>{
 const input=JSON.parse(readFileSync(new URL('../examples/baseline.json',import.meta.url)));
 const expected=JSON.parse(readFileSync(new URL('../examples/expected.json',import.meta.url)));
 assert.deepEqual(analyze(input),expected);
});
test('CLI exports, refuses overwrite and rejects malformed input',()=>{
 const folder=mkdtempSync(join(tmpdir(),'vbot-test-'));
 try{
  const output=join(folder,'result.json'),bad=join(folder,'bad.json');
  const run=args=>spawnSync(process.execPath,['cli.mjs',...args],{cwd:root,encoding:'utf8'});
  assert.equal(run(['examples/baseline.json',output]).status,0);
  const before=readFileSync(output,'utf8');
  assert.equal(run(['examples/baseline.json',output]).status,1);
  assert.equal(readFileSync(output,'utf8'),before);
  writeFileSync(bad,'{"version":999}');
  assert.equal(run([bad]).status,1);
 }finally{rmSync(folder,{recursive:true,force:true});}
});
