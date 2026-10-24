import { readFileSync } from 'node:fs';
import { study } from './src/insights.mjs';
try {
  if (!process.argv[2]) throw new Error('Usage: node study.mjs INPUT.json');
  process.stdout.write(
    JSON.stringify(study(JSON.parse(readFileSync(process.argv[2], 'utf8'))), null, 2) + '\n',
  );
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
