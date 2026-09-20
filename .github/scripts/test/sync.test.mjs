import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, copyFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import {
  parseCaption, dayFromDate, rdDate, reelCode, guessType, existingCodes, formatEntry, insertDay,
  parseNumbersCsv, applyNumbers, upsertHistory, startDateOf,
} from '../lib.mjs';

const SAMPLE_PATH = '.github/scripts/test/fixtures/challenge.sample.yml'; // frozen copy: tests never depend on live data
const REAL = readFileSync(SAMPLE_PATH, 'utf8');
const script = (name, env) => execFileSync('node', [`.github/scripts/${name}`], { env: { ...process.env, ...env }, encoding: 'utf8' });
const tmpYml = () => { const d = mkdtempSync(join(tmpdir(), 'ch-')); const p = join(d, 'challenge.yml'); copyFileSync(SAMPLE_PATH, p); return p; };

test('parseCaption: real captions', () => {
  const a = parseCaption('5 clientes reales. 5 minutos. Primer pago.\n\nPrimera prueba real de KASSO y no pudo empezar mejor: 1 pago + 3 promesas de pago de los primeros 5 clientes.\n\nEs una muestra demasiado pequeña para celebrar todavía… pero coño, promete. 😂\n\nDía 5. Seguimos.');
  assert.equal(a.day, 5);
  assert.equal(a.title, '5 clientes reales. 5 minutos. Primer pago.');
  assert.match(a.summary, /^Primera prueba real de KASSO/);
  assert.doesNotMatch(a.summary, /Seguimos/);
  const b = parseCaption('POV trabajando para reemplazar mi sueldo');
  assert.deepEqual(b, { day: null, title: 'POV trabajando para reemplazar mi sueldo', summary: '' });
  const c = parseCaption('La única forma de garantizar el fracaso es rendirse, así que seguimos 🚀');
  assert.equal(c.day, null); assert.equal(c.summary, '');
});

test('parseCaption: long first paragraph is split at the first sentence', () => {
  const r = parseCaption('Hoy fue un día largo y no pude hacer lo que quería hacer con mi hora del día. Al final avancé algo con el bot y con los reportes de los clientes nuevos.\n\nDía 9. Seguimos.');
  assert.equal(r.day, 9);
  assert.ok(r.title.endsWith('día.') || r.title.length <= 91);
  assert.ok(r.summary.length > 0);
});

test('day helpers use Dominican Republic time', () => {
  assert.equal(rdDate('2026-09-21T03:59:00Z'), '2026-09-20'); // 23:59 RD
  assert.equal(rdDate('2026-09-21T04:00:00Z'), '2026-09-21'); // 00:00 RD
  assert.equal(dayFromDate('2026-09-01T12:00:00Z', '2026-09-01'), 1);
  assert.equal(dayFromDate('2026-09-21T04:00:00Z', '2026-09-01'), 21);
  assert.equal(dayFromDate('2026-08-01T12:00:00Z', '2026-09-01'), 1); // never below 1
});

test('reelCode / guessType', () => {
  assert.equal(reelCode('https://www.instagram.com/reel/DdhSbrPAkP0/'), 'DdhSbrPAkP0');
  assert.equal(reelCode('https://www.instagram.com/winnercrespo/reel/Dc6_AL3AR8-/'), 'Dc6_AL3AR8-');
  assert.equal(reelCode('https://www.instagram.com/p/DcttgZ5xjO4/'), 'DcttgZ5xjO4');
  assert.equal(guessType('KASSO cobró'), 'business');
  assert.equal(guessType('Corrí 10 km'), 'build-in-public');
});

test('existing challenge.yml: codes found and start date read', () => {
  assert.equal(existingCodes(REAL).size, 24);
  assert.equal(startDateOf(REAL), '2026-09-01');
});

test('insertDay keeps newest-first order and the file parses as YAML', () => {
  const e = formatEntry({ day: 21, type: 'business', title: 'Título "con comillas"', summary: 'Resumen: con dos puntos', thumbnail: '', url: 'https://www.instagram.com/reel/X1/' });
  const out = insertDay(REAL, e, 21);
  const inDays = (t, needle) => t.slice(t.indexOf('\ndays:')).indexOf(needle);
  assert.ok(inDays(out, '- day: 21') >= 0 && inDays(out, '- day: 21') < inDays(out, '- day: 20'));
  const outSame = insertDay(REAL, formatEntry({ day: 20, type: 'business', title: 't', summary: '', thumbnail: '', url: 'https://www.instagram.com/reel/X2/' }), 20);
  assert.ok(inDays(outSame, 'reel/X2/') < inDays(outSame, 'reel/DdhSbrPAkP0/')); // same day: newest first
  const old = insertDay(REAL, formatEntry({ day: 0, type: 'other', title: 't', summary: '', thumbnail: '', url: 'https://www.instagram.com/reel/X3/' }), 0);
  assert.ok(inDays(old, 'reel/X3/') > inDays(old, 'reel/DcttgZ5xjO4/')); // oldest goes last
  const p = join(mkdtempSync(join(tmpdir(), 'ch-')), 'o.yml'); writeFileSync(p, out);
  execFileSync('ruby', ['-E', 'UTF-8', '-ryaml', '-rdate', '-e', 'd=YAML.safe_load(File.read(ARGV[0]), permitted_classes: [Date]); abort("bad YAML") unless d["days"].first["title"]["es"]==ARGV[1].dup.force_encoding("UTF-8") && d["days"].first["summary"]["es"]=="Resumen: con dos puntos"', p, 'Título "con comillas"']);
});

