// Reads total_generated / monthly_income from a published Google Sheet CSV and updates
// _data/challenge.yml (marker, and the income history for the chart when the monthly income changes).
//
// Env:
//   NUMBERS_CSV_URL   published CSV URL (skip if missing)   NUMBERS_CSV_FILE  local file (tests)
//   CHALLENGE_YML     path (default _data/challenge.yml)
import { readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { parseNumbersCsv, applyNumbers, startDateOf, dayFromDate } from './lib.mjs';

const YML = process.env.CHALLENGE_YML || '_data/challenge.yml';
const url = process.env.NUMBERS_CSV_URL;
const file = process.env.NUMBERS_CSV_FILE;
if (!url && !file) {
  console.log('NUMBERS_CSV_URL not set: skipping numbers sync.');
  process.exit(0);
}

let csv;
if (file) csv = readFileSync(file, 'utf8');
else {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`Could not fetch the numbers CSV (HTTP ${res.status}). Is the sheet published to the web as CSV?`);
  csv = await res.text();
}
if (/<html/i.test(csv.slice(0, 200))) {
  throw new Error('The numbers URL returned a web page, not a CSV. Publish the sheet with File > Share > Publish to web > CSV.');
}

const next = parseNumbersCsv(csv);
const yml = readFileSync(YML, 'utf8');
const today = dayFromDate(new Date(), startDateOf(yml));
const { yml: out, changed } = applyNumbers(yml, next, today);

if (changed.length) {
  writeFileSync(YML, out);
  console.log(`Numbers updated:\n- ${changed.join('\n- ')}`);
} else {
  console.log('Numbers unchanged.');
}
if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `numbers_changed=${changed.length}\n`);
