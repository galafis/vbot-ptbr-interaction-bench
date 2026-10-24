import { readFileSync, writeFileSync } from 'node:fs';
import { analyze } from './src/engine.mjs';
try {
  if (!process.argv[2]) throw new Error('Usage: node cli.mjs INPUT.json [NEW-OUTPUT.json]');
  const result = analyze(JSON.parse(readFileSync(process.argv[2], 'utf8')));
  const json = JSON.stringify(result, null, 2) + '\n';
  if (process.argv[3]) writeFileSync(process.argv[3], json, { flag: 'wx' });
  else process.stdout.write(json);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
