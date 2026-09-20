// Helpers for the automatic challenge sync. No dependencies (Node 20+).
// Everything here is pure text/date logic so it can be unit tested offline.

export const TZ = 'America/Santo_Domingo';

/* ---------- Instagram helpers ---------- */

/** "https://www.instagram.com/reel/AbC-1_/" -> "AbC-1_" */
export function reelCode(permalink) {
  const m = String(permalink || '').match(/instagram\.com\/(?:[^/]+\/)?(?:reel|reels|p|tv)\/([\w-]+)/);
  return m ? m[1] : null;
}

export function reelUrl(code) {
  return `https://www.instagram.com/reel/${code}/`;
}

/** Date (Date | ISO string) -> "YYYY-MM-DD" in Dominican Republic time. */
export function rdDate(d) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' })
    .format(new Date(d));
}

/** Challenge day (Day 1 = startDate "YYYY-MM-DD") for a moment in time, in RD time. */
export function dayFromDate(d, startDate) {
  const a = Date.parse(`${rdDate(d)}T00:00:00Z`);
  const b = Date.parse(`${startDate}T00:00:00Z`);
  return Math.max(1, Math.round((a - b) / 86400000) + 1);
}

function cut(text, max) {
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  const sentence = Math.max(slice.lastIndexOf('. '), slice.lastIndexOf('? '), slice.lastIndexOf('! '));
  if (sentence > max * 0.5) return slice.slice(0, sentence + 1);
  const space = slice.lastIndexOf(' ');
  return slice.slice(0, space > 0 ? space : max).replace(/[,;:\s]+$/, '') + '…';
}

/**
 * Caption -> { day, title, summary }.
 * - "Día N. ..." sign-off line (last such line) gives the day and is removed.
 * - First paragraph is the title, the rest the summary. Words stay exactly as written.
 */
