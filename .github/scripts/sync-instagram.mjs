// Adds new Instagram Reels as episodes in _data/challenge.yml (no AI, official API only).
//
// Env:
//   IG_TOKEN            long-lived Instagram API token (skip everything if missing)
//   IG_REFRESH=1        also refresh the token and write the new one to IG_NEW_TOKEN_FILE
//   IG_FIXTURE          path to a JSON response (tests / dry runs, no network)
//   IG_SKIP_THUMBS=1    don't download cover images
//   CHALLENGE_YML       path (default _data/challenge.yml)
//   IMAGES_DIR          path (default assets/images/challenge)
import { readFileSync, writeFileSync, mkdirSync, appendFileSync, existsSync, unlinkSync, renameSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { existingCodes, startDateOf, dayFromDate, parseCaption, guessType, formatEntry, insertDay, reelCode, reelUrl } from './lib.mjs';

const YML = process.env.CHALLENGE_YML || '_data/challenge.yml';
const IMAGES = process.env.IMAGES_DIR || 'assets/images/challenge';
const API = 'https://graph.instagram.com';
const FIELDS = 'id,caption,media_type,media_product_type,permalink,thumbnail_url,timestamp';

const token = process.env.IG_TOKEN;
const fixture = process.env.IG_FIXTURE;
if (!token && !fixture) {
  console.log('IG_TOKEN not set: skipping Instagram sync.');
  process.exit(0);
}

async function api(url) {
  const res = await fetch(url);
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.error) {
    const msg = body.error?.message || `HTTP ${res.status}`;
    throw new Error(`Instagram API error: ${msg}. If the token expired, generate a new one and update the IG_TOKEN secret.`);
  }
  return body;
}

async function fetchMedia() {
  if (fixture) return JSON.parse(readFileSync(fixture, 'utf8')).data;
  let url = `${API}/me/media?fields=${FIELDS}&limit=50&access_token=${encodeURIComponent(token)}`;
  const all = [];
  for (let page = 0; page < 3 && url; page++) {
    const body = await api(url);
    all.push(...(body.data || []));
    url = body.paging?.next || null;
  }
  return all;
}

async function saveThumbnail(url, code) {
  if (process.env.IG_SKIP_THUMBS === '1' || !url) return '';
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    mkdirSync(IMAGES, { recursive: true });
    const raw = join(IMAGES, `${code}.raw`);
    const out = join(IMAGES, `${code}.jpg`);
    writeFileSync(raw, Buffer.from(await res.arrayBuffer()));
    try {
      execFileSync('convert', [raw, '-resize', '240x', '-quality', '68', out], { stdio: 'ignore' });
      unlinkSync(raw);
    } catch { renameSync(raw, out); } // no ImageMagick: keep the original size
    return `/${IMAGES.replace(/^\.?\//, '')}/${code}.jpg`;
  } catch (e) {
    console.warn(`thumbnail for ${code} failed (${e.message}); using placeholder`);
    return '';
  }
}

let yml = readFileSync(YML, 'utf8');
const start = startDateOf(yml);
const startMs = Date.parse(`${start}T00:00:00-04:00`);
const have = existingCodes(yml);

const media = (await fetchMedia())
  .filter((m) => (m.media_product_type === 'REELS' || m.media_type === 'VIDEO') && Date.parse(m.timestamp) >= startMs)
  .sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));

const added = [];
for (const m of media) {
  const code = reelCode(m.permalink);
  if (!code || have.has(code)) continue;
  const { day: capDay, title, summary } = parseCaption(m.caption);
  const day = capDay ?? dayFromDate(m.timestamp, start);
  const thumbnail = await saveThumbnail(m.thumbnail_url, code);
  const entry = formatEntry({
    day, type: guessType(`${title} ${summary}`), title: title || `Día ${day}`, summary, thumbnail, url: reelUrl(code),
  });
  yml = insertDay(yml, entry, day);
  have.add(code);
  added.push(`Día ${day}: ${title || '(sin texto)'}`);
}

if (added.length) {
  writeFileSync(YML, yml);
  console.log(`Added ${added.length} episode(s):\n- ${added.join('\n- ')}`);
} else {
  console.log('No new Reels.');
}

if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `ig_added=${added.length}\n`);

// Token refresh (long-lived tokens last 60 days; refreshing extends them).
if (process.env.IG_REFRESH === '1' && token && !fixture) {
  const body = await api(`${API}/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(token)}`);
  if (body.access_token && process.env.IG_NEW_TOKEN_FILE) {
    console.log(`::add-mask::${body.access_token}`);
    writeFileSync(process.env.IG_NEW_TOKEN_FILE, body.access_token);
    console.log(`Token refreshed (valid ~${Math.round((body.expires_in || 0) / 86400)} days).`);
  }
}