test('sync-instagram: adds only new Reels after the start date, idempotent, ignores photos', () => {
  const yml = tmpYml();
  const env = { IG_FIXTURE: '.github/scripts/test/fixtures/ig-new.json', CHALLENGE_YML: yml, IG_SKIP_THUMBS: '1' };
  const out1 = script('sync-instagram.mjs', env);
  assert.match(out1, /Added 2 episode\(s\)/);
  const text = readFileSync(yml, 'utf8');
  assert.match(text, /reel\/NEWREEL21aa\//); assert.match(text, /reel\/NEWREEL22bb\//);
  assert.doesNotMatch(text, /PHOTOPOST|OLDREEL/);
  assert.match(text, /day: 21\n    type: "business"/);              // caption said "Día 21", KASSO -> business
  assert.match(text, /day: 22\n    type: "build-in-public"/);        // no "Día N": computed from the date (Sep 22 -> day 22)
  assert.match(text, /title: \{ es: "Hoy cerramos el cuarto cliente de KASSO\." \}/);
  assert.match(script('sync-instagram.mjs', env), /No new Reels/);   // second run: nothing
});

test('sync-instagram: if the API returns the 24 Reels already loaded, nothing changes', () => {
  const codes = [...existingCodes(REAL)];
  const fx = join(mkdtempSync(join(tmpdir(), 'fx-')), 'all.json');
  writeFileSync(fx, JSON.stringify({ data: codes.map((c, i) => ({ id: String(i), media_type: 'VIDEO', media_product_type: 'REELS', permalink: `https://www.instagram.com/reel/${c}/`, timestamp: '2026-09-10T15:00:00+0000', caption: 'x' })) }));
  const yml = tmpYml();
  assert.match(script('sync-instagram.mjs', { IG_FIXTURE: fx, CHALLENGE_YML: yml, IG_SKIP_THUMBS: '1' }), /No new Reels/);
  assert.equal(readFileSync(yml, 'utf8'), REAL);
});

test('numbers: CSV parsing (aliases, currency, quotes) and validation', () => {
  assert.deepEqual(parseNumbersCsv('clave,valor\nTotal generado,"RD$1,500"\nIngreso mensual,300\n'), { total_generated: 1500, monthly_income: 300 });
  assert.deepEqual(parseNumbersCsv('total_generated,0\nmonthly_income,0'), { total_generated: 0, monthly_income: 0 });
  assert.throws(() => parseNumbersCsv('total_generated,abc\nmonthly_income,1'), /total_generated/);
  assert.throws(() => parseNumbersCsv('total_generated,1'), /monthly_income/);
});

test('numbers: update marker and step history only when monthly income changes', () => {
  const r = applyNumbers(REAL, { total_generated: 500, monthly_income: 0 }, 24);
  assert.match(r.yml, /total_generated: 500 /); assert.equal(r.yml.includes('day: 24, monthly_income'), false); // history untouched
  const s = applyNumbers(REAL, { total_generated: 500, monthly_income: 1500 }, 25);
  assert.match(s.yml, /\{ day: 24, monthly_income: 0 \}\n  - \{ day: 25, monthly_income: 1500 \}/);           // step: previous value carried
  const same = upsertHistory(s.yml, 25, 1500); assert.equal(same, s.yml);
  const t = upsertHistory(s.yml, 25, 1800); assert.match(t, /day: 25, monthly_income: 1800/); assert.equal(t.includes('{ day: 25, monthly_income: 1500 }'), false);
  assert.equal(applyNumbers(REAL, { total_generated: 0, monthly_income: 0 }, 20).changed.length, 0);
});

test('sync-numbers: end to end with a CSV file; HTML instead of CSV is rejected', () => {
  const yml = tmpYml(); const dir = mkdtempSync(join(tmpdir(), 'csv-'));
  writeFileSync(join(dir, 'n.csv'), 'total_generated,2500\nmonthly_income,900\n');
  assert.match(script('sync-numbers.mjs', { NUMBERS_CSV_FILE: join(dir, 'n.csv'), CHALLENGE_YML: yml }), /Numbers updated/);
  assert.match(readFileSync(yml, 'utf8'), /total_generated: 2500 /);
  writeFileSync(join(dir, 'bad.csv'), '<html><body>Sign in</body></html>');
  assert.throws(() => script('sync-numbers.mjs', { NUMBERS_CSV_FILE: join(dir, 'bad.csv'), CHALLENGE_YML: yml }), /Command failed/);
});

test('scripts skip quietly without secrets', () => {
  const clean = { IG_TOKEN: '', IG_FIXTURE: '', NUMBERS_CSV_URL: '', NUMBERS_CSV_FILE: '' };
  assert.match(script('sync-instagram.mjs', clean), /skipping/); assert.match(script('sync-numbers.mjs', clean), /skipping/);
});