export function parseCaption(caption = '') {
  let text = String(caption).replace(/\r/g, '').trim();
  let day = null;
  const lines = text.split('\n');
  for (let i = lines.length - 1; i >= 0; i--) {
    const m = lines[i].match(/^\s*D[ií]a\s+(\d{1,4})\b/i);
    if (m) { day = Number(m[1]); lines.splice(i, 1); break; }
  }
  text = lines.join('\n').trim();
  // drop trailing hashtag-only lines
  text = text.replace(/(\n\s*(#[\wÀ-ɏ]+\s*)+)+$/u, '').trim();
  const paragraphs = text.split(/\n\s*\n/).map((p) => p.replace(/\s*\n\s*/g, ' ').trim()).filter(Boolean);
  let title = paragraphs[0] || '';
  let rest = paragraphs.slice(1);
  if (title.length > 90) {
    const m = title.match(/^(.{20,90}?[.?!])\s+(.+)$/);
    if (m) { title = m[1]; rest = [m[2], ...rest]; }
    else { title = cut(title, 90); }
  }
  const summary = cut(rest.join(' ').trim(), 280);
  return { day, title, summary };
}

export function guessType(text) {
  return /KASSO|cliente|pago|cobr|conversaci|emplead|\bbot\b/i.test(text) ? 'business' : 'build-in-public';
}

/* ---------- challenge.yml text editing (keeps comments) ---------- */

const q = (s) => JSON.stringify(String(s)); // JSON strings are valid YAML double-quoted scalars

export function existingCodes(yml) {
  return new Set([...yml.matchAll(/instagram\.com\/(?:reel|p)\/([\w-]+)/g)].map((m) => m[1]));
}

export function startDateOf(yml) {
  const m = yml.match(/^\s*start_date:\s*(\d{4}-\d{2}-\d{2})/m);
  if (!m) throw new Error('start_date not found in challenge.yml');
  return m[1];
}

export function formatEntry({ day, type, title, summary, thumbnail, url }) {
  return [
    `  - day: ${day}`,
    `    type: ${q(type)}`,
    `    title: { es: ${q(title)} }`,
    `    summary: { es: ${q(summary || '')} }`,
    `    milestone: false`,
    `    thumbnail: ${q(thumbnail || '')}`,
    `    instagram_url: ${q(url)}`,
  ].join('\n');
}

function daysBlock(lines) {
  const start = lines.findIndex((l) => /^days:\s*$/.test(l));
  if (start < 0) throw new Error('days: block not found in challenge.yml');
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^\S/.test(lines[i])) { end = i; break; } // next top-level comment/key
  }
  return { start, end };
}

/** Inserts an entry keeping the list newest-first (day desc; same day: new entry goes first). */
export function insertDay(yml, entryText, day) {
  const lines = yml.split('\n');
  const { start, end } = daysBlock(lines);
  let at = end; // default: end of block (before trailing blank lines)
  while (at > start + 1 && lines[at - 1].trim() === '') at--;
  for (let i = start + 1; i < end; i++) {
    const m = lines[i].match(/^  - day:\s*(\d+)/);
    if (m && Number(m[1]) <= day) { at = i; break; }
  }
  lines.splice(at, 0, ...entryText.split('\n'));
  return lines.join('\n');
}

/* ---------- numbers ---------- */

function parseCsvLine(line) {
  const out = []; let cur = ''; let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQ) {
      if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') inQ = false;
      else cur += c;
    } else if (c === '"') inQ = true;
    else if (c === ',') { out.push(cur); cur = ''; }
    else cur += c;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

const ALIASES = {
  total_generated: ['total_generated', 'total generado', 'total', 'total generated'],
  monthly_income: ['monthly_income', 'ingreso mensual', 'monthly income', 'mensual'],
};

export function toNumber(raw) {
  const s = String(raw).replace(/[^\d.,-]/g, '').replace(/,/g, '');
  if (s === '' || s === '-' || s === '.') return NaN;
  return Number(s);
}

/** "key,value" rows (extra columns/rows ignored) -> { total_generated, monthly_income } */
export function parseNumbersCsv(csv) {
  const found = {};
  for (const line of String(csv).split(/\r?\n/)) {
    if (!line.trim()) continue;
    const [k, v] = parseCsvLine(line);
    const key = (k || '').toLowerCase();
    for (const [field, names] of Object.entries(ALIASES)) {
      if (names.includes(key)) found[field] = toNumber(v);
    }
  }
  for (const f of Object.keys(ALIASES)) {
    if (!Number.isFinite(found[f]) || found[f] < 0) {
      throw new Error(`numbers CSV: missing or invalid "${f}" (got ${found[f]})`);
    }
  }
  return found;
}

export function readNumbers(yml) {
  const get = (k) => {
    const m = yml.match(new RegExp(`^\\s*${k}:\\s*(-?[\\d.]+)`, 'm'));
    return m ? Number(m[1]) : NaN;
  };
  return { total_generated: get('total_generated'), monthly_income: get('monthly_income') };
}

/** Updates the two numbers (keeps trailing comments) and the income history. */
export function applyNumbers(yml, next, today) {
  const cur = readNumbers(yml);
  let out = yml;
  const changed = [];
  for (const k of ['total_generated', 'monthly_income']) {
    if (cur[k] !== next[k]) {
      out = out.replace(new RegExp(`^(\\s*${k}:\\s*)-?[\\d.]+`, 'm'), `$1${next[k]}`);
      changed.push(`${k}: ${cur[k]} -> ${next[k]}`);
    }
  }
  if (cur.monthly_income !== next.monthly_income) {
    out = upsertHistory(out, today, next.monthly_income);
  }
  return { yml: out, changed };
}

/** Appends to income_history as a step: carry the previous value to the day before, then the new value. */
export function upsertHistory(yml, day, value) {
  const lines = yml.split('\n');
  const start = lines.findIndex((l) => /^income_history:\s*$/.test(l));
  if (start < 0) throw new Error('income_history: block not found');
  let last = -1;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^\s+-\s*\{\s*day:/.test(lines[i])) last = i;
    else if (/^\S/.test(lines[i])) break;
  }
  if (last < 0) throw new Error('income_history has no entries');
  const m = lines[last].match(/day:\s*(\d+),\s*monthly_income:\s*(-?[\d.]+)/);
  const lastDay = Number(m[1]); const lastVal = Number(m[2]);
  if (lastVal === value) return yml;
  const add = [];
  if (lastDay === day) {
    lines.splice(last, 1, `  - { day: ${day}, monthly_income: ${value} }`);
    return lines.join('\n');
  }
  if (lastDay < day - 1) add.push(`  - { day: ${day - 1}, monthly_income: ${lastVal} }`);
  add.push(`  - { day: ${day}, monthly_income: ${value} }`);
  lines.splice(last + 1, 0, ...add);
  return lines.join('\n');
}
